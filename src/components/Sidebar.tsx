import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Clock, 
  FileText, 
  Kanban, 
  Mail, 
  ShieldCheck, 
  Sparkles,
  Terminal,
  Trash2,
  Calendar,
  Check
} from 'lucide-react';
import type { McpServer, SavedChatSession } from '../types';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onNewChat: () => void;
  servers: McpServer[];
  cliVersion: string;
  isBackendConnected: boolean;
  sessions: SavedChatSession[];
  activeSessionId: string | null;
  onSelectSession: (session: SavedChatSession) => void;
  onDeleteSession: (id: string) => void;
  onDeleteOldSessions: (days: number) => number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onNewChat,
  servers,
  cliVersion,
  isBackendConnected,
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onDeleteOldSessions
}) => {
  const [purgeFeedback, setPurgeFeedback] = useState<string | null>(null);

  const handlePurgeOldChats = () => {
    const deletedCount = onDeleteOldSessions(3);
    if (deletedCount > 0) {
      setPurgeFeedback(`Purged ${deletedCount} chat${deletedCount > 1 ? 's' : ''}`);
    } else {
      setPurgeFeedback('No chats > 3 days old');
    }
    setTimeout(() => setPurgeFeedback(null), 3000);
  };

  const formatRelativeTime = (timestamp: number) => {
    const diffMs = Date.now() - timestamp;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <aside className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Workspace Switcher / Identity */}
      <div style={{
        padding: '14px 14px 12px 14px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            flexShrink: 0
          }}>
            <Sparkles size={15} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ 
              fontSize: '0.82rem', 
              fontWeight: 600, 
              color: 'var(--text-main)', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis' 
            }}>
              Executive Workspace
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: isBackendConnected ? '#10b981' : '#ef4444',
                display: 'inline-block'
              }} />
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                {isBackendConnected ? 'Active • Sandbox' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* New Conversation Button */}
      <div style={{ padding: '12px 12px 6px 12px' }}>
        <button
          onClick={onNewChat}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            borderRadius: '9px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-main)',
            fontSize: '0.8rem',
            fontWeight: 500
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'var(--border-medium)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={15} color="var(--accent-cyan)" />
            <span>New Session</span>
          </div>
          <span className="kbd-hint">⌘N</span>
        </button>
      </div>

      {/* Scrollable Center Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Real Saved Chat History (if any) */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 8px 6px 8px'
          }}>
            <span style={{
              fontSize: '0.66rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              Chat History ({sessions.length})
            </span>
          </div>

          {sessions.length === 0 ? (
            <div style={{
              padding: '12px 8px',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '8px',
              border: '1px dashed rgba(255, 255, 255, 0.05)'
            }}>
              No saved chat history
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {sessions.map((session) => {
                const isActive = session.id === activeSessionId;
                return (
                  <div
                    key={session.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 8px',
                      borderRadius: '7px',
                      background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                      border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'transparent';
                    }}
                    onClick={() => onSelectSession(session)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                      <MessageSquare size={13} style={{ flexShrink: 0, color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)' }} />
                      <span style={{ 
                        fontSize: '0.78rem',
                        color: isActive ? '#ffffff' : 'var(--text-secondary)',
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis' 
                      }}>
                        {session.title}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>
                        {formatRelativeTime(session.updatedAt)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        title="Delete this chat"
                        style={{
                          padding: '3px',
                          borderRadius: '4px',
                          color: 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#ef4444';
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-muted)';
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* History Retention & Cleanup Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <Calendar size={12} color="var(--accent-cyan)" />
              <span>Retention Management</span>
            </span>
            {purgeFeedback && (
              <span style={{
                fontSize: '0.62rem',
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.12)',
                padding: '1px 5px',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                <Check size={10} />
                {purgeFeedback}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handlePurgeOldChats}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: '7px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#f87171',
              fontSize: '0.72rem',
              fontWeight: 500
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.16)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)';
            }}
            title="Purge all chats that were updated more than 3 days ago"
          >
            <Trash2 size={12} />
            <span>Delete chats &gt; 3 days old</span>
          </button>
        </div>

        {/* Connected Services Monitor */}
        <div>
          <div style={{
            fontSize: '0.66rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '4px 8px 6px 8px'
          }}>
            Active MCP Integrations ({servers.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { name: 'Clockify MCP', icon: <Clock size={13} color="var(--accent-cyan)" />, desc: 'Timer & Reports' },
              { name: 'Zoho Books', icon: <FileText size={13} color="var(--accent-emerald)" />, desc: 'Invoices & Ledger' },
              { name: 'Trello Board', icon: <Kanban size={13} color="var(--accent-blue)" />, desc: 'Sprints & Cards' },
              { name: 'Executive Mail', icon: <Mail size={13} color="var(--accent-pink)" />, desc: 'Client Dispatch' }
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 9px',
                  borderRadius: '6px',
                  fontSize: '0.74rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.icon}
                  <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{item.name}</span>
                </div>
                <span style={{
                  fontSize: '0.64rem',
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '1px 5px',
                  borderRadius: '4px'
                }}>
                  Ready
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Telemetry Footer */}
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Terminal size={12} color="var(--text-muted)" />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Antigravity CLI</span>
          </div>
          <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
            v{cliVersion}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={12} color="#10b981" />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Security</span>
          </div>
          <span style={{ fontSize: '0.68rem', color: '#10b981' }}>
            Sandbox Policy
          </span>
        </div>
      </div>
    </aside>
  );
};

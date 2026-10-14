import React, { useState, useRef, useEffect } from 'react';
import { 
  PanelLeft, 
  ShieldCheck, 
  ChevronDown, 
  LayoutGrid, 
  Clock, 
  FileText, 
  Kanban, 
  Mail, 
  Cpu, 
  Zap,
  Radio
} from 'lucide-react';
import type { McpServer } from '../types';

interface HeaderProps {
  servers: McpServer[];
  cliVersion: string;
  isBackendConnected: boolean;
  isHubOpen: boolean;
  onToggleHub: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenQuickActions?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  servers, 
  isBackendConnected,
  isHubOpen,
  onToggleHub,
  isSidebarCollapsed,
  onToggleSidebar,
  onOpenQuickActions
}) => {
  const [showMcpMenu, setShowMcpMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMcpMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="top-nav-bar">
      {/* Left: Sidebar Toggle & Session Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onToggleSidebar}
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30px',
            height: '30px',
            borderRadius: '6px',
            color: 'var(--text-secondary)',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-main)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
          }}
        >
          <PanelLeft size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Workspace</span>
          <span style={{ color: 'var(--border-medium)' }}>/</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Active Assistant Session</span>
        </div>
      </div>

      {/* Center: Command Palette Trigger Cue */}
      <div 
        onClick={onOpenQuickActions}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 12px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          fontSize: '0.76rem',
          width: '240px',
          justifyContent: 'space-between'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={13} color="var(--accent-cyan)" />
          <span>Quick actions & tools...</span>
        </div>
        <span className="kbd-hint">⌘K</span>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Sandbox Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 8px',
          borderRadius: '6px',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          fontSize: '0.72rem',
          color: '#10b981',
          fontWeight: 500
        }}>
          <ShieldCheck size={13} />
          <span>Sandbox Protected</span>
        </div>

        {/* MCP Dropdown Trigger */}
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            onClick={() => setShowMcpMenu(!showMcpMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: '7px',
              background: showMcpMenu ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.74rem',
              color: 'var(--text-main)'
            }}
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              display: 'inline-block'
            }} />
            <span>{servers.length} MCPs</span>
            <ChevronDown size={13} color="var(--text-muted)" />
          </button>

          {showMcpMenu && (
            <div 
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: '300px',
                padding: '12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-medium)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 100
              }}
              className="animate-scale-in"
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Active MCP Servers</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Pre-authorized</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '220px', overflowY: 'auto' }}>
                {servers.map((s) => {
                  const isZoho = s.name.toLowerCase().includes('zoho');
                  const isClock = s.name.toLowerCase().includes('clock');
                  const isTrello = s.name.toLowerCase().includes('trello');
                  const isEmail = s.name.toLowerCase().includes('email');

                  return (
                    <div
                      key={s.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.04)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isClock && <Clock size={12} color="var(--accent-cyan)" />}
                        {isZoho && <FileText size={12} color="var(--accent-emerald)" />}
                        {isTrello && <Kanban size={12} color="var(--accent-blue)" />}
                        {isEmail && <Mail size={12} color="var(--accent-pink)" />}
                        {!isClock && !isZoho && !isTrello && !isEmail && <Cpu size={12} color="var(--accent-purple)" />}
                        <span style={{ fontSize: '0.74rem', fontWeight: 500 }}>{s.name}</span>
                      </div>
                      <span style={{
                        fontSize: '0.64rem',
                        color: '#10b981',
                        background: 'rgba(16, 185, 129, 0.1)',
                        padding: '1px 5px',
                        borderRadius: '4px'
                      }}>
                        Active
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Tools Hub Toggle */}
        <button
          onClick={onToggleHub}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '7px',
            background: isHubOpen ? 'rgba(99, 102, 241, 0.18)' : 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${isHubOpen ? 'rgba(99, 102, 241, 0.45)' : 'var(--border-subtle)'}`,
            fontSize: '0.74rem',
            fontWeight: 500,
            color: isHubOpen ? 'var(--accent-cyan)' : 'var(--text-main)'
          }}
        >
          <LayoutGrid size={13} />
          <span>Tools Panel</span>
        </button>

        {/* Daemon Connection Pulse */}
        <div 
          title={isBackendConnected ? "CLI Daemon Connected (Port 3001)" : "Backend Disconnected"}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: isBackendConnected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            border: `1px solid ${isBackendConnected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
          }}
        >
          <Radio size={12} color={isBackendConnected ? '#10b981' : '#ef4444'} />
        </div>
      </div>
    </header>
  );
};

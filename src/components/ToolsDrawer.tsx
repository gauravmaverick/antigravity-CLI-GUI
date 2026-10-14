import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  FileText, 
  Kanban, 
  Mail,
  Sliders
} from 'lucide-react';
import { ClockifyWidget } from './ClockifyWidget';
import { ZohoWidget } from './ZohoWidget';
import { TrelloWidget } from './TrelloWidget';
import { EmailWidget } from './EmailWidget';

interface ToolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerPrompt: (prompt: string) => void;
}

export const ToolsDrawer: React.FC<ToolsDrawerProps> = ({ 
  isOpen, 
  onClose, 
  onTriggerPrompt 
}) => {
  const [activeTab, setActiveTab] = useState<'time' | 'finance' | 'tasks' | 'email'>('time');

  if (!isOpen) return null;

  return (
    <aside className="tools-inspector">
      {/* Inspector Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={14} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Tools Inspector
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          title="Close Inspector"
        >
          <X size={15} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        padding: '8px 12px',
        gap: '4px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(0, 0, 0, 0.15)'
      }}>
        {[
          { id: 'time', label: 'Clockify', icon: <Clock size={12} />, color: 'var(--accent-cyan)' },
          { id: 'finance', label: 'Zoho', icon: <FileText size={12} />, color: 'var(--accent-emerald)' },
          { id: 'tasks', label: 'Trello', icon: <Kanban size={12} />, color: 'var(--accent-blue)' },
          { id: 'email', label: 'Email', icon: <Mail size={12} />, color: 'var(--accent-pink)' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '6px 4px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 600,
                background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: isActive ? tab.color : 'var(--text-muted)',
                border: isActive ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Focused Widget Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {activeTab === 'time' && (
          <ClockifyWidget onTriggerPrompt={onTriggerPrompt} />
        )}
        {activeTab === 'finance' && (
          <ZohoWidget onTriggerPrompt={onTriggerPrompt} />
        )}
        {activeTab === 'tasks' && (
          <TrelloWidget onTriggerPrompt={onTriggerPrompt} />
        )}
        {activeTab === 'email' && (
          <EmailWidget onTriggerPrompt={onTriggerPrompt} />
        )}
      </div>
    </aside>
  );
};

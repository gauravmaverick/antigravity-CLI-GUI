import React from 'react';
import { Kanban, CheckSquare, PlusCircle, RefreshCw } from 'lucide-react';

interface TrelloWidgetProps {
  onTriggerPrompt: (prompt: string) => void;
}

export const TrelloWidget: React.FC<TrelloWidgetProps> = ({ onTriggerPrompt }) => {
  return (
    <div className="glass-panel" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient background glow */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '100px',
        height: '100px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(59, 130, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-blue)'
          }}>
            <Kanban size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 600, margin: 0 }}>Trello Workspace</h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)' }}>Tasks & Boards</span>
          </div>
        </div>

        <button 
          onClick={() => onTriggerPrompt('Use trello MCP trelloReadInbox to retrieve my current inbox cards and boards')}
          title="Refresh Trello"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '6px',
            color: 'var(--text-secondary)'
          }}
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Quick Task Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => onTriggerPrompt('List all active cards on my main Trello board using trelloReadBoard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(7, 9, 14, 0.6)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '10px 12px',
            color: 'var(--text-main)',
            fontSize: '0.78rem',
            textAlign: 'left'
          }}
        >
          <CheckSquare size={16} color="var(--accent-blue)" />
          <div>
            <div style={{ fontWeight: 600 }}>Active Board Cards</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>View tasks due this week</div>
          </div>
        </button>

        <button
          onClick={() => onTriggerPrompt('Search for high priority tasks in Trello using trelloSearch with query "urgent"')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(7, 9, 14, 0.6)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '10px 12px',
            color: 'var(--text-main)',
            fontSize: '0.78rem',
            textAlign: 'left'
          }}
        >
          <PlusCircle size={16} color="var(--accent-purple)" />
          <div>
            <div style={{ fontWeight: 600 }}>Urgent Items</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Find urgent checklist items</div>
          </div>
        </button>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { 
  Clock, 
  FileText, 
  Kanban, 
  Mail, 
  Search, 
  ArrowRight, 
  CornerDownLeft,
  LayoutGrid,
  PanelLeft,
  Trash2,
  Sparkles
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (prompt: string) => void;
  onToggleSidebar?: () => void;
  onToggleHub?: () => void;
  onClearThread?: () => void;
  onDeleteOldSessions?: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  category: string;
  icon: React.ReactNode;
  prompt?: string;
  action?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectAction,
  onToggleSidebar,
  onToggleHub,
  onClearThread,
  onDeleteOldSessions
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);

  const commandItems: CommandItem[] = [
    // Clockify
    {
      id: 'clock-status',
      label: 'Clockify: Check Current Timer & Today\'s Hours',
      category: 'Time & Productivity',
      icon: <Clock size={15} color="var(--accent-cyan)" />,
      prompt: 'Use clockify-mcp to get my current timer status and today\'s tracked hours.'
    },
    {
      id: 'clock-start-1h',
      label: 'Clockify: Start 1h Timer for "Project Development"',
      category: 'Time & Productivity',
      icon: <Clock size={15} color="var(--accent-cyan)" />,
      prompt: 'Start a Clockify timer for "Project Development" using clockify-mcp.'
    },
    {
      id: 'clock-report',
      label: 'Clockify: Show Weekly Summary Timesheet',
      category: 'Time & Productivity',
      icon: <Clock size={15} color="var(--accent-cyan)" />,
      prompt: 'Show me my Clockify summary report for this week.'
    },

    // Zoho Books
    {
      id: 'zoho-overdue',
      label: 'Zoho Books: Audit Overdue Customer Invoices',
      category: 'Finance & Invoicing',
      icon: <FileText size={15} color="var(--accent-emerald)" />,
      prompt: 'List all unpaid or overdue customer invoices from zoho-books and show their total amount.'
    },
    {
      id: 'zoho-mtd-expenses',
      label: 'Zoho Books: Month-to-Date Expense Breakdown',
      category: 'Finance & Invoicing',
      icon: <FileText size={15} color="var(--accent-emerald)" />,
      prompt: 'Summarize my Zoho Books expenses and bills for the current month.'
    },
    {
      id: 'zoho-recent-invoices',
      label: 'Zoho Books: List 5 Most Recent Invoices',
      category: 'Finance & Invoicing',
      icon: <FileText size={15} color="var(--accent-emerald)" />,
      prompt: 'Query zoho-books ZohoBooks_list_invoices and show the 5 most recent invoices.'
    },

    // Trello
    {
      id: 'trello-due',
      label: 'Trello: List Active Cards Due This Week',
      category: 'Sprint & Tasks',
      icon: <Kanban size={15} color="var(--accent-blue)" />,
      prompt: 'List active cards on my main Trello board due this week using trelloReadBoard.'
    },
    {
      id: 'trello-search-urgent',
      label: 'Trello: Search Urgent Priority Tasks',
      category: 'Sprint & Tasks',
      icon: <Kanban size={15} color="var(--accent-blue)" />,
      prompt: 'Search for high priority tasks in Trello with query "urgent".'
    },

    // Email
    {
      id: 'email-client-checkin',
      label: 'Email: Draft Professional Client Check-in',
      category: 'Executive Outreach',
      icon: <Mail size={15} color="var(--accent-pink)" />,
      prompt: 'Draft a quick professional check-in email to a client and show it for my approval using the email tool.'
    },

    // System Workspace Actions
    {
      id: 'sys-toggle-hub',
      label: 'Workspace: Toggle Tools Inspector Panel',
      category: 'System Shortcuts',
      icon: <LayoutGrid size={15} color="var(--accent-purple)" />,
      action: onToggleHub
    },
    {
      id: 'sys-toggle-sidebar',
      label: 'Workspace: Toggle Sidebar Navigation (⌘B)',
      category: 'System Shortcuts',
      icon: <PanelLeft size={15} color="var(--accent-purple)" />,
      action: onToggleSidebar
    },
    {
      id: 'sys-clear-chat',
      label: 'Workspace: Clear Current Conversation Thread',
      category: 'System Shortcuts',
      icon: <Trash2 size={15} color="var(--accent-amber)" />,
      action: onClearThread
    },
    {
      id: 'sys-purge-old-chats',
      label: 'Workspace: Delete chats older than 3 days',
      category: 'System Shortcuts',
      icon: <Trash2 size={15} color="var(--accent-red)" />,
      action: onDeleteOldSessions
    }
  ];

  const filteredItems = commandItems.filter(item => 
    !searchQuery ||
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => searchInputRef.current?.focus(), 40);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const executeItem = (item: CommandItem) => {
    onClose();
    if (item.action) {
      item.action();
    } else if (item.prompt) {
      onSelectAction(item.prompt);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        executeItem(filteredItems[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(7, 9, 14, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        zIndex: 2000
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="animate-scale-in"
        style={{
          width: '100%',
          maxWidth: '640px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-dock)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Command Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <Search size={18} color="var(--accent-cyan)" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search actions..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="kbd-hint">ESC</span>
          </div>
        </div>

        {/* Command Results List */}
        <div 
          ref={itemsContainerRef}
          style={{
            maxHeight: '380px',
            overflowY: 'auto',
            padding: '10px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px'
          }}
        >
          {filteredItems.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
              No commands or actions found matching "{searchQuery}"
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    border: isSelected ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid transparent',
                    color: 'var(--text-main)',
                    textAlign: 'left',
                    width: '100%'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div style={{
                      padding: '6px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.88rem',
                        fontWeight: 500,
                        color: isSelected ? '#ffffff' : 'var(--text-main)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {item.category}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {isSelected && (
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.72rem',
                        color: 'var(--text-secondary)'
                      }}>
                        <span>Run</span>
                        <CornerDownLeft size={12} />
                      </span>
                    )}
                    <ArrowRight size={14} color="var(--text-muted)" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer with Keyboard Hints */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 18px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.25)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span><strong style={{ color: 'var(--text-secondary)' }}>↑↓</strong> Navigate</span>
            <span>•</span>
            <span><strong style={{ color: 'var(--text-secondary)' }}>↵</strong> Select</span>
            <span>•</span>
            <span><strong style={{ color: 'var(--text-secondary)' }}>ESC</strong> Close</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={12} color="var(--accent-cyan)" />
            <span>Antigravity Executive Commands</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { FileText, ArrowUpRight, AlertCircle, RefreshCw } from 'lucide-react';

interface ZohoWidgetProps {
  onTriggerPrompt: (prompt: string) => void;
}

export const ZohoWidget: React.FC<ZohoWidgetProps> = ({ onTriggerPrompt }) => {
  return (
    <div className="glass-panel" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient background glow */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '100px',
        height: '100px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-emerald)'
          }}>
            <FileText size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 600, margin: 0 }}>Zoho Books</h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)' }}>Financial Overview</span>
          </div>
        </div>

        <button 
          onClick={() => onTriggerPrompt('Query zoho-books ZohoBooks_list_invoices and list the 5 most recent invoices with customer name, amount, and status')}
          title="Refresh Zoho Invoices"
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

      {/* Financial Snapshot Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        marginBottom: '14px'
      }}>
        <div style={{
          background: 'rgba(7, 9, 14, 0.7)',
          padding: '10px 12px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Receivables</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
            ₹1,45,200
          </div>
        </div>
        <div style={{
          background: 'rgba(7, 9, 14, 0.7)',
          padding: '10px 12px',
          borderRadius: '10px',
          border: '1px solid rgba(245, 158, 11, 0.25)'
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={10} /> Overdue
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-amber)', marginTop: '2px' }}>
            ₹32,500
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button
          onClick={() => onTriggerPrompt('List all overdue customer invoices from zoho-books and show their contact details')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '0.75rem',
            color: 'var(--text-main)',
            textAlign: 'left'
          }}
        >
          <span>Check Overdue Invoices</span>
          <ArrowUpRight size={14} color="var(--accent-emerald)" />
        </button>

        <button
          onClick={() => onTriggerPrompt('Use ZohoMCP to summarize expenses for the current month')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '0.75rem',
            color: 'var(--text-main)',
            textAlign: 'left'
          }}
        >
          <span>Month-to-Date Expenses</span>
          <ArrowUpRight size={14} color="var(--accent-emerald)" />
        </button>
      </div>
    </div>
  );
};

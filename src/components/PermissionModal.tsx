import React from 'react';
import { 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  FileEdit, 
  Terminal, 
  Mail, 
  FileText, 
  Kanban,
  Clock
} from 'lucide-react';

export interface PermissionRequest {
  id: string;
  action: string;
  displayName: string;
  category?: string;
  target?: string;
  details?: Record<string, string>;
  prompt: string;
}

interface PermissionModalProps {
  request: PermissionRequest | null;
  onApprove: (request: PermissionRequest) => void;
  onDeny: (request: PermissionRequest) => void;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  request,
  onApprove,
  onDeny
}) => {
  if (!request) return null;

  const isCommand = request.category === 'command' || request.action.includes('command') || request.action.includes('run');
  const isFile = request.category === 'file' || request.action.includes('file') || request.action.includes('write');
  const isEmail = request.category === 'email' || request.action.includes('email') || request.action.includes('mail');
  const isZoho = request.category === 'finance' || request.action.toLowerCase().includes('zoho');
  const isTrello = request.category === 'tasks' || request.action.toLowerCase().includes('trello') || (request.details && request.details['Service'] === 'Trello');
  const isClockify = request.category === 'time' || request.action.toLowerCase().includes('clockify') || (request.details && request.details['Service'] === 'Clockify');
  const isComment = (request.displayName && request.displayName.toLowerCase().includes('comment')) || (request.details && request.details['Operation'] && request.details['Operation'].toLowerCase().includes('comment'));

  // Human-friendly title
  const getModalTitle = () => {
    if (isComment) return 'Post Trello Comment Authorization';
    if (isEmail) return 'Email Dispatch Authorization';
    if (isZoho) return 'Zoho Books Action Authorization';
    if (isTrello) {
      if (request.displayName?.toLowerCase().includes('create new card')) return 'Create Trello Card Authorization';
      if (request.displayName?.toLowerCase().includes('move')) return 'Move Trello Card Authorization';
      return 'Trello Action Authorization';
    }
    if (isCommand) return 'System Command Authorization';
    if (isFile) return 'File Modification Authorization';
    if (isClockify) return 'Clockify Action Authorization';
    return 'Action Authorization Required';
  };

  const getApproveLabel = () => {
    if (isComment) return 'Authorize & Post Comment';
    if (isEmail) return 'Authorize & Send Email';
    if (isCommand) return 'Authorize & Run Command';
    if (isFile) return 'Authorize & Save File';
    if (isZoho) return 'Authorize Zoho Action';
    if (isTrello) {
      if (request.displayName?.toLowerCase().includes('create')) return 'Authorize & Create Card';
      if (request.displayName?.toLowerCase().includes('move')) return 'Authorize & Move Card';
      return 'Authorize Trello Action';
    }
    if (isClockify) return 'Authorize Clockify Action';
    return 'Approve & Execute';
  };

  const detailEntries = Object.entries(request.details || {});

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(7, 9, 14, 0.82)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div 
        className="glass-panel animate-scale-in"
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'rgba(15, 23, 42, 0.98)',
          border: '1px solid rgba(245, 158, 11, 0.45)',
          boxShadow: '0 24px 50px -12px rgba(0, 0, 0, 0.85), 0 0 35px rgba(245, 158, 11, 0.2)',
          padding: '24px 26px',
          borderRadius: '20px',
          position: 'relative'
        }}
      >
        {/* Header with Warning Shield */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-amber)',
            flexShrink: 0
          }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
              {getModalTitle()}
            </h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Sandbox Protection Policy • Zero-Trust Mode
            </span>
          </div>
        </div>

        {/* Action Details Card */}
        <div style={{
          background: 'rgba(7, 9, 14, 0.75)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '16px 18px',
          marginBottom: '18px'
        }}>
          {/* Main Action Banner */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            marginBottom: detailEntries.length > 0 ? '14px' : '8px',
            paddingBottom: detailEntries.length > 0 ? '12px' : '0',
            borderBottom: detailEntries.length > 0 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none'
          }}>
            {isCommand && <Terminal size={18} color="var(--accent-amber)" />}
            {isFile && <FileEdit size={18} color="var(--accent-cyan)" />}
            {isEmail && <Mail size={18} color="var(--accent-pink)" />}
            {isZoho && <FileText size={18} color="var(--accent-emerald)" />}
            {isTrello && <Kanban size={18} color="var(--accent-blue)" />}
            {isClockify && <Clock size={18} color="var(--accent-cyan)" />}
            {!isCommand && !isFile && !isEmail && !isZoho && !isTrello && !isClockify && (
              <FileEdit size={18} color="var(--accent-purple)" />
            )}
            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {request.displayName || request.action}
            </span>
          </div>

          {/* Key-Value Breakdown */}
          {detailEntries.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
              {detailEntries.map(([key, val]) => (
                <div 
                  key={key} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    justifyContent: 'space-between', 
                    fontSize: '0.78rem',
                    gap: '12px'
                  }}
                >
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500, minWidth: '80px' }}>
                    {key}:
                  </span>
                  <span style={{ 
                    color: 'var(--text-main)', 
                    fontWeight: 600, 
                    textAlign: 'right',
                    wordBreak: 'break-word',
                    fontFamily: key === 'Command' || key === 'Path' ? 'monospace' : 'inherit'
                  }}>
                    {val}
                  </span>
                </div>
              ))}
            </div>
          ) : request.target ? (
            <div style={{
              fontSize: '0.76rem',
              color: 'var(--text-secondary)',
              fontFamily: 'monospace',
              wordBreak: 'break-all',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              {request.target}
            </div>
          ) : null}

          <div style={{
            marginTop: '12px',
            paddingTop: '10px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.72rem',
            color: 'var(--text-muted)'
          }}>
            <span>Requested via prompt:</span>
            <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              "{request.prompt.length > 60 ? `${request.prompt.slice(0, 60)}...` : request.prompt}"
            </span>
          </div>
        </div>

        {/* Security policy note */}
        <p style={{
          fontSize: '0.74rem',
          color: 'var(--text-muted)',
          margin: '0 0 20px 0',
          lineHeight: 1.45
        }}>
          In sandbox mode, read queries execute automatically. Outgoing operations and file writes require your explicit confirmation before dispatching.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={() => onDeny(request)}
            style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <XCircle size={16} />
            <span>Deny & Cancel</span>
          </button>

          <button
            type="button"
            onClick={() => onApprove(request)}
            style={{
              flex: 1.4,
              padding: '11px 18px',
              borderRadius: '12px',
              background: isEmail 
                ? 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: `1px solid ${isEmail ? 'rgba(236, 72, 153, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: isEmail 
                ? '0 0 24px rgba(236, 72, 153, 0.35)' 
                : '0 0 24px rgba(16, 185, 129, 0.35)'
            }}
          >
            <CheckCircle size={16} />
            <span>{getApproveLabel()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

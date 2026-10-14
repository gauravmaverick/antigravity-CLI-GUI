import React, { useState } from 'react';
import { 
  Mail, 
  Sparkles, 
  FileText, 
  Kanban, 
  Target, 
  AlignLeft
} from 'lucide-react';

interface EmailWidgetProps {
  onTriggerPrompt: (prompt: string) => void;
}

export const EmailWidget: React.FC<EmailWidgetProps> = ({ onTriggerPrompt }) => {
  const [recipient, setRecipient] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [intent, setIntent] = useState<'project' | 'invoice' | 'meeting' | 'general'>('project');
  const [topic, setTopic] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [tone, setTone] = useState<'direct' | 'collaborative' | 'firm'>('direct');
  
  // Tool data integrations
  const [includeZoho, setIncludeZoho] = useState(false);
  const [includeTrello, setIncludeTrello] = useState(true);

  const intentOptions = [
    { id: 'project', label: 'Project Status', defaultTopic: 'Sprint Progress & Deliverables' },
    { id: 'invoice', label: 'Billing / Invoice', defaultTopic: 'Invoice Status & Payment Reminder' },
    { id: 'meeting', label: 'Meeting Follow-up', defaultTopic: 'Action Items & Next Steps' },
    { id: 'general', label: 'General Outreach', defaultTopic: 'Executive Update' }
  ];

  const handleIntentSelect = (id: 'project' | 'invoice' | 'meeting' | 'general', defaultTopic: string) => {
    setIntent(id);
    if (!topic || intentOptions.some(opt => opt.defaultTopic === topic)) {
      setTopic(defaultTopic);
    }
    if (id === 'invoice') {
      setIncludeZoho(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic && !keyPoints) return;

    const intentLabel = intentOptions.find(o => o.id === intent)?.label || 'Executive Email';
    const toneDescription = tone === 'direct' 
      ? 'Executive, concise, and professional'
      : tone === 'collaborative'
        ? 'Friendly, collaborative, and appreciative'
        : 'Firm and urgent, emphasizing timely action';

    const promptLines = [
      `Draft a professional email using the configured email tool for executive dispatch.`,
      recipient ? `• Recipient Email: ${recipient}` : '',
      recipientName ? `• Recipient Name: ${recipientName}` : '',
      `• Primary Purpose: ${intentLabel}`,
      topic ? `• Subject / Topic: ${topic}` : '',
      keyPoints ? `• Key Context & Specific Points to Include:\n${keyPoints}` : '',
      `• Tone: ${toneDescription}`,
      includeZoho ? `• Cross-Tool Context: Check zoho-books (invoices, customer details, or amounts) for accurate real-time data.` : '',
      includeTrello ? `• Cross-Tool Context: Check active trello cards/lists to reference actual project deliverables.` : '',
      `• Quota Constraint: Do NOT call Clockify unless specifically required for timesheet hours. Avoid Clockify API consumption.`,
      `• Instruction: Generate a complete, polished draft (Subject, Headline, and Paragraphs) and display it clearly for my review and authorization before dispatching.`
    ].filter(Boolean).join('\n');

    onTriggerPrompt(promptLines);
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '14px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>
      {/* Widget Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '7px',
            background: 'rgba(236, 72, 153, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-pink)'
          }}>
            <Mail size={15} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.84rem', fontWeight: 600, margin: 0, color: 'var(--text-main)' }}>
              Executive Mailer
            </h3>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Context-Aware Dispatch
            </span>
          </div>
        </div>

        <span style={{
          fontSize: '0.64rem',
          padding: '2px 6px',
          borderRadius: '4px',
          background: 'rgba(236, 72, 153, 0.1)',
          color: 'var(--accent-pink)',
          fontWeight: 600
        }}>
          Active Dispatcher
        </span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Recipient Details Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              To (Email)
            </label>
            <input
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="client@company.com"
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '7px 10px',
                fontSize: '0.78rem',
                color: 'var(--text-main)',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Recipient Name
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Sarah"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '7px 10px',
                  fontSize: '0.78rem',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Intent Selector Buttons */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
            <Target size={11} />
            <span>Email Purpose</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
            {intentOptions.map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleIntentSelect(opt.id as any, opt.defaultTopic)}
                style={{
                  padding: '6px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  textAlign: 'left',
                  background: intent === opt.id ? 'rgba(236, 72, 153, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${intent === opt.id ? 'rgba(236, 72, 153, 0.4)' : 'var(--border-subtle)'}`,
                  color: intent === opt.id ? 'var(--text-main)' : 'var(--text-secondary)'
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subject / Topic */}
        <div>
          <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Subject / Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Project Delivery & Invoicing Review"
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '7px 10px',
              fontSize: '0.78rem',
              color: 'var(--text-main)',
              outline: 'none'
            }}
          />
        </div>

        {/* Specific Context & Key Bullet Points */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <AlignLeft size={11} />
            <span>Key Details & Context (Prevents Vagueness)</span>
          </label>
          <textarea
            value={keyPoints}
            onChange={(e) => setKeyPoints(e.target.value)}
            rows={3}
            placeholder="e.g. Completed Phase 2A static pages; attached wireframe links; invoice #102 due Friday; let me know if any questions before Monday's launch."
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '8px 10px',
              fontSize: '0.76rem',
              color: 'var(--text-main)',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              lineHeight: 1.45
            }}
          />
        </div>

        {/* Cross-Tool Data Enrichment */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          padding: '8px 10px',
          border: '1px solid rgba(255, 255, 255, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Cross-Tool Context Feeds
            </span>
            <span style={{ fontSize: '0.62rem', color: 'var(--accent-amber)' }}>
              Clockify excluded
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-main)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={includeZoho}
                onChange={(e) => setIncludeZoho(e.target.checked)}
                style={{ accentColor: 'var(--accent-emerald)' }}
              />
              <FileText size={12} color="var(--accent-emerald)" />
              <span>Zoho Books (Invoices)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-main)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={includeTrello}
                onChange={(e) => setIncludeTrello(e.target.checked)}
                style={{ accentColor: 'var(--accent-blue)' }}
              />
              <Kanban size={12} color="var(--accent-blue)" />
              <span>Trello (Cards & Tasks)</span>
            </label>
          </div>
        </div>

        {/* Tone Selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Tone</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              { id: 'direct', label: 'Executive' },
              { id: 'collaborative', label: 'Friendly' },
              { id: 'firm', label: 'Urgent' }
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTone(t.id as any)}
                style={{
                  padding: '3px 7px',
                  borderRadius: '5px',
                  fontSize: '0.67rem',
                  fontWeight: 500,
                  background: tone === t.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  border: `1px solid ${tone === t.id ? 'rgba(255, 255, 255, 0.15)' : 'transparent'}`,
                  color: tone === t.id ? 'var(--text-main)' : 'var(--text-muted)'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Draft AI Email Action */}
        <button
          type="submit"
          style={{
            background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
            borderRadius: '9px',
            padding: '9px 12px',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(236, 72, 153, 0.25)',
            marginTop: '2px'
          }}
        >
          <Sparkles size={14} />
          <span>Draft Contextual Email</span>
        </button>
      </form>
    </div>
  );
};

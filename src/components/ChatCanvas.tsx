import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  ChevronDown, 
  ChevronRight, 
  Cpu, 
  CheckCircle2, 
  Trash2,
  Clock,
  FileText,
  Kanban,
  Mail,
  Copy,
  Check,
  Zap,
  ArrowRight
} from 'lucide-react';
import type { Message } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatCanvasProps {
  messages: Message[];
  isStreaming: boolean;
  onSendMessage: (text: string) => void;
  onClearConversation: () => void;
  onOpenHub?: () => void;
  onOpenCommandPalette?: () => void;
}

export const ChatCanvas: React.FC<ChatCanvasProps> = ({
  messages,
  isStreaming,
  onSendMessage,
  onClearConversation,
  onOpenCommandPalette
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [expandedThoughts, setExpandedThoughts] = useState<{ [id: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Voice recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isStreaming) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleThought = (id: string) => {
    setExpandedThoughts((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const domainCards = [
    {
      title: 'Time & Focus',
      description: 'Check active timer & tracked hours today',
      prompt: 'Use clockify-mcp to check if I have a timer running and summarize today\'s tracked hours.',
      icon: <Clock size={16} color="var(--accent-cyan)" />
    },
    {
      title: 'Finance & Invoices',
      description: 'Summarize unpaid customer invoices',
      prompt: 'List all unpaid or overdue customer invoices in Zoho Books and summarize the total amount.',
      icon: <FileText size={16} color="var(--accent-emerald)" />
    },
    {
      title: 'Sprint Boards',
      description: 'Check urgent Trello tasks due this week',
      prompt: 'Check my Trello inbox and active board cards to tell me what is due today.',
      icon: <Kanban size={16} color="var(--accent-blue)" />
    },
    {
      title: 'Executive Outreach',
      description: 'Draft meeting follow-up confirmation email',
      prompt: 'Draft a quick professional follow-up email confirming our meeting for tomorrow using the email tool.',
      icon: <Mail size={16} color="var(--accent-pink)" />
    }
  ];

  return (
    <div className="conversation-area">
      {/* Messages Scroll Area */}
      <div className="messages-scroller">
        <div className="messages-inner-width">
          {messages.length === 0 ? (
            /* Production Empty State */
            <div style={{
              margin: 'auto',
              padding: '24px 0',
              maxWidth: '680px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              {/* Executive Greeting Header */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--accent-cyan)',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    Executive Workspace
                  </span>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  How can I coordinate your day?
                </h2>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Connected live to Clockify, Zoho Books, Trello, and corporate email. Safe reads execute automatically; sensitive writes prompt for authorization.
                </p>
              </div>

              {/* 4 Clean Domain Productivity Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '12px'
              }}>
                {domainCards.map((card, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(card.prompt)}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-card-hover)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--bg-card)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{
                      padding: '8px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {card.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '3px' }}>
                        {card.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {card.description}
                      </div>
                    </div>
                    <ArrowRight size={14} color="var(--text-muted)" style={{ marginTop: '4px' }} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Message Stream */
            messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isThoughtExpanded = expandedThoughts[msg.id] ?? false;

              return (
                <div
                  key={msg.id}
                  className={`message-row ${isUser ? 'message-row-user' : 'message-row-assistant'}`}
                >
                  {/* Assistant Avatar */}
                  {!isUser && (
                    <div className="message-avatar avatar-assistant">
                      <Bot size={17} />
                    </div>
                  )}

                  <div className="message-bubble-wrapper">
                    {/* Assistant Metadata Header */}
                    {!isUser && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '6px',
                        fontSize: '0.72rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Antigravity Assistant</span>
                          <span style={{
                            fontSize: '0.64rem',
                            color: 'var(--text-muted)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '1px 5px',
                            borderRadius: '4px'
                          }}>
                            Gemini 3.8 Flash
                          </span>
                        </div>
                        <span style={{ color: 'var(--text-muted)' }}>{msg.timestamp}</span>
                      </div>
                    )}

                    {/* Bubble Content Card */}
                    <div className={isUser ? 'user-bubble' : 'assistant-bubble'}>
                      {/* Collapsible Agent Reasoning */}
                      {!isUser && msg.thoughts && msg.thoughts.length > 0 && (
                        <div style={{
                          marginBottom: '12px',
                          background: 'rgba(0, 0, 0, 0.25)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          overflow: 'hidden'
                        }}>
                          <button
                            onClick={() => toggleThought(msg.id)}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 10px',
                              background: 'transparent',
                              color: 'var(--text-secondary)',
                              fontSize: '0.72rem',
                              textAlign: 'left'
                            }}
                          >
                            {isThoughtExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                            <Cpu size={12} color="var(--accent-purple)" />
                            <span>Agent Reasoning ({msg.thoughts.length} step{msg.thoughts.length > 1 ? 's' : ''})</span>
                          </button>

                          {isThoughtExpanded && (
                            <div style={{
                              padding: '8px 12px',
                              fontSize: '0.74rem',
                              color: 'var(--text-secondary)',
                              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                              fontFamily: 'var(--font-mono)',
                              whiteSpace: 'pre-wrap',
                              maxHeight: '160px',
                              overflowY: 'auto',
                              lineHeight: 1.5
                            }}>
                              {msg.thoughts.join('\n')}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Single Dynamic Activity Status Capsule */}
                      {!isUser && msg.activeAction && (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: msg.isStreaming 
                            ? 'rgba(56, 189, 248, 0.08)' 
                            : 'rgba(255, 255, 255, 0.04)',
                          border: `1px solid ${msg.isStreaming ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.08)'}`,
                          borderRadius: '8px',
                          padding: '4px 10px',
                          fontSize: '0.72rem',
                          color: msg.isStreaming ? 'var(--accent-cyan)' : 'var(--text-muted)',
                          marginBottom: '10px'
                        }}>
                          {msg.isStreaming ? (
                            <span style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: 'var(--accent-cyan)',
                              boxShadow: '0 0 8px var(--accent-cyan)',
                              display: 'inline-block'
                            }} />
                          ) : (
                            <CheckCircle2 size={12} color="#10b981" />
                          )}
                          <span style={{ fontWeight: 500 }}>{msg.activeAction.name}</span>
                          {msg.activeAction.apiQuotaNotice && (
                            <span style={{
                              marginLeft: '4px',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              background: 'rgba(245, 158, 11, 0.14)',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                              color: 'var(--accent-amber)',
                              fontSize: '0.67rem',
                              fontWeight: 600
                            }}>
                              ⚡ Consumes 1 API Request
                            </span>
                          )}
                        </div>
                      )}

                      {/* Text Content */}
                      <div>
                        {isUser ? (
                          <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                        ) : (
                          <div>
                            <MarkdownRenderer content={msg.text} />
                            {msg.isStreaming && <span className="typing-cursor" />}
                          </div>
                        )}
                      </div>

                      {/* Assistant Message Actions (Copy) */}
                      {!isUser && !msg.isStreaming && msg.text && (
                        <div style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          marginTop: '8px',
                          paddingTop: '6px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.04)'
                        }}>
                          <button
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.68rem',
                              color: 'var(--text-muted)',
                              padding: '2px 6px',
                              borderRadius: '4px'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check size={12} color="#10b981" />
                                <span style={{ color: '#10b981' }}>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className="message-avatar avatar-user">
                      <User size={16} />
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Modern Command Dock at Bottom */}
      <div className="command-dock-wrapper">
        <form className="command-dock-inner" onSubmit={handleSubmit}>
          {/* Top Row: Input field */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={onOpenCommandPalette}
              title="Quick Action Command Palette (⌘K)"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-cyan)';
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <Zap size={15} />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? 'Listening to voice...' : 'Ask Antigravity (or click ⚡ for actions)...'}
              disabled={isStreaming}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
                fontFamily: 'inherit'
              }}
            />

            {/* Voice Dictation */}
            <button
              type="button"
              onClick={toggleRecording}
              title={isRecording ? 'Stop Recording' : 'Voice Dictation'}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: isRecording ? 'rgba(239, 68, 68, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${isRecording ? 'rgba(239, 68, 68, 0.4)' : 'transparent'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isRecording ? '#ef4444' : 'var(--text-secondary)'
              }}
            >
              {isRecording ? <MicOff size={15} /> : <Mic size={15} />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isStreaming}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: !inputText.trim() || isStreaming
                  ? 'rgba(255, 255, 255, 0.04)'
                  : 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: !inputText.trim() || isStreaming ? 'var(--text-muted)' : '#ffffff'
              }}
            >
              <Send size={14} />
            </button>
          </div>

          {/* Bottom Row: Micro Status & Keyboard Shortcuts */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '4px',
            borderTop: '1px solid rgba(255, 255, 255, 0.04)',
            fontSize: '0.68rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Press <strong style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>↵ Enter</strong> to send</span>
              <span>•</span>
              <span><strong style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Shift + ↵</strong> for newline</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={onClearConversation}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--text-muted)',
                    fontSize: '0.68rem',
                    background: 'transparent',
                    border: 'none',
                    padding: '2px 4px'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <Trash2 size={11} />
                  <span>Clear Thread</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

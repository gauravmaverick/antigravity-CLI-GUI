import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '14px 0 8px 0', color: 'var(--text-main)' }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '12px 0 6px 0', color: 'var(--text-main)' }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '10px 0 4px 0', color: 'var(--accent-cyan)' }}>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p style={{ margin: '0 0 10px 0', lineHeight: 1.65 }}>
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul style={{ margin: '4px 0 12px 20px', padding: 0, lineHeight: 1.65 }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol style={{ margin: '4px 0 12px 20px', padding: 0, lineHeight: 1.65 }}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li style={{ marginBottom: '4px' }}>
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong style={{ fontWeight: 600, color: '#ffffff' }}>
              {children}
            </strong>
          ),
          code: ({ node, className, children, ...props }: any) => {
            const isInline = !className && typeof children === 'string' && !children.includes('\n');
            if (isInline) {
              return (
                <code
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: 'var(--accent-cyan)',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    fontSize: '0.84em',
                    fontFamily: 'monospace',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre
                style={{
                  background: 'rgba(7, 9, 14, 0.9)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  overflowX: 'auto',
                  margin: '10px 0',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  color: '#e2e8f0'
                }}
              >
                <code {...props}>{children}</code>
              </pre>
            );
          },
          blockquote: ({ children }) => (
            <blockquote
              style={{
                borderLeft: '3px solid var(--accent-cyan)',
                paddingLeft: '12px',
                margin: '8px 0 12px 0',
                color: 'var(--text-secondary)',
                fontStyle: 'italic'
              }}
            >
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div style={{ overflowX: 'auto', margin: '12px 0' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.82rem',
                  textAlign: 'left'
                }}
              >
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th
              style={{
                padding: '8px 12px',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'rgba(255, 255, 255, 0.05)',
                fontWeight: 600,
                color: 'var(--text-main)'
              }}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              style={{
                padding: '8px 12px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                color: 'var(--text-secondary)'
              }}
            >
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--accent-cyan)',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(6, 182, 212, 0.35)',
                transition: 'border-color 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = 'var(--accent-cyan)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = 'rgba(6, 182, 212, 0.35)')}
            >
              {children}
            </a>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

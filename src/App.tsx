import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ChatCanvas } from './components/ChatCanvas';
import { ToolsDrawer } from './components/ToolsDrawer';
import { CommandPalette } from './components/CommandPalette';
import { PermissionModal } from './components/PermissionModal';
import type { PermissionRequest } from './components/PermissionModal';
import type { Message, McpServer, SavedChatSession } from './types';

const API_BASE = 'http://localhost:3001';

export const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [servers, setServers] = useState<McpServer[]>([]);
  const [cliVersion, setCliVersion] = useState<string>('1.3.4');
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isHubOpen, setIsHubOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [pendingPermission, setPendingPermission] = useState<PermissionRequest | null>(null);

  // Persistent Chat Sessions
  const [sessions, setSessions] = useState<SavedChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('antigravity_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Fetch MCP servers & system status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/status`);
        if (res.ok) {
          const data = await res.json();
          setIsBackendConnected(true);
          if (data.cliVersion) setCliVersion(data.cliVersion);
        }
      } catch {
        setIsBackendConnected(false);
      }
    };

    const fetchServers = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/mcp/servers`);
        if (res.ok) {
          const data = await res.json();
          if (data.servers) setServers(data.servers);
        }
      } catch (err) {
        console.error('Failed to load MCP servers:', err);
      }
    };

    fetchStatus();
    fetchServers();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // Global Keyboard Shortcuts (⌘K for command palette, ⌘B for sidebar, ⌘N for new chat)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleClearConversation();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleSendMessage = async (text: string, confirmedWriteAction = false) => {
    if (!text.trim() || isStreaming) return;

    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `asst-${Date.now()}`;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Only append user message if not replaying an approval
    if (!confirmedWriteAction) {
      const newUserMsg: Message = {
        id: userMsgId,
        sender: 'user',
        text,
        timestamp: now
      };
      setMessages((prev) => [...prev, newUserMsg]);
    }

    const newAssistantMsg: Message = {
      id: assistantMsgId,
      sender: 'assistant',
      text: '',
      thoughts: [],
      toolCalls: [],
      timestamp: now,
      isStreaming: true
    };

    setMessages((prev) => [...prev, newAssistantMsg]);
    setIsStreaming(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          conversationId: conversationId || undefined,
          confirmedWriteAction
        })
      });

      if (!response.body) {
        throw new Error('No readable stream from server.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const rawEvent of events) {
          const lines = rawEvent.split('\n');
          let eventType = 'message';
          let eventData = '';

          for (const line of lines) {
            if (line.startsWith('event: ')) {
              eventType = line.slice(7).trim();
            } else if (line.startsWith('data: ')) {
              eventData = line.slice(6);
            }
          }

          if (!eventData) continue;

          try {
            const data = JSON.parse(eventData);

            if (eventType === 'init' && data.conversationId) {
              setConversationId(data.conversationId);
            } else if (eventType === 'status') {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMsgId && !msg.text
                    ? { ...msg, text: `⏳ ${data.message}` }
                    : msg
                )
              );
            } else if (eventType === 'text_delta') {
              setMessages((prev) =>
                prev.map((msg) => {
                  if (msg.id !== assistantMsgId) return msg;
                  const currentText = msg.text.startsWith('⏳') ? '' : msg.text;
                  return { ...msg, text: currentText + (data.text || '') };
                })
              );
            } else if (eventType === 'thought_delta') {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMsgId
                    ? { ...msg, thoughts: [...(msg.thoughts || []), data.thought] }
                    : msg
                )
              );
            } else if (eventType === 'activity') {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMsgId
                    ? {
                        ...msg,
                        activeAction: {
                          name: data.name,
                          category: data.category,
                          state: data.state,
                          apiQuotaNotice: data.apiQuotaNotice
                        }
                      }
                    : msg
                )
              );
            } else if (eventType === 'permission_required') {
              setPendingPermission({
                id: data.id || `perm-${Date.now()}`,
                action: data.action || 'write_operation',
                displayName: data.displayName || 'Write / Modify Action',
                category: data.category || 'security',
                target: data.target || '',
                details: data.details || {},
                prompt: text
              });
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMsgId
                    ? {
                        ...msg,
                        text: `🛡️ Write action requires authorization. Please confirm in the approval modal.`,
                        isStreaming: false
                      }
                    : msg
                )
              );
            } else if (eventType === 'error') {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMsgId
                    ? { ...msg, text: `⚠️ Error: ${data.message}`, isStreaming: false }
                    : msg
                )
              );
            } else if (eventType === 'stderr') {
              console.warn('[agy stderr]', data.text);
            } else if (eventType === 'result') {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMsgId
                    ? {
                        ...msg,
                        text: data.response 
                          ? data.response.trim() 
                          : (msg.text.startsWith('⏳') ? 'Completed.' : msg.text),
                        isStreaming: false,
                        activeAction: null
                      }
                    : msg
                )
              );
            }
          } catch {
            // Unparsed data fallback
          }
        }
      }
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                text: `Error connecting to Antigravity CLI daemon: ${err.message}. Please make sure the local server is running on port 3001.`,
                isStreaming: false
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantMsgId ? { ...msg, isStreaming: false } : msg))
      );
    }
  };

  const handleApprovePermission = (req: PermissionRequest) => {
    setPendingPermission(null);
    // Replay prompt with confirmedWriteAction = true
    handleSendMessage(req.prompt, true);
  };

  const handleDenyPermission = (req: PermissionRequest) => {
    setPendingPermission(null);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: `Action for "${req.displayName}" was cancelled by user.`,
        timestamp: now
      }
    ]);
  };

  // Sync active conversation to saved sessions in localStorage
  useEffect(() => {
    if (messages.length === 0) return;

    setSessions((prevSessions) => {
      const firstUserMsg = messages.find((m) => m.sender === 'user');
      const title = firstUserMsg 
        ? (firstUserMsg.text.length > 36 ? `${firstUserMsg.text.slice(0, 36)}...` : firstUserMsg.text)
        : 'Executive Session';

      let sessionId = activeSessionId;
      if (!sessionId) {
        sessionId = `sess_${Date.now()}`;
        setActiveSessionId(sessionId);
      }

      const existingIndex = prevSessions.findIndex((s) => s.id === sessionId);
      let updated: SavedChatSession[];

      if (existingIndex >= 0) {
        updated = [...prevSessions];
        updated[existingIndex] = {
          ...updated[existingIndex],
          title: prevSessions[existingIndex].title || title,
          updatedAt: Date.now(),
          messages
        };
      } else {
        const newSession: SavedChatSession = {
          id: sessionId,
          title,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messages
        };
        updated = [newSession, ...prevSessions];
      }

      try {
        localStorage.setItem('antigravity_sessions', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save sessions to localStorage:', e);
      }
      return updated;
    });
  }, [messages]);

  const handleSelectSession = (session: SavedChatSession) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
    setConversationId(null);
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem('antigravity_sessions', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (activeSessionId === id) {
      handleClearConversation();
    }
  };

  const handleDeleteOldSessions = (days = 3) => {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    let deletedCount = 0;
    setSessions((prev) => {
      const kept = prev.filter((s) => s.updatedAt >= cutoff);
      deletedCount = prev.length - kept.length;
      try {
        localStorage.setItem('antigravity_sessions', JSON.stringify(kept));
      } catch {}
      return kept;
    });

    if (activeSessionId && !sessions.some((s) => s.id === activeSessionId && s.updatedAt >= cutoff)) {
      handleClearConversation();
    }
    return deletedCount;
  };

  const handleClearConversation = () => {
    setMessages([]);
    setActiveSessionId(null);
    setConversationId(null);
  };

  return (
    <div className="app-layout">
      {/* Collapsible Left Rail / Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onNewChat={handleClearConversation}
        servers={servers}
        cliVersion={cliVersion}
        isBackendConnected={isBackendConnected}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onDeleteOldSessions={handleDeleteOldSessions}
      />

      {/* Main Viewport */}
      <div className="main-viewport">
        {/* Navigation Bar */}
        <Header 
          servers={servers} 
          cliVersion={cliVersion} 
          isBackendConnected={isBackendConnected}
          isHubOpen={isHubOpen}
          onToggleHub={() => setIsHubOpen(!isHubOpen)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onOpenQuickActions={() => setIsCommandPaletteOpen(true)}
        />

        {/* Central Workspace Body */}
        <div className="workspace-body">
          <ChatCanvas
            messages={messages}
            isStreaming={isStreaming}
            onSendMessage={(text) => handleSendMessage(text, false)}
            onClearConversation={handleClearConversation}
            onOpenHub={() => setIsHubOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />

          {/* Collapsible Tools Inspector Panel */}
          <ToolsDrawer
            isOpen={isHubOpen}
            onClose={() => setIsHubOpen(false)}
            onTriggerPrompt={(text) => handleSendMessage(text, false)}
          />
        </div>
      </div>

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectAction={(prompt) => handleSendMessage(prompt, false)}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onToggleHub={() => setIsHubOpen(!isHubOpen)}
        onClearThread={handleClearConversation}
        onDeleteOldSessions={() => handleDeleteOldSessions(3)}
      />

      {/* Zero-Trust Security Permission Modal */}
      <PermissionModal
        request={pendingPermission}
        onApprove={handleApprovePermission}
        onDeny={handleDenyPermission}
      />
    </div>
  );
};

export default App;

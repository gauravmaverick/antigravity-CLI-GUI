export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  thoughts?: string[];
  activeAction?: {
    name: string;
    category?: string;
    state?: string;
    apiQuotaNotice?: string;
  } | null;
  toolCalls?: Array<{
    name: string;
    args?: any;
    result?: any;
  }>;
  timestamp: string;
  isStreaming?: boolean;
}

export interface McpServer {
  name: string;
  type: string;
  status: string;
  commandOrUrl: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  prompt: string;
  mcpTag: string;
}

export interface SavedChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
}

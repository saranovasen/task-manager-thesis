export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  metadata?: {
    isError?: boolean;
    tokens?: number;
  };
};

export type AssistantRequest = {
  prompt: string;
  context?: {
    activeTasks?: number;
    activeProjects?: number;
    userId?: string;
  };
};

export type AssistantResponse = {
  message: string;
  confidence?: number;
  suggestions?: string[];
  effects?: {
    tasksChanged?: boolean;
  };
};

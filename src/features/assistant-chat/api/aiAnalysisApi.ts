import { httpRequest } from '../../../shared/api/httpClient';
import type { AssistantResponse } from '../model/types';

const AI_ENDPOINTS = {
  CHAT: '/ai/chat',
  ANALYZE_TASKS: '/ai/analyze-tasks',
  SUGGEST_PRIORITIES: '/ai/suggest-priorities',
} as const;

export const analyzeTasksWithAI = async (prompt: string, accessToken?: string): Promise<AssistantResponse> => {
  return httpRequest<AssistantResponse>(AI_ENDPOINTS.ANALYZE_TASKS, {
    method: 'POST',
    token: accessToken,
    body: { prompt },
  }) as Promise<AssistantResponse>;
};

export const suggestTaskPriorities = async (taskIds: string[], accessToken?: string): Promise<AssistantResponse> => {
  return httpRequest<AssistantResponse>(AI_ENDPOINTS.SUGGEST_PRIORITIES, {
    method: 'POST',
    token: accessToken,
    body: { taskIds },
  }) as Promise<AssistantResponse>;
};

export const chatWithAI = async (
  message: string,
  conversationHistory?: Array<{ role: string; content: string }>,
  accessToken?: string
): Promise<AssistantResponse> => {
  return httpRequest<AssistantResponse>(AI_ENDPOINTS.CHAT, {
    method: 'POST',
    token: accessToken,
    body: {
      message,
      history: conversationHistory,
    },
  }) as Promise<AssistantResponse>;
};

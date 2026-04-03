import type { AssistantRequest, AssistantResponse } from '../model/types';

const AI_API_URL = import.meta.env.VITE_AI_API_URL as string | undefined;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';
const AI_CHAT_FALLBACK_URL = `${API_BASE_URL}/ai/chat`;
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY as string | undefined;

export class AIRequestError extends Error {
  code: string;
  statusCode?: number;

  constructor(code: string, message: string, statusCode?: number) {
    super(message);
    this.name = 'AIRequestError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export const requestAssistantReply = async (
  request: AssistantRequest,
  accessToken?: string
): Promise<AssistantResponse> => {
  const targetUrl = AI_API_URL || AI_CHAT_FALLBACK_URL;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (AI_API_KEY) {
    headers['X-API-Key'] = AI_API_KEY;
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as { error?: string };
      throw new AIRequestError(
        'API_ERROR',
        errorData.error ?? `AI request failed with status ${response.status}`,
        response.status
      );
    }

    const data = (await response.json()) as AssistantResponse;
    return {
      message: data.message ?? 'Пустой ответ от AI.',
      confidence: data.confidence,
      suggestions: data.suggestions,
      effects: data.effects,
    };
  } catch (error) {
    if (error instanceof AIRequestError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new AIRequestError('NETWORK_ERROR', 'Ошибка сети. Проверьте подключение и URL API.');
    }

    throw new AIRequestError('UNKNOWN_ERROR', 'Неизвестная ошибка при запросе к AI.');
  }
};

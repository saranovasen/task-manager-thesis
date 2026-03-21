import type { AssistantRequest, AssistantResponse } from '../model/types';

const AI_API_URL = import.meta.env.VITE_AI_API_URL as string | undefined;
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY as string | undefined;

export class AIRequestError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AIRequestError';
  }
}

export const requestAssistantReply = async (
  request: AssistantRequest,
  accessToken?: string
): Promise<AssistantResponse> => {
  if (!AI_API_URL) {
    throw new AIRequestError('NO_API_URL', 'Укажите VITE_AI_API_URL для подключения AI.');
  }

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
    const response = await fetch(AI_API_URL, {
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

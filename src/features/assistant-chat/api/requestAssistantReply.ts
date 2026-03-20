const AI_API_URL = import.meta.env.VITE_AI_API_URL as string | undefined;

export const requestAssistantReply = async (prompt: string) => {
  if (!AI_API_URL) {
    return 'Укажите VITE_AI_API_URL, чтобы подключить реальный AI API.';
  }

  const response = await fetch(AI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error('AI request failed');
  }

  const data = (await response.json()) as { message?: string };
  return data.message ?? 'Пустой ответ от AI.';
};

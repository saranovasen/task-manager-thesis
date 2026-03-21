import { useCallback, useMemo, useState } from 'react';
import { requestAssistantReply, AIRequestError } from '../api/requestAssistantReply';
import { initialMessages } from './constants';
import type { ChatMessage, AssistantRequest } from './types';

type UseAssistantChatOptions = {
  accessToken?: string;
  context?: {
    activeTasks?: number;
    activeProjects?: number;
    userId?: string;
  };
};

export const useAssistantChat = (options: UseAssistantChatOptions = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [prompt, setPrompt] = useState('');
  const [isSending, setIsSending] = useState(false);

  const hasPrompt = useMemo(() => prompt.trim().length > 0, [prompt]);
  const canSend = useMemo(() => hasPrompt && !isSending, [hasPrompt, isSending]);

  const handleSend = useCallback(async () => {
    const nextPrompt = prompt.trim();
    if (!nextPrompt || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `${Date.now()}-u`,
      role: 'user',
      text: nextPrompt,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');
    setIsSending(true);

    try {
      const request: AssistantRequest = {
        prompt: nextPrompt,
        context: options.context,
      };

      const response = await requestAssistantReply(request, options.accessToken);

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-a`,
        role: 'assistant',
        text: response.message,
        timestamp: Date.now(),
        metadata: {
          tokens: response.confidence !== undefined ? Math.round(response.confidence * 100) : undefined,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      let errorText = 'Не удалось получить ответ от AI. Проверьте API и попробуйте снова.';

      if (error instanceof AIRequestError) {
        if (error.code === 'NO_API_URL') {
          errorText = 'AI API не настроен. Укажите VITE_AI_API_URL.';
        } else if (error.code === 'NETWORK_ERROR') {
          errorText = 'Ошибка сети. Проверьте подключение.';
        } else if (error.code === 'API_ERROR') {
          errorText = `Ошибка API: ${error.message}`;
        }
      }

      const assistantErrorMessage: ChatMessage = {
        id: `${Date.now()}-e`,
        role: 'assistant',
        text: errorText,
        timestamp: Date.now(),
        metadata: { isError: true },
      };

      setMessages((prev) => [...prev, assistantErrorMessage]);
    } finally {
      setIsSending(false);
    }
  }, [prompt, isSending, options.accessToken, options.context]);

  const clearMessages = useCallback(() => {
    setMessages(initialMessages);
    setPrompt('');
  }, []);

  return {
    messages,
    prompt,
    setPrompt,
    isSending,
    hasPrompt,
    canSend,
    handleSend,
    clearMessages,
  };
};

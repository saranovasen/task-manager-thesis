import { useMemo, useState } from 'react';
import { requestAssistantReply } from '../api/requestAssistantReply';
import { initialMessages } from './constants';
import type { ChatMessage } from './types';

export const useAssistantChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [prompt, setPrompt] = useState('');
  const [isSending, setIsSending] = useState(false);

  const hasPrompt = useMemo(() => prompt.trim().length > 0, [prompt]);
  const canSend = useMemo(() => hasPrompt && !isSending, [hasPrompt, isSending]);

  const handleSend = async () => {
    const nextPrompt = prompt.trim();
    if (!nextPrompt || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `${Date.now()}-u`,
      role: 'user',
      text: nextPrompt,
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');
    setIsSending(true);

    try {
      const reply = await requestAssistantReply(nextPrompt);
      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-a`,
        role: 'assistant',
        text: reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const assistantErrorMessage: ChatMessage = {
        id: `${Date.now()}-e`,
        role: 'assistant',
        text: 'Не удалось получить ответ от AI. Проверьте API и попробуйте снова.',
      };
      setMessages((prev) => [...prev, assistantErrorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return {
    messages,
    prompt,
    setPrompt,
    isSending,
    hasPrompt,
    canSend,
    handleSend,
  };
};

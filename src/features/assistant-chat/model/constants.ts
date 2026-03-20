import type { ChatMessage } from './types';

export const ASSISTANT_CHAT_WIDTH = 320;
export const ASSISTANT_CHAT_TOP_OFFSET = 76;

export const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    text: 'Составь сводку всех\nмоих задач',
  },
  {
    id: '2',
    role: 'assistant',
    text: 'Конечно.\n\nВ общем 12 активных\nзадач.\n\nСегодня: 2 задачи\nНа этой неделе: 5 задач\nБез дедлайна: 5 задач\nБлижайшая задача:\nПодготовить\nпрезентацию проекта —\nсегодня в 18:00.',
  },
];

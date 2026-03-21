import type { ChatMessage } from './types';

export const ASSISTANT_CHAT_WIDTH = 320;
export const ASSISTANT_CHAT_TOP_OFFSET = 76;

export const AI_ASSISTANT_FEATURES = {
  TASK_SUMMARY: 'task-summary',
  TASK_SUGGESTION: 'task-suggestion',
  PROJECT_ANALYSIS: 'project-analysis',
  DEADLINE_ALERT: 'deadline-alert',
  PRODUCTIVITY_TIPS: 'productivity-tips',
} as const;

export const AI_PROMPT_TEMPLATES = {
  SUMMARIZE_TASKS: 'Составь сводку всех моих задач',
  SUGGEST_PRIORITIES: 'Какие задачи мне стоит сделать в первую очередь?',
  ANALYZE_WORKLOAD: 'Проанализируй мою текущую нагрузку',
  DEADLINE_WARNINGS: 'Какие задачи приближаются к дедлайну?',
} as const;

export const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    text: 'Составь сводку всех\nмоих задач',
    timestamp: Date.now() - 10000,
  },
  {
    id: '2',
    role: 'assistant',
    text: 'Конечно.\n\nВ общем 12 активных\nзадач.\n\nСегодня: 2 задачи\nНа этой неделе: 5 задач\nБез дедлайна: 5 задач\nБлижайшая задача:\nПодготовить\nпрезентацию проекта —\nсегодня в 18:00.',
    timestamp: Date.now() - 5000,
  },
];

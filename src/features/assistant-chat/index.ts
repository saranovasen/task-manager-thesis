// Components
export { AssistantChat } from '../../widgets/AssistantChat';

// Constants
export { ASSISTANT_CHAT_WIDTH, AI_ASSISTANT_FEATURES, AI_PROMPT_TEMPLATES } from './model/constants';

// Types
export type { ChatMessage, AssistantRequest, AssistantResponse } from './model/types';

// Hooks
export { useAssistantChat } from './model/useAssistantChat';
export { useAIContext } from './model/useAIContext';

// Context
export { AIServiceProvider, useAIService } from './model/AIServiceContext';

// API
export { requestAssistantReply, AIRequestError } from './api/requestAssistantReply';
export { analyzeTasksWithAI, suggestTaskPriorities, chatWithAI } from './api/aiAnalysisApi';

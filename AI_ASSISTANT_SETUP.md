## AI Assistant System - Setup Guide

### 🎯 What's Prepared

Complete frontend infrastructure for AI assistant integration with all necessary APIs, types, and hooks.

### 📋 Environment Variables Required

```env
# Backend AI API endpoint
VITE_AI_API_URL=http://localhost:3000/api/ai/chat

# Optional: API key for external AI services
VITE_AI_API_KEY=your_api_key_here
```

### 🏗️ Architecture Components

#### 1. **Types** (`model/types.ts`)

- `ChatMessage` - Message with timestamps and error metadata
- `AssistantRequest` - Request payload with context data
- `AssistantResponse` - Response with message, confidence, suggestions

#### 2. **API Layer** (`api/`)

**`requestAssistantReply.ts`** - Core API function

- Handles Bearer token authentication
- Custom error class `AIRequestError` with error codes
- Supports API key header (`X-API-Key`)
- Graceful error handling with specific error messages

**`aiAnalysisApi.ts`** - Advanced AI endpoints (for future use)

- `analyzeTasksWithAI()` - Analyze task patterns
- `suggestTaskPriorities()` - Prioritize tasks
- `chatWithAI()` - Multi-turn conversation support

#### 3. **Hooks** (`model/`)

**`useAssistantChat.ts`** - Main chat logic

- Options: `accessToken`, `context` (userId, activeTasks, activeProjects)
- State: messages, prompt, isSending
- Returns: handleSend, clearMessages, canSend, etc.
- Automatic error handling with specific messages

**`useAIContext.ts`** - Context data management

- Tracks active tasks, projects, deadlines
- Generates context summary for AI requests
- Integrates with user tasks/projects

#### 4. **Context Provider** (`model/AIServiceContext.tsx`)

- Global AI service configuration
- Context data sharing across components
- Optional: for app-wide AI settings

#### 5. **Constants** (`model/constants.ts`)

- Feature flags: TASK_SUMMARY, TASK_SUGGESTION, etc.
- Prompt templates: ready-to-use AI prompts
- Initial messages for UI

#### 6. **Widget** (`widgets/AssistantChat.tsx`)

- Integrated with `useAuth()` for user data
- Error messages displayed with red background
- Live online status indicator (green dot)
- Keyboard support: Enter to send, Shift+Enter for newline
- Auto-scrolling message list

### 🔌 Backend API Contract

The system expects these Express endpoints:

#### 1. **POST /api/ai/chat**

```json
// Request
{
  "prompt": "user message",
  "context": {
    "userId": "user-id",
    "activeTasks": 5,
    "activeProjects": 2
  }
}

// Response
{
  "message": "assistant response",
  "confidence": 0.95,
  "suggestions": ["suggestion1", "suggestion2"]
}

// Error Response (status != 200)
{
  "error": "error message"
}
```

#### 2. **POST /api/ai/analyze-tasks** (Optional)

Analyze task patterns and workload

#### 3. **POST /api/ai/suggest-priorities** (Optional)

Get AI suggestions for task prioritization

### 💡 Usage Example

```typescript
// In your component
import { useAssistantChat, useAuth } from '@/features/assistant-chat';

export const MyComponent = () => {
  const { user } = useAuth();
  const { messages, prompt, setPrompt, handleSend, canSend } = useAssistantChat({
    accessToken: user?.accessToken,
    context: {
      userId: user?.id,
      activeTasks: 5,
      activeProjects: 2,
    },
  });

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.text}</div>
      ))}
    </div>
  );
};
```

### 🚀 Integration Steps

1. **Set environment variables**

   ```bash
   VITE_AI_API_URL=your_backend_url
   VITE_AI_API_KEY=optional_key
   ```

2. **Implement backend endpoints** (Express)
   - POST /api/ai/chat with the contract above

3. **Optional: Add task context**
   - Pass active task counts from useProjects/useProjectTasks
   - Update context in AssistantChat widget

4. **Optional: Add conversation history**
   - Use chatWithAI() from aiAnalysisApi.ts for multi-turn support
   - Store conversation ID for session management

### ✨ Features Ready to Use

- ✅ Real-time message sending with loading state
- ✅ Error handling with user-friendly messages
- ✅ Bearer token authentication
- ✅ Context data support (userId, tasks, projects)
- ✅ API key support (X-API-Key header)
- ✅ Message metadata (timestamps, error flags)
- ✅ Keyboard shortcuts (Enter/Shift+Enter)
- ✅ Accessibility: Avatars, status indicators

### 🔒 Security

- Bearer token sent in Authorization header
- Optional API key support for external services
- Error messages don't expose sensitive data
- Credentials included in CORS requests if needed

### 📊 AI Prompt Templates Available

```typescript
import { AI_PROMPT_TEMPLATES } from '@/features/assistant-chat';

// Available templates:
AI_PROMPT_TEMPLATES.SUMMARIZE_TASKS;
AI_PROMPT_TEMPLATES.SUGGEST_PRIORITIES;
AI_PROMPT_TEMPLATES.ANALYZE_WORKLOAD;
AI_PROMPT_TEMPLATES.DEADLINE_WARNINGS;
```

### 🎨 Error Display

- Network errors: "Ошибка сети. Проверьте подключение."
- API errors: Shows specific error message
- Missing config: "AI API не настроен. Укажите VITE_AI_API_URL."
- Error messages displayed with red background (#FFE5E5)
- Red status indicator on assistant avatar

### 📞 What's Next

1. Create Express backend with AI endpoints
2. Integrate with OpenAI, Claude, or custom AI service
3. Add task analysis endpoints for insights
4. Implement conversation persistence (optional)
5. Add prompt templates for specific use cases

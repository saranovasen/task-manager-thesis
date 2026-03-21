# AI Assistant Usage Example

## Frontend Component Example

```typescript
import { useAssistantChat } from '@/features/assistant-chat';
import { useAuth } from '@/entities/auth';

export const MyComponent = () => {
  const { user } = useAuth();

  const {
    messages,
    prompt,
    setPrompt,
    isSending,
    canSend,
    handleSend,
  } = useAssistantChat({
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
        <div key={msg.id} style={{ color: msg.metadata?.isError ? 'red' : 'black' }}>
          {msg.role === 'user' ? 'You' : 'Assistant'}: {msg.text}
        </div>
      ))}

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask AI..."
      />

      <button onClick={() => void handleSend()} disabled={!canSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
};
```

## Backend Requirements

### 1. POST /api/ai/chat

**Request:**

```json
{
  "prompt": "Составь сводку всех моих задач",
  "context": {
    "userId": "user-123",
    "activeTasks": 5,
    "activeProjects": 2
  }
}
```

**Response (success):**

```json
{
  "message": "У вас 5 активных задач...",
  "confidence": 0.95,
  "suggestions": ["suggestion 1", "suggestion 2"]
}
```

**Response (error):**

```json
{
  "error": "AI service error message"
}
```

### 2. Optional: POST /api/ai/analyze-tasks

Analyze task patterns and workload.

### 3. Optional: POST /api/ai/suggest-priorities

Get AI suggestions for task prioritization.

## Express Backend Implementation

```typescript
import express from 'express';
import { authenticateToken } from './middleware/auth';

const router = express.Router();

// Main chat endpoint
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { prompt, context } = req.body;
    const userId = req.user.id;

    // Example with OpenAI
    // const response = await openai.chat.completions.create({
    //   model: 'gpt-4',
    //   messages: [
    //     {
    //       role: 'system',
    //       content: 'You are a task management assistant'
    //     },
    //     {
    //       role: 'user',
    //       content: prompt
    //     }
    //   ]
    // });

    res.json({
      message: 'AI response here',
      confidence: 0.95,
      suggestions: [],
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
```

## Environment Setup

Add to `.env.local`:

```env
# AI Assistant API
VITE_AI_API_URL=http://localhost:3000/api/ai/chat

# Optional: For external AI services
VITE_AI_API_KEY=your_api_key_here
```

## Available Imports

```typescript
// Main hook
import { useAssistantChat } from '@/features/assistant-chat';

// Types
import type { ChatMessage, AssistantRequest, AssistantResponse } from '@/features/assistant-chat';

// API
import { requestAssistantReply, AIRequestError } from '@/features/assistant-chat';

// Constants
import { AI_PROMPT_TEMPLATES, AI_ASSISTANT_FEATURES } from '@/features/assistant-chat';

// Context
import { useAIContext, useAIService, AIServiceProvider } from '@/features/assistant-chat';

// Analysis APIs
import { analyzeTasksWithAI, suggestTaskPriorities, chatWithAI } from '@/features/assistant-chat';
```

## What's Ready

✅ **Complete chat UI** - Already integrated in AssistantChat widget  
✅ **Type safety** - Full TypeScript support  
✅ **Authentication** - Bearer token support  
✅ **Error handling** - Specific error messages  
✅ **Context support** - Task/project metadata  
✅ **Conversation history** - Message timestamps and metadata  
✅ **Keyboard support** - Enter/Shift+Enter handling  
✅ **Visual feedback** - Loading states and error indicators

## Next Steps

1. Implement Express backend endpoints
2. Connect to OpenAI, Claude, or custom AI service
3. Set VITE_AI_API_URL in environment
4. Test end-to-end chat flow
5. (Optional) Add advanced analysis endpoints

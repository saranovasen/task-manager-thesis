import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import { ASSISTANT_CHAT_TOP_OFFSET } from '../features/assistant-chat/model/constants';
import { useAssistantChat } from '../features/assistant-chat/model/useAssistantChat';
import { useAuth } from '../entities/auth';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export const AssistantChat = () => {
  const { user } = useAuth();
  const userAvatarLetter = user?.email?.trim().charAt(0).toUpperCase() || 'U';
  const { messages, prompt, setPrompt, isSending, hasPrompt, canSend, handleSend } = useAssistantChat({
    accessToken: user ? undefined : undefined,
    context: {
      userId: user?.id,
      activeTasks: undefined,
      activeProjects: undefined,
    },
  });

  return (
    <Box
      sx={{
        width: 320,
        position: 'fixed',
        right: 0,
        top: `${ASSISTANT_CHAT_TOP_OFFSET}px`,
        bottom: 0,
        bgcolor: '#FFFFFF',
        borderLeft: '1px solid #E5E8F0',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        gap: 2,
        p: 3,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ color: '#232360', fontSize: 20, lineHeight: 1.1, fontWeight: 500 }}>ИИ ассистент</Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, pr: 0.5 }}>
        {messages.map((message) => {
          if (message.role === 'user') {
            return (
              <Box
                key={message.id}
                sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 1.5 }}
              >
                <Box sx={{ bgcolor: '#5051F9', color: '#FFFFFF', borderRadius: 1.5, px: 2, py: 1.5, maxWidth: 220 }}>
                  <Typography sx={{ fontSize: 16, lineHeight: 1.35, whiteSpace: 'pre-line' }}>
                    {message.text}
                  </Typography>
                </Box>
                <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: '#C9A187' }}>{userAvatarLetter}</Avatar>
              </Box>
            );
          }

          return (
            <Box key={message.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Box sx={{ position: 'relative', mt: 1 }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: '#AF876E' }}>A</Avatar>
                <Box
                  sx={{
                    position: 'absolute',
                    right: -1,
                    bottom: -1,
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    bgcolor: message.metadata?.isError ? '#FF6B6B' : '#2ACB75',
                    border: '1px solid #F3F4F8',
                  }}
                />
              </Box>
              <Box
                sx={{
                  bgcolor: message.metadata?.isError ? '#FFE5E5' : '#ECEFF4',
                  color: message.metadata?.isError ? '#D32F2F' : '#6A7891',
                  borderRadius: 1.5,
                  px: 2,
                  py: 1.5,
                  maxWidth: 240,
                }}
              >
                <Typography sx={{ fontSize: 16, lineHeight: 1.35, whiteSpace: 'pre-line' }}>{message.text}</Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            flex: 1,
            bgcolor: '#ECEFF4',
            borderRadius: 2,
            px: 2,
            py: 0.8,
          }}
        >
          <InputBase
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                void handleSend();
              }
            }}
            placeholder="Написать запрос..."
            fullWidth
            multiline
            maxRows={4}
            sx={{ fontSize: 15, color: '#4F5C73' }}
          />
        </Box>
        <Button
          onClick={() => void handleSend()}
          disabled={!canSend}
          variant="contained"
          sx={{
            width: 46,
            minWidth: 46,
            height: 46,
            p: 0,
            borderRadius: 2,
            backgroundColor: '#5051F9',
            color: '#FFFFFF',
            '&:hover': { backgroundColor: '#4445db' },
            '&.Mui-disabled': {
              backgroundColor: '#ECEFF4',
              color: '#7E8DA7',
            },
          }}
        >
          {isSending ? (
            <CircularProgress size={18} sx={{ color: '#FFFFFF' }} />
          ) : hasPrompt ? (
            <ArrowUpwardIcon sx={{ fontSize: 22 }} />
          ) : (
            <MoreHorizIcon sx={{ fontSize: 24 }} />
          )}
        </Button>
      </Box>
    </Box>
  );
};

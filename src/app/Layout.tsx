import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import type { ReactNode } from 'react';
import { AssistantChat, ASSISTANT_CHAT_WIDTH, Sidebar } from '../widgets';

const SIDEBAR_WIDTH = 94;

export const Layout = ({ children }: { children?: ReactNode }) => {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      <Sidebar />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: '#FFFFFF',
          left: `${SIDEBAR_WIDTH}px`,
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        }}
      >
        <Toolbar sx={{ height: 76, justifyContent: 'flex-end' }}>
          <Button color="inherit" sx={{ color: '#000000' }}>
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <AssistantChat />
      <Box
        component="main"
        sx={{
          marginLeft: `${SIDEBAR_WIDTH}px`,
          width: `calc(100% - ${SIDEBAR_WIDTH}px - ${ASSISTANT_CHAT_WIDTH}px)`,
        }}
      >
        <Toolbar sx={{ height: 76 }} />
        <Box sx={{ py: 3, px: '12px', width: '100%' }}>{children}</Box>
      </Box>
    </Box>
  );
};

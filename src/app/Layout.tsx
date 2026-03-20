import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import type { CSSProperties, ReactNode } from 'react';
import { AssistantChat, ASSISTANT_CHAT_WIDTH, Sidebar } from '../widgets';
import './Layout.css';

const SIDEBAR_WIDTH = 94;

export const Layout = ({ children }: { children?: ReactNode }) => {
  const layoutVars = {
    '--sidebar-width': `${SIDEBAR_WIDTH}px`,
    '--assistant-width': `${ASSISTANT_CHAT_WIDTH}px`,
  } as CSSProperties;

  return (
    <Box className="app-layout" style={layoutVars}>
      <Sidebar />
      <AppBar
        position="fixed"
        elevation={0}
        className="app-layout__bar"
        color="transparent"
        sx={{
          bgcolor: '#FFFFFF',
          color: '#000000',
          backgroundImage: 'none',
        }}
      >
        <Toolbar className="app-layout__toolbar">
          <Button color="inherit" className="app-layout__login">
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <AssistantChat />
      <Box component="main" className="app-layout__main">
        <Toolbar className="app-layout__offset" />
        <Box className="app-layout__content">{children}</Box>
      </Box>
    </Box>
  );
};

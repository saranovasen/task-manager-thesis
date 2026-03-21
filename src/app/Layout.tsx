import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { useAuth } from '../entities/auth';
import { LoginDialog } from '../features/auth-login';
import { AssistantChat, ASSISTANT_CHAT_WIDTH, Sidebar } from '../widgets';
import './Layout.css';

const SIDEBAR_WIDTH = 94;

export const Layout = ({ children }: { children?: ReactNode }) => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

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
          {isAuthenticated ? (
            <>
              <Typography className="app-layout__user">{user?.name ?? user?.email}</Typography>
              <Button
                color="inherit"
                className="app-layout__login"
                onClick={() => {
                  void logout();
                }}
              >
                Выйти
              </Button>
            </>
          ) : (
            <Button color="inherit" className="app-layout__login" onClick={() => setIsLoginOpen(true)}>
              Войти
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <AssistantChat />
      <Box component="main" className="app-layout__main">
        <Toolbar className="app-layout__offset" />
        <Box className="app-layout__content">{children}</Box>
      </Box>

      <LoginDialog open={isLoginOpen} loading={isLoading} onClose={() => setIsLoginOpen(false)} onSubmit={login} />
    </Box>
  );
};

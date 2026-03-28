import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { useAuth } from '../entities/auth';
import { LoginDialog } from '../features/auth-login';
import { AssistantChat, ASSISTANT_CHAT_WIDTH, Sidebar } from '../widgets';
import './Layout.css';

const SIDEBAR_WIDTH = 94;

export const Layout = ({ children }: { children?: ReactNode }) => {
  const { user, isAuthenticated, isLoading, login, register, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [accountAnchorEl, setAccountAnchorEl] = useState<null | HTMLElement>(null);
  const userAvatarLetter = user?.email?.trim().charAt(0).toUpperCase() || 'U';
  const isAccountMenuOpen = Boolean(accountAnchorEl);

  const layoutVars = {
    '--sidebar-width': `${SIDEBAR_WIDTH}px`,
    '--assistant-width': `${ASSISTANT_CHAT_WIDTH}px`,
  } as CSSProperties;

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          bgcolor: '#F4F6FF',
        }}
      >
        <CircularProgress size={28} sx={{ color: '#5051F9' }} />
        <Typography sx={{ color: '#6F7F99', fontSize: 15 }}>Восстанавливаем сессию...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#F4F6FF',
          p: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={() => setIsLoginOpen(true)}
          sx={{
            minWidth: 220,
            height: 48,
            borderRadius: 2.5,
            textTransform: 'none',
            fontSize: 16,
            fontWeight: 600,
            bgcolor: '#5051F9',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#4445DB',
              boxShadow: 'none',
            },
          }}
        >
          Войти или зарегистрироваться
        </Button>

        <LoginDialog
          open={isLoginOpen}
          loading={isLoading}
          onClose={() => setIsLoginOpen(false)}
          onLogin={login}
          onRegister={register}
        />
      </Box>
    );
  }

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
          <Button
            onClick={(event) => {
              setAccountAnchorEl(event.currentTarget);
            }}
            endIcon={
              <KeyboardArrowDownRoundedIcon
                sx={{
                  color: '#6F7F99',
                  transform: isAccountMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            }
            sx={{
              minWidth: 0,
              px: 0.5,
              borderRadius: 999,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#F4F6FF',
              },
            }}
          >
            <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: '#C9A187' }}>{userAvatarLetter}</Avatar>
          </Button>

          <Menu
            anchorEl={accountAnchorEl}
            open={isAccountMenuOpen}
            onClose={() => setAccountAnchorEl(null)}
            PaperProps={{
              sx: {
                borderRadius: 2,
                mt: 1,
                minWidth: 180,
                border: '1px solid #ECEFFC',
                boxShadow: '0 10px 30px rgba(31,37,100,0.12)',
              },
            }}
          >
            <MenuItem
              disabled
              sx={{
                opacity: 1,
                color: '#6F7F99',
                fontSize: 13,
                cursor: 'default',
                '&.Mui-disabled': { opacity: 1 },
              }}
            >
              {user?.email}
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAccountAnchorEl(null);
                void logout();
              }}
              sx={{
                color: '#232360',
                fontSize: 14,
              }}
            >
              Выйти
            </MenuItem>
          </Menu>
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

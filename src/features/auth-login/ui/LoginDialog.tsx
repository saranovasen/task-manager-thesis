import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { ApiError } from '../../../shared/api/httpClient';

type AuthMode = 'login' | 'register';

type LoginDialogProps = {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onLogin: (payload: { email: string; password: string }) => Promise<void>;
  onRegister: (payload: { name: string; email: string; password: string }) => Promise<void>;
};

export const LoginDialog = ({ open, loading = false, onClose, onLogin, onRegister }: LoginDialogProps) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setMode('login');
      setName('');
      setEmail('');
      setPassword('');
      setError('');
    }
  }, [open]);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password.trim()) {
      setError('Введите email и пароль');
      return;
    }

    if (!validateEmail(normalizedEmail)) {
      setError('Введите корректный email адрес');
      return;
    }

    if (mode === 'register' && name.trim().length < 2) {
      setError('Имя должно быть не короче 2 символов');
      return;
    }

    if (password.trim().length < 6) {
      setError('Пароль должен быть не короче 6 символов');
      return;
    }

    setError('');

    try {
      if (mode === 'register') {
        await onRegister({ name: name.trim(), email: normalizedEmail, password });
      } else {
        await onLogin({ email: normalizedEmail, password });
      }
      onClose();
    } catch (exception) {
      if (exception instanceof ApiError) {
        setError(exception.message);
        return;
      }

      setError(mode === 'register' ? 'Ошибка регистрации' : 'Ошибка авторизации');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          color: '#232360',
          fontSize: 24,
          fontWeight: 600,
          alignContent: 'center',
          justifyContent: 'center',
          display: 'flex',
        }}
      >
        {mode === 'login' ? 'Вход' : 'Регистрация'}
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={mode === 'login' ? 'contained' : 'outlined'}
              onClick={() => {
                setMode('login');
                setError('');
              }}
              sx={{
                flex: 1,
                height: 39,
                borderRadius: 2.5,
                textTransform: 'none',
                fontSize: 15,
                fontWeight: 600,
                ...(mode === 'login'
                  ? {
                      bgcolor: '#5051F9',
                      color: '#FFFFFF',
                      boxShadow: 'none',
                      '&:hover': {
                        bgcolor: '#4445DB',
                        boxShadow: 'none',
                      },
                    }
                  : {
                      borderColor: '#5051F9',
                      color: '#5051F9',
                      '&:hover': {
                        bgcolor: '#F4F6FF',
                        borderColor: '#4445DB',
                        color: '#4445DB',
                      },
                    }),
              }}
            >
              Войти
            </Button>
            <Button
              variant={mode === 'register' ? 'contained' : 'outlined'}
              onClick={() => {
                setMode('register');
                setError('');
              }}
              sx={{
                flex: 1,
                height: 39,
                borderRadius: 2.5,
                textTransform: 'none',
                fontSize: 15,
                fontWeight: 600,
                ...(mode === 'register'
                  ? {
                      bgcolor: '#5051F9',
                      color: '#FFFFFF',
                      boxShadow: 'none',
                      '&:hover': {
                        bgcolor: '#4445DB',
                        boxShadow: 'none',
                      },
                    }
                  : {
                      borderColor: '#5051F9',
                      color: '#5051F9',
                      '&:hover': {
                        bgcolor: '#F4F6FF',
                        borderColor: '#4445DB',
                        color: '#4445DB',
                      },
                    }),
              }}
            >
              Регистрация
            </Button>
          </Box>

          {mode === 'register' && (
            <TextField
              label="Имя"
              fullWidth
              value={name}
              onChange={(event) => setName(event.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#5051F9',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#5051F9',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#5051F9',
                },
              }}
            />
          )}

          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#5051F9',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#5051F9',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#5051F9',
              },
            }}
          />
          <TextField
            label="Пароль"
            type="password"
            fullWidth
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#5051F9',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#5051F9',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#5051F9',
              },
            }}
          />

          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ alignContent: 'center', justifyContent: 'center', pb: 3 }}>
        <Button
          variant="contained"
          disabled={loading}
          onClick={() => {
            void handleSubmit();
          }}
          sx={{
            minWidth: 129,
            height: 39,
            borderRadius: 2.5,
            textTransform: 'none',
            fontSize: 15,
            fontWeight: 600,
            bgcolor: '#5051F9',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#4445DB',
              boxShadow: 'none',
            },
          }}
        >
          {mode === 'register' ? 'Зарегистрироваться' : 'Войти'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ApiError } from '../../../shared/api/httpClient';

type LoginDialogProps = {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: { email: string; password: string }) => Promise<void>;
};

export const LoginDialog = ({ open, loading = false, onClose, onSubmit }: LoginDialogProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
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
    if (!email.trim() || !password.trim()) {
      setError('Введите email и пароль');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Введите корректный email адрес');
      return;
    }

    setError('');

    try {
      await onSubmit({ email: email.trim(), password });
      onClose();
    } catch (exception) {
      if (exception instanceof ApiError) {
        setError(exception.message);
        return;
      }

      setError('Ошибка авторизации');
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
        Вход
      </DialogTitle>
      <DialogContent sx={{ pb: 1 }}>
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            label="Пароль"
            type="password"
            fullWidth
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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
          Войти
        </Button>
      </DialogActions>
    </Dialog>
  );
};

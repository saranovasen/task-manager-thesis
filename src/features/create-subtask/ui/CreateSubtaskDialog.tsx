import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import type { CreateSubtaskPayload } from '../model/types';

type CreateSubtaskDialogProps = {
  open: boolean;
  taskTitle?: string;
  onClose: () => void;
  onCreate: (payload: CreateSubtaskPayload) => void;
};

export const CreateSubtaskDialog = ({ open, taskTitle, onClose, onCreate }: CreateSubtaskDialogProps) => {
  const [title, setTitle] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (!open) {
      setTitle('');
      setSubmitAttempted(false);
    }
  }, [open]);

  const titleError = title.trim().length < 2 ? 'Минимум 2 символа' : '';

  const primaryButtonSx = {
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
  };

  const secondaryButtonSx = {
    minWidth: 129,
    height: 39,
    borderRadius: 2.5,
    textTransform: 'none',
    fontSize: 15,
    fontWeight: 600,
    bgcolor: '#E4E2F7',
    color: '#5051F9',
    boxShadow: 'none',
    '&:hover': {
      bgcolor: '#DCD9F4',
      boxShadow: 'none',
    },
  };

  const fieldSx = {
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#5051F9',
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#5051F9',
      },
    },
  };

  const handleCreate = () => {
    setSubmitAttempted(true);
    if (titleError) {
      return;
    }

    onCreate({ title: title.trim() });
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
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, color: '#232360', fontSize: 24, fontWeight: 600 }}>Новая подзадача</DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        <Stack spacing={2}>
          <Typography sx={{ color: '#6F7F99', mt: 0.5 }}>
            {taskTitle ? `Для задачи: ${taskTitle}` : 'Добавьте подзадачу'}
          </Typography>

          <TextField
            label="Название подзадачи"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            fullWidth
            autoFocus
            error={submitAttempted && Boolean(titleError)}
            helperText={submitAttempted ? titleError : ''}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleCreate();
              }
            }}
            sx={fieldSx}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1.5 }}>
        <Button onClick={onClose} variant="contained" sx={secondaryButtonSx}>
          Отмена
        </Button>
        <Button variant="contained" onClick={handleCreate} sx={primaryButtonSx}>
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

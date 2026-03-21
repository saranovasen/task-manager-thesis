import {
  Box,
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
import type { ProjectTaskStatus } from '../../../entities/task';
import type { CreateTaskPayload } from '../model/types';

type CreateTaskDialogProps = {
  open: boolean;
  status: ProjectTaskStatus;
  onClose: () => void;
  onCreate: (payload: CreateTaskPayload) => void;
};

type FormState = {
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  dueDate: string;
};

const categoryColorOptions = ['#5051F9', '#2EA3E6', '#F57644', '#F59E0B', '#34C759', '#A855F7', '#EF4444'];

const initialFormState: FormState = {
  title: '',
  description: '',
  category: '',
  categoryColor: '#5051F9',
  dueDate: '',
};

const formatDueDate = (value?: string) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

export const CreateTaskDialog = ({ open, status, onClose, onCreate }: CreateTaskDialogProps) => {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm(initialFormState);
      setSubmitAttempted(false);
    }
  }, [open]);

  const titleError = form.title.trim().length < 2 ? 'Минимум 2 символа' : '';
  const hasErrors = Boolean(titleError);

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

    if (hasErrors) {
      return;
    }

    onCreate({
      title: form.title.trim(),
      description: form.description.trim() || 'Описание не добавлено',
      category: form.category.trim() || 'Новая',
      categoryColor: form.categoryColor,
      dateLabel: formatDueDate(form.dueDate) || 'Срок не указан',
      status,
    });
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
      <DialogTitle sx={{ pb: 1, color: '#232360', fontSize: 24, fontWeight: 600 }}>Новая задача</DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        <Typography sx={{ color: '#6F7F99', mb: 2, mt: 0.5 }}>
          Заполните основные детали задачи. Остальное можно изменить позже в карточке задачи.
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Название"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            fullWidth
            error={submitAttempted && Boolean(titleError)}
            helperText={submitAttempted ? titleError : ''}
            sx={fieldSx}
          />

          <TextField
            label="Описание"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            fullWidth
            multiline
            minRows={2}
            sx={fieldSx}
          />

          <Box>
            <Typography sx={{ color: '#232360', fontSize: 14, fontWeight: 500, mb: 1 }}>Цвет категории</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              {categoryColorOptions.map((color) => {
                const isActive = form.categoryColor === color;

                return (
                  <Box
                    key={color}
                    component="button"
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, categoryColor: color }))}
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      border: isActive ? '2px solid #232360' : '2px solid transparent',
                      outline: 'none',
                      bgcolor: color,
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease',
                      '&:hover': {
                        transform: 'scale(1.08)',
                      },
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          <TextField
            label="Категория"
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            fullWidth
            placeholder="Например: Дизайн"
            sx={fieldSx}
          />

          <TextField
            label="Дедлайн"
            type="date"
            value={form.dueDate}
            onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))}
            InputLabelProps={{ shrink: true }}
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

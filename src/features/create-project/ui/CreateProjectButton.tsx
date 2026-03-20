import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import type { CreateProjectInput } from '../../../entities/project';
import type { CreateProjectPayload } from '../model/types';

type CreateProjectButtonProps = {
  onCreate: (project: CreateProjectInput) => void;
};

type FormState = {
  title: string;
  link: string;
  dueDate: string;
};

const initialFormState: FormState = {
  title: '',
  link: '',
  dueDate: '',
};

const formatDueDate = (value: Date) => {
  const day = String(value.getDate()).padStart(2, '0');
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const year = value.getFullYear();

  return `до ${day}.${month}.${year}`;
};

export const CreateProjectButton = ({ onCreate }: CreateProjectButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const titleError = form.title.trim().length < 2 ? 'Минимум 2 символа' : '';

  const hasErrors = Boolean(titleError);

  const closeDialog = () => {
    setIsOpen(false);
    setForm(initialFormState);
    setSubmitAttempted(false);
  };

  const handleCreate = () => {
    setSubmitAttempted(true);

    if (hasErrors) {
      return;
    }

    const payload: CreateProjectPayload = {
      title: form.title.trim(),
      link: form.link.trim() || undefined,
      dueDate: form.dueDate ? new Date(form.dueDate) : undefined,
    };

    onCreate({
      title: payload.title,
      link: payload.link,
      dueDate: payload.dueDate ? formatDueDate(payload.dueDate) : undefined,
    });

    closeDialog();
  };

  const primaryButtonSx = {
    minWidth: 129,
    height: 39,
    borderRadius: 2.5,
    textTransform: 'none',
    fontSize: 15,
    fontWeight: 500,
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
    fontWeight: 500,
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

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddRoundedIcon />}
        onClick={() => setIsOpen(true)}
        sx={{ ...primaryButtonSx, px: 2, fontWeight: 600 }}
      >
        Новый проект
      </Button>

      <Dialog
        open={isOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, color: '#232360', fontSize: 24, fontWeight: 600 }}>Создать проект</DialogTitle>

        <DialogContent sx={{ pb: 1 }}>
          <Typography sx={{ color: '#6F7F99', mb: 2, mt: 0.5 }}>
            Добавьте базовую информацию — проект сразу появится в списке.
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Название"
              value={form.title}
              onChange={(event) => setForm((prevForm) => ({ ...prevForm, title: event.target.value }))}
              fullWidth
              error={submitAttempted && Boolean(titleError)}
              helperText={submitAttempted ? titleError : ''}
              sx={fieldSx}
            />

            <TextField
              label="Ссылка"
              value={form.link}
              onChange={(event) => setForm((prevForm) => ({ ...prevForm, link: event.target.value }))}
              fullWidth
              placeholder="https://example.com"
              sx={fieldSx}
            />

            <TextField
              label="Дедлайн"
              type="date"
              value={form.dueDate}
              onChange={(event) => setForm((prevForm) => ({ ...prevForm, dueDate: event.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1.5 }}>
          <Button onClick={closeDialog} variant="contained" sx={{ ...secondaryButtonSx, fontWeight: 600 }}>
            Отмена
          </Button>
          <Button variant="contained" onClick={handleCreate} sx={{ ...primaryButtonSx, fontWeight: 600 }}>
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { ProjectTaskItem, ProjectTaskStatus } from '../entities/task';

const statusLabelByKey: Record<ProjectTaskStatus, string> = {
  queue: 'Очередь',
  'in-progress': 'В работе',
  review: 'На проверке',
  done: 'Готово',
};

type TaskDetailsDialogProps = {
  task: ProjectTaskItem | null;
  open: boolean;
  onClose: () => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onChangeDeadline: (taskId: string, nextDate: string) => void;
};

export const TaskDetailsDialog = ({
  task,
  open,
  onClose,
  onAddSubtask,
  onToggleSubtask,
  onChangeDeadline,
}: TaskDetailsDialogProps) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [deadlineValue, setDeadlineValue] = useState('');
  const [isEditingDeadline, setIsEditingDeadline] = useState(false);

  const formatDisplayDate = (value?: string) => {
    if (!value || value === 'Срок не указан') {
      return value ?? 'Срок не указан';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    const monthRaw = parsed.toLocaleString('ru-RU', { month: 'short' }).replace('.', '');
    const month = monthRaw.charAt(0).toUpperCase() + monthRaw.slice(1);
    const day = String(parsed.getDate()).padStart(2, '0');
    const year = parsed.getFullYear();

    return `${month} ${day}, ${year}`;
  };

  const toInputDate = (value?: string) => {
    if (!value || value === 'Срок не указан') {
      return '';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return '';
    }

    return parsed.toISOString().slice(0, 10);
  };

  useEffect(() => {
    setDeadlineValue(toInputDate(task?.dateLabel));
  }, [task?.id, task?.dateLabel]);

  useEffect(() => {
    if (!open) {
      setIsEditingDeadline(false);
    }
  }, [open]);

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

  const handleAddSubtask = () => {
    if (!task || !newSubtaskTitle.trim()) {
      return;
    }

    onAddSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  const submitDeadline = () => {
    if (!task) {
      setIsEditingDeadline(false);
      return;
    }

    onChangeDeadline(task.id, deadlineValue);
    setIsEditingDeadline(false);
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
      <DialogTitle sx={{ pb: 1, color: '#232360', fontSize: 24, fontWeight: 600 }}>
        {task?.title ?? 'Задача'}
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        <Stack spacing={2}>
          {task?.description && <Typography sx={{ color: '#6F7F99', mt: 0.5 }}>{task.description}</Typography>}

          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
            <Box
              sx={{
                display: 'inline-flex',
                px: 1,
                py: 0.4,
                borderRadius: 1,
                bgcolor: '#EEF0FF',
              }}
            >
              <Typography sx={{ color: '#1F2564', fontSize: 13, fontWeight: 600 }}>
                Статус: {task ? statusLabelByKey[task.status] : '-'}
              </Typography>
            </Box>

            {isEditingDeadline ? (
              <TextField
                type="date"
                value={deadlineValue}
                onChange={(event) => setDeadlineValue(event.target.value)}
                onBlur={submitDeadline}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    submitDeadline();
                  }

                  if (event.key === 'Escape') {
                    event.preventDefault();
                    setDeadlineValue(toInputDate(task?.dateLabel));
                    setIsEditingDeadline(false);
                  }
                }}
                autoFocus
                sx={{
                  minWidth: 165,
                  '& .MuiOutlinedInput-root': {
                    height: 29,
                    borderRadius: 1,
                    px: 1,
                    color: '#1F2564',
                    fontSize: 13,
                    fontWeight: 500,
                    '& fieldset': {
                      borderColor: '#D7DDE8',
                    },
                    '&:hover fieldset': {
                      borderColor: '#C8D0E0',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#5051F9',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    p: 0,
                    color: '#1F2564',
                    fontSize: 13,
                    fontWeight: 500,
                  },
                }}
              />
            ) : (
              <Box
                onClick={() => setIsEditingDeadline(true)}
                sx={{
                  display: 'inline-flex',
                  px: 1,
                  py: 0.4,
                  border: '1px solid #D7DDE8',
                  borderRadius: 1,
                  color: '#1F2564',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: '#F7F8FF',
                  },
                }}
              >
                Срок: {task?.dateLabel ? formatDisplayDate(task.dateLabel) : '-'}
              </Box>
            )}
          </Box>

          <Typography sx={{ color: '#232360', fontSize: 18, fontWeight: 600 }}>Подзадачи</Typography>

          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              size="small"
              placeholder="Новая подзадача"
              value={newSubtaskTitle}
              onChange={(event) => setNewSubtaskTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleAddSubtask();
                }
              }}
              sx={fieldSx}
            />
            <Button
              variant="contained"
              onClick={handleAddSubtask}
              startIcon={<AddRoundedIcon />}
              sx={{ ...primaryButtonSx, minWidth: 140 }}
            >
              Добавить
            </Button>
          </Stack>

          <List sx={{ p: 0 }}>
            {task?.subtasks?.map((subtask) => (
              <ListItem
                key={subtask.id}
                disablePadding
                sx={{
                  px: 1,
                  py: 0.6,
                  borderRadius: 1.5,
                  '&:not(:last-child)': {
                    mb: 0.4,
                  },
                  '&:hover': {
                    bgcolor: '#F7F8FF',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 34 }}>
                  <Checkbox
                    checked={subtask.isDone}
                    onChange={() => onToggleSubtask(task.id, subtask.id)}
                    sx={{
                      p: 0.5,
                      color: '#B9C2D3',
                      '&.Mui-checked': {
                        color: '#5051F9',
                      },
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={subtask.title}
                  primaryTypographyProps={{
                    sx: {
                      color: '#1F2564',
                      textDecoration: subtask.isDone ? 'line-through' : 'none',
                      opacity: subtask.isDone ? 0.6 : 1,
                      fontSize: 14,
                    },
                  }}
                />
              </ListItem>
            ))}

            {(!task?.subtasks || task.subtasks.length === 0) && (
              <Typography sx={{ color: '#9AA5BC', fontSize: 14 }}>Подзадач пока нет</Typography>
            )}
          </List>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1.5 }}>
        <Button onClick={onClose} variant="contained" sx={secondaryButtonSx}>
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

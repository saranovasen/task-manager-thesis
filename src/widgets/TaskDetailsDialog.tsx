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
import { useState } from 'react';
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
};

export const TaskDetailsDialog = ({ task, open, onClose, onAddSubtask, onToggleSubtask }: TaskDetailsDialogProps) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

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

            <Box
              sx={{
                display: 'inline-flex',
                px: 1,
                py: 0.4,
                border: '1px solid #D7DDE8',
                borderRadius: 1,
              }}
            >
              <Typography sx={{ color: '#6F7F99', fontSize: 13, fontWeight: 500 }}>
                {task?.dateLabel ? `Срок: ${task.dateLabel}` : 'Срок: -'}
              </Typography>
            </Box>
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

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { ProjectTaskItem, ProjectTaskStatus } from '../entities/task';
import { ConfirmDeleteDialog } from '../shared/dialogs';

const statusLabelByKey: Record<ProjectTaskStatus, string> = {
  queue: 'Очередь',
  'in-progress': 'В работе',
  review: 'На проверке',
  done: 'Готово',
};

const categoryColorOptions = ['#5051F9', '#2EA3E6', '#F57644', '#F59E0B', '#34C759', '#A855F7', '#EF4444'];

type TaskDetailsDialogProps = {
  task: ProjectTaskItem | null;
  open: boolean;
  onClose: () => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onRenameSubtask: (taskId: string, subtaskId: string, title: string) => void;
  onChangeDeadline: (taskId: string, nextDate: string) => void;
  onChangeDescription: (taskId: string, nextDescription: string) => void;
  onChangeCategory: (taskId: string, nextCategory: string) => void;
  onChangeCategoryColor: (taskId: string, nextColor: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
};

export const TaskDetailsDialog = ({
  task,
  open,
  onClose,
  onAddSubtask,
  onToggleSubtask,
  onRenameSubtask,
  onChangeDeadline,
  onChangeDescription,
  onChangeCategory,
  onChangeCategoryColor,
  onDeleteSubtask,
  onDeleteTask,
}: TaskDetailsDialogProps) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [deadlineValue, setDeadlineValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [categoryColorValue, setCategoryColorValue] = useState('#5051F9');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [categoryValue, setCategoryValue] = useState('');
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isEditingDeadline, setIsEditingDeadline] = useState(false);
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingSubtaskTitle, setEditingSubtaskTitle] = useState('');
  const [saveChangesDialogOpen, setSaveChangesDialogOpen] = useState(false);
  const [deleteSubtaskDialogOpen, setDeleteSubtaskDialogOpen] = useState(false);
  const [subtaskToDelete, setSubtaskToDelete] = useState<{ taskId: string; subtaskId: string; title: string } | null>(
    null
  );
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false);

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
    setDescriptionValue(task?.description ?? '');
  }, [task?.id, task?.description]);

  useEffect(() => {
    setCategoryValue(task?.category ?? '');
  }, [task?.id, task?.category]);

  useEffect(() => {
    setCategoryColorValue(task?.categoryColor ?? '#5051F9');
  }, [task?.id, task?.categoryColor]);

  useEffect(() => {
    if (!open) {
      setIsEditingDeadline(false);
      setIsEditingDescription(false);
      setIsEditingCategory(false);
      setSaveChangesDialogOpen(false);
      setDeadlineValue(toInputDate(task?.dateLabel));
      setDescriptionValue(task?.description ?? '');
      setCategoryValue(task?.category ?? '');
      setCategoryColorValue(task?.categoryColor ?? '#5051F9');
      setEditingSubtaskId(null);
      setEditingSubtaskTitle('');
    }
  }, [open, task?.dateLabel, task?.description, task?.category, task?.categoryColor]);

  useEffect(() => {
    setEditingSubtaskId(null);
    setEditingSubtaskTitle('');
  }, [task?.id]);

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

  const handleStartEditSubtask = (subtaskId: string, title: string) => {
    setEditingSubtaskId(subtaskId);
    setEditingSubtaskTitle(title);
  };

  const handleCancelEditSubtask = () => {
    setEditingSubtaskId(null);
    setEditingSubtaskTitle('');
  };

  const handleSaveSubtaskTitle = (subtaskId: string) => {
    if (!task) {
      return;
    }

    const trimmedTitle = editingSubtaskTitle.trim();
    if (!trimmedTitle) {
      handleCancelEditSubtask();
      return;
    }

    const currentTitle = task.subtasks?.find((subtask) => subtask.id === subtaskId)?.title ?? '';
    if (trimmedTitle !== currentTitle) {
      onRenameSubtask(task.id, subtaskId, trimmedTitle);
    }

    handleCancelEditSubtask();
  };

  const normalizedDescription = descriptionValue.trim() || 'Описание не добавлено';
  const normalizedCategory = categoryValue.trim() || 'Новая';
  const currentDescription = task?.description ?? 'Описание не добавлено';
  const currentCategory = task?.category ?? 'Новая';
  const currentDeadlineValue = toInputDate(task?.dateLabel);
  const currentCategoryColor = task?.categoryColor ?? '#5051F9';

  const hasUnsavedChanges =
    Boolean(task) &&
    (normalizedDescription !== currentDescription ||
      normalizedCategory !== currentCategory ||
      deadlineValue !== currentDeadlineValue ||
      categoryColorValue !== currentCategoryColor);

  const exitEditModes = () => {
    setIsEditingDeadline(false);
    setIsEditingDescription(false);
    setIsEditingCategory(false);
  };

  const saveDraftChanges = () => {
    if (!task) {
      return;
    }

    if (normalizedDescription !== currentDescription) {
      onChangeDescription(task.id, normalizedDescription);
    }

    if (normalizedCategory !== currentCategory) {
      onChangeCategory(task.id, normalizedCategory);
    }

    if (deadlineValue !== currentDeadlineValue) {
      onChangeDeadline(task.id, deadlineValue);
    }

    if (categoryColorValue !== currentCategoryColor) {
      onChangeCategoryColor(task.id, categoryColorValue);
    }

    exitEditModes();
  };

  const handleRequestClose = () => {
    if (hasUnsavedChanges) {
      setSaveChangesDialogOpen(true);
      return;
    }

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleRequestClose}
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
          {isEditingDescription ? (
            <TextField
              fullWidth
              multiline
              minRows={2}
              value={descriptionValue}
              onChange={(event) => setDescriptionValue(event.target.value)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                  event.preventDefault();
                  setIsEditingDescription(false);
                }

                if (event.key === 'Escape') {
                  event.preventDefault();
                  setDescriptionValue(task?.description ?? '');
                  setIsEditingDescription(false);
                }
              }}
              autoFocus
              sx={fieldSx}
            />
          ) : (
            <Typography
              onClick={() => setIsEditingDescription(true)}
              sx={{
                color: '#6F7F99',
                mt: 0.5,
                cursor: 'pointer',
                borderRadius: 1,
                px: 0.5,
                py: 0.4,
                '&:hover': {
                  bgcolor: '#F7F8FF',
                },
              }}
            >
              {task?.description ?? 'Описание не добавлено'}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
            {isEditingCategory ? (
              <TextField
                size="small"
                value={categoryValue}
                onChange={(event) => setCategoryValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    setIsEditingCategory(false);
                  }

                  if (event.key === 'Escape') {
                    event.preventDefault();
                    setCategoryValue(task?.category ?? '');
                    setIsEditingCategory(false);
                  }
                }}
                autoFocus
                sx={{
                  minWidth: 180,
                  '& .MuiOutlinedInput-root': {
                    height: 29,
                    borderRadius: 1,
                    px: 1,
                    color: '#1F2564',
                    fontSize: 13,
                    fontWeight: 500,
                    bgcolor: '#FFFFFF',
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
                onClick={() => setIsEditingCategory(true)}
                sx={{
                  display: 'inline-flex',
                  px: 1,
                  py: 0.4,
                  borderRadius: 1,
                  bgcolor: task?.categoryColor ?? '#EEF0FF',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.92,
                  },
                }}
              >
                <Typography sx={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600 }}>
                  Категория: {task?.category ?? '-'}
                </Typography>
              </Box>
            )}

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
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    setIsEditingDeadline(false);
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

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ color: '#6F7F99', fontSize: 14, fontWeight: 500 }}>Цвет категории:</Typography>
            {categoryColorOptions.map((color) => {
              const isActive = categoryColorValue === color;

              return (
                <Box
                  key={color}
                  component="button"
                  type="button"
                  onClick={() => setCategoryColorValue(color)}
                  sx={{
                    width: 22,
                    height: 22,
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  '&:not(:last-child)': {
                    mb: 0.4,
                  },
                  '&:hover': {
                    bgcolor: '#F7F8FF',
                  },
                  '& .subtask-delete-btn': {
                    opacity: 0,
                    transform: 'scale(0.9)',
                    transition: 'all 160ms ease',
                  },
                  '&:hover .subtask-delete-btn, &:focus-within .subtask-delete-btn': {
                    opacity: 1,
                    transform: 'scale(1)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
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
                  {editingSubtaskId === subtask.id ? (
                    <TextField
                      size="small"
                      value={editingSubtaskTitle}
                      onChange={(event) => setEditingSubtaskTitle(event.target.value)}
                      onBlur={() => handleSaveSubtaskTitle(subtask.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          handleSaveSubtaskTitle(subtask.id);
                        }

                        if (event.key === 'Escape') {
                          event.preventDefault();
                          handleCancelEditSubtask();
                        }
                      }}
                      autoFocus
                      sx={{
                        minWidth: 0,
                        flex: 1,
                        ml: 0.5,
                        '& .MuiOutlinedInput-root': {
                          height: 32,
                          fontSize: 14,
                          '& fieldset': {
                            borderColor: '#D7DDE8',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#5051F9',
                          },
                        },
                      }}
                    />
                  ) : (
                    <ListItemText
                      onClick={() => handleStartEditSubtask(subtask.id, subtask.title)}
                      primary={subtask.title}
                      primaryTypographyProps={{
                        sx: {
                          color: '#1F2564',
                          textDecoration: subtask.isDone ? 'line-through' : 'none',
                          opacity: subtask.isDone ? 0.6 : 1,
                          fontSize: 14,
                          cursor: 'text',
                        },
                      }}
                    />
                  )}
                </Box>
                <IconButton
                  className="subtask-delete-btn"
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSubtaskToDelete({
                      taskId: task.id,
                      subtaskId: subtask.id,
                      title: subtask.title,
                    });
                    setDeleteSubtaskDialogOpen(true);
                  }}
                  sx={{
                    p: 0.5,
                    color: '#B7BED0',
                    '&:hover': {
                      color: '#E15858',
                      bgcolor: '#FFEFF1',
                    },
                  }}
                >
                  <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </ListItem>
            ))}

            {(!task?.subtasks || task.subtasks.length === 0) && (
              <Typography sx={{ color: '#9AA5BC', fontSize: 14 }}>Подзадач пока нет</Typography>
            )}
          </List>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1.5, justifyContent: 'space-between' }}>
        <Button
          onClick={() => setDeleteTaskDialogOpen(true)}
          variant="text"
          startIcon={<DeleteOutlineRoundedIcon sx={{ fontSize: 17 }} />}
          sx={{
            minWidth: 0,
            height: 39,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: 14,
            fontWeight: 500,
            color: '#9AA5BC',
            '&:hover': {
              bgcolor: '#FFEFF1',
              color: '#E15858',
            },
          }}
        >
          Удалить
        </Button>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button onClick={handleRequestClose} variant="contained" sx={secondaryButtonSx}>
            Закрыть
          </Button>
          <Button onClick={saveDraftChanges} variant="contained" sx={primaryButtonSx} disabled={!hasUnsavedChanges}>
            Сохранить
          </Button>
        </Box>
      </DialogActions>

      <Dialog
        open={saveChangesDialogOpen}
        onClose={() => setSaveChangesDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, color: '#232360', fontSize: 22, fontWeight: 600 }}>Сохранить изменения?</DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography sx={{ color: '#6F7F99' }}>Есть несохраненные изменения. Сохранить их перед закрытием?</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1.5, flexWrap: 'nowrap' }}>
          <Button
            onClick={() => setSaveChangesDialogOpen(false)}
            variant="contained"
            sx={{ ...secondaryButtonSx, flex: 1, minWidth: 0, whiteSpace: 'nowrap' }}
          >
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setSaveChangesDialogOpen(false);
              onClose();
            }}
            sx={{
              ...secondaryButtonSx,
              flex: 1,
              minWidth: 0,
              whiteSpace: 'nowrap',
              bgcolor: '#F3F4FA',
              color: '#6F7F99',
              '&:hover': {
                bgcolor: '#E9ECF5',
                boxShadow: 'none',
              },
            }}
          >
            Не сохранять
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              saveDraftChanges();
              setSaveChangesDialogOpen(false);
              onClose();
            }}
            sx={{ ...primaryButtonSx, flex: 1, minWidth: 0, whiteSpace: 'nowrap' }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDeleteDialog
        open={deleteTaskDialogOpen}
        title="Удалить задачу?"
        message={`Вы уверены, что хотите удалить задачу "${task?.title}"? Это действие невозможно отменить.`}
        confirmButtonText="Удалить"
        cancelButtonText="Отмена"
        onConfirm={() => {
          if (task) {
            onDeleteTask(task.id);
            onClose();
          }
          setDeleteTaskDialogOpen(false);
        }}
        onCancel={() => setDeleteTaskDialogOpen(false)}
      />

      <ConfirmDeleteDialog
        open={deleteSubtaskDialogOpen}
        title="Удалить подзадачу?"
        message={`Вы уверены, что хотите удалить подзадачу "${subtaskToDelete?.title}"?`}
        confirmButtonText="Удалить"
        cancelButtonText="Отмена"
        onConfirm={() => {
          if (subtaskToDelete) {
            onDeleteSubtask(subtaskToDelete.taskId, subtaskToDelete.subtaskId);
          }
          setDeleteSubtaskDialogOpen(false);
          setSubtaskToDelete(null);
        }}
        onCancel={() => {
          setDeleteSubtaskDialogOpen(false);
          setSubtaskToDelete(null);
        }}
      />
    </Dialog>
  );
};

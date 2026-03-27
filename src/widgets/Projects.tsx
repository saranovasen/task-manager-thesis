import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../entities/project';
import type { ProjectItem } from '../entities/project';
import { CreateProjectButton } from '../features/create-project';
import { ProjectCard } from '../shared/cards/ProjectCard';
import { ConfirmDeleteDialog } from '../shared/dialogs';

type EditProjectForm = {
  title: string;
  link: string;
  dueDate: string;
};

export const Projects = () => {
  const { projects, addProject, removeProject, updateProject } = useProjects();
  const navigate = useNavigate();
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [deletingProject, setDeletingProject] = useState<ProjectItem | null>(null);
  const [editForm, setEditForm] = useState<EditProjectForm>({ title: '', link: '', dueDate: '' });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [actionError, setActionError] = useState('');

  const titleError = editForm.title.trim().length < 2 ? 'Минимум 2 символа' : '';

  const parseDueDateToInput = (value: string) => {
    const match = value.match(/^(?:до\s)?(\d{2})\.(\d{2})\.(\d{4})$/);
    if (!match) {
      return '';
    }

    const [, day, month, year] = match;
    return `${year}-${month}-${day}`;
  };

  const formatDueDate = (value: string) => {
    if (!value) {
      return undefined;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return undefined;
    }

    const day = String(parsed.getDate()).padStart(2, '0');
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const year = parsed.getFullYear();

    return `до ${day}.${month}.${year}`;
  };

  const openEditDialog = (project: ProjectItem) => {
    setEditingProject(project);
    setEditForm({
      title: project.title,
      link: project.link === '—' ? '' : project.link,
      dueDate: parseDueDateToInput(project.dueDate),
    });
    setSubmitAttempted(false);
  };

  const closeEditDialog = () => {
    setEditingProject(null);
    setEditForm({ title: '', link: '', dueDate: '' });
    setSubmitAttempted(false);
  };

  const handleSaveProject = async () => {
    setSubmitAttempted(true);
    setActionError('');

    if (!editingProject || titleError) {
      return;
    }

    try {
      await updateProject(editingProject.id, {
        title: editForm.title.trim(),
        link: editForm.link.trim() || undefined,
        dueDate: formatDueDate(editForm.dueDate),
      });

      closeEditDialog();
    } catch {
      setActionError('Не удалось сохранить проект. Проверьте авторизацию и backend.');
    }
  };

  const handleConfirmDeleteProject = async () => {
    if (!deletingProject) {
      return;
    }

    try {
      await removeProject(deletingProject.id);
      setDeletingProject(null);
    } catch {
      setActionError('Не удалось удалить проект. Проверьте авторизацию и backend.');
    }
  };

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

  return (
    <>
      <Box sx={{ mt: 3, width: '100%' }}>
        {actionError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {actionError}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 2.5 }}>
          <Typography sx={{ color: '#232360', fontSize: 24, fontWeight: 700 }}>Проекты</Typography>
          <CreateProjectButton onCreate={addProject} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {projects.map((project) => (
            <Box key={project.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ flex: 1 }}>
                <ProjectCard
                  title={project.title}
                  link={project.link}
                  tasks={project.tasks}
                  dueDate={project.dueDate}
                  progress={project.progress}
                  progressColor={project.progressColor}
                  onClick={() => navigate(`/projects/${project.id}/tasks`, { state: { project } })}
                  onEditClick={() => openEditDialog(project)}
                  onDeleteClick={() => setDeletingProject(project)}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Dialog
        open={Boolean(editingProject)}
        onClose={closeEditDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, color: '#232360', fontSize: 24, fontWeight: 600 }}>Редактировать проект</DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Название"
              value={editForm.title}
              onChange={(event) => setEditForm((prev) => ({ ...prev, title: event.target.value }))}
              fullWidth
              error={submitAttempted && Boolean(titleError)}
              helperText={submitAttempted ? titleError : ''}
              sx={fieldSx}
            />

            <TextField
              label="Ссылка"
              value={editForm.link}
              onChange={(event) => setEditForm((prev) => ({ ...prev, link: event.target.value }))}
              fullWidth
              placeholder="https://example.com"
              sx={fieldSx}
            />

            <TextField
              label="Дедлайн"
              type="date"
              value={editForm.dueDate}
              onChange={(event) => setEditForm((prev) => ({ ...prev, dueDate: event.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1.5 }}>
          <Button onClick={closeEditDialog} variant="contained" sx={secondaryButtonSx}>
            Отмена
          </Button>
          <Button
            onClick={() => {
              void handleSaveProject();
            }}
            variant="contained"
            sx={primaryButtonSx}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDeleteDialog
        open={Boolean(deletingProject)}
        title="Удалить проект?"
        message={`Вы уверены, что хотите удалить проект "${deletingProject?.title}"? Это действие невозможно отменить.`}
        confirmButtonText="Удалить"
        cancelButtonText="Отмена"
        onConfirm={() => {
          void handleConfirmDeleteProject();
        }}
        onCancel={() => setDeletingProject(null)}
      />
    </>
  );
};

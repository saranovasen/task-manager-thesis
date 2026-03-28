import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../entities/auth';
import { getProjects, type ProjectItem } from '../entities/project';
import { useProjectTasks, type ProjectTaskStatus } from '../entities/task';
import { TasksBoard } from '../widgets/TasksBoard';
import type { CreateTaskPayload } from '../features/create-task';

type TasksPageLocationState = {
  project?: ProjectItem;
};

export const TasksPage = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const state = location.state as TasksPageLocationState | null;
  const { accessToken, isAuthenticated, isLoading } = useAuth();

  const [project, setProject] = useState<ProjectItem | null>(state?.project ?? null);
  const [isProjectLoading, setIsProjectLoading] = useState(!state?.project && Boolean(projectId));
  const { tasks, addTask, updateTaskStatus, removeTask, addSubtask, toggleSubtask, renameSubtask, removeSubtask } =
    useProjectTasks(projectId);

  useEffect(() => {
    if (!projectId || state?.project || isLoading || !isAuthenticated || !accessToken) {
      return;
    }

    const loadProject = async () => {
      setIsProjectLoading(true);
      try {
        const projects = await getProjects(accessToken);
        setProject(projects.find((item) => item.id === projectId) ?? null);
      } finally {
        setIsProjectLoading(false);
      }
    };

    void loadProject();
  }, [projectId, state?.project, accessToken, isAuthenticated, isLoading]);

  if (!projectId) {
    return <Typography sx={{ color: '#232360', fontSize: 20, mt: 3 }}>Проект не выбран</Typography>;
  }

  if (isProjectLoading) {
    return (
      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#5051F9' }} />
      </Box>
    );
  }

  if (!project) {
    return <Typography sx={{ color: '#232360', fontSize: 20, mt: 3 }}>Проект не найден</Typography>;
  }

  const handleCreateTask = async (payload: CreateTaskPayload) => {
    const dueDate = payload.dateLabel === 'Срок не указан' ? undefined : payload.dateLabel;

    return addTask({
      title: payload.title,
      description: payload.description,
      status: payload.status,
      dueDate,
      category: payload.category,
      categoryColor: payload.categoryColor,
    });
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: ProjectTaskStatus) => {
    await updateTaskStatus(taskId, newStatus);
  };

  const handleTaskDelete = async (taskId: string) => {
    await removeTask(taskId);
  };

  const handleSubtaskCreate = async (taskId: string, title: string) => {
    await addSubtask(taskId, title);
  };

  const handleSubtaskToggle = async (taskId: string, subtaskId: string, isDone: boolean) => {
    await toggleSubtask(taskId, subtaskId, isDone);
  };

  const handleSubtaskRename = async (taskId: string, subtaskId: string, title: string) => {
    await renameSubtask(taskId, subtaskId, title);
  };

  const handleSubtaskDelete = async (taskId: string, subtaskId: string) => {
    await removeSubtask(taskId, subtaskId);
  };

  return (
    <Box sx={{ mt: 3, width: '100%' }}>
      <Typography sx={{ color: '#111111', fontSize: 30, fontWeight: 700, mb: 3, lineHeight: 1.1 }}>
        Задачи{' '}
        <Box component="span" sx={{ color: '#5051F9' }}>
          {project.title}
        </Box>
      </Typography>

      <TasksBoard
        tasks={tasks}
        onTaskCreate={handleCreateTask}
        onTaskStatusChange={handleTaskStatusChange}
        onTaskDelete={handleTaskDelete}
        onSubtaskCreate={handleSubtaskCreate}
        onSubtaskToggle={handleSubtaskToggle}
        onSubtaskRename={handleSubtaskRename}
        onSubtaskDelete={handleSubtaskDelete}
      />
    </Box>
  );
};

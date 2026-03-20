import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getProjects, type ProjectItem } from '../entities/project';
import { useProjectTasks } from '../entities/task';
import { TasksBoard } from '../widgets/TasksBoard';

type TasksPageLocationState = {
  project?: ProjectItem;
};

export const TasksPage = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const state = location.state as TasksPageLocationState | null;

  const [project, setProject] = useState<ProjectItem | null>(state?.project ?? null);
  const [isProjectLoading, setIsProjectLoading] = useState(!state?.project && Boolean(projectId));
  const { tasks } = useProjectTasks(projectId);

  useEffect(() => {
    if (!projectId || state?.project) {
      return;
    }

    const loadProject = async () => {
      setIsProjectLoading(true);
      const projects = await getProjects();
      setProject(projects.find((item) => item.id === projectId) ?? null);
      setIsProjectLoading(false);
    };

    void loadProject();
  }, [projectId, state?.project]);

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

  return (
    <Box sx={{ mt: 3, width: '100%' }}>
      <Typography sx={{ color: '#111111', fontSize: 30, fontWeight: 700, mb: 3, lineHeight: 1.1 }}>
        Задачи{' '}
        <Box component="span" sx={{ color: '#5051F9' }}>
          {project.title}
        </Box>
      </Typography>

      <TasksBoard tasks={tasks} />
    </Box>
  );
};

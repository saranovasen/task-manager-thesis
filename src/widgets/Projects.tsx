import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../entities/project';
import { CreateProjectButton } from '../features/create-project';
import { ProjectCard } from '../shared/cards/ProjectCard';

export const Projects = () => {
  const { projects, addProject } = useProjects();
  const navigate = useNavigate();

  return (
    <Box sx={{ mt: 3, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 2.5 }}>
        <Typography sx={{ color: '#232360', fontSize: 24, fontWeight: 700 }}>Проекты</Typography>
        <CreateProjectButton onCreate={addProject} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            link={project.link}
            tasks={project.tasks}
            dueDate={project.dueDate}
            progress={project.progress}
            progressColor={project.progressColor}
            onClick={() => navigate(`/projects/${project.id}/tasks`, { state: { project } })}
          />
        ))}
      </Box>
    </Box>
  );
};

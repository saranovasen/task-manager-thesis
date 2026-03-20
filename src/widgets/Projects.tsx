import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import AlarmRoundedIcon from '@mui/icons-material/AlarmRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { useProjects } from '../entities/project';

export const Projects = () => {
  const { projects } = useProjects();

  return (
    <Box sx={{ mt: 3, width: '100%' }}>
      <Typography sx={{ color: '#232360', fontSize: 24, fontWeight: 700, mb: 2.5 }}>Проекты</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {projects.map((project) => (
          <Box
            key={project.id}
            sx={{
              bgcolor: '#FFFFFF',
              borderRadius: 3,
              p: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 3,
            }}
          >
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ color: '#232360', fontSize: 18, fontWeight: 500, mb: 2 }}>{project.title}</Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap', color: '#8C97AE' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinkRoundedIcon sx={{ fontSize: 22 }} />
                  <Typography sx={{ color: '#5051F9', fontSize: 15 }}>{project.link}</Typography>
                </Box>

                <Box sx={{ width: '1px', height: 32, bgcolor: '#E2E7EF' }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DescriptionOutlinedIcon sx={{ fontSize: 22 }} />
                  <Typography sx={{ color: '#6F7F99', fontSize: 15 }}>{project.tasks} задач</Typography>
                </Box>

                <Box sx={{ width: '1px', height: 32, bgcolor: '#E2E7EF' }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeRoundedIcon sx={{ fontSize: 22 }} />
                  <Typography sx={{ color: '#6F7F99', fontSize: 15 }}>{project.dueDate}</Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ minWidth: 150 }}>
              <Typography sx={{ color: '#232360', fontSize: 18, fontWeight: 500, mb: 1.5 }}>
                Прогресс {project.progress}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={project.progress}
                sx={{
                  height: 10,
                  borderRadius: 99,
                  bgcolor: '#D7DCE5',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 99,
                    backgroundColor: project.progressColor,
                  },
                }}
              />
            </Box>

            <Button
              variant="contained"
              startIcon={<AlarmRoundedIcon />}
              sx={{
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
              }}
            >
              Напомнить
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

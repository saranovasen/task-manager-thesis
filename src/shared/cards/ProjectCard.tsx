import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import AlarmRoundedIcon from '@mui/icons-material/AlarmRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

type ProjectCardProps = {
  title: string;
  link: string;
  tasks: number;
  dueDate: string;
  progress: number;
  progressColor: string;
  onClick?: () => void;
  onRemindClick?: () => void;
};

export const ProjectCard = ({
  title,
  link,
  tasks,
  dueDate,
  progress,
  progressColor,
  onClick,
  onRemindClick,
}: ProjectCardProps) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        bgcolor: '#FFFFFF',
        borderRadius: 3,
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 3,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{ color: '#232360', fontSize: 18, fontWeight: 500, mb: 2 }}>{title}</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap', color: '#8C97AE' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinkRoundedIcon sx={{ fontSize: 22 }} />
            <Typography sx={{ color: '#5051F9', fontSize: 15 }}>{link}</Typography>
          </Box>

          <Box sx={{ width: '1px', height: 32, bgcolor: '#E2E7EF' }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DescriptionOutlinedIcon sx={{ fontSize: 22 }} />
            <Typography sx={{ color: '#6F7F99', fontSize: 15 }}>{tasks} задач</Typography>
          </Box>

          <Box sx={{ width: '1px', height: 32, bgcolor: '#E2E7EF' }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeRoundedIcon sx={{ fontSize: 22 }} />
            <Typography sx={{ color: '#6F7F99', fontSize: 15 }}>{dueDate}</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ minWidth: 150 }}>
        <Typography sx={{ color: '#232360', fontSize: 18, fontWeight: 500, mb: 1.5 }}>Прогресс {progress}%</Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 10,
            borderRadius: 99,
            bgcolor: '#D7DCE5',
            '& .MuiLinearProgress-bar': {
              borderRadius: 99,
              backgroundColor: progressColor,
            },
          }}
        />
      </Box>

      <Button
        variant="contained"
        startIcon={<AlarmRoundedIcon />}
        onClick={(event) => {
          event.stopPropagation();
          onRemindClick?.();
        }}
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
  );
};

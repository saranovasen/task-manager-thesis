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
  onDeleteClick?: () => void;
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
  onDeleteClick,
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

      <Button
        variant="contained"
        onClick={(event) => {
          event.stopPropagation();
          onDeleteClick?.();
        }}
        sx={{
          minWidth: 48,
          height: 39,
          width: 39,
          p: 0,
          borderRadius: 2.5,
          textTransform: 'none',
          fontSize: 15,
          fontWeight: 500,
          bgcolor: '#FFE8E8',
          color: '#FF5757',
          boxShadow: 'none',
          '&:hover': {
            bgcolor: '#FFD6D6',
            boxShadow: 'none',
          },
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </Button>
    </Box>
  );
};

import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import AlarmRoundedIcon from '@mui/icons-material/AlarmRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

type ProjectCardProps = {
  title: string;
  link: string;
  tasks: number;
  dueDate: string;
  progress: number;
  progressColor: string;
  onClick?: () => void;
  onRemindClick?: () => void;
  onEditClick?: () => void;
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
  onEditClick,
  onDeleteClick,
}: ProjectCardProps) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(menuAnchor);

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography sx={{ color: '#232360', fontSize: 18, fontWeight: 500, flex: 1 }}>{title}</Typography>
          {(onEditClick || onDeleteClick) && (
            <>
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  setMenuAnchor(event.currentTarget);
                }}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  color: '#B7BED0',
                  '&:hover': {
                    color: '#6F7F99',
                    bgcolor: '#F7F8FF',
                  },
                }}
              >
                <MoreHorizRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>

              <Menu
                anchorEl={menuAnchor}
                open={isMenuOpen}
                onClose={() => setMenuAnchor(null)}
                onClick={(event) => event.stopPropagation()}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    boxShadow: '0 10px 30px rgba(31,37,100,0.12)',
                    border: '1px solid #ECEFFC',
                  },
                }}
              >
                {onEditClick && (
                  <MenuItem
                    onClick={() => {
                      setMenuAnchor(null);
                      onEditClick();
                    }}
                    sx={{
                      color: '#232360',
                      fontSize: 14,
                    }}
                  >
                    Редактировать
                  </MenuItem>
                )}

                {onDeleteClick && (
                  <MenuItem
                    onClick={() => {
                      setMenuAnchor(null);
                      onDeleteClick();
                    }}
                    sx={{
                      color: '#E15858',
                      fontSize: 14,
                    }}
                  >
                    Удалить проект
                  </MenuItem>
                )}
              </Menu>
            </>
          )}
        </Box>

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
        <Typography sx={{ color: '#232360', fontSize: 18, fontWeight: 500, mb: 1.5 }}>
          {progress === -1 ? 'Нет задач' : `Прогресс ${progress}%`}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress === -1 ? 0 : progress}
          sx={{
            height: 10,
            borderRadius: 99,
            bgcolor: progress === -1 ? '#E2E7EF' : '#D7DCE5',
            '& .MuiLinearProgress-bar': {
              borderRadius: 99,
              backgroundColor: progress === -1 ? '#B7BED0' : progressColor,
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

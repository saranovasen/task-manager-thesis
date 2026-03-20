import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import type { ProjectTaskItem, ProjectTaskStatus } from '../entities/task';
import { TaskBoardCard } from '../shared/cards/TaskBoardCard';

const columnMeta: Array<{ key: ProjectTaskStatus; label: string }> = [
  { key: 'queue', label: 'Очередь' },
  { key: 'in-progress', label: 'В работе' },
  { key: 'review', label: 'На проверке' },
  { key: 'done', label: 'Готово' },
];

type TasksBoardProps = {
  tasks: ProjectTaskItem[];
};

export const TasksBoard = ({ tasks }: TasksBoardProps) => {
  const tasksByStatus = useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        acc[task.status].push(task);
        return acc;
      },
      {
        queue: [],
        'in-progress': [],
        review: [],
        done: [],
      } as Record<ProjectTaskStatus, ProjectTaskItem[]>
    );
  }, [tasks]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: 2,
        alignItems: 'start',
        width: '100%',
        minWidth: 0,
      }}
    >
      {columnMeta.map((column) => (
        <Box key={column.key} sx={{ minWidth: 0 }}>
          <Box
            sx={{
              height: 48,
              borderRadius: 2,
              bgcolor: '#FFFFFF',
              px: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1.5,
            }}
          >
            <Typography sx={{ color: '#1F2564', fontSize: 16, fontWeight: 500 }}>{column.label}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton size="small" sx={{ color: '#6F7F99' }}>
                <MoreHorizRoundedIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ bgcolor: '#E9EBFE', color: '#5051F9', '&:hover': { bgcolor: '#DBDFFC' } }}>
                <AddRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Stack spacing={1.5}>
            {tasksByStatus[column.key].map((task) => (
              <TaskBoardCard key={task.id} task={task} />
            ))}

            {tasksByStatus[column.key].length === 0 && (
              <Box sx={{ bgcolor: '#FFFFFF', borderRadius: 2.5, p: 2 }}>
                <Typography sx={{ color: '#9AA5BC', fontSize: 14 }}>Нет задач</Typography>
              </Box>
            )}
          </Stack>
        </Box>
      ))}
    </Box>
  );
};

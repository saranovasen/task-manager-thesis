import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useDroppable } from '@dnd-kit/core';
import type { ProjectTaskItem, ProjectTaskStatus } from '../entities/task';
import { DraggableTaskCard } from './DraggableTaskCard';

type DroppableColumnProps = {
  columnId: ProjectTaskStatus;
  label: string;
  tasks: ProjectTaskItem[];
  onAddSubtask?: (taskId: string) => void;
  onOpenTask?: (taskId: string) => void;
};

export const DroppableColumn = ({ columnId, label, tasks, onAddSubtask, onOpenTask }: DroppableColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
  });

  return (
    <Box ref={setNodeRef} sx={{ minWidth: 0, height: '100%' }}>
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
        <Typography sx={{ color: '#1F2564', fontSize: 16, fontWeight: 500 }}>{label}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" sx={{ color: '#6F7F99' }}>
            <MoreHorizRoundedIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ bgcolor: '#E9EBFE', color: '#5051F9', '&:hover': { bgcolor: '#DBDFFC' } }}>
            <AddRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Stack
        spacing={1.5}
        sx={{
          minHeight: 200,
          p: 0,
          alignItems: 'stretch',
          borderRadius: 2,
          backgroundColor: isOver ? '#E9EBFE' : 'transparent',
          border: isOver ? '2px dashed #5051F9' : '2px solid transparent',
          transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
        }}
      >
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <DraggableTaskCard key={task.id} task={task} onAddSubtask={onAddSubtask} onOpenTask={onOpenTask} />
          ))
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: 150,
            }}
          >
            <Typography sx={{ color: '#9AA5BC', fontSize: 14 }}>Нет задач</Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

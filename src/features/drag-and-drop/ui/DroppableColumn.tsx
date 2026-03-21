import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useDroppable } from '@dnd-kit/core';
import { Fragment } from 'react';
import type { ProjectTaskItem, ProjectTaskStatus } from '../../../entities/task';
import { DraggableTaskCard } from './DraggableTaskCard';

type DroppableColumnProps = {
  columnId: ProjectTaskStatus;
  label: string;
  tasks: ProjectTaskItem[];
  onAddTask?: (status: ProjectTaskStatus) => void;
  onAddSubtask?: (taskId: string) => void;
  onOpenTask?: (taskId: string) => void;
  onEditDeadline?: (taskId: string, nextDate: string) => void;
  placeholderIndex?: number | null;
};

export const DroppableColumn = ({
  columnId,
  label,
  tasks,
  onAddTask,
  onAddSubtask,
  onOpenTask,
  onEditDeadline,
  placeholderIndex,
}: DroppableColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
  });

  const normalizedPlaceholderIndex =
    typeof placeholderIndex === 'number' ? Math.min(Math.max(placeholderIndex, 0), tasks.length) : null;

  const renderPlaceholder = () => (
    <Box
      sx={{
        height: 92,
        borderRadius: 2.5,
        border: '2px dashed #8D98FF',
        bgcolor: '#EEF0FF',
      }}
    />
  );

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
          <IconButton
            size="small"
            onClick={() => onAddTask?.(columnId)}
            sx={{ bgcolor: '#E9EBFE', color: '#5051F9', '&:hover': { bgcolor: '#DBDFFC' } }}
          >
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
        {tasks.length > 0 || normalizedPlaceholderIndex !== null ? (
          <>
            {tasks.map((task, index) => (
              <Fragment key={task.id}>
                {normalizedPlaceholderIndex === index && renderPlaceholder()}
                <DraggableTaskCard
                  task={task}
                  onAddSubtask={onAddSubtask}
                  onOpenTask={onOpenTask}
                  onEditDeadline={onEditDeadline}
                />
              </Fragment>
            ))}

            {normalizedPlaceholderIndex === tasks.length && renderPlaceholder()}
          </>
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

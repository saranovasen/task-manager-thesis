import Box from '@mui/material/Box';
import { useDraggable } from '@dnd-kit/core';
import type { ProjectTaskItem } from '../entities/task';
import { TaskBoardCard } from '../shared/cards/TaskBoardCard';

type DraggableTaskCardProps = {
  task: ProjectTaskItem;
};

export const DraggableTaskCard = ({ task }: DraggableTaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
        willChange: isDragging ? 'transform, opacity' : 'auto',
        width: '100%',
        alignSelf: 'stretch',
        display: 'block',
        boxSizing: 'border-box',
      }}
    >
      <TaskBoardCard task={task} />
    </Box>
  );
};

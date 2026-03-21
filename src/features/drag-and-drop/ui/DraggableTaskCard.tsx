import Box from '@mui/material/Box';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import type { ProjectTaskItem } from '../../../entities/task';
import { TaskBoardCard } from '../../../shared/cards/TaskBoardCard';

type DraggableTaskCardProps = {
  task: ProjectTaskItem;
  onAddSubtask?: (taskId: string) => void;
  onOpenTask?: (taskId: string) => void;
  onEditDeadline?: (taskId: string, nextDate: string) => void;
};

export const DraggableTaskCard = ({ task, onAddSubtask, onOpenTask, onEditDeadline }: DraggableTaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });
  const { setNodeRef: setDropNodeRef } = useDroppable({
    id: `task-drop-${task.id}`,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <Box
      ref={(node: HTMLElement | null) => {
        setNodeRef(node);
        setDropNodeRef(node);
      }}
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
      <TaskBoardCard
        task={task}
        onAddSubtask={onAddSubtask}
        onEditDeadline={onEditDeadline}
        onOpen={(taskId) => {
          if (!isDragging) {
            onOpenTask?.(taskId);
          }
        }}
      />
    </Box>
  );
};

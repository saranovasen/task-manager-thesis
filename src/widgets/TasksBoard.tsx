import Box from '@mui/material/Box';
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent, closestCorners } from '@dnd-kit/core';
import { useMemo, useState, useEffect } from 'react';
import type { ProjectTaskItem, ProjectTaskStatus } from '../entities/task';
import { DroppableColumn } from './DroppableColumn';

const columnMeta: Array<{ key: ProjectTaskStatus; label: string }> = [
  { key: 'queue', label: 'Очередь' },
  { key: 'in-progress', label: 'В работе' },
  { key: 'review', label: 'На проверке' },
  { key: 'done', label: 'Готово' },
];

type TasksBoardProps = {
  tasks: ProjectTaskItem[];
  onTaskStatusChange?: (taskId: string, newStatus: ProjectTaskStatus) => void;
};

export const TasksBoard = ({ tasks, onTaskStatusChange }: TasksBoardProps) => {
  const [localTasks, setLocalTasks] = useState<ProjectTaskItem[]>(tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const tasksByStatus = useMemo(() => {
    return localTasks.reduce(
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
  }, [localTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const draggedTaskId = active.id as string;
    const targetColumnId = over.id as string;

    const draggedTask = localTasks.find((t) => t.id === draggedTaskId);
    if (!draggedTask || !columnMeta.find((col) => col.key === targetColumnId)) {
      return;
    }

    const newStatus = targetColumnId as ProjectTaskStatus;
    if (draggedTask.status === newStatus) {
      return;
    }

    const updatedTasks = localTasks.map((task) => (task.id === draggedTaskId ? { ...task, status: newStatus } : task));

    setLocalTasks(updatedTasks);
    onTaskStatusChange?.(draggedTaskId, newStatus);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
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
          <DroppableColumn
            key={column.key}
            columnId={column.key}
            label={column.label}
            tasks={tasksByStatus[column.key]}
          />
        ))}
      </Box>
    </DndContext>
  );
};

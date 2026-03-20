import Box from '@mui/material/Box';
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent, closestCorners } from '@dnd-kit/core';
import { useMemo, useState, useEffect } from 'react';
import type { ProjectTaskItem, ProjectTaskStatus } from '../entities/task';
import { DroppableColumn } from './DroppableColumn';
import { TaskDetailsDialog } from './TaskDetailsDialog';

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
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

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

  const addSubtaskToTask = (task: ProjectTaskItem, title: string): ProjectTaskItem => {
    const done = Math.max(0, task.checklistDone ?? 0);
    const total = Math.max(done, task.checklistTotal ?? 0);

    const fallbackSubtasks = Array.from({ length: total }, (_, index) => ({
      id: `${task.id}-legacy-${index + 1}`,
      title: `Подзадача ${index + 1}`,
      isDone: index < done,
    }));

    const nextSubtasks = [
      ...(task.subtasks ?? fallbackSubtasks),
      {
        id: `${task.id}-sub-${Date.now()}`,
        title,
        isDone: false,
      },
    ];

    return {
      ...task,
      subtasks: nextSubtasks,
      checklistDone: undefined,
      checklistTotal: undefined,
    };
  };

  const handleAddSubtask = (taskId: string) => {
    const title = window.prompt('Введите название подзадачи');
    if (!title || !title.trim()) {
      return;
    }

    const subtaskTitle = title.trim();

    setLocalTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        return addSubtaskToTask(task, subtaskTitle);
      })
    );
  };

  const handleAddSubtaskFromDialog = (taskId: string, title: string) => {
    setLocalTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        return addSubtaskToTask(task, title);
      })
    );
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setLocalTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        const done = Math.max(0, task.checklistDone ?? 0);
        const total = Math.max(done, task.checklistTotal ?? 0);
        const fallbackSubtasks = Array.from({ length: total }, (_, index) => ({
          id: `${task.id}-legacy-${index + 1}`,
          title: `Подзадача ${index + 1}`,
          isDone: index < done,
        }));

        const sourceSubtasks = task.subtasks ?? fallbackSubtasks;

        return {
          ...task,
          subtasks: sourceSubtasks.map((subtask) =>
            subtask.id === subtaskId ? { ...subtask, isDone: !subtask.isDone } : subtask
          ),
          checklistDone: undefined,
          checklistTotal: undefined,
        };
      })
    );
  };

  const selectedTask = useMemo(
    () => localTasks.find((task) => task.id === selectedTaskId) ?? null,
    [localTasks, selectedTaskId]
  );

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
            onAddSubtask={handleAddSubtask}
            onOpenTask={setSelectedTaskId}
          />
        ))}
      </Box>

      <TaskDetailsDialog
        open={Boolean(selectedTaskId)}
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onAddSubtask={handleAddSubtaskFromDialog}
        onToggleSubtask={handleToggleSubtask}
      />
    </DndContext>
  );
};

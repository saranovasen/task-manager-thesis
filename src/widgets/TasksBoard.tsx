import Box from '@mui/material/Box';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragCancelEvent,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  closestCorners,
} from '@dnd-kit/core';
import { useMemo, useState, useEffect } from 'react';
import type { ProjectTaskItem, ProjectTaskStatus } from '../entities/task';
import { createSubtask, CreateSubtaskDialog } from '../features/create-subtask';
import { createTask, CreateTaskDialog, type CreateTaskPayload } from '../features/create-task';
import { DroppableColumn } from '../features/drag-and-drop';
import { TaskBoardCard } from '../shared/cards/TaskBoardCard';
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
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [createTaskStatus, setCreateTaskStatus] = useState<ProjectTaskStatus>('queue');
  const [createSubtaskTaskId, setCreateSubtaskTaskId] = useState<string | null>(null);
  const [activeDragTaskId, setActiveDragTaskId] = useState<string | null>(null);
  const [currentOverId, setCurrentOverId] = useState<string | null>(null);
  const [insertAfterOverTask, setInsertAfterOverTask] = useState(false);
  const [dragOverlayWidth, setDragOverlayWidth] = useState<number | null>(null);

  const formatDateLabel = (value: Date) =>
    value.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    if (!activeDragTaskId) {
      return localTasks;
    }

    return localTasks.filter((task) => task.id !== activeDragTaskId);
  }, [localTasks, activeDragTaskId]);

  const tasksByStatus = useMemo(() => {
    return visibleTasks.reduce(
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
  }, [visibleTasks]);

  const activeDragTask = useMemo(
    () => localTasks.find((task) => task.id === activeDragTaskId) ?? null,
    [localTasks, activeDragTaskId]
  );

  const shouldInsertAfterTask = (
    overId: string | null,
    activeRect?: { top: number; height: number } | null,
    overRect?: { top: number; height: number } | null
  ) => {
    if (!overId || !overId.startsWith('task-drop-') || !activeRect || !overRect) {
      return false;
    }

    const activeCenterY = activeRect.top + activeRect.height / 2;
    const overCenterY = overRect.top + overRect.height / 2;
    return activeCenterY > overCenterY;
  };

  const getPlaceholderIndex = (columnId: ProjectTaskStatus): number | null => {
    if (!activeDragTaskId || !currentOverId) {
      return null;
    }

    const overIsColumn = columnMeta.some((column) => column.key === currentOverId);
    const overIsTask = currentOverId.startsWith('task-drop-');

    if (!overIsColumn && !overIsTask) {
      return null;
    }

    const columnTasks = tasksByStatus[columnId];

    if (overIsColumn) {
      return currentOverId === columnId ? columnTasks.length : null;
    }

    const overTaskId = currentOverId.replace('task-drop-', '');
    const overTask = visibleTasks.find((task) => task.id === overTaskId);

    if (!overTask || overTask.status !== columnId) {
      return null;
    }

    const index = columnTasks.findIndex((task) => task.id === overTaskId);
    if (index < 0) {
      return columnTasks.length;
    }

    return Math.min(index + (insertAfterOverTask ? 1 : 0), columnTasks.length);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragTaskId(event.active.id as string);
    setCurrentOverId(null);
    setInsertAfterOverTask(false);
    const initialWidth = event.active.rect.current.initial?.width;
    setDragOverlayWidth(typeof initialWidth === 'number' ? initialWidth : null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const overId = (event.over?.id as string | undefined) ?? null;
    setCurrentOverId(overId);

    const activeRect = event.active.rect.current.translated ?? event.active.rect.current.initial;
    const overRect = event.over?.rect;
    setInsertAfterOverTask(shouldInsertAfterTask(overId, activeRect, overRect));
  };

  const handleDragCancel = (_event: DragCancelEvent) => {
    setActiveDragTaskId(null);
    setCurrentOverId(null);
    setInsertAfterOverTask(false);
    setDragOverlayWidth(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const finishDrag = () => {
      setActiveDragTaskId(null);
      setCurrentOverId(null);
      setInsertAfterOverTask(false);
      setDragOverlayWidth(null);
    };

    if (!over) {
      finishDrag();
      return;
    }

    const draggedTaskId = active.id as string;
    const overId = over.id as string;
    const isColumnDrop = columnMeta.some((col) => col.key === overId);
    const isTaskDrop = overId.startsWith('task-drop-');

    const draggedTask = localTasks.find((t) => t.id === draggedTaskId);
    if (!draggedTask || (!isColumnDrop && !isTaskDrop)) {
      return;
    }

    const targetTaskId = isTaskDrop ? overId.replace('task-drop-', '') : null;
    if (targetTaskId === draggedTaskId) {
      finishDrag();
      return;
    }

    const targetTask = targetTaskId ? localTasks.find((task) => task.id === targetTaskId) : null;
    const nextStatus = isColumnDrop ? (overId as ProjectTaskStatus) : targetTask?.status;

    if (!nextStatus) {
      finishDrag();
      return;
    }

    setLocalTasks((prevTasks) => {
      const sourceIndex = prevTasks.findIndex((task) => task.id === draggedTaskId);
      if (sourceIndex < 0) {
        return prevTasks;
      }

      const sourceTask = prevTasks[sourceIndex];
      const movedTask: ProjectTaskItem =
        sourceTask.status === nextStatus ? sourceTask : { ...sourceTask, status: nextStatus };

      const withoutSource = prevTasks.filter((task) => task.id !== draggedTaskId);

      if (targetTaskId) {
        const targetIndex = withoutSource.findIndex((task) => task.id === targetTaskId);
        if (targetIndex < 0) {
          return prevTasks;
        }

        const activeRect = active.rect.current.translated ?? active.rect.current.initial;
        const shouldInsertAfter = shouldInsertAfterTask(overId, activeRect, over.rect);
        const insertIndex = Math.min(targetIndex + (shouldInsertAfter ? 1 : 0), withoutSource.length);

        const reordered = [...withoutSource];
        reordered.splice(insertIndex, 0, movedTask);
        return reordered;
      }

      const reordered = [...withoutSource];
      const lastIndexInColumn = reordered.reduce((lastIndex, task, index) => {
        if (task.status === nextStatus) {
          return index;
        }
        return lastIndex;
      }, -1);

      reordered.splice(lastIndexInColumn + 1, 0, movedTask);
      return reordered;
    });

    if (draggedTask.status !== nextStatus) {
      onTaskStatusChange?.(draggedTaskId, nextStatus);
    }

    finishDrag();
  };

  const handleAddTask = (status: ProjectTaskStatus) => {
    setCreateTaskStatus(status);
    setIsCreateTaskOpen(true);
  };

  const handleCreateTask = (payload: CreateTaskPayload) => {
    const baseTask = localTasks[0];

    const newTask: ProjectTaskItem = createTask({
      projectId: baseTask?.projectId ?? '1',
      payload,
    });

    setLocalTasks((prev) => [newTask, ...prev]);
    setIsCreateTaskOpen(false);
    setSelectedTaskId(newTask.id);
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
      createSubtask({ taskId: task.id, payload: { title } }),
    ];

    return {
      ...task,
      subtasks: nextSubtasks,
      checklistDone: undefined,
      checklistTotal: undefined,
    };
  };

  const handleAddSubtask = (taskId: string) => {
    setCreateSubtaskTaskId(taskId);
  };

  const handleCreateSubtask = (title: string) => {
    if (!createSubtaskTaskId) {
      return;
    }

    setLocalTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== createSubtaskTaskId) {
          return task;
        }

        return addSubtaskToTask(task, title);
      })
    );

    setCreateSubtaskTaskId(null);
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

  const handleEditDeadline = (taskId: string, nextDate: string) => {
    setLocalTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        if (!nextDate) {
          return {
            ...task,
            dateLabel: 'Срок не указан',
          };
        }

        const parsed = new Date(nextDate);
        if (Number.isNaN(parsed.getTime())) {
          return task;
        }

        return {
          ...task,
          dateLabel: formatDateLabel(parsed),
        };
      })
    );
  };

  const handleChangeDescription = (taskId: string, nextDescription: string) => {
    setLocalTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        return {
          ...task,
          description: nextDescription,
        };
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setLocalTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
  };

  const handleChangeCategoryColor = (taskId: string, nextColor: string) => {
    setLocalTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        return {
          ...task,
          categoryColor: nextColor,
        };
      })
    );
  };

  const handleChangeCategory = (taskId: string, nextCategory: string) => {
    setLocalTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        return {
          ...task,
          category: nextCategory,
        };
      })
    );
  };

  const handleDeleteSubtask = (taskId: string, subtaskId: string) => {
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
          subtasks: sourceSubtasks.filter((subtask) => subtask.id !== subtaskId),
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

  const createSubtaskTask = useMemo(
    () => localTasks.find((task) => task.id === createSubtaskTaskId) ?? null,
    [localTasks, createSubtaskTaskId]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
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
            onAddTask={handleAddTask}
            onAddSubtask={handleAddSubtask}
            onOpenTask={setSelectedTaskId}
            onEditDeadline={handleEditDeadline}
            placeholderIndex={getPlaceholderIndex(column.key)}
          />
        ))}
      </Box>

      <DragOverlay>
        {activeDragTask ? (
          <Box sx={{ width: dragOverlayWidth ? `${dragOverlayWidth}px` : undefined, opacity: 0.95 }}>
            <TaskBoardCard task={activeDragTask} />
          </Box>
        ) : null}
      </DragOverlay>

      <TaskDetailsDialog
        open={Boolean(selectedTaskId)}
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onAddSubtask={handleAddSubtaskFromDialog}
        onToggleSubtask={handleToggleSubtask}
        onChangeDeadline={handleEditDeadline}
        onChangeDescription={handleChangeDescription}
        onChangeCategory={handleChangeCategory}
        onChangeCategoryColor={handleChangeCategoryColor}
        onDeleteSubtask={handleDeleteSubtask}
        onDeleteTask={handleDeleteTask}
      />

      <CreateTaskDialog
        open={isCreateTaskOpen}
        status={createTaskStatus}
        onClose={() => setIsCreateTaskOpen(false)}
        onCreate={handleCreateTask}
      />

      <CreateSubtaskDialog
        open={Boolean(createSubtaskTaskId)}
        taskTitle={createSubtaskTask?.title}
        onClose={() => setCreateSubtaskTaskId(null)}
        onCreate={(payload) => handleCreateSubtask(payload.title)}
      />
    </DndContext>
  );
};

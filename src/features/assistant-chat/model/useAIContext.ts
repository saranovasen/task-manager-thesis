import { useMemo } from 'react';

export type AIContextData = {
  activeTasks?: number;
  activeProjects?: number;
  userId?: string;
  tasksWithDeadlines?: number;
  completedTasksToday?: number;
  pendingTasks?: number;
};

export const useAIContext = (data?: AIContextData) => {
  const context = useMemo(
    () => ({
      activeTasks: data?.activeTasks,
      activeProjects: data?.activeProjects,
      userId: data?.userId,
      tasksWithDeadlines: data?.tasksWithDeadlines,
      completedTasksToday: data?.completedTasksToday,
      pendingTasks: data?.pendingTasks,
    }),
    [data]
  );

  const contextSummary = useMemo(() => {
    const parts: string[] = [];
    if (data?.userId) parts.push(`User: ${data.userId}`);
    if (data?.activeTasks) parts.push(`${data.activeTasks} active tasks`);
    if (data?.activeProjects) parts.push(`${data.activeProjects} projects`);
    if (data?.tasksWithDeadlines) parts.push(`${data.tasksWithDeadlines} with deadlines`);
    return parts.join(', ');
  }, [data]);

  return { context, contextSummary };
};

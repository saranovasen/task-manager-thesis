import { useEffect, useState } from 'react';
import { useAuth } from '../../auth';
import { createTaskRequest } from '../api/createTask';
import { deleteTask } from '../api/deleteTask';
import { getProjectTasks } from '../api/getProjectTasks';
import { updateTaskRequest } from '../api/updateTask';
import type { ProjectTaskItem } from './types';
import type { ProjectTaskStatus } from './types';

export const useProjectTasks = (projectId?: string) => {
  const { accessToken, isAuthenticated, isLoading } = useAuth();
  const [tasks, setTasks] = useState<ProjectTaskItem[]>([]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!projectId || !accessToken || !isAuthenticated) {
      setTasks([]);
      return;
    }

    const loadTasks = async () => {
      try {
        const data = await getProjectTasks(projectId, accessToken);
        setTasks(data);
      } catch {
        setTasks([]);
      }
    };

    void loadTasks();
  }, [projectId, accessToken, isAuthenticated, isLoading]);

  const addTask = async (payload: {
    title: string;
    description?: string;
    status?: ProjectTaskStatus;
    dueDate?: string;
    category?: string;
    categoryColor?: string;
  }) => {
    if (!projectId || !accessToken || !isAuthenticated) {
      throw new Error('Unauthorized');
    }

    const createdTask = await createTaskRequest(projectId, payload, accessToken);
    setTasks((prevTasks) => [createdTask, ...prevTasks]);
    window.dispatchEvent(new CustomEvent('tasks:changed'));
    return createdTask;
  };

  const updateTaskStatus = async (taskId: string, status: ProjectTaskStatus) => {
    if (!accessToken || !isAuthenticated) {
      throw new Error('Unauthorized');
    }

    const updatedTask = await updateTaskRequest(taskId, { status }, accessToken);
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? updatedTask : task)));
    window.dispatchEvent(new CustomEvent('tasks:changed'));
    return updatedTask;
  };

  const removeTask = async (taskId: string) => {
    if (!accessToken || !isAuthenticated) {
      throw new Error('Unauthorized');
    }

    await deleteTask(taskId, accessToken);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    window.dispatchEvent(new CustomEvent('tasks:changed'));
  };

  return { tasks, addTask, updateTaskStatus, removeTask };
};

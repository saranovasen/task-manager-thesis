import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../auth';
import { createTaskRequest } from '../api/createTask';
import { createSubtaskRequest } from '../api/createSubtask';
import { deleteTask } from '../api/deleteTask';
import { deleteSubtask } from '../api/deleteSubtask';
import { getProjectTasks } from '../api/getProjectTasks';
import { updateSubtaskRequest } from '../api/updateSubtask';
import { updateTaskRequest } from '../api/updateTask';
import type { ProjectTaskItem } from './types';
import type { ProjectTaskStatus } from './types';

export const useProjectTasks = (projectId?: string) => {
  const { accessToken, isAuthenticated, isLoading } = useAuth();
  const [tasks, setTasks] = useState<ProjectTaskItem[]>([]);

  const loadTasks = useCallback(async () => {
    if (!projectId || !accessToken || !isAuthenticated) {
      setTasks([]);
      return;
    }

    try {
      const data = await getProjectTasks(projectId, accessToken);
      setTasks(data);
    } catch {
      setTasks([]);
    }
  }, [projectId, accessToken, isAuthenticated]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!projectId || !accessToken || !isAuthenticated) {
      setTasks([]);
      return;
    }

    void loadTasks();
  }, [projectId, accessToken, isAuthenticated, isLoading, loadTasks]);

  useEffect(() => {
    const handleTasksChanged = () => {
      void loadTasks();
    };

    window.addEventListener('tasks:changed', handleTasksChanged);

    return () => {
      window.removeEventListener('tasks:changed', handleTasksChanged);
    };
  }, [loadTasks]);

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

  const addSubtask = async (taskId: string, title: string) => {
    if (!accessToken || !isAuthenticated) {
      throw new Error('Unauthorized');
    }

    const updatedTask = await createSubtaskRequest(taskId, title, accessToken);
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? updatedTask : task)));
    return updatedTask;
  };

  const toggleSubtask = async (taskId: string, subtaskId: string, isDone: boolean) => {
    if (!accessToken || !isAuthenticated) {
      throw new Error('Unauthorized');
    }

    const updatedTask = await updateSubtaskRequest(taskId, subtaskId, { isDone }, accessToken);
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? updatedTask : task)));
    return updatedTask;
  };

  const renameSubtask = async (taskId: string, subtaskId: string, title: string) => {
    if (!accessToken || !isAuthenticated) {
      throw new Error('Unauthorized');
    }

    const updatedTask = await updateSubtaskRequest(taskId, subtaskId, { title }, accessToken);
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? updatedTask : task)));
    return updatedTask;
  };

  const removeSubtask = async (taskId: string, subtaskId: string) => {
    if (!accessToken || !isAuthenticated) {
      throw new Error('Unauthorized');
    }

    const updatedTask = await deleteSubtask(taskId, subtaskId, accessToken);
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? updatedTask : task)));
    return updatedTask;
  };

  return { tasks, addTask, updateTaskStatus, removeTask, addSubtask, toggleSubtask, renameSubtask, removeSubtask };
};

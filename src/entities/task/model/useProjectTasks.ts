import { useEffect, useState } from 'react';
import { useAuth } from '../../auth';
import { getProjectTasks } from '../api/getProjectTasks';
import type { ProjectTaskItem } from './types';

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

  return { tasks };
};

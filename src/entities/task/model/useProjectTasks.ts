import { useEffect, useState } from 'react';
import { getProjectTasks } from '../api/getProjectTasks';
import type { ProjectTaskItem } from './types';

export const useProjectTasks = (projectId?: string) => {
  const [tasks, setTasks] = useState<ProjectTaskItem[]>([]);

  useEffect(() => {
    if (!projectId) {
      setTasks([]);
      return;
    }

    const loadTasks = async () => {
      const data = await getProjectTasks(projectId);
      setTasks(data);
    };

    void loadTasks();
  }, [projectId]);

  return { tasks };
};

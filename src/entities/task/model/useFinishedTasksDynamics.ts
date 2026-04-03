import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../auth';
import { getFinishedTasksDynamics } from '../api/getFinishedTasksDynamics';
import type { FinishedTasksDynamics, TaskPeriod } from './types';

const emptyDynamics: FinishedTasksDynamics = {
  labels: [],
  completed: [],
  newTasks: [],
};

export const useFinishedTasksDynamics = () => {
  const { accessToken, isAuthenticated, isLoading } = useAuth();
  const [period, setPeriod] = useState<TaskPeriod>('month');
  const [dynamics, setDynamics] = useState<FinishedTasksDynamics>(emptyDynamics);

  const loadDynamics = useCallback(async () => {
    if (!accessToken || !isAuthenticated) {
      setDynamics(emptyDynamics);
      return;
    }

    try {
      const data = await getFinishedTasksDynamics(period, accessToken);
      setDynamics(data);
    } catch {
      setDynamics(emptyDynamics);
    }
  }, [period, accessToken, isAuthenticated]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!accessToken || !isAuthenticated) {
      setDynamics(emptyDynamics);
      return;
    }

    void loadDynamics();
  }, [period, accessToken, isAuthenticated, isLoading, loadDynamics]);

  useEffect(() => {
    const handleTasksChanged = () => {
      void loadDynamics();
    };

    window.addEventListener('tasks:changed', handleTasksChanged);

    return () => {
      window.removeEventListener('tasks:changed', handleTasksChanged);
    };
  }, [loadDynamics]);

  return { period, setPeriod, dynamics };
};

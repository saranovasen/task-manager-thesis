import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!accessToken || !isAuthenticated) {
      setDynamics(emptyDynamics);
      return;
    }

    const loadDynamics = async () => {
      try {
        const data = await getFinishedTasksDynamics(period, accessToken);
        setDynamics(data);
      } catch {
        setDynamics(emptyDynamics);
      }
    };

    void loadDynamics();
  }, [period, accessToken, isAuthenticated, isLoading]);

  return { period, setPeriod, dynamics };
};

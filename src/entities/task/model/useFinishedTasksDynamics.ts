import { useEffect, useState } from 'react';
import { getFinishedTasksDynamics } from '../api/getFinishedTasksDynamics';
import type { FinishedTasksDynamics, TaskPeriod } from './types';

const emptyDynamics: FinishedTasksDynamics = {
  labels: [],
  purple: [],
  blue: [],
};

export const useFinishedTasksDynamics = () => {
  const [period, setPeriod] = useState<TaskPeriod>('month');
  const [dynamics, setDynamics] = useState<FinishedTasksDynamics>(emptyDynamics);

  useEffect(() => {
    const loadDynamics = async () => {
      const data = await getFinishedTasksDynamics(period);
      setDynamics(data);
    };

    void loadDynamics();
  }, [period]);

  return { period, setPeriod, dynamics };
};

import { finishedTasksDynamicsMock } from '../model/mockData';
import type { FinishedTasksDynamics, TaskPeriod } from '../model/types';

type RawFinishedTasksDynamics = {
  labels: string[];
  completed?: number[];
  newTasks?: number[];
  purple?: number[];
  blue?: number[];
};

export const getFinishedTasksDynamics = async (period: TaskPeriod): Promise<FinishedTasksDynamics> => {
  const raw = finishedTasksDynamicsMock[period] as RawFinishedTasksDynamics;

  return Promise.resolve({
    labels: raw.labels,
    completed: raw.completed ?? raw.purple ?? [],
    newTasks: raw.newTasks ?? raw.blue ?? [],
  });
};

import { finishedTasksDynamicsMock } from '../model/mockData';
import type { FinishedTasksDynamics, TaskPeriod } from '../model/types';

export const getFinishedTasksDynamics = async (period: TaskPeriod): Promise<FinishedTasksDynamics> => {
  return Promise.resolve(finishedTasksDynamicsMock[period]);
};

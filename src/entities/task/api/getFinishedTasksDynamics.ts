import { httpRequest } from '../../../shared/api/httpClient';
import type { FinishedTasksDynamics, TaskPeriod } from '../model/types';

export const getFinishedTasksDynamics = async (period: TaskPeriod, token?: string): Promise<FinishedTasksDynamics> => {
  return httpRequest<FinishedTasksDynamics>(`/tasks/dynamics?period=${period}`, {
    token,
  });
};

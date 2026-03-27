import { httpRequest } from '../../../shared/api/httpClient';
import type { TaskSummaryItem } from '../model/types';

export const getTaskSummary = async (token?: string): Promise<TaskSummaryItem[]> => {
  return httpRequest<TaskSummaryItem[]>('/tasks/summary', {
    token,
  });
};

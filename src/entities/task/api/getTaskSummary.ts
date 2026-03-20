import { taskSummaryMock } from '../model/mockData';
import type { TaskSummaryItem } from '../model/types';

export const getTaskSummary = async (): Promise<TaskSummaryItem[]> => {
  return Promise.resolve(taskSummaryMock);
};

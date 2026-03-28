import { httpRequest } from '../../../shared/api/httpClient';
import type { ProjectTaskItem } from '../model/types';

export const createSubtaskRequest = async (taskId: string, title: string, token?: string) => {
  return httpRequest<ProjectTaskItem>(`/tasks/${taskId}/subtasks`, {
    method: 'POST',
    body: { title },
    token,
  });
};

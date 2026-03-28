import { httpRequest } from '../../../shared/api/httpClient';
import type { ProjectTaskItem, ProjectTaskStatus } from '../model/types';

type UpdateTaskRequest = {
  status?: ProjectTaskStatus;
};

export const updateTaskRequest = async (taskId: string, payload: UpdateTaskRequest, token?: string) => {
  return httpRequest<ProjectTaskItem>(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: payload,
    token,
  });
};

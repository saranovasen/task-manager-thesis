import { httpRequest } from '../../../shared/api/httpClient';
import type { ProjectTaskItem, ProjectTaskStatus } from '../model/types';

type CreateTaskRequest = {
  title: string;
  description?: string;
  status?: ProjectTaskStatus;
  dueDate?: string;
  category?: string;
  categoryColor?: string;
};

export const createTaskRequest = async (projectId: string, payload: CreateTaskRequest, token?: string) => {
  return httpRequest<ProjectTaskItem>(`/projects/${projectId}/tasks`, {
    method: 'POST',
    body: payload,
    token,
  });
};

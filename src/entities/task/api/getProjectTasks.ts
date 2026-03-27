import { httpRequest } from '../../../shared/api/httpClient';
import type { ProjectTaskItem } from '../model/types';

export const getProjectTasks = async (projectId: string, token?: string): Promise<ProjectTaskItem[]> => {
  return httpRequest<ProjectTaskItem[]>(`/projects/${projectId}/tasks`, {
    token,
  });
};

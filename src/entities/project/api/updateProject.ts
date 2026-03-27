import { httpRequest } from '../../../shared/api/httpClient';
import type { CreateProjectInput, ProjectItem } from '../model/types';

export const updateProjectRequest = async (
  projectId: string,
  payload: CreateProjectInput,
  token?: string
): Promise<ProjectItem> => {
  return httpRequest<ProjectItem>(`/projects/${projectId}`, {
    method: 'PATCH',
    token,
    body: payload,
  });
};

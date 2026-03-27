import { httpRequest } from '../../../shared/api/httpClient';
import type { CreateProjectInput, ProjectItem } from '../model/types';

export const createProject = async (payload: CreateProjectInput, token?: string): Promise<ProjectItem> => {
  return httpRequest<ProjectItem>('/projects', {
    method: 'POST',
    token,
    body: payload,
  });
};

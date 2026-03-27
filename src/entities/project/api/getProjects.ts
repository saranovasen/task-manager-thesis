import { httpRequest } from '../../../shared/api/httpClient';
import type { ProjectItem } from '../model/types';

export const getProjects = async (token?: string): Promise<ProjectItem[]> => {
  return httpRequest<ProjectItem[]>('/projects', {
    token,
  });
};

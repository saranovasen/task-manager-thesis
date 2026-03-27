import { httpRequest } from '../../../shared/api/httpClient';

export const deleteProject = async (projectId: string, token?: string): Promise<{ ok: boolean }> => {
  return httpRequest<{ ok: boolean }>(`/projects/${projectId}`, {
    method: 'DELETE',
    token,
  });
};

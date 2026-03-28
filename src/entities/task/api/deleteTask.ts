import { httpRequest } from '../../../shared/api/httpClient';

export const deleteTask = async (taskId: string, token?: string) => {
  return httpRequest<{ ok: true }>(`/tasks/${taskId}`, {
    method: 'DELETE',
    token,
  });
};

import { httpRequest } from '../../../shared/api/httpClient';
import type { ProjectTaskItem } from '../model/types';

export const deleteSubtask = async (taskId: string, subtaskId: string, token?: string) => {
  return httpRequest<ProjectTaskItem>(`/tasks/${taskId}/subtasks/${subtaskId}`, {
    method: 'DELETE',
    token,
  });
};

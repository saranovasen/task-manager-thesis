import { httpRequest } from '../../../shared/api/httpClient';
import type { ProjectTaskItem } from '../model/types';

type UpdateSubtaskPayload = {
  isDone?: boolean;
  title?: string;
};

export const updateSubtaskRequest = async (
  taskId: string,
  subtaskId: string,
  payload: UpdateSubtaskPayload,
  token?: string
) => {
  return httpRequest<ProjectTaskItem>(`/tasks/${taskId}/subtasks/${subtaskId}`, {
    method: 'PATCH',
    body: payload,
    token,
  });
};

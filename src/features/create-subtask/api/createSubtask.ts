import type { ProjectSubtaskItem } from '../../../entities/task';
import type { CreateSubtaskPayload } from '../model/types';

type CreateSubtaskInput = {
  taskId: string;
  payload: CreateSubtaskPayload;
};

export const createSubtask = ({ taskId, payload }: CreateSubtaskInput): ProjectSubtaskItem => {
  return {
    id: `${taskId}-sub-${Date.now()}`,
    title: payload.title,
    isDone: false,
  };
};

import type { ProjectTaskItem } from '../../../entities/task';
import type { CreateTaskPayload } from '../model/types';

type CreateTaskInput = {
  projectId: string;
  payload: CreateTaskPayload;
};

export const createTask = ({ projectId, payload }: CreateTaskInput): ProjectTaskItem => {
  return {
    id: `t-${Date.now()}`,
    projectId,
    title: payload.title,
    status: payload.status,
    category: payload.category,
    categoryColor: payload.categoryColor,
    description: payload.description,
    dateLabel: payload.dateLabel,
    subtasks: [],
  };
};

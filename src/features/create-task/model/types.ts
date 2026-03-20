import type { ProjectTaskStatus } from '../../../entities/task';

export type CreateTaskPayload = {
  title: string;
  description: string;
  category: string;
  dateLabel: string;
  status: ProjectTaskStatus;
};

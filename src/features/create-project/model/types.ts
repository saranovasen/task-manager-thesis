import type { CreateProjectInput } from '../../../entities/project';

export type CreateProjectPayload = Omit<CreateProjectInput, 'dueDate'> & {
  dueDate?: Date;
};

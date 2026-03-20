import { projectTasksMock } from '../model/mockData';
import type { ProjectTaskItem } from '../model/types';

export const getProjectTasks = async (projectId: string): Promise<ProjectTaskItem[]> => {
  return Promise.resolve(projectTasksMock.filter((task) => task.projectId === projectId));
};

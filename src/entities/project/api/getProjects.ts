import { projectsMock } from '../model/mockData';
import type { ProjectItem } from '../model/types';

export const getProjects = async (): Promise<ProjectItem[]> => {
  return Promise.resolve(projectsMock);
};

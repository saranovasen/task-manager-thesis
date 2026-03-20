import type { ProjectItem } from '../model/types';

export const deleteProject = (projectId: string): ProjectItem => {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
  // return response.json();
  return { id: projectId } as ProjectItem;
};

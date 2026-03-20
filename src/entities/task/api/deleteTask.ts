import type { ProjectTaskItem } from '../model/types';

export const deleteTask = (taskId: string): ProjectTaskItem => {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
  // return response.json();
  return { id: taskId } as ProjectTaskItem;
};

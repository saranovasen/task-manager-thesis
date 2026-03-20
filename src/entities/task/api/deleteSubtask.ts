import type { ProjectSubtaskItem } from '../model/types';

export const deleteSubtask = (subtaskId: string): ProjectSubtaskItem => {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/subtasks/${subtaskId}`, { method: 'DELETE' });
  // return response.json();
  return { id: subtaskId } as ProjectSubtaskItem;
};

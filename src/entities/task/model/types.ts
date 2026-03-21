export type TaskPeriod = 'week' | 'month' | 'year';

export type FinishedTasksDynamics = {
  labels: string[];
  completed: number[];
  newTasks: number[];
};

export type TaskSummaryItem = {
  id: string;
  title: string;
  amount: number;
  trendData: number[];
  lineColor: string;
};

export type ProjectTaskStatus = 'queue' | 'in-progress' | 'review' | 'done';

export type ProjectTaskCover = 'blue' | 'violet' | 'orange';

export type ProjectSubtaskItem = {
  id: string;
  title: string;
  isDone: boolean;
};

export type ProjectTaskItem = {
  id: string;
  projectId: string;
  title: string;
  status: ProjectTaskStatus;
  category: string;
  categoryColor: string;
  description: string;
  dateLabel: string;
  checklistDone?: number;
  checklistTotal?: number;
  subtasks?: ProjectSubtaskItem[];
  assignees?: string[];
  cover?: ProjectTaskCover;
};

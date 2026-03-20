export type TaskPeriod = 'day' | 'week' | 'month';

export type FinishedTasksDynamics = {
  labels: string[];
  purple: number[];
  blue: number[];
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
  assignees?: string[];
  cover?: ProjectTaskCover;
};

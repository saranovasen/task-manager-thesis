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

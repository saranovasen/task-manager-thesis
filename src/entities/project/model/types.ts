export type ProjectItem = {
  id: string;
  title: string;
  link: string;
  tasks: number;
  dueDate: string;
  progress: number;
  progressColor: string;
};

export type CreateProjectInput = {
  title: string;
  link?: string;
  dueDate?: string;
};

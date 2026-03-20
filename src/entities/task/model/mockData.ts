import type { FinishedTasksDynamics, TaskPeriod, TaskSummaryItem } from './types';

export const taskSummaryMock: TaskSummaryItem[] = [
  {
    id: 'completed',
    title: 'Готово',
    amount: 8,
    trendData: [6, 8, 7, 9, 10, 9, 11],
    lineColor: '#5051F9',
  },
  {
    id: 'new',
    title: 'Новое',
    amount: 10,
    trendData: [9, 7, 8, 6, 7, 5, 6],
    lineColor: '#1EA7FF',
  },
  {
    id: 'projects',
    title: 'Готовые проекты',
    amount: 10,
    trendData: [3, 4, 5, 4, 6, 5, 7],
    lineColor: '#FF614C',
  },
];

export const finishedTasksDynamicsMock: Record<TaskPeriod, FinishedTasksDynamics> = {
  day: {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    purple: [20, 35, 110, 170, 140, 190, 120],
    blue: [15, 30, 80, 120, 90, 145, 100],
  },
  week: {
    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    purple: [160, 220, 190, 280, 310, 240, 200],
    blue: [120, 170, 140, 210, 190, 160, 130],
  },
  month: {
    labels: ['Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек', 'Янв', 'Фев', 'Март', 'Апр'],
    purple: [90, 120, 110, 380, 260, 170, 220, 130, 175, 325, 285, 160],
    blue: [50, 200, 230, 305, 190, 225, 35, 55, 65, 70, 155, 120],
  },
};

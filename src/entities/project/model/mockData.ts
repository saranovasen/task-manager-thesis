import type { ProjectItem } from './types';

export const projectsMock: ProjectItem[] = [
  {
    id: '1',
    title: 'ВКР',
    link: 'www.siil.ch/ru',
    tasks: 8,
    dueDate: 'до 24.05.2026',
    progress: 24,
    progressColor: '#2EA3E6',
  },
  {
    id: '2',
    title: 'Фронтенд e-commerce',
    link: 'www.site.org',
    tasks: 5,
    dueDate: 'до 21.05.2026',
    progress: 60,
    progressColor: '#5051F9',
  },
];

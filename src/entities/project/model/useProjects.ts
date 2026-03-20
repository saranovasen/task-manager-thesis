import { useEffect, useState } from 'react';
import { getProjects } from '../api/getProjects';
import type { CreateProjectInput, ProjectItem } from './types';

export const useProjects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      const data = await getProjects();
      setProjects(data);
    };

    void loadProjects();
  }, []);

  const addProject = (newProject: CreateProjectInput) => {
    const project: ProjectItem = {
      id: crypto.randomUUID(),
      title: newProject.title,
      link: newProject.link?.trim() || '—',
      dueDate: newProject.dueDate || 'Без дедлайна',
      tasks: 0,
      progress: 0,
      progressColor: '#2EA3E6',
    };

    setProjects((prevProjects) => [project, ...prevProjects]);
  };

  return { projects, addProject };
};

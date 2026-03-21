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

  const removeProject = (projectId: string) => {
    setProjects((prevProjects) => prevProjects.filter((p) => p.id !== projectId));
  };

  const updateProject = (projectId: string, nextData: CreateProjectInput) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        return {
          ...project,
          title: nextData.title,
          link: nextData.link?.trim() || '—',
          dueDate: nextData.dueDate || 'Без дедлайна',
        };
      })
    );
  };

  return { projects, addProject, removeProject, updateProject };
};

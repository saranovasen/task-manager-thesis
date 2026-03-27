import { useEffect, useState } from 'react';
import { useAuth } from '../../auth';
import { createProject } from '../api/createProject';
import { deleteProject } from '../api/deleteProject';
import { getProjects } from '../api/getProjects';
import { updateProjectRequest } from '../api/updateProject';
import type { CreateProjectInput, ProjectItem } from './types';

export const useProjects = () => {
  const { accessToken, isAuthenticated, isLoading } = useAuth();
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!accessToken || !isAuthenticated) {
      setProjects([]);
      return;
    }

    const loadProjects = async () => {
      try {
        const data = await getProjects(accessToken);
        setProjects(data);
      } catch {
        setProjects([]);
      }
    };

    void loadProjects();
  }, [accessToken, isAuthenticated, isLoading]);

  const addProject = async (newProject: CreateProjectInput) => {
    if (!accessToken || !isAuthenticated) {
      throw new Error('Unauthorized');
    }

    const createdProject = await createProject(newProject, accessToken);
    setProjects((prevProjects) => [createdProject, ...prevProjects]);
  };

  const removeProject = async (projectId: string) => {
    if (!accessToken || !isAuthenticated) {
      throw new Error('Unauthorized');
    }

    await deleteProject(projectId, accessToken);
    setProjects((prevProjects) => prevProjects.filter((p) => p.id !== projectId));
  };

  const updateProject = async (projectId: string, nextData: CreateProjectInput) => {
    if (!accessToken || !isAuthenticated) {
      throw new Error('Unauthorized');
    }

    const updatedProject = await updateProjectRequest(projectId, nextData, accessToken);

    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        return updatedProject;
      })
    );
  };

  return { projects, addProject, removeProject, updateProject };
};

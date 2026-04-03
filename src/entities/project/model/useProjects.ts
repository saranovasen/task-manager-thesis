import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../auth';
import { createProject } from '../api/createProject';
import { deleteProject } from '../api/deleteProject';
import { getProjects } from '../api/getProjects';
import { updateProjectRequest } from '../api/updateProject';
import type { CreateProjectInput, ProjectItem } from './types';

export const useProjects = () => {
  const { accessToken, isAuthenticated, isLoading } = useAuth();
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  const loadProjects = useCallback(async () => {
    if (!accessToken || !isAuthenticated) {
      setProjects([]);
      return;
    }

    try {
      const data = await getProjects(accessToken);
      setProjects(data);
    } catch {
      setProjects([]);
    }
  }, [accessToken, isAuthenticated]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!accessToken || !isAuthenticated) {
      setProjects([]);
      return;
    }

    void loadProjects();
  }, [accessToken, isAuthenticated, isLoading, loadProjects]);

  useEffect(() => {
    const handleTasksChanged = () => {
      void loadProjects();
    };

    window.addEventListener('tasks:changed', handleTasksChanged);

    return () => {
      window.removeEventListener('tasks:changed', handleTasksChanged);
    };
  }, [loadProjects]);

  const addProject = useCallback(
    async (newProject: CreateProjectInput) => {
      if (!accessToken || !isAuthenticated) {
        throw new Error('Unauthorized');
      }

      const createdProject = await createProject(newProject, accessToken);
      setProjects((prevProjects) => [createdProject, ...prevProjects]);
    },
    [accessToken, isAuthenticated]
  );

  const removeProject = useCallback(
    async (projectId: string) => {
      if (!accessToken || !isAuthenticated) {
        throw new Error('Unauthorized');
      }

      await deleteProject(projectId, accessToken);
      setProjects((prevProjects) => prevProjects.filter((p) => p.id !== projectId));
    },
    [accessToken, isAuthenticated]
  );

  const updateProject = useCallback(
    async (projectId: string, nextData: CreateProjectInput) => {
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
    },
    [accessToken, isAuthenticated]
  );

  return { projects, addProject, removeProject, updateProject };
};

import { useEffect, useState } from 'react';
import { getProjects } from '../api/getProjects';
import type { ProjectItem } from './types';

export const useProjects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      const data = await getProjects();
      setProjects(data);
    };

    void loadProjects();
  }, []);

  return { projects };
};

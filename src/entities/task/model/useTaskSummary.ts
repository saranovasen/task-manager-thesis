import { useEffect, useState } from 'react';
import { useAuth } from '../../auth';
import { getTaskSummary } from '../api/getTaskSummary';
import type { TaskSummaryItem } from './types';

export const useTaskSummary = () => {
  const { accessToken, isAuthenticated, isLoading } = useAuth();
  const [summaryItems, setSummaryItems] = useState<TaskSummaryItem[]>([]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!accessToken || !isAuthenticated) {
      setSummaryItems([]);
      return;
    }

    const loadSummary = async () => {
      try {
        const data = await getTaskSummary(accessToken);
        setSummaryItems(data);
      } catch {
        setSummaryItems([]);
      }
    };

    void loadSummary();
  }, [accessToken, isAuthenticated, isLoading]);

  return { summaryItems };
};

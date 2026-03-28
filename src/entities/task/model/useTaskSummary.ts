import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../auth';
import { getTaskSummary } from '../api/getTaskSummary';
import type { TaskSummaryItem } from './types';

export const useTaskSummary = () => {
  const { accessToken, isAuthenticated, isLoading } = useAuth();
  const [summaryItems, setSummaryItems] = useState<TaskSummaryItem[]>([]);

  const loadSummary = useCallback(async () => {
    if (!accessToken || !isAuthenticated) {
      setSummaryItems([]);
      return;
    }

    try {
      const data = await getTaskSummary(accessToken);
      setSummaryItems(data);
    } catch {
      setSummaryItems([]);
    }
  }, [accessToken, isAuthenticated]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!accessToken || !isAuthenticated) {
      setSummaryItems([]);
      return;
    }

    void loadSummary();
  }, [accessToken, isAuthenticated, isLoading, loadSummary]);

  useEffect(() => {
    const handleTasksChanged = () => {
      void loadSummary();
    };

    const handleWindowFocus = () => {
      void loadSummary();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void loadSummary();
      }
    };

    window.addEventListener('tasks:changed', handleTasksChanged);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('tasks:changed', handleTasksChanged);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadSummary]);

  return { summaryItems };
};

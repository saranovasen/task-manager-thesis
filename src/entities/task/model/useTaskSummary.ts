import { useEffect, useState } from 'react';
import { getTaskSummary } from '../api/getTaskSummary';
import type { TaskSummaryItem } from './types';

export const useTaskSummary = () => {
  const [summaryItems, setSummaryItems] = useState<TaskSummaryItem[]>([]);

  useEffect(() => {
    const loadSummary = async () => {
      const data = await getTaskSummary();
      setSummaryItems(data);
    };

    void loadSummary();
  }, []);

  return { summaryItems };
};

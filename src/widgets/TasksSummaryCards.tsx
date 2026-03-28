import List from '@mui/material/List';
import { TaskSummaryCard } from '../shared/cards/TasksSummaryCard';
import { docIcon, starIcon, fileIcon } from '../shared/icons';
import ListItem from '@mui/material/ListItem';
import { useTaskSummary, type TaskSummaryItem } from '../entities/task';
import { memo, useMemo } from 'react';

const baseSummaryItems: TaskSummaryItem[] = [
  {
    id: 'completed',
    title: 'Готово',
    amount: 0,
    trendData: [0, 0, 0, 0, 0, 0, 0],
    lineColor: '#5051F9',
  },
  {
    id: 'new',
    title: 'Новое',
    amount: 0,
    trendData: [0, 0, 0, 0, 0, 0, 0],
    lineColor: '#1EA7FF',
  },
  {
    id: 'projects',
    title: 'Готовые проекты',
    amount: 0,
    trendData: [0, 0, 0, 0, 0, 0, 0],
    lineColor: '#FF614C',
  },
];

export const TasksSummaryCards = memo(() => {
  const { summaryItems } = useTaskSummary();

  const cardsToRender = useMemo(() => {
    const summaryById = new Map(summaryItems.map((item) => [item.id, item]));

    return baseSummaryItems.map((baseItem) => {
      const loaded = summaryById.get(baseItem.id);
      return loaded ? { ...baseItem, ...loaded } : baseItem;
    });
  }, [summaryItems]);

  const iconById: Record<string, React.ReactNode> = {
    completed: starIcon(),
    new: docIcon(),
    projects: fileIcon(),
  };

  return (
    <List sx={{ display: 'flex', width: '100%', p: 0, m: 0, gap: 2 }}>
      {cardsToRender.map((card) => (
        <ListItem key={card.id} sx={{ p: 0, flex: 1, minWidth: 0 }}>
          <TaskSummaryCard
            icon={iconById[card.id]}
            title={card.title}
            amount={card.amount}
            trendData={card.trendData}
            lineColor={card.lineColor}
          />
        </ListItem>
      ))}
    </List>
  );
});

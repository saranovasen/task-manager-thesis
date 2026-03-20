import List from '@mui/material/List';
import { TaskSummaryCard } from '../shared/cards/TasksSummaryCard';
import { docIcon, starIcon, fileIcon } from '../shared/icons';
import ListItem from '@mui/material/ListItem';
import { useTaskSummary } from '../entities/task';

export const TasksSummaryCards = () => {
  const { summaryItems } = useTaskSummary();

  const iconById: Record<string, React.ReactNode> = {
    completed: starIcon(),
    new: docIcon(),
    projects: fileIcon(),
  };

  return (
    <List sx={{ display: 'flex', width: '100%', p: 0, m: 0, gap: 2 }}>
      {summaryItems.map((card) => (
        <ListItem key={card.title} sx={{ p: 0, flex: 1, minWidth: 0 }}>
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
};

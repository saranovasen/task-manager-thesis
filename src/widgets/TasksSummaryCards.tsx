import List from '@mui/material/List';
import { TaskSummaryCard } from '../shared/cards/TasksSummaryCard';
import { docIcon, starIcon, fileIcon } from '../shared/icons';
import ListItem from '@mui/material/ListItem';

export const TasksSummaryCards = () => {
  return (
    <List sx={{ display: 'flex', width: '100%' }}>
      <ListItem>
        <TaskSummaryCard icon={starIcon()} title="Готово" amount={8} />
      </ListItem>
      <ListItem>
        <TaskSummaryCard icon={docIcon()} title="Новое" amount={10} />
      </ListItem>
      <ListItem>
        <TaskSummaryCard icon={fileIcon()} title="Готовые проекты" amount={10} />
      </ListItem>
    </List>
  );
};

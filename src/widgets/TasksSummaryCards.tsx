import List from '@mui/material/List';
import { TaskSummaryCard } from '../shared/cards/TasksSummaryCard';
import { docIcon, starIcon, fileIcon } from '../shared/icons';
import ListItem from '@mui/material/ListItem';

export const TasksSummaryCards = () => {
  return (
    <List sx={{ display: 'flex', width: '100%', p: 0, m: 0, gap: 2 }}>
      <ListItem sx={{ p: 0, flex: 1, minWidth: 0 }}>
        <TaskSummaryCard icon={starIcon()} title="Готово" amount={8} />
      </ListItem>
      <ListItem sx={{ p: 0, flex: 1, minWidth: 0 }}>
        <TaskSummaryCard icon={docIcon()} title="Новое" amount={10} />
      </ListItem>
      <ListItem sx={{ p: 0, flex: 1, minWidth: 0 }}>
        <TaskSummaryCard icon={fileIcon()} title="Готовые проекты" amount={10} />
      </ListItem>
    </List>
  );
};

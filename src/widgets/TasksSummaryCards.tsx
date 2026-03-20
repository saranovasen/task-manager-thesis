import List from '@mui/material/List';
import { TaskSummaryCard } from '../shared/cards/TasksSummaryCard';
import { docIcon, starIcon, fileIcon } from '../shared/icons';
import ListItem from '@mui/material/ListItem';

export const TasksSummaryCards = () => {
  const cardsMock = [
    {
      icon: starIcon(),
      title: 'Готово',
      amount: 8,
      trendData: [6, 8, 7, 9, 10, 9, 11],
      lineColor: '#5051F9',
    },
    {
      icon: docIcon(),
      title: 'Новое',
      amount: 10,
      trendData: [9, 7, 8, 6, 7, 5, 6],
      lineColor: '#1EA7FF',
    },
    {
      icon: fileIcon(),
      title: 'Готовые проекты',
      amount: 10,
      trendData: [3, 4, 5, 4, 6, 5, 7],
      lineColor: '#FF614C',
    },
  ];

  return (
    <List sx={{ display: 'flex', width: '100%', p: 0, m: 0, gap: 2 }}>
      {cardsMock.map((card) => (
        <ListItem key={card.title} sx={{ p: 0, flex: 1, minWidth: 0 }}>
          <TaskSummaryCard
            icon={card.icon}
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

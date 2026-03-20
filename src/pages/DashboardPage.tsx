import { TasksSummaryCards } from '../widgets/TasksSummaryCards';
import { FinishedTasks } from '../widgets/FinishedTasks';
import { Box } from '@mui/system';

export const DashboardPage = () => {
  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <TasksSummaryCards />
      <FinishedTasks />
    </Box>
  );
};

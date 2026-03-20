import { TasksSummaryCards } from '../widgets/TasksSummaryCards';
import { FinishedTasks } from '../widgets/FinishedTasks';
import { Projects } from '../widgets/Projects';
import { Box } from '@mui/system';

export const DashboardPage = () => {
  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <TasksSummaryCards />
      <FinishedTasks />
      <Projects />
    </Box>
  );
};

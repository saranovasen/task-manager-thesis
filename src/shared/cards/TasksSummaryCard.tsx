import { Box } from '@mui/system';
import { SecondaryText } from '../typography/SecondaryText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

type TaskSummaryCard = {
  icon: React.ReactNode;
  title: string;
  amount: number;
};

export const TaskSummaryCard = (props: TaskSummaryCard) => {
  const trendData = [6, 8, 7, 9, 10, 9, 11];
  const min = Math.min(...trendData);
  const max = Math.max(...trendData);
  const points = trendData
    .map((value, index) => {
      const x = (index / (trendData.length - 1)) * 100;
      const normalized = (value - min) / (max - min || 1);
      const y = 36 - normalized * 28;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        padding: 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
          {props.icon}
          <SecondaryText text={props.title} />
        </Box>
        <Typography sx={{ color: '#1E1E1E' }}>{props.amount}</Typography>
      </Box>

      <Divider sx={{ my: 1, borderColor: '#E6EAF0' }} />

      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ height: 50, mb: 1 }}>
          <svg width="115" height="50" viewBox="0 0 100 50" preserveAspectRatio="none">
            <polyline fill="none" stroke="#5051F9" strokeWidth="1.5" points={points} />
          </svg>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <Typography sx={{ color: '#299702' }}>{props.amount}+</Typography>
          <SecondaryText text={'с прошлой'} />
          <SecondaryText text={'недели'} />
        </Box>
      </Box>
    </Box>
  );
};

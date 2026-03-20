import { Box } from '@mui/system';
import { SecondaryText } from '../typography/SecondaryText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useId } from 'react';

type TaskSummaryCard = {
  icon: React.ReactNode;
  title: string;
  amount: number;
  trendData: number[];
  lineColor: string;
};

export const TaskSummaryCard = (props: TaskSummaryCard) => {
  const chartId = useId().replace(/:/g, '');
  const chartTop = 8;
  const chartBottom = 36;
  const chartLeft = 4;
  const chartRight = 96;
  const gradientId = `card-area-${chartId}`;
  const blurId = `card-blur-${chartId}`;
  const min = Math.min(...props.trendData);
  const max = Math.max(...props.trendData);
  const points = props.trendData.map((value, index) => {
    const x = chartLeft + (index / (props.trendData.length - 1)) * (chartRight - chartLeft);
    const normalized = (value - min) / (max - min || 1);
    const y = chartBottom - normalized * (chartBottom - chartTop);
    return { x, y };
  });
  const buildSmoothPath = (pathPoints: { x: number; y: number }[]) => {
    if (pathPoints.length < 2) {
      return '';
    }

    let path = `M ${pathPoints[0].x} ${pathPoints[0].y}`;

    for (let i = 0; i < pathPoints.length - 1; i += 1) {
      const p0 = pathPoints[i - 1] ?? pathPoints[i];
      const p1 = pathPoints[i];
      const p2 = pathPoints[i + 1];
      const p3 = pathPoints[i + 2] ?? p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return path;
  };

  const linePath = buildSmoothPath(points);
  const areaPath = points.length > 1 ? `${linePath} L ${points[points.length - 1].x} 48 L ${points[0].x} 48 Z` : '';

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        padding: 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        gap: 2,
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
        <Box sx={{ position: 'relative', width: 115, height: 56, mb: 1, overflow: 'visible' }}>
          <svg
            width="115"
            height="56"
            viewBox="0 0 100 56"
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={props.lineColor} stopOpacity="0.16" />
                <stop offset="100%" stopColor={props.lineColor} stopOpacity="0" />
              </linearGradient>
              <filter id={blurId} x="-20%" y="-20%" width="140%" height="160%">
                <feGaussianBlur stdDeviation="2.6" />
              </filter>
            </defs>

            <path d={areaPath} fill={`url(#${gradientId})`} filter={`url(#${blurId})`} opacity="0.9" />
          </svg>

          <svg width="115" height="56" viewBox="0 0 100 56" preserveAspectRatio="none" style={{ position: 'relative' }}>
            <path d={linePath} fill="none" stroke={props.lineColor} strokeWidth="1.5" strokeLinecap="round" />
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

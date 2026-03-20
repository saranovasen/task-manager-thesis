import { Box } from '@mui/system';
import { SecondaryText } from '../typography/SecondaryText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useId } from 'react';
import {
  tasksSummaryCardAmountSx,
  tasksSummaryCardAreaSvgSx,
  tasksSummaryCardChartWrapperSx,
  tasksSummaryCardDividerSx,
  tasksSummaryCardLineSvgSx,
  tasksSummaryCardRootSx,
  tasksSummaryCardRowSx,
  tasksSummaryCardRowWithGapSx,
  tasksSummaryCardTrendAmountSx,
  tasksSummaryCardTrendInfoSx,
} from './TasksSummaryCard.styles';

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
    <Box sx={tasksSummaryCardRootSx}>
      <Box sx={tasksSummaryCardRowSx}>
        <Box sx={tasksSummaryCardRowWithGapSx}>
          {props.icon}
          <SecondaryText text={props.title} />
        </Box>
        <Typography sx={tasksSummaryCardAmountSx}>{props.amount}</Typography>
      </Box>

      <Divider sx={tasksSummaryCardDividerSx} />

      <Box sx={tasksSummaryCardRowSx}>
        <Box sx={tasksSummaryCardChartWrapperSx}>
          <Box
            component="svg"
            width="115"
            height="56"
            viewBox="0 0 100 56"
            preserveAspectRatio="none"
            sx={tasksSummaryCardAreaSvgSx}
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
          </Box>

          <Box
            component="svg"
            width="115"
            height="56"
            viewBox="0 0 100 56"
            preserveAspectRatio="none"
            sx={tasksSummaryCardLineSvgSx}
          >
            <path d={linePath} fill="none" stroke={props.lineColor} strokeWidth="1.5" strokeLinecap="round" />
          </Box>
        </Box>

        <Box sx={tasksSummaryCardTrendInfoSx}>
          <Typography sx={tasksSummaryCardTrendAmountSx}>{props.amount}+</Typography>
          <SecondaryText text={'с прошлой'} />
          <SecondaryText text={'недели'} />
        </Box>
      </Box>
    </Box>
  );
};

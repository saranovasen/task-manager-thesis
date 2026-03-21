import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { useFinishedTasksDynamics, type TaskPeriod } from '../entities/task';
import {
  finishedTasksChartContainerSx,
  finishedTasksChartSvgSx,
  finishedTasksHeaderSx,
  finishedTasksRootSx,
  finishedTasksTabLabelSx,
  finishedTasksTabSx,
  finishedTasksTabsSx,
  finishedTasksTitleSx,
} from './FinishedTasks.styles';

const svgWidth = 1200;
const svgHeight = 420;
const leftPadding = 68;
const rightPadding = 24;
const topPadding = 28;
const bottomPadding = 68;

const chartWidth = svgWidth - leftPadding - rightPadding;
const chartHeight = svgHeight - topPadding - bottomPadding;

const periodYAxisConfig: Record<TaskPeriod, { baselineMax: number; step: number }> = {
  week: { baselineMax: 100, step: 20 },
  month: { baselineMax: 120, step: 20 },
  year: { baselineMax: 300, step: 50 },
};

const toPoints = (series: number[], labelsCount: number, yMax: number) => {
  const xStep = chartWidth / Math.max(labelsCount - 1, 1);
  return series.map((value, index) => ({
    x: leftPadding + xStep * index,
    y: topPadding + ((yMax - value) / yMax) * chartHeight,
  }));
};

const smoothPath = (points: { x: number; y: number }[]) => {
  if (points.length < 2) {
    return '';
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return path;
};

const areaPath = (points: { x: number; y: number }[]) => {
  if (points.length < 2) {
    return '';
  }

  const baseline = topPadding + chartHeight;
  const line = smoothPath(points);
  const first = points[0];
  const last = points[points.length - 1];

  return `${line} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
};

export const FinishedTasks = () => {
  const { period, setPeriod, dynamics: activeDataset } = useFinishedTasksDynamics();

  const yMax = useMemo(() => {
    const { baselineMax, step } = periodYAxisConfig[period];
    const actualMax = Math.max(...activeDataset.completed, ...activeDataset.newTasks, 1);
    const roundedMax = Math.ceil(actualMax / step) * step;

    return Math.max(roundedMax, baselineMax);
  }, [activeDataset, period]);

  const yTicks = useMemo(() => {
    const step = yMax / 4;
    return [0, step, step * 2, step * 3, yMax];
  }, [yMax]);

  const completedPoints = useMemo(
    () => toPoints(activeDataset.completed, activeDataset.labels.length, yMax),
    [activeDataset.completed, activeDataset.labels.length, yMax]
  );

  const newTasksPoints = useMemo(
    () => toPoints(activeDataset.newTasks, activeDataset.labels.length, yMax),
    [activeDataset.newTasks, activeDataset.labels.length, yMax]
  );

  const xStep = chartWidth / Math.max(activeDataset.labels.length - 1, 1);

  const mapY = (value: number) => topPadding + ((yMax - value) / yMax) * chartHeight;

  return (
    <Box sx={finishedTasksRootSx}>
      <Box sx={finishedTasksHeaderSx}>
        <Typography sx={finishedTasksTitleSx}>Завершенные задачи</Typography>

        <Box sx={finishedTasksTabsSx}>
          {[
            { key: 'week' as TaskPeriod, label: 'Неделя' },
            { key: 'month' as TaskPeriod, label: 'Месяц' },
            { key: 'year' as TaskPeriod, label: 'Год' },
          ].map((tab) => {
            const isActive = period === tab.key;

            return (
              <Box key={tab.key} onClick={() => setPeriod(tab.key)} sx={finishedTasksTabSx(isActive)}>
                <Typography sx={finishedTasksTabLabelSx(isActive)}>{tab.label}</Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box sx={finishedTasksChartContainerSx}>
        <Box
          component="svg"
          width="100%"
          height="auto"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMid meet"
          sx={finishedTasksChartSvgSx}
        >
          <defs>
            <linearGradient id="purpleArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4F51F7" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#4F51F7" stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id="blueArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2F9CF4" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#2F9CF4" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => {
            const y = mapY(tick);
            return (
              <g key={tick}>
                <line x1={leftPadding} y1={y} x2={svgWidth - rightPadding} y2={y} stroke="#D5DCE8" strokeWidth="1" />
                <text x={0} y={y + 8} fill="#71829D" fontSize="20" fontFamily="DM Sans">
                  {tick}
                </text>
              </g>
            );
          })}

          <path d={areaPath(completedPoints)} fill="url(#purpleArea)" />
          <path d={areaPath(newTasksPoints)} fill="url(#blueArea)" />

          <path d={smoothPath(completedPoints)} fill="none" stroke="#4D50F1" strokeWidth="2.5" strokeLinecap="round" />
          <path d={smoothPath(newTasksPoints)} fill="none" stroke="#2D99EE" strokeWidth="2.5" strokeLinecap="round" />

          {completedPoints.map((point, index) => (
            <circle
              key={`p-${index}`}
              cx={point.x}
              cy={point.y}
              r="7"
              fill="#4D50F1"
              stroke="#EEF2F8"
              strokeWidth="3"
            />
          ))}
          {newTasksPoints.map((point, index) => (
            <circle
              key={`b-${index}`}
              cx={point.x}
              cy={point.y}
              r="7"
              fill="#2D99EE"
              stroke="#EEF2F8"
              strokeWidth="3"
            />
          ))}

          {activeDataset.labels.map((label, index) => {
            const x = leftPadding + xStep * index;
            return (
              <text key={label} x={x - 20} y={svgHeight - 20} fill="#71829D" fontSize="20">
                {label}
              </text>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

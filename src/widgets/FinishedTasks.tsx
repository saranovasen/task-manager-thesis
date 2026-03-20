import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';

type Period = 'day' | 'week' | 'month';

type DynamicsDataset = {
  labels: string[];
  purple: number[];
  blue: number[];
};

const mockDynamics: Record<Period, DynamicsDataset> = {
  day: {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    purple: [20, 35, 110, 170, 140, 190, 120],
    blue: [15, 30, 80, 120, 90, 145, 100],
  },
  week: {
    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    purple: [160, 220, 190, 280, 310, 240, 200],
    blue: [120, 170, 140, 210, 190, 160, 130],
  },
  month: {
    labels: ['Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек', 'Янв', 'Фев', 'Март', 'Апр'],
    purple: [90, 120, 110, 380, 260, 170, 220, 130, 175, 325, 285, 160],
    blue: [50, 200, 230, 305, 190, 225, 35, 55, 65, 70, 155, 120],
  },
};

const svgWidth = 1200;
const svgHeight = 420;
const leftPadding = 68;
const rightPadding = 24;
const topPadding = 28;
const bottomPadding = 68;

const chartWidth = svgWidth - leftPadding - rightPadding;
const chartHeight = svgHeight - topPadding - bottomPadding;

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
  const [period, setPeriod] = useState<Period>('month');
  const activeDataset = mockDynamics[period];

  const yMax = useMemo(() => {
    const max = Math.max(...activeDataset.purple, ...activeDataset.blue, 100);
    return Math.ceil(max / 100) * 100;
  }, [activeDataset]);

  const yTicks = useMemo(() => {
    const step = yMax / 4;
    return [0, step, step * 2, step * 3, yMax];
  }, [yMax]);

  const purplePoints = useMemo(
    () => toPoints(activeDataset.purple, activeDataset.labels.length, yMax),
    [activeDataset.purple, activeDataset.labels.length, yMax]
  );

  const bluePoints = useMemo(
    () => toPoints(activeDataset.blue, activeDataset.labels.length, yMax),
    [activeDataset.blue, activeDataset.labels.length, yMax]
  );

  const xStep = chartWidth / Math.max(activeDataset.labels.length - 1, 1);

  const mapY = (value: number) => topPadding + ((yMax - value) / yMax) * chartHeight;

  return (
    <Box
      sx={{
        mt: 3,
        p: 3,
        bgcolor: '#FFFFFF',
        borderRadius: 4,
        width: '100%',
        maxWidth: 'none',
        minWidth: 0,
        boxSizing: 'border-box',
        alignSelf: 'stretch',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography sx={{ color: '#232360', fontSize: 24, fontWeight: 600, lineHeight: 1.1 }}>
          Завершенные задачи
        </Typography>

        <Box sx={{ display: 'flex', gap: 6 }}>
          {[
            { key: 'day' as const, label: 'День' },
            { key: 'week' as const, label: 'Неделя' },
            { key: 'month' as const, label: 'Месяц' },
          ].map((tab) => {
            const isActive = period === tab.key;

            return (
              <Box
                key={tab.key}
                onClick={() => setPeriod(tab.key)}
                sx={{
                  borderBottom: isActive ? '4px solid #2F9CF4' : '4px solid transparent',
                  pb: 1,
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <Typography
                  sx={{
                    color: isActive ? '#2F9CF4' : '#232360',
                    fontSize: 16,
                    fontWeight: 500,
                    lineHeight: 1.1,
                  }}
                >
                  {tab.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box sx={{ width: '100%', minWidth: 0 }}>
        <svg
          width="100%"
          height="auto"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ display: 'block', width: '100%', maxWidth: '100%' }}
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

          <path d={areaPath(purplePoints)} fill="url(#purpleArea)" />
          <path d={areaPath(bluePoints)} fill="url(#blueArea)" />

          <path d={smoothPath(purplePoints)} fill="none" stroke="#4D50F1" strokeWidth="2.5" strokeLinecap="round" />
          <path d={smoothPath(bluePoints)} fill="none" stroke="#2D99EE" strokeWidth="2.5" strokeLinecap="round" />

          {purplePoints.map((point, index) => (
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
          {bluePoints.map((point, index) => (
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
        </svg>
      </Box>
    </Box>
  );
};

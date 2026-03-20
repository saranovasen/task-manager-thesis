export const tasksSummaryCardRootSx = {
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  padding: 2,
  backgroundColor: '#FFFFFF',
  borderRadius: 4,
  gap: 2,
} as const;

export const tasksSummaryCardRowSx = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
} as const;

export const tasksSummaryCardRowWithGapSx = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 1,
} as const;

export const tasksSummaryCardAmountSx = {
  color: '#1E1E1E',
} as const;

export const tasksSummaryCardDividerSx = {
  my: 1,
  borderColor: '#E6EAF0',
} as const;

export const tasksSummaryCardChartWrapperSx = {
  position: 'relative',
  width: 115,
  height: 56,
  mb: 1,
  overflow: 'visible',
} as const;

export const tasksSummaryCardAreaSvgSx = {
  position: 'absolute',
  inset: 0,
  overflow: 'visible',
  pointerEvents: 'none',
} as const;

export const tasksSummaryCardLineSvgSx = {
  position: 'relative',
} as const;

export const tasksSummaryCardTrendInfoSx = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
} as const;

export const tasksSummaryCardTrendAmountSx = {
  color: '#299702',
} as const;

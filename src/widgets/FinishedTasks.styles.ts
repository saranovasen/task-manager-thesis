export const finishedTasksRootSx = {
  mt: 3,
  p: 3,
  bgcolor: '#FFFFFF',
  borderRadius: 4,
  width: '100%',
  maxWidth: 'none',
  minWidth: 0,
  boxSizing: 'border-box',
  alignSelf: 'stretch',
} as const;

export const finishedTasksHeaderSx = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  mb: 2,
} as const;

export const finishedTasksTitleSx = {
  color: '#232360',
  fontSize: 24,
  fontWeight: 600,
  lineHeight: 1.1,
} as const;

export const finishedTasksTabsSx = {
  display: 'flex',
  gap: 6,
} as const;

export const finishedTasksTabSx = (isActive: boolean) => ({
  borderBottom: isActive ? '4px solid #2F9CF4' : '4px solid transparent',
  pb: 1,
  cursor: 'pointer',
  userSelect: 'none',
});

export const finishedTasksTabLabelSx = (isActive: boolean) => ({
  color: isActive ? '#2F9CF4' : '#232360',
  fontSize: 16,
  fontWeight: 500,
  lineHeight: 1.1,
});

export const finishedTasksChartContainerSx = {
  width: '100%',
  minWidth: 0,
} as const;

export const finishedTasksChartSvgSx = {
  display: 'block',
  width: '100%',
  maxWidth: '100%',
} as const;

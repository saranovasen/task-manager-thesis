import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import type { ProjectTaskItem } from '../../entities/task';

type TaskBoardCardData = Pick<
  ProjectTaskItem,
  | 'id'
  | 'title'
  | 'category'
  | 'categoryColor'
  | 'description'
  | 'dateLabel'
  | 'checklistDone'
  | 'checklistTotal'
  | 'subtasks'
  | 'assignees'
  | 'cover'
>;

type TaskBoardCardProps = {
  task: TaskBoardCardData;
  onAddSubtask?: (taskId: string) => void;
  onOpen?: (taskId: string) => void;
  onEditDeadline?: (taskId: string, nextDate: string) => void;
};

const coverByType = {
  blue: 'linear-gradient(135deg, #24B7D6 0%, #315DDA 50%, #4B8CF8 100%)',
  violet: 'linear-gradient(135deg, #1E86DD 0%, #5F55F4 50%, #28B3EF 100%)',
  orange: 'linear-gradient(135deg, #F53844 0%, #FF7A1A 52%, #F4B845 100%)',
};

export const TaskBoardCard = ({ task, onAddSubtask, onOpen, onEditDeadline }: TaskBoardCardProps) => {
  const {
    id,
    title,
    category,
    categoryColor,
    description,
    dateLabel,
    checklistDone,
    checklistTotal,
    subtasks,
    assignees,
    cover,
  } = task;

  const checklistDoneCalculated = subtasks?.filter((subtask) => subtask.isDone).length;
  const checklistTotalCalculated = subtasks?.length;
  const hasSubtasks = Array.isArray(subtasks);
  const finalChecklistDone = hasSubtasks ? checklistDoneCalculated : checklistDone;
  const finalChecklistTotal = hasSubtasks ? checklistTotalCalculated : checklistTotal;

  const formatDisplayDate = (value: string) => {
    if (value === 'Срок не указан') {
      return value;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    const monthRaw = parsed.toLocaleString('ru-RU', { month: 'short' }).replace('.', '');
    const month = monthRaw.charAt(0).toUpperCase() + monthRaw.slice(1);
    const day = String(parsed.getDate()).padStart(2, '0');
    const year = parsed.getFullYear();

    return `${month} ${day}, ${year}`;
  };

  const toInputDate = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return '';
    }

    return parsed.toISOString().slice(0, 10);
  };

  const [isEditingDeadline, setIsEditingDeadline] = useState(false);
  const [deadlineDraft, setDeadlineDraft] = useState(toInputDate(dateLabel));
  const displayDateLabel = formatDisplayDate(dateLabel);

  useEffect(() => {
    setDeadlineDraft(toInputDate(dateLabel));
  }, [dateLabel]);

  const submitDeadline = () => {
    onEditDeadline?.(id, deadlineDraft);
    setIsEditingDeadline(false);
  };

  return (
    <Box
      onClick={() => onOpen?.(id)}
      sx={{
        bgcolor: '#FFFFFF',
        borderRadius: 2.5,
        p: 2,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          mb: 1.5,
          px: 1,
          py: 0.4,
          borderRadius: 1,
          bgcolor: categoryColor,
          color: '#FFFFFF',
          fontSize: 13,
          lineHeight: 1,
          fontWeight: 500,
        }}
      >
        {category}
      </Box>

      {cover && (
        <Box
          sx={{
            borderRadius: 2,
            height: 128,
            mb: 1.5,
            background: coverByType[cover],
          }}
        />
      )}

      <Typography sx={{ color: '#20245C', fontSize: 15, fontWeight: 500, mb: 0.5 }}>{title}</Typography>
      <Typography sx={{ color: '#7A859E', fontSize: 14, mb: 1.5 }}>{description}</Typography>

      {isEditingDeadline ? (
        <TextField
          type="date"
          value={deadlineDraft}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => setDeadlineDraft(event.target.value)}
          onBlur={submitDeadline}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              submitDeadline();
            }

            if (event.key === 'Escape') {
              event.preventDefault();
              setDeadlineDraft(toInputDate(dateLabel));
              setIsEditingDeadline(false);
            }
          }}
          autoFocus
          sx={{
            mb: 1.5,
            minWidth: 165,
            '& .MuiOutlinedInput-root': {
              height: 29,
              borderRadius: 1,
              px: 1,
              color: '#1F2564',
              fontSize: 13,
              fontWeight: 500,
              '& fieldset': {
                borderColor: '#D7DDE8',
              },
              '&:hover fieldset': {
                borderColor: '#C8D0E0',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#5051F9',
              },
            },
            '& .MuiOutlinedInput-input': {
              p: 0,
              color: '#1F2564',
              fontSize: 13,
              fontWeight: 500,
            },
          }}
        />
      ) : (
        <Box
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setIsEditingDeadline(true);
          }}
          sx={{
            display: 'inline-flex',
            px: 1,
            py: 0.4,
            border: '1px solid #D7DDE8',
            borderRadius: 1,
            color: '#1F2564',
            fontSize: 13,
            fontWeight: 500,
            mb: 1.5,
            cursor: 'pointer',
            '&:hover': {
              bgcolor: '#F7F8FF',
            },
          }}
        >
          {displayDateLabel}
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {assignees?.map((assignee, index) => (
            <Avatar
              key={`${id}-${assignee}-${index}`}
              sx={{
                width: 22,
                height: 22,
                fontSize: 11,
                ml: index === 0 ? 0 : -0.7,
                border: '2px solid #FFFFFF',
                bgcolor: index % 2 === 0 ? '#F39A4E' : '#A6755B',
              }}
            >
              {assignee}
            </Avatar>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#6F7F99' }}>
          {onAddSubtask && (
            <IconButton
              size="small"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onAddSubtask(id);
              }}
              sx={{
                width: 22,
                height: 22,
                color: '#6F7F99',
              }}
            >
              <AddRoundedIcon sx={{ fontSize: 15 }} />
            </IconButton>
          )}

          {typeof finalChecklistTotal === 'number' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              <CheckCircleOutlineRoundedIcon sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: 13 }}>
                {finalChecklistDone ?? 0}/{finalChecklistTotal}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type TaskBoardCardProps = {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  description: string;
  dateLabel: string;
  checklistDone?: number;
  checklistTotal?: number;
  assignees?: string[];
  cover?: 'blue' | 'violet' | 'orange';
};

const coverByType = {
  blue: 'linear-gradient(135deg, #24B7D6 0%, #315DDA 50%, #4B8CF8 100%)',
  violet: 'linear-gradient(135deg, #1E86DD 0%, #5F55F4 50%, #28B3EF 100%)',
  orange: 'linear-gradient(135deg, #F53844 0%, #FF7A1A 52%, #F4B845 100%)',
};

export const TaskBoardCard = ({
  id,
  title,
  category,
  categoryColor,
  description,
  dateLabel,
  checklistDone,
  checklistTotal,
  assignees,
  cover,
}: TaskBoardCardProps) => {
  return (
    <Box sx={{ bgcolor: '#FFFFFF', borderRadius: 2.5, p: 2 }}>
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

      <Box
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
        }}
      >
        {dateLabel}
      </Box>

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
          {typeof checklistTotal === 'number' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              <CheckCircleOutlineRoundedIcon sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: 13 }}>
                {checklistDone ?? 0}/{checklistTotal}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

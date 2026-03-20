import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { useNavigate } from 'react-router-dom';
import { dashboardIcon } from '../shared/icons/dashboardIcon';

export const Sidebar = () => {
  const navigate = useNavigate();
  const items = [{ icon: dashboardIcon, path: '/' }];

  return (
    <Box
      sx={{
        width: 94,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bgcolor: '#FBFAFF',
        borderRight: 1,
        borderColor: '#FBFAFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <List
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          paddingTop: '30vh',
        }}
      >
        {items.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ justifyContent: 'center', mb: 1, width: '100%' }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 56,
                maxWidth: 56,
                borderRadius: 5,
                color: '#5F6388',
                transition: 'background-color 0.5s ease, color 0.5s ease',
                '&:hover': {
                  backgroundColor: '#5051F9',
                  color: '#ffffff',
                },
              }}
            >
              {item.icon()}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

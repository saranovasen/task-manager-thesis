import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import { Sidebar } from '../widgets';

export const Layout = () => {
  return (
    <>
      <Sidebar />
      <AppBar position="fixed" elevation={0} sx={{ backgroundColor: '#FFFFFF' }}>
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <Button color="inherit" sx={{ color: '#000000' }}>
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
};

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { Layout } from './Layout';

const DashboardPage = lazy(() =>
  import('../pages/DashboardPage').then((module) => ({ default: module.DashboardPage }))
);
const TasksPage = lazy(() => import('../pages/TasksPage').then((module) => ({ default: module.TasksPage })));

function App() {
  return (
    <Layout>
      <Suspense
        fallback={
          <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress sx={{ color: '#5051F9' }} />
          </Box>
        }
      >
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/projects/:projectId/tasks" element={<TasksPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;

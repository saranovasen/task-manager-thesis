import { DashboardPage } from '../pages/DashboardPage';
import './App.css';
import { Layout } from './Layout';

function App() {
  return (
    <>
      <Layout children={<DashboardPage />} />
    </>
  );
}

export default App;

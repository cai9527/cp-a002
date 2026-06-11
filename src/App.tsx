import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Vehicles from '@/pages/Vehicles';
import Tasks from '@/pages/Tasks';
import Drivers from '@/pages/Drivers';
import Statistics from '@/pages/Statistics';
import Safety from '@/pages/Safety';
import System from '@/pages/System';
import { useAppStore } from '@/store';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="safety" element={<Safety />} />
          <Route path="system" element={<System />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

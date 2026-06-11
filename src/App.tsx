import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { modulePermissions } from '@/types';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function ModuleRoute({ children, modulePath }: { children: React.ReactNode; modulePath: string }) {
  const { hasModulePermission, getAccessibleModules } = useAppStore();
  const location = useLocation();

  if (!hasModulePermission(modulePath)) {
    const accessibleModules = getAccessibleModules();
    const redirectPath = accessibleModules.length > 0 ? accessibleModules[0].path : '/login';
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  return <>{children}</>;
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
          <Route
            path="dashboard"
            element={
              <ModuleRoute modulePath="/dashboard">
                <Dashboard />
              </ModuleRoute>
            }
          />
          <Route
            path="vehicles"
            element={
              <ModuleRoute modulePath="/vehicles">
                <Vehicles />
              </ModuleRoute>
            }
          />
          <Route
            path="tasks"
            element={
              <ModuleRoute modulePath="/tasks">
                <Tasks />
              </ModuleRoute>
            }
          />
          <Route
            path="drivers"
            element={
              <ModuleRoute modulePath="/drivers">
                <Drivers />
              </ModuleRoute>
            }
          />
          <Route
            path="statistics"
            element={
              <ModuleRoute modulePath="/statistics">
                <Statistics />
              </ModuleRoute>
            }
          />
          <Route
            path="safety"
            element={
              <ModuleRoute modulePath="/safety">
                <Safety />
              </ModuleRoute>
            }
          />
          <Route
            path="system"
            element={
              <ModuleRoute modulePath="/system">
                <System />
              </ModuleRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

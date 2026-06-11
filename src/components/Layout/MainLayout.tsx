import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';

export default function MainLayout() {
  const { isAuthenticated, sidebarCollapsed } = useAppStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div
        className={cn(
          'flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'
        )}
      >
        <Header />
        <main className="flex-1 p-4 md:p-6 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

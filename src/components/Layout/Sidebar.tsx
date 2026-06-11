import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  ClipboardList,
  Users,
  BarChart3,
  ShieldAlert,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCog,
  Database,
} from 'lucide-react';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';

const menuItems = [
  { path: '/dashboard', label: '首页仪表盘', icon: LayoutDashboard },
  { path: '/vehicles', label: '车辆管理', icon: Truck },
  { path: '/tasks', label: '任务调度', icon: ClipboardList },
  { path: '/drivers', label: '驾驶员管理', icon: Users },
  { path: '/statistics', label: '运输统计', icon: BarChart3 },
  { path: '/safety', label: '安全监控', icon: ShieldAlert },
];

const systemMenuItems = [
  { path: '/system/users', label: '用户管理', icon: UserCog },
  { path: '/system/data', label: '数据管理', icon: Database },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, currentUser } = useAppStore();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-slate-800 text-white transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
              <Truck className="h-5 w-5" />
            </div>
            <span className="text-base font-semibold">运渣车管理系统</span>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 mx-auto">
            <Truck className="h-5 w-5" />
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            'rounded-lg p-1.5 hover:bg-slate-700 transition-colors',
            sidebarCollapsed && 'hidden'
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <nav className="p-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
              isActive(item.path)
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}

        {!sidebarCollapsed && (
          <div className="my-3 border-t border-slate-700" />
        )}
        {sidebarCollapsed && <div className="my-2" />}

        {!sidebarCollapsed && (
          <div className="px-3 py-2 text-xs font-medium text-slate-400">
            系统管理
          </div>
        )}

        {systemMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
              isActive(item.path)
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {sidebarCollapsed && (
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-white shadow-lg hover:bg-slate-600"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      {!sidebarCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-600">
              <Settings className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">
                {currentUser?.realName}
              </p>
              <p className="truncate text-xs text-slate-400">
                {currentUser?.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

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
  { path: '/system', label: '系统管理', icon: Settings },
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
        'sticky top-0 z-40 flex-shrink-0 flex flex-col h-screen bg-slate-800 text-white transition-all duration-300 ease-in-out overflow-hidden',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4 flex-shrink-0">
        {!sidebarCollapsed ? (
          <>
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 flex-shrink-0">
                <Truck className="h-5 w-5" />
              </div>
              <span className="text-base font-semibold whitespace-nowrap truncate">运渣车管理系统</span>
            </div>
            <button
              onClick={toggleSidebar}
              className="rounded-lg p-1.5 hover:bg-slate-700 transition-colors flex-shrink-0"
              title="收起侧边栏"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="w-full flex flex-col items-center gap-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
              <Truck className="h-5 w-5" />
            </div>
            <button
              onClick={toggleSidebar}
              className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="展开侧边栏"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
              sidebarCollapsed ? 'justify-center' : '',
              isActive(item.path)
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            )}
            title={sidebarCollapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {!sidebarCollapsed && (
        <div className="border-t border-slate-700 p-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-600 flex-shrink-0">
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

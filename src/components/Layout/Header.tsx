import { Bell, Search, User, LogOut, Menu, Shield, UserCircle } from 'lucide-react';
import { useAppStore } from '@/store';
import { useState } from 'react';
import { roleLabels, accountTypeLabels, AccountType } from '@/types';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { currentUser, logout, toggleSidebar, updateCurrentUserAccountType } = useAppStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChangeAccountType = (type: AccountType) => {
    updateCurrentUserAccountType(type);
    setShowUserMenu(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden rounded-lg p-2 hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索车辆、任务、驾驶员..."
            className="w-80 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {currentUser && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100">
            {currentUser.accountType === 'admin' ? (
              <Shield className="h-4 w-4 text-blue-600" />
            ) : (
              <UserCircle className="h-4 w-4 text-blue-600" />
            )}
            <span className="text-sm font-medium text-blue-700">
              {accountTypeLabels[currentUser.accountType]}
            </span>
          </div>
        )}

        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-gray-900">
                {currentUser?.realName}
              </p>
              <p className="text-xs text-gray-500">
                {roleLabels[currentUser?.role || 'admin']}
              </p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="text-sm font-medium text-gray-900">
                  {currentUser?.realName}
                </p>
                <p className="text-xs text-gray-500">{currentUser?.username}</p>
              </div>
              
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="text-xs text-gray-500 mb-2">切换账号类型（测试用）</p>
                <div className="space-y-1">
                  <button
                    onClick={() => handleChangeAccountType('admin')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      currentUser?.accountType === 'admin'
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    管理员账号
                  </button>
                  <button
                    onClick={() => handleChangeAccountType('personal')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      currentUser?.accountType === 'personal'
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <UserCircle className="h-4 w-4" />
                    个人账号
                  </button>
                </div>
              </div>
              
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4" />
                  退出登录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

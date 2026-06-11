import { useState } from 'react';
import {
  Users,
  Database,
  Shield,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Clock,
  HardDrive,
  AlertCircle,
  X,
  Save,
  UserPlus,
  Eye,
  EyeOff,
  Settings,
} from 'lucide-react';
import { useAppStore } from '@/store';
import { roleLabels, statusColors } from '@/types';
import type { User } from '@/types';

export default function System() {
  const { users, addUser, updateUser, deleteUser, operationLogs, currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<'users' | 'data' | 'logs'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    realName: '',
    role: 'dispatcher' as User['role'],
    phone: '',
    email: '',
    password: '',
    status: 'active' as User['status'],
  });

  const filteredUsers = users.filter(user =>
    user.username.includes(searchTerm) ||
    user.realName.includes(searchTerm) ||
    user.phone.includes(searchTerm)
  );

  const backups = [
    { id: 1, name: 'backup_20240115_080000.sql', size: '2.4 GB', date: '2024-01-15 08:00:00', type: '自动备份' },
    { id: 2, name: 'backup_20240114_080000.sql', size: '2.3 GB', date: '2024-01-14 08:00:00', type: '自动备份' },
    { id: 3, name: 'backup_20240113_080000.sql', size: '2.3 GB', date: '2024-01-13 08:00:00', type: '自动备份' },
    { id: 4, name: 'backup_20240112_200000.sql', size: '2.2 GB', date: '2024-01-12 20:00:00', type: '手动备份' },
    { id: 5, name: 'backup_20240112_080000.sql', size: '2.2 GB', date: '2024-01-12 08:00:00', type: '自动备份' },
  ];

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      realName: '',
      role: 'dispatcher',
      phone: '',
      email: '',
      password: '',
      status: 'active',
    });
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      realName: user.realName,
      role: user.role,
      phone: user.phone,
      email: user.email || '',
      password: '',
      status: user.status,
    });
    setShowUserModal(true);
  };

  const handleSaveUser = () => {
    if (!formData.username || !formData.realName) {
      alert('请填写用户名和真实姓名');
      return;
    }
    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      if (!formData.password) {
        alert('请设置初始密码');
        return;
      }
      addUser(formData as any);
    }
    setShowUserModal(false);
  };

  const handleDeleteUser = (id: number, name: string) => {
    if (confirm(`确定要删除用户 "${name}" 吗？此操作不可撤销。`)) {
      deleteUser(id);
    }
  };

  const handleBackup = () => {
    alert('数据备份已开始，完成后会通知您。');
  };

  const handleRestore = (backupName: string) => {
    if (confirm(`确定要从备份 "${backupName}" 恢复数据吗？当前数据将被覆盖。`)) {
      alert('数据恢复任务已提交。');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">系统管理</h1>
        <p className="mt-1 text-sm text-gray-500">
          管理用户权限、数据备份和系统日志
        </p>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="h-4 w-4" />
            用户管理
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'data'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Database className="h-4 w-4" />
            数据备份
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock className="h-4 w-4" />
            操作日志
          </button>
        </div>

        {activeTab === 'users' && (
          <div>
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索用户名、姓名、电话..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleAddUser}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                添加用户
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      用户信息
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      角色
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      联系方式
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      创建时间
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {user.realName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.realName}</p>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                          <Shield className="h-3 w-3" />
                          {roleLabels[user.role]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <p>{user.phone}</p>
                        {user.email && <p className="text-gray-400">{user.email}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[user.status]}`}>
                          {user.status === 'active' ? '正常' : '禁用'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.createdAt}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="编辑"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {user.id !== currentUser?.id && (
                            <button
                              onClick={() => handleDeleteUser(user.id, user.realName)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="删除"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                共 {filteredUsers.length} 条记录
              </p>
              <div className="flex gap-1">
                <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                  上一页
                </button>
                <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg">
                  1
                </button>
                <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                  下一页
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-gray-200 p-5">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <HardDrive className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">2.4 GB</p>
                    <p className="text-sm text-gray-500">数据库大小</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-5">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">
                    <Database className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{backups.length}</p>
                    <p className="text-sm text-gray-500">备份文件数</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-5">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">每日 08:00</p>
                    <p className="text-sm text-gray-500">自动备份时间</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
              <h3 className="text-lg font-semibold text-gray-900">备份管理</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleBackup}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  立即备份
                </button>
                <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Upload className="h-4 w-4" />
                  上传备份
                  <input type="file" className="hidden" />
                </label>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      备份名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      类型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      大小
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      备份时间
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {backups.map((backup) => (
                    <tr key={backup.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Database className="h-5 w-5 text-blue-500" />
                          <span className="font-medium text-gray-900">{backup.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          backup.type === '自动备份'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-orange-50 text-orange-700'
                        }`}>
                          {backup.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{backup.size}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{backup.date}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleRestore(backup.name)}
                            className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            恢复
                          </button>
                          <button className="px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">数据安全提示</h4>
                  <p className="mt-1 text-sm text-yellow-700">
                    请定期备份数据，建议保留至少 7 天的备份历史。恢复数据前请确认备份文件的完整性，恢复操作将覆盖当前所有数据。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div>
            <div className="p-4 border-b border-gray-100">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索操作日志..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {operationLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Settings className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900">{log.operatorName}</span>
                        <span className="text-sm text-gray-500">{log.action}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{log.detail}</p>
                      <p className="mt-1 text-xs text-gray-400">{log.timestamp}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      log.type === 'success'
                        ? 'bg-green-50 text-green-700'
                        : log.type === 'warning'
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {log.type === 'success' ? '成功' : log.type === 'warning' ? '警告' : '失败'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                共 {operationLogs.length} 条记录
              </p>
              <div className="flex gap-1">
                <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                  上一页
                </button>
                <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg">
                  1
                </button>
                <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                  下一页
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingUser ? '编辑用户' : '添加用户'}
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    用户名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="请输入用户名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    真实姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.realName}
                    onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="请输入真实姓名"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">角色</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="admin">系统管理员</option>
                    <option value="manager">工地管理员</option>
                    <option value="dispatcher">调度员</option>
                    <option value="safety_officer">安全员</option>
                    <option value="fleet_manager">车队管理员</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">状态</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">正常</option>
                    <option value="disabled">禁用</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">联系电话</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="请输入联系电话"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">邮箱</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="请输入邮箱"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {editingUser ? '新密码（留空则不修改）' : '初始密码'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入密码"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowUserModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveUser}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

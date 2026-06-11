import { useState } from 'react';
import {
  AlertTriangle,
  Gauge,
  Clock,
  Truck,
  User,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  MoreHorizontal,
  Eye,
  FileWarning,
  Activity,
  Zap,
} from 'lucide-react';
import { useAppStore } from '@/store';
import {
  warningTypeLabels,
  warningLevelLabels,
  warningLevelColors,
  warningStatusLabels,
  warningStatusColors,
} from '@/types';

export default function Safety() {
  const { safetyWarnings, violationRecords, handleWarning, currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<'warnings' | 'violations'>('warnings');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const pendingCount = safetyWarnings.filter(w => w.status === 'pending').length;
  const processingCount = safetyWarnings.filter(w => w.status === 'processing').length;
  const resolvedCount = safetyWarnings.filter(w => w.status === 'resolved').length;

  const filteredWarnings = safetyWarnings.filter(warning => {
    const matchesSearch =
      warning.vehiclePlate?.includes(searchTerm) ||
      warning.driverName?.includes(searchTerm) ||
      warning.description.includes(searchTerm);
    const matchesLevel = levelFilter === 'all' || warning.level === levelFilter;
    const matchesStatus = statusFilter === 'all' || warning.status === statusFilter;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const filteredViolations = violationRecords.filter(violation => {
    return (
      violation.vehiclePlate?.includes(searchTerm) ||
      violation.driverName?.includes(searchTerm) ||
      violation.type.includes(searchTerm)
    );
  });

  const stats = [
    { label: '待处理', value: pendingCount, color: 'text-red-600 bg-red-50', icon: AlertTriangle },
    { label: '处理中', value: processingCount, color: 'text-yellow-600 bg-yellow-50', icon: Activity },
    { label: '已解决', value: resolvedCount, color: 'text-green-600 bg-green-50', icon: CheckCircle },
    { label: '违规记录', value: violationRecords.length, color: 'text-orange-600 bg-orange-50', icon: FileWarning },
  ];

  const handleResolve = (id: number) => {
    if (confirm('确定要标记为已解决吗？')) {
      handleWarning(id, currentUser?.realName || '管理员');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">安全监控</h1>
          <p className="mt-1 text-sm text-gray-500">
            实时监控车辆安全状态，处理预警和违规记录
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            实时监控中
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('warnings')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'warnings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            安全预警
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('violations')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'violations'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            违规记录
          </button>
        </div>

        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={activeTab === 'warnings' ? '搜索车牌号、驾驶员、预警描述...' : '搜索车牌号、驾驶员、违规类型...'}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {activeTab === 'warnings' && (
              <div className="flex gap-2">
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">全部级别</option>
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                  <option value="critical">严重</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">全部状态</option>
                  <option value="pending">待处理</option>
                  <option value="processing">处理中</option>
                  <option value="resolved">已解决</option>
                  <option value="ignored">已忽略</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {activeTab === 'warnings' ? (
          <div className="divide-y divide-gray-100">
            {filteredWarnings.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p>暂无预警记录</p>
              </div>
            ) : (
              filteredWarnings.map((warning) => (
                <div key={warning.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                          warning.level === 'critical'
                            ? 'bg-red-50'
                            : warning.level === 'high'
                            ? 'bg-orange-50'
                            : warning.level === 'medium'
                            ? 'bg-yellow-50'
                            : 'bg-blue-50'
                        }`}
                      >
                        {warning.type === 'overspeed' && <Gauge className={`h-6 w-6 ${
                          warning.level === 'critical'
                            ? 'text-red-600'
                            : warning.level === 'high'
                            ? 'text-orange-600'
                            : 'text-yellow-600'
                        }`} />}
                        {warning.type === 'fatigue' && <Clock className={`h-6 w-6 ${
                          warning.level === 'high'
                            ? 'text-orange-600'
                            : 'text-yellow-600'
                        }`} />}
                        {warning.type === 'violation' && <Zap className="h-6 w-6 text-orange-600" />}
                        {warning.type === 'other' && <AlertTriangle className="h-6 w-6 text-gray-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="font-medium text-gray-900">
                            {warningTypeLabels[warning.type]}
                          </h4>
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${warningLevelColors[warning.level]}`}
                          >
                            {warningLevelLabels[warning.level]}级
                          </span>
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${warningStatusColors[warning.status]}`}
                          >
                            {warningStatusLabels[warning.status]}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {warning.description}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Truck className="h-3.5 w-3.5" />
                            {warning.vehiclePlate}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            {warning.driverName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {warning.warningTime}
                          </span>
                          {warning.handler && (
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              处理人: {warning.handler}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {warning.status === 'pending' && (
                        <button
                          onClick={() => handleResolve(warning.id)}
                          className="px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          处理
                        </button>
                      )}
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredViolations.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <FileWarning className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p>暂无违规记录</p>
              </div>
            ) : (
              filteredViolations.map((violation) => (
                <div key={violation.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                        <FileWarning className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="font-medium text-gray-900">
                            {violation.type}
                          </h4>
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              violation.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {violation.status === 'pending' ? '待处理' : '已处理'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {violation.description}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Truck className="h-3.5 w-3.5" />
                            {violation.vehiclePlate}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            {violation.driverName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {violation.violationTime}
                          </span>
                          <span className="flex items-center gap-1 font-medium text-red-600">
                            罚款: ¥{violation.penalty}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            共 {activeTab === 'warnings' ? filteredWarnings.length : filteredViolations.length} 条记录
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
    </div>
  );
}

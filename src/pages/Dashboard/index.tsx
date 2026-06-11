import {
  Truck,
  BarChart3,
  AlertTriangle,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  MapPin,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '@/store';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { vehicleStatusLabels, taskStatusColors, warningLevelColors } from '@/types';
import { useNavigate } from 'react-router-dom';

const STAT_COLORS = {
  vehicles: 'from-blue-500 to-blue-600',
  volume: 'from-green-500 to-green-600',
  warnings: 'from-orange-500 to-orange-600',
  tasks: 'from-purple-500 to-purple-600',
};

const VEHICLE_STATUS_COLORS = ['#22c55e', '#3b82f6', '#eab308', '#6b7280'];

export default function Dashboard() {
  const {
    dashboardStats,
    dailyStats,
    vehicles,
    tasks,
    safetyWarnings,
    vehicleLocations,
  } = useAppStore();
  
  const navigate = useNavigate();

  const statCards = [
    {
      title: '在途车辆',
      value: dashboardStats.activeVehicles,
      unit: '辆',
      change: dashboardStats.activeVehiclesChange,
      icon: Truck,
      color: STAT_COLORS.vehicles,
      link: '/vehicles',
    },
    {
      title: '今日运输量',
      value: dashboardStats.todayVolume,
      unit: '吨',
      change: dashboardStats.todayVolumeChange,
      icon: BarChart3,
      color: STAT_COLORS.volume,
      link: '/statistics',
    },
    {
      title: '待处理预警',
      value: dashboardStats.pendingWarnings,
      unit: '条',
      change: dashboardStats.pendingWarningsChange,
      icon: AlertTriangle,
      color: STAT_COLORS.warnings,
      link: '/safety',
    },
    {
      title: '待执行任务',
      value: dashboardStats.pendingTasks,
      unit: '个',
      change: dashboardStats.pendingTasksChange,
      icon: ClipboardList,
      color: STAT_COLORS.tasks,
      link: '/tasks',
    },
  ];

  const vehicleStatusData = [
    { name: '空闲', value: vehicles.filter(v => v.status === 'active').length },
    { name: '运输中', value: vehicles.filter(v => v.status === 'in_transit').length },
    { name: '维护中', value: vehicles.filter(v => v.status === 'maintenance').length },
    { name: '停用', value: vehicles.filter(v => v.status === 'inactive').length },
  ];

  const recentTasks = tasks.slice(0, 5);
  const recentWarnings = safetyWarnings.filter(w => w.status === 'pending').slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">首页仪表盘</h1>
        <p className="mt-1 text-sm text-gray-500">
          欢迎回来，查看今日运营数据概览
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            onClick={() => navigate(stat.link)}
            className="group relative overflow-hidden rounded-xl bg-white p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
          >
            <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stat.value}
                <span className="text-lg font-normal text-gray-500 ml-1">
                  {stat.unit}
                </span>
              </p>
              <div className="mt-2 flex items-center gap-1">
                {stat.change >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ${
                    stat.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {Math.abs(stat.change)}%
                </span>
                <span className="text-xs text-gray-400">较昨日</span>
              </div>
            </div>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
            >
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              运输量趋势
            </h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg">
                近7天
              </button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 rounded-lg">
                近30天
              </button>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="transportVolume"
                  name="运输量(吨)"
                  stroke="#3b82f6"
                  strokeWidth={3
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            车辆状态分布
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {vehicleStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={VEHICLE_STATUS_COLORS[index % VEHICLE_STATUS_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {vehicleStatusData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: VEHICLE_STATUS_COLORS[index] }}
              ></div>
              <span className="text-sm text-gray-600">
                {item.name}: {item.value}辆
              </span>
            </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              最近运输任务
            </h3>
            <button
              onClick={() => navigate('/tasks')}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              查看全部
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/tasks/${task.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                      <ClipboardList className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {task.taskNo}
                      </p>
                      <p className="text-sm text-gray-500">
                        {task.startPoint} → {task.endPoint}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${taskStatusColors[task.status]
                    }`}
                  >
                    {task.status === 'pending' && '待执行'}
                    {task.status === 'in_progress' && '进行中'}
                    {task.status === 'completed' && '已完成'}
                    {task.status === 'cancelled' && '已取消'}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5" />
                    {task.vehiclePlate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {task.completedTrips}/{task.plannedTrips} 趟
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              安全预警
            </h3>
            <button
              onClick={() => navigate('/safety')}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              查看全部
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentWarnings.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                <p>暂无待处理预警</p>
              </div>
            ) : (
              recentWarnings.map((warning) => (
                <div key={warning.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          warning.level === 'critical'
                            ? 'bg-red-50'
                            : warning.level === 'high'
                            ? 'bg-orange-50'
                            : 'bg-yellow-50'
                        }`}
                      >
                        <AlertTriangle
                          className={`h-5 w-5 ${
                          warning.level === 'critical'
                            ? 'text-red-600'
                            : warning.level === 'high'
                            ? 'text-orange-600'
                            : 'text-yellow-600'
                        }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {warning.type === 'overspeed' && '超速预警'}
                          {warning.type === 'fatigue' && '疲劳驾驶'}
                          {warning.type === 'violation' && '违规行为'}
                          {warning.type === 'other' && '其他预警'}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {warning.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${warningLevelColors[warning.level]
                      }`}
                    >
                      {warning.level === 'low' && '低'}
                      {warning.level === 'medium' && '中'}
                      {warning.level === 'high' && '高'}
                      {warning.level === 'critical' && '严重'}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5" />
                      {warning.vehiclePlate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {warning.warningTime}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            实时车辆位置
          </h3>
          <span className="text-sm text-gray-500">
            共 {vehicleLocations.length} 辆车在线
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {vehicleLocations.map((vehicle) => (
            <div
              key={vehicle.vehicleId}
              className="p-4 rounded-lg bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-gray-900">
                {vehicle.plateNumber}
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p>速度: {vehicle.speed} km/h</p>
              <p className="text-xs text-gray-400">
                更新于 {vehicle.lastUpdate.split(' ')[1]}
              </p>
            </div>
          </div>
          ))}
        </div>
      </div>
    </div>
  );
}

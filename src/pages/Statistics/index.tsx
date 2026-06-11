import { useState } from 'react';
import {
  BarChart3,
  Truck,
  Download,
  Calendar,
  TrendingUp,
  BarChart as BarChartIcon,
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
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const VEHICLE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function Statistics() {
  const { dailyStats, vehicleStats, tasks } = useAppStore();
  const [timeRange, setTimeRange] = useState('7days');

  const completedTasks = tasks.filter(t => t.status === 'completed');
  const totalVolume = dailyStats.reduce((sum, d) => sum + d.transportVolume, 0);
  const totalTrips = dailyStats.reduce((sum, d) => sum + d.tripCount, 0);
  const avgVolume = Math.round(totalVolume / dailyStats.length);

  const summaryCards = [
    {
      title: '总运输量',
      value: totalVolume,
      unit: '吨',
      trend: '+12.5%',
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: '总运输趟数',
      value: totalTrips,
      unit: '趟',
      trend: '+8.3%',
      icon: Truck,
      color: 'from-green-500 to-green-600',
    },
    {
      title: '日均运输量',
      value: avgVolume,
      unit: '吨',
      trend: '+5.2%',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: '完成任务数',
      value: completedTasks.length,
      unit: '个',
      trend: '+15.0%',
      icon: BarChartIcon,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">运输统计</h1>
          <p className="mt-1 text-sm text-gray-500">
            查看运输量数据统计和可视化报表
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7days">近7天</option>
            <option value="30days">近30天</option>
            <option value="month">本月</option>
            <option value="lastMonth">上月</option>
          </select>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            导出报表
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-xl bg-white p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {card.value}
                  <span className="text-lg font-normal text-gray-500 ml-1">
                    {card.unit}
                  </span>
                </p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-white shadow-lg`}
              >
                <card.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-500">{card.trend}</span>
              <span className="text-xs text-gray-400">较上期</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              运输量趋势
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              近7天
            </div>
          </div>
          <div className="h-80">
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="transportVolume"
                  name="运输量(吨)"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="tripCount"
                  name="运输趟数"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            车辆运输占比
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleStats.slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="totalVolume"
                  nameKey="plateNumber"
                >
                  {vehicleStats.slice(0, 5).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={VEHICLE_COLORS[index % VEHICLE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {vehicleStats.slice(0, 5).map((vehicle, index) => (
              <div key={vehicle.vehicleId} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: VEHICLE_COLORS[index] }}
                  ></div>
                  <span className="text-gray-600">{vehicle.plateNumber}</span>
                </div>
                <span className="font-medium text-gray-900">{vehicle.totalVolume} 吨</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          车辆运输量排行
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vehicleStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis
                dataKey="plateNumber"
                type="category"
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
                width={80}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Bar dataKey="totalVolume" name="运输量(吨)" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="tripCount" name="趟数" fill="#22c55e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            运输明细
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  车牌号
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  运输量(吨)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  趟数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  总里程(km)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  平均载重(吨)
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  占比
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vehicleStats.map((vehicle, index) => {
                const percentage = Math.round((vehicle.totalVolume / totalVolume) * 100);
                return (
                  <tr key={vehicle.vehicleId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">
                          #{index + 1}
                        </span>
                        <span className="font-medium text-gray-900">
                          {vehicle.plateNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {vehicle.totalVolume}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {vehicle.tripCount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {vehicle.totalDistance}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {(vehicle.totalVolume / vehicle.tripCount).toFixed(1)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

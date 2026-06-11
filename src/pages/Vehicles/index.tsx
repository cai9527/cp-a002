import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Wrench,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { useAppStore } from '@/store';
import {
  vehicleStatusLabels,
  vehicleStatusColors,
  Vehicle,
  MaintenanceRecord,
} from '@/types';
import { useNavigate } from 'react-router-dom';

export default function Vehicles() {
  const { vehicles, maintenanceRecords, deleteVehicle } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const navigate = useNavigate();

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vehicleType.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const vehicleMaintenance = (vehicleId: number) => {
    return maintenanceRecords.filter((m) => m.vehicleId === vehicleId);
  };

  const handleDelete = (id: number) => {
    if (confirm('确定要删除该车辆吗？')) {
      deleteVehicle(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">车辆管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            管理运渣车辆信息、证件有效期和维护记录
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors"
        >
          <Plus className="h-4 w-4" />
          新增车辆
        </button>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索车牌号、车辆类型..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">全部状态</option>
                <option value="active">空闲</option>
                <option value="in_transit">运输中</option>
                <option value="maintenance">维护中</option>
                <option value="inactive">停用</option>
              </select>
              <button className="inline-flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                筛选
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  车牌号
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  车辆类型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  载重
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  保险到期
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  年检到期
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {vehicle.plateNumber}
                        </p>
                        <p className="text-xs text-gray-500">ID: {vehicle.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {vehicle.vehicleType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {vehicle.loadCapacity} 吨
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${vehicleStatusColors[vehicle.status]}`}
                    >
                      {vehicleStatusLabels[vehicle.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {vehicle.insuranceExpiry}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {vehicle.inspectionExpiry}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setShowMaintenanceModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="维护记录"
                      >
                        <Wrench className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="查看详情"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setShowModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            共 {filteredVehicles.length} 条记录
          </p>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
              上一页
            </button>
            <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg">
              1
            </button>
            <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
              下一页
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedVehicle ? '编辑车辆' : '新增车辆'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedVehicle(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    车牌号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedVehicle?.plateNumber}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="请输入车牌号"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    车辆类型 <span className="text-red-500">*</span>
                  </label>
                  <select
                    defaultValue={selectedVehicle?.vehicleType}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">请选择</option>
                    <option value="重型自卸货车">重型自卸货车</option>
                    <option value="中型自卸货车">中型自卸货车</option>
                    <option value="轻型自卸货车">轻型自卸货车</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    载重(吨) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    defaultValue={selectedVehicle?.loadCapacity}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="请输入载重"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    状态 <span className="text-red-500">*</span>
                  </label>
                  <select
                    defaultValue={selectedVehicle?.status || 'active'}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">空闲</option>
                    <option value="in_transit">运输中</option>
                    <option value="maintenance">维护中</option>
                    <option value="inactive">停用</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    保险到期日 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    defaultValue={selectedVehicle?.insuranceExpiry}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    年检到期日 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    defaultValue={selectedVehicle?.inspectionExpiry}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedVehicle(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedVehicle(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {showMaintenanceModal && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  维护记录
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedVehicle.plateNumber}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowMaintenanceModal(false);
                  setSelectedVehicle(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-5">
              {vehicleMaintenance(selectedVehicle.id).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Wrench className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                  <p>暂无维护记录</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vehicleMaintenance(selectedVehicle.id).map((record) => (
                    <div
                      key={record.id}
                      className="p-4 rounded-lg border border-gray-100 bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {record.type}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {record.description}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-blue-600">
                          ¥{record.cost}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span>日期: {record.maintenanceDate}</span>
                        <span>操作人: {record.operator}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                新增维护记录
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

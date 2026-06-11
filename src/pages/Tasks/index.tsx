import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  X,
  MapPin,
  Truck,
  Clock,
  Play,
  Route,
  Edit,
} from 'lucide-react';
import { useAppStore } from '@/store';
import { taskStatusLabels, taskStatusColors, Task } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/Toast';

interface FormData {
  startPoint: string;
  endPoint: string;
  vehicleId: string;
  driverId: string;
  plannedTrips: string;
  distance: string;
  cargoWeight: string;
  description: string;
}

interface FormErrors {
  startPoint?: string;
  endPoint?: string;
  vehicleId?: string;
  driverId?: string;
  plannedTrips?: string;
}

const initialFormData: FormData = {
  startPoint: '',
  endPoint: '',
  vehicleId: '',
  driverId: '',
  plannedTrips: '',
  distance: '',
  cargoWeight: '',
  description: '',
};

export default function Tasks() {
  const { tasks, vehicles, drivers, addTask, updateTask } = useAppStore();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.taskNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.startPoint?.includes(searchTerm) ||
      task.endPoint?.includes(searchTerm) ||
      task.vehiclePlate?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: '全部', value: tasks.length, color: 'bg-gray-500' },
    { label: '待执行', value: tasks.filter(t => t.status === 'pending').length, color: 'bg-yellow-500' },
    { label: '进行中', value: tasks.filter(t => t.status === 'in_progress').length, color: 'bg-blue-500' },
    { label: '已完成', value: tasks.filter(t => t.status === 'completed').length, color: 'bg-green-500' },
  ];

  const openCreateModal = () => {
    setEditingTask(null);
    setFormData(initialFormData);
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({
      startPoint: task.startPoint ?? '',
      endPoint: task.endPoint ?? '',
      vehicleId: String(task.vehicleId ?? ''),
      driverId: String(task.driverId ?? ''),
      plannedTrips: task.plannedTrips != null ? String(task.plannedTrips) : '',
      distance: task.distance != null ? String(task.distance) : '',
      cargoWeight: task.cargoWeight != null ? String(task.cargoWeight) : '',
      description: '',
    });
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormData(initialFormData);
    setErrors({});
  };

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleVehicleChange = (vehicleId: string) => {
    updateField('vehicleId', vehicleId);
    if (vehicleId) {
      const vehicle = vehicles.find(v => v.id === Number(vehicleId));
      if (vehicle) {
        updateField('cargoWeight', String(vehicle.loadCapacity));
      }
    } else {
      updateField('cargoWeight', '');
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.startPoint.trim()) {
      newErrors.startPoint = '请输入起点';
    }
    if (!formData.endPoint.trim()) {
      newErrors.endPoint = '请输入终点';
    }
    if (!formData.vehicleId) {
      newErrors.vehicleId = '请选择车辆';
    }
    if (!formData.driverId) {
      newErrors.driverId = '请选择驾驶员';
    }
    if (!formData.plannedTrips) {
      newErrors.plannedTrips = '请输入计划趟数';
    } else if (Number(formData.plannedTrips) <= 0) {
      newErrors.plannedTrips = '计划趟数必须大于0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const vehicle = vehicles.find(v => v.id === Number(formData.vehicleId));
    const driver = drivers.find(d => d.id === Number(formData.driverId));

    if (editingTask) {
      updateTask(editingTask.id, {
        startPoint: formData.startPoint.trim(),
        endPoint: formData.endPoint.trim(),
        vehicleId: Number(formData.vehicleId),
        driverId: Number(formData.driverId),
        vehiclePlate: vehicle?.plateNumber,
        driverName: driver?.name,
        distance: formData.distance ? Number(formData.distance) : undefined,
        plannedTrips: Number(formData.plannedTrips),
        cargoWeight: formData.cargoWeight ? Number(formData.cargoWeight) : undefined,
      });
      showToast('success', '任务更新成功');
    } else {
      addTask({
        startPoint: formData.startPoint.trim(),
        endPoint: formData.endPoint.trim(),
        vehicleId: Number(formData.vehicleId),
        driverId: Number(formData.driverId),
        vehiclePlate: vehicle?.plateNumber,
        driverName: driver?.name,
        distance: formData.distance ? Number(formData.distance) : undefined,
        plannedTrips: Number(formData.plannedTrips),
        cargoWeight: formData.cargoWeight ? Number(formData.cargoWeight) : undefined,
        status: 'pending',
      });
      showToast('success', '任务创建成功');
    }

    closeModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">任务调度</h1>
          <p className="mt-1 text-sm text-gray-500">
            管理运输任务分配、路线规划和实时跟踪
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors"
        >
          <Plus className="h-4 w-4" />
          创建任务
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
              <span className="text-sm text-gray-600">{stat.label}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
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
                placeholder="搜索任务编号、地点、车牌号..."
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
                <option value="pending">待执行</option>
                <option value="in_progress">进行中</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
              </select>
              <button className="inline-flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                筛选
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => navigate(`/tasks/${task.id}`)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">
                      {task.taskNo}
                    </span>
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${taskStatusColors[task.status]}`}
                    >
                      {taskStatusLabels[task.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-green-500" />
                    <span>{task.startPoint}</span>
                    <span className="text-gray-400">→</span>
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span>{task.endPoint}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {task.completedTrips}/{task.plannedTrips} 趟
                    </p>
                    <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(task.completedTrips ?? 0) / (task.plannedTrips || 1) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status === 'pending' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="开始任务"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    )}
                    {task.status === 'in_progress' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="查看路线"
                      >
                        <Route className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(task);
                      }}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                      title="编辑任务"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5" />
                  {task.vehiclePlate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  距离 {task.distance} km
                </span>
                <span className="flex items-center gap-1">
                  载重 {task.cargoWeight} 吨
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            共 {filteredTasks.length} 条记录
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
                {editingTask ? '编辑运输任务' : '创建运输任务'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    起点 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.startPoint}
                    onChange={(e) => updateField('startPoint', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.startPoint ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="请输入起点"
                  />
                  {errors.startPoint && (
                    <p className="mt-1 text-xs text-red-500">{errors.startPoint}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    终点 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.endPoint}
                    onChange={(e) => updateField('endPoint', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.endPoint ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="请输入终点"
                  />
                  {errors.endPoint && (
                    <p className="mt-1 text-xs text-red-500">{errors.endPoint}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    选择车辆 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.vehicleId}
                    onChange={(e) => handleVehicleChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.vehicleId ? 'border-red-400' : 'border-gray-200'}`}
                  >
                    <option value="">请选择车辆</option>
                    {vehicles.filter(v => v.status === 'active').map(v => (
                      <option key={v.id} value={v.id}>{v.plateNumber} - {v.loadCapacity}吨</option>
                    ))}
                  </select>
                  {errors.vehicleId && (
                    <p className="mt-1 text-xs text-red-500">{errors.vehicleId}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    选择驾驶员 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.driverId}
                    onChange={(e) => updateField('driverId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.driverId ? 'border-red-400' : 'border-gray-200'}`}
                  >
                    <option value="">请选择驾驶员</option>
                    {drivers.filter(d => d.status === 'on_duty').map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  {errors.driverId && (
                    <p className="mt-1 text-xs text-red-500">{errors.driverId}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    距离(km)
                  </label>
                  <input
                    type="number"
                    value={formData.distance}
                    onChange={(e) => updateField('distance', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="自动计算"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    计划趟数 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.plannedTrips}
                    onChange={(e) => updateField('plannedTrips', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.plannedTrips ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="请输入"
                  />
                  {errors.plannedTrips && (
                    <p className="mt-1 text-xs text-red-500">{errors.plannedTrips}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    载重(吨)
                  </label>
                  <input
                    type="number"
                    value={formData.cargoWeight}
                    onChange={(e) => updateField('cargoWeight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="自动获取"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  任务说明
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="请输入任务说明..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {editingTask ? '保存修改' : '创建任务'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

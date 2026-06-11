import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  X,
  Edit,
  Trash2,
  Eye,
  Phone,
  Calendar,
  FileBadge,
  User,
} from 'lucide-react';
import { useAppStore } from '@/store';
import { driverStatusLabels, driverStatusColors, Driver, DriverStatus } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/Toast';

interface FormData {
  name: string;
  phone: string;
  idCard: string;
  licenseNumber: string;
  licenseExpiry: string;
  yearsOfExperience: string;
  status: DriverStatus;
}

interface FormErrors {
  name?: string;
  phone?: string;
  idCard?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  yearsOfExperience?: string;
}

const initialFormData: FormData = {
  name: '',
  phone: '',
  idCard: '',
  licenseNumber: '',
  licenseExpiry: '',
  yearsOfExperience: '',
  status: 'on_duty',
};

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = '姓名为必填项';
  if (!data.phone.trim()) {
    errors.phone = '联系电话为必填项';
  } else if (!/^1[3-9]\d{9}$/.test(data.phone)) {
    errors.phone = '请输入正确的11位手机号';
  }
  if (!data.idCard.trim()) {
    errors.idCard = '身份证号为必填项';
  } else if (!/^\d{17}[\dXx]$/.test(data.idCard)) {
    errors.idCard = '请输入正确的18位身份证号';
  }
  if (!data.licenseNumber.trim()) errors.licenseNumber = '驾驶证号为必填项';
  if (!data.licenseExpiry) errors.licenseExpiry = '到期日期为必填项';
  if (data.yearsOfExperience !== '' && Number(data.yearsOfExperience) < 0) {
    errors.yearsOfExperience = '驾龄不能为负数';
  }
  return errors;
}

export default function Drivers() {
  const { drivers, addDriver, updateDriver, deleteDriver } = useAppStore();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.includes(searchTerm) ||
      driver.phone.includes(searchTerm) ||
      driver.licenseNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openAddModal = () => {
    setSelectedDriver(null);
    setFormData(initialFormData);
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setFormData({
      name: driver.name,
      phone: driver.phone,
      idCard: driver.idCard,
      licenseNumber: driver.licenseNumber,
      licenseExpiry: driver.licenseExpiry,
      yearsOfExperience: driver.yearsOfExperience != null ? String(driver.yearsOfExperience) : '',
      status: driver.status,
    });
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDriver(null);
    setFormData(initialFormData);
    setErrors({});
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if ((errors as Record<string, string>)[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete (next as Record<string, string>)[field];
        return next;
      });
    }
  };

  const handleSave = () => {
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast('error', '请检查表单填写是否正确');
      return;
    }

    const driverData = {
      name: formData.name,
      phone: formData.phone,
      idCard: formData.idCard,
      licenseNumber: formData.licenseNumber,
      licenseExpiry: formData.licenseExpiry,
      yearsOfExperience: formData.yearsOfExperience !== '' ? Number(formData.yearsOfExperience) : 0,
      status: formData.status,
    };

    try {
      if (selectedDriver) {
        updateDriver(selectedDriver.id, driverData);
        showToast('success', '驾驶员信息更新成功');
      } else {
        addDriver(driverData);
        showToast('success', '驾驶员添加成功');
      }
      closeModal();
    } catch {
      showToast('error', selectedDriver ? '更新失败，请重试' : '添加失败，请重试');
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('确定要删除该驾驶员吗？')) {
      deleteDriver(id);
      showToast('success', '驾驶员已删除');
    }
  };

  const stats = [
    { label: '总人数', value: drivers.length, color: 'text-blue-600 bg-blue-50' },
    { label: '在岗', value: drivers.filter(d => d.status === 'on_duty').length, color: 'text-green-600 bg-green-50' },
    { label: '休息', value: drivers.filter(d => d.status === 'rest').length, color: 'text-yellow-600 bg-yellow-50' },
    { label: '离岗', value: drivers.filter(d => d.status === 'off_duty' || d.status === 'suspended').length, color: 'text-gray-600 bg-gray-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">驾驶员管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            管理驾驶员信息、资质证书和出勤记录
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors"
        >
          <Plus className="h-4 w-4" />
          新增驾驶员
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${stat.color}`}>
              <User className="h-5 w-5" />
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
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
                placeholder="搜索姓名、电话、驾驶证号..."
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
                <option value="on_duty">在岗</option>
                <option value="off_duty">离岗</option>
                <option value="rest">休息</option>
                <option value="suspended">停职</option>
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
                  驾驶员
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  联系电话
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  驾驶证号
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  驾龄
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  证件到期
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <span className="text-blue-600 font-medium text-sm">
                          {driver.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {driver.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {driver.idCard}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {driver.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileBadge className="h-4 w-4 text-gray-400" />
                      {driver.licenseNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {driver.yearsOfExperience} 年
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${driverStatusColors[driver.status]}`}
                    >
                      {driverStatusLabels[driver.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {driver.licenseExpiry}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/drivers/${driver.id}`)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="查看详情"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(driver)}
                        className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(driver.id)}
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
            共 {filteredDrivers.length} 条记录
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDriver ? '编辑驾驶员' : '新增驾驶员'}
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
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="请输入姓名"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    联系电话 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="请输入手机号"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  身份证号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.idCard}
                  onChange={(e) => updateField('idCard', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.idCard ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="请输入身份证号"
                />
                {errors.idCard && <p className="mt-1 text-xs text-red-500">{errors.idCard}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    驾驶证号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => updateField('licenseNumber', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.licenseNumber ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="请输入驾驶证号"
                  />
                  {errors.licenseNumber && <p className="mt-1 text-xs text-red-500">{errors.licenseNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    到期日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.licenseExpiry}
                    onChange={(e) => updateField('licenseExpiry', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.licenseExpiry ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.licenseExpiry && <p className="mt-1 text-xs text-red-500">{errors.licenseExpiry}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    驾龄(年)
                  </label>
                  <input
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={(e) => updateField('yearsOfExperience', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.yearsOfExperience ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="请输入驾龄"
                  />
                  {errors.yearsOfExperience && <p className="mt-1 text-xs text-red-500">{errors.yearsOfExperience}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    状态 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => updateField('status', e.target.value as DriverStatus)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="on_duty">在岗</option>
                    <option value="off_duty">离岗</option>
                    <option value="rest">休息</option>
                    <option value="suspended">停职</option>
                  </select>
                </div>
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
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

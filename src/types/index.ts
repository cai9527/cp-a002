export type AccountType = 'admin' | 'personal';

export const accountTypeLabels: Record<AccountType, string> = {
  admin: '管理员账号',
  personal: '个人账号',
};

export interface User {
  id: number;
  username: string;
  realName: string;
  role: UserRole;
  accountType: AccountType;
  phone: string;
  email?: string;
  status?: 'active' | 'disabled';
  password?: string;
  createdAt: string;
  updatedAt?: string;
}

export type UserRole = 'admin' | 'manager' | 'dispatcher' | 'safety_officer' | 'fleet_manager';

export const roleLabels: Record<UserRole, string> = {
  admin: '系统管理员',
  manager: '工地管理员',
  dispatcher: '调度员',
  safety_officer: '安全员',
  fleet_manager: '车队管理员',
};

export interface ModulePermission {
  path: string;
  label: string;
  allowedAccountTypes: AccountType[];
}

export const modulePermissions: ModulePermission[] = [
  { path: '/dashboard', label: '首页仪表盘', allowedAccountTypes: ['admin', 'personal'] },
  { path: '/vehicles', label: '车辆管理', allowedAccountTypes: ['admin', 'personal'] },
  { path: '/tasks', label: '任务调度', allowedAccountTypes: ['admin', 'personal'] },
  { path: '/drivers', label: '驾驶员管理', allowedAccountTypes: ['admin', 'personal'] },
  { path: '/statistics', label: '运输统计', allowedAccountTypes: ['admin', 'personal'] },
  { path: '/safety', label: '安全监控', allowedAccountTypes: ['admin', 'personal'] },
  { path: '/system', label: '系统管理', allowedAccountTypes: ['admin'] },
];

export function hasModulePermission(accountType: AccountType, modulePath: string): boolean {
  const module = modulePermissions.find(m => m.path === modulePath);
  if (!module) return false;
  return module.allowedAccountTypes.includes(accountType);
}

export function getAccessibleModules(accountType: AccountType): ModulePermission[] {
  return modulePermissions.filter(m => m.allowedAccountTypes.includes(accountType));
}

export const statusColors: Record<'active' | 'disabled', string> = {
  active: 'bg-green-100 text-green-800',
  disabled: 'bg-gray-100 text-gray-800',
};

export interface Vehicle {
  id: number;
  plateNumber: string;
  vehicleType: string;
  loadCapacity: number;
  status: VehicleStatus;
  insuranceExpiry: string;
  inspectionExpiry: string;
  driverId?: number;
  createdAt: string;
  updatedAt: string;
}

export type VehicleStatus = 'idle' | 'in_transit' | 'maintenance' | 'disabled' | 'active';

export const vehicleStatusLabels: Record<VehicleStatus, string> = {
  idle: '空闲',
  active: '空闲',
  in_transit: '运输中',
  maintenance: '维护中',
  disabled: '停用',
};

export const vehicleStatusColors: Record<VehicleStatus, string> = {
  idle: 'bg-green-100 text-green-800',
  active: 'bg-green-100 text-green-800',
  in_transit: 'bg-blue-100 text-blue-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
  disabled: 'bg-gray-100 text-gray-800',
};

export interface MaintenanceRecord {
  id: number;
  vehicleId: number;
  plateNumber?: string;
  maintenanceDate?: string;
  date?: string;
  type: string;
  description: string;
  cost: number;
  operator: string;
  mileage?: number;
  nextMaintenanceDate?: string;
  remark?: string;
}

export interface Driver {
  id: number;
  name: string;
  idCard: string;
  licenseNumber: string;
  licenseExpiry: string;
  phone: string;
  status: DriverStatus;
  yearsOfExperience?: number;
  drivingYears?: number;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export type DriverStatus = 'on_duty' | 'off_duty' | 'rest' | 'suspended';

export const driverStatusLabels: Record<DriverStatus, string> = {
  on_duty: '在岗',
  off_duty: '离岗',
  rest: '休息',
  suspended: '停职',
};

export const driverStatusColors: Record<DriverStatus, string> = {
  on_duty: 'bg-green-100 text-green-800',
  off_duty: 'bg-gray-100 text-gray-800',
  rest: 'bg-blue-100 text-blue-800',
  suspended: 'bg-red-100 text-red-800',
};

export interface AttendanceRecord {
  id: number;
  driverId: number;
  date: string;
  status: 'present' | 'absent' | 'leave' | 'rest';
  checkIn?: string;
  checkOut?: string;
}

export interface Task {
  id: number;
  taskNo: string;
  vehicleId: number;
  driverId: number;
  vehiclePlate?: string;
  driverName?: string;
  startPoint?: string;
  endPoint?: string;
  fromLocation?: string;
  toLocation?: string;
  distance?: number;
  plannedTrips?: number;
  completedTrips?: number;
  cargoWeight?: number;
  weight?: number;
  cargoType?: string;
  status: TaskStatus;
  progress?: number;
  currentLocation?: string;
  scheduledTime?: string;
  startTime?: string;
  endTime?: string;
  estimatedArrival?: string;
  createdBy?: number;
  createdAt: string;
  updatedAt?: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export const taskStatusLabels: Record<TaskStatus, string> = {
  pending: '待执行',
  in_progress: '进行中',
  completed: '已完成',
  cancelled: '已取消',
};

export const taskStatusColors: Record<TaskStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

export interface TransportRecord {
  id: number;
  taskId: number;
  tripNo: number;
  weight: number;
  startTime: string;
  endTime: string;
  startPoint: string;
  endPoint: string;
}

export interface SafetyWarning {
  id: number;
  vehicleId: number;
  driverId: number;
  vehiclePlate?: string;
  driverName?: string;
  type: WarningType;
  level: WarningLevel;
  description: string;
  warningTime: string;
  status: WarningStatus;
  handler?: string;
  handleTime?: string;
  handleNote?: string;
}

export type WarningType = 'overspeed' | 'fatigue' | 'violation' | 'other';

export const warningTypeLabels: Record<WarningType, string> = {
  overspeed: '超速预警',
  fatigue: '疲劳驾驶',
  violation: '违规行为',
  other: '其他',
};

export type WarningLevel = 'low' | 'medium' | 'high' | 'critical';

export const warningLevelLabels: Record<WarningLevel, string> = {
  low: '低',
  medium: '中',
  high: '高',
  critical: '严重',
};

export const warningLevelColors: Record<WarningLevel, string> = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

export type WarningStatus = 'pending' | 'processing' | 'resolved' | 'ignored';

export const warningStatusLabels: Record<WarningStatus, string> = {
  pending: '待处理',
  processing: '处理中',
  resolved: '已解决',
  ignored: '已忽略',
};

export const warningStatusColors: Record<WarningStatus, string> = {
  pending: 'bg-red-100 text-red-800',
  processing: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  ignored: 'bg-gray-100 text-gray-800',
};

export interface ViolationRecord {
  id: number;
  vehicleId: number;
  driverId: number;
  vehiclePlate?: string;
  driverName?: string;
  type: string;
  description: string;
  violationTime: string;
  location?: string;
  penalty: number;
  points?: number;
  status: 'pending' | 'processed' | 'resolved';
  createdAt?: string;
}

export interface DailyStats {
  date: string;
  transportVolume: number;
  tripCount: number;
  vehicleCount?: number;
  activeVehicles?: number;
}

export interface VehicleStats {
  vehicleId: number;
  plateNumber: string;
  totalVolume: number;
  tripCount: number;
  totalDistance: number;
}

export interface DashboardStats {
  activeVehicles: number;
  todayVolume: number;
  pendingWarnings: number;
  pendingTasks: number;
  activeVehiclesChange: number;
  todayVolumeChange: number;
  pendingWarningsChange: number;
  pendingTasksChange: number;
}

export interface VehicleLocation {
  vehicleId: number;
  plateNumber: string;
  lat: number;
  lng: number;
  speed: number;
  direction: number;
  lastUpdate: string;
}

export interface OperationLog {
  id: number;
  userId?: number;
  operatorId?: number;
  username?: string;
  operatorName?: string;
  action: string;
  module?: string;
  detail: string;
  ip: string;
  createdAt?: string;
  timestamp?: string;
  type?: 'success' | 'warning' | 'error';
}

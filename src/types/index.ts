export interface User {
  id: number;
  username: string;
  realName: string;
  role: UserRole;
  phone: string;
  createdAt: string;
}

export type UserRole = 'admin' | 'manager' | 'dispatcher' | 'safety' | 'fleet';

export const roleLabels: Record<UserRole, string> = {
  admin: '系统管理员',
  manager: '工地管理员',
  dispatcher: '调度员',
  safety: '安全员',
  fleet: '车队管理员',
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

export type VehicleStatus = 'active' | 'in_transit' | 'maintenance' | 'inactive';

export const vehicleStatusLabels: Record<VehicleStatus, string> = {
  active: '空闲',
  in_transit: '运输中',
  maintenance: '维护中',
  inactive: '停用',
};

export const vehicleStatusColors: Record<VehicleStatus, string> = {
  active: 'bg-green-100 text-green-800',
  in_transit: 'bg-blue-100 text-blue-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
  inactive: 'bg-gray-100 text-gray-800',
};

export interface MaintenanceRecord {
  id: number;
  vehicleId: number;
  maintenanceDate: string;
  type: string;
  description: string;
  cost: number;
  operator: string;
}

export interface Driver {
  id: number;
  name: string;
  idCard: string;
  licenseNumber: string;
  licenseExpiry: string;
  phone: string;
  status: DriverStatus;
  yearsOfExperience: number;
  createdAt: string;
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
  status: 'present' | 'absent' | 'leave';
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
  startPoint: string;
  endPoint: string;
  distance: number;
  plannedTrips: number;
  completedTrips: number;
  cargoWeight: number;
  status: TaskStatus;
  startTime?: string;
  endTime?: string;
  createdBy: number;
  createdAt: string;
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
  penalty: number;
  status: 'pending' | 'processed';
}

export interface DailyStats {
  date: string;
  transportVolume: number;
  tripCount: number;
  vehicleCount: number;
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
  userId: number;
  username: string;
  action: string;
  module: string;
  detail: string;
  ip: string;
  createdAt: string;
}

import { create } from 'zustand';
import {
  User,
  Vehicle,
  Driver,
  Task,
  SafetyWarning,
  ViolationRecord,
  DashboardStats,
  DailyStats,
  VehicleStats,
  MaintenanceRecord,
  VehicleLocation,
  OperationLog,
} from '@/types';
import {
  mockUsers,
  mockVehicles,
  mockDrivers,
  mockTasks,
  mockSafetyWarnings,
  mockViolationRecords,
  mockDashboardStats,
  mockDailyStats,
  mockVehicleStats,
  mockMaintenanceRecords,
  mockVehicleLocations,
  mockOperationLogs,
} from '@/mock';

interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  sidebarCollapsed: boolean;
  
  users: User[];
  vehicles: Vehicle[];
  drivers: Driver[];
  tasks: Task[];
  safetyWarnings: SafetyWarning[];
  violationRecords: ViolationRecord[];
  dashboardStats: DashboardStats;
  dailyStats: DailyStats[];
  vehicleStats: VehicleStats[];
  maintenanceRecords: MaintenanceRecord[];
  vehicleLocations: VehicleLocation[];
  operationLogs: OperationLog[];
  
  login: (username: string, password: string) => boolean;
  logout: () => void;
  toggleSidebar: () => void;
  
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateVehicle: (id: number, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: number) => void;
  
  addDriver: (driver: Omit<Driver, 'id' | 'createdAt'>) => void;
  updateDriver: (id: number, driver: Partial<Driver>) => void;
  deleteDriver: (id: number) => void;
  
  addTask: (task: Omit<Task, 'id' | 'completedTrips' | 'createdAt' | 'taskNo'>) => void;
  updateTask: (id: number, task: Partial<Task>) => void;
  
  handleWarning: (id: number, handler: string) => void;
  
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: number, user: Partial<User>) => void;
  deleteUser: (id: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  sidebarCollapsed: false,
  
  users: mockUsers,
  vehicles: mockVehicles,
  drivers: mockDrivers,
  tasks: mockTasks,
  safetyWarnings: mockSafetyWarnings,
  violationRecords: mockViolationRecords,
  dashboardStats: mockDashboardStats,
  dailyStats: mockDailyStats,
  vehicleStats: mockVehicleStats,
  maintenanceRecords: mockMaintenanceRecords,
  vehicleLocations: mockVehicleLocations,
  operationLogs: mockOperationLogs,
  
  login: (username: string, password: string) => {
    const user = mockUsers.find(u => u.username === username);
    if (user && password === '123456') {
      set({ currentUser: user, isAuthenticated: true });
      return true;
    }
    return false;
  },
  
  logout: () => {
    set({ currentUser: null, isAuthenticated: false });
  },
  
  toggleSidebar: () => {
    set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },
  
  addVehicle: (vehicle) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: Math.max(...get().vehicles.map(v => v.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set(state => ({ vehicles: [...state.vehicles, newVehicle] }));
  },
  
  updateVehicle: (id, vehicle) => {
    set(state => ({
      vehicles: state.vehicles.map(v =>
        v.id === id ? { ...v, ...vehicle, updatedAt: new Date().toISOString() } : v
      ),
    }));
  },
  
  deleteVehicle: (id) => {
    set(state => ({
      vehicles: state.vehicles.filter(v => v.id !== id),
    }));
  },
  
  addDriver: (driver) => {
    const newDriver: Driver = {
      ...driver,
      id: Math.max(...get().drivers.map(d => d.id)) + 1,
      createdAt: new Date().toISOString(),
    };
    set(state => ({ drivers: [...state.drivers, newDriver] }));
  },
  
  updateDriver: (id, driver) => {
    set(state => ({
      drivers: state.drivers.map(d =>
        d.id === id ? { ...d, ...driver } : d
      ),
    }));
  },
  
  deleteDriver: (id) => {
    set(state => ({
      drivers: state.drivers.filter(d => d.id !== id),
    }));
  },
  
  addTask: (task) => {
    const taskNo = `T${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(get().tasks.length + 1).padStart(3, '0')}`;
    const newTask: Task = {
      ...task,
      id: Math.max(...get().tasks.map(t => t.id)) + 1,
      taskNo,
      completedTrips: 0,
      createdAt: new Date().toISOString(),
    };
    set(state => ({ tasks: [newTask, ...state.tasks] }));
  },
  
  updateTask: (id, task) => {
    set(state => ({
      tasks: state.tasks.map(t =>
        t.id === id ? { ...t, ...task } : t
      ),
    }));
  },
  
  handleWarning: (id, handler) => {
    set(state => ({
      safetyWarnings: state.safetyWarnings.map(w =>
        w.id === id
          ? { ...w, status: 'resolved', handler, handleTime: new Date().toISOString() }
          : w
      ),
    }));
  },
  
  addUser: (user) => {
    const newUser: User = {
      ...user,
      id: Math.max(...get().users.map(u => u.id)) + 1,
      createdAt: new Date().toISOString(),
    };
    set(state => ({ users: [...state.users, newUser] }));
  },
  
  updateUser: (id, user) => {
    set(state => ({
      users: state.users.map(u =>
        u.id === id ? { ...u, ...user } : u
      ),
    }));
  },
  
  deleteUser: (id) => {
    set(state => ({
      users: state.users.filter(u => u.id !== id),
    }));
  },
}));

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
  ModulePermission,
  AccountType,
  getAccessibleModules,
  hasModulePermission,
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

const STORAGE_KEY = 'app_state';

function loadPersistedState(): Partial<AppState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        currentUser: parsed.currentUser || null,
        isAuthenticated: parsed.isAuthenticated || false,
        sidebarCollapsed: parsed.sidebarCollapsed || false,
      };
    }
  } catch (e) {
    console.warn('Failed to load persisted state:', e);
  }
  return {};
}

function persistState(state: Partial<AppState>) {
  try {
    const toPersist = {
      currentUser: state.currentUser,
      isAuthenticated: state.isAuthenticated,
      sidebarCollapsed: state.sidebarCollapsed,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
  } catch (e) {
    console.warn('Failed to persist state:', e);
  }
}

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
  
  getAccessibleModules: () => ModulePermission[];
  hasModulePermission: (modulePath: string) => boolean;
  updateCurrentUserAccountType: (accountType: AccountType) => void;
  
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

const persistedInitial = loadPersistedState();

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: persistedInitial.currentUser ?? null,
  isAuthenticated: persistedInitial.isAuthenticated ?? false,
  sidebarCollapsed: persistedInitial.sidebarCollapsed ?? false,
  
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
      const newState = { currentUser: user, isAuthenticated: true };
      set(newState);
      persistState({ ...get(), ...newState });
      return true;
    }
    return false;
  },
  
  logout: () => {
    const newState = { currentUser: null, isAuthenticated: false };
    set(newState);
    persistState({ ...get(), ...newState });
  },
  
  toggleSidebar: () => {
    set(state => {
      const newState = { sidebarCollapsed: !state.sidebarCollapsed };
      persistState({ ...state, ...newState });
      return newState;
    });
  },
  
  getAccessibleModules: () => {
    const { currentUser } = get();
    if (!currentUser) return [];
    return getAccessibleModules(currentUser.accountType);
  },
  
  hasModulePermission: (modulePath: string) => {
    const { currentUser } = get();
    if (!currentUser) return false;
    return hasModulePermission(currentUser.accountType, modulePath);
  },
  
  updateCurrentUserAccountType: (accountType: AccountType) => {
    const { currentUser, users } = get();
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, accountType, updatedAt: new Date().toISOString() };
    const newState = { 
      currentUser: updatedUser,
      users: users.map(u => u.id === currentUser.id ? updatedUser : u)
    };
    set(newState);
    persistState({ ...get(), ...newState });
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
      accountType: user.accountType || 'personal',
      id: Math.max(...get().users.map(u => u.id)) + 1,
      createdAt: new Date().toISOString(),
    };
    set(state => ({ users: [...state.users, newUser] }));
  },
  
  updateUser: (id, user) => {
    const { currentUser } = get();
    const updatedUsers = get().users.map(u =>
      u.id === id ? { ...u, ...user, updatedAt: new Date().toISOString() } : u
    );
    const updatedCurrentUser = currentUser && currentUser.id === id
      ? { ...currentUser, ...user, updatedAt: new Date().toISOString() }
      : currentUser;
    const newState = {
      users: updatedUsers,
      currentUser: updatedCurrentUser,
    };
    set(newState);
    if (currentUser && currentUser.id === id) {
      persistState({ ...get(), ...newState });
    }
  },
  
  deleteUser: (id) => {
    set(state => ({
      users: state.users.filter(u => u.id !== id),
    }));
  },
}));

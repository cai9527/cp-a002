/**
 * In-memory data store, initialized from mock data
 */
import {
  mockUsers,
  mockVehicles,
  mockDrivers,
  mockTasks,
  mockSafetyWarnings,
  mockViolationRecords,
} from '@/mock'

export const users = [...mockUsers]
export const vehicles = [...mockVehicles]
export const drivers = [...mockDrivers]
export const tasks = [...mockTasks]
export const safetyWarnings = [...mockSafetyWarnings]
export const violationRecords = [...mockViolationRecords]

/**
 * Task management API routes
 */
import { Router, type Request, type Response } from 'express'
import { tasks, vehicles, drivers } from '../store.js'
import type { Task, TaskStatus } from '@/types'

const router = Router()

/**
 * List all tasks
 * GET /api/tasks
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, data: tasks })
})

/**
 * Get task by id
 * GET /api/tasks/:id
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id)
  const task = tasks.find((t) => t.id === id)
  if (!task) {
    res.status(404).json({ success: false, error: 'Task not found' })
    return
  }
  res.json({ success: true, data: task })
})

/**
 * Create task
 * POST /api/tasks
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { startPoint, endPoint, vehicleId, driverId, plannedTrips } = req.body

  if (!startPoint) {
    res.status(400).json({ success: false, error: 'startPoint is required', field: 'startPoint' })
    return
  }
  if (!endPoint) {
    res.status(400).json({ success: false, error: 'endPoint is required', field: 'endPoint' })
    return
  }
  if (!vehicleId) {
    res.status(400).json({ success: false, error: 'vehicleId is required', field: 'vehicleId' })
    return
  }
  if (!driverId) {
    res.status(400).json({ success: false, error: 'driverId is required', field: 'driverId' })
    return
  }
  if (!plannedTrips || plannedTrips <= 0) {
    res.status(400).json({ success: false, error: 'plannedTrips must be greater than 0', field: 'plannedTrips' })
    return
  }

  const vehicle = vehicles.find((v) => v.id === Number(vehicleId))
  const driver = drivers.find((d) => d.id === Number(driverId))
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
  const taskCount = tasks.length + 1
  const taskNo = `T${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(taskCount).padStart(3, '0')}`

  const newTask: Task = {
    id: Math.max(...tasks.map((t) => t.id), 0) + 1,
    taskNo,
    vehicleId: Number(vehicleId),
    driverId: Number(driverId),
    vehiclePlate: vehicle?.plateNumber,
    driverName: driver?.name,
    startPoint,
    endPoint,
    distance: req.body.distance,
    plannedTrips: Number(plannedTrips),
    completedTrips: 0,
    cargoWeight: req.body.cargoWeight,
    status: 'pending',
    startTime: req.body.startTime,
    createdBy: req.body.createdBy,
    createdAt: now,
  }
  tasks.push(newTask)
  res.status(201).json({ success: true, data: newTask })
})

/**
 * Update task
 * PUT /api/tasks/:id
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id)
  const index = tasks.findIndex((t) => t.id === id)
  if (index === -1) {
    res.status(404).json({ success: false, error: 'Task not found' })
    return
  }

  const updated: Task = {
    ...tasks[index],
    ...req.body,
    id,
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
  }
  tasks[index] = updated
  res.json({ success: true, data: updated })
})

/**
 * Update task status
 * PATCH /api/tasks/:id/status
 */
router.patch('/:id/status', async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id)
  const index = tasks.findIndex((t) => t.id === id)
  if (index === -1) {
    res.status(404).json({ success: false, error: 'Task not found' })
    return
  }

  const { status } = req.body
  if (!status) {
    res.status(400).json({ success: false, error: 'status is required', field: 'status' })
    return
  }

  const validStatuses: TaskStatus[] = ['pending', 'in_progress', 'completed', 'cancelled']
  if (!validStatuses.includes(status)) {
    res.status(400).json({ success: false, error: 'Invalid status value', field: 'status' })
    return
  }

  const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
  const updated: Task = {
    ...tasks[index],
    status,
    updatedAt: now,
  }

  if (status === 'in_progress' && !tasks[index].startTime) {
    updated.startTime = now
  }
  if (status === 'completed' && !tasks[index].endTime) {
    updated.endTime = now
  }

  tasks[index] = updated
  res.json({ success: true, data: updated })
})

export default router

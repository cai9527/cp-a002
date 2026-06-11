/**
 * Vehicle management API routes
 */
import { Router, type Request, type Response } from 'express'
import { vehicles } from '../store.js'
import type { Vehicle } from '@/types'

const router = Router()

/**
 * List all vehicles
 * GET /api/vehicles
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, data: vehicles })
})

/**
 * Get vehicle by id
 * GET /api/vehicles/:id
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id)
  const vehicle = vehicles.find((v) => v.id === id)
  if (!vehicle) {
    res.status(404).json({ success: false, error: 'Vehicle not found' })
    return
  }
  res.json({ success: true, data: vehicle })
})

/**
 * Create vehicle
 * POST /api/vehicles
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { plateNumber, vehicleType, loadCapacity } = req.body

  if (!plateNumber) {
    res.status(400).json({ success: false, error: 'plateNumber is required', field: 'plateNumber' })
    return
  }
  if (!vehicleType) {
    res.status(400).json({ success: false, error: 'vehicleType is required', field: 'vehicleType' })
    return
  }
  if (!loadCapacity || loadCapacity <= 0) {
    res.status(400).json({ success: false, error: 'loadCapacity must be greater than 0', field: 'loadCapacity' })
    return
  }

  const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
  const newVehicle: Vehicle = {
    id: Math.max(...vehicles.map((v) => v.id), 0) + 1,
    plateNumber,
    vehicleType,
    loadCapacity,
    status: req.body.status || 'active',
    insuranceExpiry: req.body.insuranceExpiry || '',
    inspectionExpiry: req.body.inspectionExpiry || '',
    driverId: req.body.driverId,
    createdAt: now,
    updatedAt: now,
  }
  vehicles.push(newVehicle)
  res.status(201).json({ success: true, data: newVehicle })
})

/**
 * Update vehicle
 * PUT /api/vehicles/:id
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id)
  const index = vehicles.findIndex((v) => v.id === id)
  if (index === -1) {
    res.status(404).json({ success: false, error: 'Vehicle not found' })
    return
  }

  const updated: Vehicle = {
    ...vehicles[index],
    ...req.body,
    id,
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
  }
  vehicles[index] = updated
  res.json({ success: true, data: updated })
})

/**
 * Delete vehicle
 * DELETE /api/vehicles/:id
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id)
  const index = vehicles.findIndex((v) => v.id === id)
  if (index === -1) {
    res.status(404).json({ success: false, error: 'Vehicle not found' })
    return
  }

  vehicles.splice(index, 1)
  res.json({ success: true, data: null })
})

export default router

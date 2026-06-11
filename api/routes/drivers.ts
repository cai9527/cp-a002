/**
 * Driver management API routes
 */
import { Router, type Request, type Response } from 'express'
import { drivers } from '../store.js'
import type { Driver } from '@/types'

const router = Router()

/**
 * List all drivers
 * GET /api/drivers
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, data: drivers })
})

/**
 * Get driver by id
 * GET /api/drivers/:id
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id)
  const driver = drivers.find((d) => d.id === id)
  if (!driver) {
    res.status(404).json({ success: false, error: 'Driver not found' })
    return
  }
  res.json({ success: true, data: driver })
})

/**
 * Create driver
 * POST /api/drivers
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { name, phone, idCard, licenseNumber, licenseExpiry } = req.body

  if (!name) {
    res.status(400).json({ success: false, error: 'name is required', field: 'name' })
    return
  }
  if (!phone || !/^\d{11}$/.test(phone)) {
    res.status(400).json({ success: false, error: 'phone must be 11 digits', field: 'phone' })
    return
  }
  if (!idCard || !/^\d{18}$/.test(idCard)) {
    res.status(400).json({ success: false, error: 'idCard must be 18 digits', field: 'idCard' })
    return
  }
  if (!licenseNumber) {
    res.status(400).json({ success: false, error: 'licenseNumber is required', field: 'licenseNumber' })
    return
  }
  if (!licenseExpiry) {
    res.status(400).json({ success: false, error: 'licenseExpiry is required', field: 'licenseExpiry' })
    return
  }

  const newDriver: Driver = {
    id: Math.max(...drivers.map((d) => d.id), 0) + 1,
    name,
    idCard,
    licenseNumber,
    licenseExpiry,
    phone,
    status: req.body.status || 'on_duty',
    yearsOfExperience: req.body.yearsOfExperience,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
  }
  drivers.push(newDriver)
  res.status(201).json({ success: true, data: newDriver })
})

/**
 * Update driver
 * PUT /api/drivers/:id
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id)
  const index = drivers.findIndex((d) => d.id === id)
  if (index === -1) {
    res.status(404).json({ success: false, error: 'Driver not found' })
    return
  }

  const updated: Driver = {
    ...drivers[index],
    ...req.body,
    id,
  }
  drivers[index] = updated
  res.json({ success: true, data: updated })
})

/**
 * Delete driver
 * DELETE /api/drivers/:id
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id)
  const index = drivers.findIndex((d) => d.id === id)
  if (index === -1) {
    res.status(404).json({ success: false, error: 'Driver not found' })
    return
  }

  drivers.splice(index, 1)
  res.json({ success: true, data: null })
})

export default router

/**
 * Safety monitoring API routes
 */
import { Router, type Request, type Response } from 'express'
import { safetyWarnings, violationRecords } from '../store.js'
import type { SafetyWarning, WarningStatus } from '@/types'

const router = Router()

/**
 * List all warnings
 * GET /api/safety/warnings
 */
router.get('/warnings', async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, data: safetyWarnings })
})

/**
 * Handle warning
 * PATCH /api/safety/warnings/:id/handle
 */
router.patch('/warnings/:id/handle', async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id)
  const index = safetyWarnings.findIndex((w) => w.id === id)
  if (index === -1) {
    res.status(404).json({ success: false, error: 'Warning not found' })
    return
  }

  const { status, handler, handleNote } = req.body
  const validStatuses: WarningStatus[] = ['processing', 'resolved', 'ignored']
  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ success: false, error: 'Invalid status value', field: 'status' })
    return
  }

  const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
  const updated: SafetyWarning = {
    ...safetyWarnings[index],
    status,
    handler: handler || safetyWarnings[index].handler,
    handleTime: now,
    handleNote: handleNote || safetyWarnings[index].handleNote,
  }
  safetyWarnings[index] = updated
  res.json({ success: true, data: updated })
})

/**
 * List all violations
 * GET /api/safety/violations
 */
router.get('/violations', async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, data: violationRecords })
})

export default router

/**
 * User management API routes
 */
import { Router, type Request, type Response } from 'express'
import { users } from '../store.js'
import type { User } from '@/types'

const router = Router()

/**
 * List all users
 * GET /api/users
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, data: users })
})

/**
 * Get user by id
 * GET /api/users/:id
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id)
  const user = users.find((u) => u.id === id)
  if (!user) {
    res.status(404).json({ success: false, error: 'User not found' })
    return
  }
  res.json({ success: true, data: user })
})

/**
 * Create user
 * POST /api/users
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { username, realName, password, phone } = req.body

  if (!username) {
    res.status(400).json({ success: false, error: 'username is required', field: 'username' })
    return
  }
  if (!realName) {
    res.status(400).json({ success: false, error: 'realName is required', field: 'realName' })
    return
  }
  if (!password) {
    res.status(400).json({ success: false, error: 'password is required', field: 'password' })
    return
  }
  if (!phone) {
    res.status(400).json({ success: false, error: 'phone is required', field: 'phone' })
    return
  }

  const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
  const newUser: User = {
    id: Math.max(...users.map((u) => u.id), 0) + 1,
    username,
    realName,
    role: req.body.role || 'dispatcher',
    accountType: req.body.accountType || 'personal',
    phone,
    email: req.body.email,
    status: 'active',
    password,
    createdAt: now,
    updatedAt: now,
  }
  users.push(newUser)
  res.status(201).json({ success: true, data: newUser })
})

/**
 * Update user
 * PUT /api/users/:id
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id)
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) {
    res.status(404).json({ success: false, error: 'User not found' })
    return
  }

  const updated: User = {
    ...users[index],
    ...req.body,
    id,
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
  }
  users[index] = updated
  res.json({ success: true, data: updated })
})

/**
 * Delete user
 * DELETE /api/users/:id
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id)
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) {
    res.status(404).json({ success: false, error: 'User not found' })
    return
  }

  users.splice(index, 1)
  res.json({ success: true, data: null })
})

export default router

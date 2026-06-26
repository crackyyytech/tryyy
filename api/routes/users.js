const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')
const { protect } = require('../middleware/auth')

// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, phone: true, address: true, createdAt: true },
    })
    res.json({ success: true, data: { user } })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile.' })
  }
})

// PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, address } = req.body

    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required.' })
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone, address },
      select: { id: true, name: true, email: true, role: true, phone: true, address: true, updatedAt: true },
    })

    res.json({ success: true, message: 'Profile updated successfully.', data: { user } })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile.' })
  }
})

module.exports = router

const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../lib/prisma')
const { protect } = require('../middleware/auth')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' })
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, phone, address },
      select: { id: true, name: true, email: true, role: true, phone: true, address: true, createdAt: true },
    })

    const token = generateToken(user.id)
    res.status(201).json({ success: true, message: 'Registration successful.', data: { user, token } })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ success: false, message: 'Registration failed.' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }

    const token = generateToken(user.id)
    const { password: _, ...userWithoutPassword } = user
    res.json({ success: true, message: 'Login successful.', data: { user: userWithoutPassword, token } })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, message: 'Login failed.' })
  }
})

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, data: { user: req.user } })
})

module.exports = router

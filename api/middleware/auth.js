const jwt = require('jsonwebtoken')
const prisma = require('../lib/prisma')

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, phone: true, address: true },
    })

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' })
  }
}

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next()
  } else {
    res.status(403).json({ success: false, message: 'Access denied. Admins only.' })
  }
}

module.exports = { protect, adminOnly }

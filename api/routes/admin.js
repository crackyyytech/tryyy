const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')
const { protect, adminOnly } = require('../middleware/auth')

// All admin routes require auth + admin role
router.use(protect, adminOnly)

// GET /api/admin/dashboard-stats
router.get('/dashboard-stats', async (req, res) => {
  try {
    const [totalFoods, totalOrders, totalUsers, revenueData] = await Promise.all([
      prisma.food.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.order.aggregate({
        where: { orderStatus: { not: 'CANCELLED' } },
        _sum: { totalAmount: true },
      }),
    ])

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
    })

    const ordersByStatus = await prisma.order.groupBy({
      by: ['orderStatus'],
      _count: { id: true },
    })

    res.json({
      success: true,
      data: {
        stats: {
          totalFoods,
          totalOrders,
          totalUsers,
          totalRevenue: revenueData._sum.totalAmount || 0,
        },
        recentOrders,
        ordersByStatus,
      },
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats.' })
  }
})

// --- FOOD MANAGEMENT ---

// POST /api/admin/foods
router.post('/foods', async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, rating, isAvailable, preparationTime, foodType } = req.body

    if (!name || !description || !price || !category || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Name, description, price, category, and image are required.' })
    }

    const food = await prisma.food.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        imageUrl,
        rating: rating ? parseFloat(rating) : 4.0,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        preparationTime: preparationTime ? parseInt(preparationTime) : 30,
        foodType: foodType || 'VEG',
      },
    })

    res.status(201).json({ success: true, message: 'Food item created.', data: { food } })
  } catch (error) {
    console.error('Create food error:', error)
    res.status(500).json({ success: false, message: 'Failed to create food item.' })
  }
})

// PUT /api/admin/foods/:id
router.put('/foods/:id', async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, rating, isAvailable, preparationTime, foodType } = req.body

    const existing = await prisma.food.findUnique({ where: { id: req.params.id } })
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Food item not found.' })
    }

    const food = await prisma.food.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : existing.price,
        category,
        imageUrl,
        rating: rating ? parseFloat(rating) : existing.rating,
        isAvailable: isAvailable !== undefined ? isAvailable : existing.isAvailable,
        preparationTime: preparationTime ? parseInt(preparationTime) : existing.preparationTime,
        foodType: foodType || existing.foodType,
      },
    })

    res.json({ success: true, message: 'Food item updated.', data: { food } })
  } catch (error) {
    console.error('Update food error:', error)
    res.status(500).json({ success: false, message: 'Failed to update food item.' })
  }
})

// DELETE /api/admin/foods/:id
router.delete('/foods/:id', async (req, res) => {
  try {
    const existing = await prisma.food.findUnique({ where: { id: req.params.id } })
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Food item not found.' })
    }
    await prisma.food.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'Food item deleted.' })
  } catch (error) {
    console.error('Delete food error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete food item.' })
  }
})

// --- ORDER MANAGEMENT ---

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const where = status && status !== 'ALL' ? { orderStatus: status } : {}

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          items: { include: { food: { select: { name: true, imageUrl: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.order.count({ where }),
    ])

    res.json({ success: true, data: { orders, total, page: parseInt(page), limit: parseInt(limit) } })
  } catch (error) {
    console.error('Get admin orders error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' })
  }
})

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { orderStatus } = req.body
    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']

    if (!orderStatus || !validStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid order status.' })
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        orderStatus,
        paymentStatus: orderStatus === 'DELIVERED' ? 'PAID' : undefined,
      },
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
    })

    res.json({ success: true, message: 'Order status updated.', data: { order } })
  } catch (error) {
    console.error('Update order status error:', error)
    res.status(500).json({ success: false, message: 'Failed to update order status.' })
  }
})

// --- USER MANAGEMENT ---

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'USER' },
      select: {
        id: true, name: true, email: true, phone: true,
        address: true, role: true, createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ success: true, data: { users } })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users.' })
  }
})

module.exports = router

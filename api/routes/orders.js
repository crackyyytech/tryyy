const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')
const { protect } = require('../middleware/auth')

// POST /api/orders - Place an order
router.post('/', protect, async (req, res) => {
  try {
    const { items, deliveryAddress, phone, paymentMethod, subtotal, deliveryFee, tax, totalAmount } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must have at least one item.' })
    }
    if (!deliveryAddress || !phone) {
      return res.status(400).json({ success: false, message: 'Delivery address and phone are required.' })
    }

    // Validate food items exist
    const foodIds = items.map(item => item.foodId)
    const foods = await prisma.food.findMany({ where: { id: { in: foodIds } } })
    if (foods.length !== foodIds.length) {
      return res.status(400).json({ success: false, message: 'One or more food items not found.' })
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        deliveryAddress,
        phone,
        paymentMethod: paymentMethod || 'CASH_ON_DELIVERY',
        paymentStatus: paymentMethod === 'ONLINE' ? 'PAID' : 'PENDING',
        subtotal: parseFloat(subtotal),
        deliveryFee: parseFloat(deliveryFee),
        tax: parseFloat(tax),
        totalAmount: parseFloat(totalAmount),
        items: {
          create: items.map(item => ({
            foodId: item.foodId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
          })),
        },
      },
      include: {
        items: { include: { food: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    })

    res.status(201).json({ success: true, message: 'Order placed successfully.', data: { order } })
  } catch (error) {
    console.error('Create order error:', error)
    res.status(500).json({ success: false, message: 'Failed to place order.' })
  }
})

// GET /api/orders/my-orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: { include: { food: { select: { id: true, name: true, imageUrl: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ success: true, data: { orders } })
  } catch (error) {
    console.error('Get my orders error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' })
  }
})

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        items: { include: { food: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    })
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' })
    }
    res.json({ success: true, data: { order } })
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch order.' })
  }
})

module.exports = router

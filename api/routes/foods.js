const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')

// GET /api/foods
router.get('/', async (req, res) => {
  try {
    const { category, search, sortBy, order = 'asc', foodType } = req.query

    const where = { isAvailable: true }

    if (category && category !== 'All') {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (foodType && foodType !== 'All') {
      where.foodType = foodType
    }

    let orderBy = { createdAt: 'desc' }
    if (sortBy === 'price') orderBy = { price: order }
    if (sortBy === 'rating') orderBy = { rating: order }
    if (sortBy === 'name') orderBy = { name: order }
    if (sortBy === 'preparationTime') orderBy = { preparationTime: order }

    const foods = await prisma.food.findMany({
      where,
      orderBy,
    })

    const categories = await prisma.food.findMany({
      where: { isAvailable: true },
      select: { category: true },
      distinct: ['category'],
    })

    res.json({
      success: true,
      data: {
        foods,
        total: foods.length,
        categories: categories.map(c => c.category),
      },
    })
  } catch (error) {
    console.error('Get foods error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch foods.' })
  }
})

// GET /api/foods/:id
router.get('/:id', async (req, res) => {
  try {
    const food = await prisma.food.findUnique({ where: { id: req.params.id } })
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found.' })
    }
    res.json({ success: true, data: { food } })
  } catch (error) {
    console.error('Get food error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch food item.' })
  }
})

module.exports = router

// api/index.js - Vercel Serverless Function Entry Point
require('dotenv').config()
const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const foodRoutes = require('./routes/foods')
const orderRoutes = require('./routes/orders')
const userRoutes = require('./routes/users')
const adminRoutes = require('./routes/admin')
const uploadRoutes = require('./routes/upload')

const app = express()

// CORS configuration for Vercel
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [/\.vercel\.app$/, /localhost/]
    : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FoodKart API is running', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/foods', foodRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/admin', uploadRoutes)

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  })
})

module.exports = app

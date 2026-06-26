const express = require('express')
const router = express.Router()
const { put } = require('@vercel/blob')
const { protect, adminOnly } = require('../middleware/auth')

// POST /api/admin/upload
router.post('/upload', protect, adminOnly, async (req, res) => {
  try {
    // For Vercel Blob - expects base64 or multipart
    // In production, send base64 image data
    const { imageData, fileName, contentType } = req.body

    if (!imageData || !fileName) {
      return res.status(400).json({ success: false, message: 'Image data and filename are required.' })
    }

    // Convert base64 to buffer
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    const blob = await put(`foods/${Date.now()}-${fileName}`, buffer, {
      access: 'public',
      contentType: contentType || 'image/jpeg',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    res.json({ success: true, data: { url: blob.url } })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ success: false, message: 'Image upload failed. You can use an image URL instead.' })
  }
})

module.exports = router

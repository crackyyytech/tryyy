// Local development server
require('dotenv').config()
const app = require('./index')

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 FoodKart API running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
})

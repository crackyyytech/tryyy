// Run this script to initialize the database on Vercel
// Usage: node prisma/migrate.js
const { execSync } = require('child_process')

try {
  console.log('Running Prisma migrations...')
  execSync('npx prisma migrate deploy', { stdio: 'inherit' })
  console.log('✅ Migrations completed')
  
  console.log('Running seed...')
  execSync('node prisma/seed.js', { stdio: 'inherit' })
  console.log('✅ Seed completed')
} catch (err) {
  console.error('Migration/seed failed:', err.message)
  process.exit(1)
}

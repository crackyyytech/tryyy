import { Link } from 'react-router-dom'

const categoryConfig = {
  'Pizza': { emoji: '🍕', bg: 'from-orange-100 to-orange-200', text: 'text-orange-700' },
  'Burger': { emoji: '🍔', bg: 'from-yellow-100 to-yellow-200', text: 'text-yellow-700' },
  'Biryani': { emoji: '🍛', bg: 'from-amber-100 to-amber-200', text: 'text-amber-700' },
  'Chinese': { emoji: '🍜', bg: 'from-red-100 to-red-200', text: 'text-red-700' },
  'South Indian': { emoji: '🥞', bg: 'from-green-100 to-green-200', text: 'text-green-700' },
  'Desserts': { emoji: '🍰', bg: 'from-pink-100 to-pink-200', text: 'text-pink-700' },
  'Beverages': { emoji: '🥤', bg: 'from-blue-100 to-blue-200', text: 'text-blue-700' },
}

export default function CategoryCard({ category, count }) {
  const config = categoryConfig[category] || { emoji: '🍽️', bg: 'from-gray-100 to-gray-200', text: 'text-gray-700' }

  return (
    <Link
      to={`/foods?category=${encodeURIComponent(category)}`}
      className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br ${config.bg} hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer group min-w-[100px]`}
    >
      <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{config.emoji}</span>
      <span className={`text-sm font-semibold ${config.text} text-center`}>{category}</span>
      {count !== undefined && (
        <span className={`text-xs ${config.text} opacity-70 mt-0.5`}>{count} items</span>
      )}
    </Link>
  )
}

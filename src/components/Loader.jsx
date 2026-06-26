import { ChefHat } from 'lucide-react'

export default function Loader({ fullScreen = false, size = 'md', text }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const content = (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizes[size]} border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin`}
        style={{ borderWidth: '3px' }} />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-red-500 rounded-2xl flex items-center justify-center shadow-food animate-pulse-slow">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin" style={{ borderWidth: '3px' }} />
          <p className="text-gray-500 font-medium">Loading FoodKart...</p>
        </div>
      </div>
    )
  }

  return content
}

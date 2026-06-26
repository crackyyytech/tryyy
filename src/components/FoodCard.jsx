import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Clock, Plus, Minus, Leaf, Flame } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function FoodCard({ food }) {
  const { cartItems, addToCart, updateQuantity } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)

  const cartItem = cartItems.find(item => item.id === food.id)
  const quantity = cartItem?.quantity || 0

  const handleAdd = (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    addToCart(food)
  }

  const handleIncrease = (e) => {
    e.preventDefault()
    updateQuantity(food.id, quantity + 1)
  }

  const handleDecrease = (e) => {
    e.preventDefault()
    updateQuantity(food.id, quantity - 1)
  }

  return (
    <Link to={`/foods/${food.id}`} className="card hover:shadow-hover transition-all duration-300 group flex flex-col overflow-hidden">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
        <img
          src={imgError ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80' : food.imageUrl}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        {/* Food type badge */}
        <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
          food.foodType === 'VEG' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {food.foodType === 'VEG' ? <Leaf className="w-3 h-3" /> : <Flame className="w-3 h-3" />}
          {food.foodType === 'VEG' ? 'Veg' : 'Non-Veg'}
        </div>
        {/* Category badge */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-medium text-gray-700">
          {food.category}
        </div>
        {!food.isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-semibold px-3 py-1 rounded-full text-sm">Currently Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
          {food.name}
        </h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">{food.description}</p>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-gray-700">{food.rating.toFixed(1)}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{food.preparationTime} min</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-gray-900">₹{food.price}</span>
          {food.isAvailable && (
            quantity === 0 ? (
              <button
                onClick={handleAdd}
                className="flex items-center gap-1 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-primary-50 rounded-lg p-0.5">
                <button onClick={handleDecrease} className="w-7 h-7 bg-white rounded-md flex items-center justify-center text-primary-600 hover:bg-primary-100 transition-colors shadow-sm">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-bold text-primary-600 w-5 text-center">{quantity}</span>
                <button onClick={handleIncrease} className="w-7 h-7 bg-primary-500 rounded-md flex items-center justify-center text-white hover:bg-primary-600 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </Link>
  )
}

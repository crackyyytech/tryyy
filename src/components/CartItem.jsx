import { useState } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()
  const [imgError, setImgError] = useState(false)

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
      <img
        src={imgError ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&q=80' : item.imageUrl}
        alt={item.name}
        className="w-16 h-16 rounded-xl object-cover shrink-0 bg-gray-100"
        onError={() => setImgError(true)}
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{item.name}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>
        <p className="text-sm font-bold text-primary-600 mt-1">₹{(item.price * item.quantity).toFixed(0)}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-sm font-bold w-5 text-center text-gray-900">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center text-white hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        <button
          onClick={() => removeFromCart(item.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

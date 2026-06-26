import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Clock, Leaf, Flame, Minus, Plus, ChevronLeft, ShoppingCart } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function FoodDetailPage() {
  const { id } = useParams()
  const [food, setFood] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgError, setImgError] = useState(false)
  const { cartItems, addToCart, updateQuantity } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const cartItem = cartItems.find(item => item.id === id)
  const quantity = cartItem?.quantity || 0

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await api.get(`/foods/${id}`)
        setFood(res.data.data.food)
      } catch {
        navigate('/foods')
      } finally {
        setLoading(false)
      }
    }
    fetchFood()
  }, [id, navigate])

  if (loading) return <Loader fullScreen />
  if (!food) return null

  const handleAdd = () => {
    if (!user) { navigate('/login'); return }
    addToCart(food)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container-custom py-8">
        <Link to="/foods" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-500 mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Menu
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-square max-w-md mx-auto w-full bg-gray-100 shadow-card">
            <img
              src={imgError ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80' : food.imageUrl}
              alt={food.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
            <div className={`absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${food.foodType === 'VEG' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {food.foodType === 'VEG' ? <Leaf className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
              {food.foodType === 'VEG' ? 'Vegetarian' : 'Non-Vegetarian'}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-primary-500 bg-primary-50 px-2.5 py-0.5 rounded-full">{food.category}</span>
                {!food.isAvailable && (
                  <span className="text-sm font-medium text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">Unavailable</span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900">{food.name}</h1>
            </div>

            <p className="text-gray-600 leading-relaxed">{food.description}</p>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(food.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="font-bold text-gray-900">{food.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                <Clock className="w-4 h-4" />
                <span>{food.preparationTime} mins prep time</span>
              </div>
            </div>

            <div className="flex items-end gap-2">
              <span className="text-4xl font-extrabold text-gray-900">₹{food.price}</span>
              <span className="text-gray-400 text-sm mb-1">per serving</span>
            </div>

            {food.isAvailable ? (
              <div className="space-y-3">
                {quantity === 0 ? (
                  <button onClick={handleAdd} className="flex items-center gap-2 btn-primary w-full justify-center py-3.5 text-base">
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                  </button>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-primary-50 rounded-xl p-2">
                      <button onClick={() => updateQuantity(food.id, quantity - 1)} className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary-600 hover:bg-primary-100 shadow-sm">
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="text-xl font-bold text-primary-600 w-8 text-center">{quantity}</span>
                      <button onClick={() => updateQuantity(food.id, quantity + 1)} className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white hover:bg-primary-600">
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <Link to="/cart" className="flex-1 btn-secondary flex items-center gap-2 justify-center py-3.5">
                      <ShoppingCart className="w-5 h-5" /> View Cart
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-xl py-3 px-4 text-gray-500 text-center font-medium">
                Currently Unavailable
              </div>
            )}

            {/* Info Cards */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { label: 'Category', value: food.category },
                { label: 'Type', value: food.foodType === 'VEG' ? 'Vegetarian' : 'Non-Veg' },
                { label: 'Prep Time', value: `${food.preparationTime} mins` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="font-semibold text-gray-900 text-sm mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

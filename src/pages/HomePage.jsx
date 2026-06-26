import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Clock, Shield, Truck, ChefHat, Zap } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FoodCard from '../components/FoodCard'
import CategoryCard from '../components/CategoryCard'
import Loader from '../components/Loader'
import api from '../services/api'

const HERO_FEATURES = [
  { icon: Truck, label: 'Free Delivery', desc: 'On orders above ₹500' },
  { icon: Clock, label: '30 Min Delivery', desc: 'Fast & reliable' },
  { icon: Shield, label: 'Safe & Hygienic', desc: 'Quality guaranteed' },
  { icon: Zap, label: '20+ Categories', desc: 'Wide variety' },
]

export default function HomePage() {
  const [popularFoods, setPopularFoods] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/foods?sortBy=rating&order=desc')
        const foods = res.data.data.foods
        setPopularFoods(foods.slice(0, 8))
        setCategories(res.data.data.categories)
      } catch (error) {
        console.error('Failed to fetch foods:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-orange-500 to-red-500">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48" />
        </div>
        <div className="container-custom py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                🎉 Now delivering in your city!
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                Delicious Food,<br />
                <span className="text-yellow-300">Delivered Fast</span>
              </h1>
              <p className="text-lg text-white/90 max-w-md">
                Order from 200+ restaurants. Fresh ingredients, amazing taste, lightning-fast delivery right to your door.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/foods" className="bg-white text-primary-600 font-bold px-6 py-3 rounded-2xl hover:bg-yellow-50 transition-colors shadow-lg flex items-center gap-2">
                  Order Now <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/register" className="bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-2xl hover:bg-white/30 transition-colors border border-white/30">
                  Sign Up Free
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-white/80">
                <div className="flex -space-x-2">
                  {['🧑', '👩', '👨', '🧕'].map((e, i) => (
                    <div key={i} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-base border-2 border-white/40">{e}</div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                    <span className="font-semibold text-white">4.9</span>
                  </div>
                  <p>10,000+ happy customers</p>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hidden md:flex justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse-slow" />
                <div className="absolute inset-4 bg-white/10 rounded-full animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-2 animate-float">🍕</div>
                    <div className="flex justify-center gap-2 text-5xl">
                      <span className="animate-float" style={{ animationDelay: '0.3s' }}>🍔</span>
                      <span className="animate-float" style={{ animationDelay: '0.6s' }}>🍜</span>
                      <span className="animate-float" style={{ animationDelay: '0.9s' }}>🍰</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features bar */}
        <div className="bg-white/10 backdrop-blur-sm border-t border-white/20">
          <div className="container-custom py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {HERO_FEATURES.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-center gap-3 text-white">
                  <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{label}</p>
                    <p className="text-xs text-white/70">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-custom py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Browse Categories</h2>
          <Link to="/foods" className="text-sm font-medium text-primary-500 hover:text-primary-600 flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-8"><Loader /></div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {['Pizza', 'Burger', 'Biryani', 'Chinese', 'South Indian', 'Desserts', 'Beverages'].map(cat => (
              <CategoryCard key={cat} category={cat} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Foods */}
      <section className="container-custom py-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">🔥 Popular Right Now</h2>
            <p className="text-gray-500 text-sm mt-1">Top-rated dishes loved by thousands</p>
          </div>
          <Link to="/foods" className="text-sm font-medium text-primary-500 hover:text-primary-600 flex items-center gap-1">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="shimmer aspect-[4/3]" />
                <div className="p-4 space-y-2">
                  <div className="shimmer h-4 rounded w-3/4" />
                  <div className="shimmer h-3 rounded w-full" />
                  <div className="shimmer h-3 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularFoods.map(food => <FoodCard key={food.id} food={food} />)}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-16">
        <div className="container-custom text-center space-y-4">
          <div className="text-5xl mb-4">👨‍🍳</div>
          <h2 className="text-3xl font-extrabold text-white">Hungry? We've Got You Covered</h2>
          <p className="text-gray-300 max-w-md mx-auto">Join thousands of food lovers. Sign up now and get your first order delivered for free!</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-2xl transition-colors shadow-lg text-sm">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu, X, User, LogOut, ChefHat, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-red-500 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">FoodKart</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-primary-500' : 'text-gray-600 hover:text-primary-500'}`}>Home</Link>
            <Link to="/foods" className={`text-sm font-medium transition-colors ${isActive('/foods') ? 'text-primary-500' : 'text-gray-600 hover:text-primary-500'}`}>Menu</Link>
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-500 transition-colors">
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-fade-in">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>

                <div className="relative group">
                  <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-hover border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-1">
                      <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <Link to="/my-orders" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                        <ShoppingCart className="w-4 h-4" /> My Orders
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link to="/admin/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-lg font-medium">
                          <LayoutDashboard className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <hr className="my-1 border-gray-100" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Right */}
          <div className="flex md:hidden items-center gap-3">
            {user && (
              <Link to="/cart" className="relative p-2 text-gray-600">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600 hover:text-primary-500">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-slide-up">
          <div className="container-custom py-4 space-y-1">
            <Link to="/" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-primary-500 rounded-xl">Home</Link>
            <Link to="/foods" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-primary-500 rounded-xl">Menu</Link>
            {user ? (
              <>
                <Link to="/profile" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-primary-500 rounded-xl">Profile</Link>
                <Link to="/my-orders" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-primary-500 rounded-xl">My Orders</Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin/dashboard" className="block px-4 py-2.5 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-xl">Admin Panel</Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl">Logout</button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="flex-1 btn-secondary text-center text-sm py-2">Login</Link>
                <Link to="/register" className="flex-1 btn-primary text-center text-sm py-2">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

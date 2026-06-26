import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, UtensilsCrossed, ShoppingBag, Users, ChefHat, LogOut, Plus, X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/foods', icon: UtensilsCrossed, label: 'Foods' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/users', icon: Users, label: 'Users' },
]

export default function AdminSidebar({ mobileOpen, onMobileClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const isActive = (path) => location.pathname === path

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-red-500 rounded-xl flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-gray-900 text-sm">FoodKart</span>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
        <button onClick={onMobileClose} className="lg:hidden p-1 text-gray-400 hover:text-gray-600 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Add */}
      <div className="p-4">
        <Link
          to="/admin/add-food"
          onClick={onMobileClose}
          className="flex items-center gap-2 w-full btn-primary text-sm py-2.5 justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Food Item
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            onClick={onMobileClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              isActive(to)
                ? 'bg-primary-500 text-white shadow-food'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-gray-100">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl mb-1 transition-colors"
        >
          <ChefHat className="w-4 h-4" />
          View Store
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
          <aside className="relative w-64 bg-white min-h-screen h-full shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}

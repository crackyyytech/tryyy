import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UtensilsCrossed, ShoppingBag, Users, DollarSign, TrendingUp, Clock } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import OrderStatusBadge from '../../components/OrderStatusBadge'
import Loader from '../../components/Loader'
import api from '../../services/api'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard-stats')
      .then(res => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const stats = data?.stats || {}
  const recentOrders = data?.recentOrders || []

  const statCards = [
    { label: 'Total Foods', value: stats.totalFoods || 0, icon: UtensilsCrossed, color: 'from-orange-400 to-orange-600', link: '/admin/foods' },
    { label: 'Total Orders', value: stats.totalOrders || 0, icon: ShoppingBag, color: 'from-blue-400 to-blue-600', link: '/admin/orders' },
    { label: 'Total Users', value: stats.totalUsers || 0, icon: Users, color: 'from-purple-400 to-purple-600', link: '/admin/users' },
    { label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toFixed(0)}`, icon: DollarSign, color: 'from-green-400 to-green-600', link: '/admin/orders' },
  ]

  if (loading) return <AdminLayout title="Dashboard"><div className="flex justify-center py-20"><Loader size="lg" /></div></AdminLayout>

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-primary-500 to-red-500 rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-extrabold">Welcome to Admin Panel 👋</h2>
          <p className="text-white/80 mt-1">Here's what's happening with FoodKart today</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map(({ label, value, icon: Icon, color, link }) => (
            <Link key={label} to={link} className="card p-5 hover:shadow-hover transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{label}</p>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Recent Orders</h3>
            <Link to="/admin/orders" className="text-sm text-primary-500 hover:text-primary-600 font-medium">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500 text-sm">No orders yet</td></tr>
                ) : recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-mono font-bold text-gray-900">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{order.user?.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{order.items?.length} item(s)</td>
                    <td className="px-5 py-3 text-sm font-bold text-gray-900">₹{order.totalAmount.toFixed(0)}</td>
                    <td className="px-5 py-3"><OrderStatusBadge status={order.orderStatus} /></td>
                    <td className="px-5 py-3 text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { to: '/admin/add-food', label: '➕ Add New Food', desc: 'Add food items to menu', color: 'bg-orange-50 border-orange-200 hover:bg-orange-100' },
            { to: '/admin/orders', label: '📦 Manage Orders', desc: 'Update order statuses', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
            { to: '/admin/users', label: '👥 View Users', desc: 'See registered customers', color: 'bg-purple-50 border-purple-200 hover:bg-purple-100' },
          ].map(({ to, label, desc, color }) => (
            <Link key={to} to={to} className={`p-4 rounded-xl border transition-colors ${color}`}>
              <p className="font-semibold text-gray-900">{label}</p>
              <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

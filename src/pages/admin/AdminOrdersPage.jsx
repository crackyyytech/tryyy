import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import OrderStatusBadge from '../../components/OrderStatusBadge'
import Loader from '../../components/Loader'
import api from '../../services/api'
import toast from 'react-hot-toast'

const STATUSES = ['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = statusFilter !== 'ALL' ? { status: statusFilter } : {}
      const res = await api.get('/admin/orders', { params })
      setOrders(res.data.data.orders)
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    try {
      const res = await api.put(`/admin/orders/${orderId}/status`, { orderStatus: newStatus })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o))
      toast.success('Order status updated')
    } catch {
      toast.error('Update failed')
    } finally {
      setUpdatingId(null)
    }
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

  return (
    <AdminLayout title="Orders Management">
      <div className="space-y-5">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${statusFilter === s ? 'bg-primary-500 text-white shadow-food' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}
            >
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-16"><Loader size="lg" /></div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Update'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-12 text-gray-500">No orders found</td></tr>
                  ) : orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-gray-900 text-sm">#{order.id.slice(-6).toUpperCase()}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{order.user?.name}</p>
                        <p className="text-xs text-gray-400">{order.user?.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.items?.length} item(s)</td>
                      <td className="px-4 py-3 font-bold text-gray-900 text-sm">₹{order.totalAmount.toFixed(0)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3"><OrderStatusBadge status={order.orderStatus} /></td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <select
                            value={order.orderStatus}
                            onChange={e => handleStatusUpdate(order.id, e.target.value)}
                            disabled={updatingId === order.id || order.orderStatus === 'DELIVERED' || order.orderStatus === 'CANCELLED'}
                            className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 pr-7 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            {STATUSES.filter(s => s !== 'ALL').map(s => (
                              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {!loading && (
            <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
              {orders.length} order(s) shown
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

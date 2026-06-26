import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Clock } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import OrderStatusBadge from '../components/OrderStatusBadge'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import api from '../services/api'

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/my-orders')
      .then(res => setOrders(res.data.data.orders))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container-custom py-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

        {loading ? (
          <div className="flex justify-center py-16"><Loader size="lg" /></div>
        ) : orders.length === 0 ? (
          <EmptyState emoji="📦" title="No orders yet" description="You haven't placed any orders. Browse our menu and order something delicious!" actionLabel="Browse Menu" actionTo="/foods" />
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Link key={order.id} to={`/my-orders/${order.id}`} className="card p-5 block hover:shadow-hover transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-mono font-bold text-gray-900 text-sm">#{order.id.slice(-8).toUpperCase()}</p>
                      <OrderStatusBadge status={order.orderStatus} />
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                      <Clock className="w-3 h-3" /> {formatDate(order.createdAt)}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {order.items.slice(0, 3).map(item => (
                        <span key={item.id} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                          {item.name} ×{item.quantity}
                        </span>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">+{order.items.length - 3} more</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-bold text-primary-600">₹{order.totalAmount.toFixed(2)}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 capitalize">{order.paymentMethod.replace(/_/g, ' ').toLowerCase()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {order.items[0]?.food?.imageUrl && (
                      <img src={order.items[0].food.imageUrl} alt="" className="w-14 h-14 rounded-xl object-cover bg-gray-100" onError={e => e.target.style.display = 'none'} />
                    )}
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

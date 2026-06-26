import { useLocation, Link } from 'react-router-dom'
import { CheckCircle, ShoppingBag, Home, Clock } from 'lucide-react'
import Navbar from '../components/Navbar'
import OrderStatusBadge from '../components/OrderStatusBadge'

export default function OrderSuccessPage() {
  const { state } = useLocation()
  const order = state?.order

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container-custom py-16">
        <div className="max-w-lg mx-auto text-center space-y-6">
          {/* Success Icon */}
          <div className="relative inline-flex">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce-slow">
              <CheckCircle className="w-14 h-14 text-green-500" />
            </div>
            <div className="absolute -top-2 -right-2 text-3xl animate-float">🎉</div>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Order Placed!</h1>
            <p className="text-gray-500 mt-2">Your delicious food is being prepared. Hang tight!</p>
          </div>

          {/* Order Card */}
          {order && (
            <div className="card p-6 text-left space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="font-mono font-bold text-gray-900 text-sm">#{order.id.slice(-8).toUpperCase()}</p>
                </div>
                <OrderStatusBadge status={order.orderStatus} size="lg" />
              </div>

              <hr className="border-gray-100" />

              <div className="space-y-2">
                {order.items?.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} × {item.quantity}</span>
                    <span className="font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              <hr className="border-gray-100" />

              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Total Paid</span>
                <span className="font-bold text-lg text-primary-600">₹{order.totalAmount?.toFixed(2)}</span>
              </div>

              <div className="bg-orange-50 rounded-xl p-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                <p className="text-xs text-orange-700">Estimated delivery: <strong>30-45 minutes</strong></p>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
                <p className="font-medium">📍 Delivery to:</p>
                <p className="text-gray-500 mt-0.5">{order.deliveryAddress}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Link to="/my-orders" className="flex-1 btn-secondary flex items-center justify-center gap-2 py-3">
              <ShoppingBag className="w-5 h-5" /> My Orders
            </Link>
            <Link to="/" className="flex-1 btn-primary flex items-center justify-center gap-2 py-3">
              <Home className="w-5 h-5" /> Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

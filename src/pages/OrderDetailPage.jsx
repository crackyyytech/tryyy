import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, MapPin, Phone, CreditCard, Clock } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import OrderStatusBadge from '../components/OrderStatusBadge'
import Loader from '../components/Loader'
import api from '../services/api'

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(res => setOrder(res.data.data.order))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader fullScreen />
  if (!order) return <div className="text-center py-16 text-gray-500">Order not found</div>

  const currentStep = order.orderStatus === 'CANCELLED' ? -1 : STATUS_STEPS.indexOf(order.orderStatus)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container-custom py-8 max-w-2xl">
        <Link to="/my-orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-500 mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> My Orders
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-bold text-gray-900 text-xl">Order Details</h1>
            <p className="text-gray-500 font-mono text-sm">#{order.id.slice(-8).toUpperCase()}</p>
          </div>
          <OrderStatusBadge status={order.orderStatus} size="lg" />
        </div>

        {/* Progress Tracker */}
        {order.orderStatus !== 'CANCELLED' && (
          <div className="card p-5 mb-5">
            <h3 className="font-semibold text-gray-900 mb-4">Order Progress</h3>
            <div className="flex items-center">
              {STATUS_STEPS.map((step, index) => (
                <div key={step} className="flex items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    index <= currentStep ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {index < currentStep ? '✓' : index + 1}
                  </div>
                  {index < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-1 mx-1 rounded transition-colors ${index < currentStep ? 'bg-primary-500' : 'bg-gray-100'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {STATUS_STEPS.map((step, i) => (
                <span key={step} className={`text-[10px] font-medium ${i <= currentStep ? 'text-primary-600' : 'text-gray-400'}`} style={{ width: '20%', textAlign: i === 0 ? 'left' : i === STATUS_STEPS.length - 1 ? 'right' : 'center' }}>
                  {step.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="card p-5 mb-5">
          <h3 className="font-semibold text-gray-900 mb-4">Items Ordered</h3>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center gap-3">
                {item.food?.imageUrl && (
                  <img src={item.food.imageUrl} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-gray-100" onError={e => e.target.style.display = 'none'} />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">₹{item.price} × {item.quantity}</p>
                </div>
                <span className="font-bold text-gray-900 text-sm">₹{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <hr className="my-4 border-gray-100" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Delivery Fee</span><span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee.toFixed(2)}`}</span></div>
            <div className="flex justify-between text-gray-600"><span>Tax</span><span>₹{order.tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100 mt-1">
              <span>Total</span>
              <span className="text-primary-600">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery & Payment */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-500" /> Delivery Info
            </h3>
            <p className="text-sm text-gray-600 mb-2">{order.deliveryAddress}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{order.phone}</span>
            </div>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary-500" /> Payment
            </h3>
            <p className="text-sm text-gray-600 capitalize mb-2">{order.paymentMethod.replace(/_/g, ' ').toLowerCase()}</p>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {order.paymentStatus}
            </span>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" /> Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

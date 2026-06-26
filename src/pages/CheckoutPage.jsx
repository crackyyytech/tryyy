import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Banknote, MapPin, Phone, ChevronRight, Lock } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PriceSummary from '../components/PriceSummary'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import EmptyState from '../components/EmptyState'

export default function CheckoutPage() {
  const { cartItems, subtotal, deliveryFee, tax, totalAmount, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY')
  const [showDummyPayment, setShowDummyPayment] = useState(false)

  const [form, setForm] = useState({
    deliveryAddress: user?.address || '',
    phone: user?.phone || '',
  })

  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.deliveryAddress.trim() || !form.phone.trim()) {
      toast.error('Please fill in delivery address and phone number')
      return
    }
    if (paymentMethod === 'ONLINE') {
      setShowDummyPayment(true)
      return
    }
    await placeOrder()
  }

  const placeOrder = async () => {
    setLoading(true)
    try {
      const orderData = {
        items: cartItems.map(item => ({
          foodId: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        })),
        deliveryAddress: form.deliveryAddress,
        phone: form.phone,
        paymentMethod,
        subtotal,
        deliveryFee,
        tax,
        totalAmount,
      }
      const res = await api.post('/orders', orderData)
      clearCart()
      toast.success('Order placed successfully! 🎉')
      navigate('/order-success', { state: { order: res.data.data.order } })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  const handleDummyPayment = async () => {
    if (!cardForm.cardNumber || !cardForm.cardName || !cardForm.expiry || !cardForm.cvv) {
      toast.error('Please fill all card details')
      return
    }
    toast.success('Payment processed (demo)!')
    setShowDummyPayment(false)
    await placeOrder()
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container-custom py-16">
          <EmptyState emoji="🛒" title="Cart is empty" description="Add items to cart before checkout." actionLabel="Browse Menu" actionTo="/foods" />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container-custom py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Delivery Info */}
            <div className="card p-5 space-y-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-500" /> Delivery Details
              </h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Delivery Address *</label>
                <textarea
                  value={form.deliveryAddress}
                  onChange={e => setForm(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="House/Flat No., Street, Area, City, Pincode"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  <Phone className="inline w-4 h-4 mr-1" />Phone Number *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="input-field"
                  placeholder="10-digit mobile number"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-5 space-y-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-500" /> Payment Method
              </h2>
              <div className="space-y-3">
                {/* COD */}
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'CASH_ON_DELIVERY' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="CASH_ON_DELIVERY" checked={paymentMethod === 'CASH_ON_DELIVERY'} onChange={e => setPaymentMethod(e.target.value)} className="sr-only" />
                  <Banknote className={`w-6 h-6 ${paymentMethod === 'CASH_ON_DELIVERY' ? 'text-primary-500' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay when your order arrives</p>
                  </div>
                  {paymentMethod === 'CASH_ON_DELIVERY' && <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full" /></div>}
                </label>

                {/* Online */}
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'ONLINE' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="ONLINE" checked={paymentMethod === 'ONLINE'} onChange={e => setPaymentMethod(e.target.value)} className="sr-only" />
                  <CreditCard className={`w-6 h-6 ${paymentMethod === 'ONLINE' ? 'text-primary-500' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">Pay Online</p>
                    <p className="text-xs text-gray-500">Credit/Debit card (Demo)</p>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Demo</span>
                  {paymentMethod === 'ONLINE' && <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full" /></div>}
                </label>
              </div>
            </div>

            {/* Order Items Summary */}
            <div className="card p-5">
              <h2 className="font-bold text-gray-900 mb-4">Order Items ({cartItems.length})</h2>
              <div className="space-y-3">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&q=80' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary & Place Order */}
          <div>
            <PriceSummary subtotal={subtotal} deliveryFee={deliveryFee} tax={tax} totalAmount={totalAmount}>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary w-full py-3 mt-2 text-base flex items-center justify-center gap-2"
              >
                {loading ? 'Placing Order...' : (
                  <>
                    <Lock className="w-4 h-4" />
                    {paymentMethod === 'ONLINE' ? 'Pay & Place Order' : 'Place Order'}
                  </>
                )}
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">🔒 Secure & safe ordering</p>
            </PriceSummary>
          </div>
        </div>
      </div>
      <Footer />

      {/* Dummy Payment Modal */}
      {showDummyPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slide-up">
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Secure Payment (Demo)</h3>
              <p className="text-sm text-gray-500 mt-1">This is a demo payment — no real charges</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Card Number</label>
                <input className="input-field text-sm" placeholder="4242 4242 4242 4242" maxLength={19}
                  value={cardForm.cardNumber} onChange={e => setCardForm(p => ({ ...p, cardNumber: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim() }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Cardholder Name</label>
                <input className="input-field text-sm" placeholder="John Doe"
                  value={cardForm.cardName} onChange={e => setCardForm(p => ({ ...p, cardName: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Expiry</label>
                  <input className="input-field text-sm" placeholder="MM/YY" maxLength={5}
                    value={cardForm.expiry} onChange={e => setCardForm(p => ({ ...p, expiry: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">CVV</label>
                  <input className="input-field text-sm" placeholder="123" maxLength={4} type="password"
                    value={cardForm.cvv} onChange={e => setCardForm(p => ({ ...p, cvv: e.target.value }))} />
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700">
                ⚠️ Demo mode: Enter any values. No real payment is processed.
              </div>
              <button onClick={handleDummyPayment} disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                {loading ? 'Processing...' : `Pay ₹${totalAmount.toFixed(2)}`}
              </button>
              <button onClick={() => setShowDummyPayment(false)} className="btn-secondary w-full py-2.5 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

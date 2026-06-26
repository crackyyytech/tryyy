import { Link } from 'react-router-dom'
import { ShoppingCart, ArrowRight, Trash2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CartItem from '../components/CartItem'
import PriceSummary from '../components/PriceSummary'
import EmptyState from '../components/EmptyState'
import { useCart } from '../context/CartContext'
import ConfirmModal from '../components/ConfirmModal'
import { useState } from 'react'

export default function CartPage() {
  const { cartItems, cartCount, subtotal, deliveryFee, tax, totalAmount, clearCart } = useCart()
  const [showClearModal, setShowClearModal] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
            <p className="text-gray-500 text-sm">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
          </div>
          {cartItems.length > 0 && (
            <button onClick={() => setShowClearModal(true)} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors">
              <Trash2 className="w-4 h-4" /> Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <EmptyState
            emoji="🛒"
            title="Your cart is empty"
            description="Looks like you haven't added anything to your cart yet. Browse our menu and add items you love!"
            actionLabel="Browse Menu"
            actionTo="/foods"
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              {cartItems.map(item => <CartItem key={item.id} item={item} />)}
              <Link to="/foods" className="flex items-center gap-2 text-sm text-primary-500 hover:text-primary-600 font-medium mt-2">
                + Add more items
              </Link>
            </div>

            {/* Price Summary */}
            <div>
              <PriceSummary subtotal={subtotal} deliveryFee={deliveryFee} tax={tax} totalAmount={totalAmount}>
                <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2">
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </Link>
              </PriceSummary>

              {/* Savings Note */}
              {deliveryFee > 0 && (
                <div className="mt-3 card p-3 bg-orange-50 border-orange-100">
                  <p className="text-xs text-orange-700 font-medium">
                    💡 Add ₹{(500 - subtotal).toFixed(0)} more to get FREE delivery!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />

      <ConfirmModal
        isOpen={showClearModal}
        title="Clear Cart?"
        message="This will remove all items from your cart. This action cannot be undone."
        confirmLabel="Clear Cart"
        danger
        onConfirm={() => { clearCart(); setShowClearModal(false) }}
        onCancel={() => setShowClearModal(false)}
      />
    </div>
  )
}

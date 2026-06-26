import { Tag, Truck, Receipt } from 'lucide-react'

export default function PriceSummary({ subtotal, deliveryFee, tax, totalAmount, children }) {
  return (
    <div className="card p-5 space-y-4">
      <h3 className="font-bold text-gray-900 text-lg">Price Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Tag className="w-4 h-4" />
            <span>Subtotal</span>
          </div>
          <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Truck className="w-4 h-4" />
            <span>Delivery Fee</span>
          </div>
          <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
          </span>
        </div>
        {deliveryFee === 0 && subtotal > 0 && (
          <p className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
            🎉 Free delivery on orders above ₹500!
          </p>
        )}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Receipt className="w-4 h-4" />
            <span>Tax (5%)</span>
          </div>
          <span className="font-medium text-gray-900">₹{tax.toFixed(2)}</span>
        </div>
        <hr className="border-gray-100" />
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900">Total Amount</span>
          <span className="font-bold text-lg text-primary-600">₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>
      {children}
    </div>
  )
}

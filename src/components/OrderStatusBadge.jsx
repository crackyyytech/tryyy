const statusConfig = {
  PENDING: { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  CONFIRMED: { label: 'Confirmed', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  PREPARING: { label: 'Preparing', bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  DELIVERED: { label: 'Delivered', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
}

export default function OrderStatusBadge({ status, size = 'sm' }) {
  const config = statusConfig[status] || { label: status, bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' }
  const padding = size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'

  return (
    <span className={`inline-flex items-center gap-1.5 ${config.bg} ${config.text} ${padding} rounded-full font-semibold`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

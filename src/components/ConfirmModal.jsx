import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Confirm', danger = false }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${danger ? 'bg-red-100' : 'bg-yellow-100'}`}>
              <AlertTriangle className={`w-5 h-5 ${danger ? 'text-red-600' : 'text-yellow-600'}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
              <p className="text-gray-500 text-sm mt-1">{message}</p>
            </div>
            <button onClick={onCancel} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
            <button
              onClick={onConfirm}
              className={`flex-1 font-semibold px-6 py-2.5 rounded-xl transition-all ${danger ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-primary-500 hover:bg-primary-600 text-white'}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

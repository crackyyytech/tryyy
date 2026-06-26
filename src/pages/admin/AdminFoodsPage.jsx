import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Star, Search } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import ConfirmModal from '../../components/ConfirmModal'
import Loader from '../../components/Loader'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminFoodsPage() {
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchFoods()
  }, [])

  const fetchFoods = async () => {
    setLoading(true)
    try {
      const res = await api.get('/foods')
      setFoods(res.data.data.foods)
    } catch {
      toast.error('Failed to load foods')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/admin/foods/${deleteId}`)
      toast.success('Food item deleted')
      setFoods(prev => prev.filter(f => f.id !== deleteId))
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const filtered = foods.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout title="Foods Management">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10 text-sm py-2.5" placeholder="Search foods..." />
          </div>
          <Link to="/admin/add-food" className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Food
          </Link>
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
                    {['Item', 'Category', 'Price', 'Rating', 'Type', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-12 text-gray-500">No foods found</td></tr>
                  ) : filtered.map(food => (
                    <tr key={food.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img src={food.imageUrl} alt={food.name} className="w-10 h-10 rounded-xl object-cover bg-gray-100" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&q=80' }} />
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 text-sm line-clamp-1">{food.name}</p>
                            <p className="text-xs text-gray-400 line-clamp-1 max-w-[200px]">{food.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3"><span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium">{food.category}</span></td>
                      <td className="px-5 py-3 font-bold text-gray-900 text-sm">₹{food.price}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-gray-700">{food.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${food.foodType === 'VEG' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {food.foodType === 'VEG' ? '🌿 Veg' : '🍗 Non-Veg'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${food.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {food.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Link to={`/admin/edit-food/${food.id}`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button onClick={() => setDeleteId(food.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {!loading && (
            <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-500">
              Showing {filtered.length} of {foods.length} items
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Food Item?"
        message="This food item will be permanently deleted. This action cannot be undone."
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  )
}

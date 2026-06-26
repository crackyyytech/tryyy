import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import FoodForm from '../../components/FoodForm'
import Loader from '../../components/Loader'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminEditFoodPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [food, setFood] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    api.get(`/foods/${id}`)
      .then(res => setFood(res.data.data.food))
      .catch(() => { toast.error('Food not found'); navigate('/admin/foods') })
      .finally(() => setFetching(false))
  }, [id, navigate])

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await api.put(`/admin/foods/${id}`, data)
      toast.success('Food item updated!')
      navigate('/admin/foods')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update food')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <AdminLayout title="Edit Food"><div className="flex justify-center py-20"><Loader size="lg" /></div></AdminLayout>

  return (
    <AdminLayout title="Edit Food Item">
      <div className="max-w-2xl mx-auto">
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Edit: {food?.name}</h2>
          <FoodForm initialData={food} onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </AdminLayout>
  )
}

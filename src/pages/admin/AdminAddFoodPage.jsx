import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import FoodForm from '../../components/FoodForm'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminAddFoodPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post('/admin/foods', data)
      toast.success('Food item added successfully!')
      navigate('/admin/foods')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add food')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="Add Food Item">
      <div className="max-w-2xl mx-auto">
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Add New Food Item</h2>
          <FoodForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </AdminLayout>
  )
}

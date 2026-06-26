import { useState } from 'react'
import { User, Mail, Phone, MapPin, Save } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Name is required')
      return
    }
    setLoading(true)
    try {
      const res = await api.put('/users/profile', form)
      updateUser(res.data.data.user)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container-custom py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

        {/* Avatar Card */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-food">
              <span className="text-white text-2xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span className={`mt-1 inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full ${user?.role === 'ADMIN' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 mb-4">Edit Profile</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field pl-10" placeholder="Full Name" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email (read-only)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={user?.email} className="input-field pl-10 bg-gray-50 text-gray-500" disabled />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="input-field pl-10" placeholder="Your phone number" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Default Delivery Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} rows={3} className="input-field pl-10 resize-none" placeholder="Your default delivery address" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 py-3">
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

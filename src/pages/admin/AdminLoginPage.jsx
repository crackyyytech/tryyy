import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ChefHat, Mail, Lock, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: 'admin@foodkart.com', password: 'Admin@123' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      if (user.role !== 'ADMIN') {
        toast.error('Access denied. Admin only.')
        return
      }
      toast.success('Welcome, Admin!')
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-red-500 rounded-2xl flex items-center justify-center shadow-food mx-auto mb-4">
            <ChefHat className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">FoodKart Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to manage your restaurant</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2.5 rounded-xl text-sm">
            <Shield className="w-4 h-4 shrink-0" />
            <span>Admin access only. Unauthorized access is prohibited.</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input-field pl-10" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="input-field pl-10 pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

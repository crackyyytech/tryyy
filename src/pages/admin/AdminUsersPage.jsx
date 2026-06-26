import { useState, useEffect } from 'react'
import { Search, Users } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import Loader from '../../components/Loader'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/admin/users')
      .then(res => setUsers(res.data.data.users))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <AdminLayout title="Users Management">
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Users', value: users.length, icon: '👥' },
            { label: 'Active Users', value: users.filter(u => u._count?.orders > 0).length, icon: '✅' },
            { label: 'New This Month', value: users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length, icon: '🆕' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="card p-4 flex items-center gap-3">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-xl font-extrabold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10 text-sm py-2.5" placeholder="Search users..." />
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
                    {['User', 'Email', 'Phone', 'Orders', 'Address', 'Joined'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-500">No users found</td></tr>
                  ) : filtered.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-white text-sm font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600">{user.email}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{user.phone || '—'}</td>
                      <td className="px-5 py-3">
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{user._count?.orders || 0}</span>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500 max-w-[180px]">
                        <span className="line-clamp-1">{user.address || '—'}</span>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">{formatDate(user.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {!loading && (
            <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-500">
              Showing {filtered.length} of {users.length} users
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

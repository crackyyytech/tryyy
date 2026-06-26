import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <Loader fullScreen />
  if (!user) return <Navigate to="/admin/login" replace />
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />

  return children
}

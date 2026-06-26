import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('foodkart_token')
    const savedUser = localStorage.getItem('foodkart_user')
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
        verifyToken(token)
      } catch {
        logout()
      }
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async (token) => {
    try {
      const res = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUser(res.data.data.user)
      localStorage.setItem('foodkart_user', JSON.stringify(res.data.data.user))
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { user, token } = res.data.data
    localStorage.setItem('foodkart_token', token)
    localStorage.setItem('foodkart_user', JSON.stringify(user))
    setUser(user)
    return user
  }

  const register = async (data) => {
    const res = await api.post('/auth/register', data)
    const { user, token } = res.data.data
    localStorage.setItem('foodkart_token', token)
    localStorage.setItem('foodkart_user', JSON.stringify(user))
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('foodkart_token')
    localStorage.removeItem('foodkart_user')
    setUser(null)
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('foodkart_user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  )
}

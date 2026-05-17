import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const { data } = await api.get('/auth/me')
      setUser(data)
    } catch {
      // 401 interceptor handles cleanup
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (phone, password) => {
    const { data } = await api.post('/auth/login', { phone, password })
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    await loadUser()
    return data
  }

  const register = async (name, phone, email, password) => {
    const { data } = await api.post('/auth/register', { name, phone, email, password })
    return data
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
    window.dispatchEvent(new Event('auth:logout'))
  }

  // Şifremi unuttum — backend'de karşılığı varsa çağırır
  const forgotPassword = async (phone) => {
    try {
      await api.post('/auth/forgot-password', { phone })
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'İşlem başarısız.' }
    }
  }

  // Kullanıcı bilgilerini güncelle
  const updateProfile = async (payload) => {
    try {
      const { data } = await api.patch('/users/me', payload)
      setUser((prev) => ({ ...prev, ...data }))
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Güncellenemedi.' }
    }
  }

  useEffect(() => {
    loadUser()
    const handleLogout = () => {
      setUser(null)
    }
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [loadUser])

  const value = {
    user,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'ADMIN',
    loading,
    login,
    register,
    logout,
    loadUser,
    forgotPassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

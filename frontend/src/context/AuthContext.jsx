import { createContext, useContext, useState, useEffect } from 'react'
import { getToken, setToken, logout as clearToken } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (token) setUser({ token })
    setLoading(false)
  }, [])

  const login = (token, userData) => { setToken(token); setUser(userData) }
  const logout = () => { clearToken(); setUser(null) }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

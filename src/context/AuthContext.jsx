/**
 * Authentication Context
 *
 * KFZ-12: Protected Routes & Session Management
 *
 * Provides authentication state and methods to the entire app.
 */

import { createContext, useContext, useState, useEffect, useMemo } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (e) {
        // Invalid stored data, clear it
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  /**
   * Login user and store credentials
   */
  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  /**
   * Logout user and clear credentials
   */
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = useMemo(() => {
    return !!token && !!user
  }, [token, user])

  /**
   * Check if user is admin
   */
  const isAdmin = useMemo(() => {
    return user?.role === 'admin'
  }, [user])

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to access auth context
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext

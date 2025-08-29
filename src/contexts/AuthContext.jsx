import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api.js'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Initialize axios with base URL and interceptors
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Try to validate token by fetching user profile
      fetchUserProfile()
    } else {
      setLoading(false)
    }

    // Response interceptor to handle 401 errors
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout()
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.response.eject(responseInterceptor)
    }
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.USER_PROFILE)
      setUser(response.data.data)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH_LOGIN, { email, password })
      const { token, user: userData } = response.data.data
      
      if (rememberMe) {
        localStorage.setItem('token', token)
      } else {
        sessionStorage.setItem('token', token)
      }
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(userData)
      setIsAuthenticated(true)
      
      return { success: true }
    } catch (error) {
      throw error
    }
  }

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH_SIGNUP, { name, email, password })
      const { token, user: userData } = response.data.data
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(userData)
      setIsAuthenticated(true)
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      // Call logout API to invalidate token
      await axios.post(API_ENDPOINTS.AUTH_LOGOUT)
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      // Clear tokens from both storage types
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

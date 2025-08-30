import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import toast from 'react-hot-toast'

export const useFavorites = () => {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch user favorites with full book details
  const fetchFavorites = useCallback(async () => {
    if (!user?.id) {
      setFavorites([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.get(API_ENDPOINTS.USER_FAVORITES(user.id))
      console.log('Profile favorites API response:', response.data)
      
      if (response.data.success) {
        setFavorites(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
      setError('Failed to load favorites')
      toast.error('Failed to load favorites')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  // Remove book from favorites
  const removeFromFavorites = useCallback(async (bookId) => {
    if (!user?.id) {
      toast.error('Please login to manage favorites')
      return false
    }

    try {
      await axios.delete(API_ENDPOINTS.REMOVE_FAVORITE(user.id, bookId))
      setFavorites(prev => prev.filter(fav => fav.id !== bookId))
      toast.success('Removed from favorites')
      return true
    } catch (error) {
      console.error('Error removing from favorites:', error)
      toast.error('Failed to remove from favorites')
      return false
    }
  }, [user?.id])

  // Load favorites on mount
  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  return {
    favorites,
    loading,
    error,
    fetchFavorites,
    removeFromFavorites
  }
}

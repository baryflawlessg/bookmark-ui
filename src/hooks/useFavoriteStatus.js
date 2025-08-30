import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import toast from 'react-hot-toast'

export const useFavoriteStatus = () => {
  const { user } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const [loading, setLoading] = useState(false)

  // Fetch user favorites and extract book IDs
  const fetchFavorites = useCallback(async () => {
    if (!user?.id) {
      setFavoriteIds(new Set())
      return
    }

    try {
      setLoading(true)
      const response = await axios.get(API_ENDPOINTS.USER_FAVORITES(user.id))
      
      console.log('Favorites API response:', response.data)
      
      if (response.data.success) {
        const favorites = response.data.data || []
        console.log('Favorites array:', favorites)
        
        // Extract book IDs from the favorite records
        const ids = new Set()
        favorites.forEach(fav => {
          if (fav.bookId) {
            ids.add(fav.bookId)
          }
        })
        
        console.log('Extracted favorite IDs:', Array.from(ids))
        setFavoriteIds(ids)
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  // Add book to favorites
  const addToFavorites = useCallback(async (bookId) => {
    if (!user?.id) {
      toast.error('Please login to add favorites')
      return false
    }

    try {
      const response = await axios.post(API_ENDPOINTS.ADD_FAVORITE(user.id, bookId))
      console.log('Add to favorites response:', response.data)
      
      // Add the book ID to our set
      setFavoriteIds(prev => new Set([...prev, bookId]))
      toast.success('Added to favorites')
      return true
    } catch (error) {
      console.error('Error adding to favorites:', error)
      toast.error('Failed to add to favorites')
      return false
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
      
      // Remove the book ID from our set
      setFavoriteIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(bookId)
        return newSet
      })
      toast.success('Removed from favorites')
      return true
    } catch (error) {
      console.error('Error removing from favorites:', error)
      toast.error('Failed to remove from favorites')
      return false
    }
  }, [user?.id])

  // Toggle favorite status
  const toggleFavorite = useCallback(async (bookId) => {
    const isFavorite = favoriteIds.has(bookId)
    console.log(`Toggling favorite for book ${bookId}, currently favorite: ${isFavorite}`)
    
    if (isFavorite) {
      return await removeFromFavorites(bookId)
    } else {
      return await addToFavorites(bookId)
    }
  }, [favoriteIds, addToFavorites, removeFromFavorites])

  // Check if a book is in favorites
  const isFavorite = useCallback((bookId) => {
    const result = favoriteIds.has(bookId)
    console.log(`Checking if book ${bookId} is favorite: ${result}`)
    return result
  }, [favoriteIds])

  // Load favorites on mount
  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  return {
    favoriteIds: Array.from(favoriteIds),
    loading,
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite
  }
}

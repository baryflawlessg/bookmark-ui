import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { API_ENDPOINTS } from '../config/api.js'

export const useRecentReviews = () => {
  const [recentReviews, setRecentReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRecentReviews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.get(API_ENDPOINTS.HOME_RECENT_REVIEWS)
      
      if (response.data.success) {
        setRecentReviews(response.data.data.items || [])
      } else {
        setError('Failed to load recent reviews')
      }
    } catch (error) {
      console.error('Error fetching recent reviews:', error)
      setError('Failed to load recent reviews. Please try again later.')
      toast.error('Failed to load recent reviews')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRecentReviews()
  }, [fetchRecentReviews])

  return {
    recentReviews,
    loading,
    error,
    refresh: fetchRecentReviews
  }
}

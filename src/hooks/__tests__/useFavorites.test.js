import { renderHook, act } from '@testing-library/react'
import { useFavorites } from '../useFavorites.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import axios from 'axios'
import toast from 'react-hot-toast'

// Mock dependencies
jest.mock('axios')
jest.mock('react-hot-toast')
jest.mock('../../contexts/AuthContext.jsx')
jest.mock('../../config/api.js', () => ({
  API_ENDPOINTS: {
    USER_FAVORITES: (userId) => `http://localhost:8080/api/users/${userId}/favorites`,
    ADD_FAVORITE: (userId, bookId) => `http://localhost:8080/api/users/${userId}/favorites/${bookId}`,
    REMOVE_FAVORITE: (userId, bookId) => `http://localhost:8080/api/users/${userId}/favorites/${bookId}`,
  }
}))

describe('useFavorites', () => {
  const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' }
  
  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser })
    axios.get.mockResolvedValue({ data: { success: true, data: [] } })
    axios.post.mockResolvedValue({ data: { success: true } })
    axios.delete.mockResolvedValue({ data: { success: true } })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with empty favorites', () => {
    const { result } = renderHook(() => useFavorites())
    
    expect(result.current.favorites).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should fetch favorites on mount', async () => {
    const mockFavorites = [
      { id: 1, title: 'Book 1', author: 'Author 1' },
      { id: 2, title: 'Book 2', author: 'Author 2' }
    ]
    
    axios.get.mockResolvedValue({ 
      data: { success: true, data: mockFavorites } 
    })

    const { result } = renderHook(() => useFavorites())

    // Wait for the effect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/users/1/favorites')
    expect(result.current.favorites).toEqual(mockFavorites)
  })

  it('should add book to favorites', async () => {
    const { result } = renderHook(() => useFavorites())

    await act(async () => {
      const success = await result.current.addToFavorites(1)
      expect(success).toBe(true)
    })

    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/users/1/favorites/1')
    expect(toast.success).toHaveBeenCalledWith('Added to favorites')
  })

  it('should remove book from favorites', async () => {
    const { result } = renderHook(() => useFavorites())

    await act(async () => {
      const success = await result.current.removeFromFavorites(1)
      expect(success).toBe(true)
    })

    expect(axios.delete).toHaveBeenCalledWith('http://localhost:8080/api/users/1/favorites/1')
    expect(toast.success).toHaveBeenCalledWith('Removed from favorites')
  })

  it('should toggle favorite status', async () => {
    const { result } = renderHook(() => useFavorites())

    // Mock favorites to include book 1
    axios.get.mockResolvedValue({ 
      data: { success: true, data: [{ id: 1, title: 'Book 1' }] } 
    })

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Toggle should remove since it's already in favorites
    await act(async () => {
      const success = await result.current.toggleFavorite(1)
      expect(success).toBe(true)
    })

    expect(axios.delete).toHaveBeenCalledWith('http://localhost:8080/api/users/1/favorites/1')
  })

  it('should check if book is favorite', () => {
    const mockFavorites = [
      { id: 1, title: 'Book 1' },
      { id: 2, title: 'Book 2' }
    ]

    // Mock the favorites state
    const { result } = renderHook(() => useFavorites())
    
    // Manually set favorites for testing
    act(() => {
      result.current.favorites = mockFavorites
    })

    expect(result.current.isFavorite(1)).toBe(true)
    expect(result.current.isFavorite(3)).toBe(false)
  })

  it('should handle errors when fetching favorites', async () => {
    axios.get.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useFavorites())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.error).toBe('Failed to load favorites')
    expect(toast.error).toHaveBeenCalledWith('Failed to load favorites')
  })

  it('should handle errors when adding to favorites', async () => {
    axios.post.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useFavorites())

    await act(async () => {
      const success = await result.current.addToFavorites(1)
      expect(success).toBe(false)
    })

    expect(toast.error).toHaveBeenCalledWith('Failed to add to favorites')
  })

  it('should handle errors when removing from favorites', async () => {
    axios.delete.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useFavorites())

    await act(async () => {
      const success = await result.current.removeFromFavorites(1)
      expect(success).toBe(false)
    })

    expect(toast.error).toHaveBeenCalledWith('Failed to remove from favorites')
  })
})

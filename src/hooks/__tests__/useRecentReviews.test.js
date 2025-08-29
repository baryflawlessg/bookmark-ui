import { renderHook, waitFor } from '@testing-library/react'
import { useRecentReviews } from '../useRecentReviews.js'
import axios from 'axios'

// Mock axios
jest.mock('axios')

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn()
}))

describe('useRecentReviews', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches recent reviews on mount', async () => {
    const mockReviews = [
      { id: 1, bookTitle: 'Test Book', rating: 5, reviewText: 'Great book!', userName: 'Test User', createdAt: '2024-01-15T10:30:00Z' }
    ]

    axios.get.mockResolvedValue({
      data: { success: true, data: { items: mockReviews } }
    })

    const { result } = renderHook(() => useRecentReviews())

    // Initially loading
    expect(result.current.loading).toBe(true)
    expect(result.current.recentReviews).toEqual([])
    expect(result.current.error).toBe(null)

    // Wait for API call to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.recentReviews).toEqual(mockReviews)
    expect(result.current.error).toBe(null)
  })

  it('handles successful API response without items array', async () => {
    axios.get.mockResolvedValue({
      data: { success: true, data: {} }
    })

    const { result } = renderHook(() => useRecentReviews())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.recentReviews).toEqual([])
    expect(result.current.error).toBe(null)
  })

  it('handles API response with success false', async () => {
    axios.get.mockResolvedValue({
      data: { success: false, message: 'API Error' }
    })

    const { result } = renderHook(() => useRecentReviews())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.recentReviews).toEqual([])
    expect(result.current.error).toBe('Failed to load recent reviews')
  })

  it('handles API error', async () => {
    const networkError = new Error('Network error')
    axios.get.mockRejectedValue(networkError)

    const { result } = renderHook(() => useRecentReviews())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.recentReviews).toEqual([])
    expect(result.current.error).toBe('Failed to load recent reviews. Please try again later.')
  })

  it('allows manual refresh', async () => {
    const initialReviews = [{ id: 1, bookTitle: 'Initial Book', rating: 4, reviewText: 'Good book', userName: 'User1', createdAt: '2024-01-15T10:30:00Z' }]
    const refreshedReviews = [{ id: 2, bookTitle: 'Refreshed Book', rating: 5, reviewText: 'Excellent book', userName: 'User2', createdAt: '2024-01-15T11:30:00Z' }]

    // First call returns initial reviews
    axios.get.mockResolvedValueOnce({
      data: { success: true, data: { items: initialReviews } }
    })

    const { result } = renderHook(() => useRecentReviews())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.recentReviews).toEqual(initialReviews)

    // Second call returns refreshed reviews
    axios.get.mockResolvedValueOnce({
      data: { success: true, data: { items: refreshedReviews } }
    })

    // Trigger refresh
    result.current.refresh()

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.recentReviews).toEqual(refreshedReviews)
  })

  it('resets error state on successful refresh', async () => {
    // First call fails
    axios.get.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useRecentReviews())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Failed to load recent reviews. Please try again later.')

    // Second call succeeds
    const mockReviews = [{ id: 1, bookTitle: 'Test Book', rating: 5, reviewText: 'Great book!', userName: 'Test User', createdAt: '2024-01-15T10:30:00Z' }]
    axios.get.mockResolvedValueOnce({
      data: { success: true, data: { items: mockReviews } }
    })

    result.current.refresh()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe(null)
    expect(result.current.recentReviews).toEqual(mockReviews)
  })
})

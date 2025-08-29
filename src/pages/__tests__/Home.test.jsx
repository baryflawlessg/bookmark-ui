import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from '../Home.jsx'
import axios from 'axios'

// Mock axios
jest.mock('axios')

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn()
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

const mockRecentReviews = [
  {
    id: 1,
    bookTitle: 'The Great Gatsby',
    rating: 5,
    reviewText: 'A masterpiece of American literature that captures the essence of the Jazz Age...',
    userName: 'John Doe',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    bookTitle: 'To Kill a Mockingbird',
    rating: 4,
    reviewText: 'A powerful story about justice and growing up in the American South...',
    userName: 'Jane Smith',
    createdAt: '2024-01-15T09:15:00Z'
  }
]

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders hero section with welcome message', () => {
    axios.get.mockResolvedValue({
      data: { success: true, data: { items: [] } }
    })

    renderWithRouter(<Home />)
    
    expect(screen.getByText(/welcome to bookverse/i)).toBeInTheDocument()
    expect(screen.getByText(/discover amazing books/i)).toBeInTheDocument()
    expect(screen.getByText(/browse books/i)).toBeInTheDocument()
    expect(screen.getByText(/get started/i)).toBeInTheDocument()
  })

  it('renders quick stats section', () => {
    axios.get.mockResolvedValue({
      data: { success: true, data: { items: [] } }
    })

    renderWithRouter(<Home />)
    
    expect(screen.getByText(/browse books/i)).toBeInTheDocument()
    expect(screen.getByText(/share reviews/i)).toBeInTheDocument()
    expect(screen.getByText(/get recommendations/i)).toBeInTheDocument()
  })

  it('renders recent community activity section', () => {
    axios.get.mockResolvedValue({
      data: { success: true, data: { items: [] } }
    })

    renderWithRouter(<Home />)
    
    expect(screen.getByText(/recent community activity/i)).toBeInTheDocument()
  })

  it('shows loading spinner while fetching reviews', async () => {
    axios.get.mockImplementation(() => new Promise(() => {})) // Never resolves

    renderWithRouter(<Home />)
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('displays recent reviews when API call succeeds', async () => {
    axios.get.mockResolvedValue({
      data: { success: true, data: { items: mockRecentReviews } }
    })

    renderWithRouter(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText('The Great Gatsby')).toBeInTheDocument()
      expect(screen.getByText('To Kill a Mockingbird')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })
  })

  it('displays star ratings correctly', async () => {
    axios.get.mockResolvedValue({
      data: { success: true, data: { items: mockRecentReviews } }
    })

    renderWithRouter(<Home />)
    
    await waitFor(() => {
      // Check for star rating display
      expect(screen.getByText('(5/5)')).toBeInTheDocument()
      expect(screen.getByText('(4/5)')).toBeInTheDocument()
    })
  })

  it('formats dates correctly', async () => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const recentReview = {
      id: 1,
      bookTitle: 'Test Book',
      rating: 5,
      reviewText: 'Test review',
      userName: 'Test User',
      createdAt: yesterday.toISOString()
    }

    axios.get.mockResolvedValue({
      data: { success: true, data: { items: [recentReview] } }
    })

    renderWithRouter(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText('Yesterday')).toBeInTheDocument()
    })
  })

  it('shows error message when API call fails', async () => {
    axios.get.mockRejectedValue(new Error('Network error'))

    renderWithRouter(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load recent reviews/i)).toBeInTheDocument()
      expect(screen.getByText(/try again/i)).toBeInTheDocument()
    })
  })

  it('shows empty state when no reviews exist', async () => {
    axios.get.mockResolvedValue({
      data: { success: true, data: { items: [] } }
    })

    renderWithRouter(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/no recent activity/i)).toBeInTheDocument()
      expect(screen.getByText(/be the first to share a book review/i)).toBeInTheDocument()
    })
  })

  it('allows refreshing recent reviews', async () => {
    axios.get.mockResolvedValue({
      data: { success: true, data: { items: mockRecentReviews } }
    })

    renderWithRouter(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText('The Great Gatsby')).toBeInTheDocument()
    })

    // Mock a different response for refresh
    axios.get.mockResolvedValue({
      data: { success: true, data: { items: [] } }
    })

    const refreshButton = screen.getByText(/refresh/i)
    fireEvent.click(refreshButton)

    await waitFor(() => {
      expect(screen.getByText(/no recent activity/i)).toBeInTheDocument()
    })
  })

  it('renders call to action section', () => {
    axios.get.mockResolvedValue({
      data: { success: true, data: { items: [] } }
    })

    renderWithRouter(<Home />)
    
    expect(screen.getByText(/ready to start your reading journey/i)).toBeInTheDocument()
    expect(screen.getByText(/explore books/i)).toBeInTheDocument()
    expect(screen.getByText(/create account/i)).toBeInTheDocument()
  })

  it('handles API response without items array gracefully', async () => {
    axios.get.mockResolvedValue({
      data: { success: true, data: {} }
    })

    renderWithRouter(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/no recent activity/i)).toBeInTheDocument()
    })
  })

  it('handles API response with success false', async () => {
    axios.get.mockResolvedValue({
      data: { success: false, message: 'API Error' }
    })

    renderWithRouter(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load recent reviews/i)).toBeInTheDocument()
    })
  })
})

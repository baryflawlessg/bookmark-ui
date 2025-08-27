import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProtectedRoute from '../ProtectedRoute.jsx'

// Mock the auth context
jest.mock('../../contexts/AuthContext.jsx', () => ({
  useAuth: jest.fn()
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('ProtectedRoute', () => {
  const mockUseAuth = require('../../contexts/AuthContext.jsx').useAuth

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false
    })

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('shows loading spinner when loading', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: true
    })

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )
    
    // Should show loading spinner (we can check for the spinner element)
    expect(screen.getByRole('generic')).toBeInTheDocument()
  })

  it('redirects to login when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false
    })

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )
    
    // Should redirect to login (content should not be visible)
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})

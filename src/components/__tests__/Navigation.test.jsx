import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navigation from '../Navigation.jsx'
import { AuthProvider } from '../../contexts/AuthContext.jsx'

// Mock the auth context
jest.mock('../../contexts/AuthContext.jsx', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Navigation', () => {
  const mockUseAuth = require('../../contexts/AuthContext.jsx').useAuth

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders logo and navigation links', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: jest.fn()
    })

    renderWithRouter(<Navigation />)
    
    expect(screen.getByText('BookVerse')).toBeInTheDocument()
    expect(screen.getByText('Books')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Sign Up')).toBeInTheDocument()
  })

  it('shows authenticated user links when logged in', () => {
    mockUseAuth.mockReturnValue({
      user: { name: 'John Doe' },
      isAuthenticated: true,
      logout: jest.fn()
    })

    renderWithRouter(<Navigation />)
    
    expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument()
    expect(screen.getByText('Recommendations')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('hides auth-only links when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: jest.fn()
    })

    renderWithRouter(<Navigation />)
    
    expect(screen.queryByText('Recommendations')).not.toBeInTheDocument()
    expect(screen.queryByText('Profile')).not.toBeInTheDocument()
    expect(screen.queryByText('Logout')).not.toBeInTheDocument()
  })

  it('toggles mobile menu when hamburger button is clicked', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: jest.fn()
    })

    renderWithRouter(<Navigation />)
    
    const menuButton = screen.getByLabelText('Open main menu')
    fireEvent.click(menuButton)
    
    // Mobile menu should be visible
    expect(screen.getByText('Books')).toBeInTheDocument()
  })
})

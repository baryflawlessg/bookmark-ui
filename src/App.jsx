import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'
import { useAuth } from './contexts/AuthContext.jsx'

// Placeholder components for pages (we'll create these next)
const Home = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to BookVerse
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Discover books, share reviews, and get personalized recommendations
      </p>
      <div className="space-x-4">
        <a href="/books" className="btn btn-primary">
          Browse Books
        </a>
        <a href="/signup" className="btn btn-secondary">
          Get Started
        </a>
      </div>
    </div>
  </div>
)

const Books = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Books</h1>
    <p className="text-gray-600">Books listing page coming soon...</p>
  </div>
)

const BookDetails = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Book Details</h1>
    <p className="text-gray-600">Book details page coming soon...</p>
  </div>
)

const Login = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Login</h1>
    <p className="text-gray-600">Login page coming soon...</p>
  </div>
)

const Signup = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Sign Up</h1>
    <p className="text-gray-600">Signup page coming soon...</p>
  </div>
)

const Profile = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
    <p className="text-gray-600">Profile page coming soon...</p>
  </div>
)

const Recommendations = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Recommendations</h1>
    <p className="text-gray-600">Recommendations page coming soon...</p>
  </div>
)

const NotFound = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <a href="/" className="btn btn-primary">
        Go Home
      </a>
    </div>
  </div>
)

const App = () => {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recommendations" 
            element={
              <ProtectedRoute>
                <Recommendations />
              </ProtectedRoute>
            } 
          />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

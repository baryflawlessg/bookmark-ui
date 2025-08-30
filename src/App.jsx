import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'
import { useAuth } from './contexts/AuthContext.jsx'
import Home from './pages/Home.jsx'
import Books from './pages/Books.jsx'
import BookDetails from './pages/BookDetails.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Recommendations from './pages/Recommendations.jsx'

// Placeholder components for pages (we'll create these next)

const Profile = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
    <p className="text-gray-600">Profile page coming soon...</p>
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
  const { loading, isAuthenticated } = useAuth()

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
          {/* Public routes - only accessible when NOT authenticated */}
          {!isAuthenticated ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              {/* Protected routes - only accessible when authenticated */}
              <Route path="/" element={<Navigate to="/books" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="*" element={<Navigate to="/books" replace />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  )
}

export default App

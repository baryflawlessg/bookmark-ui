import React from 'react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useRecentReviews } from '../hooks/useRecentReviews.js'
import { API_ENDPOINTS } from '../config/api.js'

const Home = () => {
  const { recentReviews, loading, error, refresh } = useRecentReviews()

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`
    return date.toLocaleDateString()
  }

  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating}/5)</span>
      </div>
    )
  }

  const renderRecentReviews = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
                   <button
           onClick={refresh}
           className="btn btn-primary"
         >
           Try Again
         </button>
        </div>
      )
    }

    if (recentReviews.length === 0) {
      return (
        <EmptyState
          title="No recent activity"
          description="Be the first to share a book review!"
          action={
            <Link to="/books" className="btn btn-primary">
              Browse Books
            </Link>
          }
        />
      )
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recentReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium text-gray-900 line-clamp-2">
                {review.bookTitle}
              </h3>
              <div className="flex-shrink-0 ml-2">
                {renderStarRating(review.rating)}
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
              {review.reviewText}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-medium text-gray-700">
                by {review.userName}
              </span>
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Welcome to BookVerse
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Discover amazing books, share your thoughts, and get personalized recommendations from our community of readers.
            </p>
            <div className="flex justify-center">
              <Link 
                to="/books" 
                className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                Browse Books
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              📚
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Browse Books
            </h3>
            <p className="text-gray-600">
              Explore our curated collection of books across all genres
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              ⭐
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Share Reviews
            </h3>
            <p className="text-gray-600">
              Rate and review books to help other readers discover great stories
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              🎯
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Get Recommendations
            </h3>
            <p className="text-gray-600">
              Receive personalized book suggestions based on your preferences
            </p>
          </div>
        </div>

        {/* Recent Community Activity */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Community Activity
            </h2>
            <button
              onClick={refresh}
              disabled={loading}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
          
          {renderRecentReviews()}
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to explore more books?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Discover new books, share your thoughts, and get personalized recommendations from our community of readers.
          </p>
          <div className="flex justify-center">
            <Link to="/books" className="btn btn-primary px-8 py-3 text-lg">
              Explore Books
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

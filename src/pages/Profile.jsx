import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useFavorites } from '../hooks/useFavorites.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { API_ENDPOINTS } from '../config/api.js'

const Profile = () => {
  const { user } = useAuth()
  const { favorites, loading, error, fetchFavorites, removeFromFavorites } = useFavorites()
  
  // User reviews state
  const [userReviews, setUserReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState(null)

  // Fetch user reviews
  const fetchUserReviews = async () => {
    if (!user?.id) {
      setReviewsLoading(false)
      return
    }

    try {
      setReviewsLoading(true)
      setReviewsError(null)
      
      // Using the users endpoint as per Swagger documentation
      const response = await axios.get(`${API_ENDPOINTS.USERS}/${user.id}/reviews`)
      
             if (response.data.success) {
         // Handle pagination structure from API response
         const reviewsData = response.data.data?.items || response.data.data || []
         setUserReviews(reviewsData)
       } else {
        setReviewsError('Failed to load your reviews')
      }
    } catch (error) {
      console.error('Error fetching user reviews:', error)
      setReviewsError('Failed to load your reviews. Please try again.')
    } finally {
      setReviewsLoading(false)
    }
  }

  // Load user reviews on mount
  useEffect(() => {
    fetchUserReviews()
  }, [user?.id])
  


  // Render star rating
  const renderStarRating = (rating) => {
    if (!rating) return <span className="text-gray-400 text-sm">No rating</span>
    
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
        <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    )
  }

  // Render user review card
  const renderReviewCard = (review) => {
    if (!review || !review.id) return null

    return (
      <div
        key={review.id}
        className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
                 <Link to={`/books/${review.bookId}`}>
           <div className="aspect-[3/4] overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
             <div className="text-white text-center p-4">
               <div className="text-4xl mb-2">📚</div>
                               <div className="text-sm font-medium">
                  {review.bookTitle?.split(' ').slice(0, 2).join(' ') || `Book #${review.bookId}`}
                </div>
             </div>
           </div>
         </Link>
        
                 <div className="p-4">
           <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
             {review.bookTitle || `Book #${review.bookId}`}
           </h3>
          
          <div className="mb-3">
            {renderStarRating(review.rating)}
          </div>
          
          <div className="mb-3">
            <p className="text-gray-700 text-sm line-clamp-3">
              {review.reviewText || 'No review text provided'}
            </p>
          </div>
          
          <div className="text-sm text-gray-500">
            Reviewed on {new Date(review.createdAt).toLocaleDateString()}
          </div>
        </div>
        
                 <div className="px-4 pb-4">
           <div className="flex flex-col space-y-2">
             <Link
               to={`/books/${review.bookId}`}
               className="btn btn-primary w-full text-center py-2"
             >
               View Book Details
             </Link>
             <div className="text-center">
               <span className="text-sm text-gray-500">
                 Review ID: {review.id}
               </span>
             </div>
           </div>
         </div>
      </div>
    )
  }

  // Render favorite book card
  const renderFavoriteCard = (book) => {
    if (!book || !book.id) return null

    return (
      <div
        key={book.id}
        className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <Link to={`/books/${book.id}`}>
          <div className="aspect-[3/4] overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-white text-center p-4">
              <div className="text-4xl mb-2">📚</div>
              <div className="text-sm font-medium">
                {book.bookTitle?.split(' ').slice(0, 2).join(' ') || 'Book Cover'}
              </div>
            </div>
          </div>
        </Link>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
            {book.bookTitle || 'Untitled'}
          </h3>
          
          <p className="text-gray-600 text-sm mb-2 line-clamp-1">
            by {book.bookAuthor || 'Unknown Author'}
          </p>
          
          <div className="mb-3">
            <span className="text-sm text-gray-500">
              Added on {new Date(book.addedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="px-4 pb-4">
          <div className="flex space-x-2">
            <Link
              to={`/books/${book.id}`}
              className="btn btn-primary flex-1 text-center py-2"
            >
              View Details
            </Link>
            <button 
              onClick={() => removeFromFavorites(book.id)}
              className="btn btn-secondary py-2 px-3 text-red-600 hover:text-red-700"
              title="Remove from favorites"
            >
              ❤️
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render user reviews section
  const renderUserReviews = () => {
    if (reviewsLoading) {
      return (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )
    }

    if (reviewsError) {
      return (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{reviewsError}</p>
          <button
            onClick={() => fetchUserReviews()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      )
    }

    if (userReviews.length === 0) {
      return (
        <EmptyState
          title="No reviews yet"
          description="Start reviewing books to see them here"
          action={
            <Link to="/books" className="btn btn-primary">
              Browse Books
            </Link>
          }
        />
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {userReviews.map(renderReviewCard)}
      </div>
    )
  }

  // Render favorites section
  const renderFavorites = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )
    }

         if (error) {
       return (
         <div className="text-center py-12">
           <p className="text-red-600 mb-4">{error}</p>
           <button
             onClick={() => fetchFavorites()}
             className="btn btn-primary"
           >
             Try Again
           </button>
         </div>
       )
     }

    if (favorites.length === 0) {
      return (
        <EmptyState
          title="No favorite books yet"
          description="Start exploring books and add your favorites to see them here"
          action={
            <Link to="/books" className="btn btn-primary">
              Browse Books
            </Link>
          }
        />
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map(renderFavoriteCard)}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your account and view your favorite books
          </p>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <p className="text-gray-900">{user?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">{user?.email || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Favorites Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              My Favorite Books
            </h2>
            <span className="text-gray-500">
              {favorites.length} {favorites.length === 1 ? 'book' : 'books'}
            </span>
          </div>
          
          {renderFavorites()}
        </div>

        {/* User Reviews Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              My Book Reviews
            </h2>
            <span className="text-gray-500">
              {userReviews.length} {userReviews.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>
          
          {renderUserReviews()}
        </div>
      </div>
    </div>
  )
}

export default Profile

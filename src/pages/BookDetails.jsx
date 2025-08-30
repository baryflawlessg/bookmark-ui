import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import toast from 'react-hot-toast'
import { API_ENDPOINTS } from '../config/api.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useFavoriteStatus } from '../hooks/useFavoriteStatus.js'

const BookDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewsError, setReviewsError] = useState(null)
  
  // Favorites functionality
  const { toggleFavorite, isFavorite } = useFavoriteStatus()
  
  // Review states
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const [userReview, setUserReview] = useState(null)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  })
  
  // Pagination for reviews
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [pageSize] = useState(10)

  // Fetch book details
  const fetchBookDetails = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching book details for ID:', id)
      const response = await axios.get(`${API_ENDPOINTS.BOOKS}/${id}`)
      
      console.log('Book details response:', response.data)
      
      if (response.data.success) {
        setBook(response.data.data)
      } else {
        setError('Failed to load book details')
        toast.error('Failed to load book details')
      }
    } catch (error) {
      console.error('Error fetching book details:', error)
      setError('Failed to load book details. Please try again later.')
      toast.error('Failed to load book details')
    } finally {
      setLoading(false)
    }
  }, [id])

  // Fetch book reviews
  const fetchReviews = useCallback(async () => {
    try {
      setReviewsLoading(true)
      setReviewsError(null)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString()
      })
      
      console.log('Fetching reviews with params:', params.toString())
      const response = await axios.get(`${API_ENDPOINTS.BOOKS}/${id}/reviews?${params.toString()}`)
      
      console.log('Reviews response:', response.data)
      
      if (response.data.success) {
        const reviewsData = response.data.data?.items || response.data.data || []
        const totalPagesData = response.data.data?.pagination?.totalPages || 0
        const totalElementsData = response.data.data?.pagination?.totalElements || 0
        
        setReviews(reviewsData)
        setTotalPages(totalPagesData)
        setTotalElements(totalElementsData)
        
        // Check if user has already reviewed this book
        if (user) {
          const userExistingReview = reviewsData.find(review => review.userId === user.id)
          setUserReview(userExistingReview || null)
        }
      } else {
        setReviewsError('Failed to load reviews')
        toast.error('Failed to load reviews')
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviewsError('Failed to load reviews. Please try again later.')
      toast.error('Failed to load reviews')
    } finally {
      setReviewsLoading(false)
    }
  }, [id, currentPage, pageSize, user])

  // Load book details and reviews on mount
  useEffect(() => {
    fetchBookDetails()
  }, [fetchBookDetails])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  // Handle review form changes
  const handleReviewFormChange = (field, value) => {
    setReviewForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Submit review (create or update)
  const handleSubmitReview = async (e) => {
    e.preventDefault()
    
    try {
      if (editingReview) {
        // Update existing review
        await axios.put(`${API_ENDPOINTS.REVIEWS}/${editingReview.id}?userId=${editingReview.userId}`, {
          rating: reviewForm.rating,
          reviewText: reviewForm.comment
        })
        toast.success('Review updated successfully!')
      } else {
        // Create new review
        const requestData = {
          rating: reviewForm.rating,
          reviewText: reviewForm.comment
        }
        console.log('Creating review with URL:', `${API_ENDPOINTS.REVIEWS}/book/${id}?userId=${user.id}`)
        console.log('Request data:', requestData)
        
        await axios.post(`${API_ENDPOINTS.REVIEWS}/book/${id}?userId=${user.id}`, requestData)
        toast.success('Review added successfully!')
      }
      
      // Reset form and refresh reviews
      setReviewForm({ rating: 5, comment: '' })
      setShowReviewForm(false)
      setEditingReview(null)
      fetchReviews()
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review. Please try again.')
    }
  }

  // Delete review
  const handleDeleteReview = async (reviewId, userId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return
    }
    
    try {
      await axios.delete(`${API_ENDPOINTS.REVIEWS}/${reviewId}?userId=${userId}`)
      toast.success('Review deleted successfully!')
      setUserReview(null) // Reset user review state
      fetchReviews()
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error('Failed to delete review. Please try again.')
    }
  }

  // Edit review
  const handleEditReview = (review) => {
    setEditingReview(review)
    setReviewForm({
      rating: review.rating,
      comment: review.reviewText
    })
    setShowReviewForm(true)
  }

  // Cancel review form
  const handleCancelReview = () => {
    setReviewForm({ rating: 5, comment: '' })
    setShowReviewForm(false)
    setEditingReview(null)
  }

  // Render star rating
  const renderStarRating = (rating) => {
    if (!rating) return <span className="text-gray-400 text-sm">No rating</span>
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    )
  }

  // Render review form
  const renderReviewForm = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {editingReview ? 'Edit Review' : 'Write a Review'}
      </h3>
      
      <form onSubmit={handleSubmitReview}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleReviewFormChange('rating', star)}
                className="focus:outline-none"
              >
                <svg
                  className={`h-8 w-8 ${
                    star <= reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comment
          </label>
                     <textarea
             value={reviewForm.comment}
             onChange={(e) => handleReviewFormChange('comment', e.target.value)}
             rows={4}
             className="input w-full"
             placeholder="Share your thoughts about this book..."
           />
        </div>
        
        <div className="flex space-x-3">
          <button type="submit" className="btn btn-primary">
            {editingReview ? 'Update Review' : 'Submit Review'}
          </button>
          <button
            type="button"
            onClick={handleCancelReview}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )

  // Render review card
  const renderReviewCard = (review) => (
    <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-semibold">
              {review.userName?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{review.userName || 'Anonymous'}</h4>
            <p className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {review.userId === user?.id && (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEditReview(review)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteReview(review.id, review.userId)}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      
      <div className="mb-3">
        {renderStarRating(review.rating)}
      </div>
      
      <p className="text-gray-700">{review.reviewText}</p>
    </div>
  )

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-6">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 0}
          className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`btn ${
              page === currentPage ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            {page + 1}
          </button>
        ))}
        
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchBookDetails}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Book not found
  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            title="Book not found"
            description="The book you're looking for doesn't exist or has been removed."
            action={
              <Link to="/books" className="btn btn-primary">
                Browse Books
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
          <Link
            to="/books"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Books
          </Link>
        </div>

        {/* Book Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Book Cover */}
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
                {book.coverImageUrl ? (
                  <img
                    src={book.coverImageUrl}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-gray-400 text-6xl">📚</div>
                )}
              </div>
            </div>

            {/* Book Information */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{book.title}</h1>
              
              <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
              
              <div className="flex items-center space-x-4 mb-6">
                {renderStarRating(book.averageRating)}
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{book.reviewCount || 0} reviews</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">Published {book.publishedYear}</span>
              </div>
              
              {/* Favorite Button */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFavorite(book.id)}
                  className={`btn ${
                    isFavorite(book.id) 
                      ? 'btn-primary text-red-600 hover:text-red-700' 
                      : 'btn-secondary hover:text-red-600'
                  }`}
                >
                  <span className="mr-2">❤️</span>
                  {isFavorite(book.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>

              {/* Genres */}
              {book.genres && book.genres.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {book.genres.map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                      >
                        {genre.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

                             {/* Description */}
               {book.description && (
                 <div className="mb-6">
                   <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                   <p className="text-gray-600 leading-relaxed">{book.description}</p>
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Reviews ({totalElements || 0})
            </h2>
            {user && !userReview ? (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="btn btn-primary"
              >
                Write a Review
              </button>
            ) : user && userReview ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditReview(userReview)}
                  className="btn btn-secondary"
                >
                  Edit Your Review
                </button>
                <button
                  onClick={() => handleDeleteReview(userReview.id, userReview.userId)}
                  className="btn btn-outline-red"
                >
                  Delete Review
                </button>
              </div>
            ) : null}
          </div>

          {/* Review Form */}
          {showReviewForm && renderReviewForm()}

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : reviewsError ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{reviewsError}</p>
              <button
                onClick={fetchReviews}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          ) : reviews.length === 0 ? (
            <EmptyState
              title="No reviews yet"
              description="Be the first to review this book!"
              action={
                user && !userReview ? (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="btn btn-primary"
                  >
                    Write a Review
                  </button>
                ) : null
              }
            />
          ) : (
            <>
              <div className="space-y-4">
                {reviews.map(renderReviewCard)}
              </div>
              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookDetails

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { API_ENDPOINTS } from '../config/api'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { useFavoriteStatus } from '../hooks/useFavoriteStatus.js'

const Recommendations = () => {
  const [topRatedBooks, setTopRatedBooks] = useState([])
  const [genreBasedBooks, setGenreBasedBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [genreLoading, setGenreLoading] = useState(true)
  const [error, setError] = useState(null)
  const [genreError, setGenreError] = useState(null)
  
  // Favorites functionality
  const { toggleFavorite, isFavorite } = useFavoriteStatus()

  useEffect(() => {
    fetchTopRatedBooks()
    fetchGenreBasedBooks()
  }, [])

  const fetchTopRatedBooks = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.get(`${API_ENDPOINTS.RECOMMENDATIONS}/top-rated?limit=20`)
      
      if (response.data.success) {
        // The API returns an array with a single object containing a books array
        const data = response.data.data || []
        const topRatedSection = data.find(section => section.type === 'top-rated')
        const books = topRatedSection?.books || []
        // Show only 10 books from the 20 that the API sends
        setTopRatedBooks(books.slice(0, 10))
      } else {
        setError('Failed to load top-rated books')
      }
    } catch (error) {
      console.error('Error fetching top-rated books:', error)
      setError('Failed to load top-rated books. Please try again.')
      toast.error('Failed to load recommendations')
    } finally {
      setLoading(false)
    }
  }

  const fetchGenreBasedBooks = async () => {
    try {
      setGenreLoading(true)
      setGenreError(null)
      
      const response = await axios.get(`${API_ENDPOINTS.RECOMMENDATIONS}/favorites-genre-based?userId=21&limit=10`)
      
      if (response.data.success) {
        const data = response.data.data || []
        const genreBasedSection = data.find(section => section.type === 'favorites-genre-based')
        const books = genreBasedSection?.books || []
        // Keep it to max 10 recommendations
        setGenreBasedBooks(books.slice(0, 10))
      } else {
        setGenreError('Failed to load genre-based recommendations')
      }
    } catch (error) {
      console.error('Error fetching genre-based recommendations:', error)
      setGenreError('Failed to load genre-based recommendations. Please try again.')
      toast.error('Failed to load genre-based recommendations')
    } finally {
      setGenreLoading(false)
    }
  }

  const renderStarRating = (rating) => {
    const stars = []
    const safeRating = rating || 0
    const fullStars = Math.floor(safeRating)
    const hasHalfStar = safeRating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfStar">
              <stop offset="50%" stopColor="#fbbf24"/>
              <stop offset="50%" stopColor="#e5e7eb"/>
            </linearGradient>
          </defs>
          <path fill="url(#halfStar)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      )
    }

    return stars
  }

  const renderBookCard = (book) => (
    <div key={book.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <Link to={`/books/${book.id}`}>
        <div className="aspect-[3/4] overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <div className="text-white text-center p-4">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-sm font-medium">
              {book.title?.split(' ').slice(0, 2).join(' ') || 'Book Cover'}
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            by {book.author}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {renderStarRating(book.averageRating || 0)}
              <span className="text-sm text-gray-600 ml-1">
                {(book.averageRating || 0).toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {book.reviewCount || 0} reviews
            </span>
          </div>
        </div>
      </Link>
      
      {/* Favorite button */}
      <div className="px-4 pb-4">
        <div className="flex space-x-2">
          <Link
            to={`/books/${book.id}`}
            className="btn btn-primary flex-1 text-center py-2"
          >
            View Details
          </Link>
          <button 
            onClick={(e) => {
              e.preventDefault()
              toggleFavorite(book.id)
            }}
            className={`btn py-2 px-3 ${
              isFavorite(book.id) 
                ? 'btn-primary text-red-600 hover:text-red-700' 
                : 'btn-secondary hover:text-red-600'
            }`}
            title={isFavorite(book.id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            ❤️
          </button>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="Failed to load recommendations"
          description={error}
          action={
            <button
              onClick={fetchTopRatedBooks}
              className="btn btn-primary"
            >
              Try Again
            </button>
          }
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Top Rated Books
        </h1>
        <p className="text-gray-600">
          Discover the highest-rated books from our community
        </p>
      </div>

      {/* Books Grid */}
      {topRatedBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {topRatedBooks.map(renderBookCard)}
        </div>
      ) : (
        <EmptyState
          title="No top-rated books found"
          description="Check back later for the latest recommendations"
        />
      )}

      {/* Genre Based Recommendations Section */}
      <div className="mt-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Genre Based Recommendations
          </h2>
          <p className="text-gray-600">
            Personalized book suggestions based on your favorite genres
          </p>
        </div>
        
        {/* Genre-based recommendations content */}
        {genreLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <LoadingSpinner />
          </div>
        ) : genreError ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{genreError}</p>
            <button
              onClick={fetchGenreBasedBooks}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : genreBasedBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {genreBasedBooks.map(renderBookCard)}
          </div>
        ) : (
          <EmptyState
            title="No genre-based recommendations found"
            description="We'll have personalized recommendations for you soon"
          />
        )}
      </div>
    </div>
  )
}

export default Recommendations

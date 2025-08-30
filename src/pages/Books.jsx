import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import toast from 'react-hot-toast'
import { API_ENDPOINTS } from '../config/api.js'
import { useFavorites } from '../hooks/useFavorites.js'

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  
  // Favorites functionality
  const { toggleFavorite, isFavorite } = useFavorites()

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '')
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '')
  const [yearRange, setYearRange] = useState({
    min: searchParams.get('minYear') || '',
    max: searchParams.get('maxYear') || ''
  })
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'title')
  const [sortDirection, setSortDirection] = useState(searchParams.get('sortDirection') || 'asc')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '0') || 0)
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('size') || '20') || 20)

  // Available options
  const genres = [
    'ROMANCE', 'SCI_FI', 'FANTASY', 'MYSTERY', 'COMEDY'
  ]

  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'author', label: 'Author' },
    { value: 'rating', label: 'Rating' },
    { value: 'publicationDate', label: 'Publication Date' },
    { value: 'price', label: 'Price' }
  ]

  const pageSizeOptions = [12, 20, 50, 100]

  // Build query parameters
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams()
    
    if (searchQuery) params.set('query', searchQuery)
    if (selectedGenre) params.set('genre', selectedGenre)
    if (yearRange?.min) params.set('minYear', yearRange.min)
    if (yearRange?.max) params.set('maxYear', yearRange.max)
    if (minRating) params.set('minRating', minRating)
    if (sortBy) params.set('sortBy', sortBy)
    if (sortDirection) params.set('sortDirection', sortDirection)
    params.set('page', (currentPage || 0).toString())
    params.set('size', (pageSize || 20).toString())
    
    return params
  }, [searchQuery, selectedGenre, yearRange, minRating, sortBy, sortDirection, currentPage, pageSize])

  // Fetch books
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const queryParams = buildQueryParams()
      console.log('Fetching books with params:', queryParams.toString())
      console.log('Auth token:', axios.defaults.headers.common['Authorization'])
      const response = await axios.get(`${API_ENDPOINTS.BOOKS}?${queryParams.toString()}`)
      
      console.log('API Response:', response.data)
      
      // Handle different response formats
      let booksData = []
      let totalPagesData = 0
      let totalElementsData = 0
      
      if (response.data.success) {
        // Standard success response format with items array
        booksData = response.data.data?.items || response.data.data || []
        totalPagesData = response.data.data?.pagination?.totalPages || 0
        totalElementsData = response.data.data?.pagination?.totalElements || 0
      } else if (response.data.content) {
        // Direct content format
        booksData = response.data.content
        totalPagesData = response.data.totalPages || 0
        totalElementsData = response.data.totalElements || 0
      } else if (Array.isArray(response.data)) {
        // Array format
        booksData = response.data
        totalElementsData = response.data.length
      } else {
        // Fallback - try to extract data
        booksData = response.data?.items || response.data?.content || []
        totalPagesData = response.data?.pagination?.totalPages || response.data?.totalPages || 0
        totalElementsData = response.data?.pagination?.totalElements || response.data?.totalElements || 0
      }
      
      console.log('Extracted books data:', booksData)
      console.log('Total pages:', totalPagesData)
      console.log('Total elements:', totalElementsData)
      
      // Ensure booksData is always an array
      const finalBooksData = Array.isArray(booksData) ? booksData : []
      
      setBooks(finalBooksData)
      setTotalPages(totalPagesData)
      setTotalElements(totalElementsData)
      
      // Update URL with current filters
      setSearchParams(queryParams)
    } catch (error) {
      console.error('Error fetching books:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      console.error('Error headers:', error.response?.headers)
      setError('Failed to load books. Please try again later.')
      toast.error('Failed to load books')
    } finally {
      setLoading(false)
    }
  }, [buildQueryParams, setSearchParams])

  // Fetch books only on initial load and when search is submitted
  useEffect(() => {
    fetchBooks()
  }, []) // Empty dependency array - only runs once on mount

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(0)
    fetchBooks() // Make the API call when search is submitted
  }

  // Handle filter changes (no automatic API calls)
  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'genre':
        setSelectedGenre(value)
        break
      case 'minYear':
        setYearRange(prev => ({ ...prev, min: value }))
        break
      case 'maxYear':
        setYearRange(prev => ({ ...prev, max: value }))
        break
      case 'minRating':
        setMinRating(value)
        break
      case 'sortBy':
        setSortBy(value)
        break
      case 'sortDirection':
        setSortDirection(value)
        break
      case 'pageSize':
        setPageSize(parseInt(value))
        break
      default:
        break
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedGenre('')
    setYearRange({ min: '', max: '' })
    setMinRating('')
    setSortBy('title')
    setSortDirection('asc')
    setCurrentPage(0)
  }

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page)
    fetchBooks() // Trigger API call when page changes
  }

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
      fetchBooks() // Trigger API call when page changes
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
      fetchBooks() // Trigger API call when page changes
    }
  }

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

    // Render book card
  const renderBookCard = (book) => {
    // Defensive check for book data
    if (!book || !book.id) {
      console.warn('Invalid book data:', book)
      return null
    }
    
    // Debug: Log the book object structure to see what properties are available
    console.log('Book object from Books API:', book)
    
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
                {book.title?.split(' ').slice(0, 2).join(' ') || 'Book Cover'}
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
              {book.title || 'Untitled'}
            </h3>
            
                         <p className="text-gray-600 text-sm mb-2 line-clamp-1">
               by {book.author || book.authorName || book.bookAuthor || 'Unknown Author'}
             </p>
            
                         <div className="mb-3">
               {renderStarRating(book.averageRating)}
             </div>
            
                         {(book.genre || book.publicationYear) && (
               <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                 {book.genre && <span>{book.genre}</span>}
                 {book.publicationYear && <span>{book.publicationYear}</span>}
               </div>
             )}
          </div>
        </Link>
        
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
  }

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
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {startPage > 0 && (
          <>
            <button
              onClick={() => goToPage(0)}
              className="btn btn-secondary"
            >
              1
            </button>
            {startPage > 1 && <span className="px-2">...</span>}
          </>
        )}
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`btn ${
              page === currentPage ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            {page + 1}
          </button>
        ))}
        
        {endPage < totalPages - 1 && (
          <>
            {endPage < totalPages - 2 && <span className="px-2">...</span>}
            <button
              onClick={() => goToPage(totalPages - 1)}
              className="btn btn-secondary"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1}
          className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    )
  }

  // Render filters
  const renderFilters = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          Clear All
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Genre Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Genre
          </label>
          <select
            value={selectedGenre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="input"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Year Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Year
          </label>
          <input
            type="number"
            value={yearRange.min}
            onChange={(e) => handleFilterChange('minYear', e.target.value)}
            placeholder="1900"
            className="input"
            min="1900"
            max="2030"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Year
          </label>
          <input
            type="number"
            value={yearRange.max}
            onChange={(e) => handleFilterChange('maxYear', e.target.value)}
            placeholder="2030"
            className="input"
            min="1900"
            max="2030"
          />
        </div>

        {/* Min Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Rating
          </label>
          <select
            value={minRating}
            onChange={(e) => handleFilterChange('minRating', e.target.value)}
            className="input"
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Stars</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="input"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Direction */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort Direction
          </label>
          <select
            value={sortDirection}
            onChange={(e) => handleFilterChange('sortDirection', e.target.value)}
            className="input"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {/* Page Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Items per Page
          </label>
          <select
            value={pageSize}
            onChange={(e) => handleFilterChange('pageSize', e.target.value)}
            className="input"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )

  // Render search bar
  const renderSearchBar = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <form onSubmit={handleSearch} className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, author, or keywords..."
            className="input text-lg"
          />
        </div>
        <button type="submit" className="btn btn-primary px-8">
          Search
        </button>
      </form>
    </div>
  )

  // Render results summary
  const renderResultsSummary = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="text-gray-600">
        Showing {books.length} of {totalElements} books
        {searchQuery && ` for "${searchQuery}"`}
      </div>
      
      {totalElements > 0 && (
        <div className="text-sm text-gray-500">
          Page {currentPage + 1} of {totalPages}
        </div>
      )}
    </div>
  )

  // Render main content
  const renderContent = () => {
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
            onClick={fetchBooks}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      )
    }

    if (books.length === 0) {
      return (
        <EmptyState
          title="No books found"
          description={
            searchQuery || selectedGenre || yearRange.min || yearRange.max || minRating
              ? "Try adjusting your search criteria or filters"
              : "No books are currently available"
          }
          action={
            <button
              onClick={clearFilters}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          }
        />
      )
    }

    return (
      <>
        {renderResultsSummary()}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.isArray(books) ? books.filter(book => book && book.id).map(renderBookCard) : null}
        </div>
        {renderPagination()}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Books
          </h1>
          <p className="text-gray-600">
            Discover amazing books across all genres and find your next favorite read
          </p>
        </div>

        {/* Search Bar */}
        {renderSearchBar()}

        {/* Filters */}
        {renderFilters()}

        {/* Results */}
        {renderContent()}
      </div>
    </div>
  )
}

export default Books

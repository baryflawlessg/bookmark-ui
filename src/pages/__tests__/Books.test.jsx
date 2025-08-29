import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Books from '../Books.jsx'
import axios from 'axios'

// Mock axios
jest.mock('axios')

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn()
}))

// Mock useSearchParams
const mockSetSearchParams = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => [
    new URLSearchParams('query=test&page=0&size=20'),
    mockSetSearchParams
  ]
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

const mockBooks = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'LITERARY_FICTION',
    publicationYear: 1925,
    averageRating: 4.5,
    price: 12.99,
    coverImageUrl: 'https://example.com/gatsby.jpg'
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'LITERARY_FICTION',
    publicationYear: 1960,
    averageRating: 4.8,
    price: 14.99,
    coverImageUrl: null
  }
]

const mockApiResponse = {
  success: true,
  data: {
    content: mockBooks,
    totalPages: 5,
    totalElements: 100,
    size: 20,
    number: 0
  }
}

describe('Books', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    axios.get.mockResolvedValue(mockApiResponse)
  })

  it('renders the page header', async () => {
    renderWithRouter(<Books />)
    
    expect(screen.getByText(/browse books/i)).toBeInTheDocument()
    expect(screen.getByText(/discover amazing books/i)).toBeInTheDocument()
  })

  it('renders search bar', () => {
    renderWithRouter(<Books />)
    
    expect(screen.getByPlaceholderText(/search by title, author, or keywords/i)).toBeInTheDocument()
    expect(screen.getByText(/search/i)).toBeInTheDocument()
  })

  it('renders filter section', () => {
    renderWithRouter(<Books />)
    
    expect(screen.getByText(/filters/i)).toBeInTheDocument()
    expect(screen.getByText(/genre/i)).toBeInTheDocument()
    expect(screen.getByText(/min year/i)).toBeInTheDocument()
    expect(screen.getByText(/max year/i)).toBeInTheDocument()
    expect(screen.getByText(/min rating/i)).toBeInTheDocument()
    expect(screen.getByText(/sort by/i)).toBeInTheDocument()
    expect(screen.getByText(/sort direction/i)).toBeInTheDocument()
    expect(screen.getByText(/items per page/i)).toBeInTheDocument()
  })

  it('shows loading spinner initially', () => {
    renderWithRouter(<Books />)
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('displays books when API call succeeds', async () => {
    renderWithRouter(<Books />)
    
    await waitFor(() => {
      expect(screen.getByText('The Great Gatsby')).toBeInTheDocument()
      expect(screen.getByText('To Kill a Mockingbird')).toBeInTheDocument()
      expect(screen.getByText('F. Scott Fitzgerald')).toBeInTheDocument()
      expect(screen.getByText('Harper Lee')).toBeInTheDocument()
    })
  })

  it('displays book ratings correctly', async () => {
    renderWithRouter(<Books />)
    
    await waitFor(() => {
      expect(screen.getByText('(4.5)')).toBeInTheDocument()
      expect(screen.getByText('(4.8)')).toBeInTheDocument()
    })
  })

  it('displays book prices correctly', async () => {
    renderWithRouter(<Books />)
    
    await waitFor(() => {
      expect(screen.getByText('$12.99')).toBeInTheDocument()
      expect(screen.getByText('$14.99')).toBeInTheDocument()
    })
  })

  it('shows placeholder for books without cover images', async () => {
    renderWithRouter(<Books />)
    
    await waitFor(() => {
      expect(screen.getByText('📚')).toBeInTheDocument()
    })
  })

  it('handles search functionality', async () => {
    renderWithRouter(<Books />)
    
    const searchInput = screen.getByPlaceholderText(/search by title, author, or keywords/i)
    const searchButton = screen.getByText(/search/i)
    
    fireEvent.change(searchInput, { target: { value: 'gatsby' } })
    fireEvent.click(searchButton)
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('query=gatsby'))
    })
  })

  it('handles genre filter changes', async () => {
    renderWithRouter(<Books />)
    
    const genreSelect = screen.getByDisplayValue(/all genres/i)
    fireEvent.change(genreSelect, { target: { value: 'FANTASY' } })
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('genre=FANTASY'))
    })
  })

  it('handles year range filter changes', async () => {
    renderWithRouter(<Books />)
    
    const minYearInput = screen.getByPlaceholderText('1900')
    const maxYearInput = screen.getByPlaceholderText('2030')
    
    fireEvent.change(minYearInput, { target: { value: '1950' } })
    fireEvent.change(maxYearInput, { target: { value: '2000' } })
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('minYear=1950'))
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('maxYear=2000'))
    })
  })

  it('handles rating filter changes', async () => {
    renderWithRouter(<Books />)
    
    const ratingSelect = screen.getByDisplayValue(/any rating/i)
    fireEvent.change(ratingSelect, { target: { value: '4' } })
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('minRating=4'))
    })
  })

  it('handles sort changes', async () => {
    renderWithRouter(<Books />)
    
    const sortBySelect = screen.getByDisplayValue(/title/i)
    const sortDirectionSelect = screen.getByDisplayValue(/ascending/i)
    
    fireEvent.change(sortBySelect, { target: { value: 'rating' } })
    fireEvent.change(sortDirectionSelect, { target: { value: 'desc' } })
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('sortBy=rating'))
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('sortDirection=desc'))
    })
  })

  it('handles page size changes', async () => {
    renderWithRouter(<Books />)
    
    const pageSizeSelect = screen.getByDisplayValue('20')
    fireEvent.change(pageSizeSelect, { target: { value: '50' } })
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('size=50'))
    })
  })

  it('clears all filters when clear button is clicked', async () => {
    renderWithRouter(<Books />)
    
    const clearButton = screen.getByText(/clear all/i)
    fireEvent.click(clearButton)
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('page=0'))
    })
  })

  it('shows results summary', async () => {
    renderWithRouter(<Books />)
    
    await waitFor(() => {
      expect(screen.getByText(/showing 2 of 100 books/i)).toBeInTheDocument()
      expect(screen.getByText(/page 1 of 5/i)).toBeInTheDocument()
    })
  })

  it('renders pagination controls', async () => {
    renderWithRouter(<Books />)
    
    await waitFor(() => {
      expect(screen.getByText(/previous/i)).toBeInTheDocument()
      expect(screen.getByText(/next/i)).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })

  it('handles pagination navigation', async () => {
    renderWithRouter(<Books />)
    
    await waitFor(() => {
      const nextButton = screen.getByText(/next/i)
      fireEvent.click(nextButton)
      
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('page=1'))
    })
  })

  it('shows error message when API call fails', async () => {
    axios.get.mockRejectedValue(new Error('Network error'))
    
    renderWithRouter(<Books />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load books/i)).toBeInTheDocument()
      expect(screen.getByText(/try again/i)).toBeInTheDocument()
    })
  })

  it('shows empty state when no books found', async () => {
    axios.get.mockResolvedValue({
      success: true,
      data: {
        content: [],
        totalPages: 0,
        totalElements: 0,
        size: 20,
        number: 0
      }
    })
    
    renderWithRouter(<Books />)
    
    await waitFor(() => {
      expect(screen.getByText(/no books found/i)).toBeInTheDocument()
      expect(screen.getByText(/no books are currently available/i)).toBeInTheDocument()
    })
  })

  it('shows appropriate empty state message when filters are applied', async () => {
    axios.get.mockResolvedValue({
      success: true,
      data: {
        content: [],
        totalPages: 0,
        totalElements: 0,
        size: 20,
        number: 0
      }
    })
    
    renderWithRouter(<Books />)
    
    // Apply a filter first
    const genreSelect = screen.getByDisplayValue(/all genres/i)
    fireEvent.change(genreSelect, { target: { value: 'FANTASY' } })
    
    await waitFor(() => {
      expect(screen.getByText(/try adjusting your search criteria or filters/i)).toBeInTheDocument()
    })
  })

  it('displays book details correctly', async () => {
    renderWithRouter(<Books />)
    
    await waitFor(() => {
      expect(screen.getByText('The Great Gatsby')).toBeInTheDocument()
      expect(screen.getByText('by F. Scott Fitzgerald')).toBeInTheDocument()
      expect(screen.getByText('LITERARY_FICTION')).toBeInTheDocument()
      expect(screen.getByText('1925')).toBeInTheDocument()
      expect(screen.getByText('View Details')).toBeInTheDocument()
    })
  })

  it('handles books without ratings', async () => {
    const booksWithoutRating = [
      {
        id: 1,
        title: 'Test Book',
        author: 'Test Author',
        genre: 'FANTASY',
        publicationYear: 2020,
        averageRating: null,
        price: 9.99,
        coverImageUrl: null
      }
    ]
    
    axios.get.mockResolvedValue({
      success: true,
      data: {
        content: booksWithoutRating,
        totalPages: 1,
        totalElements: 1,
        size: 20,
        number: 0
      }
    })
    
    renderWithRouter(<Books />)
    
    await waitFor(() => {
      expect(screen.getByText(/no rating/i)).toBeInTheDocument()
    })
  })

  it('handles books without prices', async () => {
    const booksWithoutPrice = [
      {
        id: 1,
        title: 'Test Book',
        author: 'Test Author',
        genre: 'FANTASY',
        publicationYear: 2020,
        averageRating: 4.0,
        price: null,
        coverImageUrl: null
      }
    ]
    
    axios.get.mockResolvedValue({
      success: true,
      data: {
        content: booksWithoutPrice,
        totalPages: 1,
        totalElements: 1,
        size: 20,
        number: 0
      }
    })
    
    renderWithRouter(<Books />)
    
    await waitFor(() => {
      expect(screen.getByText('N/A')).toBeInTheDocument()
    })
  })
})

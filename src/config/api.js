// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const API_ENDPOINTS = {
  BOOKS: `${API_BASE_URL}/api/books`,
  HOME_RECENT_REVIEWS: `${API_BASE_URL}/api/home/recent-reviews`,
  AUTH_LOGIN: `${API_BASE_URL}/api/auth/login`,
  AUTH_SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  AUTH_LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  USER_PROFILE: `${API_BASE_URL}/api/auth/profile`,
}

export default API_BASE_URL

# BookVerse Frontend Pages & Features

## 📚 **Pages & API Endpoints Mapping**

### 🏠 **1. Home/Landing Page**
**API Endpoints:**
- `GET /home/recent-reviews` - Recent community activity

**Features:**
- Recent reviews section showing latest community activity
- Welcome message for new users
- Quick navigation to main sections
- Responsive design for all devices

---

### 🔐 **2. Authentication Pages**

#### **2.1 Login Page**
**API Endpoint:** `POST /auth/login`
**Request:** `{ "email": "string", "password": "string" }`
**Response:** `{ "token": "JWT", "user": { "id", "name", "email" } }`

**Features:**
- Email/password form with validation
- Error handling for invalid credentials
- Success redirect to Books page
- Remember me functionality
- Forgot password link (future enhancement)

#### **2.2 Signup Page**
**API Endpoint:** `POST /auth/signup`
**Request:** `{ "name": "string", "email": "string", "password": "string" }`
**Response:** `{ "token": "JWT", "user": { "id", "name", "email" } }`

**Features:**
- Name/email/password form with validation
- Password strength indicator
- Terms of service checkbox
- Success redirect to Books page
- Error handling for duplicate email

#### **2.3 Logout Action**
**API Endpoint:** `POST /auth/logout`
**Features:**
- Clear JWT token from localStorage
- Clear user state
- Redirect to home page

---

### 📖 **3. Books Listing Page**
**API Endpoint:** `GET /books`
**Query Parameters:**
- `query` - Search by title/author
- `genre` - Filter by genres (FANTASY, SCI_FI, MYSTERY, etc.)
- `minYear`/`maxYear` - Year range filter
- `minRating` - Minimum rating filter
- `sortBy` - Sort by title, author, rating, date
- `sortDirection` - asc/desc
- `page` - Pagination (0-based)
- `size` - Page size (max 100)

**Features:**
- Search bar with autocomplete
- Advanced filters (genre, year, rating)
- Sort options (title, author, rating, date)
- Grid/list view toggle
- Pagination controls
- Book cards with cover, title, author, rating
- Loading states and empty states
- Responsive grid layout

---

### 📚 **4. Book Details Page**
**API Endpoints:**
- `GET /books/{id}` - Book details with reviews
- `GET /books/{id}/reviews` - Paginated book reviews
- `POST /reviews/book/{bookId}?userId={userId}` - Create review
- `PUT /reviews/{reviewId}?userId={userId}` - Update review
- `DELETE /reviews/{reviewId}?userId={userId}` - Delete review

**Features:**
- Book cover image and details
- Author information and publication year
- Average rating and review count
- Genre tags
- Review form (for authenticated users)
- Review list with pagination
- Edit/delete review options (for review owner)
- Add to favorites button
- Related books section

---

### 👤 **5. User Profile Page**
**API Endpoints:**
- `GET /users/profile` - Current user profile
- `PUT /users/profile` - Update profile
- `DELETE /users/profile` - Delete account
- `GET /users/{id}/reviews` - User's review history
- `GET /users/{id}/favorites` - User's favorite books

**Features:**
- Profile information display
- Edit profile form (name, email, password)
- Profile picture upload (future enhancement)
- Review history with pagination
- Favorite books list
- Account deletion option
- Activity statistics
- Reading preferences

---

### ⭐ **6. Recommendations Page**
**API Endpoints:**
- `GET /recommendations` - All recommendations (with optional userId)
- `GET /recommendations/user-based?userId={userId}` - Personalized recommendations
- `GET /recommendations/top-rated` - Top rated books
- `GET /recommendations/genre-based` - Genre-based recommendations

**Features:**
- Personalized recommendations based on user preferences
- Top-rated books section
- Genre-based recommendations
- Book cards with ratings and review counts
- "Add to favorites" functionality
- Refresh recommendations button
- Loading states for recommendation generation

---

### 🔍 **7. Search Results Page**
**API Endpoint:** `GET /books` (with search parameters)

**Features:**
- Search query display
- Advanced filter options
- Sort and pagination controls
- Search suggestions
- Recent searches
- Filter by multiple criteria
- Clear all filters option

---

### 📝 **8. Review Management**

#### **8.1 Create Review**
**API Endpoint:** `POST /reviews/book/{bookId}?userId={userId}`
**Request:** `{ "rating": number, "reviewText": "string" }`

**Features:**
- Star rating selector (1-5 stars)
- Review text input (10-2000 characters)
- Character count display
- Submit button with loading state
- Form validation
- Success/error messages

#### **8.2 Edit Review**
**API Endpoint:** `PUT /reviews/{reviewId}?userId={userId}`
**Features:**
- Pre-populated form with existing review
- Same validation as create
- Update confirmation
- Cancel edit option

#### **8.3 Delete Review**
**API Endpoint:** `DELETE /reviews/{reviewId}?userId={userId}`
**Features:**
- Delete confirmation modal
- Success message
- Update UI immediately

---

### ❤️ **9. Favorites Management**
**API Endpoints:**
- `POST /users/{id}/favorites/{bookId}` - Add to favorites
- `DELETE /users/{id}/favorites/{bookId}` - Remove from favorites
- `GET /users/{id}/favorites` - Get user favorites

**Features:**
- Heart icon toggle for books
- Favorites list page
- Add/remove from favorites
- Favorites count display
- Bulk actions (future enhancement)

---

## 🎨 **Global Features**

### **Navigation & Layout**
- Responsive top navigation
- Mobile hamburger menu
- Breadcrumb navigation
- Footer with links

### **Authentication & Security**
- JWT token management
- Protected route handling
- Auto-logout on token expiry
- Secure API calls with interceptors

### **User Experience**
- Loading spinners
- Error toasts and notifications
- Empty state components
- Pagination controls
- Form validation
- Responsive design

### **Performance**
- Lazy loading for images
- Pagination for large lists
- Debounced search
- Optimistic UI updates

---

## 🔧 **Technical Implementation Notes**

### **API Response Format**
All endpoints return consistent format:
```json
{
  "success": boolean,
  "message": "string",
  "data": object | array
}
```

### **Authentication**
- Bearer token in Authorization header
- JWT stored in localStorage
- Auto-refresh token (future enhancement)

### **Error Handling**
- HTTP status code handling
- User-friendly error messages
- Retry mechanisms for failed requests
- Offline state handling

### **Data Management**
- React Context for global state
- Local state for component-specific data
- Optimistic updates for better UX
- Cache management for API responses

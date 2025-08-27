# Frontend Tasks by Page (MVP)

## Global/App Shell
- Set up routing with protected/public routes
- Implement top navigation with links: Books, Recommendations, Profile, Login/Signup/Logout
- Configure auth context/provider with JWT in localStorage and axios interceptors
- Global UI states: loading spinner, error toasts, empty states
- Responsive layout and base Tailwind styles
- Jest, React Testing Library

## Auth Pages
- Login page
  - Email/password form with validation
  - Submit to login API; persist JWT; redirect to Books
  - Error handling and inline messages
- Signup page
  - Name/email/password form with validation
  - Submit to signup API; success redirect to Login
  - Error handling (duplicate email, weak password)
- Logout action
  - Clear token/state; redirect to home

## Books Listing Page
- Grid/list view toggle
- Search bar (title, author, genre)
- Filter dropdowns (genre, rating, year)
- Sort options (title, author, rating, date)
- Pagination or infinite scroll
- Book cards with cover, title, author, rating
- Loading states and empty states
- Responsive design (mobile-friendly)

## Book Details Page
- Book information display (cover, title, author, description, etc.)
- Average rating display with star visualization
- User's personal rating (if logged in)
- Review form (rating + text) for authenticated users
- Reviews list with pagination
- Review actions (edit/delete for own reviews)
- Loading states and error handling

## User Profile Page
- User information display
- Review history with pagination
- Favorite books list
- Profile editing form (name, email, password)
- Account deletion option
- Loading states and form validation

## Recommendations Page
- Personalized book recommendations grid
- Recommendation categories (based on genre, similar users, etc.)
- "Not interested" action for recommendations
- Refresh recommendations button
- Loading states and empty states
- Fallback to popular books if no recommendations

## Home/Landing Page
- Hero section with app description
- Featured books carousel
- Recent reviews section
- Call-to-action buttons (Browse Books, Sign Up)
- Responsive design for all screen sizes

## Global Components
- LoadingSpinner (reusable)
- ErrorBoundary for error handling
- Toast notifications for user feedback
- Modal components for confirmations
- Form components with validation
- Pagination component
- Search component
- Filter/Sort components

## Testing Tasks
- Unit tests for all components
- Integration tests for auth flow
- E2E tests for critical user journeys
- Mock API responses for testing
- Test coverage reporting

## Styling & UX
- Consistent design system with Tailwind
- Dark/light mode toggle (optional)
- Accessibility compliance (ARIA labels, keyboard navigation)
- Mobile-first responsive design
- Smooth transitions and animations
- Error states and empty states
- Loading skeletons for better UX

## Performance & Optimization
- Code splitting for routes
- Lazy loading for images
- Memoization for expensive components
- Bundle size optimization
- Caching strategies for API responses

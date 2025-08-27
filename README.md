# BookVerse - Book Review Platform

A modern, responsive web application for discovering books, sharing reviews, and getting personalized recommendations.

## Features

- **User Authentication**: Secure JWT-based authentication with protected routes
- **Book Discovery**: Browse and search through a curated collection of books
- **Reviews & Ratings**: Create, edit, and delete book reviews with 1-5 star ratings
- **User Profiles**: View your review history and manage favorite books
- **AI Recommendations**: Get personalized book recommendations based on your preferences
- **Responsive Design**: Mobile-first design that works on all devices

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **State Management**: React Context API
- **Testing**: Jest, React Testing Library
- **UI Components**: Custom components with Tailwind CSS
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bookmark-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── __tests__/      # Component tests
│   ├── Navigation.jsx  # Top navigation bar
│   ├── ProtectedRoute.jsx # Route protection
│   ├── LoadingSpinner.jsx # Loading indicator
│   └── EmptyState.jsx  # Empty state component
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components (to be created)
├── utils/              # Utility functions (to be created)
├── App.jsx            # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles
```

## Authentication

The app uses JWT tokens stored in localStorage for authentication. The `AuthContext` provides:

- User login/signup/logout functionality
- Automatic token management
- Protected route handling
- Axios interceptors for API calls

## API Integration

The app is configured to proxy API calls to `http://localhost:8080` (Spring Boot backend). All API calls are prefixed with `/api`.

## Testing

Tests are written using Jest and React Testing Library. Run tests with:

```bash
npm test
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License.

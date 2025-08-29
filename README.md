# Book Review UI

A React-based frontend application for the Book Review system.

## Features

- **Authentication Required**: All features require user login
- **User Management**: Login, Signup, and Logout functionality
- **Home Page**: Recent community reviews (authenticated users only)
- **Books Listing**: Search, filter, and browse books with pagination
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend server running (default: http://localhost:8080)
- User account (signup required to access any features)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8080
```

**Available Environment Variables:**
- `VITE_API_BASE_URL`: Backend API base URL (default: http://localhost:8080)

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at http://localhost:3000

### Building for Production

```bash
npm run build
npm run preview
```

### Testing

```bash
npm run test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── config/             # Configuration files
└── index.css           # Global styles
```

## API Integration

The application uses centralized API configuration in `src/config/api.js`. All API endpoints are defined there and can be configured via environment variables.

### Available Endpoints

- `GET /api/books` - List books with search and filters
- `GET /api/home/recent-reviews` - Recent community reviews
- `POST /api/auth/login` - User authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - User profile

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Jest + React Testing Library** - Testing framework

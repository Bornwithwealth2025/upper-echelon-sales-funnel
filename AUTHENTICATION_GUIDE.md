# JWT Authentication Implementation Guide

## Overview
Complete JWT and cookie-based authentication system has been implemented for the Lead Collector application. The system includes admin login with JWT tokens, secure cookie handling, and React Context for state management.

## Backend Implementation

### 1. **New Dependencies Added**
- `jsonwebtoken` - JWT token generation and verification
- `bcryptjs` - Password hashing
- `cookie-parser` - Cookie handling middleware

### 2. **Database Changes** (`database.sql`)
- Added `users` table with columns:
  - `id` (Primary Key)
  - `email` (Unique)
  - `password` (hashed)
  - `role` (admin/user)
  - `createdAt`, `updatedAt` (timestamps)
- Pre-inserted admin user:
  - Email: `admin@bww.com`
  - Password: `@Bwithweath__001` (pre-hashed with bcryptjs)

### 3. **New Backend Files Created**

#### `src/models/User.ts`
TypeScript interfaces and validators for:
- `User` - User model interface
- `UserLoginPayload` - Login request payload
- `UserResponse` - Safe user response without password
- `JwtPayload` - JWT token payload
- `UserValidator` - Input validation class

#### `src/repositories/UserRepository.ts`
Database repository implementing:
- `save(user)` - Create new user
- `findByEmail(email)` - Find user by email
- `findById(id)` - Find user by ID
- `update(id, user)` - Update user fields

#### `src/services/AuthService.ts`
Authentication business logic:
- `login(email, password)` - Authenticate user and generate JWT
- `generateToken(user)` - Create JWT token
- `verifyToken(token)` - Validate JWT token
- `getUserById(id)` - Retrieve user info

#### `src/controllers/AuthController.ts`
HTTP endpoint handlers:
- `POST /auth/login` - User login endpoint
- `POST /auth/logout` - Clear auth cookie
- `GET /auth/me` - Get current authenticated user

#### `src/middleware/authMiddleware.ts`
Middleware for request protection:
- `authenticateToken()` - Verify JWT from cookie or Authorization header
- `authorizeRole(roles)` - Role-based access control

### 4. **Updated Backend Files**

#### `src/app.ts`
- Added cookie-parser middleware
- Imported auth services and controllers
- Configured CORS with credentials support
- Added auth routes to `/api/v1/auth/*`

#### `backend/.env`
Added configuration:
```
JWT_SECRET=your-secret-key-change-in-production-12345
JWT_EXPIRATION=24h
FRONTEND_URL=http://localhost:5173
```

## Frontend Implementation

### 1. **New Frontend Files Created**

#### `src/contexts/AuthContext.tsx`
React Context for authentication state management:
- `AuthContextType` - Type definition for auth context
- `AuthProvider` - Context provider component
- `useAuth()` - Custom hook for consuming auth context
- Features:
  - Manages user info and token
  - Auto-checks authentication on mount
  - Handles login/logout
  - Loading states

#### `src/pages/LoginPage.tsx`
Admin login page component:
- Email/password input fields
- Password visibility toggle
- Error message display
- Loading states
- Displays demo credentials for testing
- Styled with Tailwind CSS

#### `src/components/ProtectedRoute.tsx`
Route protection component:
- Redirects unauthenticated users to login
- Shows loading spinner while checking auth
- Protects dashboard and other admin routes

### 2. **Updated Frontend Files**

#### `src/App.tsx`
- Wrapped with `AuthProvider` for global auth state
- Added `/login` route for LoginPage
- Protected `/dashboard` route with `ProtectedRoute`
- Updated routing structure

#### `src/services/api.ts`
- Added auth endpoints:
  - `login(email, password)` 
  - `logout()`
  - `getCurrentUser()`
- Enabled credentials in API client for cookie handling
- Maintains existing lead API methods

#### `src/pages/DashboardPage.tsx`
- Added user info display (email and role badge)
- Added logout button
- Integrated `useAuth` hook
- Shows authenticated user context

#### `frontend/.env`
Pre-configured API URL:
```
VITE_API_URL=http://localhost:4050/api/v1
```

## Authentication Flow

### Login Flow
1. User enters email/password on Login page
2. Frontend sends POST request to `/auth/login`
3. Backend verifies credentials against hashed password
4. On success:
   - JWT token generated with 24-hour expiration
   - Token set in httpOnly cookie (secure, sameSite)
   - User info returned to frontend
5. AuthContext updates and stores user state
6. User redirected to dashboard

### Protected Routes
1. When accessing `/dashboard`, ProtectedRoute checks `isAuthenticated`
2. If not authenticated, redirects to `/login`
3. Auth check uses `/auth/me` endpoint which verifies token from cookie

### Logout Flow
1. User clicks logout button
2. POST request sent to `/auth/logout`
3. Server clears authToken cookie
4. Frontend clears auth context
5. User redirected to login page

## API Endpoints

### Authentication Endpoints
```
POST /api/v1/auth/login
- Body: { email: string, password: string }
- Response: { user: User, token: string }

POST /api/v1/auth/logout
- Response: { success: boolean }

GET /api/v1/auth/me (Protected)
- Response: { user: User }
```

## Security Features

1. **Password Hashing** - bcryptjs with salt rounds
2. **JWT Tokens** - Signed with secret, 24-hour expiration
3. **HttpOnly Cookies** - Prevents XSS attacks
4. **Secure Flag** - Cookie sent only over HTTPS in production
5. **SameSite Policy** - CSRF protection
6. **CORS Configuration** - Credentials-enabled cross-origin requests
7. **Input Validation** - Email and password validation in AuthService

## Admin Credentials

```
Email: admin@bww.com
Password: @Bwithweath__001
```

## Running the Application

### Backend Setup
1. Install dependencies: `npm install`
2. Update `.env` with database credentials
3. Run database migrations: `mysql < database.sql`
4. Start server: `npm run dev`

### Frontend Setup
1. Install dependencies: `npm install`
2. Ensure `.env` has correct API_URL
3. Start dev server: `npm run dev`
4. Navigate to http://localhost:5173
5. Click "Login" or navigate to `/login`

## Testing Authentication

1. Go to http://localhost:5173/login
2. Enter credentials:
   - Email: `admin@bww.com`
   - Password: `@Bwithweath__001`
3. Click Login
4. Should redirect to dashboard
5. Dashboard shows user email and admin role
6. Logout button clears authentication

## Environment Configuration

### Backend (.env)
- `JWT_SECRET` - Change to strong random string in production
- `JWT_EXPIRATION` - Token lifetime (default: 24h)
- `FRONTEND_URL` - CORS allowed origin
- All other existing config variables

### Frontend (.env)
- `VITE_API_URL` - Backend API base URL

## Future Enhancements

Possible additions:
- Refresh token rotation
- Multi-user roles (user, admin, manager)
- Email verification for registration
- Password reset functionality
- Rate limiting on login attempts
- Session management with Redis
- OAuth/Google Sign-In integration
- Two-factor authentication

## File Structure

```
backend/
├── src/
│   ├── models/
│   │   └── User.ts (NEW)
│   ├── repositories/
│   │   └── UserRepository.ts (NEW)
│   ├── services/
│   │   └── AuthService.ts (NEW)
│   ├── controllers/
│   │   └── AuthController.ts (NEW)
│   ├── middleware/
│   │   └── authMiddleware.ts (NEW)
│   └── app.ts (UPDATED)
├── database.sql (UPDATED)
├── package.json (UPDATED)
└── .env (UPDATED)

frontend/
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx (NEW)
│   ├── components/
│   │   └── ProtectedRoute.tsx (NEW)
│   ├── pages/
│   │   ├── LoginPage.tsx (NEW)
│   │   └── DashboardPage.tsx (UPDATED)
│   ├── services/
│   │   └── api.ts (UPDATED)
│   └── App.tsx (UPDATED)
└── .env (EXISTING)
```

## Troubleshooting

### Issue: Login button doesn't work
- Check backend is running on port 4050
- Verify API_URL in frontend .env
- Check browser console for CORS errors

### Issue: Token not found after login
- Verify cookie-parser middleware is loaded
- Check cookie settings (httpOnly, sameSite)
- Ensure credentials are sent: withCredentials: true

### Issue: User not loading on dashboard
- Verify /auth/me endpoint is returning user data
- Check JWT_SECRET matches between login and verify
- Check token hasn't expired (24 hours)

### Issue: Database errors
- Ensure MySQL server is running
- Verify database credentials in .env
- Run: `mysql < database.sql` to setup tables
- Check user table exists: `SHOW TABLES;`

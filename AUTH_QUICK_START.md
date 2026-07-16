# JWT Authentication - Quick Start Guide

## System Setup & Testing

### Prerequisites
- Node.js (v14+)
- MySQL (v5.7+)
- npm or yarn

### Quick Start (5 minutes)

#### Step 1: Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create database and load schema
mysql -u root -p < database.sql

# Start development server
npm run dev
```
Backend will run on: `http://localhost:4050`

#### Step 2: Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend will run on: `http://localhost:5173`

### Step 3: Test Login
1. Open http://localhost:5173 in your browser
2. Click on "Login" link or navigate to `/login`
3. Use test credentials:
   - **Email:** `admin@bww.com`
   - **Password:** `@Bwithweath__001`
4. You should be redirected to the dashboard
5. Dashboard shows:
   - Current user email
   - User role badge (ADMIN)
   - Logout button
   - Lead management interface

## Feature Checklist

- ✅ JWT token generation on login
- ✅ Cookie-based token storage (httpOnly, secure)
- ✅ Protected routes with React Router
- ✅ Auth Context for global state management
- ✅ Automatic auth check on app load
- ✅ User role display (Admin)
- ✅ Logout functionality
- ✅ Login form validation
- ✅ Error handling and display
- ✅ Loading states
- ✅ Password hashing with bcryptjs
- ✅ Token expiration (24 hours)

## API Testing

### Test Login Endpoint
```bash
curl -X POST http://localhost:4050/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bww.com","password":"@Bwithweath__001"}' \
  -c cookies.txt
```

### Test Protected Endpoint
```bash
curl http://localhost:4050/api/v1/auth/me \
  -b cookies.txt
```

### Test Logout
```bash
curl -X POST http://localhost:4050/api/v1/auth/logout \
  -b cookies.txt \
  -c cookies.txt
```

## Database Verification

Check if admin user was created:
```bash
mysql -u root -p lead_collector
SELECT * FROM users;
```

Expected output:
```
id | email           | password                                              | role
1  | admin@bww.com   | $2a$10$aLPKMAq3h0qWN.7q6a0xSOyYPZlZQRGjkIxD3YIKOLMqpdExR2jDa | admin
```

## Frontend Routes

| Route | Authentication | Purpose |
|-------|---|---------|
| `/` | Public | Landing page |
| `/login` | Public | Login page |
| `/collect` | Public | Lead collection form |
| `/dashboard` | Protected | Admin dashboard |

## Environment Variables

### Backend (.env)
```
JWT_SECRET=your-secret-key-change-in-production-12345
JWT_EXPIRATION=24h
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:4050/api/v1
```

## Troubleshooting

### 1. "Cannot find module 'jsonwebtoken'"
```bash
cd backend
npm install
```

### 2. "Database connection failed"
- Verify MySQL is running
- Check credentials in `.env`
- Ensure database created: `mysql < database.sql`

### 3. "CORS error when logging in"
- Check `FRONTEND_URL` in backend `.env`
- Ensure `withCredentials: true` in API client
- Verify cookie-parser middleware is loaded

### 4. "Login button doesn't work"
- Open browser DevTools (F12)
- Check Network tab for failed requests
- Check Console for errors
- Verify API URL in frontend `.env`

### 5. "Token expires immediately"
- Check `JWT_EXPIRATION` in backend `.env`
- Should be "24h" or similar
- Verify server time is correct

## Production Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to strong random string
- [ ] Set `NODE_ENV=production` in backend
- [ ] Enable SSL/HTTPS certificates
- [ ] Set `secure: true` for cookies
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Use environment-specific configs
- [ ] Enable CORS only for allowed origins
- [ ] Add rate limiting to login endpoint
- [ ] Implement password strength requirements
- [ ] Add email verification for new users
- [ ] Setup backup for database
- [ ] Monitor auth logs and failed attempts
- [ ] Consider adding 2FA

## Additional Features to Add

1. **User Registration**
   - Create registration endpoint
   - Email verification

2. **Password Reset**
   - Email-based password reset
   - Token expiration for reset links

3. **Session Management**
   - Track active sessions
   - Session revocation

4. **Audit Logging**
   - Log login attempts
   - Track user actions

5. **Role-Based Access Control (RBAC)**
   - Implement different user roles
   - Protect endpoints with role checks

## Support

For issues or questions:
1. Check the AUTHENTICATION_GUIDE.md for detailed documentation
2. Review error messages in console
3. Check backend logs
4. Verify all environment variables are set correctly

## Performance Notes

- Tokens are verified on each protected route
- Database queries optimized with indexes
- Bcryptjs hashing with 10 salt rounds (default)
- Cookies stored in browser automatically
- No session database needed with JWT (stateless)

## Security Notes

- Passwords never logged or transmitted in plain text
- JWTs signed with secret key
- HttpOnly cookies prevent JavaScript access
- CORS configured to prevent cross-origin attacks
- Input validation prevents SQL injection
- Rate limiting protects login endpoint

Enjoy your secure authentication system! 🎉

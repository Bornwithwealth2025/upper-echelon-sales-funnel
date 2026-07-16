# Lead Collector Application - Complete Setup Guide

This document provides step-by-step instructions to set up and run the complete Lead Collector application.

## Project Overview

The Lead Collector Application is a full-stack web application for managing business leads efficiently. It consists of:

- **Frontend**: React + TypeScript + Tailwind CSS (Vite)
- **Backend**: Node.js + Express + TypeScript + MySQL

## Prerequisites

Before you start, ensure you have the following installed:

1. **Node.js** (16 or higher)
   - Download from: https://nodejs.org/

2. **MySQL** (8.0 or higher)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use MySQL via Docker, XAMPP, or other package managers

3. **Git** (optional, but recommended)

## Project Structure

```
lead-page/
├── backend/              # Node.js Express API
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   ├── database.sql      # SQL schema
│   └── README.md
├── frontend/             # React + TypeScript frontend
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── README.md
└── prompt.md            # This file
```

## Setup Instructions

### Step 1: Backend Setup

#### 1.1 Navigate to backend directory
```bash
cd backend
```

#### 1.2 Install dependencies
```bash
npm install
```

#### 1.3 Create MySQL database
```bash
# Open MySQL CLI
mysql -u root -p

# Run the schema
source database.sql;

# Exit MySQL
exit;
```

Alternatively, if you prefer to set up manually:
```sql
CREATE DATABASE IF NOT EXISTS lead_collector;
USE lead_collector;

CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phoneNumber VARCHAR(20) NOT NULL,
  additionalInfo TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### 1.4 Configure environment variables
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your MySQL credentials
```

**.env configuration:**
```
PORT=4050
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lead_collector
DB_PORT=3306

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### 1.5 Start the backend server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server should start on `http://localhost:4050`

### Step 2: Frontend Setup

#### 2.1 Open a new terminal and navigate to frontend
```bash
cd frontend
```

#### 2.2 Install dependencies
```bash
npm install
```

#### 2.3 Verify environment configuration

The `.env` file should already have:
```
VITE_API_URL=http://localhost:4050/api/v1
```

Update if your backend is running on a different URL.

#### 2.4 Start the frontend development server
```bash
npm run dev
```

The application should automatically open at `http://localhost:3000`

## Application Architecture

### Backend Architecture (SOLID Principles)

The backend follows clean architecture with clear separation of concerns:

```
src/
├── database/          # Database connection & pooling
├── models/            # Data models & validators
├── repositories/      # Data access layer (Repository pattern)
├── services/          # Business logic layer
├── controllers/       # Request handlers
├── middleware/        # Express middleware (error handling, etc.)
├── app.ts             # Express app factory
└── index.ts           # Entry point with configuration
```

**Key Features:**
- **Repository Pattern**: Abstraction for data access
- **Service Layer**: Business logic separation
- **Dependency Injection**: Dependencies passed to constructors
- **Error Handling**: Centralized error middleware
- **Rate Limiting**: Protect API from abuse
- **CORS & Helmet**: Security headers and cross-origin support

### Frontend Architecture

```
src/
├── pages/             # Route components
│   ├── LandingPage.tsx
│   ├── CollectLeadPage.tsx
│   └── DashboardPage.tsx
├── services/
│   └── api.ts         # API communication with axios
├── App.tsx            # Router setup
├── main.tsx           # React entry point
└── index.css          # Tailwind styles
```

**Key Features:**
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Full type safety
- **Vite**: Fast development and build

## API Endpoints

### Health Check
```
GET /health
```

### Lead Management

**Create Lead**
```
POST /api/v1/save-led
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+1234567890",
  "additionalInfo": "Optional notes"
}
```

**Get All Leads**
```
GET /api/v1/get-led
```

**Get Lead by ID**
```
GET /api/v1/get-led/:id
```

**Update Lead**
```
PUT /api/v1/update-led/:id
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+1234567890",
  "additionalInfo": "Updated notes"
}
```

**Delete Lead**
```
DELETE /api/v1/delete-led/:id
```

## Frontend Pages

### 1. Landing Page (/)
- Application description
- Feature highlights
- Call-to-action buttons
- How the application works

### 2. Lead Collection Page (/collect)
- Form to collect lead information
- Required fields: Full Name, Email, Phone Number
- Optional field: Additional Information
- Form validation
- Success/error feedback

### 3. Dashboard Page (/dashboard)
- List all collected leads in a table
- View lead details
- Delete leads with confirmation
- Export leads to CSV
- Display statistics

## Troubleshooting

### Backend Issues

**Port 4050 already in use:**
```bash
# Kill the process using port 4050 (Windows)
netstat -ano | findstr :4050
taskkill /PID <PID> /F

# Or change PORT in .env and restart
```

**MySQL connection error:**
- Verify MySQL is running
- Check DB credentials in `.env`
- Ensure database `lead_collector` exists

**TypeScript compilation errors:**
```bash
npm run build
# Check for type errors
```

### Frontend Issues

**Port 3000 already in use:**
- Edit `vite.config.ts` and change the port
- Or kill the process using port 3000

**API not responding:**
- Verify backend is running on port 4050
- Check `VITE_API_URL` in `.env`
- Check browser console for CORS errors

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm run build
```

## Deployment

### Backend Deployment

1. Build the project:
```bash
npm run build
```

2. Set environment variables on production server

3. Install production dependencies:
```bash
npm install --only=production
```

4. Start the server:
```bash
npm start
```

### Frontend Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist/` folder to a static hosting service (Netlify, Vercel, AWS S3, etc.)

3. Update `VITE_API_URL` environment variable to point to production backend

## Testing

### Backend Testing
```bash
npm test
```

### Frontend Testing
```bash
npm test
```

## Performance Optimization

### Backend
- Database indexes on frequently queried columns
- Connection pooling
- Rate limiting to prevent abuse

### Frontend
- Code splitting with Vite
- Lazy loading of routes
- Optimized images
- CSS bundling with Tailwind

## Security Features

- **Helmet**: Secure HTTP headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: Prevent brute force attacks
- **Input Validation**: Both frontend and backend validation
- **TypeScript**: Type safety prevents runtime errors

## Environment Variables Reference

### Backend (.env)
- `PORT`: Server port (default: 4050)
- `NODE_ENV`: Environment (development/production)
- `DB_HOST`: MySQL host
- `DB_USER`: MySQL username
- `DB_PASSWORD`: MySQL password
- `DB_NAME`: Database name
- `DB_PORT`: MySQL port
- `RATE_LIMIT_WINDOW_MS`: Rate limit window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window

### Frontend (.env)
- `VITE_API_URL`: Backend API URL

## Next Steps

1. Start the backend server
2. Start the frontend development server
3. Open http://localhost:3000 in your browser
4. Test the application by:
   - Visiting the landing page
   - Collecting some leads
   - Viewing them in the dashboard
   - Exporting to CSV

## Additional Resources

- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [MySQL Documentation](https://dev.mysql.com/doc)

## Support

For issues or questions, refer to the README files in the backend/ and frontend/ directories.

---

**Last Updated**: February 18, 2026

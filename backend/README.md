# Lead Collector API

A RESTful API for the Lead Collector application built with Node.js, Express, and TypeScript.

## Features

- Rate limiting and security headers with Helmet
- CORS support
- MySQL database integration
- RESTful API endpoints for lead management
- Email campaign system with background job processing
- SOLID principles and clean architecture
- Configuration-based setup for testability

## Prerequisites

- Node.js 16+
- MySQL 8.0+
- Redis 6.0+ (for email queue processing)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Redis (required for email queue):
```bash
# On Windows with Chocolatey:
choco install redis-64

# On macOS with Homebrew:
brew install redis

# On Linux:
sudo apt-get install redis-server

# Or use Docker:
docker run -d -p 6379:6379 redis:latest
```

3. Start Redis server:
```bash
redis-server
```

4. Set up environment variables:
```bash
cp .env.example .env
```

5. Update `.env` with your configuration:
```
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=lead_collector

EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@leadcollector.com

REDIS_HOST=localhost
REDIS_PORT=6379
```

6. Create the database and tables:
```bash
mysql -u root -p < database.sql
```

## Running the Application

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Check API health status

### Lead Management
- `POST /api/v1/save-led` - Create a new lead
- `GET /api/v1/get-led` - Get all leads
- `GET /api/v1/get-led/:id` - Get a specific lead
- `PUT /api/v1/update-led/:id` - Update a lead
- `DELETE /api/v1/delete-led/:id` - Delete a lead

### Email Campaign Management
- `POST /api/v1/email/send-promo-all` - Send promotional email to all leads
- `POST /api/v1/email/send-promo` - Send promotional email to a specific lead
- `GET /api/v1/email/queue-status` - Get email queue status

## Save Lead Example

```bash
curl -X POST http://localhost:4050/api/v1/save-led \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "additionalInfo": "Interested in premium plan"
  }'
```

## Email Campaign Examples

### Send Promo to All Leads
```bash
curl -X POST http://localhost:4050/api/v1/email/send-promo-all \
  -H "Content-Type: application/json" \
  -d '{
    "promoTitle": "Special Offer - 50% Off!",
    "promoDescription": "Get exclusive access to our premium features at 50% discount for the first 3 months. Limited time offer!"
  }'
```

### Send Promo to Single Lead
```bash
curl -X POST http://localhost:4050/api/v1/email/send-promo \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": 1,
    "promoTitle": "Special Offer - 50% Off!",
    "promoDescription": "Get exclusive access to our premium features at 50% discount for the first 3 months."
  }'
```

### Check Email Queue Status
```bash
curl http://localhost:4050/api/v1/email/queue-status
```

## Architecture

The application follows SOLID principles and clean architecture:

- `database/` - Database connection management
- `models/` - Data models and validation
- `repositories/` - Data access layer
- `services/` - Business logic
  - `LeadService` - Lead management business logic
  - `EmailService` - Email sending via Nodemailer
  - `EmailQueue` - Background job queue for email processing using Bull/Redis
- `controllers/` - Request handlers
  - `LeadController` - Lead API endpoints
  - `EmailController` - Email campaign endpoints
- `middleware/` - Express middleware
- `utils/` - Utility functions
  - `EmailTemplates` - Reusable email templates
- `app.ts` - Application factory

## Email System Architecture

The email system uses a robust background job processing approach:

1. **Email Service (Nodemailer)**: Handles actual email sending via configured SMTP service
2. **Email Queue (Bull/Redis)**: Manages asynchronous job processing with:
   - Automatic retries (up to 3 times by default)
   - Exponential backoff for failed jobs
   - Job persistence in Redis
   - Batch processing support
3. **Email Controller**: REST API endpoints for triggering email campaigns

### Benefits:
- Non-blocking email sending (returns immediately)
- Automatic retry mechanism for failed emails
- Scalable - can handle thousands of emails
- Battle-tested queue system with Bull
- Job monitoring and statistics

## Environment Variables

```
PORT=4050 - Server port
NODE_ENV=development - Environment
DB_HOST=localhost - Database host
DB_USER=root - Database user
DB_PASSWORD= - Database password
DB_NAME=lead_collector - Database name
DB_PORT=3306 - Database port
RATE_LIMIT_WINDOW_MS=900000 - Rate limit window (15 minutes)
RATE_LIMIT_MAX_REQUESTS=100 - Max requests per window

# Email Configuration
EMAIL_SERVICE=gmail - Email service provider
EMAIL_USER=your-email@gmail.com - Email account username
EMAIL_PASSWORD=your-app-password - Email account password/app password
EMAIL_FROM=noreply@leadcollector.com - Sender email address
EMAIL_FROM_NAME=Lead Collector - Sender display name

# Redis Configuration
REDIS_HOST=localhost - Redis host
REDIS_PORT=6379 - Redis port
REDIS_PASSWORD= - Redis password (if required)

# Email Batch Settings
EMAIL_BATCH_SIZE=100 - Number of emails per batch
EMAIL_BATCH_DELAY_MS=5000 - Delay between batches in milliseconds
MAX_EMAIL_RETRIES=3 - Maximum retry attempts for failed emails
```

## Email Configuration Setup

### Gmail Configuration

To use Gmail with this application, follow these steps:

1. **Enable 2-Factor Authentication** in your Google Account
2. **Generate App Password**:
   - Visit: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your platform)
   - Google will generate a 16-character password
3. **Update .env**:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```

### Other Email Providers

Nodemailer supports many services. Common examples:

```
EMAIL_SERVICE=outlook
EMAIL_SERVICE=yahoo
EMAIL_SERVICE=aol
```

Or use custom SMTP:
```
EMAIL_SERVICE=custom-smtp
SMTP_HOST=smtp.example.com
SMTP_PORT=587
```

## Testing

```bash
npm test
```

## Troubleshooting

### Redis Connection Error
- Ensure Redis is running: `redis-server`
- Check REDIS_HOST and REDIS_PORT in .env
- On Windows, Redis might need to be started as a service

### Email Not Sending
- Verify EMAIL_USER and EMAIL_PASSWORD in .env
- Check email provider allows app connections
- Review server logs for specific error messages
- For Gmail, ensure app-specific password is used (not your regular password)

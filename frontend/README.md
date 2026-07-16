# Lead Collector Frontend

A modern React and TypeScript application for collecting and managing leads with a beautiful Tailwind CSS UI.

## Features

- 🎨 Beautiful and responsive UI with Tailwind CSS
- 📝 Easy lead collection form
- 📊 Dashboard with lead management
- 📥 Export leads to CSV
- ⚡ Fast development with Vite
- 🔒 Type-safe with TypeScript

## Prerequisites

- Node.js 16+
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
# Create .env file from template
cp .env.example .env
```

3. Update `.env` with your API endpoint (if different from default):
```
VITE_API_URL=http://localhost:4050/api/v1
```

## Running the Application

### Development mode:
```bash
npm run dev
```

The application will automatically open in your browser at `http://localhost:3000`

### Production build:
```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── pages/
│   ├── LandingPage.tsx      # Landing/home page
│   ├── CollectLeadPage.tsx  # Lead collection form
│   └── DashboardPage.tsx    # Leads list and management
├── services/
│   └── api.ts               # API communication service
├── App.tsx                  # Main app component with routing
├── main.tsx                 # Entry point
└── index.css                # Tailwind CSS styles
```

## Pages

### 1. Landing Page (/)
- Showcases the Lead Collector application
- Features section explaining key benefits
- Call-to-action buttons to start collecting leads
- Overall application information

### 2. Lead Collection Page (/collect)
- Form to collect user details
- Required fields: Full Name, Email, Phone Number
- Optional field: Additional Information
- Form validation on the frontend
- Success/error feedback

### 3. Dashboard Page (/dashboard)
- Display all collected leads in a data table
- Sort and view lead information
- Delete leads functionality
- Export leads to CSV format
- Statistics about collected leads

## API Integration

The frontend communicates with the backend API at `http://localhost:4050/api/v1` by default.

### API Endpoints Used:

- `POST /api/v1/save-led` - Save a new lead
- `GET /api/v1/get-led` - Get all leads
- `PUT /api/v1/update-led/:id` - Update a lead
- `DELETE /api/v1/delete-led/:id` - Delete a lead

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory ready for deployment.

## Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **Axios** - HTTP client

## Environment Variables

```
VITE_API_URL - Backend API URL (default: http://localhost:4050/api/v1)
```

## Contributing

Feel free to submit issues and enhance this project.

## License

MIT

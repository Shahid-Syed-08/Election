# Election Monitoring Backend Structure

## 📁 File Structure
```
backend programs/
├── server.js                 # Main server entry point
├── Package.json             # Dependencies and scripts
├── database.js              # JSON-based database layer
├── auth.js                  # JWT authentication middleware
├── errorHandler.js          # Global error handling
├── User.js                  # User model and operations
├── Incident.js              # Incident model and operations
├── PollingStation.js        # Polling station model
├── ElectionData.js          # Election data model
└── API Routes/
    ├── auth.js              # Authentication endpoints
    ├── dashboard.js         # Dashboard data endpoints
    └── incidents.js         # Incident management endpoints
```

## 🔧 Core Components

### 1. server.js (Main Entry Point)
- **Port**: 3000 (configurable via PORT env var)
- **Security**: Helmet.js, Rate limiting, CORS
- **Middleware**: JSON parsing, logging, static files
- **Routes**: API endpoints and frontend serving
- **Logging**: Request logging with timestamps

### 2. database.js (Data Layer)
- **Storage**: JSON file-based database
- **Collections**: users, incidents, pollingStations, electionData
- **Features**: CRUD operations, data validation
- **Initialization**: Creates default admin user and sample data

### 3. auth.js (Authentication)
- **JWT**: Token-based authentication
- **Middleware**: authenticateToken, requireRole
- **Security**: Password hashing with bcrypt
- **Token**: 24-hour expiration

### 4. Models (Data Models)
- **User.js**: User management, password verification, role-based access
- **Incident.js**: Incident CRUD, statistics, filtering
- **PollingStation.js**: Station management, voter counts, state stats
- **ElectionData.js**: National and state-level election data

### 5. API Routes
- **auth.js**: POST /login - User authentication
- **dashboard.js**: GET / - Dashboard statistics (protected)
- **incidents.js**: CRUD operations for incidents (protected)

## 🚀 Startup Process
1. Initialize database with default data
2. Create admin user (admin@eci.gov.in / admin123)
3. Generate 2,800 polling stations across 28 states
4. Initialize election data for all states
5. Start Express server on port 3000
6. Enable security middleware
7. Mount API routes
8. Serve frontend static files

## 📊 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `POST /api/auth/login` - User login

### Protected Endpoints (require JWT token)
- `GET /api/dashboard` - Dashboard statistics
- `GET /api/incidents` - List all incidents
- `POST /api/incidents` - Create new incident
- `PUT /api/incidents/:id` - Update incident

## 🔒 Security Features
- **Helmet.js**: Security headers
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend origins
- **JWT**: Token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Request body validation

## 📝 Logging
- **Request Logs**: Method, path, timestamp
- **Error Logs**: Detailed error information
- **Authentication Logs**: Login attempts, token validation
- **Database Logs**: CRUD operations, data initialization

## 🗄️ Database Schema

### Users Collection
```json
{
  "id": 1,
  "username": "admin",
  "password": "hashed_password",
  "email": "admin@eci.gov.in",
  "role": "admin",
  "name": "System Administrator",
  "phone": "+911234567890",
  "state": "National",
  "createdAt": "2024-12-19T10:30:00.000Z",
  "lastLogin": "2024-12-19T10:30:10.000Z"
}
```

### Incidents Collection
```json
{
  "id": 1,
  "type": "voting_machine_issue",
  "priority": "high",
  "state": "Maharashtra",
  "district": "Mumbai",
  "pollingStation": "PS-MAH-001",
  "description": "Voting machine malfunction",
  "status": "pending",
  "reportedBy": "admin",
  "createdAt": "2024-12-19T10:30:20.000Z",
  "updatedAt": "2024-12-19T10:30:20.000Z"
}
```

### Polling Stations Collection
```json
{
  "id": 1,
  "code": "PS-MAH-001",
  "name": "Polling Station 1",
  "state": "Maharashtra",
  "district": "Mumbai District 1",
  "location": {
    "latitude": 25.123,
    "longitude": 75.456
  },
  "totalVoters": 1200,
  "currentVoters": 450,
  "status": "active",
  "lastUpdated": "2024-12-19T10:30:00.000Z"
}
```

## 🎯 Key Features
- **Real-time Monitoring**: Live election data updates
- **Incident Management**: Report and track election incidents
- **Role-based Access**: Admin, observer, and state-level roles
- **Geographic Data**: Polling station locations and state-wise data
- **Statistics**: Comprehensive dashboard with real-time stats
- **Security**: Multi-layered security implementation
- **Scalability**: JSON-based storage for easy deployment

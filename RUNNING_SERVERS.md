# 🚀 Election Monitoring System - Running Servers

## ✅ **Both Servers Are Now Running!**

### 🔧 **Backend Server (Node.js/Express)**
- **Status**: ✅ Running
- **Port**: 3000
- **URL**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health
- **API Endpoints**: 
  - `POST /api/auth/login` - User authentication
  - `GET /api/dashboard` - Dashboard data (requires auth)
  - `GET /api/incidents` - List incidents (requires auth)
  - `POST /api/incidents` - Create incident (requires auth)

### 🌐 **Frontend Server (Node.js HTTP Server)**
- **Status**: ✅ Running
- **Port**: 5000
- **URL**: http://localhost:5000
- **Main Page**: http://localhost:5000/index.html

## 📊 **Backend Logs (Live)**
```
🚀 Election Monitoring Backend Server running on port 3000
📊 Health check: http://localhost:3000/api/health
🌐 Frontend: http://localhost:3000
⏰ Started at: 2025-08-24T07:47:34.814Z

2025-08-24T07:47:34.814Z - GET /api/health
```

## 🔐 **Default Login Credentials**
- **Username**: admin
- **Password**: admin123
- **Email**: admin@eci.gov.in
- **Role**: Administrator

## 📁 **Available Frontend Pages**
- **Home**: http://localhost:5000/index.html
- **Dashboard**: http://localhost:5000/home.html
- **Incidents**: http://localhost:5000/incidents.html
- **Report Incident**: http://localhost:5000/report-incident.html
- **Monitoring**: http://localhost:5000/monitoring.html
- **About**: http://localhost:5000/about.html
- **Contacts**: http://localhost:5000/contacts.html
- **Activities**: http://localhost:5000/activities.html

## 🛠️ **How to Access**

### **Option 1: Frontend Only (Port 5000)**
1. Open your browser
2. Go to: http://localhost:5000
3. Navigate through the frontend pages
4. Note: API calls will need to be configured to point to backend

### **Option 2: Backend with Frontend (Port 3000)**
1. Open your browser
2. Go to: http://localhost:3000
3. The backend serves both API and frontend files
4. All functionality should work seamlessly

### **Option 3: API Testing**
1. Use tools like Postman or curl
2. Test API endpoints at http://localhost:3000/api/*
3. Example: `GET http://localhost:3000/api/health`

## 🔍 **Testing the System**

### **1. Health Check**
```bash
curl http://localhost:3000/api/health
# Response: {"status":"OK","timestamp":"2025-08-24T07:47:34.814Z"}
```

### **2. Login Test**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### **3. Frontend Test**
- Open http://localhost:5000 in your browser
- You should see the Election Monitoring System homepage

## 📈 **System Features**
- ✅ **Authentication**: JWT-based login system
- ✅ **Database**: JSON file-based storage
- ✅ **Security**: Helmet.js, rate limiting, CORS
- ✅ **Logging**: Request logging with timestamps
- ✅ **API**: RESTful endpoints for all operations
- ✅ **Frontend**: Modern HTML/CSS/JavaScript interface
- ✅ **Real-time**: Live election data monitoring
- ✅ **Incident Management**: Report and track issues

## 🛑 **To Stop Servers**
- Press `Ctrl+C` in each terminal window
- Or close the terminal windows

## 📝 **Next Steps**
1. Open http://localhost:5000 in your browser
2. Test the login functionality
3. Explore the dashboard and incident reporting
4. Check the backend logs for any errors
5. Test API endpoints using browser developer tools

---
**🎉 Both servers are successfully running! The Election Monitoring System is ready to use.**

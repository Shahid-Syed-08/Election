# Election Monitoring System

A comprehensive web-based election monitoring system with real-time monitoring, incident reporting, and user management capabilities.

## 🌐 Access from Any Device

### Local Access
- **Backend API**: http://localhost:3000
- **Frontend**: http://localhost:5000

### External Access (Any Device/Phone/Browser)
- **Backend API**: http://YOUR_IP_ADDRESS:3000
- **Frontend**: http://YOUR_IP_ADDRESS:5000

## 🚀 Quick Start

### Option 1: Use Deployment Scripts
1. **Windows Batch**: Double-click `deploy.bat`
2. **PowerShell**: Right-click `deploy.ps1` → "Run with PowerShell"

### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd "backend programs"
npm start

# Terminal 2 - Frontend  
cd "front end programs"
node server.js
```

## 📱 Mobile & External Device Access

### Step 1: Find Your IP Address
```bash
# Windows
ipconfig | findstr "IPv4"

# PowerShell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*"}
```

### Step 2: Access from Any Device
- **Phone/Tablet**: Open browser → `http://YOUR_IP:5000`
- **Other Computers**: Open browser → `http://YOUR_IP:5000`
- **Any Browser**: Use the external URL

### Step 3: Network Requirements
- **Same Network**: Works immediately
- **Different Network**: Requires port forwarding on router
- **Internet Access**: Requires public IP or domain

## 🔧 Configuration

### Backend Server (Port 3000)
- Listens on: `0.0.0.0:3000` (all network interfaces)
- CORS: Enabled for all origins
- Security: Rate limiting, Helmet, CORS protection

### Frontend Server (Port 5000)
- Listens on: `0.0.0.0:5000` (all network interfaces)
- Static file serving
- Mobile-responsive design

## 📱 Mobile-First Features

- **Mobile-First Design**: Built specifically for mobile devices first
- **Responsive Design**: Optimized for all screen sizes (320px to 4K)
- **Touch-Friendly**: 48px minimum touch targets for better mobile experience
- **Mobile Meta Tags**: Web app capable, prevents zoom on iOS
- **Cross-Browser**: Works on all modern browsers (Chrome, Safari, Firefox, Edge)
- **Progressive Web App**: Can be installed on mobile home screen
- **Mobile Navigation**: Hamburger menu for small screens
- **Touch Feedback**: Visual feedback for all touch interactions
- **Mobile Loading**: Optimized loading states and animations
- **Gesture Support**: Touch-friendly interactions and feedback

## 🌍 External Access Setup

### For Same Network (Local)
1. Start both servers
2. Find your IP address
3. Access from any device using `http://YOUR_IP:5000`

### For Different Networks (Internet)
1. **Port Forwarding**: Forward ports 3000 and 5000 on your router
2. **Public IP**: Use your public IP address
3. **Domain**: Optional - set up a domain name

### Router Port Forwarding
- **Port 3000**: TCP → Backend API
- **Port 5000**: TCP → Frontend
- **Protocol**: TCP
- **Internal IP**: Your computer's local IP

## 🔒 Security Considerations

- **Firewall**: Ensure ports 3000 and 5000 are open
- **Network Security**: Only expose on trusted networks
- **HTTPS**: Consider adding SSL certificate for production
- **Authentication**: JWT-based user authentication

## 📋 System Requirements

- **Node.js**: v14 or higher
- **npm**: v6 or higher
- **OS**: Windows, macOS, Linux
- **Network**: Local network or internet access

## 🚨 Troubleshooting

### Can't Access from Phone
1. Check if both servers are running
2. Verify IP address is correct
3. Ensure firewall allows connections
4. Check if devices are on same network

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill process
taskkill /PID PROCESS_ID /F
```

### CORS Errors
- Backend CORS is configured to allow all origins
- Check if backend is running on correct port
- Verify frontend is making requests to correct backend URL

## 📞 Support

For issues or questions:
1. Check server console output for errors
2. Verify network connectivity
3. Ensure all dependencies are installed
4. Check firewall and antivirus settings

## 🌟 Features

- **Real-time Monitoring**: Live election data
- **Incident Reporting**: Report and track issues
- **User Management**: Admin controls and user profiles
- **Mobile Responsive**: Works on all devices
- **Cross-Platform**: Any browser, any device
- **Secure API**: JWT authentication and security

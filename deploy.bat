@echo off
echo ========================================
echo   Election Monitoring System Deployer
echo ========================================
echo.

echo Starting Backend Server...
cd "backend programs"
start "Backend Server" cmd /k "npm start"
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
cd "..\front end programs"
start "Frontend Server" cmd /k "node server.js"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   Servers Started Successfully!
echo ========================================
echo.

echo Getting your IP address for external access...
ipconfig | findstr "IPv4"
echo.

echo ========================================
echo   Access URLs:
echo ========================================
echo Local Backend:  http://localhost:3000
echo Local Frontend: http://localhost:5000
echo.
echo External Backend:  http://YOUR_IP:3000
echo External Frontend: http://YOUR_IP:5000
echo.
echo Mobile/Phone: Use the External URLs above
echo Any Browser: Use the External URLs above
echo.
echo ========================================
echo   Press any key to exit...
echo ========================================
pause >nul

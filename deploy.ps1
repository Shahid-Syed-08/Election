# Election Monitoring System Deployer
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Election Monitoring System Deployer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get local IP address
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" -or $_.IPAddress -like "172.*"} | Select-Object -First 1).IPAddress

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Set-Location "backend programs"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Set-Location "..\front end programs"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node server.js" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Servers Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Your Local IP Address: $localIP" -ForegroundColor Magenta
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Access URLs:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Local Backend:  http://localhost:3000" -ForegroundColor White
Write-Host "Local Frontend: http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "External Backend:  http://$localIP`:3000" -ForegroundColor Green
Write-Host "External Frontend: http://$localIP`:5000" -ForegroundColor Green
Write-Host ""
Write-Host "Mobile/Phone: Use the External URLs above" -ForegroundColor Yellow
Write-Host "Any Browser: Use the External URLs above" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Press any key to exit..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

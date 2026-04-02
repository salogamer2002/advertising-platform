# Start All Services - Windows PowerShell
# This script opens 4 new terminals to run all services with Node.js directly

Write-Host "Starting Campaign Advertising Platform..." -ForegroundColor Green
Write-Host ""
Write-Host "This will open 4 new PowerShell windows for each service" -ForegroundColor Yellow
Write-Host ""

# Get workspace root
$WorkspaceRoot = $PSScriptRoot

# Function to open new terminal with command
function Start-ServiceTerminal {
    param(
        [string]$Title,
        [string]$Path,
        [string]$Command
    )
    
    Write-Host "Starting: $Title" -ForegroundColor Cyan
    Write-Host "  Path: $Path" -ForegroundColor Gray
    
    # Create command sequence
    $installCmd = "cd '$Path'; npm install --legacy-peer-deps 2>&1 | Out-Null"
    $runCmd = $Command
    $FullCommand = "$installCmd; Write-Host 'Ready' -ForegroundColor Green; $runCmd"
    
    # Open new PowerShell window with separate process
    Start-Process powershell.exe -ArgumentList @('-NoExit', '-Command', $FullCommand)
    
    Start-Sleep -Milliseconds 800
}

Write-Host "Opening terminals..." -ForegroundColor Yellow
Write-Host ""

# Terminal 1: Backend API + WebSocket
Start-ServiceTerminal -Title "Backend API (Port 4000)" -Path "$WorkspaceRoot\task-1.1-2.1-2.3\backend" -Command "npm run dev"

# Terminal 2: Task 1.1 Frontend (Dashboard)
Start-ServiceTerminal -Title "Dashboard (Port 3001)" -Path "$WorkspaceRoot\task-1.1-2.1-2.3\frontend" -Command "npm run dev"

# Terminal 3: Task 1.2 Frontend (Brief Builder)
Start-ServiceTerminal -Title "Brief Builder (Port 3002)" -Path "$WorkspaceRoot\task-1.2\frontend" -Command "npm run dev"

# Terminal 4: AI Microservice
Start-ServiceTerminal -Title "AI Microservice (Port 5000)" -Path "$WorkspaceRoot\task-2.2\backend" -Command "npm run dev"

Write-Host ""
Write-Host "All services are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "Access the applications:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Dashboard:              http://localhost:3001" -ForegroundColor Cyan
Write-Host "   Brief Builder:          http://localhost:3002" -ForegroundColor Cyan
Write-Host "   API Documentation:      http://localhost:4000/api-docs" -ForegroundColor Cyan
Write-Host "   Backend Health:         http://localhost:4000/health" -ForegroundColor Cyan
Write-Host "   Microservice Health:    http://localhost:5000/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Give services 30 seconds to fully start..." -ForegroundColor Gray
Write-Host ""

# Keep main window open
Read-Host "Press Enter to exit"


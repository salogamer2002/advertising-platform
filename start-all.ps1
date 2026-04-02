# Start All Services - Windows PowerShell
# This script will open 4 terminals to run all services

Write-Host "🚀 Starting Campaign Advertising Platform..." -ForegroundColor Green
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
    
    Write-Host "📌 Starting: $Title" -ForegroundColor Cyan
    Write-Host "   Path: $Path" -ForegroundColor Gray
    Write-Host "   Command: $Command" -ForegroundColor Gray
    
    # Create command sequence
    $FullCommand = "cd '$Path'; $Command; Read-Host 'Press Enter to exit'"
    
    # Open new PowerShell window
    Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", $FullCommand -WindowStyle Normal
    
    Start-Sleep -Seconds 1
}

Write-Host "Opening terminals..." -ForegroundColor Yellow
Write-Host ""

# Terminal 1: Backend API + WebSocket + Database
Start-ServiceTerminal `
    -Title "Backend (API + WebSocket + PostgreSQL)" `
    -Path "$WorkspaceRoot\task-1.1-2.1-2.3\backend" `
    -Command "docker-compose up"

# Terminal 2: Task 1.1 Frontend (Dashboard)
Start-ServiceTerminal `
    -Title "Task 1.1 - Campaign Dashboard Frontend" `
    -Path "$WorkspaceRoot\task-1.1-2.1-2.3\frontend" `
    -Command "npm install; npm run dev"

# Terminal 3: Task 1.2 Frontend (Brief Builder)
Start-ServiceTerminal `
    -Title "Task 1.2 - Creative Brief Builder Frontend" `
    -Path "$WorkspaceRoot\task-1.2\frontend" `
    -Command "npm install; npm run dev"

# Terminal 4: Task 2.2 Backend (Microservice)
Start-ServiceTerminal `
    -Title "Task 2.2 - AI Content Generation Microservice" `
    -Path "$WorkspaceRoot\task-2.2\backend" `
    -Command "docker-compose up"

Write-Host ""
Write-Host "✅ All services starting..." -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access URLs:" -ForegroundColor Yellow
Write-Host "   Dashboard UI:        http://localhost:5173" -ForegroundColor Cyan
Write-Host "   Brief Builder UI:    http://localhost:5174" -ForegroundColor Cyan
Write-Host "   API Docs:            http://localhost:3001/api-docs" -ForegroundColor Cyan
Write-Host "   Microservice Health: http://localhost:3002/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   See RUN_GUIDE.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""

# Keep main window open
Read-Host "Press Enter to exit (other terminals will remain open)"

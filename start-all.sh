#!/bin/bash
# Start All Services - Linux/Mac/WSL
# This script will open multiple terminals to run all services

echo "🚀 Starting Campaign Advertising Platform..."
echo ""

WORKSPACE_ROOT=$(pwd)

# Function to open new terminal with command
start_service() {
    local TITLE=$1
    local PATH=$2
    local COMMAND=$3
    
    echo "📌 Starting: $TITLE"
    echo "   Path: $PATH"
    echo "   Command: $COMMAND"
    echo ""
    
    # Use tmux if available, otherwise open in new window
    if command -v tmux &> /dev/null; then
        tmux new-window -n "$TITLE" -c "$PATH" "$COMMAND"
    else
        # Fall back to xterm or gnome-terminal
        if command -v xterm &> /dev/null; then
            xterm -title "$TITLE" -e "cd '$PATH' && $COMMAND; read -p 'Press Enter to exit'" &
        elif command -v gnome-terminal &> /dev/null; then
            gnome-terminal --title="$TITLE" -- bash -c "cd '$PATH' && $COMMAND; read -p 'Press Enter to exit'" &
        else
            echo "⚠️  No terminal multiplexer found. Running sequentially..."
            cd "$PATH"
            eval "$COMMAND"
        fi
    fi
    
    sleep 1
}

echo "Opening terminals..."
echo ""

# Terminal 1: Backend API + WebSocket + Database
start_service \
    "Backend (API + WebSocket + PostgreSQL)" \
    "$WORKSPACE_ROOT/task-1.1-2.1-2.3/backend" \
    "docker-compose up"

# Terminal 2: Task 1.1 Frontend (Dashboard)
start_service \
    "Task 1.1 - Campaign Dashboard Frontend" \
    "$WORKSPACE_ROOT/task-1.1-2.1-2.3/frontend" \
    "npm install && npm run dev"

# Terminal 3: Task 1.2 Frontend (Brief Builder)
start_service \
    "Task 1.2 - Creative Brief Builder Frontend" \
    "$WORKSPACE_ROOT/task-1.2/frontend" \
    "npm install && npm run dev"

# Terminal 4: Task 2.2 Backend (Microservice)
start_service \
    "Task 2.2 - AI Content Generation Microservice" \
    "$WORKSPACE_ROOT/task-2.2/backend" \
    "docker-compose up"

echo ""
echo "✅ All services starting..."
echo ""
echo "📍 Access URLs:"
echo "   Dashboard UI:        http://localhost:5173"
echo "   Brief Builder UI:    http://localhost:5174"
echo "   API Docs:            http://localhost:3001/api-docs"
echo "   Microservice Health: http://localhost:3002/health"
echo ""
echo "📚 Documentation:"
echo "   See RUN_GUIDE.md for detailed instructions"
echo ""

# How To Run (PowerShell / Windows)

## Prerequisites

- Node.js 18+ and npm
- Docker Desktop (recommended for PostgreSQL and container runs)

## 1) Run Connected Stack: Task 1.1 + 2.1 + 2.3

### Terminal A — Backend (`task-1.1-2.1-2.3/backend`)

```powershell
cd "C:\Users\hp\Desktop\b_T4SVqdhK3v4-1775045495457\task-1.1-2.1-2.3\backend"
Copy-Item .env.example .env
npm install
docker compose up -d db
npm run db:migrate
npm run dev
```

Backend API runs on: `http://localhost:3001`

### Terminal B — Frontend (`task-1.1-2.1-2.3/frontend`)

```powershell
cd "C:\Users\hp\Desktop\b_T4SVqdhK3v4-1775045495457\task-1.1-2.1-2.3\frontend"
npm install
npm run dev
```

Frontend runs on Vite default URL (usually `http://localhost:5173`).

## 2) Run Task 1.2 (AI Brief Builder Frontend)

```powershell
cd "C:\Users\hp\Desktop\b_T4SVqdhK3v4-1775045495457\task-1.2\frontend"
npm install
npm run dev
```

## 3) Run Task 2.2 (AI Content Microservice)

### Option A: npm

```powershell
cd "C:\Users\hp\Desktop\b_T4SVqdhK3v4-1775045495457\task-2.2\backend"
Copy-Item .env.example .env
# Edit .env and set OPENAI_API_KEY
npm install
npm run dev
```

Service URL: `http://localhost:3003`

### Option B: Docker

```powershell
cd "C:\Users\hp\Desktop\b_T4SVqdhK3v4-1775045495457\task-2.2\backend"
Copy-Item .env.example .env
# Edit .env and set OPENAI_API_KEY
docker compose up --build
```

## Quick Health Checks

```powershell
Invoke-RestMethod http://localhost:3001/health
Invoke-RestMethod http://localhost:3003/health
```

If `/health` is not available in one service, open its root URL in browser or check terminal logs.

# 🚀 How to Run All Tasks & Services

## Quick Start (Easiest Way)

### Option 1: Run Individual Services in Separate Terminals

Open **4 PowerShell windows** and run each command in its own terminal:

#### Terminal 1: Backend API (Port 4000)
```powershell
cd 'C:\Users\hp\Desktop\b_T4SVqdhK3v4-1775045495457\task-1.1-2.1-2.3\backend'
npm install
npm run dev
```

#### Terminal 2: Task 1.1 Frontend - Dashboard (Port 3001)
```powershell
cd 'C:\Users\hp\Desktop\b_T4SVqdhK3v4-1775045495457\task-1.1-2.1-2.3\frontend'
npm install
npm run dev
```

#### Terminal 3: Task 1.2 Frontend - Brief Builder (Port 3002)
```powershell
cd 'C:\Users\hp\Desktop\b_T4SVqdhK3v4-1775045495457\task-1.2\frontend'
npm install
npm run dev
```

#### Terminal 4: AI Microservice (Port 5000)
```powershell
cd 'C:\Users\hp\Desktop\b_T4SVqdhK3v4-1775045495457\task-2.2\backend'
npm install
npm run dev
```

---

## After All Services Start ✅

### Access the Applications:

| Service | URL | Port |
|---------|-----|------|
| **Dashboard UI** | http://localhost:3001 | 3001 |
| **Brief Builder UI** | http://localhost:3002 | 3002 |
| **API Documentation** | http://localhost:4000/api-docs | 4000 |
| **API Health Check** | http://localhost:4000/health | 4000 |
| **Microservice Health** | http://localhost:5000/health | 5000 |

---

## Service Details

### Backend API (Task 2.1)
- **Location**: `task-1.1-2.1-2.3/backend`
- **Port**: 4000
- **Features**: 
  - REST API with CRUD operations
  - JWT Authentication
  - WebSocket support (/ws)
  - Swagger documentation at /api-docs
  - Mock database (PostgreSQL-compatible)

**Key Endpoints:**
```
GET    /campaigns              - List campaigns
POST   /campaigns              - Create campaign
GET    /campaigns/:id          - Get single campaign
PUT    /campaigns/:id          - Update campaign
DELETE /campaigns/:id          - Delete campaign
POST   /auth/login             - Login & get JWT token
GET    /notifications          - Get notifications
```

### Task 1.1 - Campaign Dashboard
- **Location**: `task-1.1-2.1-2.3/frontend`
- **Port**: 3001
- **Framework**: React 18 + Vite
- **Features**:
  - Real-time campaign metrics (KPI cards)
  - Performance charts
  - Sortable/filterable campaign table
  - Dark mode toggle
  - Fetches from API on http://localhost:4000

### Task 1.2 - Brief Builder
- **Location**: `task-1.2/frontend`
- **Port**: 3002
- **Framework**: React 18 + Vite
- **Features**:
  - 4-step form wizard
  - AI-powered copy generation
  - PDF export
  - Calls AI microservice at http://localhost:5000

### AI Microservice (Task 2.2)
- **Location**: `task-2.2/backend`
- **Port**: 5000
- **Features**:
  - Generate ad copy with mock AI
  - Generate social media captions
  - Generate hashtags
  - Mock fallback (works without OpenAI API key)

**Key Endpoints:**
```
POST /generate/copy     - Generate ad headlines, body, CTA
POST /generate/social   - Generate social captions
POST /generate/hashtags - Generate relevant hashtags
GET  /health            - Service status
```

---

## Troubleshooting

### Port Already in Use
If a port is already in use, you'll see an error. Kill the process:
```powershell
# Kill process on port 4000
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process -Force

# Kill process on port 3001
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force

# Kill process on port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

### "npm: command not found"
Install Node.js from https://nodejs.org

### Dependencies Installation Fails
```powershell
# Clear npm cache and reinstall
npm cache clean --force
npm install
```

### Database Connection Error
The backend uses **mock database by default** (no PostgreSQL needed). If you see connection errors:
1. Verify `.env` has `USE_MOCK_DB=true`
2. Restart the backend service

---

## Testing the Workflow

### 1. Test Backend API
```bash
# Login to get JWT token
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Get campaigns (uses mock data)
curl http://localhost:4000/campaigns

# Get specific campaign
curl http://localhost:4000/campaigns/1
```

### 2. Test Dashboard
1. Open http://localhost:3001
2. You should see campaign metrics and table
3. Try sorting, filtering columns
4. Toggle dark mode

### 3. Test Brief Builder
1. Open http://localhost:3002
2. Fill in the 4-step form
3. Click "Generate Brief"
4. AI should respond with copy suggestions
5. Export as PDF

### 4. Test AI Microservice
```bash
curl -X POST http://localhost:5000/generate/copy \
  -H "Content-Type: application/json" \
  -d '{
    "product": "Luxury Skincare",
    "tone": "premium",
    "platform": "instagram",
    "word_limit": 50
  }'
```

---

## Section 3 Speed Tasks

These are **pre-built files** in `task-section3/`:

- **Q1**: Debug Express API → `q1-debug-express/` (buggy & fixed versions)
- **Q2**: React useDebounce Hook → `q2-use-debounce/useDebounce.js`
- **Q3**: SQL Query (ROAS) → `q3-sql-query/top-campaigns-roas.sql`
- **Q4**: React Optimization → `q4-react-optimize/SlowComponent.jsx`
- **Q5**: Express CRUD → `q5-ai-crud/express-crud-route.js`

These don't need to be "run" - they're reference implementations.

---

## Full Service Map

```
┌─────────────────────────────────────────────────────┐
│         USER BROWSER / FRONTEND                     │
├─────────────┬───────────────────────┬───────────────┤
│   :3001     │       :3002           │   :5173       │
│ Dashboard   │  Brief Builder        │   Portfolio   │
└──────┬──────┴───────────┬───────────┴───────────────┘
       │                  │
       │                  │
┌──────▼──────┬───────────▼──────────┐
│             │                      │
│  :4000      │        :5000         │
│ Backend API │   AI Microservice    │
│  + WebSocket│                      │
│             │                      │
│ Campaigns   │ Generate Copy/Social │
│ Auth        │ Hashtags             │
│ Users       │                      │
│             │                      │
└─────────────┴──────────────────────┘
      │
      ▼
┌───────────────────────┐
│  MOCK DATABASE        │
│ (PostgreSQL-compat)   │
│                       │
│ • Campaigns (3)       │
│ • Clients (2)         │
│ • Users (1)           │
│ • Notifications       │
└───────────────────────┘
```

---

## Environment Variables

All services use `.env` files with defaults. No configuration needed to start:

**Backend** (task-1.1-2.1-2.3/backend/.env):
```
PORT=4000
USE_MOCK_DB=true
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

**Microservice** (task-2.2/backend/.env):
```
PORT=5000
NODE_ENV=development
USE_MOCK_AI=true
```

---

## Stop All Services

Press **Ctrl+C** in each terminal to stop the service.

Or kill all Node processes:
```powershell
Get-Process node | Stop-Process -Force
```

---

## Next Steps

✅ All services running → Test workflows  
✅ Everything working → Deploy to production  
✅ Want real DB → Set `USE_MOCK_DB=false` and configure PostgreSQL  
✅ Want real AI → Add OpenAI API key to `task-2.2/backend/.env`

---

**🎉 Complete project is ready to run!**

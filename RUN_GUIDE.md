# 🚀 How to Run All Tasks

## System Requirements
- Node.js 16+ and npm
- Docker & Docker Compose (for backend services)
- PostgreSQL 15 (via Docker)
- Git

---

## 📂 TASK GROUP 1: Campaign Dashboard + API + Notifications
### (`task-1.1-2.1-2.3/`)

**INCLUDES:**
- **Task 1.1**: Campaign Dashboard UI (React + Tailwind)
- **Task 2.1**: Campaign Management REST API (Express + PostgreSQL)
- **Task 2.3**: Real-Time Notification System (WebSocket)

### Setup & Run

#### 1️⃣ Start Backend Services (Terminal 1)
```bash
cd task-1.1-2.1-2.3/backend

# Install dependencies
npm install

# Set environment variables (create .env file)
# JWT_SECRET=your_secret_key

# Start with Docker Compose
docker-compose up

# OR Run locally (requires PostgreSQL running):
# npm run dev
```

**Expected Output:**
```
✓ API running on http://localhost:3001
✓ Swagger Docs: http://localhost:3001/api-docs
✓ WebSocket: ws://localhost:3001
✓ PostgreSQL: localhost:5432
```

#### 2️⃣ Start Frontend (Terminal 2)
```bash
cd task-1.1-2.1-2.3/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
✓ Frontend running on http://localhost:5173
```

#### 3️⃣ Access the Application
- **Dashboard UI**: http://localhost:5173
- **API Documentation**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health

---

## 📂 TASK GROUP 2: AI Creative Brief Builder + Content Generation
### (`task-1.2/` + `task-2.2/`)

**INCLUDES:**
- **Task 1.2**: AI-Assisted Creative Brief Builder (React Form)
- **Task 2.2**: AI Content Generation Microservice (Docker)

### Setup & Run

#### 1️⃣ Start Backend Microservice (Terminal 1)
```bash
cd task-2.2/backend

# Install dependencies
npm install

# Create .env file
# OPENAI_API_KEY=your_api_key
# PORT=3002
# NODE_ENV=development

# Start with Docker
docker-compose up

# OR Run locally:
# npm run dev
```

#### 2️⃣ Start Frontend (Terminal 2)
```bash
cd task-1.2/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
✓ Brief Builder: http://localhost:5174
✓ Microservice: http://localhost:3002
✓ Health Check: http://localhost:3002/health
```

---

## 📂 SECTION 3: Speed & Practical Tasks
### (`task-section3/`)

**INCLUDES:**
- Q1: Debug Express API
- Q2: React useDebounce Hook
- Q3: SQL Query Optimization
- Q4: React Component Optimization
- Q5: Express CRUD with AI

### Files & How to Review

#### Q1: Debug Express API
```bash
cd task-section3/q1-debug-express

# Compare buggy vs fixed version
cat buggy-api.js      # Original with 4 bugs
cat fixed-api.js      # Corrected version
```

#### Q2: React useDebounce
```bash
cd task-section3/q2-use-debounce

# Review the hook implementation
cat useDebounce.js
```

#### Q3: SQL Query
```bash
cd task-section3/q3-sql-query

# View the query
cat top-campaigns-roas.sql
```

#### Q4: React Component Optimization
```bash
cd task-section3/q4-react-optimize

# Review optimized component
cat SlowComponent.jsx
```

#### Q5: Express CRUD Route
```bash
cd task-section3/q5-ai-crud

# Review CRUD route
cat express-crud-route.js
```

---

## 🔄 Full Stack Setup (Run Everything)

### Terminal 1: Backend Services
```bash
cd task-1.1-2.1-2.3/backend
docker-compose up
```

### Terminal 2: Task 1.1 Frontend
```bash
cd task-1.1-2.1-2.3/frontend
npm install && npm run dev
# → http://localhost:5173
```

### Terminal 3: Task 1.2 Frontend
```bash
cd task-1.2/frontend
npm install && npm run dev
# → http://localhost:5174
```

### Terminal 4: Task 2.2 Backend Microservice
```bash
cd task-2.2/backend
docker-compose up
# → http://localhost:3002
```

---

## 🧪 API Testing

### Option 1: Swagger UI (Built-in)
```
http://localhost:3001/api-docs
```

### Option 2: cURL
```bash
# Get all campaigns
curl http://localhost:3001/campaigns

# Create campaign
curl -X POST http://localhost:3001/campaigns \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Campaign","status":"active"}'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

### Option 3: Postman
Import the OpenAPI spec from: `http://localhost:3001/openapi.yaml`

---

## 📊 Database Management

### Access PostgreSQL
```bash
# Connect to the database
psql -h localhost -U postgres -d campaign_db -p 5432
# Password: postgres

# View schema
\dt

# Run migrations
npm run db:migrate
```

### Reset Database
```bash
docker-compose down -v
docker-compose up
# Database will be recreated from schema.sql
```

---

## 🔧 Environment Setup

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/campaign_db
JWT_SECRET=your_secret_key_here
PORT=3001
NODE_ENV=development
```

### Microservice (.env)
```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...
PORT=3002
NODE_ENV=development
```

---

## ⚡ Quick Commands Reference

| Task | Command | URL |
|------|---------|-----|
| **Task 1.1 Frontend** | `cd task-1.1-2.1-2.3/frontend && npm run dev` | http://localhost:5173 |
| **Task 2.1 API** | `cd task-1.1-2.1-2.3/backend && docker-compose up` | http://localhost:3001 |
| **Task 1.2 Frontend** | `cd task-1.2/frontend && npm run dev` | http://localhost:5174 |
| **Task 2.2 Microservice** | `cd task-2.2/backend && docker-compose up` | http://localhost:3002 |
| **Swagger Docs** | - | http://localhost:3001/api-docs |
| **Database** | `psql postgresql://postgres@localhost/campaign_db` | localhost:5432 |

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
PORT=5175 npm run dev
```

### Docker Issues
```bash
# Clear all containers and volumes
docker-compose down -v

# Rebuild images
docker-compose up --build
```

### Database Connection Failed
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check logs
docker logs <container_id>
```

### Node Modules Issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📋 Verification Checklist

- [ ] Backend running on http://localhost:3001
- [ ] PostgreSQL connected (via Docker)
- [ ] Task 1.1 Frontend on http://localhost:5173
- [ ] Task 1.2 Frontend on http://localhost:5174
- [ ] Task 2.2 Microservice on http://localhost:3002
- [ ] Swagger API docs accessible
- [ ] WebSocket connection working
- [ ] Can create/read campaigns via API

---

## 🎯 Next Steps

1. **Start the Backend** using Docker Compose
2. **Run Task 1.1 Frontend** to see the dashboard
3. **Test the API** using Swagger UI
4. **Review Section 3** practical tasks
5. **Explore Task 1.2 & 2.2** for AI features

Happy coding! 🚀

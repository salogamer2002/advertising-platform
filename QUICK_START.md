# 🎯 Quick Start Reference Card

## 🚀 START ALL SERVICES (Recommended)

### Windows PowerShell
```powershell
.\start-all.ps1
```

### Linux/Mac/WSL
```bash
chmod +x start-all.sh
./start-all.sh
```

---

## 📋 Manual Start (Individual Services)

### Option A: Run Everything Separately

#### Step 1: Backend + Database (Terminal 1)
```bash
cd task-1.1-2.1-2.3/backend
docker-compose up
```
✓ Runs on port **3001** with PostgreSQL on **5432**

#### Step 2: Task 1.1 Frontend (Terminal 2)
```bash
cd task-1.1-2.1-2.3/frontend
npm install
npm run dev
```
✓ Runs on **http://localhost:5173**

#### Step 3: Task 1.2 Frontend (Terminal 3)
```bash
cd task-1.2/frontend
npm install
npm run dev
```
✓ Runs on **http://localhost:5174**

#### Step 4: Task 2.2 Microservice (Terminal 4)
```bash
cd task-2.2/backend
docker-compose up
```
✓ Runs on port **3002**

---

## 🔗 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Dashboard | http://localhost:5173 | View campaigns, metrics, KPIs |
| Brief Builder | http://localhost:5174 | Create campaign briefs with AI |
| API Docs | http://localhost:3001/api-docs | Swagger documentation |
| API Health | http://localhost:3001/health | Check backend status |
| Microservice Health | http://localhost:3002/health | Check AI service status |
| Database | localhost:5432 | PostgreSQL (user: postgres) |

---

## 🧪 Test the API

### Using Swagger UI
Go to: **http://localhost:3001/api-docs**
- Try all endpoints directly from browser
- No curl needed!

### Using cURL
```bash
# Get all campaigns
curl http://localhost:3001/campaigns

# Create a campaign
curl -X POST http://localhost:3001/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Campaign",
    "client": "Test Client",
    "status": "active",
    "budget": 5000
  }'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password"
  }'
```

---

## 📂 Project Structure

```
📦 root
├── 📁 task-1.1-2.1-2.3/          (MAIN PROJECT)
│   ├── frontend/                 (React Dashboard)
│   └── backend/                  (Express API + WebSocket)
├── 📁 task-1.2/                  (Creative Brief)
│   └── frontend/                 (React Form)
├── 📁 task-2.2/                  (AI Microservice)
│   └── backend/                  (Express Microservice)
├── 📁 task-section3/             (Speed Tasks)
│   ├── q1-debug-express/
│   ├── q2-use-debounce/
│   ├── q3-sql-query/
│   ├── q4-react-optimize/
│   └── q5-ai-crud/
├── RUN_GUIDE.md                  (Full documentation)
├── start-all.ps1                 (Windows startup)
└── start-all.sh                  (Linux/Mac startup)
```

---

## 🛠️ Common Tasks

### Reset Database
```bash
cd task-1.1-2.1-2.3/backend
docker-compose down -v
docker-compose up
```

### Install Dependencies
```bash
cd task-1.1-2.1-2.3/frontend
npm install

cd task-1.1-2.1-2.3/backend
npm install

cd task-1.2/frontend
npm install

cd task-2.2/backend
npm install
```

### Kill Process on Port
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

### View Database
```bash
# Connect to PostgreSQL
psql postgresql://postgres:postgres@localhost:5432/campaign_db

# List tables
\dt

# View campaigns
SELECT * FROM campaigns;
```

---

## ⚠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process: `taskkill /PID <PID> /F` |
| Docker not running | Start Docker Desktop or daemon |
| Cannot connect to DB | Check `docker ps`, ensure postgres container running |
| npm packages not found | Run `npm install` in the directory |
| Module not found error | Delete `node_modules` and `package-lock.json`, then `npm install` |
| Environment variables missing | Create `.env` file with required keys |
| WebSocket connection failed | Ensure backend is running with `docker-compose up` |

---

## 📚 Key Files

| File | Purpose |
|------|---------|
| `RUN_GUIDE.md` | Complete setup & run guide |
| `task-1.1-2.1-2.3/backend/.env` | Backend environment variables |
| `task-2.2/backend/.env` | Microservice environment variables |
| `task-1.1-2.1-2.3/backend/docker-compose.yml` | Database & API container config |
| `task-2.2/backend/docker-compose.yml` | Microservice container config |
| `task-section3/q1-debug-express/` | Bug fixing exercise |
| `task-section3/q2-use-debounce/` | React hook exercise |

---

## ✅ Verification Checklist

After starting services, verify everything:

- [ ] Backend running: `curl http://localhost:3001/health`
- [ ] Frontend accessible: Open http://localhost:5173
- [ ] API docs loaded: http://localhost:3001/api-docs
- [ ] Database connected: Check Docker logs
- [ ] WebSocket active: Check browser console
- [ ] Brief Builder loads: http://localhost:5174
- [ ] Microservice healthy: http://localhost:3002/health

---

## 🎓 Next Steps

1. **Start Backend** - Run `docker-compose up` in `task-1.1-2.1-2.3/backend`
2. **View Dashboard** - Open http://localhost:5173
3. **Test API** - Go to http://localhost:3001/api-docs
4. **Review Code** - Check `task-section3` for practical tasks
5. **Build Features** - Extend the dashboard with new components

---

## 📞 Need Help?

- Check `RUN_GUIDE.md` for detailed documentation
- Review individual task folders for implementation details
- Check Docker logs: `docker logs <container_id>`
- Review error messages in terminal output

Happy coding! 🚀

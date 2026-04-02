# Complete Vercel Deployment Overview

## 🚀 Quick Deployment Steps

### 1. **Prepare Code**
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. **Deploy Backend API (Task 2.1)** 
Go to https://vercel.com/new
- Select your repository
- Set root directory: `task-1.1-2.1-2.3/backend`
- Add environment variables:
  - `JWT_SECRET` = your-secret-key
  - `PORT` = 4000
  - `NODE_ENV` = production
  - `USE_MOCK_DB` = true (to start) or false (with real DB)
  - `DATABASE_URL` = postgresql://user:pass@host:5432/db (if real DB)

**Result:** `https://your-api.vercel.app`

### 3. **Deploy Microservice (Task 2.2)**
- Set root directory: `task-2.2/backend`
- Add environment variables:
  - `PORT` = 5000
  - `NODE_ENV` = production
  - `USE_MOCK_AI` = true

**Result:** `https://your-ai.vercel.app`

### 4. **Deploy Dashboard (Task 1.1)**
- Set root directory: `task-1.1-2.1-2.3/frontend`
- Add environment variables:
  - `VITE_API_URL` = https://your-api.vercel.app

**Result:** `https://your-dashboard.vercel.app`

### 5. **Deploy Brief Builder (Task 1.2)**
- Set root directory: `task-1.2/frontend`
- Add environment variables:
  - `VITE_AI_URL` = https://your-ai.vercel.app

**Result:** `https://your-brief.vercel.app`

---

## Environment Variables

### Backend API (task-1.1-2.1-2.3/backend)
```
JWT_SECRET=your-super-secret-key-min-32-chars
DATABASE_URL=postgresql://user:password@host:5432/campaign_db
PORT=4000
NODE_ENV=production
USE_MOCK_DB=false
FRONTEND_URL=https://your-dashboard.vercel.app
```

### Microservice (task-2.2/backend)
```
PORT=5000
NODE_ENV=production
USE_MOCK_AI=true
OPENAI_API_KEY=sk-your-key-optional
```

### Dashboard Frontend (task-1.1-2.1-2.3/frontend)
```
VITE_API_URL=https://your-api.vercel.app
```

### Brief Builder Frontend (task-1.2/frontend)
```
VITE_AI_URL=https://your-ai.vercel.app
```

---

## Vercel CLI Alternative (Advanced)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy backend
cd task-1.1-2.1-2.3/backend
vercel --prod

# Deploy microservice
cd ../../task-2.2/backend
vercel --prod

# Deploy frontends
cd ../../task-1.1-2.1-2.3/frontend
vercel --prod

cd ../../task-1.2/frontend
vercel --prod
```

---

## Database Setup

### Option 1: Use Mock Database (Quick Start)
- Set `USE_MOCK_DB=true` in Vercel env vars
- No database needed
- Sample data included

### Option 2: Free PostgreSQL

**Neon.tech (Recommended)**
1. Go to https://neon.tech
2. Create account
3. Create database
4. Copy connection string
5. Set as `DATABASE_URL` in Vercel

**Railway.app**
1. Go to https://railway.app
2. Create account
3. Create PostgreSQL project
4. Copy connection string
5. Set as `DATABASE_URL` in Vercel

### Option 3: Paid PostgreSQL
- AWS RDS: $0-20/month
- Azure Database: $13+/month
- DigitalOcean: $15+/month

---

## Testing After Deployment

```bash
# Check backend health
curl https://your-api.vercel.app/health

# Check API docs
https://your-api.vercel.app/api-docs

# Check microservice
curl https://your-ai.vercel.app/health

# Test dashboard
https://your-dashboard.vercel.app

# Test brief builder
https://your-brief.vercel.app
```

---

## Complete Documentation

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for:
- Detailed step-by-step instructions
- Configuration file examples
- Troubleshooting guide
- Domain setup
- Performance optimization

---

## Post-Deployment Checklist

- [ ] All 4 services deployed
- [ ] Environment variables set
- [ ] Frontend URLs updated to backend URLs
- [ ] Health checks passing
- [ ] Database connected
- [ ] CORS configured
- [ ] Custom domains set up (optional)
- [ ] Monitoring enabled
- [ ] Backups configured

---

**🎉 Your advertising platform is live!**

# 🚀 Deploy to Vercel - Complete Guide

## Overview

This project has **4 services** that need deployment:

| Service | Type | Deploy To | Port |
|---------|------|-----------|------|
| **Task 1.1 Dashboard** | Frontend (React) | Vercel | 3001 |
| **Task 1.2 Brief Builder** | Frontend (React) | Vercel | 3002 |
| **Task 2.1 Backend API** | Node.js/Express | Vercel Functions | 4000 |
| **Task 2.2 Microservice** | Node.js/Express | Vercel Functions | 5000 |

---

## Prerequisites

1. **Vercel Account** - https://vercel.com/signup
2. **GitHub Account** - Push your code to GitHub
3. **PostgreSQL Database** - For production (optional, can use mock)
4. **Environment Variables** - API keys and secrets

---

## Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - advertising platform"

# Add remote (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to main branch
git branch -M main
git push -u origin main
```

---

## Step 2: Create Vercel Configuration Files

### 2a. Root `vercel.json`
Create at: `c:\Users\hp\Desktop\b_T4SVqdhK3v4-1775045495457\vercel.json`

```json
{
  "version": 2,
  "regions": ["iad"],
  "builds": [
    {
      "src": "task-1.1-2.1-2.3/frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist",
        "env": {
          "VITE_API_URL": "@vite-api-url"
        }
      }
    },
    {
      "src": "task-1.2/frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist",
        "env": {
          "VITE_AI_URL": "@vite-ai-url"
        }
      }
    },
    {
      "src": "task-1.1-2.1-2.3/backend/package.json",
      "use": "@vercel/node"
    },
    {
      "src": "task-2.2/backend/package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "task-1.1-2.1-2.3/backend/src/index.js"
    },
    {
      "src": "/ai/(.*)",
      "dest": "task-2.2/backend/src/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "task-1.1-2.1-2.3/frontend/index.html"
    }
  ]
}
```

### 2b. Backend `vercel.json` (Task 2.1)
Create at: `task-1.1-2.1-2.3/backend/vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/src/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "USE_MOCK_DB": "@use-mock-db",
    "JWT_SECRET": "@jwt-secret",
    "DATABASE_URL": "@database-url",
    "PORT": "4000"
  }
}
```

### 2c. Microservice `vercel.json` (Task 2.2)
Create at: `task-2.2/backend/vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/src/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "USE_MOCK_AI": "true",
    "PORT": "5000"
  }
}
```

### 2d. Update Vite Config (Task 1.1)
Edit: `task-1.1-2.1-2.3/frontend/vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

### 2e. Update Vite Config (Task 1.2)
Edit: `task-1.2/frontend/vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    proxy: {
      '/ai': {
        target: process.env.VITE_AI_URL || 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

---

## Step 3: Create Build Scripts

### 3a. Root `package.json` (if not exists)
Create at root: `package.json`

```json
{
  "name": "advertising-platform",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "npm run build:dashboard && npm run build:brief && npm run build:api && npm run build:ai",
    "build:dashboard": "cd task-1.1-2.1-2.3/frontend && npm install && npm run build",
    "build:brief": "cd task-1.2/frontend && npm install && npm run build",
    "build:api": "cd task-1.1-2.1-2.3/backend && npm install",
    "build:ai": "cd task-2.2/backend && npm install",
    "start": "node task-1.1-2.1-2.3/backend/src/index.js",
    "start:ai": "node task-2.2/backend/src/index.js"
  }
}
```

---

## Step 4: Update Environment Files for Production

### 4a. Backend .env.production (Task 2.1)
Create: `task-1.1-2.1-2.3/backend/.env.production`

```env
DATABASE_URL=postgresql://user:password@your-db-host:5432/campaign_db
JWT_SECRET=your-super-secret-jwt-key-production
PORT=4000
NODE_ENV=production
USE_MOCK_DB=false
FRONTEND_URL=https://your-dashboard-domain.vercel.app
```

### 4b. Microservice .env.production (Task 2.2)
Create: `task-2.2/backend/.env.production`

```env
PORT=5000
NODE_ENV=production
USE_MOCK_AI=true
OPENAI_API_KEY=sk-your-key-if-you-have-one
```

### 4c. Frontend .env.production (Task 1.1)
Create: `task-1.1-2.1-2.3/frontend/.env.production`

```env
VITE_API_URL=https://your-backend-domain.vercel.app
```

### 4d. Frontend .env.production (Task 1.2)
Create: `task-1.2/frontend/.env.production`

```env
VITE_AI_URL=https://your-microservice-domain.vercel.app
```

---

## Step 5: Deploy via Vercel Dashboard

### Option A: Deploy Separately (Recommended)

**Deploy Backend API (Task 2.1):**
1. Go to https://vercel.com/new
2. Import Git Repository
3. Select `task-1.1-2.1-2.3/backend` as root directory
4. Add Environment Variables:
   - `JWT_SECRET` = your-secret-key
   - `DATABASE_URL` = your-postgresql-url
   - `USE_MOCK_DB` = false (or true for quick deploy)
   - `NODE_ENV` = production
5. Click **Deploy**
6. Copy the deployment URL (e.g., `https://api-xyz.vercel.app`)

**Deploy Microservice (Task 2.2):**
1. Go to https://vercel.com/new
2. Import Git Repository
3. Select `task-2.2/backend` as root directory
4. Add Environment Variables:
   - `NODE_ENV` = production
   - `USE_MOCK_AI` = true
5. Click **Deploy**
6. Copy the deployment URL (e.g., `https://ai-xyz.vercel.app`)

**Deploy Dashboard Frontend (Task 1.1):**
1. Go to https://vercel.com/new
2. Import Git Repository
3. Select `task-1.1-2.1-2.3/frontend` as root directory
4. Add Environment Variables:
   - `VITE_API_URL` = https://api-xyz.vercel.app (from backend deploy)
5. Click **Deploy**
6. Copy the deployment URL (e.g., `https://dashboard-xyz.vercel.app`)

**Deploy Brief Builder Frontend (Task 1.2):**
1. Go to https://vercel.com/new
2. Import Git Repository
3. Select `task-1.2/frontend` as root directory
4. Add Environment Variables:
   - `VITE_AI_URL` = https://ai-xyz.vercel.app (from microservice deploy)
5. Click **Deploy**

---

## Step 6: Update Frontend API Calls

### For Task 1.1 Dashboard
Update: `task-1.1-2.1-2.3/frontend/src/pages/Dashboard.jsx`

```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:4000';

// Use it like:
const response = await fetch(`${API_BASE_URL}/campaigns`);
```

### For Task 1.2 Brief Builder
Update: `task-1.2/frontend/src/App.jsx`

```javascript
const AI_URL = process.env.VITE_AI_URL || 'http://localhost:5000';

// Use it like:
const response = await fetch(`${AI_URL}/generate/copy`, {
  method: 'POST',
  // ...
});
```

---

## Step 7: Setup PostgreSQL Database (Optional)

For production, don't use mock database. Set up real PostgreSQL:

### Option A: Free PostgreSQL (Railway, Neon)
1. **Railway.app**:
   - Sign up at https://railway.app
   - Create new PostgreSQL project
   - Copy connection string
   - Set `DATABASE_URL` in Vercel env vars

2. **Neon.tech**:
   - Sign up at https://neon.tech
   - Create database
   - Copy connection string
   - Set `DATABASE_URL` in Vercel env vars

### Option B: Managed PostgreSQL
- **AWS RDS** - $0-20/month
- **Azure Database** - $13+/month
- **DigitalOcean Managed** - $15+/month

---

## Step 8: Vercel Environment Variables

On Vercel Dashboard:

**For Backend API:**
```
JWT_SECRET = your-secret-key-min-32-chars
DATABASE_URL = postgresql://user:pass@host:5432/db
USE_MOCK_DB = false
NODE_ENV = production
```

**For Microservice:**
```
NODE_ENV = production
USE_MOCK_AI = true
OPENAI_API_KEY = sk-xxx (optional)
```

**For Dashboard Frontend:**
```
VITE_API_URL = https://api-abc123.vercel.app
```

**For Brief Builder Frontend:**
```
VITE_AI_URL = https://ai-abc123.vercel.app
```

---

## Step 9: Domain Setup (Optional)

In Vercel Dashboard → Settings → Domains:

```
Dashboard:     https://dashboard.yourdomain.com
Brief Builder: https://brief.yourdomain.com
Backend API:   https://api.yourdomain.com
Microservice:  https://ai.yourdomain.com
```

---

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] vercel.json files created
- [ ] Build scripts configured
- [ ] .env.production files created
- [ ] PostgreSQL database set up (or using mock)
- [ ] Backend API deployed → Get URL
- [ ] Microservice deployed → Get URL
- [ ] Frontend environment variables updated
- [ ] Dashboard frontend deployed
- [ ] Brief Builder frontend deployed
- [ ] Tested all endpoints
- [ ] Custom domains configured (optional)

---

## Verification

After deployment, test these URLs:

```bash
# Backend API Health
https://api-abc123.vercel.app/health

# API Documentation
https://api-abc123.vercel.app/api-docs

# Microservice Health
https://ai-abc123.vercel.app/health

# Dashboard Frontend
https://dashboard-abc123.vercel.app

# Brief Builder Frontend
https://brief-abc123.vercel.app
```

---

## Troubleshooting

### "Cannot find module"
```bash
# Add to package.json engines
"engines": {
  "node": "18.x"
}
```

### CORS Errors
Update backend CORS settings:
```javascript
app.use(cors({
  origin: [
    'https://dashboard-abc123.vercel.app',
    'https://brief-abc123.vercel.app',
    'http://localhost:3001',
    'http://localhost:3002'
  ],
  credentials: true
}));
```

### Database Connection Failed
- Check `DATABASE_URL` format
- Verify IP allowlist on database
- Use `USE_MOCK_DB=true` temporarily to test

### 502 Bad Gateway
- Check function logs in Vercel
- Ensure Node.js version matches
- Verify all dependencies in package.json

---

## Quick Deploy Script

Run this to deploy all services:

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for Vercel deployment"
git push

# 2. Deploy to Vercel (do this in Vercel Dashboard for each folder)
# Or use Vercel CLI:
npm install -g vercel

# Deploy backend
cd task-1.1-2.1-2.3/backend
vercel --prod

# Deploy microservice
cd ../../task-2.2/backend
vercel --prod

# Deploy frontends (same process)
cd ../../task-1.1-2.1-2.3/frontend
vercel --prod

cd ../../task-1.2/frontend
vercel --prod
```

---

## Production Checklist

- [ ] Use strong JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Use real PostgreSQL database
- [ ] Enable rate limiting
- [ ] Set CORS properly
- [ ] Use HTTPS only
- [ ] Monitor error logs
- [ ] Set up alarms/alerts
- [ ] Backup database regularly
- [ ] Update dependencies

---

**🎉 Your advertising platform is now live on Vercel!**

For more help: https://vercel.com/docs

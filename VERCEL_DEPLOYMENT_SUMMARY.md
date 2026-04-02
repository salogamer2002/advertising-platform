# ⚡ Vercel Deployment Quick Summary

## What You'll Get (Final URLs)

After deploying all 4 services, you'll have:

```
✅ Backend API
   https://advertising-api-xyz.vercel.app
   https://advertising-api-xyz.vercel.app/api-docs

✅ Dashboard  
   https://advertising-dashboard-abc.vercel.app

✅ Brief Builder
   https://brief-builder-def.vercel.app

✅ Microservice
   https://advertising-microservice-def.vercel.app
```

---

## What You Need to Provide

### Option 1: No Credentials Needed (Quick Demo)
- Just use GitHub account
- Use mock database (`USE_MOCK_DB=true`)
- Everything will work instantly

### Option 2: With Real Database
- PostgreSQL URL (get free from Neon.tech or Railway)
- JWT Secret (any strong string)

---

## Step-by-Step for Each Service

### 1️⃣ Backend API (Task 2.1)
```
✓ Go to https://vercel.com/new
✓ Select your GitHub repo
✓ Root Directory: task-1.1-2.1-2.3/backend
✓ Add Environment Variables:
  - DATABASE_URL (optional)
  - JWT_SECRET = create-any-strong-string
  - USE_MOCK_DB = true
✓ Click Deploy
→ You get: https://advertising-api-xyz.vercel.app
```

### 2️⃣ Microservice (Task 2.2)
```
✓ Go to https://vercel.com/new
✓ Select same GitHub repo
✓ Root Directory: task-2.2/backend
✓ Add Environment Variables:
  - NODE_ENV = production
  - USE_MOCK_AI = true
✓ Click Deploy
→ You get: https://advertising-microservice-def.vercel.app
```

### 3️⃣ Dashboard (Task 1.1)
```
✓ Go to https://vercel.com/new
✓ Select same GitHub repo
✓ Root Directory: task-1.1-2.1-2.3/frontend
✓ Add Environment Variables:
  - VITE_API_URL = https://advertising-api-xyz.vercel.app
    (use URL from step 1)
✓ Click Deploy
→ You get: https://advertising-dashboard-abc.vercel.app
```

### 4️⃣ Brief Builder (Task 1.2)
```
✓ Go to https://vercel.com/new
✓ Select same GitHub repo
✓ Root Directory: task-1.2/frontend
✓ Add Environment Variables:
  - VITE_AI_URL = https://advertising-microservice-def.vercel.app
    (use URL from step 2)
✓ Click Deploy
→ You get: https://brief-builder-def.vercel.app
```

---

## Credentials/Information We Might Need

### If Using Mock Database (Recommended for Testing)
- ❌ No credentials needed
- Everything works out of the box

### If Using Real PostgreSQL
- 📝 Database URL from Neon.tech or Railway
- 🔐 Strong JWT Secret (min 32 chars)

### Optional
- 🎯 OpenAI API Key (for real AI instead of mock)
- 🌍 Custom domain name

---

## Total Deployment Time

- Creating Vercel account: 2 minutes
- Pushing to GitHub: 2 minutes
- Deploying all 4 services: 10-15 minutes
- **Total: ~20 minutes**

---

## ✅ After Deployment, Test:

1. Open Dashboard: https://advertising-dashboard-abc.vercel.app
   - Should show campaign data

2. Open Brief Builder: https://brief-builder-def.vercel.app
   - Fill form and generate

3. Check API: https://advertising-api-xyz.vercel.app/health
   - Should show `{"status":"ok"}`

---

## 🚀 Ready?

**Just tell me:**
1. Your GitHub username
2. Repo name (or I can suggest: `advertising-platform`)
3. If using mock DB or real DB
4. If yes to real DB, do you have PostgreSQL URL?

Then follow the deployment guide: `VERCEL_FULL_DEPLOYMENT.md`

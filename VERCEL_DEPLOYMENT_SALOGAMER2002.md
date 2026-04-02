# 🚀 Vercel Deployment Guide for salogamer2002

**GitHub Username:** salogamer2002  
**Date:** April 2, 2026

---

## ✅ Step 1: Push Code to GitHub

Run these commands in PowerShell from the project root:

```powershell
cd C:\Users\hp\Desktop\b_T4SVqdhK3v4-1775045495457

# Initialize git
git init

# Configure git
git config user.name "salogamer2002"
git config user.email "your-email@example.com"

# Add all files
git add .

# Create commit
git commit -m "Advertising Platform - Ready for Vercel deployment"

# Add GitHub remote
git remote add origin https://github.com/salogamer2002/advertising-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Result:** Your code will be at: `https://github.com/salogamer2002/advertising-platform`

---

## 🔧 Step 2: Deploy Backend API (Task 2.1)

### 2a - Create Vercel Project

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Login with GitHub → Select `salogamer2002/advertising-platform`
4. When it asks where to configure:
   - **Project Name**: `advertising-api`
   - **Framework Preset**: `Other`
   - **Root Directory**: `task-1.1-2.1-2.3/backend`
5. Click "Deploy"

### 2b - Add Environment Variables

After deployment, go to your project:
- https://vercel.com/dashboard/projects

Click on `advertising-api` → Settings → Environment Variables

Add these:

| Name | Value |
|------|-------|
| `DATABASE_URL` | (leave empty for mock DB) |
| `JWT_SECRET` | `super-secret-key-2024-advertising-platform-!@#$%` |
| `NODE_ENV` | `production` |
| `USE_MOCK_DB` | `true` |
| `PORT` | `4000` |

Click "Save"

### 2c - Redeploy

Go to Deployments → Click latest → "Redeploy" button

**🎉 Your Backend API URL:** `https://advertising-api.salogamer2002.vercel.app`

---

## 🤖 Step 3: Deploy AI Microservice (Task 2.2)

### 3a - Create Another Vercel Project

1. Go to https://vercel.com/new again
2. Import same repo: `salogamer2002/advertising-platform`
3. Set:
   - **Project Name**: `advertising-microservice`
   - **Framework Preset**: `Other`
   - **Root Directory**: `task-2.2/backend`
4. Click "Deploy"

### 3b - Add Environment Variables

After deployment, go to project Settings → Environment Variables

Add these:

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |
| `USE_MOCK_AI` | `true` |
| `PORT` | `5000` |

Click "Save" → "Redeploy"

**🎉 Your Microservice URL:** `https://advertising-microservice.salogamer2002.vercel.app`

---

## 📊 Step 4: Deploy Dashboard (Task 1.1)

### 4a - Create Another Vercel Project

1. Go to https://vercel.com/new
2. Import: `salogamer2002/advertising-platform`
3. Set:
   - **Project Name**: `advertising-dashboard`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `task-1.1-2.1-2.3/frontend`
4. Click "Deploy"

### 4b - Add Environment Variables

After deployment, Settings → Environment Variables

Add this:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://advertising-api.salogamer2002.vercel.app` |

Click "Save" → "Redeploy"

**🎉 Your Dashboard URL:** `https://advertising-dashboard.salogamer2002.vercel.app`

---

## ✍️ Step 5: Deploy Brief Builder (Task 1.2)

### 5a - Create Another Vercel Project

1. Go to https://vercel.com/new
2. Import: `salogamer2002/advertising-platform`
3. Set:
   - **Project Name**: `brief-builder`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `task-1.2/frontend`
4. Click "Deploy"

### 5b - Add Environment Variables

After deployment, Settings → Environment Variables

Add this:

| Name | Value |
|------|-------|
| `VITE_AI_URL` | `https://advertising-microservice.salogamer2002.vercel.app` |

Click "Save" → "Redeploy"

**🎉 Your Brief Builder URL:** `https://brief-builder.salogamer2002.vercel.app`

---

## 📍 Your Final URLs

After all 4 deployments, you'll have:

```
✅ Backend API
   https://advertising-api.salogamer2002.vercel.app
   API Docs: https://advertising-api.salogamer2002.vercel.app/api-docs
   Health: https://advertising-api.salogamer2002.vercel.app/health

✅ Dashboard (Task 1.1)
   https://advertising-dashboard.salogamer2002.vercel.app

✅ Brief Builder (Task 1.2)
   https://brief-builder.salogamer2002.vercel.app

✅ AI Microservice
   https://advertising-microservice.salogamer2002.vercel.app
   Health: https://advertising-microservice.salogamer2002.vercel.app/health
```

---

## ✅ Testing Checklist

After all 4 are deployed, test each:

- [ ] Backend Health: https://advertising-api.salogamer2002.vercel.app/health
  - Should show: `{"status":"ok","message":"Server is running"}`

- [ ] API Docs: https://advertising-api.salogamer2002.vercel.app/api-docs
  - Should show Swagger UI with all endpoints

- [ ] Microservice Health: https://advertising-microservice.salogamer2002.vercel.app/health
  - Should show service info

- [ ] Dashboard: https://advertising-dashboard.salogamer2002.vercel.app
  - Should display campaign metrics and data
  - Should fetch from your backend API

- [ ] Brief Builder: https://brief-builder.salogamer2002.vercel.app
  - Should show 4-step form
  - Fill form → Click "Generate Brief"
  - Should get AI response from your microservice

---

## 🐛 Troubleshooting

**If Dashboard shows "Loading..." forever:**
- Check: https://advertising-api.salogamer2002.vercel.app/health works
- Check environment variable: `VITE_API_URL` is correct
- Check browser console (F12) for errors

**If Brief Builder doesn't generate:**
- Check: https://advertising-microservice.salogamer2002.vercel.app/health works
- Check environment variable: `VITE_AI_URL` is correct
- Check browser console for errors

**If deployment fails:**
- Go to project → Deployments → Click latest → Check logs
- Look for error messages
- Most common: Wrong root directory or missing dependencies

---

## 📝 Quick Command Reference

```powershell
# Push updates to GitHub
git add .
git commit -m "Update message"
git push

# Vercel auto-deploys when you push to GitHub!
# Just go to https://vercel.com and click "Redeploy" if needed
```

---

## 🎯 Next Steps (Optional)

### Add Custom Domains
In each Vercel project → Settings → Domains:
- `api.yourdomain.com` → advertising-api
- `dashboard.yourdomain.com` → advertising-dashboard
- `brief.yourdomain.com` → brief-builder
- `ai.yourdomain.com` → advertising-microservice

### Use Real Database (Later)
1. Get PostgreSQL URL from Neon.tech (free)
2. Update Backend environment variable: `DATABASE_URL`
3. Set: `USE_MOCK_DB = false`
4. Redeploy

---

## 📞 Your Deployment URLs Summary

**For salogamer2002:**

```
GitHub Repo: https://github.com/salogamer2002/advertising-platform

Vercel Dashboard: https://vercel.com/dashboard

Deployed Apps:
  🔧 API:           https://advertising-api.salogamer2002.vercel.app
  📊 Dashboard:     https://advertising-dashboard.salogamer2002.vercel.app
  ✍️ Brief Builder:  https://brief-builder.salogamer2002.vercel.app
  🤖 Microservice:   https://advertising-microservice.salogamer2002.vercel.app
```

---

**Ready to deploy? Start with Step 1 above!**

If you get stuck, check the Troubleshooting section or the Vercel build logs. 🚀

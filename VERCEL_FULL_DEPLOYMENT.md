# 🚀 Complete Vercel Deployment Guide - All 4 Services

## 📋 Prerequisites

You will need:
1. **Vercel Account** - https://vercel.com (free)
2. **GitHub Account** - https://github.com (free)
3. **PostgreSQL Database** (optional - can use mock)

---

## Step 1: Push Code to GitHub

First, create a GitHub repository and push your code:

```powershell
cd C:\Users\hp\Desktop\b_T4SVqdhK3v4-1775045495457

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Advertising Platform - Ready for Vercel"

# Add GitHub remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Each Service Separately

You'll deploy **4 separate Vercel projects** to get different URLs.

---

## 🔧 **SERVICE 1: Backend API (Task 2.1)**

### 2.1a - Create Vercel Project

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Connect your GitHub account and select your repo
4. Set:
   - **Project Name**: `advertising-api`
   - **Framework Preset**: `Other`
   - **Root Directory**: `task-1.1-2.1-2.3/backend`

### 2.1b - Add Environment Variables

In Vercel dashboard, click "Environment Variables" and add:

```
DATABASE_URL = postgresql://user:password@host:5432/campaign_db
JWT_SECRET = your-super-secret-key-min-32-chars-!@#$%
NODE_ENV = production
USE_MOCK_DB = true
PORT = 4000
```

**If using mock database (recommended for testing):**
- Leave `USE_MOCK_DB = true`
- Leave `DATABASE_URL` empty

**To use real PostgreSQL:**
- Set `USE_MOCK_DB = false`
- Provide real `DATABASE_URL` (see PostgreSQL section below)

### 2.1c - Deploy

Click "Deploy" button

**Result:** You'll get a URL like: `https://advertising-api-xyz.vercel.app`

---

## 📊 **SERVICE 2: Dashboard Frontend (Task 1.1)**

### 2.2a - Create Vercel Project

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your repo
4. Set:
   - **Project Name**: `advertising-dashboard`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `task-1.1-2.1-2.3/frontend`

### 2.2b - Add Environment Variables

Add these in Vercel:

```
VITE_API_URL = https://advertising-api-xyz.vercel.app
```

*(Replace `advertising-api-xyz` with your actual backend URL from Step 1)*

### 2.2c - Deploy

Click "Deploy"

**Result:** `https://advertising-dashboard-abc.vercel.app`

---

## ✍️ **SERVICE 3: Brief Builder Frontend (Task 1.2)**

### 2.3a - Create Vercel Project

1. Go to https://vercel.com/new
2. Select your repo
3. Set:
   - **Project Name**: `brief-builder`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `task-1.2/frontend`

### 2.3b - Add Environment Variables

```
VITE_AI_URL = https://advertising-microservice-def.vercel.app
```

*(Replace with your microservice URL from Step 4)*

### 2.3c - Deploy

Click "Deploy"

**Result:** `https://brief-builder-def.vercel.app`

---

## 🤖 **SERVICE 4: AI Microservice (Task 2.2)**

### 2.4a - Create Vercel Project

1. Go to https://vercel.com/new
2. Select your repo
3. Set:
   - **Project Name**: `advertising-microservice`
   - **Framework Preset**: `Other`
   - **Root Directory**: `task-2.2/backend`

### 2.4b - Add Environment Variables

```
NODE_ENV = production
USE_MOCK_AI = true
PORT = 5000
OPENAI_API_KEY = (leave empty for mock)
```

### 2.4c - Deploy

Click "Deploy"

**Result:** `https://advertising-microservice-def.vercel.app`

---

## 📍 Final URLs (After All 4 Deployments)

After deploying all 4 services, you'll have:

```
🔧 Backend API
   URL: https://advertising-api-xyz.vercel.app
   API Docs: https://advertising-api-xyz.vercel.app/api-docs
   Health: https://advertising-api-xyz.vercel.app/health

📊 Dashboard
   URL: https://advertising-dashboard-abc.vercel.app
   API Endpoint: https://advertising-api-xyz.vercel.app/campaigns/public/list

✍️ Brief Builder
   URL: https://brief-builder-def.vercel.app
   AI Endpoint: https://advertising-microservice-def.vercel.app/generate/copy

🤖 Microservice
   URL: https://advertising-microservice-def.vercel.app
   Health: https://advertising-microservice-def.vercel.app/health
```

---

## 🗄️ **Optional: Set Up PostgreSQL Database**

If you want to use a **real database** instead of mock:

### Option A: Free PostgreSQL (Recommended)

**Using Neon.tech** (Free tier):
1. Go to https://neon.tech
2. Sign up and create a project
3. Copy the connection string (looks like: `postgresql://user:pass@host.neon.tech:5432/dbname`)
4. In Vercel Backend environment variables, set:
   - `DATABASE_URL = <your-connection-string>`
   - `USE_MOCK_DB = false`

**Using Railway** (Free tier):
1. Go to https://railway.app
2. Create new PostgreSQL project
3. Copy the connection string
4. Add to Vercel as above

### Option B: Paid PostgreSQL
- **AWS RDS**: $0-20/month
- **Azure Database**: $13+/month
- **DigitalOcean Managed**: $15+/month

---

## ✅ Deployment Checklist

- [ ] GitHub account created
- [ ] Code pushed to GitHub
- [ ] Backend API deployed → Get URL
- [ ] Dashboard deployed → Update VITE_API_URL
- [ ] Microservice deployed → Get URL
- [ ] Brief Builder deployed → Update VITE_AI_URL
- [ ] Test Dashboard URL
- [ ] Test Brief Builder URL
- [ ] Test API Docs URL
- [ ] All pages loading ✅

---

## 🧪 Test All Services After Deployment

### 1. Test Backend API
```bash
curl https://advertising-api-xyz.vercel.app/health
# Should return: {"status":"ok","message":"Server is running"}
```

### 2. Test Dashboard
Open: https://advertising-dashboard-abc.vercel.app
- Should show campaign metrics
- Should fetch from your backend API

### 3. Test Brief Builder
Open: https://brief-builder-def.vercel.app
- Fill the form
- Click "Generate Brief"
- Should call your microservice

### 4. Test API Docs
Open: https://advertising-api-xyz.vercel.app/api-docs
- Should show Swagger UI with all endpoints

---

## 🐛 Troubleshooting

### "Cannot find module" Error
- Make sure `Root Directory` is set correctly
- Check `package.json` exists in that directory

### Dashboard shows "Loading..." forever
- Check `VITE_API_URL` is correct
- Check backend URL is accessible: `https://advertising-api-xyz.vercel.app/health`

### Brief Builder doesn't generate
- Check `VITE_AI_URL` is correct
- Check microservice is running: `https://advertising-microservice-def.vercel.app/health`

### Database Connection Failed
- Use `USE_MOCK_DB=true` to test first
- Get free PostgreSQL from Neon.tech or Railway
- Verify connection string format

---

## 📝 Deployment Order (IMPORTANT)

Deploy in this order:

1. **Backend API** first → Get URL
2. **Microservice** second → Get URL
3. **Dashboard** third → Use Backend API URL
4. **Brief Builder** last → Use Microservice URL

---

## 🔐 Security Notes

- Never commit `.env` files to GitHub
- Use strong `JWT_SECRET` (min 32 chars)
- Set `NODE_ENV=production`
- Consider enabling GitHub -> Vercel auto-deploy (Settings -> Git)

---

## 📞 Need Help?

If deployment fails:

1. Check Vercel Build Logs (Projects -> Settings -> Build & Deployment)
2. Verify environment variables are set correctly
3. Test locally first: `npm run dev`
4. Check Node version compatibility

---

## 💡 Advanced: Custom Domain (Optional)

After deployment, add custom domains:

In Vercel Project Settings → Domains:
- `api.yourdomain.com` → Backend API
- `dashboard.yourdomain.com` → Dashboard
- `brief.yourdomain.com` → Brief Builder
- `ai.yourdomain.com` → Microservice

---

**Ready to deploy? Follow the steps above and share your final URLs!** 🚀

# 🚀 QUICK DEPLOYMENT GUIDE - Railway.app

## What You'll Get
✅ Live website link (e.g., `https://botnet-frontend-prod.up.railway.app`)  
✅ Free MongoDB database  
✅ Automatic deployments on GitHub push  
✅ Free HTTPS/SSL certificate  
✅ Free monitoring and logs  

## 5-Step Deployment Process

### STEP 1: Push Your Code to GitHub
```powershell
cd c:\Users\mdaaf\botnet_detection

# Check git status
git status

# If not a git repo, initialize it
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Add your GitHub repo (replace USERNAME with your GitHub username)
git remote add origin https://github.com/aafil53/Botnet_Detection.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### STEP 2: Create Railway Account
1. Go to **https://railway.app**
2. Click "Start Free" or "Sign Up"
3. Login with GitHub
4. Authorize Railway

### STEP 3: Create New Railway Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Search for **Botnet_Detection**
4. Select it and click "Deploy"
5. Wait for Railway to detect the Docker setup

### STEP 4: Add MongoDB Database
1. In your Railway project, click **"Add"** button
2. Select **"Add from Marketplace"**
3. Find and click **"MongoDB"**
4. Click **"Add MongoDB"**
7. Railway automatically configures the connection string

### STEP 5: Configure Environment Variables

#### For Backend Service:
1. Click on **"backend"** service
2. Go to **"Variables"** tab
3. Click **"Add Variable"** and add:
   ```
   SECRET_KEY=your-super-secret-random-key-minimum-32-characters-long-xyz123
   DEBUG=false
   ```
   Note: Leave DATABASE_URL empty - Railway will auto-set it from MongoDB

#### For Frontend Service:
1. Click on **"frontend"** service
2. Go to **"Variables"** tab
3. Copy the **Backend URL** from backend service settings
4. Add variable:
   ```
   VITE_API_URL=https://[your-backend-url-from-railway]
   ```

## Getting Your Live Website Link

1. Go to **Backend service** → **Settings**
2. Under "Public Networking", enable it
3. Copy the URL (e.g., `https://botnet-backend-prod.up.railway.app`)

4. Go to **Frontend service** → **Settings**  
5. Under "Public Networking", enable it
6. Copy the URL (e.g., `https://botnet-frontend-prod.up.railway.app`) ← **THIS IS YOUR WEBSITE LINK**

## Test Your Deployment

Open your browser and visit:
- **Frontend:** `https://botnet-frontend-prod.up.railway.app`
- **Backend API:** `https://botnet-backend-prod.up.railway.app/docs`

## Update Your Code & Redeploy

Just push to GitHub:
```powershell
git add .
git commit -m "Update"
git push origin main
```
Railway automatically redeploys!

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check logs in Railway dashboard → Click service → Logs tab |
| Frontend can't connect to backend | Verify `VITE_API_URL` is correct backend URL |
| Database connection error | Wait 30 seconds for MongoDB to initialize, then redeploy |
| Page shows error 500 | Check backend logs for database issues |

## Cost

- **Free:** $5 credit/month (covers most hobby projects)
- **Additional:** $0.000115 per hour per GB RAM

## Your Deployment is Complete! 🎉

**Share your link:** `https://botnet-frontend-prod.up.railway.app`

---

Need help? Check Railway docs: https://docs.railway.app

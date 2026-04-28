# Quick Deployment Checklist

Complete these steps in order to deploy your app to Vercel, GitHub, and MongoDB.

## ✅ Pre-Deployment Checklist

- [ ] Node.js and npm installed
- [ ] Git installed
- [ ] GitHub account created
- [ ] MongoDB Atlas account created
- [ ] Vercel account created (use GitHub login)

---

## 🔧 Step 1: Local Setup (5 minutes)

### 1.1 Create Local Environment File

```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Edit .env.local with your values:
# MONGODB_URI=your_mongodb_connection_string
```

### 1.2 Test Locally

```bash
npm install
npm run dev
# Visit http://localhost:3000
```

✅ **Verify**: App loads and audio button works

---

## 🌐 Step 2: GitHub Setup (5 minutes)

### 2.1 Create Repository on GitHub

1. Go to https://github.com/new
2. **Repository name**: `ei-story-assessment`
3. **Description**: "EI Story-Based Assessment Tool"
4. **Visibility**: Private (recommended) or Public
5. Click **Create repository**

### 2.2 Push Code to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/ei-story-assessment.git
git branch -M main
git add .
git commit -m "Initial commit: EI Assessment app"
git push -u origin main
```

✅ **Verify**: Code appears on GitHub.com/YOUR_USERNAME/ei-story-assessment

---

## 📊 Step 3: MongoDB Atlas Setup (10 minutes)

### 3.1 Create Free Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign in or create account
3. Create new project → `EI Assessment`
4. Build a Cluster:
   - **Cloud Provider**: AWS
   - **Region**: Closest to your users
   - **Tier**: M0 (Free)
5. Click **Create Cluster** (wait 5-10 minutes)

### 3.2 Create Database User

1. Go to **Database Access** → **+ Add New Database User**
2. **Username**: `ei_user`
3. **Password**: Generate random (copy it!)
4. **Built-in Role**: `readWriteAnyDatabase`
5. Click **Add User**

### 3.3 Get Connection String

1. Go to **Clusters** → Your cluster → **Connect**
2. Click **Drivers**
3. Copy connection string:
   ```
   mongodb+srv://ei_user:PASSWORD@cluster0.xxxxx.mongodb.net/ei_assessment?retryWrites=true&w=majority
   ```
4. Replace `PASSWORD` with your password

### 3.4 Whitelist IP Addresses

1. Go to **Network Access**
2. Click **+ Add IP Address**
3. **For development**: Add your current IP (find at https://whatismyipaddress.com)
4. **For Vercel**: Add `0.0.0.0/0` (allows all IPs)
5. Click **Confirm**

### 3.5 Update .env.local

```bash
# Edit .env.local
MONGODB_URI=mongodb+srv://ei_user:PASSWORD@cluster0.xxxxx.mongodb.net/ei_assessment?retryWrites=true&w=majority
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

✅ **Verify Locally**: 
```bash
npm run dev
# Check browser console - no connection errors
```

---

## 🚀 Step 4: Vercel Deployment (10 minutes)

### 4.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 4.2 Deploy to Vercel

```bash
vercel
```

**Answer prompts:**
- "Set up and deploy?" → **Yes**
- "Which scope?" → Select your account
- "Link to existing project?" → **No** (first time)
- "Project name?" → `ei-story-assessment`
- "Directory?" → `.` (current)
- "Want to modify settings?" → **No**

### 4.3 Add MongoDB URI to Vercel

1. Open https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **+ Add New**
   - **Name**: `MONGODB_URI`
   - **Value**: Your MongoDB connection string
   - **Environments**: Production, Preview, Development (select all)
5. Click **Save**

### 4.4 Redeploy with Environment Variables

```bash
vercel --prod
```

✅ **Verify Deployment**: 
- Vercel shows deployment URL (e.g., https://ei-story-assessment.vercel.app)
- App loads without errors
- API endpoints work

---

## 🎉 Step 5: Verify Everything Works

### Local Development

```bash
npm run dev
# Test: http://localhost:3000
# Should connect to MongoDB and display data
```

### Production (Vercel)

```bash
# Copy URL from Vercel dashboard
# Example: https://ei-story-assessment.vercel.app

# Test in browser:
# 1. Page loads
# 2. Audio button works
# 3. API calls succeed
# 4. Data saves to MongoDB
```

### Check Logs (if issues)

```bash
# Vercel logs
vercel logs --follow

# MongoDB Atlas
# Dashboard → Monitoring → see connection activity
```

---

## 📝 Troubleshooting

### Issue: MongoDB Connection Error

**Error**: `MongoServerSelectionError`

**Solution**:
1. Check connection string in Vercel environment variables
2. Verify IP whitelist in MongoDB Atlas Network Access
3. Ensure username/password is correct

### Issue: Audio Files 404

**Error**: Audio plays locally but not on Vercel

**Solution**:
1. Verify audio files in `public/audio/`
2. Check `lib/audioPath.ts` resolves correctly
3. Rebuild: `vercel --prod`

### Issue: Vercel Build Fails

**Solution**:
1. Check build logs: `vercel logs`
2. Test locally: `npm run build`
3. Verify Node.js version in `package.json`
4. Check environment variables are set

---

## 🔄 Future Deployments

After initial setup, deployment is automatic:

### Push Code Update

```bash
git add .
git commit -m "Feature: description"
git push origin main
```

**Vercel automatically:**
1. Detects push to GitHub
2. Rebuilds your app
3. Deploys to production
4. Shows status on dashboard

### Update Environment Variables

1. Go to Vercel dashboard
2. Settings → Environment Variables
3. Make changes
4. Vercel automatically redeploys

---

## 🛡️ Security Checklist

- ✅ `.env.local` is in `.gitignore` (not committed)
- ✅ `MONGODB_URI` stored in Vercel environment variables (not in code)
- ✅ MongoDB password is strong and unique
- ✅ Only necessary IPs whitelisted in MongoDB Network Access
- ✅ GitHub repository is private (if sensitive)

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.mongodb.com/atlas/
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Full Guide**: See `DEPLOYMENT_GUIDE.md`

---

## 💬 Support

If you encounter issues:

1. Check `DEPLOYMENT_GUIDE.md` for detailed instructions
2. Review Vercel logs: `vercel logs --follow`
3. Check MongoDB Atlas monitoring
4. Test locally first: `npm run dev`

---

**Last Updated**: April 2026
**Estimated Total Time**: 30-40 minutes

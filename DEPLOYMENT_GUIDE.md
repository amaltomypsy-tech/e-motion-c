# EI Story Assessment - Deployment Setup

Complete guide for hosting on Vercel, GitHub, and MongoDB Atlas.

## Quick Start

### 1. GitHub Setup

```bash
# Initialize git repository (if not already done)
cd c:\Users\Amal Tomy\Desktop\ei proto\ei-story-assessment
git init
git add .
git commit -m "Initial commit"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/ei-story-assessment.git
git branch -M main
git push -u origin main
```

### 2. MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free tier
3. Create a new cluster:
   - **Cloud Provider**: AWS/Azure/GCP (choose closest to your users)
   - **Region**: Pick your preferred region
   - **Tier**: M0 (free tier)
4. Create a database user:
   - Go to Database Access
   - Add new user: create username and password
   - Grant read/write to any database
5. Get connection string:
   - Go to Clusters → Connect
   - Choose "Drivers"
   - Copy connection string
   - Replace `<password>` and `<username>` with your credentials
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ei_assessment?retryWrites=true&w=majority`

### 3. Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (first time)
vercel

# Follow prompts:
# - Link to GitHub project
# - Set project name
# - Set MongoDB URI environment variable
```

---

## Detailed Setup Instructions

### Step 1: Prepare Repository

Create necessary configuration files:

**`.gitignore`** - Already created, excludes sensitive files

**`.env.local`** - Local development (not committed)
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ei_assessment?retryWrites=true&w=majority
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**`.env.example`** - Template for team (commit this)
```
MONGODB_URI=your-mongodb-uri-here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Step 2: GitHub Repository

**Create repository on GitHub:**
1. Go to https://github.com/new
2. Name: `ei-story-assessment`
3. Description: "EI Story-Based Assessment Tool"
4. Make it private if using paid GitHub plan
5. Click "Create repository"

**Connect local repo:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/ei-story-assessment.git
git branch -M main
git push -u origin main
```

### Step 3: MongoDB Atlas

**Create Free Cluster:**
1. Visit https://www.mongodb.com/cloud/atlas
2. Create account or sign in
3. Create a new project (or use default)
4. Build a cluster
   - Select "Create" → M0 (Free Tier)
   - Choose cloud provider and region closest to your users
   - Click "Create Cluster"
5. Wait for cluster to be ready (5-10 minutes)

**Create Database User:**
1. Go to "Database Access"
2. Click "+ Add New Database User"
3. Enter username: `ei_assessment_user`
4. Enter password: Generate secure password
5. Set permissions: "Read and write to any database"
6. Click "Add User"

**Get Connection String:**
1. Go to "Database" → Your cluster
2. Click "Connect"
3. Choose "Drivers"
4. Copy connection string:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/ei_assessment?retryWrites=true&w=majority
   ```
5. Replace `USERNAME` and `PASSWORD` with credentials from step above
6. **Keep this secret!** Don't commit to GitHub

**Whitelist IP Address (for development):**
1. Go to "Network Access"
2. Click "+ Add IP Address"
3. For development: Add your computer's IP (find at whatismyipaddress.com)
4. For Vercel: Add `0.0.0.0/0` (allows all IPs - Vercel uses dynamic IPs)

### Step 4: Vercel Deployment

**Install Vercel CLI:**
```bash
npm install -g vercel
```

**Deploy application:**
```bash
cd c:\Users\Amal Tomy\Desktop\ei proto\ei-story-assessment
vercel
```

**During deployment, you'll be asked:**
- ✅ "Set up and deploy?" → Yes
- ✅ "Which scope?" → Select your account
- ✅ "Link to existing project?" → No (first time)
- ✅ "What's your project's name?" → ei-story-assessment
- ✅ "In which directory?" → ./ (current directory)
- ✅ "Want to modify these settings?" → No

**Add Environment Variables in Vercel:**
1. Go to https://vercel.com/dashboard
2. Select project → Settings → Environment Variables
3. Add:
   - **Key**: `MONGODB_URI`
   - **Value**: Your MongoDB Atlas connection string
   - **Environments**: Production, Preview, Development
4. Click "Save"
5. Redeploy: 
   ```bash
   vercel --prod
   ```

### Step 5: Verify Deployment

**Test your live site:**
```bash
# Your Vercel URL will be shown after deployment
# Usually: https://ei-story-assessment.vercel.app

# Test API endpoint
curl https://ei-story-assessment.vercel.app/api/health
```

---

## File Structure

```
ei-story-assessment/
├── .env.local              (local development - NOT committed)
├── .env.example            (template - committed)
├── .gitignore              (exclude node_modules, .env.local, etc)
├── vercel.json             (Vercel configuration)
├── next.config.ts          (Next.js config)
├── package.json
├── tsconfig.json
├── lib/
│   ├── db.ts               (MongoDB connection)
│   ├── mongodb.ts          (Alternative connection)
│   ├── mongodb.js          (Fallback connection)
│   └── audioPath.ts        (New: Audio path resolution)
├── app/
│   ├── api/
│   │   ├── session/        (User session management)
│   │   ├── response/       (Store assessment responses)
│   │   ├── report/         (Generate reports)
│   │   └── ...
│   └── ...
└── ...
```

---

## Environment Variables

### Local Development (`.env.local`)

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ei_assessment?retryWrites=true&w=majority

# Application
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### Production (Vercel)

Set these in Vercel dashboard:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ei_assessment?retryWrites=true&w=majority
NEXT_PUBLIC_API_URL=https://ei-story-assessment.vercel.app
NODE_ENV=production
```

### Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `NEXT_PUBLIC_API_URL` | API base URL (accessible in browser) | `http://localhost:3000` |
| `NODE_ENV` | Environment (development/production) | `production` |

---

## Vercel Configuration

Create `vercel.json` in root:

```json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "outputDirectory": ".next",
  "env": {
    "MONGODB_URI": "@mongodb_uri"
  },
  "headers": [
    {
      "source": "/api/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ]
}
```

---

## Troubleshooting

### MongoDB Connection Errors

**Error**: `MongoServerSelectionError`

**Solutions**:
1. Check connection string is correct
2. Verify username/password in MongoDB Atlas
3. Check IP whitelist in Network Access
   - For Vercel: Allow `0.0.0.0/0`
   - For local: Add your IP address

### Vercel Deployment Fails

**Check logs**:
```bash
vercel logs --follow
```

**Common issues**:
- Missing environment variables → Add to Vercel dashboard
- Node version mismatch → Verify Node version in `package.json`
- Build errors → Run `npm run build` locally first

### Audio Files 404 on Vercel

**Ensure**:
- Audio files in `public/audio/` directory
- Audio files included in deployment
- Check Vercel build logs: `vercel logs`

---

## GitHub Workflow

### Push updates to GitHub

```bash
# Make changes
git add .
git commit -m "Feature: describe changes"
git push origin main
```

### Vercel Auto-Deploys

**Automatic deployment on push to main:**
1. Push code to GitHub
2. Vercel detects changes
3. Vercel rebuilds and redeploys
4. Check https://vercel.com/dashboard for status

### Manage Deployments

Go to Vercel dashboard:
- **Deployments** tab: See all builds
- **Settings** tab: Manage environment variables, domains, etc.
- **Analytics** tab: Monitor traffic and performance

---

## Security Checklist

- ✅ `.env.local` added to `.gitignore` (local secrets not committed)
- ✅ Environment variables set in Vercel (not in code)
- ✅ MongoDB password is strong and unique
- ✅ Only necessary IP addresses whitelisted in MongoDB
- ✅ GitHub repository is private (if sensitive data)
- ✅ Vercel project linked to GitHub for automatic deployments

---

## Performance Tips

1. **MongoDB Indexes**: Ensure indexes on frequently queried fields
2. **Caching**: Use Vercel's Edge Caching for static assets
3. **Database Pooling**: Connection pooling already configured in `lib/db.ts`
4. **Image Optimization**: Next.js automatically optimizes images
5. **Audio**: Hosted from `public/audio/` - served via CDN

---

## Monitoring

### Vercel Analytics
- Go to **Analytics** tab in Vercel dashboard
- Monitor page performance
- Track Core Web Vitals

### MongoDB Monitoring
- Go to **Monitoring** in Atlas dashboard
- Check connection count
- Monitor queries and latency

---

## Next Steps

1. Create GitHub account and repository
2. Set up MongoDB Atlas cluster
3. Deploy to Vercel
4. Add custom domain (optional)
   - Vercel dashboard → Settings → Domains
5. Set up CI/CD pipeline (optional)
   - GitHub Actions for automated tests

---

**Last Updated**: April 2026
**Version**: 1.0.0

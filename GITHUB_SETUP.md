# GitHub Repository Setup Instructions

This file provides step-by-step instructions for setting up your GitHub repository and linking it with Vercel and MongoDB.

## 📋 Prerequisites

- [ ] GitHub account (https://github.com)
- [ ] Vercel account (https://vercel.com) - free with GitHub login
- [ ] MongoDB Atlas account (https://mongodb.com/cloud/atlas)
- [ ] Git installed on your computer
- [ ] Node.js and npm installed

## 🚀 Quick Setup

### 1. Create GitHub Repository

```bash
# Go to https://github.com/new
# Fill in:
# - Repository name: ei-story-assessment
# - Description: EI Story-Based Assessment Tool
# - Visibility: Private (recommended)
# - Click "Create repository"
```

### 2. Initialize Local Repository

```bash
cd "c:\Users\Amal Tomy\Desktop\ei proto\ei-story-assessment"
git init
git add .
git commit -m "Initial commit: EI Story Assessment application"
```

### 3. Connect to GitHub

```bash
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/ei-story-assessment.git
git branch -M main
git push -u origin main
```

### 4. Verify on GitHub

Go to https://github.com/YOUR_USERNAME/ei-story-assessment and verify your code is there.

---

## 🔐 GitHub Secrets Configuration

For Vercel auto-deployment via GitHub Actions, add these secrets:

1. Go to your repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets:

| Secret Name | Value | Where to Get |
|---|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection string | MongoDB Atlas dashboard |
| `VERCEL_TOKEN` | Your Vercel API token | Vercel Settings → Tokens |

### How to Get Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click **Create Token**
3. Give it a name: `GitHub-CI-CD`
4. Set expiration: 90 days
5. Copy the token and add to GitHub Secrets as `VERCEL_TOKEN`

---

## 📁 File Structure for Deployment

```
.github/
├── workflows/
│   ├── deploy.yml      (Automatic Vercel deployment on push to main)
│   └── tests.yml       (Run tests on all PRs)
├── CODEOWNERS          (Assign code reviewers)
├── pull_request_template.md

.env.example           (Template - commit this)
.env.local            (Local secrets - DO NOT COMMIT)
.gitignore            (Exclude node_modules, .env.local, etc)

vercel.json           (Vercel configuration)
next.config.ts        (Next.js optimization for Vercel)
package.json          (Build scripts)

DEPLOYMENT_GUIDE.md   (Detailed deployment guide)
QUICK_DEPLOYMENT_STEPS.md (Quick checklist)
```

---

## 🔄 GitHub Workflow Features

### Automatic Deployment on Push

**File**: `.github/workflows/deploy.yml`

When you push to `main` branch:
1. GitHub Actions runs tests
2. Builds your application
3. Deploys to Vercel automatically
4. Sends status to your GitHub PR/push

### Test on Every PR

**File**: `.github/workflows/tests.yml`

When you create a pull request:
1. Runs linter
2. Runs type checking
3. Builds the app
4. Runs tests (if configured)

---

## 📝 GitHub Best Practices

### Commit Message Convention

```bash
git commit -m "type: description"

# Examples:
git commit -m "feat: add audio fade-out functionality"
git commit -m "fix: resolve MongoDB connection timeout"
git commit -m "docs: update deployment guide"
git commit -m "refactor: simplify audio path resolver"
git commit -m "test: add audioManager unit tests"
```

### Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting, missing semicolons)
- `refactor:` - Code refactoring without feature changes
- `test:` - Tests
- `chore:` - Build, dependencies, CI

### Branch Naming

For feature branches:
```bash
git checkout -b feature/audio-system
git checkout -b fix/mongodb-connection
git checkout -b docs/deployment-guide
```

---

## 🔀 Pull Request Workflow

### Create a Feature Branch

```bash
# Create and switch to new branch
git checkout -b feature/your-feature-name

# Make your changes
# ... edit files ...

# Commit changes
git add .
git commit -m "feat: description of changes"

# Push to GitHub
git push origin feature/your-feature-name
```

### Open Pull Request

1. Go to https://github.com/YOUR_USERNAME/ei-story-assessment
2. Click **Pull requests** tab
3. Click **New pull request**
4. Select:
   - **Base**: `main`
   - **Compare**: `feature/your-feature-name`
5. Add title and description
6. Click **Create pull request**

### Merge to Main

After reviews and CI checks pass:
1. Click **Squash and merge** (recommended)
2. Click **Confirm squash and merge**
3. Delete the branch

---

## 📊 Protected Main Branch Settings

**Recommended**: Protect the `main` branch to prevent accidental pushes.

1. Go to **Settings** → **Branches**
2. Click **Add rule** under "Branch protection rules"
3. Configure:
   - **Branch name pattern**: `main`
   - ✅ **Require a pull request before merging**
   - ✅ **Dismiss stale pull request approvals**
   - ✅ **Require status checks to pass before merging**
   - ✅ **Require branches to be up to date before merging**
4. Click **Create**

---

## 🔗 Connecting Services

### GitHub + Vercel

1. Go to https://vercel.com/dashboard
2. Click **Add New...** → **Project**
3. Click **Import Git Repository**
4. Select **GitHub**
5. Authorize GitHub access
6. Select repository: `ei-story-assessment`
7. Click **Import**

**Vercel automatically:**
- Builds on every push to main/develop
- Creates preview deployments for PRs
- Generates unique preview URLs

### GitHub + MongoDB Atlas

MongoDB Atlas doesn't directly integrate with GitHub, but you can:
1. Store `MONGODB_URI` in Vercel environment variables
2. Vercel + GitHub handle secrets securely

---

## 📚 Repository Documentation

### README.md (Update with deployment info)

```markdown
# EI Story Assessment

Emotional Intelligence assessment application built with Next.js, MongoDB, and Vercel.

## Quick Start

### Development
\`\`\`bash
npm install
npm run dev
\`\`\`

### Deployment
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## Live Demo
https://ei-story-assessment.vercel.app

## Technology Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Hosting**: Vercel
- **Version Control**: GitHub
- **Audio**: Custom Audio Manager

## Documentation
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Full deployment instructions
- [Quick Steps](./QUICK_DEPLOYMENT_STEPS.md) - Fast deployment checklist
- [Audio System](./AUDIO_SYSTEM.md) - Audio configuration guide

## Contributing
1. Create a feature branch
2. Make your changes
3. Submit a pull request
4. Wait for review and CI checks

## License
[Your License]
```

---

## 🐛 Troubleshooting

### Push Rejected

**Error**: `error: failed to push some refs to origin`

**Solution**:
```bash
# Pull latest changes first
git pull origin main

# Fix any merge conflicts if needed
# Then try pushing again
git push origin main
```

### GitHub Authentication

**Error**: `fatal: Authentication failed`

**Solution**:
1. Use GitHub token instead of password
2. Or configure SSH keys
3. See https://docs.github.com/en/authentication

### CI/CD Pipeline Failing

1. Check GitHub Actions tab → see detailed logs
2. Common causes:
   - Missing environment variables in Vercel
   - MongoDB connection string invalid
   - Node version mismatch
3. Fix locally: `npm run build`

---

## 🎯 Next Steps

1. ✅ Create GitHub repository
2. ✅ Push code to GitHub
3. ✅ Set up MongoDB Atlas
4. ✅ Configure Vercel deployment
5. ✅ Add GitHub Secrets
6. ✅ Test CI/CD pipeline
7. 🚀 Start developing!

---

## 📚 Additional Resources

- **GitHub Docs**: https://docs.github.com
- **GitHub Actions**: https://docs.github.com/en/actions
- **Vercel GitHub Integration**: https://vercel.com/docs/deployments/git
- **Conventional Commits**: https://www.conventionalcommits.org

---

**Last Updated**: April 2026
**Version**: 1.0.0

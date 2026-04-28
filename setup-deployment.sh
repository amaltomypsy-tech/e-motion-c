#!/bin/bash
# Quick Setup Script for Vercel + GitHub + MongoDB Deployment
# Run this script to automate the setup process

set -e

echo "=================================="
echo "EI Assessment - Deployment Setup"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Git is initialized
if [ ! -d .git ]; then
    echo -e "${BLUE}Initializing Git repository...${NC}"
    git init
    git add .
    git commit -m "Initial commit: EI Story Assessment"
else
    echo -e "${GREEN}✓ Git repository already initialized${NC}"
fi

echo ""
echo -e "${BLUE}1. GitHub Configuration${NC}"
echo "=================================="
echo "To set up GitHub:"
echo "1. Go to https://github.com/new"
echo "2. Create a new repository named 'ei-story-assessment'"
echo "3. Copy the repository URL (HTTPS)"
echo ""
read -p "Enter your GitHub repository URL (or press Enter to skip): " GITHUB_URL

if [ ! -z "$GITHUB_URL" ]; then
    git remote remove origin 2>/dev/null || true
    git remote add origin "$GITHUB_URL"
    git branch -M main
    echo -e "${GREEN}✓ GitHub remote added${NC}"
    echo "To push: git push -u origin main"
fi

echo ""
echo -e "${BLUE}2. MongoDB Atlas Configuration${NC}"
echo "=================================="
echo "To set up MongoDB Atlas:"
echo "1. Go to https://www.mongodb.com/cloud/atlas"
echo "2. Create a free cluster"
echo "3. Create a database user"
echo "4. Get your connection string"
echo ""
read -p "Enter your MongoDB Atlas connection string: " MONGODB_URI

if [ ! -z "$MONGODB_URI" ]; then
    echo "MONGODB_URI=$MONGODB_URI" > .env.local
    echo "NEXT_PUBLIC_API_URL=http://localhost:3000" >> .env.local
    echo "NODE_ENV=development" >> .env.local
    echo -e "${GREEN}✓ .env.local created with MongoDB URI${NC}"
    echo -e "${YELLOW}⚠ .env.local is in .gitignore - never commit it!${NC}"
fi

echo ""
echo -e "${BLUE}3. Vercel Deployment${NC}"
echo "=================================="
echo "Installing Vercel CLI..."

if command -v vercel &> /dev/null; then
    echo -e "${GREEN}✓ Vercel CLI already installed${NC}"
else
    echo "Installing Vercel CLI globally..."
    npm install -g vercel
fi

echo ""
echo -e "${GREEN}Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Test locally: npm run dev"
echo "2. Push to GitHub: git push -u origin main"
echo "3. Deploy to Vercel: vercel --prod"
echo "4. Add MongoDB URI to Vercel environment variables"
echo ""
echo "For detailed instructions, see: DEPLOYMENT_GUIDE.md"

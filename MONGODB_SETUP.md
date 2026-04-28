# MongoDB Atlas Setup Guide

Complete guide for setting up MongoDB Atlas for the EI Story Assessment application.

## 🎯 Overview

MongoDB Atlas is a fully managed cloud database service. The free M0 tier is perfect for development and small applications.

---

## 📋 Prerequisites

- [ ] MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- [ ] Email address for registration
- [ ] Access to database credentials (password manager recommended)

---

## Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click **Try Free**
3. Choose signup method:
   - Email address
   - Google account
   - GitHub account
4. Complete email verification
5. Accept terms and create account

---

## Step 2: Create Organization and Project

1. After login, you'll see the Onboarding wizard
2. **Create an Organization** (or use default):
   - Organization name: `EI Assessment` (or your preference)
   - Click **Next**
3. **Create a Project**:
   - Project name: `ei-story-assessment`
   - Click **Create Organization and Project**

---

## Step 3: Build a Cluster

### Create Free Cluster

1. Click **Build a Database**
2. Choose tier:
   - **Select M0 (Free)** - Perfect for development
3. Choose cloud provider:
   - **AWS** (most popular, best performance)
   - Region: Select closest to your users
4. Click **Create Cluster**
5. Wait 5-10 minutes for cluster to be ready

### Cluster Configuration

Default M0 configuration is fine:
- **Storage**: 512 MB (shared)
- **RAM**: Shared
- **Backup**: Not included in free tier

For production, upgrade to M2 or higher.

---

## Step 4: Create Database User

### Add Database User

1. Go to **Database Access** (left sidebar)
2. Click **+ Add New Database User**
3. Fill in credentials:
   - **Username**: `ei_user`
   - **Password**: Click **Generate Secure Password** (copy it!)
   - **Authentication Method**: Password
4. Grant Privileges:
   - **Built-in Role**: `readWriteAnyDatabase`
   - This allows read/write to any database
5. Click **Add User**

### Save Credentials

Store credentials securely:
```
Username: ei_user
Password: [Generated password from step above]
```

**⚠️ IMPORTANT**: Save this password securely. You can't retrieve it later.

---

## Step 5: Get Connection String

### Retrieve Connection String

1. Go to **Database** → Your cluster
2. Click **Connect**
3. Choose **Drivers**
4. Select:
   - **Language**: Node.js
   - **Driver**: Node.js 3.0 or later
5. Copy the connection string shown

### Connection String Format

```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE?retryWrites=true&w=majority
```

### Update Connection String

Replace placeholders in your copied string:

```
BEFORE:
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

AFTER:
mongodb+srv://ei_user:YOUR_SECURE_PASSWORD@cluster0.xxxxx.mongodb.net/ei_assessment?retryWrites=true&w=majority
```

**Changes**:
- `<username>` → `ei_user`
- `<password>` → Your generated password
- `myFirstDatabase` → `ei_assessment`

---

## Step 6: Configure Network Access

### Whitelist IP Addresses

MongoDB requires explicit IP whitelist for security.

1. Go to **Network Access** (left sidebar)
2. Click **+ Add IP Address**

### For Local Development

1. Add your computer's IP:
   - Find IP: Go to https://whatismyipaddress.com
   - Example: `203.0.113.42`
2. Enter IP address
3. Click **Confirm**

### For Vercel Deployment

1. Click **+ Add IP Address**
2. Enter: `0.0.0.0/0` (allows all IPs)
3. Add comment: `Vercel deployment`
4. Click **Confirm**

**Note**: `0.0.0.0/0` is less secure but necessary for Vercel (dynamic IPs). Consider switching to Vercel's specific IPs for production.

---

## Step 7: Create Database

### Create Database and Collections

1. Go to **Database** → Your cluster
2. Click **Collections**
3. Click **+ Create Database**
4. Enter:
   - **Database name**: `ei_assessment`
   - **Collection name**: `sessions` (initial collection)
5. Click **Create**

### Collections Structure

Suggested collections for the app:

- **sessions** - User session data
- **assessments** - Assessment responses
- **reports** - Generated reports
- **users** - User profiles (optional)

You can create these later as needed through code.

---

## Step 8: Test Connection

### Connection Test (Local)

```bash
# Edit .env.local with your connection string
MONGODB_URI=mongodb+srv://ei_user:PASSWORD@cluster0.xxxxx.mongodb.net/ei_assessment?retryWrites=true&w=majority

# Test locally
npm run dev

# Check for connection errors in console
```

### Check MongoDB Monitoring

1. Go to **Monitoring** → **Network**
2. You should see incoming connections from your computer

---

## Connection String Security

### Never Commit Secrets

❌ **DO NOT**:
```bash
# Don't hardcode in files
const uri = "mongodb+srv://ei_user:PASSWORD@cluster0.xxxxx.mongodb.net/ei_assessment";
```

❌ **DO NOT**:
```bash
# Don't commit .env.local
git commit -m "Add mongo URI" # .env.local included
```

✅ **DO**:
```bash
# Use environment variables
const uri = process.env.MONGODB_URI;

# .gitignore includes .env.local
# Secrets stored in Vercel dashboard
```

---

## Environment Variable Setup

### Local Development (`.env.local`)

```bash
MONGODB_URI=mongodb+srv://ei_user:PASSWORD@cluster0.xxxxx.mongodb.net/ei_assessment?retryWrites=true&w=majority
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### Production (Vercel)

1. Go to Vercel Dashboard
2. Select project → **Settings** → **Environment Variables**
3. Add:
   - **Name**: `MONGODB_URI`
   - **Value**: Your MongoDB connection string
   - **Environments**: Select all (Production, Preview, Development)
4. Click **Save**

---

## MongoDB Atlas Features

### Monitoring

Monitor your database performance:

1. **Monitoring** tab:
   - Connection count
   - Query latency
   - Database operations
   - Network I/O

2. **Alerts**:
   - Set up alerts for high CPU, memory, etc.
   - Notifications via email or webhook

### Backups

M0 free tier doesn't include automatic backups, but:
- Higher tiers include daily snapshots
- Manual backups available through CLI

### Scaling

If data grows beyond 512MB:
1. Go to **Cluster Tier**
2. Click **Modify Cluster**
3. Upgrade to M2 tier
4. Your data migrates automatically

---

## Common Scenarios

### Scenario 1: Local Development Only

**Setup**:
- Free M0 cluster
- Local computer IP whitelisted
- Connection string in `.env.local`

**Benefits**: Free, simple, no IP conflicts

### Scenario 2: Local + Vercel Production

**Setup**:
- Free M0 cluster
- Local computer IP + `0.0.0.0/0` whitelisted
- Secrets in both `.env.local` and Vercel

**Benefits**: Develop locally, deploy to production

### Scenario 3: Team Development

**Setup**:
- M2 or higher tier (shared cluster)
- Multiple IPs whitelisted (one per team member)
- Database users per developer (optional)

**Benefits**: Shared development database, better security

---

## Troubleshooting

### Connection Error: Server Selection Timed Out

**Cause**: IP address not whitelisted

**Solution**:
1. Find your IP: https://whatismyipaddress.com
2. Go to **Network Access**
3. Add your IP address
4. Wait 1-2 minutes for change to propagate
5. Try connecting again

### Error: MongoServerSelectionError

**Cause**: Either:
- Wrong connection string
- Wrong username/password
- IP not whitelisted
- Database user doesn't exist

**Solution**:
1. Double-check connection string
2. Verify username and password
3. Check IP whitelist
4. Test in MongoDB Compass (see below)

### Need to Reset Password

If you forgot the database user password:

1. Go to **Database Access**
2. Click **⋮** (three dots) next to user
3. Click **Edit**
4. Click **Generate Secure Password**
5. Copy new password
6. Click **Update User**

---

## MongoDB Compass (Visual Client)

### Install MongoDB Compass

For visual database browsing:
1. Download: https://www.mongodb.com/products/compass
2. Install the app
3. Open MongoDB Compass

### Connect with Compass

1. Click **New Connection**
2. Paste connection string: `mongodb+srv://...`
3. Click **Connect**
4. Browse collections visually

### Useful for:
- Viewing documents
- Testing queries
- Database management
- Data validation

---

## Best Practices

### Security
- ✅ Use strong passwords (20+ characters)
- ✅ Whitelist specific IPs when possible
- ✅ Use separate database users for dev/prod
- ✅ Store credentials in environment variables only
- ✅ Rotate credentials periodically

### Performance
- ✅ Create indexes for frequently queried fields
- ✅ Monitor query performance
- ✅ Clean up old data regularly
- ✅ Use connection pooling (already configured)

### Maintenance
- ✅ Monitor disk usage
- ✅ Set up alerts for anomalies
- ✅ Plan for scaling as data grows
- ✅ Keep backups of important data

---

## Database Schema

### Recommended Collections for EI Assessment

```javascript
// sessions collection
{
  _id: ObjectId,
  userId: String,
  startTime: Date,
  endTime: Date,
  level: Number,
  currentQuestion: Number,
  status: "active" | "completed" | "abandoned",
  createdAt: Date,
  updatedAt: Date
}

// assessments collection
{
  _id: ObjectId,
  sessionId: ObjectId,
  level: Number,
  questionId: String,
  selectedOption: String,
  responseTime: Number,
  score: Number,
  effectiveness: "high" | "moderate" | "low" | "very_low",
  timestamp: Date
}

// reports collection
{
  _id: ObjectId,
  sessionId: ObjectId,
  userId: String,
  totalScore: Number,
  branchScores: {
    perceiving: Number,
    using: Number,
    understanding: Number,
    managing: Number
  },
  generatedAt: Date,
  downloadedAt: Date
}
```

---

## Monitoring Dashboard

Key metrics to monitor:

1. **Connection Count**: Current active connections
2. **Query Latency**: Response time for operations
3. **Ops per second**: Database throughput
4. **Network I/O**: Data transfer rate
5. **Storage Used**: Disk space consumption

---

## Upgrade Path

### Free → Paid Transition

When you outgrow M0 (512MB):

| Metric | M0 | M2 | M5 | M10 |
|--------|----|----|----|----|
| Cost | Free | $9/month | $57/month | $114/month |
| Storage | 512 MB | 10 GB | 100 GB | 500 GB |
| RAM | Shared | 2 GB | 8 GB | 16 GB |
| Backups | None | Daily | Daily | Daily |

Upgrade is one-click - no data loss!

---

## Additional Resources

- **MongoDB Atlas Docs**: https://docs.mongodb.com/atlas/
- **MongoDB University**: https://university.mongodb.com
- **Connection String Docs**: https://docs.mongodb.com/manual/reference/connection-string/
- **Network Security**: https://docs.mongodb.com/atlas/security-network/

---

**Last Updated**: April 2026
**Version**: 1.0.0

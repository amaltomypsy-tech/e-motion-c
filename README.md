# EI Story Assessment (Prototype)

Story-driven, psychometrically grounded Emotional Intelligence (EI) assessment prototype based on **Mayer & Salovey’s Four-Branch Model**.

## Tech
- Next.js (App Router) + React + TypeScript
- Tailwind CSS + Framer Motion (cinematic transitions)
- Recharts (dashboard charts)
- MongoDB + Mongoose (research logging)

## Run (local)
1. Create `.env.local` (optional):
   - `MONGODB_URI=mongodb://127.0.0.1:27017/ei_story_assessment` (recommended; enables persistence)
   - Optional: `EXPORT_KEY=some-long-secret` (protects `/api/export`)
2. Install + start:
   - `npm install`
   - `npm run dev`

## Notes for research integrity
- Scenario content lives in `data/scenarios/*.json` (no scoring logic in UI).
- Scoring is explicit and traceable in `lib/scoringEngine.ts` and option metadata in scenario JSON.
- Report language is **non-diagnostic**, developmental, and culturally sensitive.

## Optional Unity WebGL client
If you want a Unity-powered “interactive film” front-end while keeping the same research backend:
- Unity scaffold: `unity/`
- Host page (expects Unity build in `public/unity/`): `/unity`

## Data export (Excel)
Downloads an `.xlsx` workbook with 3 sheets: `Sessions`, `Responses`, `Reports`.
- Export all sessions: `GET /api/export`
- Export one session: `GET /api/export?sessionId=...`

Optional protection:
- Set `EXPORT_KEY` in `.env.local`
- Then send header `x-export-key: <EXPORT_KEY>`

## Running without MongoDB
If `MONGODB_URI` is not set, the app runs in **memory mode**:
- Sessions/responses/reports are stored in server memory (lost on restart)
- Excel export still works (exports what’s currently in memory)

## Cloud storage (recommended)
To store responses reliably across devices and restarts, use **MongoDB Atlas**:
1. Create an Atlas cluster + database user
2. Add your IP (or `0.0.0.0/0` for testing) to Network Access
3. Copy the connection string and set in `.env.local` or deployment env vars:
   - `MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority`

With `MONGODB_URI` set, the app automatically switches from memory mode to MongoDB persistence.

## Deploying from GitHub to Vercel

This repo is already on GitHub, so the easiest way to get a public URL is with Vercel.

1. Go to https://vercel.com and sign in with GitHub.
2. Import the repo: `amaltomypsy-tech/e-motion-c`.
3. In the Vercel project settings, add the environment variable:
   - `MONGODB_URI`
4. Deploy the project.

After deployment, test the public API route:
- `https://<your-vercel-project>.vercel.app/api/test`

If MongoDB is connected correctly, the response should be:
```json
{"success":true,"message":"MongoDB connected successfully"}
```

### Notes
- GitHub Pages cannot host this Next.js API route.
- Vercel is the recommended host for this app because it supports Next.js serverless functions and environment variables.

# Timesheet Bulk Mailer — Web App

Same job as your VBA macro (loop rows → attach file → send email), but as a web app.

## Why 2 folders

GitHub Pages only serves static files (HTML/CSS/JS) — no server, no SMTP.
So:
- `client/` → deploy to GitHub Pages (the UI, one-click send button)
- `server/` → deploy elsewhere free (Render/Railway/Fly.io) — this is what actually sends email via SMTP

## Setup

### 1. Backend (server/)
```bash
cd server
npm install
cp .env.example .env
# edit .env with your SMTP creds (Gmail: use an "app password", not your login password)
npm start
```
Test locally: http://localhost:3000

Deploy free:
- **Render.com** → New Web Service → connect this repo, root dir `server`, build `npm install`, start `npm start`, add the `.env` values as Environment Variables in dashboard.
- **Railway.app** → same idea, one-click deploy from GitHub.

Copy the deployed URL, e.g. `https://your-app.onrender.com`.

### 2. Frontend (client/)
Push `client/index.html` to a GitHub repo, enable **Settings → Pages → deploy from branch**, root folder.
Open the page → paste your backend URL into the "Backend API URL" field.

### 3. Use it
1. Upload your Excel/CSV (same columns as before: `Name`, `Email`, `File Path`)
2. Upload all PDF attachments at once (matched to rows by filename)
3. Edit subject/body template (`{name}` auto-fills)
4. Click **Send All Emails** — status updates live per row

## Notes / gotchas
- Gmail: enable 2FA, then generate an "App Password" for `SMTP_PASS` (regular password won't work).
- Outlook/Office365: `smtp.office365.com`, port 587.
- CORS: `server.js` currently allows all origins (`cors()`); lock it to your GitHub Pages URL before real use.
- Attachments upload from browser to your server per-email, so large PDFs = slower sends. Fine for typical timesheet-size PDFs.
- No credentials ever touch GitHub Pages — SMTP creds live only in the backend's environment variables.

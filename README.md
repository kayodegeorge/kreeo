Kreeo Figma Plugin Assessment
A Nextjs app simulating a Figma plugin with persistent authentication and speech-to-text.

Live link; https://kreeo-task.vercel.app

Quick Start
bash# Setup
npx create-next-app@latest kreeo-figma-plugin --typescript --tailwind --app
cd kreeo-figma-plugin
npm install zustand jose date-fns lucide-react clsx tailwind-merge

# Create folders

mkdir -p components/plugin components/ui lib/auth lib/speech stores types

# Environment

cp .env.example .env.local

# Edit .env.local and add a JWT_SECRET (32+ characters)

# Run

npm run dev
Login: designer@kreeo.me / kreeo123

What It Does
Task 1: Persistent Authentication ✅

Logs you in once, stays logged in
Auto-refreshes tokens every 10 minutes
Session timer shows time remaining
Manual refresh button if needed

Task 2: Speech-to-Text ✅

Click mic, speak, see text appear
Saves transcriptions with timestamps
Works in Chrome/Edge/Safari
Exports to JSON

How It Works
Authentication

Login sends credentials to /api/auth/login
Returns JWT tokens (15min access, 7day refresh)
Tokens saved in localStorage
Auto-refreshes 5min before expiry
Page reload checks localStorage and logs back in

Speech-to-Text

Uses Web Speech API (browser native)
Click mic → browser asks permission → records
Live transcription shows as you speak
Save button stores in localStorage
Persists across page reloads

Testing
Auth Test

Login → refresh page → still logged in ✓
Wait 10 minutes → token auto-refreshes ✓
Click "Refresh Session" → timer resets ✓
Logout → refresh page → shows login ✓

Speech Test

Click mic → speak → text appears ✓
Click Save → shows in list below ✓
Refresh page → saved recordings still there ✓
Try Firefox → shows "not supported" message ✓

Real Figma Plugin Implementation
Key Differences:
Web AppFigma PluginlocalStoragefigma.clientStorageDirect function callspostMessage between plugin/UIReact stateSame + Figma API
Example Code:
typescript// Plugin code (code.ts)
await figma.clientStorage.setAsync('auth_token', token);
figma.ui.postMessage({ type: 'auth-success', token });

Tech Stack

Nextjs - React Framework
TypeScript - Type safety
Zustand - State management (simple, 1KB)
jose - JWT tokens
Tailwind - Styling
Web Speech API - Voice transcription

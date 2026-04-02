# Centerline Social Command Center

AI-powered social media planning tool for Centerline Fitness & Performance.

## What's in here

- `app/page.js` — The main app (calendar, ideas, captions)
- `app/api/generate/route.js` — Server-side API route that talks to Claude (keeps your API key hidden)
- `app/layout.js` — Page shell, fonts, metadata

## Deploy to Vercel

### Step 1: Push to GitHub

Create a new repository on GitHub (e.g., `centerline-social`), then push this folder to it.

```
cd centerline-social
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/centerline-social.git
git push -u origin main
```

### Step 2: Import into Vercel

1. Go to vercel.com/new
2. Click "Import Git Repository"
3. Select the `centerline-social` repo
4. Vercel will auto-detect it as a Next.js project

### Step 3: Add your API key

Before deploying (or in project settings after):

1. Go to your project Settings > Environment Variables
2. Add a new variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** Your Anthropic API key (starts with `sk-ant-`)
3. Deploy

### Step 4: Custom domain (optional)

In Vercel project Settings > Domains, you can add something like `social.centerlinefitness.com` if you want a clean URL for Lex.

## How it works

- The app runs in the browser. Scheduled posts are saved in the browser's local storage on whatever device Lex uses.
- When she generates ideas or captions, the app calls YOUR server-side API route, which then calls Claude. Your API key never touches the browser.
- Posts persist between visits on the same device/browser. Clearing browser data would erase them.

## Notes

- This uses your Anthropic API key, so each generation costs a small amount (fractions of a cent per caption). 
- Local storage means Lex's scheduled posts live on her device. If she uses it on her phone, that's where her data lives. If she switches to a laptop, it starts fresh there.

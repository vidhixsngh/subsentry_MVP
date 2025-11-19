# Vercel Deployment Guide for SubSentry

## Problem Fixed

Your deployment was failing because:
1. Vercel detected the `app/` directory with `page.tsx` and thought it was a Next.js project
2. The `next` package in dependencies confused Vercel's framework detection
3. No `vercel.json` configuration existed to tell Vercel how to build the project

## Solution Applied

### 1. Created `vercel.json`
```json
{
  "buildCommand": "vite build",
  "outputDirectory": "dist/public",
  "framework": null,
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This tells Vercel:
- Use Vite to build (not Next.js)
- Output goes to `dist/public`
- Don't auto-detect framework
- Rewrite all routes to index.html (SPA routing)

### 2. Created `.vercelignore`
Excludes the confusing `app/` directory and other unnecessary files from deployment.

### 3. Created `api/index.js`
A serverless function handler (if you need backend API routes in the future).

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your changes to GitHub:**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment configuration"
   git push origin main
   ```

2. **In Vercel Dashboard:**
   - Go to your project settings
   - Under "Build & Development Settings":
     - Framework Preset: **Other**
     - Build Command: `vite build`
     - Output Directory: `dist/public`
     - Install Command: `npm install`

3. **Environment Variables:**
   Add these in Vercel Dashboard → Settings → Environment Variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Redeploy:**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## Architecture Notes

### Current Setup:
- **Frontend**: React + Vite (SPA)
- **Backend**: Supabase (database, auth, edge functions)
- **Deployment**: Static site on Vercel

### What Gets Deployed:
- Only the built React app (`dist/public`)
- No Express server (Supabase handles backend)
- Client-side routing via Wouter

### What Doesn't Get Deployed:
- `server/` directory (Express server for local dev only)
- `app/` directory (old Next.js files, not used)
- Node modules and build artifacts

## Post-Deployment Checklist

✅ Verify environment variables are set in Vercel
✅ Check Supabase URL is accessible from Vercel
✅ Test Google OAuth redirect URLs include your Vercel domain
✅ Update Supabase Auth settings with Vercel URL
✅ Test all routes work (SPA routing)
✅ Verify API calls to Supabase work
✅ Check Gemini AI integration works

## Supabase Configuration

Update your Supabase project settings:

1. **Authentication → URL Configuration:**
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: Add `https://your-app.vercel.app/**`

2. **API Settings:**
   - Ensure CORS allows your Vercel domain

## Troubleshooting

### Build Fails with "routes-manifest.json not found"
- ✅ Fixed by setting `framework: null` in vercel.json
- ✅ Fixed by adding `.vercelignore` to exclude `app/` directory

### Environment Variables Not Working
- Prefix all client-side env vars with `VITE_`
- Set them in Vercel Dashboard, not just `.env`

### Routes Return 404
- ✅ Fixed by adding rewrites in vercel.json
- All routes now redirect to index.html for client-side routing

### Supabase Auth Fails
- Update redirect URLs in Supabase dashboard
- Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set

## Clean Up (Optional)

You can remove these unused dependencies:
```bash
npm uninstall next next-themes @supabase/auth-helpers-nextjs
```

And delete the unused `app/` directory:
```bash
rm -rf app/
```

## Success Indicators

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ Homepage loads at your Vercel URL
- ✅ Google OAuth login works
- ✅ Dashboard shows after login
- ✅ Subscriptions can be added/viewed
- ✅ AI insights generate properly

## Next Steps

1. Push the changes to GitHub
2. Redeploy on Vercel
3. Update Supabase auth settings
4. Test the deployed app
5. Celebrate! 🎉

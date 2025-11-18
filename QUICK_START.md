# SubSentry - Quick Start Guide

Get your backend up and running in 30 minutes!

---

## Prerequisites

- Node.js 18+ installed
- A Google account (for OAuth)
- A Supabase account (free tier is fine)

---

## Step-by-Step Setup

### 1. Create Supabase Project (5 minutes)

```bash
# 1. Go to https://supabase.com
# 2. Click "New Project"
# 3. Fill in:
#    - Name: SubSentry
#    - Database Password: (save this!)
#    - Region: Choose closest to you
# 4. Wait ~2 minutes for project creation
```

### 2. Get Your Credentials (2 minutes)

```bash
# In Supabase Dashboard:
# Go to Settings → API
# Copy these 3 values:

Project URL: https://xxxxx.supabase.co
Anon key: eyJhbGc...
Service role key: eyJhbGc...
```

### 3. Configure Environment Variables (1 minute)

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 4. Set Up Database (3 minutes)

```bash
# 1. In Supabase Dashboard, go to SQL Editor
# 2. Copy ALL content from supabase-setup.sql
# 3. Paste and click "Run"
# 4. Wait for "Success" message
# 5. Go to Table Editor - you should see 4 tables
```

### 5. Configure Google OAuth (5 minutes)

```bash
# A. Get Google Credentials:
# 1. Go to https://console.cloud.google.com
# 2. Create new project: "SubSentry"
# 3. Go to APIs & Services → Credentials
# 4. Click "Create Credentials" → "OAuth 2.0 Client ID"
# 5. Configure consent screen (add app name, email)
# 6. Application type: Web application
# 7. Add redirect URI: https://YOUR_PROJECT.supabase.co/auth/v1/callback
# 8. Add redirect URI: http://localhost:5000/auth/callback
# 9. Copy Client ID and Client Secret

# B. Configure in Supabase:
# 1. Go to Authentication → Providers
# 2. Find Google, click to expand
# 3. Toggle "Enable Sign in with Google"
# 4. Paste Client ID and Client Secret
# 5. Click Save
```

### 6. Install Dependencies (2 minutes)

```bash
npm install
```

### 7. Start Development Server (1 minute)

```bash
npm run dev
```

### 8. Test Authentication (2 minutes)

```bash
# 1. Open http://localhost:5000
# 2. Click "Continue with Google"
# 3. Complete OAuth flow
# 4. You should be redirected to dashboard
# 5. Check Supabase → Authentication → Users (you should see your user)
```

---

## ✅ You're Done with Basic Setup!

Your app now has:
- ✅ Google OAuth authentication
- ✅ Database with all tables
- ✅ Row Level Security enabled
- ✅ User management

---

## Next: Set Up Email Reminders (Optional - 10 minutes)

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Link Your Project

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

Get your project ref from: Settings → General → Reference ID

### 3. Deploy Edge Function

```bash
supabase functions deploy send-reminder-emails
```

### 4. Configure Edge Function Secrets

```bash
# In Supabase Dashboard:
# Go to Edge Functions → Configuration
# Add these secrets:

SUPABASE_URL: https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY: your_service_role_key
```

### 5. Set Up Cron Job

```sql
-- In Supabase SQL Editor, run:

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS http;

-- Daily reminders at 9 AM UTC
SELECT cron.schedule(
  'send-daily-reminders',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'YOUR_SUPABASE_URL/functions/v1/send-reminder-emails',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_ANON_KEY'
    ),
    body := jsonb_build_object('type', 'daily')
  );
  $$
);
```

Replace `YOUR_SUPABASE_URL` and `YOUR_ANON_KEY` with your actual values.

### 6. Test Email Function

```bash
curl -i --location --request POST 'https://YOUR_PROJECT.supabase.co/functions/v1/send-reminder-emails' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"daily"}'
```

---

## 🎉 Complete Setup Done!

Your app now has:
- ✅ Authentication
- ✅ Database
- ✅ Subscriptions management
- ✅ Email reminders
- ✅ Scheduled cron jobs

---

## Common Commands

```bash
# Start dev server
npm run dev

# View Edge Function logs
supabase functions logs send-reminder-emails

# Check cron jobs
# Run in Supabase SQL Editor:
SELECT * FROM cron.job;

# Check cron execution history
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

---

## Troubleshooting

### Can't sign in with Google?
- Check redirect URIs in Google Console match Supabase
- Verify Google provider is enabled in Supabase
- Check browser console for errors

### Database queries failing?
- Verify RLS policies are set up (run supabase-setup.sql again)
- Check if user is authenticated
- Look at browser network tab for error details

### Emails not sending?
- Check Edge Function logs: `supabase functions logs send-reminder-emails`
- Verify cron job is scheduled: `SELECT * FROM cron.job;`
- Check reminder_logs table for errors

---

## Need Help?

1. Check `SUPABASE_SETUP_GUIDE.md` for detailed instructions
2. Check `IMPLEMENTATION_CHECKLIST.md` for step-by-step checklist
3. Check Supabase logs in Dashboard
4. Join [Supabase Discord](https://discord.supabase.com)

---

## What's Next?

After basic setup, you can:
1. Customize email templates
2. Add SMS reminders
3. Implement AI insights
4. Add subscription detection from SMS
5. Create mobile app
6. Add payment integration
7. Implement analytics dashboard

Happy coding! 🚀

# 🚀 Start Here: Email Reminders Setup

## Important: Supabase Built-in Email Limitation

⚠️ **Supabase's built-in email only works for authentication flows** (signup, password reset). It cannot send custom reminder emails.

**Solution:** We'll log reminders to console for testing. For production, integrate Resend (free 3000 emails/month).

---

## Quick Setup (10 minutes)

### What You'll Do:
1. Deploy Edge Function (3 min)
2. Set environment variables (1 min)
3. Schedule cron jobs (3 min)
4. Test it (3 min)

### What You'll Get:
- ✅ Reminder logic working
- ✅ Reminders logged to console
- ✅ Database tracking
- ✅ Automated daily/weekly scheduling

---

## Commands to Run

### 1. Deploy Function
```bash
# Install CLI (skip if already done)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy
supabase functions deploy send-reminder-emails-simple
```

**Get YOUR_PROJECT_REF:**
- Supabase Dashboard → Settings → General → Reference ID

---

### 2. Set Environment Variables

**In Supabase Dashboard:**
1. Click **Edge Functions** (sidebar)
2. Click **Configuration** tab
3. Click **Add new secret**
4. Add these two:

**Secret 1:**
- Name: `SUPABASE_URL`
- Value: Your project URL (Settings → API → Project URL)

**Secret 2:**
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: Your service role key (Settings → API → service_role, click Reveal)

5. Click **Save**

---

### 3. Schedule Cron Jobs

**In Supabase Dashboard → SQL Editor:**

Copy and paste this (replace YOUR_SUPABASE_URL and YOUR_ANON_KEY):

```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS http;

SELECT cron.schedule(
  'send-daily-reminders',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'YOUR_SUPABASE_URL/functions/v1/send-reminder-emails-simple',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_ANON_KEY'
    ),
    body := jsonb_build_object('type', 'daily')
  );
  $$
);

SELECT cron.schedule(
  'send-weekly-reminders',
  '0 9 * * 1',
  $$
  SELECT net.http_post(
    url := 'YOUR_SUPABASE_URL/functions/v1/send-reminder-emails-simple',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_ANON_KEY'
    ),
    body := jsonb_build_object('type', 'weekly')
  );
  $$
);
```

**Get YOUR_SUPABASE_URL and YOUR_ANON_KEY:**
- Settings → API → Project URL
- Settings → API → anon public key

Click **Run**

---

### 4. Test It

**A. Add test data in your app:**
1. Add a subscription with renewal date in 3 days
2. Go to Reminders → Set daily, 3 days before → Save

**B. Trigger function manually:**
```bash
curl -i --location --request POST 'https://YOUR_PROJECT.supabase.co/functions/v1/send-reminder-emails-simple' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"daily"}'
```

**C. Check logs:**
```bash
supabase functions logs send-reminder-emails-simple
```

You should see reminder summary!

**D. Check database:**
- Supabase → Table Editor → reminder_logs
- Should see new entry with status "sent"

---

## ✅ Done!

Your reminder system is now:
- ✅ Deployed and working
- ✅ Scheduled (runs daily at 9 AM UTC)
- ✅ Logging reminders to console
- ✅ Tracking in database

**Note:** Reminders are logged, not emailed. For real emails, see SETUP_EMAIL_REMINDERS.md Option 2.

---

## Verify Everything Works

```sql
-- In SQL Editor, check cron jobs:
SELECT * FROM cron.job;

-- Check execution history:
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;

-- Check reminder logs:
SELECT * FROM reminder_logs ORDER BY sent_at DESC LIMIT 10;
```

---

## Next Steps

### For Testing (Current Setup)
- ✅ You're done! Reminders log to console.
- View logs: `supabase functions logs send-reminder-emails-simple --tail`

### For Production (Real Emails)
- Follow **SETUP_EMAIL_REMINDERS.md** Option 2
- Integrate Resend (free 3000 emails/month)
- Takes 10 more minutes

---

## Need Help?

**Function not deploying?**
```bash
supabase --version  # Check version
npm install -g supabase@latest  # Update if needed
```

**Cron jobs not running?**
```sql
-- Check if extensions are enabled
SELECT * FROM pg_extension WHERE extname IN ('pg_cron', 'http');
```

**No reminders?**
```sql
-- Check if you have settings
SELECT * FROM user_reminder_settings;

-- Check if you have subscriptions renewing soon
SELECT * FROM subscriptions 
WHERE renewal_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days';
```

---

**Total Time:** 10 minutes
**Status:** ✅ Working (console logging)
**You're done!** 🎉

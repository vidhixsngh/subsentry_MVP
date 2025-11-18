# Email Reminders - Quick Start (10 minutes)

## What You'll Get
- ✅ Reminder logic working
- ✅ Reminders logged to console
- ✅ Database tracking
- ✅ Automated scheduling

**Note:** Emails will be logged to console, not actually sent. To send real emails, see SETUP_EMAIL_REMINDERS.md Option 2.

---

## Step 1: Deploy Function (3 min)

```bash
# Install CLI (if not done)
npm install -g supabase

# Login
supabase login

# Link project (get ref from Supabase Dashboard → Settings → General)
supabase link --project-ref YOUR_PROJECT_REF

# Deploy
supabase functions deploy send-reminder-emails-simple
```

---

## Step 2: Set Environment Variables (1 min)

1. Go to Supabase Dashboard
2. Click **Edge Functions** (sidebar)
3. Click **Configuration** tab
4. Add these secrets:

| Name | Value | Where to find |
|------|-------|---------------|
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` | Settings → API → service_role (click Reveal) |

5. Click **Save**

---

## Step 3: Schedule Cron Jobs (3 min)

Go to **SQL Editor** and run this (replace YOUR_SUPABASE_URL and YOUR_ANON_KEY):

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS http;

-- Daily reminders at 9 AM UTC (2:30 PM IST)
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

-- Weekly reminders on Mondays at 9 AM UTC
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
- Go to Settings → API
- Copy "Project URL" and "anon public" key

---

## Step 4: Test It (3 min)

### A. Add Test Data in Your App
1. Add a subscription with renewal date in 3 days
2. Go to Reminders page
3. Set frequency: "daily"
4. Set days before: "3"
5. Click Save

### B. Manually Trigger Function

```bash
curl -i --location --request POST 'https://YOUR_PROJECT.supabase.co/functions/v1/send-reminder-emails-simple' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"daily"}'
```

Replace YOUR_PROJECT with your project ref.

### C. Check Logs

```bash
supabase functions logs send-reminder-emails-simple
```

You should see:
```
📧 Subscription Reminders for your@email.com

You have 1 subscription(s) renewing soon:

• Netflix - ₹699.00 (in 3 days)

Total: ₹699.00
```

### D. Check Database

Go to Supabase → Table Editor → reminder_logs

You should see a new entry with:
- status: "sent"
- email_sent_to: your email
- sent_at: current timestamp

---

## Verify Cron Jobs

In SQL Editor:

```sql
-- List cron jobs
SELECT * FROM cron.job;
```

You should see:
- `send-daily-reminders`
- `send-weekly-reminders`

---

## ✅ You're Done!

Your reminder system is now:
- ✅ Deployed
- ✅ Scheduled (runs daily at 9 AM UTC)
- ✅ Logging reminders
- ✅ Tracking in database

**Reminders are logged to console, not emailed.**

---

## Want Real Emails?

See **SETUP_EMAIL_REMINDERS.md** Option 2 for Resend integration (free 3000 emails/month).

---

## Quick Commands

```bash
# View function logs
supabase functions logs send-reminder-emails-simple --tail

# Test function
curl -i --location --request POST 'https://YOUR_PROJECT.supabase.co/functions/v1/send-reminder-emails-simple' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"daily"}'

# Check cron execution
# In SQL Editor:
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

---

**Total Time:** 10 minutes
**Status:** ✅ Working (console logging)
**Next:** Integrate Resend for real emails (optional)

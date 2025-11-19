# Final Steps - Complete Email Reminders Setup

✅ Function deployed: https://talcquxnfwsukkxyvizo.supabase.co/functions/v1/send-reminder-emails-resend

Now complete these 3 steps:

---

## STEP 1: Add Environment Variables (2 minutes)

### 1.1 Go to Supabase Dashboard
1. Open [app.supabase.com](https://app.supabase.com)
2. Select your SubSentry project
3. Click **Edge Functions** (sidebar)
4. Click **Configuration** tab
5. Click **Add new secret**

### 1.2 Add These 3 Secrets

**Secret 1:**
- Name: `SUPABASE_URL`
- Value: `https://talcquxnfwsukkxyvizo.supabase.co`
- Click "Add"

**Secret 2:**
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: Go to Settings → API → service_role (click "Reveal" and copy the long key)
- Click "Add"

**Secret 3:**
- Name: `RESEND_API_KEY`
- Value: `re_eGCUxW3g_K13n6e1JRbEz3VAkj4TVPmrq`
- Click "Add"

### 1.3 Save
Click **Save** button at the bottom

---

## STEP 2: Schedule Cron Jobs (2 minutes)

### 2.1 Get Your Anon Key
1. Go to Settings → API
2. Find "anon public" key
3. Click "Reveal"
4. Copy the key (starts with `eyJhbGc...`)

### 2.2 Run SQL
1. Go to **SQL Editor** (sidebar)
2. Click **New query**
3. Copy this SQL and **replace YOUR_ANON_KEY** with the key you just copied:

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS http;

-- Daily reminders at 9 AM UTC (2:30 PM IST)
SELECT cron.schedule(
  'send-daily-reminders-resend',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'https://talcquxnfwsukkxyvizo.supabase.co/functions/v1/send-reminder-emails-resend',
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
  'send-weekly-reminders-resend',
  '0 9 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://talcquxnfwsukkxyvizo.supabase.co/functions/v1/send-reminder-emails-resend',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_ANON_KEY'
    ),
    body := jsonb_build_object('type', 'weekly')
  );
  $$
);
```

4. Click **Run** (or press Cmd+Enter)
5. Should see "Success. No rows returned"

### 2.3 Verify Cron Jobs
Run this SQL:
```sql
SELECT * FROM cron.job;
```

You should see 2 jobs:
- `send-daily-reminders-resend`
- `send-weekly-reminders-resend`

---

## STEP 3: Test Email Sending (3 minutes)

### 3.1 Add Test Data in Your App
1. Open your app: http://localhost:5000
2. Add a subscription:
   - Name: Netflix
   - Amount: 699
   - Category: Streaming
   - Renewal Date: **Pick a date 3 days from today**
   - Billing Cycle: Monthly
3. Click Save

### 3.2 Set Reminder Preferences
1. Go to **Reminders** page
2. Set frequency: **daily**
3. Set days before: **3**
4. Click **Save Reminder Settings**

### 3.3 Manually Trigger Email
In terminal, run this (replace YOUR_ANON_KEY with the key from Step 2.1):

```bash
curl -i --location --request POST 'https://talcquxnfwsukkxyvizo.supabase.co/functions/v1/send-reminder-emails-resend' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"daily"}'
```

### 3.4 Expected Response
You should see:
```json
{
  "success": true,
  "message": "Processed daily reminders",
  "emailsSent": 1,
  "emailsFailed": 0,
  "totalUsers": 1
}
```

### 3.5 Check Your Email
1. Open your email inbox (the email you signed in with)
2. Look for email from **"SubSentry <onboarding@resend.dev>"**
3. Subject: **"🔔 1 Subscription Renewing Soon"**
4. Open it - you should see a beautiful email with your Netflix subscription!

### 3.6 Verify in Resend Dashboard
1. Go to [resend.com/emails](https://resend.com/emails)
2. You should see your sent email listed
3. Click on it to see delivery details

### 3.7 Check Database
1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Select **reminder_logs** table
4. You should see a new entry:
   - status: "sent"
   - email_sent_to: your email
   - sent_at: current timestamp

---

## ✅ Success Checklist

- [ ] Environment variables added (3 secrets)
- [ ] Cron jobs scheduled (2 jobs)
- [ ] Test subscription added
- [ ] Reminder settings saved
- [ ] Manual test successful (got 200 response)
- [ ] Email received in inbox
- [ ] Email visible in Resend dashboard
- [ ] Log entry in reminder_logs table

---

## 🎉 You're Done!

If all checkboxes are checked, your email reminder system is:
- ✅ Fully deployed
- ✅ Sending real emails via Resend
- ✅ Scheduled to run daily at 9 AM UTC (2:30 PM IST)
- ✅ Scheduled to run weekly on Mondays
- ✅ Tracking all emails in database

---

## View Logs

```bash
# View function logs
supabase functions logs send-reminder-emails-resend --tail

# Or in Supabase Dashboard
# Edge Functions → send-reminder-emails-resend → Logs
```

---

## Monitor Your System

### Check Cron Execution History
```sql
SELECT * FROM cron.job_run_details 
ORDER BY start_time DESC 
LIMIT 10;
```

### Check Recent Reminder Logs
```sql
SELECT * FROM reminder_logs 
ORDER BY sent_at DESC 
LIMIT 20;
```

### Check Failed Emails
```sql
SELECT * FROM reminder_logs 
WHERE status = 'failed' 
ORDER BY sent_at DESC;
```

---

## What Happens Next

### Every Day at 9 AM UTC (2:30 PM IST):
1. Cron job triggers your function
2. Function checks all users with daily reminders enabled
3. Finds subscriptions renewing in next X days
4. Sends beautiful HTML email via Resend
5. Logs to database

### Every Monday at 9 AM UTC:
- Same process for users with weekly reminders

---

## Troubleshooting

### Email not received?
1. Check spam folder
2. Check Resend dashboard: [resend.com/emails](https://resend.com/emails)
3. Check function logs: `supabase functions logs send-reminder-emails-resend`
4. Check reminder_logs table for error_message

### "RESEND_API_KEY is not set" error?
1. Verify you added all 3 secrets in Edge Functions → Configuration
2. Make sure you clicked "Save"
3. Try redeploying: `supabase functions deploy send-reminder-emails-resend`

### Cron jobs not running?
```sql
-- Check if extensions are enabled
SELECT * FROM pg_extension WHERE extname IN ('pg_cron', 'http');

-- Check job status
SELECT * FROM cron.job;

-- Check execution history
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

---

**Total Time:** 7 minutes
**Status:** Almost done! Just 3 steps left.
**You got this!** 💪

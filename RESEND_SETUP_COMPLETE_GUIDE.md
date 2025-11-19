# Complete Guide: Email Reminders with Resend

## Overview
This guide will help you set up automated email reminders using Resend (free 3000 emails/month).

**Total Time:** 20 minutes

---

## STEP 1: Sign Up for Resend (3 minutes)

### 1.1 Create Account
1. Go to [resend.com](https://resend.com)
2. Click "Start Building"
3. Sign up with your email or GitHub
4. Verify your email

### 1.2 Get API Key
1. After login, you'll see the dashboard
2. Click "API Keys" in the sidebar
3. Click "Create API Key"
4. Name it: "SubSentry Production"
5. Click "Add"
6. **Copy the API key** (starts with `re_...`)
7. **Save it somewhere safe** - you won't see it again!

### 1.3 Verify Domain (Optional but Recommended)
**For testing:** You can use `onboarding@resend.dev` (no verification needed)

**For production:**
1. Click "Domains" in sidebar
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records shown
5. Wait for verification (usually 5-10 minutes)
6. Once verified, you can send from `noreply@yourdomain.com`

**For now, we'll use `onboarding@resend.dev` to get started quickly.**

---

## STEP 2: Install Supabase CLI (2 minutes)

### 2.1 Install CLI
```bash
npm install -g supabase
```

### 2.2 Verify Installation
```bash
supabase --version
```

Should show version 1.x.x or higher.

### 2.3 Login to Supabase
```bash
supabase login
```

Browser will open → Click "Authorize"

---

## STEP 3: Link Your Project (1 minute)

### 3.1 Get Project Reference ID
1. Go to Supabase Dashboard
2. Click **Settings** (gear icon)
3. Click **General**
4. Copy **Reference ID** (looks like: `abcdefghijklmnop`)

### 3.2 Link Project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with the ID you copied.

You should see: "Linked to project..."

---

## STEP 4: Deploy Edge Function (3 minutes)

### 4.1 Deploy Function
```bash
supabase functions deploy send-reminder-emails-resend
```

Wait for deployment... Should see "Deployed function send-reminder-emails-resend"

### 4.2 Verify Deployment
1. Go to Supabase Dashboard
2. Click **Edge Functions** (sidebar)
3. You should see `send-reminder-emails-resend` listed

---

## STEP 5: Set Environment Variables (2 minutes)

### 5.1 Go to Configuration
1. In Supabase Dashboard → **Edge Functions**
2. Click **Configuration** tab
3. Click **Add new secret**

### 5.2 Add Three Secrets

**Secret 1: SUPABASE_URL**
- Name: `SUPABASE_URL`
- Value: Your project URL
- Where to find: Settings → API → Project URL
- Example: `https://xxxxx.supabase.co`

**Secret 2: SUPABASE_SERVICE_ROLE_KEY**
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: Your service role key
- Where to find: Settings → API → service_role (click "Reveal")
- Example: `eyJhbGc...` (very long string)

**Secret 3: RESEND_API_KEY**
- Name: `RESEND_API_KEY`
- Value: The API key you copied from Resend
- Example: `re_...` (starts with re_)

### 5.3 Save
Click **Save** button

---

## STEP 6: Schedule Cron Jobs (3 minutes)

### 6.1 Get Your Credentials
Before running SQL, get these values:

**YOUR_SUPABASE_URL:**
- Settings → API → Project URL
- Example: `https://xxxxx.supabase.co`

**YOUR_ANON_KEY:**
- Settings → API → anon public (click "Reveal")
- Example: `eyJhbGc...`

### 6.2 Run SQL
1. Go to Supabase Dashboard
2. Click **SQL Editor** (sidebar)
3. Click **New query**
4. Copy and paste this (replace YOUR_SUPABASE_URL and YOUR_ANON_KEY):

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS http;

-- Schedule daily reminders at 9 AM UTC (2:30 PM IST)
SELECT cron.schedule(
  'send-daily-reminders-resend',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'YOUR_SUPABASE_URL/functions/v1/send-reminder-emails-resend',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_ANON_KEY'
    ),
    body := jsonb_build_object('type', 'daily')
  );
  $$
);

-- Schedule weekly reminders on Mondays at 9 AM UTC
SELECT cron.schedule(
  'send-weekly-reminders-resend',
  '0 9 * * 1',
  $$
  SELECT net.http_post(
    url := 'YOUR_SUPABASE_URL/functions/v1/send-reminder-emails-resend',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_ANON_KEY'
    ),
    body := jsonb_build_object('type', 'weekly')
  );
  $$
);
```

5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Should see "Success. No rows returned"

### 6.3 Verify Cron Jobs
In SQL Editor, run:
```sql
SELECT * FROM cron.job;
```

You should see 2 jobs:
- `send-daily-reminders-resend`
- `send-weekly-reminders-resend`

---

## STEP 7: Test Email Sending (6 minutes)

### 7.1 Add Test Data in Your App
1. Open your app
2. Add a subscription:
   - Name: Netflix
   - Amount: 699
   - Category: Streaming
   - Renewal Date: **Pick a date 3 days from today**
   - Billing Cycle: Monthly
3. Click Save

### 7.2 Set Reminder Preferences
1. Go to **Reminders** page
2. Set frequency: **daily**
3. Set days before: **3**
4. Click **Save Reminder Settings**

### 7.3 Manually Trigger Email Function
Open terminal and run:

```bash
curl -i --location --request POST 'https://YOUR_PROJECT.supabase.co/functions/v1/send-reminder-emails-resend' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"daily"}'
```

Replace:
- `YOUR_PROJECT` with your project ref
- `YOUR_ANON_KEY` with your anon key

### 7.4 Check Response
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

### 7.5 Check Your Email Inbox
1. Open your email (the one you signed in with)
2. Look for email from "SubSentry <onboarding@resend.dev>"
3. Subject: "🔔 1 Subscription Renewing Soon"
4. You should see a beautiful email with your Netflix subscription!

### 7.6 Verify in Resend Dashboard
1. Go to [resend.com](https://resend.com)
2. Click "Emails" in sidebar
3. You should see your sent email
4. Click on it to see details

### 7.7 Check Database Logs
1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Select **reminder_logs** table
4. You should see a new entry:
   - status: "sent"
   - email_sent_to: your email
   - sent_at: current timestamp

---

## STEP 8: View Function Logs (Optional)

```bash
# View recent logs
supabase functions logs send-reminder-emails-resend

# View logs in real-time
supabase functions logs send-reminder-emails-resend --tail
```

---

## ✅ Verification Checklist

- [ ] Resend account created
- [ ] API key obtained and saved
- [ ] Supabase CLI installed
- [ ] Project linked
- [ ] Edge function deployed
- [ ] Environment variables set (3 secrets)
- [ ] Cron jobs scheduled (2 jobs)
- [ ] Test subscription added
- [ ] Reminder settings saved
- [ ] Manual test successful
- [ ] Email received in inbox
- [ ] Email visible in Resend dashboard
- [ ] Log entry in reminder_logs table

---

## 🎉 You're Done!

Your email reminder system is now:
- ✅ Fully deployed
- ✅ Sending real emails via Resend
- ✅ Scheduled to run daily at 9 AM UTC
- ✅ Scheduled to run weekly on Mondays
- ✅ Tracking all sent emails in database

---

## Monitoring & Maintenance

### Check Cron Execution History
```sql
SELECT * FROM cron.job_run_details 
ORDER BY start_time DESC 
LIMIT 20;
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

### View Function Logs
```bash
supabase functions logs send-reminder-emails-resend --tail
```

---

## Resend Free Tier Limits

- **3,000 emails per month**
- **100 emails per day**
- Perfect for personal use and small apps

If you need more:
- Pro plan: $20/month for 50,000 emails
- See [resend.com/pricing](https://resend.com/pricing)

---

## Troubleshooting

### Email not received?
1. Check spam folder
2. Check Resend dashboard for delivery status
3. Check function logs: `supabase functions logs send-reminder-emails-resend`
4. Check reminder_logs table for errors

### "RESEND_API_KEY is not set" error?
1. Go to Edge Functions → Configuration
2. Verify RESEND_API_KEY is added
3. Redeploy function: `supabase functions deploy send-reminder-emails-resend`

### Cron jobs not running?
```sql
-- Check if extensions are enabled
SELECT * FROM pg_extension WHERE extname IN ('pg_cron', 'http');

-- Check job status
SELECT * FROM cron.job;

-- Check execution history
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

### Function deployment fails?
```bash
# Update Supabase CLI
npm install -g supabase@latest

# Try deploying again
supabase functions deploy send-reminder-emails-resend
```

---

## Next Steps

### Customize Email Template
Edit `supabase/functions/send-reminder-emails-resend/index.ts`:
- Change colors
- Add your logo
- Modify text
- Update styling

Then redeploy:
```bash
supabase functions deploy send-reminder-emails-resend
```

### Use Your Own Domain
1. Verify your domain in Resend
2. Update the `from` field in the function:
   ```typescript
   from: 'SubSentry <noreply@yourdomain.com>',
   ```
3. Redeploy function

### Add More Reminder Types
- Add "3 days before" reminders
- Add "1 day before" reminders
- Add "on the day" reminders

---

**Congratulations!** 🎉 Your email reminder system is production-ready!

**Total Time:** 20 minutes
**Status:** ✅ Fully Working
**Emails:** Real emails via Resend

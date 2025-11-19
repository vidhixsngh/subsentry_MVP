# Your Resend Setup - Ready to Deploy!

You already have:
- ✅ Resend API Key: `re_eGCUxW3g_K13n6e1JRbEz3VAkj4TVPmrq`
- ✅ API Key Name: subsentry_mvp

Now follow these steps to complete the setup:

---

## STEP 1: Deploy Edge Function (2 minutes)

Open terminal and run:

```bash
# Make sure you're in your project directory
cd /path/to/your/project

# Deploy the function
supabase functions deploy send-reminder-emails-resend
```

Wait for: "Deployed function send-reminder-emails-resend"

---

## STEP 2: Add Environment Variables (2 minutes)

### 2.1 Go to Supabase Dashboard
1. Open [app.supabase.com](https://app.supabase.com)
2. Select your SubSentry project
3. Click **Edge Functions** (in sidebar)
4. Click **Configuration** tab

### 2.2 Add Three Secrets

Click "Add new secret" for each:

**Secret 1:**
- Name: `SUPABASE_URL`
- Value: `https://talcquxnfwsukkxyvizo.supabase.co`

**Secret 2:**
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: Go to Settings → API → service_role (click "Reveal" and copy)

**Secret 3:**
- Name: `RESEND_API_KEY`
- Value: `re_eGCUxW3g_K13n6e1JRbEz3VAkj4TVPmrq`

Click **Save**

---

## STEP 3: Schedule Cron Jobs (2 minutes)

### 3.1 Get Your Anon Key
1. Go to Settings → API
2. Copy "anon public" key (click "Reveal")

### 3.2 Run SQL
1. Go to **SQL Editor**
2. Click "New query"
3. Copy and paste this (replace YOUR_ANON_KEY with the key you just copied):

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

4. Click **Run**
5. Should see "Success"

### 3.3 Verify
Run this in SQL Editor:
```sql
SELECT * FROM cron.job;
```

Should see 2 jobs listed.

---

## STEP 4: Test Email (3 minutes)

### 4.1 Add Test Subscription
In your app:
1. Add subscription: Netflix, ₹699, Streaming
2. Set renewal date: **3 days from today**
3. Save

### 4.2 Set Reminder
1. Go to Reminders page
2. Frequency: daily
3. Days before: 3
4. Save

### 4.3 Trigger Email Manually
In terminal, run (replace YOUR_ANON_KEY):

```bash
curl -i --location --request POST 'https://talcquxnfwsukkxyvizo.supabase.co/functions/v1/send-reminder-emails-resend' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"daily"}'
```

### 4.4 Check Email
1. Check your email inbox (the email you signed in with)
2. Look for email from "SubSentry <onboarding@resend.dev>"
3. Subject: "🔔 1 Subscription Renewing Soon"

### 4.5 Verify in Resend
1. Go to [resend.com/emails](https://resend.com/emails)
2. You should see your sent email

### 4.6 Check Database
1. Supabase → Table Editor → reminder_logs
2. Should see entry with status "sent"

---

## ✅ Done!

If you received the email, you're all set! 🎉

Your reminders will now:
- Run daily at 9 AM UTC (2:30 PM IST)
- Run weekly on Mondays at 9 AM UTC
- Send beautiful HTML emails via Resend
- Track everything in database

---

## View Logs

```bash
supabase functions logs send-reminder-emails-resend --tail
```

---

## Troubleshooting

### Email not received?
1. Check spam folder
2. Check Resend dashboard: [resend.com/emails](https://resend.com/emails)
3. Check function logs: `supabase functions logs send-reminder-emails-resend`
4. Check reminder_logs table for errors

### Function deployment failed?
```bash
# Update CLI
npm install -g supabase@latest

# Try again
supabase functions deploy send-reminder-emails-resend
```

### Need your anon key?
- Supabase Dashboard → Settings → API → anon public (click "Reveal")

---

**Total Time:** 9 minutes
**Status:** Ready to deploy!

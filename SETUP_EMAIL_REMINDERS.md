# Setup Email Reminders - Simple Guide

## Important Note About Supabase Built-in Email

⚠️ **Supabase's built-in email service is limited to authentication flows only** (signup, password reset, etc.). It cannot send custom reminder emails.

For actual email reminders, you have 2 options:

### Option 1: Console Logging Only (Testing - 10 min)
Reminders are logged to console instead of sent via email. Good for testing the logic.

### Option 2: Resend Integration (Production - 20 min)
Use Resend's free tier (3000 emails/month). Recommended for production.

---

## OPTION 1: Console Logging (For Testing)

This will log reminders to the console so you can test the logic without email.

### Step 1: Deploy Simple Function

```bash
# Install Supabase CLI if not already done
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the simple function
supabase functions deploy send-reminder-emails-simple
```

### Step 2: Set Environment Variables

In Supabase Dashboard → Edge Functions → Configuration:

Add these secrets:
- `SUPABASE_URL`: Your project URL (from Settings → API)
- `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (from Settings → API)

### Step 3: Schedule Cron Jobs

In Supabase Dashboard → SQL Editor, run:

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS http;

-- Daily reminders at 9 AM UTC
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

-- Weekly reminders on Mondays
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

Replace:
- `YOUR_SUPABASE_URL` with your project URL
- `YOUR_ANON_KEY` with your anon key

### Step 4: Test It

```bash
# Manually trigger the function
curl -i --location --request POST 'https://YOUR_PROJECT.supabase.co/functions/v1/send-reminder-emails-simple' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"daily"}'

# View logs
supabase functions logs send-reminder-emails-simple
```

You should see reminder summaries in the logs!

---

## OPTION 2: Resend Integration (Production)

For actual email delivery, integrate with Resend (free tier: 3000 emails/month).

### Step 1: Sign Up for Resend

1. Go to [resend.com](https://resend.com)
2. Sign up (free)
3. Verify your email
4. Get your API key from dashboard

### Step 2: Update Edge Function

Replace the email sending part in `supabase/functions/send-reminder-emails/index.ts`:

```typescript
// Add at the top
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// Replace the email sending section with:
const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'SubSentry <noreply@yourdomain.com>',
    to: settings.email,
    subject: `🔔 ${subsToRemind.length} Subscription${subsToRemind.length > 1 ? 's' : ''} Renewing Soon`,
    html: emailContent,
  }),
});

if (!response.ok) {
  const error = await response.text();
  throw new Error(`Resend API error: ${error}`);
}
```

### Step 3: Add Resend API Key

In Supabase Dashboard → Edge Functions → Configuration:

Add secret:
- `RESEND_API_KEY`: Your Resend API key

### Step 4: Deploy Updated Function

```bash
supabase functions deploy send-reminder-emails
```

### Step 5: Test Real Emails

```bash
curl -i --location --request POST 'https://YOUR_PROJECT.supabase.co/functions/v1/send-reminder-emails' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"daily"}'
```

Check your email inbox!

---

## Testing Your Setup

### 1. Add Test Data

In your app:
1. Add a subscription with renewal date in 3 days
2. Go to Reminders page
3. Set frequency to "daily"
4. Set days before to "3"
5. Save

### 2. Manually Trigger Function

```bash
curl -i --location --request POST 'https://YOUR_PROJECT.supabase.co/functions/v1/send-reminder-emails-simple' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"daily"}'
```

### 3. Check Results

**Option 1 (Console Logging):**
```bash
supabase functions logs send-reminder-emails-simple
```
You should see the reminder summary in logs.

**Option 2 (Resend):**
- Check your email inbox
- Check Resend dashboard for delivery status

### 4. Verify Database Logs

In Supabase → Table Editor → reminder_logs:
- Should see entries with status "sent"
- Check sent_at timestamp

---

## Verify Cron Jobs

```sql
-- List all cron jobs
SELECT * FROM cron.job;

-- Check execution history
SELECT * FROM cron.job_run_details 
ORDER BY start_time DESC 
LIMIT 10;
```

---

## Troubleshooting

### Function not deploying?
```bash
# Check Supabase CLI version
supabase --version

# Update if needed
npm install -g supabase@latest

# Try deploying again
supabase functions deploy send-reminder-emails-simple
```

### Cron jobs not running?
```sql
-- Check if extensions are enabled
SELECT * FROM pg_extension 
WHERE extname IN ('pg_cron', 'http');

-- If not, enable them
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS http;
```

### No reminders being logged?
```sql
-- Check if you have reminder settings
SELECT * FROM user_reminder_settings;

-- Check if you have subscriptions
SELECT * FROM subscriptions;

-- Check if subscriptions are renewing soon
SELECT * FROM subscriptions 
WHERE renewal_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days';
```

---

## Summary

✅ **Option 1 (Console Logging):**
- Good for: Testing, development
- Time: 10 minutes
- Cost: Free
- Limitation: No actual emails sent

✅ **Option 2 (Resend):**
- Good for: Production
- Time: 20 minutes
- Cost: Free (3000 emails/month)
- Benefit: Real email delivery

---

## Recommended Approach

1. **Start with Option 1** - Test the logic
2. **Verify everything works** - Check logs and database
3. **Upgrade to Option 2** - When ready for production

---

**Need help?** Check the function logs:
```bash
supabase functions logs send-reminder-emails-simple --tail
```

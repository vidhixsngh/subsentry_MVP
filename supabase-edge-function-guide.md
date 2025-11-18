# Supabase Edge Function Setup for Email Reminders

## Prerequisites
- Supabase CLI installed: `npm install -g supabase`
- Supabase project linked: `supabase link --project-ref YOUR_PROJECT_REF`

## Step 1: Initialize Supabase Functions (if not already done)
```bash
supabase functions new send-reminder-emails
```

## Step 2: Create the Edge Function
The function code is in `supabase/functions/send-reminder-emails/index.ts`

## Step 3: Set Environment Variables in Supabase Dashboard
Go to: Project Settings → Edge Functions → Add new secret

Add these secrets:
- `SUPABASE_SERVICE_ROLE_KEY` - Your service role key (from Project Settings → API)
- `SUPABASE_URL` - Your project URL (from Project Settings → API)

## Step 4: Deploy the Edge Function
```bash
supabase functions deploy send-reminder-emails
```

## Step 5: Set up Cron Job (Scheduled Execution)

### Option A: Using Supabase pg_cron (Recommended)
Run this SQL in Supabase SQL Editor:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily check at 9 AM UTC
SELECT cron.schedule(
  'send-daily-reminders',
  '0 9 * * *', -- Every day at 9 AM UTC
  $$
  SELECT
    net.http_post(
      url := 'YOUR_SUPABASE_PROJECT_URL/functions/v1/send-reminder-emails',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_ANON_KEY'
      ),
      body := jsonb_build_object('type', 'daily')
    ) AS request_id;
  $$
);

-- Schedule weekly check on Mondays at 9 AM UTC
SELECT cron.schedule(
  'send-weekly-reminders',
  '0 9 * * 1', -- Every Monday at 9 AM UTC
  $$
  SELECT
    net.http_post(
      url := 'YOUR_SUPABASE_PROJECT_URL/functions/v1/send-reminder-emails',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_ANON_KEY'
      ),
      body := jsonb_build_object('type', 'weekly')
    ) AS request_id;
  $$
);
```

### Option B: Using External Cron Service (Alternative)
Use services like:
- **Cron-job.org** (free)
- **EasyCron** (free tier available)
- **GitHub Actions** (if your code is on GitHub)

Set up two cron jobs:
1. Daily: `POST https://YOUR_PROJECT.supabase.co/functions/v1/send-reminder-emails`
   - Body: `{"type": "daily"}`
   - Header: `Authorization: Bearer YOUR_ANON_KEY`

2. Weekly: Same URL with body `{"type": "weekly"}`

## Step 6: Test the Function Manually
```bash
# Test locally
supabase functions serve send-reminder-emails

# In another terminal, test it
curl -i --location --request POST 'http://localhost:54321/functions/v1/send-reminder-emails' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"daily"}'
```

## Step 7: Monitor Logs
```bash
# View function logs
supabase functions logs send-reminder-emails

# Or in Supabase Dashboard → Edge Functions → send-reminder-emails → Logs
```

## Troubleshooting
- If emails aren't sending, check Edge Function logs
- Verify SMTP settings in Supabase Dashboard → Project Settings → Auth → SMTP Settings
- Check reminder_logs table for error messages
- Ensure RLS policies allow service role to insert logs

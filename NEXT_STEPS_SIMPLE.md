# Your Next Steps - Simple Guide

## ✅ What You Already Have
- ✅ Database tables created in Supabase
- ✅ Google OAuth working
- ✅ Supabase built-in email (no custom SMTP needed)

---

## 🎯 STEP 1: Test Your App with Real Data (5 minutes)

Your pages are now updated to use real Supabase data. Let's test:

```bash
# Start your app
npm run dev
```

### Test Checklist:
1. **Login** - Sign in with Google (should work already)
2. **Dashboard** - Should load (might be empty if no subscriptions)
3. **Add Subscription** - Click "Add Subscription" button
   - Fill in the form
   - Click Save
   - Should redirect and show in dashboard
4. **View Subscription** - Click on a subscription
   - Should show details
   - Try editing it
   - Try deleting it
5. **Analytics** - Click "View Analytics"
   - Should show calculated data
6. **Reminders** - Click "Setup Reminders"
   - Choose frequency (daily/weekly)
   - Choose days before (1, 3, 7, 14)
   - Click Save

---

## 🎯 STEP 2: Deploy Edge Function for Email Reminders (15 minutes)

### A. Install Supabase CLI
```bash
npm install -g supabase
```

### B. Login and Link Project
```bash
# Login
supabase login

# Link your project (get ref from Supabase Dashboard → Settings → General → Reference ID)
supabase link --project-ref YOUR_PROJECT_REF
```

### C. Deploy the Email Function
```bash
supabase functions deploy send-reminder-emails
```

### D. Set Environment Variables in Supabase Dashboard
1. Go to Supabase Dashboard → Edge Functions → Configuration
2. Add these secrets:
   - `SUPABASE_URL`: Your project URL (from Settings → API)
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (from Settings → API)

---

## 🎯 STEP 3: Set Up Automated Email Sending (10 minutes)

### A. Enable Required Extensions
Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Enable pg_cron for scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable http for making requests
CREATE EXTENSION IF NOT EXISTS http;
```

### B. Schedule Daily Reminders
Run this in SQL Editor (replace YOUR_SUPABASE_URL and YOUR_ANON_KEY):

```sql
-- Daily reminders at 9 AM UTC (2:30 PM IST)
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

### C. Schedule Weekly Reminders
Run this in SQL Editor:

```sql
-- Weekly reminders on Mondays at 9 AM UTC
SELECT cron.schedule(
  'send-weekly-reminders',
  '0 9 * * 1',
  $$
  SELECT net.http_post(
    url := 'YOUR_SUPABASE_URL/functions/v1/send-reminder-emails',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_ANON_KEY'
    ),
    body := jsonb_build_object('type', 'weekly')
  );
  $$
);
```

**Where to find YOUR_SUPABASE_URL and YOUR_ANON_KEY:**
- Go to Supabase Dashboard → Settings → API
- Copy "Project URL" and "anon public" key

---

## 🎯 STEP 4: Test Email Reminders (5 minutes)

### A. Add Test Data
1. Add a subscription with renewal date in 3 days
2. Go to Reminders page
3. Set frequency to "daily"
4. Set days before to "3"
5. Save settings

### B. Manually Trigger Email Function
```bash
curl -i --location --request POST 'https://YOUR_PROJECT.supabase.co/functions/v1/send-reminder-emails' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"daily"}'
```

### C. Check Results
1. Check your email inbox (the email you signed in with)
2. Go to Supabase → Table Editor → reminder_logs
3. You should see a log entry with status "sent"

---

## 🎯 STEP 5: Verify Cron Jobs (2 minutes)

Check if cron jobs are scheduled:

```sql
-- In Supabase SQL Editor
SELECT * FROM cron.job;
```

You should see two jobs:
- `send-daily-reminders`
- `send-weekly-reminders`

Check execution history:

```sql
SELECT * FROM cron.job_run_details 
ORDER BY start_time DESC 
LIMIT 10;
```

---

## 🎉 You're Done!

Your app now has:
- ✅ Real-time subscription management
- ✅ Analytics dashboard
- ✅ Reminder settings
- ✅ Automated email reminders (daily/weekly)
- ✅ Scheduled cron jobs

---

## 🐛 Troubleshooting

### Subscriptions not showing?
- Check browser console for errors
- Verify you're logged in
- Check Supabase → Table Editor → subscriptions

### Can't add subscription?
- Check browser console
- Verify RLS policies are set up
- Check Network tab for API errors

### Emails not sending?
- Check Edge Function logs: `supabase functions logs send-reminder-emails`
- Verify cron jobs are scheduled: `SELECT * FROM cron.job;`
- Check reminder_logs table for errors

### "Permission denied" errors?
- Verify you're logged in
- Check RLS policies in database
- Ensure auth.uid() matches user_id

---

## 📊 Monitor Your App

### View Edge Function Logs
```bash
supabase functions logs send-reminder-emails --tail
```

### Check Reminder Logs
```sql
-- Recent reminders
SELECT * FROM reminder_logs 
ORDER BY sent_at DESC 
LIMIT 20;

-- Failed emails
SELECT * FROM reminder_logs 
WHERE status = 'failed';
```

### Check Cron Execution
```sql
SELECT * FROM cron.job_run_details 
ORDER BY start_time DESC 
LIMIT 10;
```

---

## 🚀 Optional: Customize Email Template

The email template is in `supabase/functions/send-reminder-emails/index.ts`

Look for the `generateEmailContent()` function and customize:
- Colors
- Logo
- Text
- Layout

Then redeploy:
```bash
supabase functions deploy send-reminder-emails
```

---

## 📞 Need Help?

- Check browser console for errors
- Check Supabase logs in Dashboard
- Review `QUICK_REFERENCE.md` for commands
- Join Supabase Discord: https://discord.supabase.com

---

**Total Time**: ~35 minutes
**Difficulty**: Easy (you've done the hard part!)

Happy coding! 🎉

# ✅ Your To-Do List

## What You Need to Do Now

---

## 🎯 PHASE 1: Test Your App (5 minutes)

### Step 1: Start the app
```bash
npm run dev
```

### Step 2: Test each feature

- [ ] **Login** - Sign in with Google (should already work)
- [ ] **Add Subscription**
  - [ ] Click "Add Subscription" button
  - [ ] Fill in: Name, Amount, Category, Renewal Date, Billing Cycle
  - [ ] Click Save
  - [ ] Should redirect and show in dashboard
- [ ] **View Dashboard**
  - [ ] See your subscription listed
  - [ ] Check stats are showing
  - [ ] Verify upcoming renewals section
- [ ] **Edit Subscription**
  - [ ] Click on a subscription
  - [ ] Click Edit
  - [ ] Change something (e.g., amount)
  - [ ] Save
  - [ ] Verify changes appear
- [ ] **Delete Subscription**
  - [ ] Click on a subscription
  - [ ] Click Delete
  - [ ] Confirm deletion
  - [ ] Verify it's removed from dashboard
- [ ] **Analytics**
  - [ ] Click "View Analytics"
  - [ ] Check total monthly spending
  - [ ] Verify category breakdown
  - [ ] See top 3 subscriptions
- [ ] **Reminders**
  - [ ] Click "Setup Reminders"
  - [ ] Choose frequency (daily or weekly)
  - [ ] Choose days before (1, 3, 7, or 14)
  - [ ] Click Save
  - [ ] Should redirect to confirmation

### ✅ If all tests pass → Move to Phase 2
### ❌ If something fails → Check browser console and let me know

---

## 🎯 PHASE 2: Deploy Email Function (15 minutes)

### Step 1: Install Supabase CLI
```bash
npm install -g supabase
```

### Step 2: Login to Supabase
```bash
supabase login
```
- Browser will open
- Click "Authorize"

### Step 3: Get your Project Reference ID
- [ ] Go to Supabase Dashboard
- [ ] Click Settings (gear icon)
- [ ] Click General
- [ ] Copy "Reference ID" (looks like: abcdefghijklmnop)

### Step 4: Link your project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```
Replace `YOUR_PROJECT_REF` with the ID you copied

### Step 5: Deploy the function
```bash
supabase functions deploy send-reminder-emails
```

### Step 6: Set environment variables
- [ ] Go to Supabase Dashboard
- [ ] Click Edge Functions (in sidebar)
- [ ] Click "Configuration" tab
- [ ] Click "Add new secret"
- [ ] Add `SUPABASE_URL`:
  - Go to Settings → API
  - Copy "Project URL"
  - Paste as value
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY`:
  - Go to Settings → API
  - Copy "service_role" key (click "Reveal" first)
  - Paste as value
- [ ] Click Save

---

## 🎯 PHASE 3: Schedule Automated Emails (10 minutes)

### Step 1: Enable extensions
- [ ] Go to Supabase Dashboard
- [ ] Click SQL Editor (in sidebar)
- [ ] Click "New query"
- [ ] Paste this:
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS http;
```
- [ ] Click Run (or press Cmd/Ctrl + Enter)
- [ ] Should see "Success"

### Step 2: Get your credentials
- [ ] Go to Settings → API
- [ ] Copy "Project URL" (save for next step)
- [ ] Copy "anon public" key (save for next step)

### Step 3: Schedule daily reminders
- [ ] In SQL Editor, paste this:
```sql
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
- [ ] Replace `YOUR_SUPABASE_URL` with your Project URL
- [ ] Replace `YOUR_ANON_KEY` with your anon public key
- [ ] Click Run
- [ ] Should see "Success"

### Step 4: Schedule weekly reminders
- [ ] In SQL Editor, paste this:
```sql
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
- [ ] Replace `YOUR_SUPABASE_URL` and `YOUR_ANON_KEY` (same as above)
- [ ] Click Run
- [ ] Should see "Success"

### Step 5: Verify cron jobs
- [ ] In SQL Editor, paste this:
```sql
SELECT * FROM cron.job;
```
- [ ] Click Run
- [ ] Should see 2 jobs:
  - `send-daily-reminders`
  - `send-weekly-reminders`

---

## 🎯 PHASE 4: Test Email Reminders (5 minutes)

### Step 1: Add test data
- [ ] In your app, add a subscription with renewal date in 3 days
- [ ] Go to Reminders page
- [ ] Set frequency to "daily"
- [ ] Set days before to "3"
- [ ] Save

### Step 2: Manually trigger email
Open terminal and run:
```bash
curl -i --location --request POST 'https://YOUR_PROJECT.supabase.co/functions/v1/send-reminder-emails' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"daily"}'
```
Replace:
- `YOUR_PROJECT` with your project ref
- `YOUR_ANON_KEY` with your anon key

### Step 3: Check results
- [ ] Check your email inbox (the email you signed in with)
- [ ] Go to Supabase → Table Editor → reminder_logs
- [ ] Should see a log entry with status "sent"

### Step 4: View function logs
```bash
supabase functions logs send-reminder-emails
```
- [ ] Should see execution logs
- [ ] Check for any errors

---

## 🎉 DONE!

If all checkboxes are checked, you have:
- ✅ Working subscription management
- ✅ Real-time analytics
- ✅ Automated email reminders
- ✅ Scheduled cron jobs

---

## 🐛 Troubleshooting

### If app doesn't load subscriptions:
1. Open browser console (F12)
2. Look for red errors
3. Check Network tab for failed requests
4. Verify you're logged in

### If can't add subscription:
1. Check browser console
2. Go to Supabase → Table Editor → subscriptions
3. Try adding manually to verify RLS policies work

### If emails don't send:
1. Check Edge Function logs:
   ```bash
   supabase functions logs send-reminder-emails
   ```
2. Verify cron jobs:
   ```sql
   SELECT * FROM cron.job;
   ```
3. Check reminder_logs table for errors

### If cron jobs don't run:
1. Check execution history:
   ```sql
   SELECT * FROM cron.job_run_details 
   ORDER BY start_time DESC 
   LIMIT 10;
   ```
2. Verify extensions are enabled:
   ```sql
   SELECT * FROM pg_extension 
   WHERE extname IN ('pg_cron', 'http');
   ```

---

## 📞 Need Help?

If you get stuck:
1. Check browser console for errors
2. Check Supabase Dashboard → Logs
3. Review QUICK_REFERENCE.md for commands
4. Let me know what error you're seeing

---

**Total Time**: ~35 minutes
**You got this!** 🚀

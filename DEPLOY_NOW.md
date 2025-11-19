# 🚀 Deploy Email Reminders NOW - Quick Commands

## Step 1: Deploy Function (30 seconds)

```bash
supabase functions deploy send-reminder-emails-resend
```

---

## Step 2: Add Secrets in Supabase Dashboard (2 min)

Go to: Edge Functions → Configuration → Add new secret

**Add these 3 secrets:**

1. Name: `SUPABASE_URL`
   Value: `https://talcquxnfwsukkxyvizo.supabase.co`

2. Name: `SUPABASE_SERVICE_ROLE_KEY`
   Value: (Get from Settings → API → service_role, click "Reveal")

3. Name: `RESEND_API_KEY`
   Value: `re_eGCUxW3g_K13n6e1JRbEz3VAkj4TVPmrq`

Click **Save**

---

## Step 3: Schedule Cron Jobs (1 min)

**Get your anon key first:**
- Settings → API → anon public (click "Reveal")

**Then run this SQL** (replace YOUR_ANON_KEY):

```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS http;

SELECT cron.schedule('send-daily-reminders-resend', '0 9 * * *', $$
  SELECT net.http_post(
    url := 'https://talcquxnfwsukkxyvizo.supabase.co/functions/v1/send-reminder-emails-resend',
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer YOUR_ANON_KEY'),
    body := jsonb_build_object('type', 'daily')
  );
$$);

SELECT cron.schedule('send-weekly-reminders-resend', '0 9 * * 1', $$
  SELECT net.http_post(
    url := 'https://talcquxnfwsukkxyvizo.supabase.co/functions/v1/send-reminder-emails-resend',
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer YOUR_ANON_KEY'),
    body := jsonb_build_object('type', 'weekly')
  );
$$);
```

---

## Step 4: Test It (1 min)

**Add test data in your app:**
- Add subscription with renewal in 3 days
- Set reminder: daily, 3 days before

**Then run this** (replace YOUR_ANON_KEY):

```bash
curl -i --location --request POST 'https://talcquxnfwsukkxyvizo.supabase.co/functions/v1/send-reminder-emails-resend' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"daily"}'
```

**Check your email!** 📧

---

## Verify

```sql
-- Check cron jobs
SELECT * FROM cron.job;

-- Check logs
SELECT * FROM reminder_logs ORDER BY sent_at DESC LIMIT 5;
```

---

**Total Time:** 5 minutes
**You got this!** 🎉

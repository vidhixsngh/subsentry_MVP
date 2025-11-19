# Resend Email Reminders - Quick Command Reference

## 🚀 Setup Commands (Copy & Paste)

### 1. Install & Login
```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

### 2. Deploy Function
```bash
supabase functions deploy send-reminder-emails-resend
```

### 3. Test Email
```bash
curl -i --location --request POST 'https://YOUR_PROJECT.supabase.co/functions/v1/send-reminder-emails-resend' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"daily"}'
```

---

## 📊 Monitoring Commands

### View Function Logs
```bash
# Recent logs
supabase functions logs send-reminder-emails-resend

# Real-time logs
supabase functions logs send-reminder-emails-resend --tail
```

### Check Database (Run in SQL Editor)
```sql
-- Check cron jobs
SELECT * FROM cron.job;

-- Check execution history
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;

-- Check reminder logs
SELECT * FROM reminder_logs ORDER BY sent_at DESC LIMIT 20;

-- Check failed emails
SELECT * FROM reminder_logs WHERE status = 'failed';
```

---

## 🔧 Environment Variables Needed

Add these in Supabase Dashboard → Edge Functions → Configuration:

| Name | Value | Where to Find |
|------|-------|---------------|
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` | Settings → API → service_role |
| `RESEND_API_KEY` | `re_...` | resend.com → API Keys |

---

## 📅 Cron Schedule SQL

```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS http;

-- Daily at 9 AM UTC
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

-- Weekly on Mondays
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

---

## 🔍 Troubleshooting Commands

### Redeploy Function
```bash
supabase functions deploy send-reminder-emails-resend
```

### Update CLI
```bash
npm install -g supabase@latest
```

### Check Extensions
```sql
SELECT * FROM pg_extension WHERE extname IN ('pg_cron', 'http');
```

### Delete Cron Job (if needed)
```sql
SELECT cron.unschedule('send-daily-reminders-resend');
SELECT cron.unschedule('send-weekly-reminders-resend');
```

---

## 📧 Resend Dashboard Links

- **Dashboard:** [resend.com/overview](https://resend.com/overview)
- **Emails:** [resend.com/emails](https://resend.com/emails)
- **API Keys:** [resend.com/api-keys](https://resend.com/api-keys)
- **Domains:** [resend.com/domains](https://resend.com/domains)

---

## ✅ Quick Test Checklist

1. [ ] Add subscription with renewal in 3 days
2. [ ] Set reminder: daily, 3 days before
3. [ ] Run curl command to trigger function
4. [ ] Check email inbox
5. [ ] Check Resend dashboard
6. [ ] Check reminder_logs table

---

## 🎯 Expected Response

```json
{
  "success": true,
  "message": "Processed daily reminders",
  "emailsSent": 1,
  "emailsFailed": 0,
  "totalUsers": 1
}
```

---

**Save this file for quick reference!**

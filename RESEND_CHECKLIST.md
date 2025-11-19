# ✅ Resend Email Setup Checklist

Print this and check off each step as you complete it!

---

## Phase 1: Resend Account Setup

- [ ] Go to [resend.com](https://resend.com)
- [ ] Sign up for free account
- [ ] Verify email address
- [ ] Click "API Keys" in sidebar
- [ ] Create new API key named "SubSentry Production"
- [ ] Copy API key (starts with `re_...`)
- [ ] Save API key somewhere safe

**Time:** 3 minutes

---

## Phase 2: Supabase CLI Setup

- [ ] Run: `npm install -g supabase`
- [ ] Run: `supabase --version` (verify installed)
- [ ] Run: `supabase login` (browser opens)
- [ ] Click "Authorize" in browser
- [ ] Get project ref from Supabase Dashboard → Settings → General
- [ ] Run: `supabase link --project-ref YOUR_REF`
- [ ] See "Linked to project..." message

**Time:** 2 minutes

---

## Phase 3: Deploy Edge Function

- [ ] Run: `supabase functions deploy send-reminder-emails-resend`
- [ ] Wait for deployment to complete
- [ ] See "Deployed function..." message
- [ ] Go to Supabase Dashboard → Edge Functions
- [ ] Verify `send-reminder-emails-resend` is listed

**Time:** 3 minutes

---

## Phase 4: Environment Variables

- [ ] Go to Supabase Dashboard → Edge Functions → Configuration
- [ ] Click "Add new secret"
- [ ] Add `SUPABASE_URL` (from Settings → API → Project URL)
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` (from Settings → API → service_role)
- [ ] Add `RESEND_API_KEY` (the key you copied from Resend)
- [ ] Click "Save"
- [ ] Verify all 3 secrets are listed

**Time:** 2 minutes

---

## Phase 5: Schedule Cron Jobs

- [ ] Go to Supabase Dashboard → SQL Editor
- [ ] Click "New query"
- [ ] Get YOUR_SUPABASE_URL from Settings → API
- [ ] Get YOUR_ANON_KEY from Settings → API (anon public)
- [ ] Copy SQL from RESEND_QUICK_COMMANDS.md
- [ ] Replace YOUR_SUPABASE_URL and YOUR_ANON_KEY
- [ ] Click "Run"
- [ ] See "Success. No rows returned"
- [ ] Run: `SELECT * FROM cron.job;`
- [ ] Verify 2 jobs are listed

**Time:** 3 minutes

---

## Phase 6: Test Email Sending

### 6.1 Add Test Data
- [ ] Open your app
- [ ] Add subscription: Netflix, ₹699, Streaming
- [ ] Set renewal date: 3 days from today
- [ ] Click Save
- [ ] Go to Reminders page
- [ ] Set frequency: daily
- [ ] Set days before: 3
- [ ] Click Save

### 6.2 Trigger Function
- [ ] Copy curl command from RESEND_QUICK_COMMANDS.md
- [ ] Replace YOUR_PROJECT and YOUR_ANON_KEY
- [ ] Run in terminal
- [ ] See response with "emailsSent": 1

### 6.3 Verify Email
- [ ] Check email inbox
- [ ] Find email from "SubSentry <onboarding@resend.dev>"
- [ ] Open email
- [ ] Verify Netflix subscription is shown
- [ ] Verify amount is ₹699.00

### 6.4 Check Dashboards
- [ ] Go to resend.com → Emails
- [ ] See your sent email listed
- [ ] Go to Supabase → Table Editor → reminder_logs
- [ ] See new entry with status "sent"

**Time:** 6 minutes

---

## Phase 7: Verify Everything

- [ ] Run: `supabase functions logs send-reminder-emails-resend`
- [ ] See successful execution logs
- [ ] Run SQL: `SELECT * FROM cron.job;`
- [ ] See 2 cron jobs
- [ ] Run SQL: `SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 5;`
- [ ] Check execution history
- [ ] Run SQL: `SELECT * FROM reminder_logs ORDER BY sent_at DESC LIMIT 5;`
- [ ] See your test email log

**Time:** 1 minute

---

## ✅ Final Verification

- [ ] Email received in inbox ✅
- [ ] Email looks good (formatting, content) ✅
- [ ] Resend dashboard shows email ✅
- [ ] Database has log entry ✅
- [ ] Cron jobs are scheduled ✅
- [ ] Function logs show success ✅

---

## 🎉 Success Criteria

If all boxes are checked:
- ✅ Your email reminder system is LIVE
- ✅ Emails will be sent daily at 9 AM UTC
- ✅ Weekly emails on Mondays at 9 AM UTC
- ✅ All emails tracked in database
- ✅ Free 3000 emails/month from Resend

---

## 📊 What Happens Next

### Daily (9 AM UTC / 2:30 PM IST):
1. Cron job triggers function
2. Function checks all users with daily reminders
3. Finds subscriptions renewing in next X days
4. Sends email via Resend
5. Logs to database

### Weekly (Mondays 9 AM UTC):
1. Same process for weekly reminder users

---

## 🔧 Maintenance

### Monthly:
- [ ] Check Resend dashboard for email count
- [ ] Review reminder_logs for any failures
- [ ] Check cron execution history

### As Needed:
- [ ] Update email template
- [ ] Adjust cron schedule
- [ ] Monitor Resend usage

---

## 📞 Support Resources

- **Resend Docs:** [resend.com/docs](https://resend.com/docs)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Function Logs:** `supabase functions logs send-reminder-emails-resend`

---

**Total Time:** 20 minutes
**Status:** ✅ Production Ready
**Cost:** Free (3000 emails/month)

**Congratulations! You're done!** 🎉

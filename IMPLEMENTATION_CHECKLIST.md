# SubSentry Backend Implementation Checklist

Use this checklist to track your progress setting up the complete Supabase backend.

---

## ✅ PHASE 1: Supabase Project Setup

- [ ] Create Supabase account at supabase.com
- [ ] Create new project "SubSentry"
- [ ] Save database password securely
- [ ] Copy Project URL from Settings → API
- [ ] Copy Anon/Public Key from Settings → API
- [ ] Copy Service Role Key from Settings → API (keep secret!)
- [ ] Create `.env` file in project root
- [ ] Add `VITE_SUPABASE_URL` to `.env`
- [ ] Add `VITE_SUPABASE_ANON_KEY` to `.env`
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` to `.env`
- [ ] Add `.env` to `.gitignore` (verify it's there)

---

## ✅ PHASE 2: Database Setup

- [ ] Open Supabase Dashboard → SQL Editor
- [ ] Run the SQL from `supabase-setup.sql` (creates all tables)
- [ ] Verify tables created: Go to Table Editor
  - [ ] `users` table exists
  - [ ] `subscriptions` table exists
  - [ ] `user_reminder_settings` table exists
  - [ ] `reminder_logs` table exists
- [ ] Verify indexes created (check in SQL Editor)
- [ ] Verify triggers created (check in Database → Triggers)
- [ ] Test RLS policies:
  - [ ] Try querying tables without auth (should fail)
  - [ ] Sign in and try querying (should work)

---

## ✅ PHASE 3: Authentication Setup

### Google OAuth Configuration

- [ ] Go to [Google Cloud Console](https://console.cloud.google.com)
- [ ] Create new project or select existing
- [ ] Enable Google+ API
- [ ] Go to APIs & Services → Credentials
- [ ] Create OAuth 2.0 Client ID
- [ ] Configure OAuth consent screen
  - [ ] Add app name: "SubSentry"
  - [ ] Add support email
  - [ ] Add authorized domain
- [ ] Create Web Application credentials
- [ ] Add authorized redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
- [ ] Add redirect URI for local: `http://localhost:5000/auth/callback`
- [ ] Copy Client ID
- [ ] Copy Client Secret
- [ ] Go to Supabase → Authentication → Providers
- [ ] Enable Google provider
- [ ] Paste Client ID and Client Secret
- [ ] Save settings
- [ ] Test Google login from your app

### Auth Callback Route

- [ ] Verify `app/auth/callback/route.ts` exists
- [ ] Test auth flow end-to-end
- [ ] Check user created in `auth.users` table
- [ ] Check user created in `public.users` table (via trigger)

---

## ✅ PHASE 4: Email Configuration (for Reminders)

### Option A: Use Supabase Built-in (Testing Only)
- [ ] Already configured, no action needed
- [ ] Note: Has rate limits, not for production

### Option B: Configure Resend (Recommended)
- [ ] Sign up at [resend.com](https://resend.com)
- [ ] Verify your domain (or use resend.dev for testing)
- [ ] Get API key from dashboard
- [ ] Go to Supabase → Project Settings → Auth → SMTP Settings
- [ ] Enable "Enable Custom SMTP"
- [ ] Enter SMTP settings:
  - Host: `smtp.resend.com`
  - Port: `587`
  - Username: `resend`
  - Password: Your Resend API key
  - Sender email: `noreply@yourdomain.com`
- [ ] Save settings
- [ ] Send test email to verify

---

## ✅ PHASE 5: Install Dependencies

- [ ] Run `npm install @supabase/supabase-js`
- [ ] Run `npm install @tanstack/react-query` (if not installed)
- [ ] Verify `package.json` has all dependencies
- [ ] Run `npm install` to ensure everything is installed

---

## ✅ PHASE 6: Update Frontend Code

### Supabase Client
- [ ] File `client/src/lib/supabase.ts` created
- [ ] Imports environment variables correctly
- [ ] Exports `supabase` client
- [ ] Types defined for database

### Custom Hooks
- [ ] File `client/src/hooks/useSubscriptions.ts` created
- [ ] File `client/src/hooks/useReminderSettings.ts` created
- [ ] File `client/src/hooks/useAnalytics.ts` created
- [ ] All hooks import from correct paths

### Update Pages to Use Real Data

#### Dashboard Page
- [ ] Import `useSubscriptions` hook
- [ ] Replace mock data with real subscriptions
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Test CRUD operations

#### Add Subscription Page
- [ ] Import `useSubscriptions` hook
- [ ] Use `createSubscription` mutation
- [ ] Handle success/error states
- [ ] Redirect after creation

#### Subscription Detail Page
- [ ] Import `useSubscription` hook
- [ ] Fetch single subscription by ID
- [ ] Use `updateSubscription` mutation
- [ ] Use `deleteSubscription` mutation

#### Analytics Page
- [ ] Import `useAnalytics` hook
- [ ] Replace mock analytics with real data
- [ ] Update charts/visualizations

#### Reminders Page
- [ ] Import `useReminderSettings` hook
- [ ] Fetch existing settings
- [ ] Use `saveSettings` mutation
- [ ] Add notification toggle
- [ ] Show success message

---

## ✅ PHASE 7: Edge Functions Setup

### Install Supabase CLI
- [ ] Run `npm install -g supabase`
- [ ] Verify installation: `supabase --version`

### Link Project
- [ ] Run `supabase login`
- [ ] Get project ref from Settings → General → Reference ID
- [ ] Run `supabase link --project-ref YOUR_REF`
- [ ] Verify linked successfully

### Create Edge Function
- [ ] Folder `supabase/functions/send-reminder-emails/` exists
- [ ] File `index.ts` has the email function code
- [ ] Review and customize email template
- [ ] Update email styling if needed

### Configure Edge Function Secrets
- [ ] Go to Supabase → Edge Functions → Configuration
- [ ] Add secret: `SUPABASE_URL` = your project URL
- [ ] Add secret: `SUPABASE_SERVICE_ROLE_KEY` = your service role key
- [ ] Add secret: `RESEND_API_KEY` = your Resend API key (if using)

### Deploy Edge Function
- [ ] Run `supabase functions deploy send-reminder-emails`
- [ ] Check deployment status in dashboard
- [ ] View function in Edge Functions list

### Test Edge Function
- [ ] Test locally: `supabase functions serve send-reminder-emails`
- [ ] Send test request with curl
- [ ] Check logs for errors
- [ ] Verify email sent (check inbox)
- [ ] Test deployed function with curl
- [ ] Check `reminder_logs` table for entries

---

## ✅ PHASE 8: Cron Job Setup

### Enable Extensions
- [ ] Go to SQL Editor
- [ ] Run: `CREATE EXTENSION IF NOT EXISTS pg_cron;`
- [ ] Run: `CREATE EXTENSION IF NOT EXISTS http;`
- [ ] Verify extensions enabled in Database → Extensions

### Schedule Daily Reminders
- [ ] Copy cron SQL from guide
- [ ] Replace `YOUR_SUPABASE_URL` with actual URL
- [ ] Replace `YOUR_ANON_KEY` with actual key
- [ ] Run SQL to create daily cron job
- [ ] Verify job created: `SELECT * FROM cron.job;`

### Schedule Weekly Reminders
- [ ] Copy weekly cron SQL from guide
- [ ] Replace placeholders with actual values
- [ ] Run SQL to create weekly cron job
- [ ] Verify both jobs exist

### Test Cron Jobs
- [ ] Wait for scheduled time OR
- [ ] Manually trigger: `SELECT cron.schedule(...)`
- [ ] Check execution: `SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;`
- [ ] Verify emails sent
- [ ] Check `reminder_logs` table

---

## ✅ PHASE 9: Testing

### Authentication Testing
- [ ] Open app in browser
- [ ] Click "Continue with Google"
- [ ] Complete OAuth flow
- [ ] Verify redirected to dashboard
- [ ] Check user in Supabase → Authentication → Users
- [ ] Check user in Table Editor → users table
- [ ] Test sign out
- [ ] Test sign in again

### Subscriptions Testing
- [ ] Add a new subscription
- [ ] Verify appears in dashboard
- [ ] Verify in Supabase Table Editor
- [ ] Edit subscription details
- [ ] Verify changes saved
- [ ] Delete subscription
- [ ] Verify removed from list
- [ ] Add multiple subscriptions for testing

### Reminder Settings Testing
- [ ] Go to Reminders page
- [ ] Set frequency to "daily"
- [ ] Set days before to "3"
- [ ] Save settings
- [ ] Verify saved in `user_reminder_settings` table
- [ ] Toggle notifications off
- [ ] Verify updated in database
- [ ] Toggle notifications on

### Analytics Testing
- [ ] Go to Analytics page
- [ ] Verify total monthly spending calculated correctly
- [ ] Check category breakdown
- [ ] Verify top 3 subscriptions shown
- [ ] Check least used subscription

### Email Reminders Testing
- [ ] Add subscription with renewal date in 3 days
- [ ] Set reminder settings (daily, 3 days before)
- [ ] Manually trigger Edge Function
- [ ] Check email inbox
- [ ] Verify email content is correct
- [ ] Check `reminder_logs` table
- [ ] Wait for cron job to run
- [ ] Verify automated email sent

---

## ✅ PHASE 10: Production Readiness

### Security
- [ ] All RLS policies enabled and tested
- [ ] Service role key not in client code
- [ ] Environment variables properly set
- [ ] `.env` in `.gitignore`
- [ ] No sensitive data in git history
- [ ] CORS configured correctly

### Performance
- [ ] Database indexes created
- [ ] Query performance acceptable (<500ms)
- [ ] Edge function cold start acceptable (<2s)
- [ ] Images optimized
- [ ] Bundle size reasonable

### Monitoring
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Monitor Edge Function logs regularly
- [ ] Set up alerts for failed emails
- [ ] Track reminder delivery rates
- [ ] Monitor database performance

### Documentation
- [ ] README updated with setup instructions
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Deployment process documented

---

## ✅ PHASE 11: Deployment

### Frontend Deployment (Vercel/Netlify)
- [ ] Connect GitHub repository
- [ ] Add environment variables
- [ ] Configure build settings
- [ ] Deploy
- [ ] Test production build
- [ ] Update Supabase redirect URLs

### Update Supabase Settings
- [ ] Add production URL to Auth → URL Configuration
- [ ] Add production URL to Google OAuth redirect URIs
- [ ] Update CORS settings if needed
- [ ] Test auth flow in production

---

## 🎉 Launch Checklist

- [ ] All features working in production
- [ ] Google OAuth working
- [ ] Subscriptions CRUD working
- [ ] Analytics displaying correctly
- [ ] Reminders saving correctly
- [ ] Emails sending successfully
- [ ] Cron jobs running on schedule
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Performance acceptable
- [ ] Security reviewed
- [ ] Monitoring in place

---

## 📊 Success Metrics to Track

After launch, monitor:
- [ ] User signups per day
- [ ] Active users
- [ ] Subscriptions added per user
- [ ] Email delivery rate
- [ ] Email open rate
- [ ] User retention
- [ ] Error rates
- [ ] Page load times

---

## 🐛 Common Issues & Solutions

### Issue: "User not found" after Google login
**Solution**: Check if trigger `on_auth_user_created` is working. Manually verify in both `auth.users` and `public.users` tables.

### Issue: "Permission denied" on queries
**Solution**: Review RLS policies. Ensure `auth.uid()` matches `user_id` in queries.

### Issue: Emails not sending
**Solution**: 
1. Check Edge Function logs
2. Verify SMTP settings
3. Check `reminder_logs` for errors
4. Ensure cron job is running

### Issue: Cron job not triggering
**Solution**:
1. Verify pg_cron extension enabled
2. Check job status: `SELECT * FROM cron.job;`
3. Check execution history: `SELECT * FROM cron.job_run_details;`

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [React Query Docs](https://tanstack.com/query/latest)
- [Resend Documentation](https://resend.com/docs)

---

**Estimated Total Time**: 3-4 hours
**Difficulty**: Intermediate

Good luck with your implementation! 🚀

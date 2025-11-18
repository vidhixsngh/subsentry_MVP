# Complete Supabase Backend Setup Guide for SubSentry

## Overview
This guide will help you migrate from mock data to a fully functional Supabase backend with authentication, database, and email reminders.

---

## PHASE 1: Initial Supabase Project Setup

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Choose your organization (or create one)
4. Fill in project details:
   - **Project Name**: SubSentry
   - **Database Password**: (Save this securely!)
   - **Region**: Choose closest to your users (e.g., Mumbai for India)
5. Click "Create new project" (takes ~2 minutes)

### Step 2: Get Your Project Credentials
Once created, go to **Project Settings → API**

Copy and save these values:
- **Project URL**: `https://xxxxx.supabase.co`
- **Anon/Public Key**: `eyJhbGc...` (for client-side)
- **Service Role Key**: `eyJhbGc...` (for server-side, keep secret!)

### Step 3: Update Your .env File
Create/update `.env` in your project root:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

---

## PHASE 2: Database Setup

### Step 4: Create Database Tables
Go to **SQL Editor** in Supabase Dashboard and run this SQL:

```sql
-- ============================================
-- SUBSENTRY DATABASE SCHEMA
-- ============================================

-- 1. Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Streaming', 'Utilities', 'Productivity', 'Entertainment', 'SaaS', 'Other')),
  renewal_date DATE NOT NULL,
  billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('Monthly', 'Quarterly', 'Yearly', 'Weekly')),
  status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Overdue')),
  payment_method TEXT,
  notes TEXT,
  last_used_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. User reminder settings table
CREATE TABLE IF NOT EXISTS user_reminder_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR NOT NULL,
  frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('daily', 'weekly')),
  days_before INTEGER NOT NULL DEFAULT 3,
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 4. Reminder logs table
CREATE TABLE IF NOT EXISTS reminder_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  email_sent_to VARCHAR NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
  error_message TEXT
);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_renewal_date ON subscriptions(renewal_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_reminder_settings_user_id ON user_reminder_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_user_id ON reminder_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_sent_at ON reminder_logs(sent_at);

-- 6. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminder_settings_updated_at
  BEFORE UPDATE ON user_reminder_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 8. Create function to auto-create user on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

### Step 5: Set Up Row Level Security (RLS)
Continue in SQL Editor:

```sql
-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reminder_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_logs ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id);

-- Subscriptions table policies
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own subscriptions"
  ON subscriptions FOR DELETE
  USING (auth.uid()::text = user_id);

-- Reminder settings policies
CREATE POLICY "Users can view their own reminder settings"
  ON user_reminder_settings FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own reminder settings"
  ON user_reminder_settings FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own reminder settings"
  ON user_reminder_settings FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own reminder settings"
  ON user_reminder_settings FOR DELETE
  USING (auth.uid()::text = user_id);

-- Reminder logs policies
CREATE POLICY "Users can view their own reminder logs"
  ON reminder_logs FOR SELECT
  USING (auth.uid()::text = user_id);

-- Service role can insert logs (for Edge Function)
CREATE POLICY "Service role can insert reminder logs"
  ON reminder_logs FOR INSERT
  WITH CHECK (true);
```

---

## PHASE 3: Authentication Setup

### Step 6: Configure Google OAuth
1. Go to **Authentication → Providers** in Supabase Dashboard
2. Find **Google** and click to expand
3. Toggle "Enable Sign in with Google"
4. You'll need Google OAuth credentials:

#### Get Google OAuth Credentials:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Configure consent screen if prompted
6. Application type: **Web application**
7. Add authorized redirect URIs:
   ```
   https://xxxxx.supabase.co/auth/v1/callback
   http://localhost:5000/auth/callback (for local dev)
   ```
8. Copy **Client ID** and **Client Secret**
9. Paste them in Supabase Google provider settings
10. Click **Save**

### Step 7: Configure Email Settings (for reminders)
1. Go to **Project Settings → Auth → SMTP Settings**
2. Choose one of these options:

#### Option A: Use Supabase's Built-in Email (Limited)
- Already configured, but has rate limits
- Good for testing

#### Option B: Use Custom SMTP (Recommended for Production)
Popular options:
- **Resend** (recommended, 3000 emails/month free)
- **SendGrid** (100 emails/day free)
- **AWS SES** (very cheap)

For Resend:
1. Sign up at [resend.com](https://resend.com)
2. Get API key
3. In Supabase SMTP settings:
   - Enable custom SMTP
   - Host: `smtp.resend.com`
   - Port: `587`
   - Username: `resend`
   - Password: Your Resend API key
   - Sender email: `noreply@yourdomain.com`

---

## PHASE 4: Update Frontend Code

### Step 8: Update Supabase Client Configuration

Check if `lib/supabase.ts` exists and update it:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Step 9: Update AuthContext to Use Real Supabase Auth

The AuthContext should handle:
- Google OAuth sign-in
- Session management
- User state
- Sign out

### Step 10: Create API Hooks for Subscriptions

Create hooks for:
- Fetching subscriptions
- Creating subscriptions
- Updating subscriptions
- Deleting subscriptions
- Analytics data

---

## PHASE 5: Edge Functions for Email Reminders

### Step 11: Install Supabase CLI
```bash
npm install -g supabase
```

### Step 12: Link Your Project
```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

Find your project ref in: Project Settings → General → Reference ID

### Step 13: Create Edge Function
```bash
supabase functions new send-reminder-emails
```

This creates: `supabase/functions/send-reminder-emails/index.ts`

Copy the code from the file I created earlier.

### Step 14: Set Environment Variables for Edge Function
In Supabase Dashboard → Edge Functions → Configuration:

Add secrets:
- `SUPABASE_URL`: Your project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your service role key
- `RESEND_API_KEY`: If using Resend for emails

### Step 15: Deploy Edge Function
```bash
supabase functions deploy send-reminder-emails
```

### Step 16: Set Up Cron Job for Scheduled Emails

In SQL Editor, run:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable http extension for making requests
CREATE EXTENSION IF NOT EXISTS http;

-- Schedule daily reminders at 9 AM UTC (2:30 PM IST)
SELECT cron.schedule(
  'send-daily-reminders',
  '0 9 * * *',
  $$
  SELECT
    net.http_post(
      url := 'YOUR_SUPABASE_URL/functions/v1/send-reminder-emails',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_ANON_KEY'
      ),
      body := jsonb_build_object('type', 'daily')
    ) AS request_id;
  $$
);

-- Schedule weekly reminders on Mondays at 9 AM UTC
SELECT cron.schedule(
  'send-weekly-reminders',
  '0 9 * * 1',
  $$
  SELECT
    net.http_post(
      url := 'YOUR_SUPABASE_URL/functions/v1/send-reminder-emails',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_ANON_KEY'
      ),
      body := jsonb_build_object('type', 'weekly')
    ) AS request_id;
  $$
);
```

Replace `YOUR_SUPABASE_URL` and `YOUR_ANON_KEY` with your actual values.

---

## PHASE 6: Testing

### Step 17: Test Authentication
1. Run your app: `npm run dev`
2. Click "Continue with Google"
3. Complete OAuth flow
4. Check Supabase Dashboard → Authentication → Users
5. Verify user was created in `users` table

### Step 18: Test Subscriptions CRUD
1. Add a subscription
2. View subscriptions list
3. Edit a subscription
4. Delete a subscription
5. Check Supabase Dashboard → Table Editor → subscriptions

### Step 19: Test Reminder Settings
1. Go to Reminders page
2. Set frequency and days before
3. Enable notifications
4. Check `user_reminder_settings` table

### Step 20: Test Email Function Manually
```bash
# Test locally first
supabase functions serve send-reminder-emails

# In another terminal
curl -i --location --request POST 'http://localhost:54321/functions/v1/send-reminder-emails' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"daily"}'
```

Or test deployed function:
```bash
curl -i --location --request POST 'https://YOUR_PROJECT.supabase.co/functions/v1/send-reminder-emails' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"daily"}'
```

---

## PHASE 7: Production Checklist

### Step 21: Security Review
- [ ] All RLS policies are enabled
- [ ] Service role key is not exposed in client code
- [ ] Environment variables are properly set
- [ ] CORS is configured correctly

### Step 22: Performance Optimization
- [ ] Database indexes are created
- [ ] Query performance is acceptable
- [ ] Edge function cold start time is reasonable

### Step 23: Monitoring Setup
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor Edge Function logs
- [ ] Set up alerts for failed emails
- [ ] Track reminder delivery rates

---

## Troubleshooting

### Common Issues:

**1. "User not found" after Google login**
- Check if trigger `on_auth_user_created` is working
- Manually check `auth.users` and `public.users` tables

**2. "Permission denied" errors**
- Review RLS policies
- Check if user is authenticated
- Verify `auth.uid()` matches `user_id`

**3. Emails not sending**
- Check Edge Function logs
- Verify SMTP settings
- Check `reminder_logs` table for errors
- Ensure cron job is running: `SELECT * FROM cron.job;`

**4. Cron job not triggering**
- Verify pg_cron extension is enabled
- Check cron job status: `SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;`
- Ensure http extension is enabled

---

## Next Steps After Setup

1. **Implement real-time subscriptions** using Supabase Realtime
2. **Add SMS reminders** using Twilio
3. **Implement AI insights** using OpenAI API
4. **Add subscription detection** from SMS/emails
5. **Create mobile app** using React Native + Supabase

---

## Useful Commands

```bash
# View Edge Function logs
supabase functions logs send-reminder-emails

# List all cron jobs
SELECT * FROM cron.job;

# View cron job execution history
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 20;

# Delete a cron job
SELECT cron.unschedule('send-daily-reminders');

# Test database connection
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

---

## Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [pg_cron Documentation](https://github.com/citusdata/pg_cron)

---

**Estimated Setup Time**: 2-3 hours for complete setup
**Difficulty**: Intermediate

Good luck! 🚀

# SubSentry Backend - Quick Reference Card

## 🔑 Essential Credentials

```bash
# .env file
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

**Where to find**:
- Supabase Dashboard → Settings → API

---

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link project
supabase link --project-ref YOUR_REF

# Deploy Edge Function
supabase functions deploy send-reminder-emails

# View function logs
supabase functions logs send-reminder-emails

# Test Edge Function locally
supabase functions serve send-reminder-emails
```

---

## 📊 Database Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | User profiles | id, email, username |
| `subscriptions` | User subscriptions | user_id, name, amount, renewal_date |
| `user_reminder_settings` | Reminder preferences | user_id, frequency, days_before |
| `reminder_logs` | Email history | user_id, sent_at, status |

---

## 🔐 RLS Policies

All tables have Row Level Security enabled:
- Users can only see/edit their own data
- Policies check: `auth.uid()::text = user_id`
- Service role bypasses RLS (for Edge Functions)

---

## 🎣 React Hooks Usage

### useSubscriptions
```typescript
import { useSubscriptions } from '@/hooks/useSubscriptions';

function Dashboard() {
  const { 
    subscriptions, 
    isLoading, 
    createSubscription,
    updateSubscription,
    deleteSubscription 
  } = useSubscriptions();
  
  // Use subscriptions array
}
```

### useReminderSettings
```typescript
import { useReminderSettings } from '@/hooks/useReminderSettings';

function Reminders() {
  const { 
    settings, 
    saveSettings,
    toggleNotifications 
  } = useReminderSettings();
  
  // Save settings
  saveSettings({ frequency: 'daily', days_before: 3 });
}
```

### useAnalytics
```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function Analytics() {
  const { analytics, isLoading } = useAnalytics();
  
  // analytics.totalMonthly
  // analytics.categoryBreakdown
  // analytics.top3
}
```

---

## 📧 Email Reminder Flow

```
1. Cron job triggers (9 AM daily/weekly)
2. Calls Edge Function
3. Queries users with notifications enabled
4. Finds subscriptions renewing soon
5. Generates email HTML
6. Sends via SMTP
7. Logs to reminder_logs table
```

---

## 🔧 Supabase Client Usage

### Query Data
```typescript
const { data, error } = await supabase
  .from('subscriptions')
  .select('*')
  .eq('user_id', userId);
```

### Insert Data
```typescript
const { data, error } = await supabase
  .from('subscriptions')
  .insert({ name: 'Netflix', amount: '199', ... });
```

### Update Data
```typescript
const { data, error } = await supabase
  .from('subscriptions')
  .update({ amount: '299' })
  .eq('id', subscriptionId);
```

### Delete Data
```typescript
const { error } = await supabase
  .from('subscriptions')
  .delete()
  .eq('id', subscriptionId);
```

---

## 🔍 Debugging Commands

### Check Cron Jobs
```sql
-- List all cron jobs
SELECT * FROM cron.job;

-- Check execution history
SELECT * FROM cron.job_run_details 
ORDER BY start_time DESC 
LIMIT 10;

-- Delete a cron job
SELECT cron.unschedule('send-daily-reminders');
```

### Check Reminder Logs
```sql
-- Recent reminder logs
SELECT * FROM reminder_logs 
ORDER BY sent_at DESC 
LIMIT 20;

-- Failed emails
SELECT * FROM reminder_logs 
WHERE status = 'failed' 
ORDER BY sent_at DESC;
```

### Check User Data
```sql
-- List all users
SELECT * FROM users;

-- User with subscriptions
SELECT u.email, COUNT(s.id) as sub_count
FROM users u
LEFT JOIN subscriptions s ON u.id = s.user_id
GROUP BY u.id, u.email;
```

---

## 🧪 Testing Endpoints

### Test Edge Function
```bash
# Local
curl -i --location --request POST 'http://localhost:54321/functions/v1/send-reminder-emails' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"daily"}'

# Production
curl -i --location --request POST 'https://YOUR_PROJECT.supabase.co/functions/v1/send-reminder-emails' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"daily"}'
```

---

## 🚨 Common Error Solutions

| Error | Solution |
|-------|----------|
| "User not found" | Check trigger `on_auth_user_created` |
| "Permission denied" | Review RLS policies |
| "Invalid JWT" | Refresh auth token |
| "Emails not sending" | Check SMTP settings & Edge Function logs |
| "Cron not running" | Verify pg_cron extension enabled |

---

## 📱 API Endpoints

### Authentication
```
POST /auth/v1/signup
POST /auth/v1/token
POST /auth/v1/logout
GET  /auth/v1/user
```

### Database (PostgREST)
```
GET    /rest/v1/subscriptions
POST   /rest/v1/subscriptions
PATCH  /rest/v1/subscriptions?id=eq.{id}
DELETE /rest/v1/subscriptions?id=eq.{id}
```

### Edge Functions
```
POST /functions/v1/send-reminder-emails
```

---

## 🎨 Environment Setup

### Development
```bash
# .env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your_local_anon_key
```

### Production
```bash
# .env.production
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_prod_anon_key
```

---

## 📦 Package Dependencies

```json
{
  "@supabase/supabase-js": "^2.39.0",
  "@tanstack/react-query": "^5.0.0",
  "react": "^18.2.0",
  "typescript": "^5.0.0"
}
```

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| Supabase Dashboard | https://app.supabase.com |
| Google Cloud Console | https://console.cloud.google.com |
| Resend Dashboard | https://resend.com/dashboard |
| Supabase Docs | https://supabase.com/docs |

---

## ⏰ Cron Schedule Format

```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, 0 and 7 = Sunday)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)

Examples:
0 9 * * *   - Daily at 9 AM
0 9 * * 1   - Every Monday at 9 AM
*/30 * * * * - Every 30 minutes
```

---

## 🎯 Quick Troubleshooting

```bash
# Check if Supabase is reachable
curl https://YOUR_PROJECT.supabase.co/rest/v1/

# Check auth status
curl https://YOUR_PROJECT.supabase.co/auth/v1/health

# View Edge Function status
supabase functions list

# Check database connection
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
```

---

## 📊 Performance Tips

- ✅ Use indexes on frequently queried columns
- ✅ Enable React Query caching
- ✅ Implement optimistic updates
- ✅ Batch database operations
- ✅ Use select() to limit returned fields
- ✅ Implement pagination for large lists

---

## 🔒 Security Checklist

- [ ] RLS enabled on all tables
- [ ] Service role key not in client code
- [ ] Environment variables in .gitignore
- [ ] HTTPS only in production
- [ ] CORS configured correctly
- [ ] Regular security audits

---

## 📞 Support

- **Supabase Discord**: https://discord.supabase.com
- **GitHub Issues**: Create an issue in your repo
- **Supabase Docs**: https://supabase.com/docs

---

**Print this page for quick reference while developing!**

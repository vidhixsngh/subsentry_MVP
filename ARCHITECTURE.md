# SubSentry Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    React Frontend                         │  │
│  │                                                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │  │
│  │  │Dashboard │  │Analytics │  │Reminders │  │Settings  │ │  │
│  │  │  Page    │  │   Page   │  │   Page   │  │   Page   │ │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘ │  │
│  │       │             │              │             │        │  │
│  │       └─────────────┴──────────────┴─────────────┘        │  │
│  │                          │                                 │  │
│  │                    ┌─────▼─────┐                          │  │
│  │                    │   Hooks   │                          │  │
│  │                    │           │                          │  │
│  │                    │ • useSubscriptions                   │  │
│  │                    │ • useReminderSettings                │  │
│  │                    │ • useAnalytics                       │  │
│  │                    │ • useAuth                            │  │
│  │                    └─────┬─────┘                          │  │
│  │                          │                                 │  │
│  │                    ┌─────▼─────┐                          │  │
│  │                    │  Supabase │                          │  │
│  │                    │   Client  │                          │  │
│  │                    └─────┬─────┘                          │  │
│  └──────────────────────────┼──────────────────────────────┘  │
└─────────────────────────────┼─────────────────────────────────┘
                              │
                              │ HTTPS
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                      SUPABASE CLOUD                            │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                   Authentication                          │ │
│  │                                                            │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │ │
│  │  │  Google  │  │   JWT    │  │ Session  │               │ │
│  │  │  OAuth   │  │  Tokens  │  │ Manager  │               │ │
│  │  └──────────┘  └──────────┘  └──────────┘               │ │
│  └──────────────────────────────────────────────────────────┘ │
│                              │                                  │
│  ┌──────────────────────────▼──────────────────────────────┐  │
│  │                   PostgreSQL Database                     │  │
│  │                                                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │    users     │  │subscriptions │  │reminder_logs │   │  │
│  │  │              │  │              │  │              │   │  │
│  │  │ • id         │  │ • id         │  │ • id         │   │  │
│  │  │ • email      │  │ • user_id    │  │ • user_id    │   │  │
│  │  │ • username   │  │ • name       │  │ • sent_at    │   │  │
│  │  └──────┬───────┘  │ • amount     │  │ • status     │   │  │
│  │         │          │ • category   │  └──────────────┘   │  │
│  │         │          │ • renewal    │                      │  │
│  │         │          └──────────────┘                      │  │
│  │         │                                                 │  │
│  │         │          ┌──────────────────┐                  │  │
│  │         └──────────│reminder_settings │                  │  │
│  │                    │                  │                  │  │
│  │                    │ • user_id        │                  │  │
│  │                    │ • frequency      │                  │  │
│  │                    │ • days_before    │                  │  │
│  │                    │ • notifications  │                  │  │
│  │                    └──────────────────┘                  │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │         Row Level Security (RLS)                  │    │  │
│  │  │  • Users can only see their own data              │    │  │
│  │  │  • Automatic user_id filtering                    │    │  │
│  │  └──────────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                   Edge Functions                          │ │
│  │                                                            │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │      send-reminder-emails                          │  │ │
│  │  │                                                     │  │ │
│  │  │  1. Query users with notifications enabled        │  │ │
│  │  │  2. Find subscriptions renewing soon              │  │ │
│  │  │  3. Generate email HTML                           │  │ │
│  │  │  4. Send via SMTP                                 │  │ │
│  │  │  5. Log to reminder_logs                          │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                              ▲                                  │
│                              │                                  │
│  ┌──────────────────────────┴──────────────────────────────┐  │
│  │                   pg_cron (Scheduler)                     │  │
│  │                                                            │  │
│  │  ┌──────────────┐              ┌──────────────┐          │  │
│  │  │    Daily     │              │   Weekly     │          │  │
│  │  │  9:00 AM UTC │              │ Mon 9:00 AM  │          │  │
│  │  │              │              │              │          │  │
│  │  │ Triggers     │              │ Triggers     │          │  │
│  │  │ Edge Function│              │ Edge Function│          │  │
│  │  └──────────────┘              └──────────────┘          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                   SMTP Service                            │ │
│  │                                                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │ │
│  │  │   Resend     │  │  SendGrid    │  │   AWS SES    │   │ │
│  │  │ (Recommended)│  │  (Optional)  │  │  (Optional)  │   │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Email
                              ▼
                    ┌──────────────────┐
                    │   User's Email   │
                    │     Inbox        │
                    └──────────────────┘
```

---

## Data Flow Diagrams

### 1. User Authentication Flow

```
User clicks "Continue with Google"
         │
         ▼
React App calls supabase.auth.signInWithOAuth()
         │
         ▼
Redirects to Google OAuth
         │
         ▼
User approves access
         │
         ▼
Google redirects to Supabase callback
         │
         ▼
Supabase creates session & JWT token
         │
         ▼
Trigger: on_auth_user_created fires
         │
         ▼
Creates user in public.users table
         │
         ▼
Redirects to app with session
         │
         ▼
AuthContext updates user state
         │
         ▼
User sees Dashboard
```

### 2. Subscription CRUD Flow

```
User adds subscription
         │
         ▼
Component calls createSubscription()
         │
         ▼
useSubscriptions hook
         │
         ▼
supabase.from('subscriptions').insert()
         │
         ▼
RLS checks: auth.uid() === user_id
         │
         ▼
Insert into database
         │
         ▼
React Query invalidates cache
         │
         ▼
UI updates automatically
```

### 3. Email Reminder Flow

```
Cron job triggers (9 AM daily)
         │
         ▼
Calls Edge Function via HTTP POST
         │
         ▼
Edge Function queries reminder_settings
         │
         ▼
For each user with notifications enabled:
    │
    ├─► Query subscriptions renewing soon
    │
    ├─► Check if already sent today
    │
    ├─► Generate email HTML
    │
    ├─► Send via SMTP (Resend)
    │
    └─► Log to reminder_logs table
         │
         ▼
User receives email
         │
         ▼
User clicks "View Dashboard"
         │
         ▼
Opens app (authenticated via session)
```

---

## Component Hierarchy

```
App
├── AuthProvider
│   └── Router
│       ├── LoginPage (public)
│       │   └── Google OAuth Button
│       │
│       └── Protected Routes (require auth)
│           ├── Dashboard
│           │   ├── useSubscriptions()
│           │   ├── SubscriptionList
│           │   └── QuickStats
│           │
│           ├── AddSubscription
│           │   ├── useSubscriptions()
│           │   └── SubscriptionForm
│           │
│           ├── SubscriptionDetail
│           │   ├── useSubscription(id)
│           │   ├── EditForm
│           │   └── DeleteButton
│           │
│           ├── Analytics
│           │   ├── useAnalytics()
│           │   ├── SpendingChart
│           │   ├── CategoryBreakdown
│           │   └── TopSubscriptions
│           │
│           ├── Reminders
│           │   ├── useReminderSettings()
│           │   ├── FrequencySelector
│           │   ├── DaysBeforeSelector
│           │   └── NotificationToggle
│           │
│           └── Settings
│               ├── useAuth()
│               ├── ProfileSettings
│               └── SignOutButton
```

---

## Database Schema Relationships

```
┌─────────────────┐
│     users       │
│─────────────────│
│ id (PK)         │◄─────────┐
│ email           │          │
│ username        │          │
│ created_at      │          │
└─────────────────┘          │
                             │
                             │ user_id (FK)
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        │                    │                    │
┌───────▼──────────┐  ┌──────▼──────────┐  ┌─────▼────────────┐
│ subscriptions    │  │reminder_settings│  │  reminder_logs   │
│──────────────────│  │─────────────────│  │──────────────────│
│ id (PK)          │  │ id (PK)         │  │ id (PK)          │
│ user_id (FK)     │  │ user_id (FK)    │  │ user_id (FK)     │
│ name             │  │ email           │  │ subscription_id  │
│ amount           │  │ frequency       │  │ email_sent_to    │
│ category         │  │ days_before     │  │ sent_at          │
│ renewal_date     │  │ notifications   │  │ status           │
│ billing_cycle    │  │ created_at      │  │ error_message    │
│ status           │  │ updated_at      │  └──────────────────┘
│ payment_method   │  └─────────────────┘
│ notes            │
│ last_used_date   │
│ created_at       │
│ updated_at       │
└──────────────────┘
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. HTTPS/TLS                                           │
│     └─► All communication encrypted                     │
│                                                          │
│  2. JWT Authentication                                  │
│     └─► Tokens signed by Supabase                      │
│                                                          │
│  3. Row Level Security (RLS)                           │
│     └─► Database-level access control                  │
│     └─► Users can only access their own data           │
│                                                          │
│  4. Environment Variables                               │
│     └─► Secrets not in code                            │
│     └─► Service role key server-side only              │
│                                                          │
│  5. CORS Configuration                                  │
│     └─► Only allowed origins can access API            │
│                                                          │
│  6. Rate Limiting                                       │
│     └─► Supabase built-in rate limits                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## API Endpoints

### Frontend → Supabase (Direct)

```
Authentication:
POST   /auth/v1/signup
POST   /auth/v1/token?grant_type=password
POST   /auth/v1/logout
GET    /auth/v1/user

Database (via PostgREST):
GET    /rest/v1/subscriptions
POST   /rest/v1/subscriptions
PATCH  /rest/v1/subscriptions?id=eq.{id}
DELETE /rest/v1/subscriptions?id=eq.{id}

GET    /rest/v1/user_reminder_settings
POST   /rest/v1/user_reminder_settings
PATCH  /rest/v1/user_reminder_settings?user_id=eq.{id}

GET    /rest/v1/reminder_logs

Edge Functions:
POST   /functions/v1/send-reminder-emails
```

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Stack                        │
├─────────────────────────────────────────────────────────┤
│ • React 18                                              │
│ • TypeScript                                            │
│ • Vite                                                  │
│ • React Query (TanStack Query)                         │
│ • Wouter (Routing)                                      │
│ • Tailwind CSS                                          │
│ • shadcn/ui Components                                  │
│ • Lucide Icons                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Backend Stack                         │
├─────────────────────────────────────────────────────────┤
│ • Supabase (BaaS)                                       │
│ • PostgreSQL 15                                         │
│ • PostgREST (Auto API)                                  │
│ • GoTrue (Auth)                                         │
│ • Deno (Edge Functions)                                 │
│ • pg_cron (Scheduler)                                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   External Services                      │
├─────────────────────────────────────────────────────────┤
│ • Google OAuth (Authentication)                         │
│ • Resend (Email delivery)                               │
│ • Vercel/Netlify (Hosting - optional)                  │
└─────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Production Setup                      │
└─────────────────────────────────────────────────────────┘

Frontend (Vercel/Netlify)
    │
    │ HTTPS
    ▼
CDN (Automatic)
    │
    │
    ▼
Supabase Cloud (Managed)
    ├─► Database (PostgreSQL)
    ├─► Auth (GoTrue)
    ├─► Storage (S3-compatible)
    ├─► Edge Functions (Deno Deploy)
    └─► Realtime (WebSockets)

External Services
    ├─► Google OAuth
    ├─► Resend SMTP
    └─► Monitoring (Sentry, etc.)
```

---

## Performance Considerations

```
┌─────────────────────────────────────────────────────────┐
│                  Performance Optimizations               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Database:                                              │
│  • Indexes on user_id, renewal_date                    │
│  • Connection pooling (built-in)                        │
│  • Query optimization via RLS                           │
│                                                          │
│  Frontend:                                              │
│  • React Query caching                                  │
│  • Lazy loading routes                                  │
│  • Optimistic updates                                   │
│  • Debounced search/filters                            │
│                                                          │
│  Edge Functions:                                        │
│  • Deployed globally                                    │
│  • Cold start < 2s                                      │
│  • Batch email processing                               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

This architecture provides:
- ✅ Scalability (Supabase handles scaling)
- ✅ Security (RLS + JWT + HTTPS)
- ✅ Performance (Indexes + Caching + CDN)
- ✅ Reliability (Managed infrastructure)
- ✅ Developer Experience (Type-safe, modern stack)

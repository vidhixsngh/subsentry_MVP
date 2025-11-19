# Install Supabase CLI - macOS

## Option 1: Homebrew (Recommended - 1 minute)

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Supabase CLI
brew install supabase/tap/supabase

# Verify installation
supabase --version
```

---

## Option 2: Direct Binary Download (30 seconds)

```bash
# Download and install
curl -fsSL https://github.com/supabase/cli/releases/latest/download/supabase_darwin_arm64.tar.gz | tar -xz

# Move to PATH
sudo mv supabase /usr/local/bin/

# Verify
supabase --version
```

---

## Option 3: Using npx (No Installation Needed)

You can use `npx` instead of installing globally:

```bash
# Instead of: supabase login
npx supabase login

# Instead of: supabase link
npx supabase link --project-ref YOUR_REF

# Instead of: supabase functions deploy
npx supabase functions deploy send-reminder-emails-resend
```

---

## Quick Fix: Use Homebrew

Run these commands:

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Verify it works
supabase --version

# Login
supabase login

# Link your project
supabase link --project-ref talcquxnfwsukkxyvizo

# Deploy function
supabase functions deploy send-reminder-emails-resend
```

---

## After Installation

Continue with **DEPLOY_NOW.md** Step 2!

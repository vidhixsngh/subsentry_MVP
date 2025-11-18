# Check Your Database Structure

## Run this in Supabase SQL Editor

```sql
-- Check subscriptions table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'subscriptions'
ORDER BY ordinal_position;
```

## Expected Output

You should see columns like:
- `id` - uuid or varchar
- `user_id` - varchar or text
- `name` - text
- `amount` - numeric or decimal
- `category` - varchar
- `renewal_date` - date
- `billing_cycle` - varchar
- `status` - varchar
- `payment_method` - text (nullable)
- `notes` - text (nullable)
- `last_used_date` - date (nullable)
- `created_at` - timestamp
- `updated_at` - timestamp

## If the table doesn't exist or has wrong structure:

Run this to create/recreate it:

```sql
-- Drop existing table if needed (WARNING: This deletes all data!)
-- DROP TABLE IF EXISTS subscriptions CASCADE;

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  renewal_date DATE NOT NULL,
  billing_cycle VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending',
  payment_method TEXT,
  notes TEXT,
  last_used_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key if users table exists
ALTER TABLE subscriptions 
ADD CONSTRAINT subscriptions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Create index
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_renewal_date ON subscriptions(renewal_date);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Check RLS Policies

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'subscriptions';

-- Check existing policies
SELECT * FROM pg_policies 
WHERE tablename = 'subscriptions';
```

## Test Insert Manually

```sql
-- Try inserting a test record
INSERT INTO subscriptions (
  user_id,
  name,
  amount,
  category,
  renewal_date,
  billing_cycle,
  status
) VALUES (
  auth.uid()::text,
  'Test Subscription',
  99.99,
  'Streaming',
  '2025-12-01',
  'Monthly',
  'Pending'
);

-- Check if it worked
SELECT * FROM subscriptions WHERE user_id = auth.uid()::text;
```

If this manual insert works, then the issue is in the frontend code.
If it fails, check the error message - it will tell you exactly what's wrong.

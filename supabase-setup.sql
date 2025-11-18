-- ============================================
-- SUPABASE EMAIL REMINDERS SETUP
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- 1. Create user_reminder_settings table
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

-- 2. Create reminder_logs table (to track sent reminders)
CREATE TABLE IF NOT EXISTS reminder_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id VARCHAR REFERENCES subscriptions(id) ON DELETE CASCADE,
  email_sent_to VARCHAR NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
  error_message TEXT
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reminder_settings_user_id ON user_reminder_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_user_id ON reminder_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_sent_at ON reminder_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_renewal_date ON subscriptions(renewal_date);

-- 4. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create trigger for user_reminder_settings
DROP TRIGGER IF EXISTS update_user_reminder_settings_updated_at ON user_reminder_settings;
CREATE TRIGGER update_user_reminder_settings_updated_at
  BEFORE UPDATE ON user_reminder_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Enable Row Level Security (RLS)
ALTER TABLE user_reminder_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_logs ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS Policies for user_reminder_settings
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

-- 8. Create RLS Policies for reminder_logs
CREATE POLICY "Users can view their own reminder logs"
  ON reminder_logs FOR SELECT
  USING (auth.uid()::text = user_id);

-- Service role can insert logs (for Edge Function)
CREATE POLICY "Service role can insert reminder logs"
  ON reminder_logs FOR INSERT
  WITH CHECK (true);

COMMENT ON TABLE user_reminder_settings IS 'Stores user preferences for email reminders';
COMMENT ON TABLE reminder_logs IS 'Tracks all sent email reminders for audit purposes';

-- Payment Tracking Setup for Subscriptions
-- This adds a payment history table to track all payment records

-- Create payment_history table
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  billing_cycle TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Paid',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_payment_history_subscription ON payment_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_user ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_date ON payment_history(payment_date);

-- Enable Row Level Security
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see only their payment history
CREATE POLICY "Users can view their own payment history"
  ON payment_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own payment history
CREATE POLICY "Users can insert their own payment history"
  ON payment_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own payment history
CREATE POLICY "Users can update their own payment history"
  ON payment_history
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy for users to delete their own payment history
CREATE POLICY "Users can delete their own payment history"
  ON payment_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create a function to automatically log payments when status changes to 'Paid'
CREATE OR REPLACE FUNCTION log_payment_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if status changed to 'Paid' and it wasn't 'Paid' before
  IF NEW.status = 'Paid' AND (OLD.status IS NULL OR OLD.status != 'Paid') THEN
    INSERT INTO payment_history (
      subscription_id,
      user_id,
      amount,
      billing_cycle,
      status,
      notes
    ) VALUES (
      NEW.id,
      NEW.user_id,
      NEW.amount,
      NEW.billing_cycle,
      'Paid',
      'Payment recorded via dashboard'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically log payments
DROP TRIGGER IF EXISTS trigger_log_payment ON subscriptions;
CREATE TRIGGER trigger_log_payment
  AFTER UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION log_payment_on_status_change();

-- Grant necessary permissions
GRANT ALL ON payment_history TO authenticated;
GRANT USAGE ON SEQUENCE payment_history_id_seq TO authenticated;

COMMENT ON TABLE payment_history IS 'Tracks all payment records for subscriptions';
COMMENT ON COLUMN payment_history.subscription_id IS 'Reference to the subscription';
COMMENT ON COLUMN payment_history.payment_date IS 'When the payment was made';
COMMENT ON COLUMN payment_history.billing_cycle IS 'Billing cycle at time of payment';

-- Add Stripe fields to users table
-- Run this migration after deploying the code update

ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50),
  ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMP;

-- Update status enum comment
-- Status flow: pending → subscribed → creating → ready → error
-- (Old invite flow: pending → invited → creating → ready → error still supported)

-- Index for Stripe lookups
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);

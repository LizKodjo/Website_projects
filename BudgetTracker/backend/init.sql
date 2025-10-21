-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category_user ON transactions(category, user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_period ON budgets(user_id, period);
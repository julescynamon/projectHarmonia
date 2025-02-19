-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE
);

-- Create index on token for faster lookups
CREATE INDEX IF NOT EXISTS password_reset_tokens_token_idx ON password_reset_tokens(token);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS password_reset_tokens_email_idx ON password_reset_tokens(email);

-- Add RLS policies
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Allow insert for authenticated and anonymous users (needed for password reset)
CREATE POLICY "Anyone can create a reset token" ON password_reset_tokens
FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Allow select only for the specific token
CREATE POLICY "Users can only view their own reset token" ON password_reset_tokens
FOR SELECT TO anon, authenticated
USING (token = current_setting('request.jwt.claims')::json->>'reset_token');

-- Allow delete for cleanup
CREATE POLICY "Allow delete of used tokens" ON password_reset_tokens
FOR DELETE TO anon, authenticated
USING (true);

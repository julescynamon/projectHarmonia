-- Create the user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON user_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_user_roles_updated_at();

-- Create a row level security policy
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policy for reading roles (admins can read all, users can only read their own)
CREATE POLICY "Users can read their own role"
    ON user_roles FOR SELECT
    USING (auth.uid() = user_id);

-- Policy for inserting roles (only through service role)
CREATE POLICY "Service role can insert roles"
    ON user_roles FOR INSERT
    WITH CHECK (false);  -- Prevent direct inserts through normal client

-- Policy for updating roles (only through service role)
CREATE POLICY "Service role can update roles"
    ON user_roles FOR UPDATE
    USING (false)  -- Prevent updates through normal client
    WITH CHECK (false);

-- Policy for deleting roles (only through service role)
CREATE POLICY "Service role can delete roles"
    ON user_roles FOR DELETE
    USING (false);  -- Prevent deletes through normal client

-- Create cart_items table
CREATE TABLE cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Add RLS policies
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own cart items
CREATE POLICY "Users can view own cart items" 
    ON cart_items FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own cart items
CREATE POLICY "Users can insert own cart items" 
    ON cart_items FOR INSERT 
    WITH CHECK (
        auth.role() = 'authenticated' AND
        auth.uid() = user_id
    );

-- Policy: Users can update their own cart items
CREATE POLICY "Users can update own cart items" 
    ON cart_items FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (
        auth.role() = 'authenticated' AND
        auth.uid() = user_id
    );

-- Policy: Users can delete their own cart items
CREATE POLICY "Users can delete own cart items" 
    ON cart_items FOR DELETE 
    USING (auth.uid() = user_id);

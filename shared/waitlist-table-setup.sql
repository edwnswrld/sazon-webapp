-- Waitlist Table Setup for Sazon AI
-- This script creates a table to collect waitlist signups from the landing page

-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist_signups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    source TEXT DEFAULT 'landing_page',
    preferences JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_email ON waitlist_signups(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_created_at ON waitlist_signups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_source ON waitlist_signups(source);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_waitlist_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_waitlist_signups_updated_at 
    BEFORE UPDATE ON waitlist_signups 
    FOR EACH ROW 
    EXECUTE FUNCTION update_waitlist_updated_at();

-- Enable Row Level Security
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow public insert (anyone can sign up for waitlist)
CREATE POLICY "Allow public waitlist signup" ON waitlist_signups
    FOR INSERT WITH CHECK (true);

-- Only allow authenticated users to view waitlist data (for admin purposes)
CREATE POLICY "Allow authenticated users to view waitlist" ON waitlist_signups
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only allow authenticated users to update waitlist data
CREATE POLICY "Allow authenticated users to update waitlist" ON waitlist_signups
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Only allow authenticated users to delete waitlist data
CREATE POLICY "Allow authenticated users to delete waitlist" ON waitlist_signups
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to get waitlist statistics
CREATE OR REPLACE FUNCTION get_waitlist_stats()
RETURNS TABLE (
    total_signups BIGINT,
    today_signups BIGINT,
    this_week_signups BIGINT,
    this_month_signups BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_signups,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as today_signups,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as this_week_signups,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as this_month_signups
    FROM waitlist_signups;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if email is already signed up
CREATE OR REPLACE FUNCTION is_email_signed_up(check_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS(SELECT 1 FROM waitlist_signups WHERE email = check_email);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON waitlist_signups TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_waitlist_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION is_email_signed_up(TEXT) TO anon, authenticated;

-- Insert sample data (optional - for testing)
-- INSERT INTO waitlist_signups (email, full_name, source, preferences) VALUES
--     ('test@example.com', 'Test User', 'landing_page', '{"dietary_preferences": ["vegetarian"], "cuisine_preferences": ["mexican", "italian"]}'),
--     ('demo@example.com', 'Demo User', 'landing_page', '{"dietary_preferences": ["vegan"], "cuisine_preferences": ["asian", "mediterranean"]}'); 
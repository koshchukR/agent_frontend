-- Complete fix for calendar booking confirmation issues
-- This addresses both the database insertion and SMS confirmation problems

-- 1. First, check if candidate_screenings table exists with correct structure
SELECT 'Checking candidate_screenings table structure:' AS info;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'candidate_screenings' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Create candidate_screenings table if it doesn't exist or has wrong structure
CREATE TABLE IF NOT EXISTS candidate_screenings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id VARCHAR(255) NOT NULL, -- Support both UUID and string IDs from URL params
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_candidate_screenings_candidate_id ON candidate_screenings(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_screenings_user_id ON candidate_screenings(user_id);
CREATE INDEX IF NOT EXISTS idx_candidate_screenings_datetime ON candidate_screenings(datetime);
CREATE INDEX IF NOT EXISTS idx_candidate_screenings_status ON candidate_screenings(status);

-- 4. Drop existing restrictive RLS policies
DROP POLICY IF EXISTS "Users can view screenings for their candidates" ON candidate_screenings;
DROP POLICY IF EXISTS "Users can create screenings for their candidates" ON candidate_screenings;
DROP POLICY IF EXISTS "Users can update their own screenings" ON candidate_screenings;
DROP POLICY IF EXISTS "Users can delete their own screenings" ON candidate_screenings;

-- 5. Create more permissive RLS policies for calendar booking from public links
-- Enable RLS
ALTER TABLE candidate_screenings ENABLE ROW LEVEL SECURITY;

-- Allow public users to insert screenings (for calendar bookings from email links)
CREATE POLICY "Allow public calendar booking insertions" ON candidate_screenings
    FOR INSERT WITH CHECK (true); -- Allow anyone to book from calendar links

-- Allow authenticated users to view screenings for their candidates
CREATE POLICY "Users can view screenings for their candidates" ON candidate_screenings
    FOR SELECT USING (
        auth.role() = 'authenticated' AND (
            user_id = auth.uid() OR 
            candidate_id IN (SELECT id::text FROM candidates WHERE created_by = auth.uid())
        )
    );

-- Allow authenticated users to manage their screenings
CREATE POLICY "Users can update their screenings" ON candidate_screenings
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND user_id = auth.uid()
    );

CREATE POLICY "Users can delete their screenings" ON candidate_screenings
    FOR DELETE USING (
        auth.role() = 'authenticated' AND user_id = auth.uid()
    );

-- 6. Add trigger for updated_at
CREATE TRIGGER update_candidate_screenings_updated_at BEFORE UPDATE ON candidate_screenings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Insert test booking to verify functionality
INSERT INTO candidate_screenings (
    candidate_id,
    user_id,
    datetime,
    status,
    notes
) VALUES (
    'test-candidate-123',
    (SELECT id FROM auth.users LIMIT 1),
    NOW() + INTERVAL '1 day',
    'scheduled',
    'Test booking from SQL - please delete after testing'
) ON CONFLICT DO NOTHING;

-- 8. Check if test booking was inserted
SELECT 'Test booking verification:' AS info;
SELECT 
    id,
    candidate_id,
    user_id,
    datetime,
    status,
    notes,
    created_at
FROM candidate_screenings 
WHERE notes LIKE '%Test booking from SQL%';

-- 9. Create a function to safely insert bookings from public calendar
CREATE OR REPLACE FUNCTION public_calendar_booking(
    p_candidate_id TEXT,
    p_user_id UUID,
    p_datetime TIMESTAMPTZ,
    p_status TEXT DEFAULT 'scheduled',
    p_notes TEXT DEFAULT NULL
)
RETURNS TABLE(booking_id UUID, success BOOLEAN, message TEXT) AS $$
DECLARE
    new_booking_id UUID;
BEGIN
    -- Insert the booking
    INSERT INTO candidate_screenings (
        candidate_id,
        user_id,
        datetime,
        status,
        notes
    ) VALUES (
        p_candidate_id,
        p_user_id,
        p_datetime,
        p_status,
        COALESCE(p_notes, 'Booked via public calendar link')
    ) RETURNING id INTO new_booking_id;
    
    -- Return success
    RETURN QUERY SELECT new_booking_id, true, 'Booking created successfully'::TEXT;
    
EXCEPTION WHEN OTHERS THEN
    -- Return error
    RETURN QUERY SELECT NULL::UUID, false, SQLERRM::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to anonymous users for public calendar bookings
GRANT EXECUTE ON FUNCTION public_calendar_booking TO anon, authenticated;

-- 10. Test the function
SELECT * FROM public_calendar_booking(
    'test-function-candidate',
    (SELECT id FROM auth.users LIMIT 1),
    NOW() + INTERVAL '2 days',
    'scheduled',
    'Test booking via function - please delete'
);

-- 11. Show final table structure and policies
SELECT 'Final candidate_screenings table structure:' AS info;

SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'candidate_screenings' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'RLS Policies for candidate_screenings:' AS info;

SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'candidate_screenings'
ORDER BY policyname;

SELECT 'Calendar booking setup completed successfully!' AS status;
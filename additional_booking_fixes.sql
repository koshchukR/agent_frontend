-- Additional fixes for calendar booking issues
-- Run this AFTER fix_calendar_booking_complete.sql

-- 1. Create a more robust booking function that handles edge cases
CREATE OR REPLACE FUNCTION handle_calendar_booking(
    p_candidate_id TEXT,
    p_user_id UUID,
    p_datetime TIMESTAMPTZ,
    p_status TEXT DEFAULT 'scheduled'
)
RETURNS JSON AS $$
DECLARE
    booking_result JSON;
    existing_booking_id UUID;
    new_booking_id UUID;
BEGIN
    -- Check if a booking already exists for this exact time
    SELECT id INTO existing_booking_id
    FROM candidate_screenings 
    WHERE candidate_id = p_candidate_id 
        AND user_id = p_user_id 
        AND datetime = p_datetime;
    
    IF existing_booking_id IS NOT NULL THEN
        -- Return existing booking info
        booking_result := json_build_object(
            'success', true,
            'booking_id', existing_booking_id,
            'message', 'Booking already exists',
            'is_duplicate', true
        );
        RETURN booking_result;
    END IF;
    
    -- Create new booking
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
        'Booked via public calendar link'
    ) RETURNING id INTO new_booking_id;
    
    -- Return success with booking ID
    booking_result := json_build_object(
        'success', true,
        'booking_id', new_booking_id,
        'message', 'Booking created successfully',
        'is_duplicate', false
    );
    
    RETURN booking_result;
    
EXCEPTION WHEN OTHERS THEN
    -- Return error information
    booking_result := json_build_object(
        'success', false,
        'error', SQLERRM,
        'error_code', SQLSTATE,
        'message', 'Failed to create booking'
    );
    RETURN booking_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION handle_calendar_booking TO anon, authenticated;

-- 2. Add a function to get candidate info safely for public access
CREATE OR REPLACE FUNCTION get_candidate_for_booking(p_candidate_id TEXT)
RETURNS JSON AS $$
DECLARE
    candidate_info JSON;
BEGIN
    SELECT json_build_object(
        'id', id,
        'name', name,
        'phone', phone,
        'position', position,
        'found', true
    ) INTO candidate_info
    FROM candidates 
    WHERE id = p_candidate_id
    LIMIT 1;
    
    IF candidate_info IS NULL THEN
        candidate_info := json_build_object(
            'found', false,
            'message', 'Candidate not found'
        );
    END IF;
    
    RETURN candidate_info;
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'found', false,
        'error', SQLERRM,
        'message', 'Error fetching candidate'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to anonymous and authenticated users  
GRANT EXECUTE ON FUNCTION get_candidate_for_booking TO anon, authenticated;

-- 3. Test the new functions
SELECT 'Testing calendar booking function:' AS test;

-- Test with a sample booking
SELECT handle_calendar_booking(
    'test-candidate-123',
    (SELECT id FROM auth.users LIMIT 1),
    NOW() + INTERVAL '3 days',
    'scheduled'
) AS booking_test;

-- Test candidate lookup
SELECT get_candidate_for_booking('test-candidate-123') AS candidate_test;

-- 4. Add trigger to log booking attempts for debugging
CREATE TABLE IF NOT EXISTS booking_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id TEXT,
    user_id UUID,
    datetime_requested TIMESTAMPTZ,
    success BOOLEAN,
    error_message TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create logging function
CREATE OR REPLACE FUNCTION log_booking_attempt()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO booking_logs (
        candidate_id,
        user_id, 
        datetime_requested,
        success,
        created_at
    ) VALUES (
        NEW.candidate_id,
        NEW.user_id,
        NEW.datetime,
        true,
        NOW()
    );
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Don't fail the insert if logging fails
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to log successful bookings
DROP TRIGGER IF EXISTS log_booking_trigger ON candidate_screenings;
CREATE TRIGGER log_booking_trigger
    AFTER INSERT ON candidate_screenings
    FOR EACH ROW
    EXECUTE FUNCTION log_booking_attempt();

-- 5. Show current booking configuration
SELECT 'Current booking configuration:' AS info;

SELECT 
    schemaname,
    tablename,
    attname as column_name,
    attnotnull as not_null,
    typname as data_type
FROM pg_attribute 
JOIN pg_class ON pg_attribute.attrelid = pg_class.oid 
JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
JOIN pg_type ON pg_attribute.atttypid = pg_type.oid
WHERE schemaname = 'public' 
    AND tablename = 'candidate_screenings' 
    AND attnum > 0 
    AND NOT attisdropped
ORDER BY attnum;

SELECT 'Available functions:' AS info;

SELECT 
    proname as function_name,
    proargnames as arguments,
    prosrc as definition_preview
FROM pg_proc 
WHERE proname IN ('handle_calendar_booking', 'get_candidate_for_booking', 'public_calendar_booking')
ORDER BY proname;

SELECT 'Setup completed successfully!' AS status;
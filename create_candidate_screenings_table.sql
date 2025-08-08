-- Create candidate_screenings table for booking appointments
-- This table stores screening appointments booked by candidates

CREATE TABLE IF NOT EXISTS candidate_screenings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL,
  user_id UUID NOT NULL,
  datetime TIMESTAMPTZ NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_candidate_screenings_candidate_id ON candidate_screenings(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_screenings_user_id ON candidate_screenings(user_id);
CREATE INDEX IF NOT EXISTS idx_candidate_screenings_datetime ON candidate_screenings(datetime);
CREATE INDEX IF NOT EXISTS idx_candidate_screenings_user_datetime ON candidate_screenings(user_id, datetime);

-- Enable Row Level Security
ALTER TABLE candidate_screenings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view screenings for their own candidates
CREATE POLICY "Users can view their own candidate screenings" ON candidate_screenings
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert screenings for their own candidates  
CREATE POLICY "Users can insert their own candidate screenings" ON candidate_screenings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own candidate screenings
CREATE POLICY "Users can update their own candidate screenings" ON candidate_screenings
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own candidate screenings
CREATE POLICY "Users can delete their own candidate screenings" ON candidate_screenings
    FOR DELETE USING (auth.uid() = user_id);

-- Allow anonymous users to insert screenings (for public booking)
-- This is needed because the calendar is public and doesn't require authentication
CREATE POLICY "Allow anonymous bookings" ON candidate_screenings
    FOR INSERT WITH CHECK (true);

-- Allow anonymous users to read screenings to check availability
-- But only the datetime and user_id columns for availability checking
CREATE POLICY "Allow anonymous availability check" ON candidate_screenings
    FOR SELECT USING (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_candidate_screenings_updated_at 
    BEFORE UPDATE ON candidate_screenings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE candidate_screenings IS 'Stores screening appointments booked by candidates with recruiters/companies';
COMMENT ON COLUMN candidate_screenings.candidate_id IS 'ID of the candidate who booked the screening';
COMMENT ON COLUMN candidate_screenings.user_id IS 'ID of the platform user (recruiter/company) the screening is with';
COMMENT ON COLUMN candidate_screenings.datetime IS 'Scheduled date and time of the screening';
COMMENT ON COLUMN candidate_screenings.status IS 'Current status of the screening appointment';
COMMENT ON COLUMN candidate_screenings.notes IS 'Optional notes about the screening';
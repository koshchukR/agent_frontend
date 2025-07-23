-- Additional tables for recruiters and candidate-recruiter assignments

-- Create recruiters table
CREATE TABLE IF NOT EXISTS recruiters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create candidate_recruiter_assignments table
CREATE TABLE IF NOT EXISTS candidate_recruiter_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id VARCHAR(255) NOT NULL, -- This can be either test user ID or HubSpot contact ID
    recruiter_id UUID REFERENCES recruiters(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    notes TEXT,
    UNIQUE(candidate_id, recruiter_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_recruiter_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for recruiters
CREATE POLICY "Users can view all recruiters" ON recruiters
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert recruiters" ON recruiters
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own recruiters" ON recruiters
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own recruiters" ON recruiters
    FOR DELETE USING (auth.uid() = created_by);

-- Create policies for candidate_recruiter_assignments
CREATE POLICY "Users can view all recruiter assignments" ON candidate_recruiter_assignments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create recruiter assignments" ON candidate_recruiter_assignments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update recruiter assignments they created" ON candidate_recruiter_assignments
    FOR UPDATE USING (auth.uid() = assigned_by);

CREATE POLICY "Users can delete recruiter assignments they created" ON candidate_recruiter_assignments
    FOR DELETE USING (auth.uid() = assigned_by);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recruiters_enabled ON recruiters(enabled);
CREATE INDEX IF NOT EXISTS idx_recruiters_created_at ON recruiters(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_candidate_recruiter_assignments_candidate_id ON candidate_recruiter_assignments(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_recruiter_assignments_recruiter_id ON candidate_recruiter_assignments(recruiter_id);

-- Create trigger to automatically update updated_at for recruiters
CREATE TRIGGER update_recruiters_updated_at BEFORE UPDATE ON recruiters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample recruiter data
INSERT INTO recruiters (id, name, industry, enabled) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Alex', 'Software Engineering', false),
('550e8400-e29b-41d4-a716-446655440002', 'Sarah', 'Healthcare', false),
('550e8400-e29b-41d4-a716-446655440003', 'Michael', 'Sales & Marketing', false),
('550e8400-e29b-41d4-a716-446655440004', 'AI Recruiter Screen IQ', 'General Recruiting', true);

-- Modify candidate_job_assignments to ensure only one job per candidate
-- First, let's add a unique constraint to ensure only one active job assignment per candidate
-- (We'll handle this in the application logic since we want to allow reassignment)

-- Note: The UNIQUE constraint on (candidate_id, job_id) allows multiple jobs per candidate
-- We'll enforce the "one job per candidate" rule in the application logic
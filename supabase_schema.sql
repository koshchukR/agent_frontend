-- Create job_postings table
CREATE TABLE IF NOT EXISTS job_postings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('full-time', 'part-time', 'contract', 'internship')) NOT NULL,
    salary_min INTEGER,
    salary_max INTEGER,
    description TEXT NOT NULL,
    requirements TEXT[] NOT NULL DEFAULT '{}',
    benefits TEXT[] NOT NULL DEFAULT '{}',
    department VARCHAR(100) NOT NULL,
    experience_level VARCHAR(20) CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')) NOT NULL,
    remote_type VARCHAR(20) CHECK (remote_type IN ('remote', 'hybrid', 'on-site')) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'paused', 'closed')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create candidate_job_assignments table to track which candidates are assigned to which jobs
CREATE TABLE IF NOT EXISTS candidate_job_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id VARCHAR(255) NOT NULL, -- This can be either test user ID or HubSpot contact ID
    job_id UUID REFERENCES job_postings(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    notes TEXT,
    UNIQUE(candidate_id, job_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_job_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for job_postings
CREATE POLICY "Users can view all job postings" ON job_postings
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert job postings" ON job_postings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own job postings" ON job_postings
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own job postings" ON job_postings
    FOR DELETE USING (auth.uid() = created_by);

-- Create policies for candidate_job_assignments
CREATE POLICY "Users can view all assignments" ON candidate_job_assignments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create assignments" ON candidate_job_assignments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update assignments they created" ON candidate_job_assignments
    FOR UPDATE USING (auth.uid() = assigned_by);

CREATE POLICY "Users can delete assignments they created" ON candidate_job_assignments
    FOR DELETE USING (auth.uid() = assigned_by);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON job_postings(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_department ON job_postings(department);
CREATE INDEX IF NOT EXISTS idx_job_postings_created_at ON job_postings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_candidate_assignments_candidate_id ON candidate_job_assignments(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_assignments_job_id ON candidate_job_assignments(job_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON job_postings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO job_postings (title, company, location, type, salary_min, salary_max, description, requirements, benefits, department, experience_level, remote_type, status) VALUES
('Senior Software Engineer', 'TechCorp Inc.', 'San Francisco, CA', 'full-time', 120000, 180000, 
'We are looking for a Senior Software Engineer to join our dynamic team. You will be responsible for designing, developing, and maintaining high-performance applications.', 
ARRAY['Bachelor''s degree in Computer Science', '5+ years of experience', 'Proficiency in React, Node.js, TypeScript'], 
ARRAY['Competitive salary', 'Health insurance', 'Flexible work arrangements'], 
'Engineering', 'senior', 'hybrid', 'active'),

('Product Manager', 'InnovateLabs', 'New York, NY', 'full-time', 100000, 150000,
'Join our product team as a Product Manager and drive the development of next-generation products.',
ARRAY['MBA or equivalent experience', '3+ years of product management experience', 'Agile/Scrum experience'],
ARRAY['Stock options', 'Health insurance', 'Remote flexibility'],
'Product', 'mid', 'hybrid', 'active'),

('UX/UI Designer', 'DesignStudio Pro', 'Austin, TX', 'full-time', 80000, 120000,
'We are seeking a talented UX/UI Designer to create exceptional user experiences for our digital products.',
ARRAY['Bachelor''s degree in Design', '4+ years of UX/UI experience', 'Proficiency in Figma, Sketch'],
ARRAY['Creative freedom', 'Top-tier tools', 'Conference attendance'],
'Design', 'mid', 'remote', 'active');
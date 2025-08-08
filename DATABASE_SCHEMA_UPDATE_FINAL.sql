-- Add new fields to candidates table for automated calling (excluding updated_at which already exists)
ALTER TABLE candidates 
ADD COLUMN submitted_to UUID REFERENCES job_postings(id),
ADD COLUMN call_agent UUID REFERENCES recruiters(id);

-- Create index for efficient querying
CREATE INDEX idx_candidates_submitted_to ON candidates(submitted_to);
CREATE INDEX idx_candidates_call_agent ON candidates(call_agent);

-- Comments for documentation
COMMENT ON COLUMN candidates.submitted_to IS 'ID of the job posting the candidate is assigned to';
COMMENT ON COLUMN candidates.call_agent IS 'ID of the recruiter/agent who will call the candidate';
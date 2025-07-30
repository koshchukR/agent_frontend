# Candidates Management Setup

## Database Schema

The candidates table has been created in Supabase with the following structure:

### Table: `candidates`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Candidate full name |
| position | TEXT | Job position/title |
| status | TEXT | One of: 'New', 'Screening', 'Interview', 'Scheduled', 'Hired', 'Rejected' |
| score | INTEGER | Score from 0-100 |
| source | TEXT | Source of candidate (LinkedIn, Indeed, etc.) |
| date | DATE | Date candidate was added |
| bot_risk | TEXT | One of: 'Low', 'Medium', 'High' |
| phone | TEXT | Phone number |
| email | TEXT | Email address |
| resume_url | TEXT | URL to uploaded resume PDF |
| created_by | UUID | References auth.users(id) |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## Security

- **Row Level Security (RLS)** is enabled
- Users can only view, create, update, and delete their own candidates
- Resume storage uses user-specific folders in Supabase Storage

## Resume Storage

- Bucket: `resumes`
- Path structure: `{user_id}/{candidate_id}/resume.{ext}`
- Supports PDF file uploads

## Setup Instructions

1. Run the SQL schema in your Supabase SQL editor:
   ```sql
   -- Execute the contents of supabase_candidates_schema.sql
   ```

2. Enable Storage in Supabase dashboard
3. Create the `resumes` bucket (done automatically by schema)
4. Verify RLS policies are active

## Features

- ✅ User-specific candidate data
- ✅ Resume PDF upload and storage
- ✅ Comprehensive candidate management
- ✅ Integration with job assignments and recruiter assignments
- ✅ Real-time data synchronization
- ✅ Secure file storage with user isolation

## Migration from HubSpot

- HubSpot integration has been completely removed
- All candidate data now comes from Supabase
- Existing test data has been preserved as sample data
- Users can now add their own candidates manually

## Sample Data

The system includes sample candidates that appear when:
- Database is empty
- User is not authenticated
- Database connection fails

Sample candidates include:
- Roman Koshchuk (Senior Developer)
- Sarah Johnson (Frontend Developer) 
- Michael Chen (Full Stack Engineer)
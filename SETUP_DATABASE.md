# Database Setup Instructions

Please follow these steps to set up the required database tables in Supabase:

## Step 1: Access Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Log in to your account
3. Select your project: `muquxpdpewlzqwhxdtur`

## Step 2: Execute SQL Schema
1. In the Supabase dashboard, navigate to the **SQL Editor**
2. Create a new query
3. Copy and paste the entire contents of `supabase_schema.sql` 
4. Click **Run** to execute the schema

## Step 3: Verify Tables
After running the SQL, you should see these tables in your database:
- `job_postings` - Stores job posting information
- `candidate_job_assignments` - Tracks which candidates are assigned to which jobs

## Step 4: Test the Application
Once the tables are created, the job management features will work:
- Create job postings on the Jobs page
- Assign candidates to jobs
- Edit existing job postings

The application will automatically detect when the tables are available and switch from sample data to real database operations.
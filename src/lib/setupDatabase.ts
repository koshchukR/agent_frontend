import { supabase } from './supabase'

export const setupDatabase = async () => {
  try {
    console.log('Setting up database tables...')

    // Create job_postings table
    const { error: jobPostingsError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    })

    if (jobPostingsError) {
      console.error('Error creating job_postings table:', jobPostingsError)
    } else {
      console.log('job_postings table created successfully')
    }

    // Create candidate_job_assignments table
    const { error: assignmentsError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create candidate_job_assignments table to track which candidates are assigned to which jobs
        CREATE TABLE IF NOT EXISTS candidate_job_assignments (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            candidate_id VARCHAR(255) NOT NULL,
            job_id UUID REFERENCES job_postings(id) ON DELETE CASCADE,
            assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            assigned_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            notes TEXT,
            UNIQUE(candidate_id, job_id)
        );
      `
    })

    if (assignmentsError) {
      console.error('Error creating candidate_job_assignments table:', assignmentsError)
    } else {
      console.log('candidate_job_assignments table created successfully')
    }

    // Enable RLS
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Enable Row Level Security (RLS)
        ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
        ALTER TABLE candidate_job_assignments ENABLE ROW LEVEL SECURITY;
      `
    })

    if (rlsError) {
      console.error('Error enabling RLS:', rlsError)
    } else {
      console.log('RLS enabled successfully')
    }

    // Create policies
    const { error: policiesError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create policies for job_postings
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view all job postings' AND tablename = 'job_postings') THEN
            CREATE POLICY "Users can view all job postings" ON job_postings FOR SELECT USING (true);
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can insert job postings' AND tablename = 'job_postings') THEN
            CREATE POLICY "Authenticated users can insert job postings" ON job_postings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own job postings' AND tablename = 'job_postings') THEN
            CREATE POLICY "Users can update their own job postings" ON job_postings FOR UPDATE USING (auth.uid() = created_by);
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own job postings' AND tablename = 'job_postings') THEN
            CREATE POLICY "Users can delete their own job postings" ON job_postings FOR DELETE USING (auth.uid() = created_by);
          END IF;
        END $$;
      `
    })

    if (policiesError) {
      console.error('Error creating job_postings policies:', policiesError)
    } else {
      console.log('job_postings policies created successfully')
    }

    // Create assignment policies
    const { error: assignmentPoliciesError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create policies for candidate_job_assignments
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view all assignments' AND tablename = 'candidate_job_assignments') THEN
            CREATE POLICY "Users can view all assignments" ON candidate_job_assignments FOR SELECT USING (true);
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can create assignments' AND tablename = 'candidate_job_assignments') THEN
            CREATE POLICY "Authenticated users can create assignments" ON candidate_job_assignments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update assignments they created' AND tablename = 'candidate_job_assignments') THEN
            CREATE POLICY "Users can update assignments they created" ON candidate_job_assignments FOR UPDATE USING (auth.uid() = assigned_by);
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete assignments they created' AND tablename = 'candidate_job_assignments') THEN
            CREATE POLICY "Users can delete assignments they created" ON candidate_job_assignments FOR DELETE USING (auth.uid() = assigned_by);
          END IF;
        END $$;
      `
    })

    if (assignmentPoliciesError) {
      console.error('Error creating assignment policies:', assignmentPoliciesError)
    } else {
      console.log('Assignment policies created successfully')
    }

    // Create indexes
    const { error: indexesError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_job_postings_status ON job_postings(status);
        CREATE INDEX IF NOT EXISTS idx_job_postings_department ON job_postings(department);
        CREATE INDEX IF NOT EXISTS idx_job_postings_created_at ON job_postings(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_candidate_assignments_candidate_id ON candidate_job_assignments(candidate_id);
        CREATE INDEX IF NOT EXISTS idx_candidate_assignments_job_id ON candidate_job_assignments(job_id);
      `
    })

    if (indexesError) {
      console.error('Error creating indexes:', indexesError)
    } else {
      console.log('Indexes created successfully')
    }

    // Create trigger function and trigger
    const { error: triggerError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create function to automatically update updated_at timestamp
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';

        -- Create trigger to automatically update updated_at
        DROP TRIGGER IF EXISTS update_job_postings_updated_at ON job_postings;
        CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON job_postings
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `
    })

    if (triggerError) {
      console.error('Error creating triggers:', triggerError)
    } else {
      console.log('Triggers created successfully')
    }

    console.log('Database setup completed!')
    return { success: true }

  } catch (error) {
    console.error('Database setup failed:', error)
    return { success: false, error }
  }
}

// Alternative approach using direct SQL execution
export const setupDatabaseDirect = async () => {
  try {
    console.log('Setting up database with direct SQL execution...')

    // Execute the schema directly
    const schemaSQL = `
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

      -- Create candidate_job_assignments table
      CREATE TABLE IF NOT EXISTS candidate_job_assignments (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          candidate_id VARCHAR(255) NOT NULL,
          job_id UUID REFERENCES job_postings(id) ON DELETE CASCADE,
          assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          assigned_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          notes TEXT,
          UNIQUE(candidate_id, job_id)
      );

      -- Enable Row Level Security (RLS)
      ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
      ALTER TABLE candidate_job_assignments ENABLE ROW LEVEL SECURITY;
    `

    // Note: In a real implementation, you would manually execute this SQL in the Supabase dashboard
    // For now, we'll just log the SQL that needs to be executed
    console.log('Please execute the following SQL in your Supabase SQL editor:')
    console.log(schemaSQL)

    return { success: true, sql: schemaSQL }

  } catch (error) {
    console.error('Database setup preparation failed:', error)
    return { success: false, error }
  }
}
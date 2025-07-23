import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

export interface JobPosting {
  id: string
  title: string
  company: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  salary_min?: number
  salary_max?: number
  description: string
  requirements: string[]
  benefits: string[]
  department: string
  experience_level: 'entry' | 'mid' | 'senior' | 'executive'
  remote_type: 'remote' | 'hybrid' | 'on-site'
  status: 'active' | 'paused' | 'closed'
  created_at: string
  updated_at: string
  created_by: string
}

interface JobsContextType {
  jobs: JobPosting[]
  loading: boolean
  error: string | null
  getJobById: (id: string) => JobPosting | undefined
  createJob: (job: Omit<JobPosting, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => Promise<{ success: boolean; error?: string }>
  updateJob: (id: string, updates: Partial<JobPosting>) => Promise<{ success: boolean; error?: string }>
  deleteJob: (id: string) => Promise<{ success: boolean; error?: string }>
  refreshJobs: () => Promise<void>
}

const JobsContext = createContext<JobsContextType | undefined>(undefined)

export const useJobs = () => {
  const context = useContext(JobsContext)
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider')
  }
  return context
}

export const JobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Sample data for development - will be replaced with Supabase data
  const sampleJobs: JobPosting[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'full-time',
      salary_min: 120000,
      salary_max: 180000,
      description: 'We are looking for a Senior Software Engineer to join our dynamic team. You will be responsible for designing, developing, and maintaining high-performance applications. This role offers the opportunity to work with cutting-edge technologies and contribute to innovative projects that impact millions of users.',
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '5+ years of experience in software development',
        'Proficiency in React, Node.js, and TypeScript',
        'Experience with cloud platforms (AWS, Azure, or GCP)',
        'Strong problem-solving and communication skills'
      ],
      benefits: [
        'Competitive salary with equity',
        'Comprehensive health insurance',
        'Flexible work arrangements',
        'Professional development budget',
        'Unlimited PTO'
      ],
      department: 'Engineering',
      experience_level: 'senior',
      remote_type: 'hybrid',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'system'
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'InnovateLabs',
      location: 'New York, NY',
      type: 'full-time',
      salary_min: 100000,
      salary_max: 150000,
      description: 'Join our product team as a Product Manager and drive the development of next-generation products. You will work closely with engineering, design, and business teams to define product strategy, gather requirements, and ensure successful product launches.',
      requirements: [
        'MBA or equivalent experience',
        '3+ years of product management experience',
        'Experience with Agile/Scrum methodologies',
        'Strong analytical and data-driven decision making',
        'Excellent communication and leadership skills'
      ],
      benefits: [
        'Stock options',
        'Health and dental insurance',
        'Remote work flexibility',
        'Learning and development opportunities',
        'Team building events'
      ],
      department: 'Product',
      experience_level: 'mid',
      remote_type: 'hybrid',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'system'
    },
    {
      id: '3',
      title: 'UX/UI Designer',
      company: 'DesignStudio Pro',
      location: 'Austin, TX',
      type: 'full-time',
      salary_min: 80000,
      salary_max: 120000,
      description: 'We are seeking a talented UX/UI Designer to create exceptional user experiences for our digital products. You will be responsible for user research, wireframing, prototyping, and creating visually appealing interfaces that delight our users.',
      requirements: [
        'Bachelor\'s degree in Design or related field',
        '4+ years of UX/UI design experience',
        'Proficiency in Figma, Sketch, and Adobe Creative Suite',
        'Experience with user research and usability testing',
        'Strong portfolio showcasing design process'
      ],
      benefits: [
        'Creative freedom and autonomy',
        'Top-tier design tools and equipment',
        'Conference and workshop attendance',
        'Flexible working hours',
        'Health insurance and 401k'
      ],
      department: 'Design',
      experience_level: 'mid',
      remote_type: 'remote',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'system'
    }
  ]

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Fetching jobs from Supabase...')

      // Try to fetch from Supabase
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('Supabase fetch failed:', error.message)
        console.log('Using sample data as fallback')
        setError('Connected to sample data - refresh to try database again')
        setJobs(sampleJobs)
      } else {
        console.log('Successfully fetched jobs from database:', data?.length || 0, 'jobs')
        // If no jobs in database, show sample jobs as examples
        if (!data || data.length === 0) {
          console.log('No jobs in database, showing sample data')
          setJobs(sampleJobs)
          setError('No jobs found in database - showing sample data')
        } else {
          setJobs(data)
        }
      }
    } catch (err) {
      console.error('Error fetching jobs:', err)
      setError('Database connection failed - using sample data')
      setJobs(sampleJobs)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const getJobById = (id: string): JobPosting | undefined => {
    return jobs.find(job => job.id === id)
  }

  const createJob = async (jobData: Omit<JobPosting, 'id' | 'created_at' | 'updated_at' | 'created_by'>): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Creating job with data:', jobData)
      
      if (!user?.id) {
        return { success: false, error: 'User not authenticated' }
      }

      const jobPayload = {
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        type: jobData.type,
        salary_min: jobData.salary_min || null,
        salary_max: jobData.salary_max || null,
        description: jobData.description,
        requirements: jobData.requirements,
        benefits: jobData.benefits,
        department: jobData.department,
        experience_level: jobData.experience_level,
        remote_type: jobData.remote_type,
        status: jobData.status,
        created_by: user.id
      }

      console.log('Sending payload to Supabase:', jobPayload)

      const { data, error } = await supabase
        .from('job_postings')
        .insert([jobPayload])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        return { success: false, error: error.message }
      }

      console.log('Job created successfully:', data)

      // Add to local state
      setJobs(prev => [data, ...prev])
      return { success: true }
    } catch (err) {
      console.error('Create job error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to create job posting'
      return { success: false, error: errorMessage }
    }
  }

  const updateJob = async (id: string, updates: Partial<JobPosting>): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Updating job:', id, 'with data:', updates)

      // Clean the updates object to only include database fields
      const updatePayload = {
        title: updates.title,
        company: updates.company,
        location: updates.location,
        type: updates.type,
        salary_min: updates.salary_min || null,
        salary_max: updates.salary_max || null,
        description: updates.description,
        requirements: updates.requirements,
        benefits: updates.benefits,
        department: updates.department,
        experience_level: updates.experience_level,
        remote_type: updates.remote_type,
        status: updates.status,
        updated_at: new Date().toISOString()
      }

      // Remove undefined values
      Object.keys(updatePayload).forEach(key => {
        if (updatePayload[key as keyof typeof updatePayload] === undefined) {
          delete updatePayload[key as keyof typeof updatePayload]
        }
      })

      console.log('Sending update payload to Supabase:', updatePayload)

      const { data, error } = await supabase
        .from('job_postings')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Supabase update error:', error)
        return { success: false, error: error.message }
      }

      console.log('Job updated successfully:', data)

      // Update local state
      setJobs(prev => prev.map(job => job.id === id ? data : job))
      return { success: true }
    } catch (err) {
      console.error('Update job error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update job posting'
      return { success: false, error: errorMessage }
    }
  }

  const deleteJob = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from('job_postings')
        .delete()
        .eq('id', id)

      if (error) {
        return { success: false, error: error.message }
      }

      // Remove from local state
      setJobs(prev => prev.filter(job => job.id !== id))
      return { success: true }
    } catch (err) {
      return { success: false, error: 'Failed to delete job posting' }
    }
  }

  const refreshJobs = async () => {
    await fetchJobs()
  }

  const value = {
    jobs,
    loading,
    error,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    refreshJobs
  }

  return (
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  )
}
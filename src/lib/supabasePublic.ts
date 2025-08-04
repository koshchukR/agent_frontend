import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Create a public client for calendar operations
// This client will be used for operations that need to work without authentication
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Don't persist sessions for public operations
    autoRefreshToken: false, // Don't auto-refresh tokens
  },
  global: {
    headers: {
      'X-Calendar-Public': 'true', // Custom header to identify calendar requests
    },
  },
})

// Helper function to execute queries with better error handling for public access
export const executePublicQuery = async <T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  fallbackValue: T | null = null
): Promise<{ data: T | null; error: any }> => {
  try {
    const result = await queryFn()
    
    // If we get an RLS error, return the fallback value instead of failing
    if (result.error && (
      result.error.code === 'PGRST301' || 
      result.error.message?.includes('RLS') ||
      result.error.message?.includes('permission denied')
    )) {
      console.warn('RLS blocked public query, using fallback:', result.error.message)
      return { data: fallbackValue, error: null }
    }
    
    return result
  } catch (error) {
    console.error('Public query failed:', error)
    return { data: fallbackValue, error }
  }
}
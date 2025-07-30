import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  salary_min?: number;
  salary_max?: number;
  description: string;
  requirements: string[];
  benefits: string[];
  department: string;
  experience_level: "entry" | "mid" | "senior" | "executive";
  remote_type: "remote" | "hybrid" | "on-site";
  status: "active" | "paused" | "closed";
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface JobsContextType {
  jobs: JobPosting[];
  loading: boolean;
  error: string | null;
  getJobById: (id: string) => JobPosting | undefined;
  createJob: (
    job: Omit<JobPosting, "id" | "created_at" | "updated_at" | "created_by">
  ) => Promise<{ success: boolean; error?: string }>;
  updateJob: (
    id: string,
    updates: Partial<JobPosting>
  ) => Promise<{ success: boolean; error?: string }>;
  deleteJob: (id: string) => Promise<{ success: boolean; error?: string }>;
  refreshJobs: () => Promise<void>;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
};

export const JobsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Generate user-specific sample data to demonstrate functionality
  const getSampleJobs = (userId: string): JobPosting[] => [];

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching jobs from Supabase...");

      if (!user?.id) {
        console.warn("User not authenticated, showing empty state");
        setJobs([]);
        setError("Please log in to view your job postings");
        return;
      }

      // Try to fetch from Supabase - only user's own jobs due to RLS
      const { data, error } = await supabase
        .from("job_postings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase fetch failed:", error.message);
        console.log("Using user-specific sample data as fallback");
        setError(
          "Database connection failed - showing sample data (your personal demo jobs)"
        );
        setJobs(getSampleJobs(user.id));
      } else {
        console.log(
          "Successfully fetched jobs from database:",
          data?.length || 0,
          "jobs"
        );
        // If no jobs in database, show user-specific sample jobs as examples
        if (!data || data.length === 0) {
          console.log("No jobs in database, showing user-specific sample data");
          setJobs(getSampleJobs(user.id));
          setError(
            'No job postings found - showing sample jobs to demonstrate features. Create your own jobs using the "Post New Job" button.'
          );
        } else {
          setJobs(data);
        }
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Database connection failed - showing your personal demo jobs");
      setJobs(user?.id ? getSampleJobs(user.id) : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user?.id]);

  const getJobById = (id: string): JobPosting | undefined => {
    return jobs.find((job) => job.id === id);
  };

  const createJob = async (
    jobData: Omit<JobPosting, "id" | "created_at" | "updated_at" | "created_by">
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("Creating job with data:", jobData);

      if (!user?.id) {
        return { success: false, error: "User not authenticated" };
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
        created_by: user.id,
      };

      console.log("Sending payload to Supabase:", jobPayload);

      const { data, error } = await supabase
        .from("job_postings")
        .insert([jobPayload])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        return { success: false, error: error.message };
      }

      console.log("Job created successfully:", data);

      // Add to local state
      setJobs((prev) => [data, ...prev]);
      return { success: true };
    } catch (err) {
      console.error("Create job error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create job posting";
      return { success: false, error: errorMessage };
    }
  };

  const updateJob = async (
    id: string,
    updates: Partial<JobPosting>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("Updating job:", id, "with data:", updates);

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
        updated_at: new Date().toISOString(),
      };

      // Remove undefined values
      Object.keys(updatePayload).forEach((key) => {
        if (updatePayload[key as keyof typeof updatePayload] === undefined) {
          delete updatePayload[key as keyof typeof updatePayload];
        }
      });

      console.log("Sending update payload to Supabase:", updatePayload);

      const { data, error } = await supabase
        .from("job_postings")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase update error:", error);
        return { success: false, error: error.message };
      }

      console.log("Job updated successfully:", data);

      // Update local state
      setJobs((prev) => prev.map((job) => (job.id === id ? data : job)));
      return { success: true };
    } catch (err) {
      console.error("Update job error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update job posting";
      return { success: false, error: errorMessage };
    }
  };

  const deleteJob = async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from("job_postings")
        .delete()
        .eq("id", id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Remove from local state
      setJobs((prev) => prev.filter((job) => job.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: "Failed to delete job posting" };
    }
  };

  const refreshJobs = async () => {
    await fetchJobs();
  };

  const value = {
    jobs,
    loading,
    error,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    refreshJobs,
  };

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
};

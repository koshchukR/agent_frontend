import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

export interface Recruiter {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  phone?: string;
  voice?: string;
  personality: string[] | null;
  industry: string;
  enabled: boolean;
  scheduled_interviews: number;
  completed_interviews: number;
  total_minutes: number;
  avg_time_minutes: number;
  success_rate: number;
  monthly_cost: number;
  cost_per_interview: number;
  total_cost: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface RecruitersContextType {
  recruiters: Recruiter[];
  loading: boolean;
  error: string | null;
  getRecruiterById: (id: string) => Recruiter | undefined;
  createRecruiter: (
    recruiter: Omit<
      Recruiter,
      "id" | "created_at" | "updated_at" | "created_by"
    >
  ) => Promise<{ success: boolean; error?: string }>;
  updateRecruiter: (
    id: string,
    updates: Partial<Recruiter>
  ) => Promise<{ success: boolean; error?: string }>;
  deleteRecruiter: (
    id: string
  ) => Promise<{ success: boolean; error?: string }>;
  refreshRecruiters: () => Promise<void>;
}

const RecruitersContext = createContext<RecruitersContextType | undefined>(
  undefined
);

export const useRecruiters = () => {
  const context = useContext(RecruitersContext);
  if (!context) {
    throw new Error("useRecruiters must be used within a RecruitersProvider");
  }
  return context;
};

export const RecruitersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Sample data for development fallback
  const sampleRecruiters: Recruiter[] = [];

  const fetchRecruiters = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching recruiters from Supabase...");

      // Try to fetch from Supabase
      const { data, error } = await supabase
        .from("recruiters")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase fetch failed:", error.message);
        console.log("Using sample data as fallback");
        setError("Connected to sample data - refresh to try database again");
        setRecruiters(sampleRecruiters);
      } else {
        console.log(
          "Successfully fetched recruiters from database:",
          data?.length || 0,
          "recruiters"
        );
        // If no recruiters in database, show sample recruiters as examples
        if (!data || data.length === 0) {
          console.log("No recruiters in database, showing sample data");
          setRecruiters(sampleRecruiters);
          setError("No recruiters found in database - showing sample data");
        } else {
          setRecruiters(data);
        }
      }
    } catch (err) {
      console.error("Error fetching recruiters:", err);
      setError("Database connection failed - using sample data");
      setRecruiters(sampleRecruiters);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const getRecruiterById = (id: string): Recruiter | undefined => {
    return recruiters.find((recruiter) => recruiter.id === id);
  };

  const createRecruiter = async (
    recruiterData: Omit<
      Recruiter,
      "id" | "created_at" | "updated_at" | "created_by"
    >
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("Creating recruiter with data:", recruiterData);

      if (!user?.id) {
        return { success: false, error: "User not authenticated" };
      }

      const recruiterPayload = {
        name: recruiterData.name,
        avatar: recruiterData.avatar,
        email: recruiterData.email,
        phone: recruiterData.phone,
        voice: recruiterData.voice,
        personality: recruiterData.personality,
        industry: recruiterData.industry,
        enabled: recruiterData.enabled,
        scheduled_interviews: recruiterData.scheduled_interviews || 0,
        completed_interviews: recruiterData.completed_interviews || 0,
        total_minutes: recruiterData.total_minutes || 0,
        avg_time_minutes: recruiterData.avg_time_minutes || 0,
        success_rate: recruiterData.success_rate || 0,
        monthly_cost: recruiterData.monthly_cost || 299.0,
        cost_per_interview: recruiterData.cost_per_interview || 0,
        total_cost: recruiterData.total_cost || 0,
        created_by: user.id,
      };

      console.log("Sending payload to Supabase:", recruiterPayload);

      const { data, error } = await supabase
        .from("recruiters")
        .insert([recruiterPayload])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        return { success: false, error: error.message };
      }

      console.log("Recruiter created successfully:", data);

      // Add to local state
      setRecruiters((prev) => [data, ...prev]);
      return { success: true };
    } catch (err) {
      console.error("Create recruiter error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create recruiter";
      return { success: false, error: errorMessage };
    }
  };

  const updateRecruiter = async (
    id: string,
    updates: Partial<Recruiter>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("Updating recruiter:", id, "with data:", updates);

      // Clean the updates object to only include database fields
      const updatePayload = {
        name: updates.name,
        avatar: updates.avatar,
        email: updates.email,
        phone: updates.phone,
        voice: updates.voice,
        personality: updates.personality,
        industry: updates.industry,
        enabled: updates.enabled,
        scheduled_interviews: updates.scheduled_interviews,
        completed_interviews: updates.completed_interviews,
        total_minutes: updates.total_minutes,
        avg_time_minutes: updates.avg_time_minutes,
        success_rate: updates.success_rate,
        monthly_cost: updates.monthly_cost,
        cost_per_interview: updates.cost_per_interview,
        total_cost: updates.total_cost,
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
        .from("recruiters")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase update error:", error);
        return { success: false, error: error.message };
      }

      console.log("Recruiter updated successfully:", data);

      // Update local state
      setRecruiters((prev) =>
        prev.map((recruiter) => (recruiter.id === id ? data : recruiter))
      );
      return { success: true };
    } catch (err) {
      console.error("Update recruiter error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update recruiter";
      return { success: false, error: errorMessage };
    }
  };

  const deleteRecruiter = async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.from("recruiters").delete().eq("id", id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Remove from local state
      setRecruiters((prev) => prev.filter((recruiter) => recruiter.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: "Failed to delete recruiter" };
    }
  };

  const refreshRecruiters = async () => {
    await fetchRecruiters();
  };

  const value = {
    recruiters,
    loading,
    error,
    getRecruiterById,
    createRecruiter,
    updateRecruiter,
    deleteRecruiter,
    refreshRecruiters,
  };

  return (
    <RecruitersContext.Provider value={value}>
      {children}
    </RecruitersContext.Provider>
  );
};

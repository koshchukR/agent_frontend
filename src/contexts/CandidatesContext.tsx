import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

export interface Candidate {
  id: string;
  name: string;
  position: string;
  status:
    | "New"
    | "Screening"
    | "Interview"
    | "Scheduled"
    | "Hired"
    | "Rejected";
  score?: number;
  source: string;
  date: string;
  botRisk: "Low" | "Medium" | "High";
  phone?: string;
  email: string;
  resume_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface CandidatesContextType {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
  getCandidateById: (id: string) => Candidate | undefined;
  createCandidate: (
    candidate: Omit<
      Candidate,
      "id" | "created_at" | "updated_at" | "created_by"
    >
  ) => Promise<{ success: boolean; candidateId?: string; error?: string }>;
  updateCandidate: (
    id: string,
    updates: Partial<Candidate>
  ) => Promise<{ success: boolean; error?: string }>;
  deleteCandidate: (
    id: string
  ) => Promise<{ success: boolean; error?: string }>;
  refreshCandidates: () => Promise<void>;
  uploadResume: (
    candidateId: string,
    file: File
  ) => Promise<{ success: boolean; url?: string; error?: string }>;
}

const CandidatesContext = createContext<CandidatesContextType | undefined>(
  undefined
);

export const useCandidates = () => {
  const context = useContext(CandidatesContext);
  if (!context) {
    throw new Error("useCandidates must be used within a CandidatesProvider");
  }
  return context;
};

export const CandidatesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Generate user-specific sample data to demonstrate functionality
  const getSampleCandidates = (userId: string): Candidate[] => [];

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching candidates from Supabase...");

      if (!user?.id) {
        console.warn("User not authenticated, showing empty state");
        setCandidates([]);
        setError("Please log in to view your candidates");
        return;
      }

      // Try to fetch from Supabase - only user's own candidates due to RLS
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase fetch failed:", error.message);
        console.log("Using user-specific sample data as fallback");
        setError(
          "Database connection failed - showing sample data (your personal demo candidates)"
        );
        setCandidates(getSampleCandidates(user.id));
      } else {
        console.log(
          "Successfully fetched candidates from database:",
          data?.length || 0,
          "candidates"
        );
        // If no candidates in database, show user-specific sample candidates as examples
        if (!data || data.length === 0) {
          console.log(
            "No candidates in database, showing user-specific sample data"
          );
          setCandidates(getSampleCandidates(user.id));
          setError(
            'No candidates found - showing sample candidates to demonstrate features. Add your own candidates using the "Add Candidate" button.'
          );
        } else {
          // Transform database format to match interface
          const transformedCandidates = data.map((candidate) => ({
            ...candidate,
            botRisk: candidate.bot_risk, // Transform snake_case to camelCase
            resume_url: candidate.resume_url,
          }));
          setCandidates(transformedCandidates);
        }
      }
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setError(
        "Database connection failed - showing your personal demo candidates"
      );
      setCandidates(user?.id ? getSampleCandidates(user.id) : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [user?.id]);

  const getCandidateById = (id: string): Candidate | undefined => {
    return candidates.find((candidate) => candidate.id === id);
  };

  const createCandidate = async (
    candidateData: Omit<
      Candidate,
      "id" | "created_at" | "updated_at" | "created_by"
    >
  ): Promise<{ success: boolean; candidateId?: string; error?: string }> => {
    try {
      console.log("Creating candidate with data:", candidateData);

      if (!user?.id) {
        return { success: false, error: "User not authenticated" };
      }

      const candidatePayload = {
        name: candidateData.name,
        position: candidateData.position,
        status: candidateData.status,
        score: candidateData.score || null,
        source: candidateData.source,
        date: candidateData.date,
        bot_risk: candidateData.botRisk, // Transform camelCase to snake_case
        phone: candidateData.phone || null,
        email: candidateData.email,
        resume_url: candidateData.resume_url || null,
        created_by: user.id,
      };

      console.log("Sending payload to Supabase:", candidatePayload);

      const { data, error } = await supabase
        .from("candidates")
        .insert([candidatePayload])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        return { success: false, error: error.message };
      }

      console.log("Candidate created successfully:", data);

      // Transform response and add to local state
      const transformedCandidate = {
        ...data,
        botRisk: data.bot_risk,
        resume_url: data.resume_url,
      };
      setCandidates((prev) => [transformedCandidate, ...prev]);
      return { success: true, candidateId: data.id };
    } catch (err) {
      console.error("Create candidate error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create candidate";
      return { success: false, error: errorMessage };
    }
  };

  const updateCandidate = async (
    id: string,
    updates: Partial<Candidate>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("Updating candidate:", id, "with data:", updates);

      // Clean the updates object to only include database fields
      const updatePayload = {
        name: updates.name,
        position: updates.position,
        status: updates.status,
        score: updates.score || null,
        source: updates.source,
        date: updates.date,
        bot_risk: updates.botRisk, // Transform camelCase to snake_case
        phone: updates.phone || null,
        email: updates.email,
        resume_url: updates.resume_url || null,
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
        .from("candidates")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase update error:", error);
        return { success: false, error: error.message };
      }

      console.log("Candidate updated successfully:", data);

      // Transform response and update local state
      const transformedCandidate = {
        ...data,
        botRisk: data.bot_risk,
        resume_url: data.resume_url,
      };
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === id ? transformedCandidate : candidate
        )
      );
      return { success: true };
    } catch (err) {
      console.error("Update candidate error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update candidate";
      return { success: false, error: errorMessage };
    }
  };

  const deleteCandidate = async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.from("candidates").delete().eq("id", id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Remove from local state
      setCandidates((prev) => prev.filter((candidate) => candidate.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: "Failed to delete candidate" };
    }
  };

  const uploadResume = async (
    candidateId: string,
    file: File
  ): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      if (!user?.id) {
        return { success: false, error: "User not authenticated" };
      }

      // Create file path: userId/candidateId/filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${candidateId}/resume.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log("Uploading resume to:", filePath);

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true, // Replace if exists
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return { success: false, error: uploadError.message };
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("resumes")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl;

      if (!publicUrl) {
        return { success: false, error: "Failed to get file URL" };
      }

      // Update candidate record with resume URL
      const updateResult = await updateCandidate(candidateId, {
        resume_url: publicUrl,
      });

      if (!updateResult.success) {
        return { success: false, error: updateResult.error };
      }

      return { success: true, url: publicUrl };
    } catch (err) {
      console.error("Resume upload error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload resume";
      return { success: false, error: errorMessage };
    }
  };

  const refreshCandidates = async () => {
    await fetchCandidates();
  };

  const value = {
    candidates,
    loading,
    error,
    getCandidateById,
    createCandidate,
    updateCandidate,
    deleteCandidate,
    refreshCandidates,
    uploadResume,
  };

  return (
    <CandidatesContext.Provider value={value}>
      {children}
    </CandidatesContext.Provider>
  );
};

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiService, type Candidate } from "../../lib/api";
import { JobAssignmentModal } from "../JobAssignmentModal";
import { RecruiterAssignmentModal } from "../RecruiterAssignmentModal";
import { supabase } from "../../lib/supabase";
import { useRecruiters } from "../../contexts/RecruitersContext";
import {
  SearchIcon,
  FilterIcon,
  ChevronDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  PhoneCall,
  LockIcon,
  BriefcaseIcon,
  PlusIcon,
  CheckIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
export const CandidatesList = () => {
  const { recruiters } = useRecruiters();
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterOpen, setFilterOpen] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [candidateJobs, setCandidateJobs] = useState<{ [key: string]: string }>(
    {}
  );
  const [candidateRecruiters, setCandidateRecruiters] = useState<{
    [key: string]: string;
  }>({});
  const [jobAssignmentModal, setJobAssignmentModal] = useState<{
    isOpen: boolean;
    candidateId: string;
    candidateName: string;
    currentJobId?: string;
  }>({
    isOpen: false,
    candidateId: "",
    candidateName: "",
  });
  const [recruiterAssignmentModal, setRecruiterAssignmentModal] = useState<{
    isOpen: boolean;
    candidateId: string;
    candidateName: string;
    currentRecruiterId?: string;
  }>({
    isOpen: false,
    candidateId: "",
    candidateName: "",
  });

  const [isCalling, setIsCalling] = useState(false);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);

  // Test users that will always appear first
  const testUsers: Candidate[] = [
    {
      id: "test-1",
      name: "Roman Koshchuk",
      position: "Senior Developer",
      status: "Scheduled",
      score: 92,
      source: "LinkedIn",
      date: "2023-06-15",
      botRisk: "Low",
      phone: "+380664374069",
      email: "roman@example.com",
    },
    {
      id: "test-2",
      name: "Nicolas Thatcher",
      position: "Electrician",
      status: "Scheduled",
      score: 92,
      source: "LinkedIn",
      date: "2023-06-15",
      botRisk: "Low",
      phone: "+17373288523",
      email: "nicolas@example.com",
    },
  ];

  // Fetch job assignments for candidates
  const fetchJobAssignments = async () => {
    try {
      const { data, error } = await supabase.from("candidate_job_assignments")
        .select(`
          candidate_id,
          job_postings!inner(id, title)
        `);

      if (error) {
        console.warn("Failed to fetch job assignments:", error.message);
        return;
      }

      const jobMap: { [key: string]: string } = {};
      data?.forEach((assignment) => {
        jobMap[assignment.candidate_id] = assignment.job_postings.title;
      });

      setCandidateJobs(jobMap);
    } catch (err) {
      console.warn("Error fetching job assignments:", err);
    }
  };

  // Fetch recruiter assignments for candidates
  const fetchRecruiterAssignments = async () => {
    try {
      const { data, error } = await supabase.from(
        "candidate_recruiter_assignments"
      ).select(`
          candidate_id,
          recruiters!inner(id, name)
        `);

      if (error) {
        console.warn("Failed to fetch recruiter assignments:", error.message);
        return;
      }

      const recruiterMap: { [key: string]: string } = {};
      data?.forEach((assignment) => {
        recruiterMap[assignment.candidate_id] = assignment.recruiters.name;
      });

      setCandidateRecruiters(recruiterMap);
    } catch (err) {
      console.warn("Error fetching recruiter assignments:", err);
    }
  };

  // Fetch candidates from HubSpot on component mount
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        setError(null);

        const hubspotCandidates = await apiService.getHubSpotContacts();

        // Combine test users (first) with HubSpot candidates
        setCandidates([...testUsers, ...hubspotCandidates]);

        // Fetch job assignments
        await fetchJobAssignments();
        // Fetch recruiter assignments
        await fetchRecruiterAssignments();
      } catch (err) {
        console.error("Error fetching candidates:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch candidates"
        );
        // Fallback to test users only if API fails
        setCandidates(testUsers);
        await fetchJobAssignments();
        await fetchRecruiterAssignments();
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const refreshCandidates = () => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        setError(null);

        const hubspotCandidates = await apiService.getHubSpotContacts();

        // Combine test users (first) with HubSpot candidates
        setCandidates([...testUsers, ...hubspotCandidates]);
      } catch (err) {
        console.error("Error fetching candidates:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch candidates"
        );
        // Fallback to test users only if API fails
        setCandidates(testUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  };

  const isTestUser = (candidateId: string) => {
    return candidateId.startsWith("test-");
  };

  const handleRecruiterClick = (candidateId: string, candidateName: string) => {
    // Only allow interaction with test users
    if (!isTestUser(candidateId)) {
      return;
    }

    // Find the current recruiter ID for this candidate
    const currentRecruiterName = candidateRecruiters[candidateId];
    const currentRecruiter = recruiters.find(
      (r) => r.name === currentRecruiterName
    );

    setRecruiterAssignmentModal({
      isOpen: true,
      candidateId,
      candidateName,
      currentRecruiterId: currentRecruiter?.id,
    });
  };

  const handleCallClick = (candidateId: string) => {
    // Only allow interaction with test users
    if (!isTestUser(candidateId)) {
      return;
    }

    const candidate = candidates.find((c) => c.id.toString() === candidateId);
    const assignedJobTitle = candidateJobs[candidateId];
    
    if (
      candidate &&
      assignedJobTitle &&
      candidateRecruiters[candidateId]
    ) {
      handleStartCall(candidate.phone, candidate.name, assignedJobTitle);
    }
  };

  const handleStartCall = async (
    phone: string,
    name: string,
    position: string
  ): Promise<void> => {
    try {
      setIsCalling(true);
      setActiveCallId(phone);

      const res = await fetch(
        "https://recruiter-agent-backend-sznn.onrender.com/start-call",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            name,
            position,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        console.log("Call started:", data);
        alert(`Call initiated to ${phone}`);
      } else {
        console.error("Call error:", data);
        alert("Call failed: " + (data.error || "Unknown error"));
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Network error:", err.message);
        alert("Network error: " + err.message);
      } else {
        console.error("Unknown error:", err);
        alert("Unknown error occurred");
      }
    } finally {
      setIsCalling(false);
      setActiveCallId(null);
    }
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handlePositionClick = (candidateId: string, candidateName: string) => {
    setJobAssignmentModal({
      isOpen: true,
      candidateId,
      candidateName,
      currentJobId: undefined, // We'll implement getting the current job ID later
    });
  };

  const handleCloseJobModal = () => {
    setJobAssignmentModal({
      isOpen: false,
      candidateId: "",
      candidateName: "",
    });
    // Refresh job assignments after modal closes
    fetchJobAssignments();
  };

  const handleCloseRecruiterModal = () => {
    setRecruiterAssignmentModal({
      isOpen: false,
      candidateId: "",
      candidateName: "",
    });
    // Refresh recruiter assignments after modal closes
    fetchRecruiterAssignments();
  };
  // Show loading state
  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
          <p className="text-gray-600">
            View and manage all candidates in your pipeline.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading candidates from HubSpot...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
        <p className="text-gray-600">
          View and manage all candidates in your pipeline.
        </p>
        {error && (
          <div className="mt-2 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
            <div className="flex items-center justify-between">
              <p className="text-sm">
                <strong>Note:</strong> {error}. Showing test users and any
                cached data.
              </p>
              <button
                onClick={refreshCandidates}
                className="text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 sm:text-sm"
                placeholder="Search candidates..."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <FilterIcon size={16} className="mr-2" />
                Filter
                <ChevronDownIcon size={16} className="ml-1" />
              </button>
              <div className="relative inline-block text-left">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  All Positions
                  <ChevronDownIcon size={16} className="ml-1" />
                </button>
              </div>
              <div className="relative inline-block text-left">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  All Statuses
                  <ChevronDownIcon size={16} className="ml-1" />
                </button>
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Add Candidate
              </button>
            </div>
          </div>
          {filterOpen && (
            <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <select className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option>All Sources</option>
                    <option>LinkedIn</option>
                    <option>Indeed</option>
                    <option>Referral</option>
                    <option>Company Website</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Score Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Min"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Max"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="date"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <span>to</span>
                    <input
                      type="date"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Reset
                </button>
                <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Candidate
                    {sortField === "name" &&
                      (sortDirection === "asc" ? (
                        <ArrowUpIcon size={14} className="ml-1" />
                      ) : (
                        <ArrowDownIcon size={14} className="ml-1" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {sortField === "status" &&
                      (sortDirection === "asc" ? (
                        <ArrowUpIcon size={14} className="ml-1" />
                      ) : (
                        <ArrowDownIcon size={14} className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("score")}
                >
                  <div className="flex items-center">
                    Score
                    {sortField === "score" &&
                      (sortDirection === "asc" ? (
                        <ArrowUpIcon size={14} className="ml-1" />
                      ) : (
                        <ArrowDownIcon size={14} className="ml-1" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === "date" &&
                      (sortDirection === "asc" ? (
                        <ArrowUpIcon size={14} className="ml-1" />
                      ) : (
                        <ArrowDownIcon size={14} className="ml-1" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bot Risk
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AI Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Call
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {candidates.map((candidate) => {
                const isLocked = !isTestUser(candidate.id);
                return (
                  <tr
                    key={candidate.id}
                    className={`${
                      isLocked ? "bg-gray-50 opacity-75" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center relative">
                          {candidate.name.charAt(0)}
                          {isLocked && (
                            <div className="absolute -top-1 -right-1 bg-gray-600 rounded-full p-1">
                              <LockIcon size={12} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div
                            className={`text-sm font-medium ${
                              isLocked ? "text-gray-500" : "text-gray-900"
                            }`}
                          >
                            {candidate.name}
                            {isLocked && (
                              <span className="ml-2 text-xs text-gray-400">
                                (HubSpot)
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {candidate.email ||
                              `candidate${candidate.id}@example.com`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() =>
                          handlePositionClick(candidate.id, candidate.name)
                        }
                        className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                          candidateJobs[candidate.id]
                            ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                            : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300"
                        }`}
                      >
                        {candidateJobs[candidate.id] ? (
                          <>
                            <CheckIcon
                              size={16}
                              className="mr-2 text-green-500"
                            />
                            <span
                              className="truncate max-w-32"
                              title={candidateJobs[candidate.id]}
                            >
                              {candidateJobs[candidate.id]}
                            </span>
                          </>
                        ) : (
                          <>
                            <PlusIcon size={16} className="mr-2" />
                            Assign Position
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          candidate.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : candidate.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : candidate.status === "Scheduled"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {candidate.score ? (
                        <div className="flex items-center">
                          <span
                            className={`font-medium ${
                              candidate.score >= 80
                                ? "text-green-600"
                                : candidate.score >= 60
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {candidate.score}/100
                          </span>
                        </div>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {candidate.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(candidate.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {candidate.botRisk === "Low" && (
                          <CheckCircleIcon
                            size={16}
                            className="text-green-500 mr-1"
                          />
                        )}
                        {candidate.botRisk === "Medium" && (
                          <AlertCircleIcon
                            size={16}
                            className="text-yellow-500 mr-1"
                          />
                        )}
                        {candidate.botRisk === "High" && (
                          <XCircleIcon
                            size={16}
                            className="text-red-500 mr-1"
                          />
                        )}
                        {candidate.botRisk === "Unknown" && (
                          <ClockIcon size={16} className="text-gray-400 mr-1" />
                        )}
                        <span
                          className={`text-sm ${
                            candidate.botRisk === "Low"
                              ? "text-green-600"
                              : candidate.botRisk === "Medium"
                              ? "text-yellow-600"
                              : candidate.botRisk === "High"
                              ? "text-red-600"
                              : "text-gray-500"
                          }`}
                        >
                          {candidate.botRisk}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isLocked ? (
                        <div className="flex items-center justify-end space-x-3">
                          <span className="text-gray-400 cursor-not-allowed">
                            View
                          </span>
                          <LockIcon size={14} className="text-gray-400" />
                        </div>
                      ) : (
                        <>
                          <Link
                            to={`/dashboard/candidates/${candidate.id}`}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            View
                          </Link>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isLocked ? (
                        <div className="flex items-center justify-center bg-gray-100 border border-gray-200 rounded-md px-3 py-2">
                          <LockIcon size={16} className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">Locked</span>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            handleRecruiterClick(candidate.id, candidate.name)
                          }
                          className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                            candidateRecruiters[candidate.id]
                              ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                              : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300"
                          }`}
                        >
                          {candidateRecruiters[candidate.id] ? (
                            <>
                              <CheckIcon
                                size={16}
                                className="mr-2 text-green-500"
                              />
                              <span
                                className="truncate max-w-32"
                                title={candidateRecruiters[candidate.id]}
                              >
                                {candidateRecruiters[candidate.id]}
                              </span>
                            </>
                          ) : (
                            <>
                              <UserIcon size={16} className="mr-2" />
                              Assign Agent
                            </>
                          )}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isLocked ? (
                        <div className="flex items-center justify-center bg-gray-100 border border-gray-200 rounded-md px-3 py-2">
                          <LockIcon size={16} className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">Locked</span>
                        </div>
                      ) : (
                        <>
                          {isCalling && activeCallId === candidate.phone ? (
                            <div className="flex items-center justify-center bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span className="text-sm font-medium text-blue-600">
                                  Calling...
                                </span>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleCallClick(candidate.id)}
                              disabled={
                                !candidateJobs[candidate.id] ||
                                !candidateRecruiters[candidate.id]
                              }
                              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                candidateJobs[candidate.id] &&
                                candidateRecruiters[candidate.id]
                                  ? "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              <PhoneIcon size={16} className="mr-2" />
                              Call
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">8</span> of{" "}
                <span className="font-medium">24</span> candidates
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  &larr;
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600 hover:bg-gray-50">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  &rarr;
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Job Assignment Modal */}
      <JobAssignmentModal
        isOpen={jobAssignmentModal.isOpen}
        onClose={handleCloseJobModal}
        candidateId={jobAssignmentModal.candidateId}
        candidateName={jobAssignmentModal.candidateName}
        currentJobId={jobAssignmentModal.currentJobId}
      />

      {/* Recruiter Assignment Modal */}
      <RecruiterAssignmentModal
        isOpen={recruiterAssignmentModal.isOpen}
        onClose={handleCloseRecruiterModal}
        candidateId={recruiterAssignmentModal.candidateId}
        candidateName={recruiterAssignmentModal.candidateName}
        currentRecruiterId={recruiterAssignmentModal.currentRecruiterId}
      />
    </div>
  );
};

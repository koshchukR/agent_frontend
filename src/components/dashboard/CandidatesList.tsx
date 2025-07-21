import React, { useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
export const CandidatesList = () => {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterOpen, setFilterOpen] = useState(false);

  const [isCalling, setIsCalling] = useState(false);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<{
    [key: string]: string;
  }>({});

  const aiRecruiters = [
    {
      id: 1,
      name: "Alex",
      industry: "Software Engineering",
      enabled: false,
    },
    {
      id: 2,
      name: "Sarah",
      industry: "Healthcare",
      enabled: false,
    },
    {
      id: 3,
      name: "Michael",
      industry: "Sales & Marketing",
      enabled: false,
    },
    {
      id: 4,
      name: "AI Recruiter Screen IQ",
      industry: "General Recruiting",
      enabled: true,
    },
  ];

  const handleAgentSelect = (candidateId: string, agentName: string) => {
    if (agentName === "AI Recruiter Screen IQ") {
      setSelectedAgents((prev) => ({ ...prev, [candidateId]: agentName }));
      const candidate = candidates.find((c) => c.id.toString() === candidateId);
      if (candidate) {
        handleStartCall(candidate.phone, candidate.name, candidate.position);
      }
    } else if (agentName === "") {
      setSelectedAgents((prev) => ({ ...prev, [candidateId]: "" }));
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

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  const candidates = [
    {
      id: 0,
      name: "Roman Koshchuk",
      position: "Senior Developer",
      status: "Scheduled",
      score: 92,
      source: "LinkedIn",
      date: "2023-06-15",
      botRisk: "Low",
      phone: "+380664374069",
    },
    {
      id: 1,
      name: "Nicolas Thatcher",
      position: "Electrician",
      status: "Scheduled",
      score: 92,
      source: "LinkedIn",
      date: "2023-06-15",
      botRisk: "Low",
      phone: "+17373288523",
    },
  ];
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
        <p className="text-gray-600">
          View and manage all candidates in your pipeline.
        </p>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {candidate.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {candidate.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          candidate{candidate.id}@example.com
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {candidate.position}
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
                        <XCircleIcon size={16} className="text-red-500 mr-1" />
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
                    <Link
                      to={`/dashboard/candidates/${candidate.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      View
                    </Link>
                    <button className="text-gray-600 hover:text-gray-900">
                      More
                    </button>
                  </td>
                  <td className="py-3 px-4 border-b relative">
                    {isCalling && activeCallId === candidate.phone ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-sm font-medium text-blue-600">
                            Calling...
                          </span>
                        </div>
                      </div>
                    ) : (
                      <select
                        value={selectedAgents[candidate.id] || ""}
                        onChange={(e) =>
                          handleAgentSelect(
                            candidate.id.toString(),
                            e.target.value
                          )
                        }
                        className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400 transition-colors duration-200 bg-white"
                      >
                        <option value="" className="text-gray-500">
                          Select Agent
                        </option>
                        {aiRecruiters.map((agent) => (
                          <option
                            key={agent.id}
                            value={agent.name}
                            disabled={!agent.enabled}
                            className={`${
                              !agent.enabled
                                ? "text-gray-400 bg-gray-100"
                                : "text-gray-900 hover:bg-indigo-50"
                            }`}
                          >
                            {agent.name} {!agent.enabled ? "(Disabled)" : ""}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
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
    </div>
  );
};

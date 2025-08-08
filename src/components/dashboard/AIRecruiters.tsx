import React, { useState } from "react";
import { AIRecruiterCard } from "./AIRecruiterCard";
import { AddAIRecruiterCard } from "./AddAIRecruiterCard";
import { useRecruiters } from "../../contexts/RecruitersContext";

export const AIRecruiters = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const { recruiters, loading, error } = useRecruiters();

  // Transform recruiter data to match the expected format for AIRecruiterCard
  const transformedRecruiters = recruiters.map(recruiter => ({
    id: recruiter.id,
    name: recruiter.name,
    avatar: recruiter.avatar,
    email: recruiter.email || '',
    phone: recruiter.phone || '',
    voice: recruiter.voice || '',
    personality: recruiter.personality || [],
    industry: recruiter.industry,
    stats: {
      scheduled: recruiter.scheduled_interviews,
      completed: recruiter.completed_interviews,
      minutes: recruiter.total_minutes,
      avgTime: recruiter.avg_time_minutes,
      successRate: recruiter.success_rate,
      cost: {
        monthly: recruiter.monthly_cost,
        perInterview: recruiter.cost_per_interview,
        total: recruiter.total_cost,
      },
    },
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading recruiters...</div>
      </div>
    );
  }
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My AI Recruiters</h1>
        <p className="text-gray-600">
          Manage your virtual recruiting team and their performance.
        </p>
        {error && (
          <div className="mt-2 p-3 bg-yellow-100 border border-yellow-300 rounded-md">
            <p className="text-yellow-800 text-sm">{error}</p>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transformedRecruiters.map((recruiter) => (
          <AIRecruiterCard key={recruiter.id} recruiter={recruiter} />
        ))}
        <AddAIRecruiterCard onAdd={() => setShowAddModal(true)} />
      </div>
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New AI Recruiter</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="AI Recruiter Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="name.ai@talentmatch.ai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voice
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>American English - Male</option>
                  <option>American English - Female</option>
                  <option>British English - Male</option>
                  <option>British English - Female</option>
                  <option>Australian English - Male</option>
                  <option>Australian English - Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry Specialty
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>Software Engineering</option>
                  <option>Healthcare</option>
                  <option>Finance</option>
                  <option>Sales & Marketing</option>
                  <option>Customer Service</option>
                  <option>Manufacturing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Personality Traits
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Friendly",
                    "Professional",
                    "Analytical",
                    "Empathetic",
                    "Direct",
                    "Thorough",
                  ].map((trait) => (
                    <div key={trait} className="flex items-center">
                      <input type="checkbox" id={trait} className="mr-1" />
                      <label htmlFor={trait} className="text-sm">
                        {trait}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium mb-2">Pricing Plan</h3>
              <div className="flex gap-4">
                <div className="border border-gray-200 rounded-lg p-3 flex-1">
                  <div className="font-medium">Standard</div>
                  <div className="text-xl font-bold mt-1">
                    $299
                    <span className="text-sm font-normal text-gray-500">
                      /month
                    </span>
                  </div>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Up to 50 interviews/month</li>
                    <li>• 24/7 availability</li>
                    <li>• Basic analytics</li>
                  </ul>
                </div>
                <div className="border border-indigo-200 bg-indigo-50 rounded-lg p-3 flex-1">
                  <div className="font-medium text-indigo-700">Premium</div>
                  <div className="text-xl font-bold mt-1">
                    $499
                    <span className="text-sm font-normal text-gray-500">
                      /month
                    </span>
                  </div>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Unlimited interviews</li>
                    <li>• Advanced analytics</li>
                    <li>• Custom voice training</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Create AI Recruiter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { AIRecruiterCard } from './AIRecruiterCard';
import { AddAIRecruiterCard } from './AddAIRecruiterCard';
export const AIRecruiters = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  // Sample data for AI recruiters
  const recruiters = [{
    id: 1,
    name: 'Alex',
    avatar: 'A',
    email: 'alex.ai@talentmatch.ai',
    phone: '+1 (555) 123-4567',
    voice: 'American English - Male',
    personality: ['Friendly', 'Professional', 'Detailed'],
    industry: 'Software Engineering',
    stats: {
      scheduled: 48,
      completed: 42,
      minutes: 1260,
      avgTime: 30,
      successRate: 78,
      cost: {
        monthly: 299,
        perInterview: 7.12,
        total: 1495
      }
    }
  }, {
    id: 2,
    name: 'Sarah',
    avatar: 'S',
    email: 'sarah.ai@talentmatch.ai',
    phone: '+1 (555) 987-6543',
    voice: 'British English - Female',
    personality: ['Empathetic', 'Analytical', 'Concise'],
    industry: 'Healthcare',
    stats: {
      scheduled: 36,
      completed: 33,
      minutes: 990,
      avgTime: 27.5,
      successRate: 82,
      cost: {
        monthly: 299,
        perInterview: 9.06,
        total: 1197
      }
    }
  }, {
    id: 3,
    name: 'Michael',
    avatar: 'M',
    email: 'michael.ai@talentmatch.ai',
    phone: '+1 (555) 456-7890',
    voice: 'Australian English - Male',
    personality: ['Enthusiastic', 'Direct', 'Thorough'],
    industry: 'Sales & Marketing',
    stats: {
      scheduled: 54,
      completed: 51,
      minutes: 1530,
      avgTime: 28.3,
      successRate: 75,
      cost: {
        monthly: 299,
        perInterview: 5.86,
        total: 1794
      }
    }
  }];
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My AI Recruiters</h1>
        <p className="text-gray-600">
          Manage your virtual recruiting team and their performance.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recruiters.map(recruiter => <AIRecruiterCard key={recruiter.id} recruiter={recruiter} />)}
        <AddAIRecruiterCard onAdd={() => setShowAddModal(true)} />
      </div>
      {showAddModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New AI Recruiter</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="AI Recruiter Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input type="email" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="name.ai@talentmatch.ai" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input type="tel" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="+1 (555) 123-4567" />
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
                  {['Friendly', 'Professional', 'Analytical', 'Empathetic', 'Direct', 'Thorough'].map(trait => <div key={trait} className="flex items-center">
                      <input type="checkbox" id={trait} className="mr-1" />
                      <label htmlFor={trait} className="text-sm">
                        {trait}
                      </label>
                    </div>)}
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
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700">
                Cancel
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Create AI Recruiter
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
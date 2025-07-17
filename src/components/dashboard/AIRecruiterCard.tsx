import React, { useState } from 'react';
import { Phone, Mail, Mic, BriefcaseIcon, Clock, BarChart2Icon, DollarSignIcon, MoreVerticalIcon } from 'lucide-react';
interface AIRecruiterProps {
  recruiter: {
    id: number;
    name: string;
    avatar: string;
    email: string;
    phone: string;
    voice: string;
    personality: string[];
    industry: string;
    stats: {
      scheduled: number;
      completed: number;
      minutes: number;
      avgTime: number;
      successRate: number;
      cost: {
        monthly: number;
        perInterview: number;
        total: number;
      };
    };
  };
}
export const AIRecruiterCard = ({
  recruiter
}: AIRecruiterProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-lg">
              {recruiter.avatar}
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-lg">{recruiter.name}</h3>
              <p className="text-sm text-gray-500">
                {recruiter.industry} Specialist
              </p>
            </div>
          </div>
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 rounded-full hover:bg-gray-100">
              <MoreVerticalIcon size={18} className="text-gray-500" />
            </button>
            {menuOpen && <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Edit Profile
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    View Analytics
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Customize Voice
                  </button>
                  <div className="border-t border-gray-100"></div>
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Deactivate
                  </button>
                </div>
              </div>}
          </div>
        </div>
        <div className="flex mt-4 border-b border-gray-200">
          <button className={`pb-2 px-4 text-sm font-medium ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('overview')}>
            Overview
          </button>
          <button className={`pb-2 px-4 text-sm font-medium ${activeTab === 'stats' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('stats')}>
            Stats
          </button>
          <button className={`pb-2 px-4 text-sm font-medium ${activeTab === 'cost' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('cost')}>
            Cost
          </button>
        </div>
      </div>
      <div className="p-4">
        {activeTab === 'overview' && <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Mail size={16} className="text-gray-400 mr-2" />
              <span>{recruiter.email}</span>
            </div>
            <div className="flex items-center text-sm">
              <Phone size={16} className="text-gray-400 mr-2" />
              <span>{recruiter.phone}</span>
            </div>
            <div className="flex items-center text-sm">
              <Mic size={16} className="text-gray-400 mr-2" />
              <span>{recruiter.voice}</span>
            </div>
            <div className="flex items-center text-sm">
              <BriefcaseIcon size={16} className="text-gray-400 mr-2" />
              <span>{recruiter.industry}</span>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Personality</div>
              <div className="flex flex-wrap gap-1">
                {recruiter.personality.map((trait, index) => <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs">
                    {trait}
                  </span>)}
              </div>
            </div>
          </div>}
        {activeTab === 'stats' && <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs text-gray-500">
                  Interviews Scheduled
                </div>
                <div className="text-lg font-medium">
                  {recruiter.stats.scheduled}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs text-gray-500">
                  Interviews Completed
                </div>
                <div className="text-lg font-medium">
                  {recruiter.stats.completed}
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <div className="text-xs text-gray-500">
                  Pre-Screen Success Rate
                </div>
                <div className="text-xs font-medium">
                  {recruiter.stats.successRate}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{
              width: `${recruiter.stats.successRate}%`
            }}></div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Clock size={16} className="text-gray-400 mr-1" />
                <span>Total Speaking Time</span>
              </div>
              <span className="font-medium">
                {recruiter.stats.minutes} mins
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <BarChart2Icon size={16} className="text-gray-400 mr-1" />
                <span>Avg. Interview Length</span>
              </div>
              <span className="font-medium">
                {recruiter.stats.avgTime} mins
              </span>
            </div>
          </div>}
        {activeTab === 'cost' && <div className="space-y-4">
            <div className="bg-indigo-50 p-3 rounded-lg">
              <div className="flex items-center text-indigo-800">
                <DollarSignIcon size={18} className="mr-1" />
                <span className="font-medium">Cost Summary</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                ${recruiter.stats.cost.total}
              </div>
              <div className="text-xs text-gray-600">Total cost to date</div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Monthly Subscription</span>
                <span className="font-medium">
                  ${recruiter.stats.cost.monthly}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Cost per Interview</span>
                <span className="font-medium">
                  ${recruiter.stats.cost.perInterview.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="text-sm text-gray-600 mb-2">Cost Efficiency</div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{
                width: '75%'
              }}></div>
                </div>
                <span className="text-xs font-medium">75%</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                25% more efficient than human recruiters
              </div>
            </div>
          </div>}
      </div>
      <div className="bg-gray-50 p-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Status: <span className="text-green-600">Active</span>
          </span>
          <button className="text-sm text-indigo-600 hover:text-indigo-800">
            View Details
          </button>
        </div>
      </div>
    </div>;
};
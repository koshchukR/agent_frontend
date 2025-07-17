import React from 'react';
import { Users, Search, BarChart2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
export const DashboardPreview = () => {
  return <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Recruiting Command Center
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get a complete view of your candidate pipeline with intelligent
            insights and analytics.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          <div className="bg-gray-800 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded bg-indigo-500 flex items-center justify-center mr-3">
                  <span className="font-bold">T</span>
                </div>
                <h3 className="font-medium">TalentMatch AI Dashboard</h3>
              </div>
              <div className="flex space-x-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-100">
            {[{
            label: 'Active Candidates',
            value: '143',
            icon: <Users size={20} className="text-indigo-600" />,
            change: '+12%'
          }, {
            label: 'Screenings Today',
            value: '28',
            icon: <Search size={20} className="text-indigo-600" />,
            change: '+5%'
          }, {
            label: 'Avg. Quality Score',
            value: '87/100',
            icon: <BarChart2 size={20} className="text-indigo-600" />,
            change: '+3%'
          }, {
            label: 'Time Saved',
            value: '128 hrs',
            icon: <Clock size={20} className="text-indigo-600" />,
            change: '+15%'
          }].map((stat, index) => <div key={index} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-2 text-sm text-green-600">
                  {stat.change} this week
                </div>
              </div>)}
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">
                Recent Candidate Screenings
              </h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-indigo-100 text-indigo-600 rounded-md">
                  All Roles
                </button>
                <button className="px-3 py-1 text-sm text-gray-600 rounded-md">
                  Engineering
                </button>
                <button className="px-3 py-1 text-sm text-gray-600 rounded-md">
                  Marketing
                </button>
                <button className="px-3 py-1 text-sm text-gray-600 rounded-md">
                  Sales
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AI Analysis
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[{
                  name: 'Sarah Johnson',
                  position: 'Senior Developer',
                  status: 'Completed',
                  score: 92,
                  analysis: 'Strong technical skills, excellent communication'
                }, {
                  name: 'Michael Chen',
                  position: 'Product Manager',
                  status: 'In Progress',
                  score: 78,
                  analysis: 'Good product knowledge, needs leadership assessment'
                }, {
                  name: 'Emily Rodriguez',
                  position: 'UX Designer',
                  status: 'Completed',
                  score: 85,
                  analysis: 'Creative portfolio, strong user-centered approach'
                }, {
                  name: 'David Kim',
                  position: 'Marketing Director',
                  status: 'Scheduled',
                  score: null,
                  analysis: 'Pending screening'
                }, {
                  name: 'Lisa Wang',
                  position: 'Sales Manager',
                  status: 'Flagged',
                  score: 45,
                  analysis: 'Experience mismatch, inconsistent responses'
                }].map((candidate, index) => <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {candidate.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {candidate.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              candidate{index + 1}@example.com
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {candidate.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${candidate.status === 'Completed' ? 'bg-green-100 text-green-800' : candidate.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : candidate.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {candidate.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {candidate.score ? <div className="flex items-center">
                            <span className={`font-medium ${candidate.score >= 80 ? 'text-green-600' : candidate.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {candidate.score}/100
                            </span>
                          </div> : <span>—</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                        {candidate.analysis}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {candidate.status === 'Completed' && <button className="text-indigo-600 hover:text-indigo-900">
                              View Report
                            </button>}
                          {candidate.status === 'In Progress' && <button className="text-blue-600 hover:text-blue-900">
                              Monitor
                            </button>}
                          {candidate.status === 'Scheduled' && <button className="text-yellow-600 hover:text-yellow-900">
                              Reschedule
                            </button>}
                          {candidate.status === 'Flagged' && <button className="text-red-600 hover:text-red-900">
                              Review
                            </button>}
                        </div>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Upcoming Screenings</h3>
              <button className="text-indigo-600 text-sm">View All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[{
              name: 'James Wilson',
              position: 'Frontend Developer',
              time: 'Today, 2:30 PM',
              status: 'Confirmed'
            }, {
              name: 'Sophia Garcia',
              position: 'Data Scientist',
              time: 'Today, 4:15 PM',
              status: 'Confirmed'
            }, {
              name: 'Robert Taylor',
              position: 'DevOps Engineer',
              time: 'Tomorrow, 10:00 AM',
              status: 'Pending'
            }].map((screening, index) => <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{screening.name}</h4>
                      <p className="text-sm text-gray-500">
                        {screening.position}
                      </p>
                    </div>
                    {screening.status === 'Confirmed' ? <CheckCircle size={16} className="text-green-500" /> : <AlertCircle size={16} className="text-yellow-500" />}
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>{screening.time}</p>
                    <p className="mt-1">{screening.status}</p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm">
                      Prepare
                    </button>
                    <button className="border border-gray-300 text-gray-600 px-3 py-1 rounded text-sm">
                      Reschedule
                    </button>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </section>;
};
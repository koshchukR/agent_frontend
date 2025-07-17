import React from 'react';
import { Link } from 'react-router-dom';
export const RecentCandidates = () => {
  const candidates = [{
    id: 1,
    name: 'Sarah Johnson',
    position: 'Senior Developer',
    status: 'Completed',
    score: 92,
    analysis: 'Strong technical skills, excellent communication'
  }, {
    id: 2,
    name: 'Michael Chen',
    position: 'Product Manager',
    status: 'In Progress',
    score: 78,
    analysis: 'Good product knowledge, needs leadership assessment'
  }, {
    id: 3,
    name: 'Emily Rodriguez',
    position: 'UX Designer',
    status: 'Completed',
    score: 85,
    analysis: 'Creative portfolio, strong user-centered approach'
  }, {
    id: 4,
    name: 'David Kim',
    position: 'Marketing Director',
    status: 'Scheduled',
    score: null,
    analysis: 'Pending screening'
  }];
  return <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Candidate
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {candidates.map(candidate => <tr key={candidate.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {candidate.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {candidate.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {candidate.position}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${candidate.status === 'Completed' ? 'bg-green-100 text-green-800' : candidate.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {candidate.status}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {candidate.score ? <div className="flex items-center">
                    <span className={`font-medium ${candidate.score >= 80 ? 'text-green-600' : candidate.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {candidate.score}/100
                    </span>
                  </div> : <span className="text-gray-500">—</span>}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                <Link to={`/dashboard/candidates/${candidate.id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                  Details
                </Link>
                {candidate.status === 'Completed' && <button className="text-indigo-600 hover:text-indigo-900">
                    Report
                  </button>}
                {candidate.status === 'In Progress' && <button className="text-blue-600 hover:text-blue-900">
                    Monitor
                  </button>}
                {candidate.status === 'Scheduled' && <button className="text-yellow-600 hover:text-yellow-900">
                    Reschedule
                  </button>}
              </td>
            </tr>)}
        </tbody>
      </table>
    </div>;
};
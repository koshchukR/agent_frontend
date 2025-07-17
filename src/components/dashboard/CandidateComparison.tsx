import React, { useState } from 'react';
import { UserIcon, BarChart2Icon, CheckCircleIcon, XCircleIcon, AlertCircleIcon, PlusIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
export const CandidateComparison = () => {
  const [compareBy, setCompareBy] = useState('overall');
  const candidates = [{
    id: 1,
    name: 'Sarah Johnson',
    position: 'Senior Developer',
    status: 'Completed',
    score: 92,
    scores: {
      overall: 92,
      technicalSkills: 95,
      communication: 88,
      problemSolving: 90,
      teamwork: 85,
      leadershipPotential: 82
    },
    strengths: ['Strong technical background', 'Excellent communication', 'Problem-solving abilities'],
    weaknesses: ['Limited enterprise experience'],
    botRisk: 'Low'
  }, {
    id: 2,
    name: 'Michael Chen',
    position: 'Senior Developer',
    status: 'Completed',
    score: 87,
    scores: {
      overall: 87,
      technicalSkills: 90,
      communication: 82,
      problemSolving: 88,
      teamwork: 89,
      leadershipPotential: 85
    },
    strengths: ['Deep technical expertise', 'Team collaboration', 'Leadership potential'],
    weaknesses: ['Communication could improve'],
    botRisk: 'Low'
  }, {
    id: 3,
    name: 'Emily Rodriguez',
    position: 'Senior Developer',
    status: 'Completed',
    score: 85,
    scores: {
      overall: 85,
      technicalSkills: 88,
      communication: 90,
      problemSolving: 84,
      teamwork: 87,
      leadershipPotential: 80
    },
    strengths: ['Excellent communication', 'Creative problem-solving', 'User-centered approach'],
    weaknesses: ['Some technical gaps', 'Less experience with microservices'],
    botRisk: 'Low'
  }];
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Candidate Comparison
        </h1>
        <p className="text-gray-600">
          Compare candidates side by side to make better hiring decisions.
        </p>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium">Senior Developer Position</h2>
              <p className="text-sm text-gray-500">
                Comparing top 3 candidates
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <PlusIcon size={16} className="mr-2" />
                Add Candidate
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Generate Report
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Compare by
            </h3>
            <div className="flex flex-wrap gap-2">
              {[{
              id: 'overall',
              label: 'Overall Score'
            }, {
              id: 'technicalSkills',
              label: 'Technical Skills'
            }, {
              id: 'communication',
              label: 'Communication'
            }, {
              id: 'problemSolving',
              label: 'Problem Solving'
            }, {
              id: 'teamwork',
              label: 'Teamwork'
            }, {
              id: 'leadershipPotential',
              label: 'Leadership'
            }].map(item => <button key={item.id} onClick={() => setCompareBy(item.id)} className={`px-3 py-1 rounded-full text-sm ${compareBy === item.id ? 'bg-indigo-100 text-indigo-800 font-medium' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {item.label}
                </button>)}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Candidate
                  </th>
                  {candidates.map(candidate => <th key={candidate.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex flex-col items-center">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mb-2">
                          {candidate.name.charAt(0)}
                        </div>
                        <span>{candidate.name}</span>
                        <div className="mt-1 flex items-center">
                          {candidate.botRisk === 'Low' ? <CheckCircleIcon size={14} className="text-green-500 mr-1" /> : candidate.botRisk === 'Medium' ? <AlertCircleIcon size={14} className="text-yellow-500 mr-1" /> : <XCircleIcon size={14} className="text-red-500 mr-1" />}
                          <span className="text-xs text-gray-500">
                            {candidate.botRisk} Risk
                          </span>
                        </div>
                      </div>
                    </th>)}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {compareBy === 'overall' ? 'Overall Score' : compareBy === 'technicalSkills' ? 'Technical Skills' : compareBy === 'communication' ? 'Communication' : compareBy === 'problemSolving' ? 'Problem Solving' : compareBy === 'teamwork' ? 'Teamwork' : 'Leadership Potential'}
                  </td>
                  {candidates.map(candidate => <td key={candidate.id} className="px-6 py-4">
                      <div className="flex flex-col items-center">
                        <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-medium mb-1">
                          {candidate.scores[compareBy]}
                        </div>
                        <div className="text-xs text-gray-500">out of 100</div>
                        {compareBy === 'overall' && candidate.id === 1 && <div className="mt-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Top Candidate
                          </div>}
                      </div>
                    </td>)}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    Scores Breakdown
                  </td>
                  {candidates.map(candidate => <td key={candidate.id} className="px-6 py-4">
                      <div className="space-y-3 w-full max-w-xs mx-auto">
                        {Object.entries(candidate.scores).filter(([key]) => key !== 'overall').map(([key, value]) => <div key={key}>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {value}/100
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div className={`h-1.5 rounded-full ${value >= 90 ? 'bg-green-600' : value >= 80 ? 'bg-indigo-600' : value >= 70 ? 'bg-yellow-600' : 'bg-red-600'}`} style={{
                          width: `${value}%`
                        }}></div>
                              </div>
                            </div>)}
                      </div>
                    </td>)}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    Key Strengths
                  </td>
                  {candidates.map(candidate => <td key={candidate.id} className="px-6 py-4">
                      <ul className="space-y-2 text-sm">
                        {candidate.strengths.map((strength, index) => <li key={index} className="flex items-start">
                            <CheckCircleIcon size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{strength}</span>
                          </li>)}
                      </ul>
                    </td>)}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    Areas for Improvement
                  </td>
                  {candidates.map(candidate => <td key={candidate.id} className="px-6 py-4">
                      <ul className="space-y-2 text-sm">
                        {candidate.weaknesses.map((weakness, index) => <li key={index} className="flex items-start">
                            <AlertCircleIcon size={16} className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{weakness}</span>
                          </li>)}
                      </ul>
                    </td>)}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    Actions
                  </td>
                  {candidates.map(candidate => <td key={candidate.id} className="px-6 py-4">
                      <div className="flex flex-col items-center space-y-2">
                        <button className="w-full inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                          View Profile
                        </button>
                        <button className="w-full inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                          <TrashIcon size={14} className="mr-1" />
                          Remove
                        </button>
                      </div>
                    </td>)}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-8 bg-indigo-50 rounded-lg p-6 border border-indigo-100">
            <h3 className="text-lg font-medium text-indigo-900 mb-3">
              AI Recommendation
            </h3>
            <p className="text-indigo-800 mb-4">
              Based on the comparison, <strong>Sarah Johnson</strong> is the
              strongest candidate for the Senior Developer position. She
              demonstrates exceptional technical skills and problem-solving
              abilities, which align well with the role requirements.
            </p>
            <p className="text-indigo-800 mb-4">
              <strong>Michael Chen</strong> shows strong leadership potential
              and teamwork skills, making him a good alternative if team
              management is a priority for this role.
            </p>
            <p className="text-indigo-800">
              <strong>Emily Rodriguez</strong> excels in communication and
              brings a user-centered approach that would be valuable for
              customer-facing projects, though she has some technical gaps
              compared to the other candidates.
            </p>
          </div>
        </div>
      </div>
    </div>;
};
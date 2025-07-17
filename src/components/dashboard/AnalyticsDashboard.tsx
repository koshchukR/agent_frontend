import React, { useState } from 'react';
import { BarChart2Icon, TrendingUpIcon, CalendarIcon, UsersIcon, ClockIcon, CheckCircleIcon, XCircleIcon, FilterIcon, DownloadIcon } from 'lucide-react';
export const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">
          Track your hiring performance and candidate metrics.
        </p>
      </div>
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-medium">Hiring Performance</h2>
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex rounded-md shadow-sm">
                {['week', 'month', 'quarter', 'year'].map(range => <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-2 text-sm font-medium ${range === timeRange ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} ${range === 'week' ? 'rounded-l-md' : range === 'year' ? 'rounded-r-md' : ''} border border-gray-300`}>
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>)}
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <FilterIcon size={16} className="mr-2" />
                Filter
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <DownloadIcon size={16} className="mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[{
            label: 'Total Screenings',
            value: '143',
            change: '+12%',
            trend: 'up',
            icon: <UsersIcon size={20} className="text-indigo-600" />
          }, {
            label: 'Completion Rate',
            value: '87%',
            change: '+3%',
            trend: 'up',
            icon: <CheckCircleIcon size={20} className="text-green-600" />
          }, {
            label: 'Avg. Time Saved',
            value: '4.2 hrs',
            change: '+15%',
            trend: 'up',
            icon: <ClockIcon size={20} className="text-indigo-600" />
          }, {
            label: 'Bot Detection',
            value: '8%',
            change: '-2%',
            trend: 'down',
            icon: <XCircleIcon size={20} className="text-red-600" />
          }].map((stat, index) => <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {stat.trend === 'up' ? <TrendingUpIcon size={16} className="text-green-500 mr-1" /> : <TrendingUpIcon size={16} className="text-red-500 mr-1 transform rotate-180" />}
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last {timeRange}
                  </span>
                </div>
              </div>)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium">Screening Completion Rate</h3>
                <button className="text-gray-500 hover:text-gray-700">
                  <div size={16} />
                </button>
              </div>
              <div className="h-64 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                          Completed
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-indigo-600">
                          87%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                      <div style={{
                      width: '87%'
                    }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"></div>
                    </div>
                  </div>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">
                          In Progress
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-yellow-600">
                          8%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200">
                      <div style={{
                      width: '8%'
                    }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-600"></div>
                    </div>
                  </div>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                          Abandoned
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-red-600">
                          5%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
                      <div style={{
                      width: '5%'
                    }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium">Screening Quality by Position</h3>
                <button className="text-gray-500 hover:text-gray-700">
                  <div size={16} />
                </button>
              </div>
              <div className="h-64 flex items-center justify-center">
                <div className="w-full max-w-md space-y-4">
                  {[{
                  position: 'Senior Developer',
                  score: 92
                }, {
                  position: 'Product Manager',
                  score: 85
                }, {
                  position: 'UX Designer',
                  score: 88
                }, {
                  position: 'Data Scientist',
                  score: 90
                }, {
                  position: 'Marketing Manager',
                  score: 83
                }].map((item, index) => <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          {item.position}
                        </span>
                        <span className="text-sm text-gray-500">
                          {item.score}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${item.score >= 90 ? 'bg-green-600' : item.score >= 80 ? 'bg-indigo-600' : item.score >= 70 ? 'bg-yellow-600' : 'bg-red-600'}`} style={{
                      width: `${item.score}%`
                    }}></div>
                      </div>
                    </div>)}
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium">Screening Volume by Day</h3>
                <button className="text-gray-500 hover:text-gray-700">
                  <div size={16} />
                </button>
              </div>
              <div className="h-64 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <div className="flex items-end h-48 w-full">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    const heights = [60, 85, 70, 90, 75, 30, 20];
                    return <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="w-8 bg-indigo-600 rounded-t" style={{
                        height: `${heights[index]}%`
                      }}></div>
                            <div className="text-xs text-gray-500 mt-2">
                              {day}
                            </div>
                          </div>;
                  })}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium">Time Saved by AI Screening</h3>
                <button className="text-gray-500 hover:text-gray-700">
                  <div size={16} />
                </button>
              </div>
              <div className="h-64 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-indigo-600">
                      128 hours
                    </div>
                    <div className="text-sm text-gray-500">
                      Total time saved this {timeRange}
                    </div>
                  </div>
                  <div className="space-y-4 mt-6">
                    {[{
                    label: 'Initial Screening',
                    hours: 48,
                    percentage: 37.5
                  }, {
                    label: 'Resume Analysis',
                    hours: 32,
                    percentage: 25
                  }, {
                    label: 'Candidate Research',
                    hours: 30,
                    percentage: 23.4
                  }, {
                    label: 'Scheduling',
                    hours: 18,
                    percentage: 14.1
                  }].map((item, index) => <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                          <span className="text-sm text-gray-500">
                            {item.hours} hrs ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-indigo-600 h-2 rounded-full" style={{
                        width: `${item.percentage}%`
                      }}></div>
                        </div>
                      </div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-medium">Top Performing Positions</h3>
              <button className="text-gray-500 hover:text-gray-700">
                <div size={16} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Screenings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completion Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg. Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Saved
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[{
                  position: 'Senior Developer',
                  screenings: 28,
                  completion: 94,
                  score: 92,
                  time: 32
                }, {
                  position: 'Product Manager',
                  screenings: 24,
                  completion: 88,
                  score: 85,
                  time: 28
                }, {
                  position: 'UX Designer',
                  screenings: 22,
                  completion: 91,
                  score: 88,
                  time: 26
                }, {
                  position: 'Data Scientist',
                  screenings: 20,
                  completion: 90,
                  score: 90,
                  time: 24
                }, {
                  position: 'Marketing Manager',
                  screenings: 18,
                  completion: 83,
                  score: 83,
                  time: 18
                }].map((row, index) => <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.screenings}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className={`font-medium ${row.completion >= 90 ? 'text-green-600' : row.completion >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {row.completion}%
                          </span>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${row.completion >= 90 ? 'bg-green-600' : row.completion >= 80 ? 'bg-yellow-600' : 'bg-red-600'}`} style={{
                          width: `${row.completion}%`
                        }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`font-medium ${row.score >= 90 ? 'text-green-600' : row.score >= 80 ? 'text-indigo-600' : row.score >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {row.score}/100
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.time} hours
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
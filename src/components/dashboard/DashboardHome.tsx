import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, BarChart2, Clock, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { AnalyticsCards } from './AnalyticsCards';
import { UpcomingScreenings } from './UpcomingScreenings';
import { RecentCandidates } from './RecentCandidates';
export const DashboardHome = () => {
  const analyticsData = [{
    label: 'Active Candidates',
    value: '143',
    change: '+12%',
    trend: 'up',
    icon: <Users size={20} className="text-indigo-600" />
  }, {
    label: 'Completed Screenings',
    value: '28',
    change: '+5%',
    trend: 'up',
    icon: <CheckCircle size={20} className="text-green-600" />
  }, {
    label: 'Avg. Quality Score',
    value: '87/100',
    change: '+3%',
    trend: 'up',
    icon: <BarChart2 size={20} className="text-indigo-600" />
  }, {
    label: 'Time Saved',
    value: '128 hrs',
    change: '+15%',
    trend: 'up',
    icon: <Clock size={20} className="text-indigo-600" />
  }];
  const upcomingScreenings = [{
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
  }, {
    name: 'Emily Johnson',
    position: 'Marketing Manager',
    time: 'Tomorrow, 1:30 PM',
    status: 'Confirmed'
  }];
  return <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, John. Here's what's happening with your candidates
          today.
        </p>
      </div>
      <AnalyticsCards data={analyticsData} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Candidate Pipeline</h2>
              <Link to="/dashboard/candidates" className="text-sm text-indigo-600 hover:text-indigo-800">
                View all candidates
              </Link>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                {[{
                label: 'New Applications',
                count: 37,
                icon: <Users size={18} />,
                color: 'bg-blue-100 text-blue-600'
              }, {
                label: 'Screening',
                count: 24,
                icon: <Calendar size={18} />,
                color: 'bg-yellow-100 text-yellow-600'
              }, {
                label: 'Interview',
                count: 12,
                icon: <Clock size={18} />,
                color: 'bg-purple-100 text-purple-600'
              }, {
                label: 'Offer',
                count: 5,
                icon: <CheckCircle size={18} />,
                color: 'bg-green-100 text-green-600'
              }].map((stage, index) => <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full ${stage.color} flex items-center justify-center mb-2`}>
                      {stage.icon}
                    </div>
                    <div className="text-2xl font-bold">{stage.count}</div>
                    <div className="text-xs text-gray-500 text-center">
                      {stage.label}
                    </div>
                  </div>)}
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium">
                    Hiring Pipeline Progress
                  </h3>
                  <div className="text-xs text-gray-500">
                    78 total candidates
                  </div>
                </div>
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="flex h-full">
                    <div className="bg-blue-500 h-full" style={{
                    width: '47%'
                  }}></div>
                    <div className="bg-yellow-500 h-full" style={{
                    width: '31%'
                  }}></div>
                    <div className="bg-purple-500 h-full" style={{
                    width: '15%'
                  }}></div>
                    <div className="bg-green-500 h-full" style={{
                    width: '7%'
                  }}></div>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <div>Application</div>
                  <div>Screening</div>
                  <div>Interview</div>
                  <div>Offer</div>
                  <div>Hired</div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-4">Recent Candidates</h3>
              <RecentCandidates />
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Upcoming Screenings</h2>
              <Link to="/dashboard/schedule" className="text-sm text-indigo-600 hover:text-indigo-800">
                View all
              </Link>
            </div>
            <UpcomingScreenings screenings={upcomingScreenings} />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Screening Quality</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-sm text-gray-500">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{
                  width: '92%'
                }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Bot Detection</span>
                  <span className="text-sm text-gray-500">8 flagged</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{
                  width: '8%'
                }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Data Quality</span>
                  <span className="text-sm text-gray-500">87%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{
                  width: '87%'
                }}></div>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-start p-3 bg-yellow-50 text-yellow-800 rounded-md">
                <AlertTriangle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Attention needed</p>
                  <p className="text-xs">
                    3 candidates have inconsistent responses
                  </p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-green-50 text-green-800 rounded-md">
                <TrendingUp size={16} className="mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Improving quality</p>
                  <p className="text-xs">
                    Screening quality up 5% from last week
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
import React, { useState } from 'react';
import { MessageSquare, Mail, Phone, Video, Calendar, Clock, BarChart2, Settings, Inbox, Send, Users, PlusCircle, Search, ChevronDown, Filter, MoreHorizontal } from 'lucide-react';
export const CommunicationCentral = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChannel, setSelectedChannel] = useState('all');
  return <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Communication Central
        </h1>
        <p className="text-gray-600">
          Manage all candidate communications across multiple channels
        </p>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap">
            <button onClick={() => setActiveTab('overview')} className={`px-6 py-4 text-sm font-medium ${activeTab === 'overview' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Overview
            </button>
            <button onClick={() => setActiveTab('inbox')} className={`px-6 py-4 text-sm font-medium ${activeTab === 'inbox' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Inbox
            </button>
            <button onClick={() => setActiveTab('campaigns')} className={`px-6 py-4 text-sm font-medium ${activeTab === 'campaigns' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Campaigns
            </button>
            <button onClick={() => setActiveTab('templates')} className={`px-6 py-4 text-sm font-medium ${activeTab === 'templates' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Templates
            </button>
            <button onClick={() => setActiveTab('analytics')} className={`px-6 py-4 text-sm font-medium ${activeTab === 'analytics' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Analytics
            </button>
            <button onClick={() => setActiveTab('settings')} className={`px-6 py-4 text-sm font-medium ${activeTab === 'settings' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Settings
            </button>
          </div>
        </div>
        {activeTab === 'overview' && <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <ChannelCard icon={<Mail size={24} className="text-indigo-600" />} title="Email" stats={{
            sent: 1243,
            opened: 876,
            rate: 70.5
          }} selected={selectedChannel === 'email'} onClick={() => setSelectedChannel('email')} />
              <ChannelCard icon={<MessageSquare size={24} className="text-indigo-600" />} title="SMS" stats={{
            sent: 758,
            opened: 721,
            rate: 95.1
          }} selected={selectedChannel === 'sms'} onClick={() => setSelectedChannel('sms')} />
              <ChannelCard icon={<Phone size={24} className="text-indigo-600" />} title="Voice" stats={{
            sent: 412,
            opened: 382,
            rate: 92.7
          }} selected={selectedChannel === 'voice'} onClick={() => setSelectedChannel('voice')} />
              <ChannelCard icon={<Video size={24} className="text-indigo-600" />} title="Video" stats={{
            sent: 128,
            opened: 98,
            rate: 76.6
          }} selected={selectedChannel === 'video'} onClick={() => setSelectedChannel('video')} />
            </div>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Recent Communications</h2>
                <div className="flex items-center">
                  <div className="relative mr-4">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search size={16} className="text-gray-400" />
                    </div>
                    <input type="text" className="pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 sm:text-sm" placeholder="Search communications..." />
                  </div>
                  <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Filter size={16} className="mr-1" />
                    Filter
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Channel
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject/Content
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[{
                  candidate: 'Sarah Johnson',
                  channel: 'email',
                  subject: 'Interview Confirmation',
                  status: 'Opened',
                  date: '2 hours ago'
                }, {
                  candidate: 'Michael Brown',
                  channel: 'sms',
                  subject: 'Reminder: Your interview is tomorrow',
                  status: 'Delivered',
                  date: '5 hours ago'
                }, {
                  candidate: 'Emily Davis',
                  channel: 'voice',
                  subject: 'Initial screening call',
                  status: 'Completed',
                  date: 'Yesterday'
                }, {
                  candidate: 'Robert Wilson',
                  channel: 'email',
                  subject: 'Follow-up on your application',
                  status: 'Not opened',
                  date: '2 days ago'
                }, {
                  candidate: 'Jennifer Lee',
                  channel: 'video',
                  subject: 'Technical interview',
                  status: 'Scheduled',
                  date: 'Tomorrow'
                }].map((comm, index) => <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                              {comm.candidate.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {comm.candidate}
                              </div>
                              <div className="text-sm text-gray-500">
                                Software Engineer
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {comm.channel === 'email' && <Mail size={16} className="text-indigo-600 mr-2" />}
                            {comm.channel === 'sms' && <MessageSquare size={16} className="text-green-600 mr-2" />}
                            {comm.channel === 'voice' && <Phone size={16} className="text-blue-600 mr-2" />}
                            {comm.channel === 'video' && <Video size={16} className="text-purple-600 mr-2" />}
                            <span className="capitalize">{comm.channel}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 truncate max-w-xs">
                            {comm.subject}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${comm.status === 'Opened' || comm.status === 'Completed' ? 'bg-green-100 text-green-800' : comm.status === 'Delivered' ? 'bg-blue-100 text-blue-800' : comm.status === 'Scheduled' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                            {comm.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {comm.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            View
                          </button>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">
                    Communication Analytics
                  </h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">
                      Communication trends chart will appear here
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="text-sm text-indigo-600 mb-1">
                        Response Rate
                      </div>
                      <div className="text-2xl font-bold">76%</div>
                      <div className="text-xs text-indigo-500">
                        +5% from last month
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-green-600 mb-1">
                        Avg. Response Time
                      </div>
                      <div className="text-2xl font-bold">4.2h</div>
                      <div className="text-xs text-green-500">
                        -1.5h from last month
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-sm text-purple-600 mb-1">
                        Engagement Score
                      </div>
                      <div className="text-2xl font-bold">8.4/10</div>
                      <div className="text-xs text-purple-500">
                        +0.6 from last month
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Upcoming Scheduled</h3>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800">
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {[{
                  candidate: 'Jennifer Lee',
                  type: 'Video Interview',
                  time: 'Today, 2:30 PM',
                  icon: <Video size={16} className="text-purple-600" />
                }, {
                  candidate: 'David Miller',
                  type: 'Phone Screening',
                  time: 'Today, 4:15 PM',
                  icon: <Phone size={16} className="text-blue-600" />
                }, {
                  candidate: 'Alex Thompson',
                  type: 'Email Follow-up',
                  time: 'Tomorrow, 10:00 AM',
                  icon: <Mail size={16} className="text-indigo-600" />
                }].map((event, index) => <div key={index} className="flex items-start p-3 border border-gray-200 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          {event.icon}
                        </div>
                        <div>
                          <p className="font-medium">{event.candidate}</p>
                          <p className="text-sm text-gray-500">{event.type}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {event.time}
                          </p>
                        </div>
                      </div>)}
                  </div>
                  <button className="w-full mt-4 py-2 border border-dashed border-gray-300 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center">
                    <PlusCircle size={16} className="mr-1" />
                    Schedule Communication
                  </button>
                </div>
              </div>
            </div>
          </div>}
        {activeTab === 'inbox' && <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-medium">Unified Inbox</h2>
                <p className="text-sm text-gray-500">
                  View and respond to all communications in one place
                </p>
              </div>
              <div className="flex items-center">
                <div className="relative mr-4">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input type="text" className="pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 sm:text-sm" placeholder="Search messages..." />
                </div>
                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Filter size={16} className="mr-1" />
                  Filter
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-medium">Conversations</h3>
                  <button className="text-indigo-600 hover:text-indigo-800">
                    <PlusCircle size={16} />
                  </button>
                </div>
                <div className="overflow-y-auto" style={{
              maxHeight: '600px'
            }}>
                  {[{
                name: 'Sarah Johnson',
                lastMessage: 'Thank you for the interview opportunity...',
                time: '10:30 AM',
                unread: true,
                channel: 'email'
              }, {
                name: 'Michael Brown',
                lastMessage: 'Yes, I can make it to the interview tomorrow at 2 PM.',
                time: 'Yesterday',
                unread: false,
                channel: 'sms'
              }, {
                name: 'Emily Davis',
                lastMessage: 'Call completed: 15 minutes',
                time: 'Yesterday',
                unread: false,
                channel: 'voice'
              }, {
                name: 'Robert Wilson',
                lastMessage: 'I have attached my updated resume as requested.',
                time: '2 days ago',
                unread: false,
                channel: 'email'
              }, {
                name: 'Jennifer Lee',
                lastMessage: 'Video interview scheduled for tomorrow at 3:30 PM.',
                time: '3 days ago',
                unread: false,
                channel: 'video'
              }].map((conversation, index) => <div key={index} className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${index === 0 ? 'bg-indigo-50' : ''}`}>
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium mr-3">
                          {conversation.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className={`text-sm font-medium ${conversation.unread ? 'text-indigo-600' : 'text-gray-900'}`}>
                              {conversation.name}
                            </p>
                            <div className="flex items-center">
                              {conversation.channel === 'email' && <Mail size={12} className="text-gray-400 mr-1" />}
                              {conversation.channel === 'sms' && <MessageSquare size={12} className="text-gray-400 mr-1" />}
                              {conversation.channel === 'voice' && <Phone size={12} className="text-gray-400 mr-1" />}
                              {conversation.channel === 'video' && <Video size={12} className="text-gray-400 mr-1" />}
                              <p className="text-xs text-gray-500">
                                {conversation.time}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unread && <span className="inline-block w-2 h-2 bg-indigo-600 rounded-full mt-1"></span>}
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>
              <div className="lg:col-span-2 border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium mr-3">
                      S
                    </div>
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Mail size={12} className="mr-1" />
                        <span>via Email • Software Engineer Candidate</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button className="text-gray-500 hover:text-gray-700">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-4 overflow-y-auto bg-gray-50" style={{
              height: '400px'
            }}>
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <div className="bg-indigo-100 text-indigo-800 p-3 rounded-lg max-w-md">
                        <p className="text-sm">
                          Hello Sarah, thank you for your application for the
                          Software Engineer position. We'd like to schedule an
                          initial screening call with you. Are you available
                          this week?
                        </p>
                        <p className="text-xs text-right mt-1 text-indigo-600">
                          10:15 AM • Sent by AI Recruiter
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="bg-white border border-gray-200 p-3 rounded-lg max-w-md">
                        <p className="text-sm">
                          Hi, thank you for reaching out! Yes, I'm available
                          this week. I could do Wednesday or Thursday afternoon,
                          if that works for you.
                        </p>
                        <p className="text-xs text-right mt-1 text-gray-500">
                          10:22 AM
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-indigo-100 text-indigo-800 p-3 rounded-lg max-w-md">
                        <p className="text-sm">
                          Great! Would Thursday at 2:30 PM (PST) work for you?
                          The call will be approximately 30 minutes.
                        </p>
                        <p className="text-xs text-right mt-1 text-indigo-600">
                          10:28 AM • Sent by AI Recruiter
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="bg-white border border-gray-200 p-3 rounded-lg max-w-md">
                        <p className="text-sm">
                          Thursday at 2:30 PM PST works perfectly for me. Should
                          I expect a phone call or will this be a video
                          interview?
                        </p>
                        <p className="text-xs text-right mt-1 text-gray-500">
                          10:30 AM
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-indigo-100 text-indigo-800 p-3 rounded-lg max-w-md">
                        <p className="text-sm">
                          This will be a phone call. I'll call you at the number
                          you provided in your application. I've sent a calendar
                          invitation to your email as well. Looking forward to
                          speaking with you!
                        </p>
                        <p className="text-xs text-right mt-1 text-indigo-600">
                          10:32 AM • Sent by AI Recruiter
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="bg-white border border-gray-200 p-3 rounded-lg max-w-md">
                        <p className="text-sm">
                          Thank you for the interview opportunity. I've
                          confirmed the calendar invitation and I'm looking
                          forward to our conversation on Thursday!
                        </p>
                        <p className="text-xs text-right mt-1 text-gray-500">
                          10:35 AM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-center mb-2">
                    <button className="text-gray-500 hover:text-gray-700 mr-2">
                      <PlusCircle size={18} />
                    </button>
                    <div className="flex-1">
                      <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none" placeholder="Type your message..." rows={2}></textarea>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-500 hover:text-indigo-600">
                        <Mail size={16} />
                      </button>
                      <button className="text-gray-500 hover:text-indigo-600">
                        <MessageSquare size={16} />
                      </button>
                      <button className="text-gray-500 hover:text-indigo-600">
                        <Phone size={16} />
                      </button>
                      <button className="text-gray-500 hover:text-indigo-600">
                        <Video size={16} />
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-500 hover:text-indigo-600">
                        <Calendar size={16} />
                      </button>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>}
      </div>
    </div>;
};
interface ChannelCardProps {
  icon: React.ReactNode;
  title: string;
  stats: {
    sent: number;
    opened: number;
    rate: number;
  };
  selected: boolean;
  onClick: () => void;
}
const ChannelCard = ({
  icon,
  title,
  stats,
  selected,
  onClick
}: ChannelCardProps) => {
  return <div className={`border rounded-lg p-5 cursor-pointer transition-colors ${selected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'}`} onClick={onClick}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
          {icon}
        </div>
        <h3 className="font-medium text-lg">{title}</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Sent</span>
          <span className="font-medium">{stats.sent.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Opened/Answered</span>
          <span className="font-medium">{stats.opened.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Response Rate</span>
          <span className="font-medium text-green-600">{stats.rate}%</span>
        </div>
      </div>
    </div>;
};
import React, { useState } from 'react';
import { CalendarIcon, ClockIcon, UserIcon, PlusIcon, CheckCircleIcon, XCircleIcon, AlertCircleIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
export const ScreeningScheduler = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNewScreeningModal, setShowNewScreeningModal] = useState(false);
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  const isToday = date => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };
  const isSelected = date => {
    return date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth() && date.getFullYear() === selectedDate.getFullYear();
  };
  const hasScreenings = date => {
    // Mock data - in real app, would check against actual screenings
    const day = date.getDate();
    return [2, 5, 10, 15, 20, 25].includes(day);
  };
  const renderCalendar = () => {
    const days = [];
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 border-t border-l border-gray-200"></div>);
    }
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const hasEvents = hasScreenings(date);
      const _isToday = isToday(date);
      const _isSelected = isSelected(date);
      days.push(<div key={day} onClick={() => setSelectedDate(date)} className={`h-32 border-t border-l border-gray-200 p-2 cursor-pointer transition-colors ${_isSelected ? 'bg-indigo-50' : _isToday ? 'bg-blue-50' : ''} hover:bg-gray-50`}>
          <div className="flex justify-between">
            <span className={`text-sm font-medium ${_isToday ? 'text-blue-600' : ''}`}>
              {day}
            </span>
            {hasEvents && <span className="w-2 h-2 rounded-full bg-indigo-500"></span>}
          </div>
          {day === 15 && <div className="mt-2 p-1 bg-indigo-100 text-indigo-800 text-xs rounded">
              3 Screenings
            </div>}
          {day === 20 && <div className="mt-2 p-1 bg-green-100 text-green-800 text-xs rounded">
              2 Screenings
            </div>}
        </div>);
    }
    return days;
  };
  const screenings = [{
    id: 1,
    candidate: 'James Wilson',
    position: 'Frontend Developer',
    time: '10:00 AM',
    duration: '30 min',
    status: 'Confirmed'
  }, {
    id: 2,
    candidate: 'Sophia Garcia',
    position: 'Data Scientist',
    time: '11:30 AM',
    duration: '30 min',
    status: 'Confirmed'
  }, {
    id: 3,
    candidate: 'Robert Taylor',
    position: 'DevOps Engineer',
    time: '2:00 PM',
    duration: '30 min',
    status: 'Pending'
  }];
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Screening Schedule</h1>
        <p className="text-gray-600">
          Manage and schedule candidate screenings.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100">
                  <ChevronLeftIcon size={20} />
                </button>
                <h2 className="text-lg font-medium mx-4">
                  {currentMonth.toLocaleString('default', {
                  month: 'long',
                  year: 'numeric'
                })}
                </h2>
                <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">
                  <ChevronRightIcon size={20} />
                </button>
              </div>
              <button onClick={() => setShowNewScreeningModal(true)} className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                <PlusIcon size={16} className="mr-1" />
                New Screening
              </button>
            </div>
            <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 border-b border-gray-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => <div key={index} className="py-2">
                    {day}
                  </div>)}
            </div>
            <div className="grid grid-cols-7">{renderCalendar()}</div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium">
                {selectedDate.toLocaleDateString('default', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
              </h3>
              <div className="text-sm text-gray-500">
                {screenings.length} screenings
              </div>
            </div>
            <div className="p-4 space-y-4">
              {screenings.length > 0 ? screenings.map(screening => <div key={screening.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{screening.candidate}</h4>
                        <p className="text-sm text-gray-500">
                          {screening.position}
                        </p>
                      </div>
                      {screening.status === 'Confirmed' ? <CheckCircleIcon size={16} className="text-green-500" /> : <AlertCircleIcon size={16} className="text-yellow-500" />}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <ClockIcon size={14} className="mr-1" />
                      <span>
                        {screening.time} ({screening.duration})
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-indigo-600 text-white px-3 py-1 rounded text-sm">
                        View Details
                      </button>
                      <button className="flex-1 border border-gray-300 text-gray-600 px-3 py-1 rounded text-sm">
                        {screening.status === 'Confirmed' ? 'Reschedule' : 'Confirm'}
                      </button>
                    </div>
                  </div>) : <div className="text-center py-8">
                  <CalendarIcon size={40} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">
                    No screenings scheduled for this day
                  </p>
                  <button onClick={() => setShowNewScreeningModal(true)} className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    <PlusIcon size={16} className="mr-1" />
                    Schedule Screening
                  </button>
                </div>}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium">Upcoming Screenings</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Tomorrow
                  </h4>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Alex Johnson</h4>
                        <p className="text-sm text-gray-500">UX Designer</p>
                      </div>
                      <CheckCircleIcon size={16} className="text-green-500" />
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <ClockIcon size={14} className="mr-1" />
                      <span>9:30 AM (30 min)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    This Week
                  </h4>
                  <div className="space-y-2">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Maria Sanchez</h4>
                          <p className="text-sm text-gray-500">
                            Product Manager
                          </p>
                        </div>
                        <CheckCircleIcon size={16} className="text-green-500" />
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <CalendarIcon size={14} className="mr-1" />
                        <span>Wed, Jun 22 • 11:00 AM</span>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">David Park</h4>
                          <p className="text-sm text-gray-500">
                            Backend Developer
                          </p>
                        </div>
                        <AlertCircleIcon size={16} className="text-yellow-500" />
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <CalendarIcon size={14} className="mr-1" />
                        <span>Fri, Jun 24 • 2:30 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showNewScreeningModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium">Schedule New Screening</h3>
              <button onClick={() => setShowNewScreeningModal(false)}>
                <XCircleIcon size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Candidate
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <UserIcon size={16} className="text-gray-400" />
                    </div>
                    <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Select or enter candidate name" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <select className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Full Stack Developer</option>
                    <option>UX Designer</option>
                    <option>Product Manager</option>
                    <option>Data Scientist</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <CalendarIcon size={16} className="text-gray-400" />
                      </div>
                      <input type="date" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <ClockIcon size={16} className="text-gray-400" />
                      </div>
                      <input type="time" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <select className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>45 minutes</option>
                    <option>60 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea rows={3} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Add any additional information..."></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button onClick={() => setShowNewScreeningModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={() => setShowNewScreeningModal(false)} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};
import React, { useState } from 'react';
import { MenuIcon, BellIcon, SearchIcon, ChevronDownIcon } from 'lucide-react';
interface DashboardHeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}
export const DashboardHeader = ({
  onMenuToggle,
  isSidebarOpen
}: DashboardHeaderProps) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  return <header className="bg-white border-b border-gray-200 h-16 flex items-center z-20">
      <div className="flex-1 flex items-center justify-between px-4">
        <div className="flex items-center">
          <button onClick={onMenuToggle} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <MenuIcon size={24} />
          </button>
          <div className="ml-6 relative w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-indigo-500 sm:text-sm" placeholder="Search candidates..." />
          </div>
        </div>
        <div className="flex items-center">
          <div className="relative">
            <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none relative">
              <BellIcon size={20} />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            {notificationsOpen && <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-2 px-4 border-b border-gray-200">
                  <h3 className="text-sm font-medium">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {[{
                title: 'New candidate applied',
                time: '2 minutes ago'
              }, {
                title: 'Screening completed',
                time: '1 hour ago'
              }, {
                title: 'Interview scheduled',
                time: '3 hours ago'
              }, {
                title: 'Candidate comparison ready',
                time: 'Yesterday'
              }].map((notification, index) => <div key={index} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {notification.time}
                      </p>
                    </div>)}
                </div>
                <div className="py-2 px-4 border-t border-gray-200">
                  <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                    View all notifications
                  </a>
                </div>
              </div>}
          </div>
          <div className="ml-4 relative">
            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center focus:outline-none">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                JD
              </div>
              <div className="ml-2 hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-gray-700">
                  John Doe
                </span>
                <span className="text-xs text-gray-500">HR Manager</span>
              </div>
              <ChevronDownIcon size={16} className="ml-1 text-gray-500" />
            </button>
            {profileOpen && <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Your Profile
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Account Settings
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Team Management
                  </a>
                  <div className="border-t border-gray-100"></div>
                  <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Sign out
                  </a>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </header>;
};
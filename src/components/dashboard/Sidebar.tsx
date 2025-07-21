import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboardIcon, UsersIcon, BarChart2Icon, ScaleIcon, CalendarIcon, SettingsIcon, HelpCircleIcon, LogOutIcon, BotIcon, MessageSquareIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
interface SidebarProps {
  isOpen: boolean;
}
export const Sidebar = ({
  isOpen
}: SidebarProps) => {
  const location = useLocation();
  const { signOut } = useAuth();
  const navItems = [{
    label: 'Dashboard',
    icon: <LayoutDashboardIcon size={20} />,
    path: '/dashboard',
    active: location.pathname === '/dashboard' || location.pathname === '/dashboard/'
  }, {
    label: 'Candidates',
    icon: <UsersIcon size={20} />,
    path: '/dashboard/candidates',
    active: location.pathname.includes('/dashboard/candidates')
  }, {
    label: 'Compare',
    icon: <ScaleIcon size={20} />,
    path: '/dashboard/compare',
    active: location.pathname === '/dashboard/compare'
  }, {
    label: 'Schedule',
    icon: <CalendarIcon size={20} />,
    path: '/dashboard/schedule',
    active: location.pathname === '/dashboard/schedule'
  }, {
    label: 'Analytics',
    icon: <BarChart2Icon size={20} />,
    path: '/dashboard/analytics',
    active: location.pathname === '/dashboard/analytics'
  }, {
    label: 'AI Recruiters',
    icon: <BotIcon size={20} />,
    path: '/dashboard/ai-recruiters',
    active: location.pathname === '/dashboard/ai-recruiters'
  }, {
    label: 'Communication',
    icon: <MessageSquareIcon size={20} />,
    path: '/dashboard/communication',
    active: location.pathname === '/dashboard/communication'
  }];
  const secondaryNavItems = [{
    label: 'Settings',
    icon: <SettingsIcon size={20} />,
    path: '/dashboard/settings',
    active: location.pathname === '/dashboard/settings'
  }, {
    label: 'Help & Support',
    icon: <HelpCircleIcon size={20} />,
    path: '#'
  }];
  return <aside className={`bg-indigo-800 text-white ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out flex flex-col z-30`}>
      <div className="p-4 flex items-center justify-center h-16 border-b border-indigo-700">
        {isOpen ? <div className="flex items-center">
            <img src="/shutterstock_2654438429.jpg" alt="Screen IQ Logo" className="h-8 w-8 mr-2" />
            <div className="text-xl font-bold">Screen IQ</div>
          </div> : <div className="w-8 h-8 rounded bg-indigo-500 flex items-center justify-center">
            <span className="font-bold">S</span>
          </div>}
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {navItems.map((item, index) => <Link key={index} to={item.path} className={`flex items-center px-4 py-3 rounded-md transition-colors ${item.active ? 'bg-indigo-900 text-white' : 'text-indigo-100 hover:bg-indigo-700'} ${!isOpen && 'justify-center'}`}>
              <div className="flex items-center">
                {item.icon}
                {isOpen && <span className="ml-3">{item.label}</span>}
              </div>
              {isOpen && item.active && <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>}
            </Link>)}
        </nav>
        <div className="mt-10">
          <div className={`px-4 ${isOpen ? 'block' : 'hidden'}`}>
            <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              Support
            </div>
          </div>
          <nav className="mt-2 px-2 space-y-1">
            {secondaryNavItems.map((item, index) => <Link key={index} to={item.path} className={`flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-700 rounded-md transition-colors ${item.active ? 'bg-indigo-900 text-white' : ''} ${!isOpen && 'justify-center'}`}>
                {item.icon}
                {isOpen && <span className="ml-3">{item.label}</span>}
              </Link>)}
          </nav>
        </div>
      </div>
      <div className="p-4 border-t border-indigo-700">
        <button onClick={signOut} className={`flex items-center text-indigo-100 hover:text-white transition-colors ${!isOpen && 'justify-center w-full'}`}>
          <LogOutIcon size={20} />
          {isOpen && <span className="ml-3">Log Out</span>}
        </button>
      </div>
    </aside>;
};
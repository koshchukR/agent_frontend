import React, { useState } from 'react';
import { Database, Phone, Calendar, Mail, Linkedin, MessageSquare, Video, CheckCircle, AlertCircle, PlusCircle } from 'lucide-react';
export const IntegrationsSection = () => {
  const [integrations, setIntegrations] = useState({
    ams: {
      connected: false,
      status: 'Not connected'
    },
    twilio: {
      connected: true,
      status: 'Connected'
    },
    googleCalendar: {
      connected: true,
      status: 'Connected'
    },
    gmail: {
      connected: true,
      status: 'Connected'
    },
    linkedin: {
      connected: false,
      status: 'Not connected'
    },
    slack: {
      connected: false,
      status: 'Not connected'
    },
    teams: {
      connected: false,
      status: 'Not connected'
    },
    zoom: {
      connected: true,
      status: 'Connected'
    }
  });
  const handleConnect = (integration: string) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: {
        connected: true,
        status: 'Connected'
      }
    }));
  };
  const handleDisconnect = (integration: string) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: {
        connected: false,
        status: 'Not connected'
      }
    }));
  };
  return <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Integrations</h2>
        <p className="text-gray-600">
          Connect TalentMatch AI with your existing tools and platforms
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <IntegrationCard title="Applicant Management System" description="Connect to your AMS to sync candidates and job postings" icon={<Database size={24} className="text-indigo-600" />} connected={integrations.ams.connected} status={integrations.ams.status} onConnect={() => handleConnect('ams')} onDisconnect={() => handleDisconnect('ams')} options={[{
        label: 'Workday',
        value: 'workday'
      }, {
        label: 'Greenhouse',
        value: 'greenhouse'
      }, {
        label: 'Lever',
        value: 'lever'
      }, {
        label: 'Jobvite',
        value: 'jobvite'
      }, {
        label: 'iCIMS',
        value: 'icims'
      }, {
        label: 'SmartRecruiters',
        value: 'smartrecruiters'
      }, {
        label: 'Taleo',
        value: 'taleo'
      }, {
        label: 'BambooHR',
        value: 'bamboohr'
      }]} />
        <IntegrationCard title="Twilio" description="Integrate phone and SMS capabilities for candidate communication" icon={<Phone size={24} className="text-indigo-600" />} connected={integrations.twilio.connected} status={integrations.twilio.status} onConnect={() => handleConnect('twilio')} onDisconnect={() => handleDisconnect('twilio')} />
        <IntegrationCard title="Google Calendar" description="Sync interview schedules with your Google Calendar" icon={<Calendar size={24} className="text-indigo-600" />} connected={integrations.googleCalendar.connected} status={integrations.googleCalendar.status} onConnect={() => handleConnect('googleCalendar')} onDisconnect={() => handleDisconnect('googleCalendar')} />
        <IntegrationCard title="Gmail" description="Send and receive emails directly through TalentMatch AI" icon={<Mail size={24} className="text-indigo-600" />} connected={integrations.gmail.connected} status={integrations.gmail.status} onConnect={() => handleConnect('gmail')} onDisconnect={() => handleDisconnect('gmail')} />
        <IntegrationCard title="LinkedIn" description="Connect to LinkedIn for candidate sourcing and verification" icon={<Linkedin size={24} className="text-indigo-600" />} connected={integrations.linkedin.connected} status={integrations.linkedin.status} onConnect={() => handleConnect('linkedin')} onDisconnect={() => handleDisconnect('linkedin')} />
        <IntegrationCard title="Slack" description="Receive notifications and communicate with your team via Slack" icon={<MessageSquare size={24} className="text-indigo-600" />} connected={integrations.slack.connected} status={integrations.slack.status} onConnect={() => handleConnect('slack')} onDisconnect={() => handleDisconnect('slack')} />
        <IntegrationCard title="Microsoft Teams" description="Integrate with Teams for team collaboration and notifications" icon={<MessageSquare size={24} className="text-indigo-600" />} connected={integrations.teams.connected} status={integrations.teams.status} onConnect={() => handleConnect('teams')} onDisconnect={() => handleDisconnect('teams')} />
        <IntegrationCard title="Zoom" description="Schedule and manage video interviews through Zoom" icon={<Video size={24} className="text-indigo-600" />} connected={integrations.zoom.connected} status={integrations.zoom.status} onConnect={() => handleConnect('zoom')} onDisconnect={() => handleDisconnect('zoom')} />
        <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
            <PlusCircle size={24} className="text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium mb-1">Add Custom Integration</h3>
          <p className="text-sm text-gray-500 mb-4">
            Connect to other tools using our API
          </p>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Request Integration
          </button>
        </div>
      </div>
    </div>;
};
interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  status: string;
  onConnect: () => void;
  onDisconnect: () => void;
  options?: {
    label: string;
    value: string;
  }[];
}
const IntegrationCard = ({
  title,
  description,
  icon,
  connected,
  status,
  onConnect,
  onDisconnect,
  options
}: IntegrationCardProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  return <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              {icon}
            </div>
            <div>
              <h3 className="font-medium text-lg">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>
          <div className="flex items-center">
            {connected ? <span className="flex items-center text-green-600 text-sm">
                <CheckCircle size={16} className="mr-1" />
                Connected
              </span> : <span className="flex items-center text-gray-500 text-sm">
                <AlertCircle size={16} className="mr-1" />
                Not connected
              </span>}
          </div>
        </div>
        {showSettings && <div className="mt-4 pt-4 border-t border-gray-100">
            {options && <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Provider
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2" value={selectedOption} onChange={e => setSelectedOption(e.target.value)}>
                  <option value="">Select a provider</option>
                  {options.map(option => <option key={option.value} value={option.value}>
                      {option.label}
                    </option>)}
                </select>
              </div>}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Enter API key" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Secret
                </label>
                <input type="password" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Enter API secret" />
              </div>
            </div>
            {connected && <div className="mt-4 bg-yellow-50 p-3 rounded-md text-yellow-800 text-sm">
                <strong>Warning:</strong> Disconnecting will remove all synced
                data and settings.
              </div>}
          </div>}
      </div>
      <div className="bg-gray-50 px-5 py-3 flex justify-between">
        <button className="text-sm text-gray-600 hover:text-gray-900" onClick={() => setShowSettings(!showSettings)}>
          {showSettings ? 'Hide Settings' : 'Show Settings'}
        </button>
        {connected ? <button className="text-sm text-red-600 hover:text-red-800" onClick={onDisconnect}>
            Disconnect
          </button> : <button className="text-sm text-indigo-600 hover:text-indigo-800" onClick={onConnect}>
            Connect
          </button>}
      </div>
    </div>;
};
import React from 'react';
import { ShieldIcon, KeyIcon, SmartphoneIcon, ActivityIcon } from 'lucide-react';
export const SecuritySettings = () => {
  return <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Security Settings</h2>
        <p className="text-gray-600">
          Manage your account security and authentication methods
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input type="password" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Enter current password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input type="password" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Enter new password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input type="password" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Confirm new password" />
              </div>
            </div>
            <div className="mt-4 bg-yellow-50 p-3 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Password requirements:</strong> Minimum 8 characters
                with at least one uppercase letter, one lowercase letter, one
                number, and one special character.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Update Password
              </button>
            </div>
          </div>
          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">
              Two-Factor Authentication
            </h3>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="space-y-4">
              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                  <SmartphoneIcon size={20} className="text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium">Authenticator App</p>
                  <p className="text-sm text-gray-500">
                    Use an authenticator app to generate verification codes
                  </p>
                </div>
                <button className="ml-auto text-sm text-indigo-600 hover:text-indigo-800">
                  Setup
                </button>
              </div>
              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                  <SmartphoneIcon size={20} className="text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium">SMS Authentication</p>
                  <p className="text-sm text-gray-500">
                    Receive verification codes via SMS
                  </p>
                </div>
                <button className="ml-auto text-sm text-indigo-600 hover:text-indigo-800">
                  Setup
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Security Status</h3>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Security</span>
                <span className="text-sm text-yellow-600">Medium</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{
                width: '60%'
              }}></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <ShieldIcon size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Strong Password</p>
                  <p className="text-xs text-gray-500">
                    Last changed 30 days ago
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <KeyIcon size={16} className="text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Not enabled</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <ActivityIcon size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Recent Activity</p>
                  <p className="text-xs text-gray-500">
                    No suspicious activity
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Login Sessions</h3>
            <div className="space-y-4">
              <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-green-800">
                      Current Session
                    </p>
                    <p className="text-xs text-green-700">Chrome on Windows</p>
                  </div>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  IP: 192.168.1.1 • Started: Today, 9:45 AM
                </p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Safari on macOS</p>
                    <p className="text-xs text-gray-500">
                      Last active: Yesterday
                    </p>
                  </div>
                  <button className="text-xs text-red-600 hover:text-red-800">
                    Logout
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  IP: 192.168.1.2 • Started: Yesterday, 3:20 PM
                </p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Mobile App on iPhone</p>
                    <p className="text-xs text-gray-500">
                      Last active: 3 days ago
                    </p>
                  </div>
                  <button className="text-xs text-red-600 hover:text-red-800">
                    Logout
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  IP: 192.168.1.3 • Started: 3 days ago, 10:15 AM
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="text-sm text-red-600 hover:text-red-800">
                Logout of all other sessions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
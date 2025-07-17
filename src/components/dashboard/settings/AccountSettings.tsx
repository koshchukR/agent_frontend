import React from 'react';
import { UserIcon, CameraIcon } from 'lucide-react';
export const AccountSettings = () => {
  return <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Account Settings</h2>
        <p className="text-gray-600">
          Manage your personal information and account preferences
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" defaultValue="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" defaultValue="Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input type="email" className="w-full border border-gray-300 rounded-md px-3 py-2" defaultValue="john.doe@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input type="tel" className="w-full border border-gray-300 rounded-md px-3 py-2" defaultValue="+1 (555) 123-4567" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" defaultValue="HR Manager" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" defaultValue="Acme Corporation" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>Technology</option>
                  <option>Healthcare</option>
                  <option>Finance</option>
                  <option>Manufacturing</option>
                  <option>Retail</option>
                  <option>Education</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Website
                </label>
                <input type="url" className="w-full border border-gray-300 rounded-md px-3 py-2" defaultValue="https://www.acmecorp.com" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Profile Picture</h3>
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="h-24 w-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl">
                  JD
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-300">
                  <CameraIcon size={16} className="text-gray-600" />
                </button>
              </div>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">
                Upload New Picture
              </button>
              <p className="text-xs text-gray-500 mt-1">
                JPG, GIF or PNG. Max size 2MB.
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Account Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-gray-500">
                      Select your preferred language
                    </p>
                  </div>
                  <select className="border border-gray-300 rounded-md px-3 py-2">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Time Zone</p>
                    <p className="text-sm text-gray-500">
                      Set your local time zone
                    </p>
                  </div>
                  <select className="border border-gray-300 rounded-md px-3 py-2">
                    <option>Pacific Time (PT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Central Time (CT)</option>
                    <option>Eastern Time (ET)</option>
                    <option>UTC</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
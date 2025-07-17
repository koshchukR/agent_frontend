import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { IntegrationsSection } from './settings/IntegrationsSection';
import { AccountSettings } from './settings/AccountSettings';
import { TeamSettings } from './settings/TeamSettings';
import { NotificationSettings } from './settings/NotificationSettings';
import { SecuritySettings } from './settings/SecuritySettings';
import { BillingSettings } from './settings/BillingSettings';
export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  return <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and configure system preferences
        </p>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <Tabs defaultValue="account" onValueChange={setActiveTab} value={activeTab}>
            <div className="px-6 pt-4">
              <TabsList className="flex space-x-1">
                <TabsTrigger value="account" className={`px-4 py-2 rounded-t-lg ${activeTab === 'account' ? 'bg-white border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                  Account
                </TabsTrigger>
                <TabsTrigger value="integrations" className={`px-4 py-2 rounded-t-lg ${activeTab === 'integrations' ? 'bg-white border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                  Integrations
                </TabsTrigger>
                <TabsTrigger value="team" className={`px-4 py-2 rounded-t-lg ${activeTab === 'team' ? 'bg-white border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                  Team
                </TabsTrigger>
                <TabsTrigger value="notifications" className={`px-4 py-2 rounded-t-lg ${activeTab === 'notifications' ? 'bg-white border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className={`px-4 py-2 rounded-t-lg ${activeTab === 'security' ? 'bg-white border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                  Security
                </TabsTrigger>
                <TabsTrigger value="billing" className={`px-4 py-2 rounded-t-lg ${activeTab === 'billing' ? 'bg-white border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                  Billing
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="p-6">
              <TabsContent value="account">
                <AccountSettings />
              </TabsContent>
              <TabsContent value="integrations">
                <IntegrationsSection />
              </TabsContent>
              <TabsContent value="team">
                <TeamSettings />
              </TabsContent>
              <TabsContent value="notifications">
                <NotificationSettings />
              </TabsContent>
              <TabsContent value="security">
                <SecuritySettings />
              </TabsContent>
              <TabsContent value="billing">
                <BillingSettings />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>;
};
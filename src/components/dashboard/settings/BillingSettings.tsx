import React from 'react';
import { CreditCardIcon, CheckIcon } from 'lucide-react';
export const BillingSettings = () => {
  return <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Billing & Subscription</h2>
        <p className="text-gray-600">
          Manage your subscription plan and payment methods
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">Current Plan</h3>
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                Enterprise Plan
              </span>
              <p className="mt-1 text-gray-600">Billed annually</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              $999
              <span className="text-lg font-normal text-gray-500">/month</span>
            </p>
            <p className="text-sm text-gray-500">
              Next billing on Oct 15, 2023
            </p>
          </div>
        </div>
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h4 className="font-medium mb-3">Plan Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center">
              <CheckIcon size={16} className="text-green-500 mr-2" />
              <span className="text-sm">Unlimited AI Recruiters</span>
            </div>
            <div className="flex items-center">
              <CheckIcon size={16} className="text-green-500 mr-2" />
              <span className="text-sm">Unlimited Screenings</span>
            </div>
            <div className="flex items-center">
              <CheckIcon size={16} className="text-green-500 mr-2" />
              <span className="text-sm">Advanced Analytics</span>
            </div>
            <div className="flex items-center">
              <CheckIcon size={16} className="text-green-500 mr-2" />
              <span className="text-sm">Custom Integrations</span>
            </div>
            <div className="flex items-center">
              <CheckIcon size={16} className="text-green-500 mr-2" />
              <span className="text-sm">Dedicated Support</span>
            </div>
            <div className="flex items-center">
              <CheckIcon size={16} className="text-green-500 mr-2" />
              <span className="text-sm">Advanced Security</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Change Plan
          </button>
          <button className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50">
            Cancel Subscription
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center mr-3">
                    <CreditCardIcon size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-gray-500">Expires 09/2025</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mr-2">
                    Default
                  </span>
                  <button className="text-gray-500 hover:text-gray-700 text-sm">
                    Edit
                  </button>
                </div>
              </div>
            </div>
            <button className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors">
              + Add Payment Method
            </button>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Billing History</h3>
          <div className="space-y-3">
            {[{
            date: 'Sep 15, 2023',
            amount: '$999.00',
            status: 'Paid'
          }, {
            date: 'Aug 15, 2023',
            amount: '$999.00',
            status: 'Paid'
          }, {
            date: 'Jul 15, 2023',
            amount: '$999.00',
            status: 'Paid'
          }, {
            date: 'Jun 15, 2023',
            amount: '$999.00',
            status: 'Paid'
          }].map((invoice, index) => <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium">{invoice.date}</p>
                  <p className="text-sm text-gray-500">
                    Invoice #INV-{2023090 + index}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{invoice.amount}</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {invoice.status}
                  </span>
                </div>
              </div>)}
          </div>
          <div className="mt-4 flex justify-end">
            <button className="text-sm text-indigo-600 hover:text-indigo-800">
              View All Invoices
            </button>
          </div>
        </div>
      </div>
    </div>;
};
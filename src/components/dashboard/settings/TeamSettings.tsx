import React from 'react';
import { PlusIcon, MoreHorizontalIcon } from 'lucide-react';
export const TeamSettings = () => {
  const teamMembers = [{
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    avatar: 'JD'
  }, {
    id: 2,
    name: 'Sarah Smith',
    email: 'sarah.smith@example.com',
    role: 'Recruiter',
    avatar: 'SS'
  }, {
    id: 3,
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    role: 'Hiring Manager',
    avatar: 'MJ'
  }, {
    id: 4,
    name: 'Emily Williams',
    email: 'emily.williams@example.com',
    role: 'Recruiter',
    avatar: 'EW'
  }];
  return <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Team Management</h2>
        <p className="text-gray-600">
          Manage your team members and their access permissions
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <div>
            <h3 className="text-lg font-medium">Team Members</h3>
            <p className="text-sm text-gray-500">
              {teamMembers.length} members in your team
            </p>
          </div>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            <PlusIcon size={16} className="mr-1" />
            Add Member
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamMembers.map(member => <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                        {member.avatar}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{member.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                      <option selected={member.role === 'Admin'}>Admin</option>
                      <option selected={member.role === 'Recruiter'}>
                        Recruiter
                      </option>
                      <option selected={member.role === 'Hiring Manager'}>
                        Hiring Manager
                      </option>
                      <option selected={member.role === 'Viewer'}>
                        Viewer
                      </option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-500 hover:text-gray-700">
                      <MoreHorizontalIcon size={16} />
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Team Permissions</h3>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Admin</h4>
                <p className="text-sm text-gray-500">
                  Full access to all features and settings
                </p>
              </div>
              <div className="text-xs text-gray-500">1 member</div>
            </div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Recruiter</h4>
                <p className="text-sm text-gray-500">
                  Can manage candidates, conduct screenings, and view analytics
                </p>
              </div>
              <div className="text-xs text-gray-500">2 members</div>
            </div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Hiring Manager</h4>
                <p className="text-sm text-gray-500">
                  Can review candidates and provide feedback
                </p>
              </div>
              <div className="text-xs text-gray-500">1 member</div>
            </div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Viewer</h4>
                <p className="text-sm text-gray-500">
                  Read-only access to candidates and analytics
                </p>
              </div>
              <div className="text-xs text-gray-500">0 members</div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
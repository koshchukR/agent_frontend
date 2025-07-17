import React from 'react';
import { PlusIcon } from 'lucide-react';
interface AddAIRecruiterCardProps {
  onAdd: () => void;
}
export const AddAIRecruiterCard = ({
  onAdd
}: AddAIRecruiterCardProps) => {
  return <div onClick={onAdd} className="bg-white rounded-lg shadow-sm border border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center h-full min-h-[250px] cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
      <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
        <PlusIcon size={24} className="text-indigo-600" />
      </div>
      <h3 className="font-medium text-lg text-gray-800">
        Add New AI Recruiter
      </h3>
      <p className="text-sm text-gray-500 mt-2">
        Create a custom AI recruiter tailored to your specific hiring needs
      </p>
    </div>;
};
import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
interface UpcomingScreeningsProps {
  screenings: {
    name: string;
    position: string;
    time: string;
    status: string;
  }[];
}
export const UpcomingScreenings = ({
  screenings
}: UpcomingScreeningsProps) => {
  return <div className="space-y-4">
      {screenings.map((screening, index) => <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium">{screening.name}</h4>
              <p className="text-sm text-gray-500">{screening.position}</p>
            </div>
            {screening.status === 'Confirmed' ? <CheckCircle size={16} className="text-green-500" /> : <AlertCircle size={16} className="text-yellow-500" />}
          </div>
          <div className="text-sm text-gray-600">
            <p>{screening.time}</p>
            <p className="mt-1">{screening.status}</p>
          </div>
          <div className="mt-3 flex space-x-2">
            <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm">
              Prepare
            </button>
            <button className="border border-gray-300 text-gray-600 px-3 py-1 rounded text-sm">
              {screening.status === 'Confirmed' ? 'Reschedule' : 'Confirm'}
            </button>
          </div>
        </div>)}
    </div>;
};
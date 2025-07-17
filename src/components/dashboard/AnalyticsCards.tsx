import React from 'react';
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
interface AnalyticsCardProps {
  data: {
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'neutral';
    icon: React.ReactNode;
  }[];
}
export const AnalyticsCards = ({
  data
}: AnalyticsCardProps) => {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((item, index) => <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-2xl font-bold mt-1">{item.value}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
              {item.icon}
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {item.trend === 'up' ? <TrendingUpIcon size={16} className="text-green-500 mr-1" /> : item.trend === 'down' ? <TrendingDownIcon size={16} className="text-red-500 mr-1" /> : null}
            <span className={`text-sm ${item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
              {item.change} from last week
            </span>
          </div>
        </div>)}
    </div>;
};
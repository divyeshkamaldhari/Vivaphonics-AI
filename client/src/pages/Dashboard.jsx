import React from 'react';
import {
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: 'Total Students',
    value: '245',
    icon: UserGroupIcon,
    change: '+12%',
    changeType: 'positive',
  },
  {
    name: 'Active Sessions',
    value: '45',
    icon: CalendarIcon,
    change: '+8%',
    changeType: 'positive',
  },
  {
    name: 'Total Revenue',
    value: '$12,345',
    icon: CurrencyDollarIcon,
    change: '+15%',
    changeType: 'positive',
  },
  {
    name: 'Completion Rate',
    value: '92%',
    icon: ChartBarIcon,
    change: '+5%',
    changeType: 'positive',
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon
                  className="h-6 w-6 text-primary-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
                <p
                  className={`text-sm ${
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">Recent Sessions</h3>
          {/* Add session list component here */}
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">Upcoming Sessions</h3>
          {/* Add upcoming sessions component here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
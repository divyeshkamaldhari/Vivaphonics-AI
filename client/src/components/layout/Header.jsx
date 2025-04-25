import React from 'react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            type="button"
            className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <UserCircleIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">John Doe</p>
              <p className="text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
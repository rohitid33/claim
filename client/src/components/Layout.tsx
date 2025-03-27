import React from 'react';
import { Outlet } from 'react-router-dom';
import { NotificationBell } from './NotificationBell';
import { useNotifications } from '../hooks/use-notifications';

export function Layout() {
  // Initialize notifications
  useNotifications();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Your App</h1>
          <div className="flex items-center space-x-4">
            <NotificationBell />
            {/* Other header items */}
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
} 
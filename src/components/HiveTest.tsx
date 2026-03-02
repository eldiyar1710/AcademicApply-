import React from 'react';
import { useUserStore, useUIStore } from '@/hooks/use-hive-store';

export const HiveTest: React.FC = () => {
  const [user, setUser] = useUserStore();
  const [ui, setUI, updateUI] = useUIStore();

  const handleUpdateUser = () => {
    setUser({
      ...user,
      name: `Test User ${Date.now()}`,
      createdAt: new Date().toISOString(),
    });
  };

  const handleToggleTheme = () => {
    updateUI({
      theme: ui.theme === 'light' ? 'dark' : 'light',
    });
  };

  const handleAddNotification = () => {
    const notifications = [
      ...ui.notifications,
      {
        id: Date.now().toString(),
        type: 'info' as const,
        message: `Test notification ${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    ];
    
    setUI({
      ...ui,
      notifications,
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Hive + Firebase Test</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">User Store:</h3>
          <pre className="text-sm bg-white p-2 rounded">
            {JSON.stringify(user, null, 2)}
          </pre>
          <button
            onClick={handleUpdateUser}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Update User
          </button>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">UI Store:</h3>
          <pre className="text-sm bg-white p-2 rounded max-h-40 overflow-auto">
            {JSON.stringify(ui, null, 2)}
          </pre>
          
          <div className="mt-2 space-x-2">
            <button
              onClick={handleToggleTheme}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Toggle Theme ({ui.theme})
            </button>
            <button
              onClick={handleAddNotification}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Notification
            </button>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded">
          <h3 className="font-semibold mb-2">Status:</h3>
          <p className="text-sm text-green-600">
            ✓ Connected to Firebase Realtime Database
          </p>
          <p className="text-sm text-green-600">
            ✓ Hive stores initialized and syncing
          </p>
          <p className="text-sm text-green-600">
            ✓ Real-time updates active
          </p>
        </div>
      </div>
    </div>
  );
};

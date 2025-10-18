import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export const PWAUpdatePrompt: React.FC = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  if (offlineReady) {
    return (
      <div className="fixed bottom-4 left-4 z-50 max-w-sm animate-slide-up">
        <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900">App ready to work offline</p>
              <p className="text-xs text-green-700 mt-1">You can now use the app without internet</p>
            </div>
            <button
              onClick={close}
              className="flex-shrink-0 text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (needRefresh) {
    return (
      <div className="fixed bottom-4 left-4 z-50 max-w-sm animate-slide-up">
        <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">New version available!</p>
              <p className="text-xs text-blue-700 mt-1">Click reload to update</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white text-xs font-medium py-1.5 px-3 rounded hover:bg-blue-700 transition-colors"
              >
                Reload
              </button>
              <button
                onClick={close}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

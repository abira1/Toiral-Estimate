import React from 'react';
interface LoadingScreenProps {
  message?: string;
}
export function LoadingScreen({
  message = 'Loading...'
}: LoadingScreenProps) {
  return <div className="fixed inset-0 bg-primary-900 flex flex-col items-center justify-center z-50">
      <div className="relative">
        <img src="/toiraal.png" alt="Loading" className="w-24 h-24 md:w-32 md:h-32" />
      </div>
      <p className="text-white mt-6 text-lg font-medium">{message}</p>
    </div>;
}
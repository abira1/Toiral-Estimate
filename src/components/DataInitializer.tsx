import React, { useEffect, useState } from 'react';
import { getTestUserMappings } from '../services/testUserMappings';
import { Loader2 } from 'lucide-react';

interface DataInitializerProps {
  children: React.ReactNode;
}

/**
 * Component that checks for existing test data but doesn't block app loading
 */
export const DataInitializer: React.FC<DataInitializerProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Just check if we have existing mappings, don't try to create new data
    const existingMappings = getTestUserMappings();
    
    if (existingMappings && existingMappings.length > 0) {
      console.log('✅ Test user mappings found');
    } else {
      console.log('ℹ️ No test user mappings found - use admin panel to seed data');
    }
    
    // Always set ready to true - don't block the app
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lavender to-cream-light flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

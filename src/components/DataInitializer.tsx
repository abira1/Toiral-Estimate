import React, { useEffect, useState } from 'react';
import { initializeTestUsers } from '../services/testUsersData';
import { saveTestUserMapping, getTestUserMappings } from '../services/testUserMappings';
import { Loader2 } from 'lucide-react';

interface DataInitializerProps {
  children: React.ReactNode;
}

/**
 * Component that initializes test data on first app load
 */
export const DataInitializer: React.FC<DataInitializerProps> = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Check if data has already been initialized
        const existingMappings = getTestUserMappings();
        
        if (existingMappings && existingMappings.length > 0) {
          console.log('✅ Test data already initialized');
          setIsReady(true);
          return;
        }

        console.log('🔄 Checking for existing test data...');
        setIsInitializing(true);

        // Try to initialize test users and sample data
        // This will fail if Firebase rules don't allow writes before auth
        const result = await initializeTestUsers();

        // Save test user mappings for login
        if (result.success) {
          saveTestUserMapping({
            accessCode: 'admin',
            userId: result.users.admin.id,
            name: result.users.admin.name,
            email: result.users.admin.email,
            role: 'admin'
          });

          saveTestUserMapping({
            accessCode: 'testuser1',
            userId: result.users.testUser1.id,
            name: result.users.testUser1.name,
            email: result.users.testUser1.email,
            role: 'user'
          });

          saveTestUserMapping({
            accessCode: 'testuser2',
            userId: result.users.testUser2.id,
            name: result.users.testUser2.name,
            email: result.users.testUser2.email,
            role: 'user'
          });

          saveTestUserMapping({
            accessCode: 'testuser3',
            userId: result.users.testUser3.id,
            name: result.users.testUser3.name,
            email: result.users.testUser3.email,
            role: 'user'
          });

          console.log('✅ Test data initialization completed successfully!');
        }

        setIsReady(true);
      } catch (err: any) {
        console.error('❌ Failed to initialize test data:', err);
        setError(err.message || 'Failed to initialize test data');
        // Allow app to load even if initialization fails
        setIsReady(true);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeData();
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lavender to-cream-light flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-primary-800 mb-2">
            Setting up Toiral
          </h2>
          <p className="text-gray-600">
            Initializing test users and sample data...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This only happens once on first load
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lavender to-cream-light flex items-center justify-center">
        <div className="bg-white rounded-2xl border-2 border-red-300 p-8 max-w-md mx-4">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Initialization Error
          </h2>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <p className="text-sm text-gray-500">
            You can still use the app, but test data may not be available.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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

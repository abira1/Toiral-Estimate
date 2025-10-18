import React, { useState } from 'react';
import { Database, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { initializeTestUsers } from '../services/testUsersData';
import { saveTestUserMapping } from '../services/testUserMappings';

/**
 * Admin component to manually seed test data into Firebase
 * Use this if auto-initialization fails due to Firebase permissions
 */
export const SeedDataButton: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      setStatus('idle');
      setMessage('');

      console.log('🌱 Starting manual data seeding...');

      // Initialize test users and sample data
      const result = await initializeTestUsers();

      if (result.success) {
        // Save test user mappings
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

        setStatus('success');
        setMessage('Test data seeded successfully! You can now login with test users.');
        console.log('✅ Manual data seeding completed successfully!');
      } else {
        throw new Error('Seeding returned unsuccessful result');
      }
    } catch (error: any) {
      console.error('❌ Failed to seed data:', error);
      setStatus('error');
      
      if (error.message && error.message.includes('PERMISSION_DENIED')) {
        setMessage('Firebase permission denied. Please ensure Firebase Realtime Database rules allow authenticated writes.');
      } else {
        setMessage(`Error: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-retro">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary-100 rounded-lg">
          <Database className="w-6 h-6 text-primary-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Initialize Test Data
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Seed the database with test users, quotations, and projects for testing purposes.
          </p>
          
          {status === 'success' && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">{message}</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{message}</p>
            </div>
          )}
          
          <button
            onClick={handleSeedData}
            disabled={isSeeding || status === 'success'}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isSeeding || status === 'success'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            <Upload className="w-4 h-4" />
            {isSeeding ? 'Seeding Data...' : status === 'success' ? 'Data Seeded' : 'Seed Test Data'}
          </button>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2"><strong>This will create:</strong></p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• 3 test client users with sample data</li>
              <li>• 1 admin user</li>
              <li>• 4 sample quotations</li>
              <li>• 3 sample projects</li>
              <li>• 6 service packages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

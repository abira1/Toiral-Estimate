import React, { useState } from 'react';
import { Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { createPhase5TestData } from '../services/seedPhase5Data';
import toast from 'react-hot-toast';

export function Phase5SeedButton() {
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedPhase5Data = async () => {
    setIsSeeding(true);
    
    try {
      await createPhase5TestData();
      toast.success('Phase 5 test data created successfully! 🎉\nLogin with "testuser1" to test the workflow.', {
        duration: 5000,
        icon: '🚀'
      });
    } catch (error) {
      console.error('Error seeding Phase 5 data:', error);
      toast.error('Failed to create Phase 5 test data. Check console for details.', {
        duration: 4000,
        icon: '❌'
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <button
      onClick={handleSeedPhase5Data}
      disabled={isSeeding}
      className={`px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-retro ${
        isSeeding
          ? 'bg-gray-400 text-white cursor-not-allowed'
          : 'bg-purple-600 text-white hover:bg-purple-700'
      }`}
      title="Create Phase 5 test data including client, project setup, and coupons"
    >
      {isSeeding ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
          Creating Data...
        </>
      ) : (
        <>
          <Zap size={18} />
          Phase 5 Test Data
        </>
      )}
    </button>
  );
}
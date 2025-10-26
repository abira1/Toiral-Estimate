import React, { useState } from 'react';
import { Database, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { seedComprehensiveServices } from '../../services/updatedSeedData';
import { seedDefaultAddOns } from '../../services/packageAssignmentService';
import toast from 'react-hot-toast';

export function SeedDataManager() {
  const [loading, setLoading] = useState(false);
  const [servicesSeeded, setServicesSeeded] = useState(false);
  const [addOnsSeeded, setAddOnsSeeded] = useState(false);

  const handleSeedServices = async () => {
    setLoading(true);
    try {
      await seedComprehensiveServices();
      setServicesSeeded(true);
      toast.success('Services seeded successfully!');
    } catch (error) {
      console.error('Error seeding services:', error);
      toast.error('Failed to seed services');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedAddOns = async () => {
    setLoading(true);
    try {
      await seedDefaultAddOns();
      setAddOnsSeeded(true);
      toast.success('Add-ons seeded successfully!');
    } catch (error) {
      console.error('Error seeding add-ons:', error);
      toast.error('Failed to seed add-ons');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedAll = async () => {
    setLoading(true);
    try {
      await seedComprehensiveServices();
      await seedDefaultAddOns();
      setServicesSeeded(true);
      setAddOnsSeeded(true);
      toast.success('All data seeded successfully!');
    } catch (error) {
      console.error('Error seeding data:', error);
      toast.error('Failed to seed data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-retro border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Database className="text-primary-600 mr-3" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Database Seeding</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Initialize the database with comprehensive service packages and add-ons
      </p>

      <div className="space-y-4">
        {/* Seed Services */}
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-medium text-gray-800">Service Packages</h3>
              <p className="text-sm text-gray-600">
                22 comprehensive packages across 7 categories
              </p>
            </div>
            {servicesSeeded && (
              <CheckCircle className="text-green-500" size={24} />
            )}
          </div>
          <button
            onClick={handleSeedServices}
            disabled={loading || servicesSeeded}
            className="w-full mt-3 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={16} />
                Seeding...
              </>
            ) : servicesSeeded ? (
              'Services Seeded ✓'
            ) : (
              'Seed Services'
            )}
          </button>
        </div>

        {/* Seed Add-ons */}
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-medium text-gray-800">Add-ons</h3>
              <p className="text-sm text-gray-600">
                8 default add-ons for package customization
              </p>
            </div>
            {addOnsSeeded && (
              <CheckCircle className="text-green-500" size={24} />
            )}
          </div>
          <button
            onClick={handleSeedAddOns}
            disabled={loading || addOnsSeeded}
            className="w-full mt-3 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={16} />
                Seeding...
              </>
            ) : addOnsSeeded ? (
              'Add-ons Seeded ✓'
            ) : (
              'Seed Add-ons'
            )}
          </button>
        </div>

        {/* Seed All */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleSeedAll}
            disabled={loading || (servicesSeeded && addOnsSeeded)}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} />
                Seeding All Data...
              </>
            ) : (servicesSeeded && addOnsSeeded) ? (
              <>
                <CheckCircle size={20} />
                All Data Seeded Successfully
              </>
            ) : (
              <>
                <Database size={20} />
                Seed All Data
              </>
            )}
          </button>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm text-yellow-800 font-medium">Important Note</p>
            <p className="text-sm text-yellow-700 mt-1">
              Seeding will add new data to the database. This action should typically be done once during initial setup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

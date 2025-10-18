import React, { useState } from 'react';
import { X, Upload, User, Mail, Phone, Package, FileText, Image } from 'lucide-react';
import { createClient } from '../../services/workflowService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded: (clientId: string) => void;
}

export function AddClientModal({ isOpen, onClose, onClientAdded }: AddClientModalProps) {
  const { currentUser, userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: '',
    selectedPackage: '',
    additionalNotes: '',
    projectDetails: ''
  });

  // Predefined package options
  const packageOptions = [
    'Basic Website Package',
    'Standard Website Package', 
    'Premium Website Package',
    'E-commerce Package',
    'Corporate Package',
    'Custom Package'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !userProfile) {
      toast.error('You must be logged in to add a client');
      return;
    }

    // Validation
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    setIsLoading(true);
    
    try {
      const clientData: any = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        createdBy: currentUser.uid
      };

      // Only add optional fields if they have values (avoid undefined)
      if (formData.profileImage.trim()) {
        clientData.profileImage = formData.profileImage.trim();
      }
      if (formData.selectedPackage) {
        clientData.selectedPackage = formData.selectedPackage;
      }
      if (formData.additionalNotes.trim()) {
        clientData.additionalNotes = formData.additionalNotes.trim();
      }
      if (formData.projectDetails.trim()) {
        clientData.projectDetails = formData.projectDetails.trim();
      }

      const client = await createClient(clientData);
      
      toast.success(`Client "${client.name}" added successfully! Client Code: ${client.clientCode}`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        profileImage: '',
        selectedPackage: '',
        additionalNotes: '',
        projectDetails: ''
      });
      
      onClientAdded(client.id);
      onClose();
      
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <User className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add New Client</h2>
              <p className="text-sm text-gray-500">Create a client profile and generate unique client code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Client Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="Enter client full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="client@example.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image className="h-4 w-4 inline mr-1" />
                  Profile Image URL
                </label>
                <input
                  type="url"
                  value={formData.profileImage}
                  onChange={(e) => handleInputChange('profileImage', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Package Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Package & Project Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="h-4 w-4 inline mr-1" />
                  Selected Package (Optional)
                </label>
                <select
                  value={formData.selectedPackage}
                  onChange={(e) => handleInputChange('selectedPackage', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                >
                  <option value="">Select a package (can be set later)</option>
                  {packageOptions.map((pkg) => (
                    <option key={pkg} value={pkg}>{pkg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 inline mr-1" />
                  Project Details
                </label>
                <textarea
                  value={formData.projectDetails}
                  onChange={(e) => handleInputChange('projectDetails', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 transition-colors resize-none"
                  placeholder="Describe the project requirements, goals, or specific needs..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 inline mr-1" />
                  Additional Notes
                </label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 transition-colors resize-none"
                  placeholder="Any additional information about the client or project..."
                />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-blue-100 rounded-lg mt-0.5">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">What happens next?</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>1. System generates a unique Client Code automatically</p>
                  <p>2. You'll be redirected to Project Setup to configure pricing and features</p>
                  <p>3. You can then send an invitation with login credentials to the client</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding Client...
                </>
              ) : (
                <>
                  <User className="h-5 w-5" />
                  Add Client & Continue
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
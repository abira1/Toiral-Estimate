import React, { useState, useEffect } from 'react';
import { X, Settings, DollarSign, Clock, Plus, Trash2, Tag, Calendar, Package } from 'lucide-react';
import { createProjectSetup, getClient } from '../../services/workflowService';
import { Client, ProjectAddOn, Coupon } from '../../types/workflow';
import toast from 'react-hot-toast';

interface ProjectSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  onProjectSetup: (projectId: string) => void;
}

export function ProjectSetupModal({ isOpen, onClose, clientId, onProjectSetup }: ProjectSetupModalProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    basePrice: 0,
    baseDeadline: 30, // days
    features: [''] // Start with one empty feature
  });

  // Add-ons state
  const [addOns, setAddOns] = useState<Omit<ProjectAddOn, 'id'>[]>([]);
  
  // Coupons state
  const [coupons, setCoupons] = useState<Omit<Coupon, 'id' | 'usedCount'>[]>([]);

  // Load client data
  useEffect(() => {
    if (isOpen && clientId) {
      loadClient();
    }
  }, [isOpen, clientId]);

  const loadClient = async () => {
    try {
      const clientData = await getClient(clientId);
      if (clientData) {
        setClient(clientData);
        // Set default project name based on client and package
        setFormData(prev => ({
          ...prev,
          projectName: `${clientData.name} - ${clientData.selectedPackage || 'Custom Project'}`
        }));
      }
    } catch (error) {
      console.error('Error loading client:', error);
      toast.error('Failed to load client information');
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, features: newFeatures }));
    }
  };

  const addAddOn = () => {
    setAddOns(prev => [...prev, {
      name: '',
      description: '',
      price: 0,
      extraDeliveryTime: 0,
      category: 'Additional Feature'
    }]);
  };

  const updateAddOn = (index: number, field: string, value: string | number) => {
    const newAddOns = [...addOns];
    newAddOns[index] = { ...newAddOns[index], [field]: value };
    setAddOns(newAddOns);
  };

  const removeAddOn = (index: number) => {
    setAddOns(prev => prev.filter((_, i) => i !== index));
  };

  const addCoupon = () => {
    setCoupons(prev => [...prev, {
      code: '',
      discount: 0,
      discountType: 'percentage',
      description: '',
      isActive: true
    }]);
  };

  const updateCoupon = (index: number, field: string, value: string | number | boolean) => {
    const newCoupons = [...coupons];
    newCoupons[index] = { ...newCoupons[index], [field]: value };
    setCoupons(newCoupons);
  };

  const removeCoupon = (index: number) => {
    setCoupons(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!client) {
      toast.error('Client information not loaded');
      return;
    }

    // Validation
    if (!formData.projectName.trim() || !formData.description.trim()) {
      toast.error('Project name and description are required');
      return;
    }

    if (formData.basePrice <= 0) {
      toast.error('Base price must be greater than 0');
      return;
    }

    const validFeatures = formData.features.filter(f => f.trim());
    if (validFeatures.length === 0) {
      toast.error('At least one feature is required');
      return;
    }

    setIsLoading(true);
    
    try {
      // Create add-ons with IDs
      const processedAddOns: ProjectAddOn[] = addOns
        .filter(addon => addon.name.trim() && addon.price > 0)
        .map((addon, index) => ({
          ...addon,
          id: `addon_${Date.now()}_${index}`
        }));

      // Create coupons with IDs  
      const processedCoupons: Coupon[] = coupons
        .filter(coupon => coupon.code.trim() && coupon.discount > 0)
        .map((coupon, index) => ({
          ...coupon,
          id: `coupon_${Date.now()}_${index}`,
          usedCount: 0
        }));

      const projectData = {
        clientId: client.id,
        clientCode: client.clientCode,
        projectName: formData.projectName.trim(),
        features: validFeatures,
        description: formData.description.trim(),
        basePrice: formData.basePrice,
        baseDeadline: formData.baseDeadline,
        availableCoupons: processedCoupons,
        addOns: processedAddOns
      };

      const project = await createProjectSetup(projectData);
      
      toast.success(`Project "${project.projectName}" setup completed!`);
      
      // Reset form
      setFormData({
        projectName: '',
        description: '',
        basePrice: 0,
        baseDeadline: 30,
        features: ['']
      });
      setAddOns([]);
      setCoupons([]);
      
      onProjectSetup(project.id);
      onClose();
      
    } catch (error) {
      console.error('Error setting up project:', error);
      toast.error('Failed to setup project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Project Setup</h2>
              <p className="text-sm text-gray-500">
                {client ? `Configure project for ${client.name} (${client.clientCode})` : 'Loading client...'}
              </p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Project Basic Info */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Project Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Describe what this project will deliver..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="h-4 w-4 inline mr-1" />
                    Base Price (USD) *
                  </label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => handleInputChange('basePrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Base Deadline (Days) *
                  </label>
                  <input
                    type="number"
                    value={formData.baseDeadline}
                    onChange={(e) => handleInputChange('baseDeadline', parseInt(e.target.value) || 30)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="30"
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="h-5 w-5 text-green-600" />
              Features & Description
            </h3>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                    placeholder={`Feature ${index + 1}`}
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add Feature
              </button>
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-purple-600" />
              Add-ons (Optional)
            </h3>
            <div className="space-y-4">
              {addOns.map((addon, index) => (
                <div key={index} className="p-4 border-2 border-gray-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Add-on {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeAddOn(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={addon.name}
                      onChange={(e) => updateAddOn(index, 'name', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      placeholder="Add-on name"
                    />
                    <input
                      type="number"
                      value={addon.price}
                      onChange={(e) => updateAddOn(index, 'price', parseFloat(e.target.value) || 0)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      placeholder="Price"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <textarea
                    value={addon.description}
                    onChange={(e) => updateAddOn(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
                    rows={2}
                    placeholder="Add-on description"
                  />
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Extra delivery time (days)</label>
                    <input
                      type="number"
                      value={addon.extraDeliveryTime}
                      onChange={(e) => updateAddOn(index, 'extraDeliveryTime', parseInt(e.target.value) || 0)}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addAddOn}
                className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 hover:border-purple-500 hover:text-purple-600 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add Add-on
              </button>
            </div>
          </div>

          {/* Coupons */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="h-5 w-5 text-orange-600" />
              Available Coupons (Optional)
            </h3>
            <div className="space-y-4">
              {coupons.map((coupon, index) => (
                <div key={index} className="p-4 border-2 border-gray-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Coupon {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeCoupon(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={coupon.code}
                      onChange={(e) => updateCoupon(index, 'code', e.target.value.toUpperCase())}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 font-mono"
                      placeholder="COUPON CODE"
                    />
                    <input
                      type="number"
                      value={coupon.discount}
                      onChange={(e) => updateCoupon(index, 'discount', parseFloat(e.target.value) || 0)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="Discount"
                      min="0"
                      step="0.01"
                    />
                    <select
                      value={coupon.discountType}
                      onChange={(e) => updateCoupon(index, 'discountType', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  
                  <textarea
                    value={coupon.description}
                    onChange={(e) => updateCoupon(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 resize-none"
                    rows={2}
                    placeholder="Coupon description"
                  />
                </div>
              ))}
              
              <button
                type="button"
                onClick={addCoupon}
                className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 hover:border-orange-500 hover:text-orange-600 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add Coupon
              </button>
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
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Setting up...
                </>
              ) : (
                <>
                  <Settings className="h-5 w-5" />
                  Confirm Project Setup
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
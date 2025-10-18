import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
  Clock, 
  DollarSign, 
  CheckCircle,
  Tag,
  AlertCircle
} from 'lucide-react';
import { ProjectAddOn, Coupon } from '../types/workflow';
import { getCouponByCode } from '../services/workflowService';
import toast from 'react-hot-toast';

interface AddOnsSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedAddOns: ProjectAddOn[], appliedCoupon: Coupon | null, finalPrice: number, finalDeliveryTime: number) => void;
  basePrice: number;
  baseDeliveryTime: number;
  projectName: string;
  initialSelectedAddOns?: ProjectAddOn[];
  initialAppliedCoupon?: Coupon | null;
}

export function AddOnsSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  basePrice,
  baseDeliveryTime,
  projectName,
  initialSelectedAddOns = [],
  initialAppliedCoupon = null
}: AddOnsSelectionModalProps) {
  const [selectedAddOns, setSelectedAddOns] = useState<ProjectAddOn[]>(initialSelectedAddOns);
  const [couponCode, setCouponCode] = useState(initialAppliedCoupon?.code || '');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(initialAppliedCoupon);
  const [couponLoading, setCouponLoading] = useState(false);

  // Available add-ons with enhanced real-time pricing
  const [availableAddOns] = useState<ProjectAddOn[]>([
    {
      id: 'addon-1',
      name: 'Priority Support',
      description: '24/7 customer support with 4-hour response time',
      price: 99,
      extraDeliveryTime: 0,
      category: 'Support',
      isRequired: false
    },
    {
      id: 'addon-2',
      name: 'SEO Package',
      description: 'Basic SEO optimization for better search engine rankings',
      price: 149,
      extraDeliveryTime: 3,
      category: 'Marketing',
      isRequired: false
    },
    {
      id: 'addon-3',
      name: 'Content Creation',
      description: 'Professional copywriting for up to 5 pages',
      price: 199,
      extraDeliveryTime: 5,
      category: 'Content',
      isRequired: false
    },
    {
      id: 'addon-4',
      name: 'Analytics Setup',
      description: 'Google Analytics and reporting dashboard setup',
      price: 79,
      extraDeliveryTime: 1,
      category: 'Analytics',
      isRequired: false
    },
    {
      id: 'addon-5',
      name: 'Extended Support',
      description: 'Additional 30 days of technical support',
      price: 129,
      extraDeliveryTime: 0,
      category: 'Support',
      isRequired: false
    },
    {
      id: 'addon-6',
      name: 'Mobile Optimization',
      description: 'Enhanced mobile responsive design and testing',
      price: 179,
      extraDeliveryTime: 2,
      category: 'Development',
      isRequired: false
    },
    {
      id: 'addon-7',
      name: 'Performance Optimization',
      description: 'Website speed optimization and performance tuning',
      price: 159,
      extraDeliveryTime: 3,
      category: 'Development',
      isRequired: false
    },
    {
      id: 'addon-8',
      name: 'Security Package',
      description: 'SSL certificate, security hardening, and monitoring',
      price: 119,
      extraDeliveryTime: 1,
      category: 'Security',
      isRequired: false
    }
  ]);

  useEffect(() => {
    if (isOpen) {
      setSelectedAddOns(initialSelectedAddOns);
      setCouponCode(initialAppliedCoupon?.code || '');
      setAppliedCoupon(initialAppliedCoupon);
    }
  }, [isOpen, initialSelectedAddOns, initialAppliedCoupon]);

  const toggleAddOn = (addOn: ProjectAddOn) => {
    const isSelected = selectedAddOns.find(selected => selected.id === addOn.id);
    
    if (isSelected) {
      setSelectedAddOns(selectedAddOns.filter(selected => selected.id !== addOn.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addOn]);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    try {
      const coupon = await getCouponByCode(couponCode.trim().toUpperCase());
      
      if (!coupon) {
        toast.error('Invalid coupon code');
        setCouponLoading(false);
        return;
      }

      if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
        toast.error('Coupon has expired');
        setCouponLoading(false);
        return;
      }

      const subtotal = calculateSubtotal();
      if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
        toast.error(`Minimum order amount is $${coupon.minOrderAmount}`);
        setCouponLoading(false);
        return;
      }

      if (coupon.usageLimit && coupon.usedCount && coupon.usedCount >= coupon.usageLimit) {
        toast.error('Coupon usage limit reached');
        setCouponLoading(false);
        return;
      }

      setAppliedCoupon(coupon);
      toast.success(`Coupon applied! ${coupon.discountType === 'percentage' ? `${coupon.discount}%` : `$${coupon.discount}`} discount`);
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  // Real-time calculations
  const calculateSubtotal = () => {
    const addOnsTotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
    return basePrice + addOnsTotal;
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = calculateSubtotal();
    
    if (appliedCoupon.discountType === 'percentage') {
      return Math.round((subtotal * appliedCoupon.discount) / 100);
    } else {
      return Math.min(appliedCoupon.discount, subtotal);
    }
  };

  const calculateFinalPrice = () => {
    return Math.max(0, calculateSubtotal() - calculateDiscount());
  };

  const calculateDeliveryTime = () => {
    const addOnsTime = selectedAddOns.reduce((sum, addon) => sum + addon.extraDeliveryTime, 0);
    return baseDeliveryTime + addOnsTime;
  };

  const handleConfirm = () => {
    onConfirm(selectedAddOns, appliedCoupon, calculateFinalPrice(), calculateDeliveryTime());
  };

  const groupedAddOns = availableAddOns.reduce((groups, addon) => {
    const category = addon.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(addon);
    return groups;
  }, {} as Record<string, ProjectAddOn[]>);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Customize Your Project</h2>
              <p className="text-gray-600">{projectName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Base Package Info */}
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-primary-800 mb-2">Base Package</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-primary-700">Starting price and delivery time</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-primary-800">${basePrice}</p>
                <p className="text-sm text-primary-600 flex items-center justify-end gap-1">
                  <Clock size={14} />
                  {baseDeliveryTime} days
                </p>
              </div>
            </div>
          </div>

          {/* Add-ons by Category */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Add-ons</h3>
            {Object.entries(groupedAddOns).map(([category, addOns]) => (
              <div key={category} className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  {category}
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {addOns.map(addon => {
                    const isSelected = selectedAddOns.find(selected => selected.id === addon.id);
                    
                    return (
                      <div 
                        key={addon.id} 
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-secondary-500 bg-secondary-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`} 
                        onClick={() => toggleAddOn(addon)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-800 mb-1">{addon.name}</h5>
                            <p className="text-sm text-gray-600 mb-2">{addon.description}</p>
                            {addon.extraDeliveryTime > 0 && (
                              <div className="flex items-center gap-1 text-xs text-orange-600">
                                <Clock size={12} />
                                +{addon.extraDeliveryTime} days
                              </div>
                            )}
                          </div>
                          <button
                            className={`ml-3 p-2 rounded-full transition-colors ${
                              isSelected 
                                ? 'bg-secondary-500 text-white' 
                                : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                            }`}
                          >
                            {isSelected ? <Minus size={16} /> : <Plus size={16} />}
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-secondary-700 text-lg">
                            +${addon.price}
                          </span>
                          {isSelected && (
                            <CheckCircle size={20} className="text-secondary-500" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Coupon Section */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Tag size={18} />
              Apply Coupon Code
            </h3>
            
            {appliedCoupon ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">{appliedCoupon.code}</p>
                      <p className="text-sm text-green-600">{appliedCoupon.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-green-700">
                      -{appliedCoupon.discountType === 'percentage' 
                        ? `${appliedCoupon.discount}%` 
                        : `$${appliedCoupon.discount}`}
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="p-1 text-green-600 hover:text-green-800 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter coupon code (e.g., WELCOME10)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                  className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {couponLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    'Apply'
                  )}
                </button>
              </div>
            )}

            <div className="mt-3 text-xs text-gray-600">
              <p>💡 Try these codes: <span className="font-mono">WELCOME10</span> (10% off) or <span className="font-mono">SUMMER20</span> (20% off)</p>
            </div>
          </div>

          {/* Real-time Pricing Summary */}
          <div className="bg-white border-2 border-primary-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign size={18} />
              Live Pricing Summary
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Base Package:</span>
                <span className="font-medium">${basePrice}</span>
              </div>
              
              {selectedAddOns.length > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span>Selected Add-ons ({selectedAddOns.length}):</span>
                    <span className="font-medium">
                      +${selectedAddOns.reduce((sum, addon) => sum + addon.price, 0)}
                    </span>
                  </div>
                  <div className="pl-4 space-y-1">
                    {selectedAddOns.map(addon => (
                      <div key={addon.id} className="flex justify-between items-center text-sm text-gray-600">
                        <span>• {addon.name}</span>
                        <span>+${addon.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center border-t pt-3">
                <span>Subtotal:</span>
                <span className="font-medium">${calculateSubtotal()}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Discount ({appliedCoupon.code}):</span>
                  <span className="font-medium">-${calculateDiscount()}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center border-t border-primary-300 pt-3">
                <span className="font-bold text-lg">Final Total:</span>
                <span className="font-bold text-xl text-primary-700">${calculateFinalPrice()}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-600 pt-2">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  Estimated Delivery:
                </span>
                <span className="font-medium">{calculateDeliveryTime()} days</span>
              </div>
            </div>
          </div>

          {/* Summary Alert */}
          {selectedAddOns.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-blue-800 font-medium mb-1">
                    You've selected {selectedAddOns.length} add-on{selectedAddOns.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-blue-700">
                    This will increase your project cost by ${selectedAddOns.reduce((sum, addon) => sum + addon.price, 0)} 
                    and delivery time by {selectedAddOns.reduce((sum, addon) => sum + addon.extraDeliveryTime, 0)} days.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              Confirm Selection - ${calculateFinalPrice()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
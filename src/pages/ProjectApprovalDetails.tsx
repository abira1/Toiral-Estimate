import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeftIcon, 
  CheckIcon, 
  ChevronRightIcon, 
  XIcon,
  Calendar,
  DollarSign,
  Clock,
  Plus,
  Minus,
  AlertCircle,
  Tag
} from 'lucide-react';
import { 
  getClientQuotation,
  confirmClientQuotation,
  getCouponByCode
} from '../services/workflowService';
import { ClientQuotation, ProjectAddOn, Coupon } from '../types/workflow';
import toast from 'react-hot-toast';

export function ProjectApprovalDetails() {
  const navigate = useNavigate();
  const { quotationId } = useParams<{ quotationId: string }>();
  const { currentUser, userProfile } = useAuth();
  
  const [quotation, setQuotation] = useState<ClientQuotation | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<ProjectAddOn[]>([]);
  const [availableAddOns] = useState<ProjectAddOn[]>([
    {
      id: 'addon-1',
      name: 'Priority Support',
      description: '24/7 customer support with 4-hour response time',
      price: 99,
      extraDeliveryTime: 0,
      category: 'Support'
    },
    {
      id: 'addon-2',
      name: 'SEO Package',
      description: 'Basic SEO optimization for better search engine rankings',
      price: 149,
      extraDeliveryTime: 3,
      category: 'Marketing'
    },
    {
      id: 'addon-3',
      name: 'Content Creation',
      description: 'Professional copywriting for up to 5 pages',
      price: 199,
      extraDeliveryTime: 5,
      category: 'Content'
    },
    {
      id: 'addon-4',
      name: 'Analytics Setup',
      description: 'Google Analytics and reporting dashboard setup',
      price: 79,
      extraDeliveryTime: 1,
      category: 'Analytics'
    },
    {
      id: 'addon-5',
      name: 'Extended Support',
      description: 'Additional 30 days of technical support',
      price: 129,
      extraDeliveryTime: 0,
      category: 'Support'
    }
  ]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (quotationId) {
      loadQuotationDetails();
    } else {
      navigate('/pending-project-approvals');
    }
  }, [quotationId]);

  const loadQuotationDetails = async () => {
    try {
      if (!quotationId) return;
      
      const quotationData = await getClientQuotation(quotationId);
      if (!quotationData) {
        toast.error('Quotation not found');
        navigate('/pending-project-approvals');
        return;
      }
      
      setQuotation(quotationData);
      setSelectedAddOns(quotationData.selectedAddOns || []);
      setAppliedCoupon(quotationData.appliedCoupon || null);
      if (quotationData.appliedCoupon) {
        setCouponCode(quotationData.appliedCoupon.code);
      }
    } catch (error) {
      console.error('Error loading quotation details:', error);
      toast.error('Failed to load quotation details');
    } finally {
      setLoading(false);
    }
  };

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

    try {
      const coupon = await getCouponByCode(couponCode.trim().toUpperCase());
      
      if (!coupon) {
        toast.error('Invalid coupon code');
        return;
      }

      if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
        toast.error('Coupon has expired');
        return;
      }

      const subtotal = calculateSubtotal();
      if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
        toast.error(`Minimum order amount is $${coupon.minOrderAmount}`);
        return;
      }

      setAppliedCoupon(coupon);
      toast.success(`Coupon applied! ${coupon.discountType === 'percentage' ? `${coupon.discount}%` : `$${coupon.discount}`} discount`);
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('Failed to apply coupon');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const calculateSubtotal = () => {
    if (!quotation) return 0;
    const addOnsTotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
    return quotation.basePrice + addOnsTotal;
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
    return calculateSubtotal() - calculateDiscount();
  };

  const calculateDeliveryTime = () => {
    if (!quotation) return 0;
    const addOnsTime = selectedAddOns.reduce((sum, addon) => sum + addon.extraDeliveryTime, 0);
    return quotation.baseDeliveryTime + addOnsTime;
  };

  const handleApproveQuotation = async () => {
    if (!quotation) return;
    
    setSubmitting(true);
    try {
      // Create updated quotation with final selections
      const updatedQuotation = {
        ...quotation,
        selectedAddOns,
        appliedCoupon,
        addOnsTotal: selectedAddOns.reduce((sum, addon) => sum + addon.price, 0),
        discountAmount: calculateDiscount(),
        finalPrice: calculateFinalPrice(),
        addOnsDeliveryTime: selectedAddOns.reduce((sum, addon) => sum + addon.extraDeliveryTime, 0),
        finalDeliveryTime: calculateDeliveryTime()
      };
      
      // Confirm the quotation
      await confirmClientQuotation(quotation.id);
      
      toast.success('Project approved successfully! 🎉');
      
      // Navigate to projects page
      setTimeout(() => {
        navigate('/my-projects');
      }, 1500);
      
    } catch (error) {
      console.error('Error approving quotation:', error);
      toast.error('Failed to approve project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = () => {
    // For now, just navigate back - in a real app you'd update the status
    toast.error('Project approval cancelled');
    navigate('/pending-project-approvals');
  };

  if (loading) {
    return (
      <div className="bg-lavender-light min-h-screen">
        <Sidebar />
        <div className="sm:pl-20 lg:pl-64 p-6 flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="bg-lavender-light min-h-screen">
        <Sidebar />
        <div className="sm:pl-20 lg:pl-64 p-6 flex justify-center items-center h-screen">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Quotation Not Found</h2>
            <button
              onClick={() => navigate('/pending-project-approvals')}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              Back to Pending Approvals
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-lavender-light min-h-screen">
      <Sidebar />
      <div className="sm:pl-20 lg:pl-64 pb-20 sm:pb-0">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <button 
            onClick={() => navigate('/pending-project-approvals')} 
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-6"
          >
            <ArrowLeftIcon size={18} className="mr-2" />
            Back to Pending Approvals
          </button>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Project Approval Details
            </h1>
            <p className="text-gray-600">
              Review and customize your project quotation before approval
            </p>
          </div>

          {/* Quotation Overview */}
          <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <span className="flex h-6 w-6 bg-primary-100 rounded-full items-center justify-center mr-2">
                <span className="text-primary-600">1</span>
              </span>
              Project Overview
            </h2>
            
            <div className="bg-primary-50 rounded-xl p-4 border border-primary-200">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Quotation ID</h3>
                  <p className="text-sm text-gray-600">#{quotation.id.slice(-8)}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Created Date</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(quotation.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Base Price</h3>
                  <p className="text-lg font-bold text-primary-700">${quotation.basePrice}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Base Delivery Time</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {quotation.baseDeliveryTime} days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Add-ons Selection */}
          <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <span className="flex h-6 w-6 bg-primary-100 rounded-full items-center justify-center mr-2">
                <span className="text-primary-600">2</span>
              </span>
              Customize with Add-ons
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {availableAddOns.map(addon => {
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
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-800">{addon.name}</h4>
                          <button
                            className={`p-1 rounded-full ${
                              isSelected ? 'bg-secondary-500 text-white' : 'bg-gray-200 text-gray-400'
                            }`}
                          >
                            {isSelected ? <Minus size={14} /> : <Plus size={14} />}
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{addon.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="px-2 py-1 bg-gray-100 rounded-full">
                            {addon.category}
                          </span>
                          {addon.extraDeliveryTime > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              +{addon.extraDeliveryTime} days
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className="font-semibold text-secondary-700 text-lg">
                        +${addon.price}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coupon Section */}
          <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <span className="flex h-6 w-6 bg-primary-100 rounded-full items-center justify-center mr-2">
                <span className="text-primary-600">3</span>
              </span>
              Apply Coupon Code
            </h2>
            
            {appliedCoupon ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Tag className="h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-medium text-green-800">{appliedCoupon.code}</h3>
                      <p className="text-sm text-green-600">{appliedCoupon.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-green-700">
                      -{appliedCoupon.discountType === 'percentage' 
                        ? `${appliedCoupon.discount}%` 
                        : `$${appliedCoupon.discount}`}
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="p-1 text-green-600 hover:text-green-700 transition-colors"
                    >
                      <XIcon size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter coupon code (e.g., WELCOME10, SUMMER20)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-6 py-3 bg-secondary-600 text-white rounded-xl hover:bg-secondary-700 transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <span className="flex h-6 w-6 bg-primary-100 rounded-full items-center justify-center mr-2">
                <span className="text-primary-600">4</span>
              </span>
              Final Order Summary
            </h2>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Base Package:</span>
                  <span className="font-medium">${quotation.basePrice}</span>
                </div>
                
                {selectedAddOns.length > 0 && (
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">Selected Add-ons:</span>
                      <div className="text-xs text-gray-600 mt-1">
                        {selectedAddOns.map(addon => addon.name).join(', ')}
                      </div>
                    </div>
                    <span className="font-medium">
                      +${selectedAddOns.reduce((sum, addon) => sum + addon.price, 0)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="font-medium">Subtotal:</span>
                  <span className="font-medium">${calculateSubtotal()}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between items-center text-green-600">
                    <span className="font-medium">Discount ({appliedCoupon.code}):</span>
                    <span className="font-medium">-${calculateDiscount()}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                  <span className="font-bold text-lg">Final Total:</span>
                  <span className="font-bold text-lg text-primary-700">${calculateFinalPrice()}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-600 pt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Estimated Delivery:
                  </span>
                  <span>{calculateDeliveryTime()} days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button 
              onClick={handleReject}
              disabled={submitting}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <XIcon size={18} />
              Decline Project
            </button>
            
            <button 
              onClick={handleApproveQuotation}
              disabled={submitting}
              className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Approving...
                </>
              ) : (
                <>
                  <CheckIcon size={18} />
                  Approve & Start Project
                  <ChevronRightIcon size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
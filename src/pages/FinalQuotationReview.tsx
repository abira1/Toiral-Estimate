import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeftIcon, 
  CheckIcon, 
  ChevronRightIcon,
  Download,
  Share2,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Tag,
  Package
} from 'lucide-react';
import { 
  createClientQuotation,
  getClient
} from '../services/workflowService';
import { getCurrentClientId, requireClientAccess } from '../services/accessControlService';
import { ProjectAddOn, Coupon, Client } from '../types/workflow';
import toast from 'react-hot-toast';

interface QuotationData {
  basePrice: number;
  selectedAddOns: ProjectAddOn[];
  appliedCoupon: Coupon | null;
  finalPrice: number;
  finalDeliveryTime: number;
  projectName: string;
  projectId?: string;
}

export function FinalQuotationReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  
  const [quotationData, setQuotationData] = useState<QuotationData | null>(null);
  const [clientData, setClientData] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuotationData();
  }, [location.state, user]);

  const loadQuotationData = async () => {
    try {
      // Get quotation data from navigation state or localStorage
      const data = location.state as QuotationData;
      
      if (!data) {
        // Try to load from localStorage as fallback
        const pendingProject = localStorage.getItem('pendingProject');
        const selectedAddOnsStr = localStorage.getItem('selectedAddOns');
        const quotationTotal = localStorage.getItem('quotationTotal');
        
        if (pendingProject && selectedAddOnsStr) {
          const project = JSON.parse(pendingProject);
          const selectedAddOns = JSON.parse(selectedAddOnsStr);
          
          setQuotationData({
            basePrice: project.customPrice || project.servicePackage.price,
            selectedAddOns: selectedAddOns,
            appliedCoupon: null,
            finalPrice: quotationTotal ? parseInt(quotationTotal) : project.servicePackage.price,
            finalDeliveryTime: 14, // Default delivery time
            projectName: project.name,
            projectId: project.id
          });
        } else {
          toast.error('No quotation data found');
          navigate('/services');
          return;
        }
      } else {
        setQuotationData(data);
      }

      // Get the client ID from localStorage (set during login)
      const clientId = getCurrentClientId();
      
      // Load client data
      if (clientId) {
        // Validate access
        try {
          requireClientAccess(clientId);
        } catch (error: any) {
          toast.error('Access denied. You can only view your own data.');
          navigate('/');
          return;
        }
        
        const client = await getClient(clientId);
        setClientData(client);
      }

    } catch (error) {
      console.error('Error loading quotation data:', error);
      toast.error('Failed to load quotation details');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmQuotation = async () => {
    if (!quotationData || !currentUser?.uid) {
      toast.error('Missing quotation or user data');
      return;
    }

    setSubmitting(true);
    try {
      const quotation = await createClientQuotation({
        clientId: currentUser.uid,
        clientCode: userProfile?.id || 'CLIENT',
        projectId: quotationData.projectId || 'default',
        selectedAddOns: quotationData.selectedAddOns,
        appliedCoupon: quotationData.appliedCoupon,
        basePrice: quotationData.basePrice,
        addOnsTotal: quotationData.selectedAddOns.reduce((sum, addon) => sum + addon.price, 0),
        discountAmount: quotationData.appliedCoupon ? calculateDiscount() : 0,
        finalPrice: quotationData.finalPrice,
        baseDeliveryTime: 14, // Base delivery time
        addOnsDeliveryTime: quotationData.selectedAddOns.reduce((sum, addon) => sum + addon.extraDeliveryTime, 0),
        finalDeliveryTime: quotationData.finalDeliveryTime,
        clientConfirmed: false,
        status: 'pending_approval'
      });

      // Clear localStorage
      localStorage.removeItem('pendingProject');
      localStorage.removeItem('selectedAddOns');
      localStorage.removeItem('quotationTotal');
      localStorage.removeItem('customPackagePrice');

      toast.success('Quotation created successfully! 🎉');
      
      // Navigate to quotations page
      setTimeout(() => {
        navigate('/my-quotations');
      }, 1500);

    } catch (error) {
      console.error('Error creating quotation:', error);
      toast.error('Failed to create quotation');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateDiscount = () => {
    if (!quotationData?.appliedCoupon) return 0;
    const subtotal = quotationData.basePrice + quotationData.selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
    
    if (quotationData.appliedCoupon.discountType === 'percentage') {
      return Math.round((subtotal * quotationData.appliedCoupon.discount) / 100);
    } else {
      return Math.min(quotationData.appliedCoupon.discount, subtotal);
    }
  };

  const handleDownloadQuotation = () => {
    toast.success('Download feature coming soon!');
  };

  const handleShareQuotation = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Project Quotation - Toiral Estimate',
        text: `Project quotation for ${quotationData?.projectName} - $${quotationData?.finalPrice}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
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

  if (!quotationData) {
    return (
      <div className="bg-lavender-light min-h-screen">
        <Sidebar />
        <div className="sm:pl-20 lg:pl-64 p-6 flex justify-center items-center h-screen">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Quotation Data Found</h2>
            <p className="text-gray-600 mb-4">Please select a service package first.</p>
            <button
              onClick={() => navigate('/services')}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              Browse Services
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
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">
          {/* Header */}
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-6"
          >
            <ArrowLeftIcon size={18} className="mr-2" />
            Back
          </button>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Final Quotation Review
            </h1>
            <p className="text-gray-600">
              Review your project details and confirm your quotation
            </p>
          </div>

          {/* Quotation Header */}
          <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {quotationData.projectName}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Project Quotation #{Date.now().toString().slice(-6)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadQuotation}
                  className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Download Quotation"
                >
                  <Download size={20} />
                </button>
                <button
                  onClick={handleShareQuotation}
                  className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Share Quotation"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 bg-gray-50 rounded-xl p-4">
              <div className="text-center">
                <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Final Price</p>
                <p className="text-lg font-bold text-green-600">${quotationData.finalPrice}</p>
              </div>
              <div className="text-center">
                <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Delivery Time</p>
                <p className="text-lg font-bold text-blue-600">{quotationData.finalDeliveryTime} days</p>
              </div>
              <div className="text-center">
                <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Created</p>
                <p className="text-lg font-bold text-purple-600">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Client Information */}
          {clientData && (
            <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User size={20} />
                Client Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Client Name</p>
                    <p className="font-medium text-gray-800">{clientData.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-medium text-gray-800">{clientData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium text-gray-800">{clientData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Client Code</p>
                    <p className="font-medium text-gray-800">{clientData.clientCode}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Project Details */}
          <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Package</h3>
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-primary-800">Base Package</h4>
                <span className="font-bold text-primary-700 text-lg">${quotationData.basePrice}</span>
              </div>
              <p className="text-sm text-primary-700">{quotationData.projectName}</p>
            </div>
          </div>

          {/* Selected Add-ons */}
          {quotationData.selectedAddOns.length > 0 && (
            <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Selected Add-ons</h3>
              <div className="space-y-3">
                {quotationData.selectedAddOns.map((addon, index) => (
                  <div key={addon.id} className="flex items-center justify-between p-3 bg-secondary-50 border border-secondary-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={18} className="text-secondary-600" />
                      <div>
                        <h5 className="font-medium text-gray-800">{addon.name}</h5>
                        <p className="text-sm text-gray-600">{addon.description}</p>
                        {addon.extraDeliveryTime > 0 && (
                          <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                            <Clock size={12} />
                            +{addon.extraDeliveryTime} days
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-secondary-700 text-lg">
                        +${addon.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Applied Coupon */}
          {quotationData.appliedCoupon && (
            <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Tag size={20} />
                Applied Coupon
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Tag className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-800">{quotationData.appliedCoupon.code}</h4>
                      <p className="text-sm text-green-600">{quotationData.appliedCoupon.description}</p>
                    </div>
                  </div>
                  <span className="font-bold text-green-700 text-lg">
                    -{quotationData.appliedCoupon.discountType === 'percentage' 
                      ? `${quotationData.appliedCoupon.discount}%` 
                      : `$${quotationData.appliedCoupon.discount}`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Breakdown */}
          <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Base Package:</span>
                <span className="font-medium">${quotationData.basePrice}</span>
              </div>
              
              {quotationData.selectedAddOns.length > 0 && (
                <div className="flex justify-between items-center">
                  <span>Add-ons ({quotationData.selectedAddOns.length} selected):</span>
                  <span className="font-medium">
                    +${quotationData.selectedAddOns.reduce((sum, addon) => sum + addon.price, 0)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center border-t pt-3">
                <span>Subtotal:</span>
                <span className="font-medium">
                  ${quotationData.basePrice + quotationData.selectedAddOns.reduce((sum, addon) => sum + addon.price, 0)}
                </span>
              </div>
              
              {quotationData.appliedCoupon && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Discount ({quotationData.appliedCoupon.code}):</span>
                  <span className="font-medium">-${calculateDiscount()}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center border-t border-primary-300 pt-3">
                <span className="font-bold text-xl">Final Total:</span>
                <span className="font-bold text-2xl text-primary-700">${quotationData.finalPrice}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Payment Schedule</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• <strong>First Payment (60%):</strong> ${Math.round(quotationData.finalPrice * 0.6)} - Due upon project approval</p>
                  <p>• <strong>Second Payment (20%):</strong> ${Math.round(quotationData.finalPrice * 0.2)} - Due at project milestone</p>
                  <p>• <strong>Final Payment (20%):</strong> ${Math.round(quotationData.finalPrice * 0.2)} - Due upon project completion</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              onClick={() => navigate('/services')}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeftIcon size={18} />
              Modify Selection
            </button>
            
            <button
              onClick={handleConfirmQuotation}
              disabled={submitting}
              className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Creating Quotation...
                </>
              ) : (
                <>
                  <CheckIcon size={18} />
                  Confirm Quotation
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
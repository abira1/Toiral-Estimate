import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { CheckIcon, DownloadIcon, CreditCardIcon, TagIcon, ArrowRightIcon, AlertCircleIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { useAuth } from '../contexts/AuthContext';
import { createQuotation } from '../services/firebaseService';
import toast from 'react-hot-toast';
type ServicePackage = {
  id: string;
  category: string;
  name: string;
  price: number;
  description: string;
  features: string[];
};
type AddOn = {
  id: string;
  name: string;
  description: string;
  price: number;
  selected: boolean;
};
export function FinalQuotationPage() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [quotationName, setQuotationName] = useState('New Quotation');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
  const [clientInfo, setClientInfo] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+1234567890'
  });
  useEffect(() => {
    // Load service packages
    const storedServices = JSON.parse(localStorage.getItem('servicePackages') || '[]');
    setServicePackages(storedServices);
    
    // First try to load from new quotationSelection format
    const quotationSelection = localStorage.getItem('quotationSelection');
    if (quotationSelection) {
      try {
        const selectionData = JSON.parse(quotationSelection);
        if (selectionData.package) {
          setSelectedPackage(selectionData.package);
        }
        if (selectionData.addOns && Array.isArray(selectionData.addOns)) {
          // Convert add-ons to the expected format
          const convertedAddOns = selectionData.addOns.map((addon: any) => ({
            ...addon,
            selected: true // These are already selected add-ons
          }));
          setSelectedAddOns(convertedAddOns);
        }
        console.log('✅ Loaded quotation data from new format:', selectionData);
        return; // Exit early if we found the new format
      } catch (error) {
        console.error('Error parsing quotation selection:', error);
      }
    }
    
    // Fallback to old format for backward compatibility
    const packageId = localStorage.getItem('selectedPackageId');
    if (packageId) {
      const foundPackage = storedServices.find((pkg: ServicePackage) => pkg.id === packageId);
      if (foundPackage) {
        setSelectedPackage(foundPackage);
        console.log('✅ Loaded package from legacy format:', foundPackage);
      }
    }
    
    // Load selected add-ons from old format
    const addOns = JSON.parse(localStorage.getItem('selectedAddOns') || '[]');
    setSelectedAddOns(addOns);
    
    // If no data found in either format, show warning
    if (!quotationSelection && !packageId) {
      console.warn('⚠️ No package selection found. User may need to select a service package first.');
      toast.error('No service package selected. Please select a package from Services page first.');
    }
  }, []);
  const calculateSubtotal = () => {
    const packagePrice = selectedPackage?.price || 0;
    const addOnsPrice = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
    return packagePrice + addOnsPrice;
  };
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - discount;
  };
  const handleApplyCoupon = () => {
    setIsApplyingCoupon(true);
    setCouponError('');
    // Simulate coupon check
    setTimeout(() => {
      if (couponCode.toLowerCase() === 'welcome10') {
        const discountAmount = calculateSubtotal() * 0.1; // 10% discount
        setDiscount(discountAmount);
        setCouponError('');
      } else if (couponCode.toLowerCase() === 'summer20') {
        const discountAmount = calculateSubtotal() * 0.2; // 20% discount
        setDiscount(discountAmount);
        setCouponError('');
      } else {
        setCouponError('Invalid coupon code');
        setDiscount(0);
      }
      setIsApplyingCoupon(false);
    }, 800);
  };
  const downloadPDF = () => {
    if (!selectedPackage) return;
    const doc = new jsPDF();
    const total = calculateTotal();
    // Add title
    doc.setFontSize(20);
    doc.text('Quotation: ' + quotationName, 20, 20);
    // Add date
    doc.setFontSize(10);
    doc.text('Date: ' + new Date().toLocaleDateString(), 20, 30);
    // Add package details
    doc.setFontSize(14);
    doc.text('Selected Package: ' + selectedPackage.category + ' - ' + selectedPackage.name, 20, 40);
    doc.setFontSize(12);
    doc.text('Price: $' + selectedPackage.price, 20, 50);
    // Add features
    doc.setFontSize(12);
    doc.text('Features:', 20, 60);
    let yPosition = 70;
    selectedPackage.features.forEach(feature => {
      doc.setFontSize(10);
      doc.text('• ' + feature, 25, yPosition);
      yPosition += 6;
    });
    // Add add-ons if any
    if (selectedAddOns.length > 0) {
      yPosition += 10;
      doc.setFontSize(12);
      doc.text('Add-ons:', 20, yPosition);
      yPosition += 10;
      selectedAddOns.forEach(addon => {
        doc.setFontSize(10);
        doc.text('• ' + addon.name + ' - $' + addon.price, 25, yPosition);
        yPosition += 6;
      });
    }
    // Add discount if any
    if (discount > 0) {
      yPosition += 10;
      doc.setFontSize(12);
      doc.text('Discount: -$' + discount.toFixed(2), 20, yPosition);
      yPosition += 10;
    }
    // Add total
    yPosition += 5;
    doc.setFontSize(14);
    doc.text('Total: $' + total.toLocaleString(), 20, yPosition);
    // Add payment schedule
    yPosition += 15;
    doc.setFontSize(12);
    doc.text('Payment Schedule:', 20, yPosition);
    yPosition += 10;
    doc.setFontSize(10);
    doc.text('• First Payment (60%): $' + (total * 0.6).toFixed(2), 25, yPosition);
    yPosition += 6;
    doc.text('• Second Payment (20%): $' + (total * 0.2).toFixed(2), 25, yPosition);
    yPosition += 6;
    doc.text('• Final Payment (20%): $' + (total * 0.2).toFixed(2), 25, yPosition);
    // Save the PDF
    doc.save(quotationName.replace(/\s+/g, '_') + '.pdf');
  };
  const saveQuotation = async () => {
    if (!selectedPackage || !userProfile) {
      toast.error('Please ensure you are logged in and have selected a package.');
      return;
    }
    
    try {
      const quotation = {
        name: quotationName,
        userId: userProfile.id,
        clientInfo: clientInfo,
        servicePackage: selectedPackage,
        addOns: selectedAddOns,
        discount,
        totalPrice: calculateTotal(),
        status: 'draft' as const
      };
      
      // Save to Firebase
      await createQuotation(quotation);
      
      // Clear localStorage after successful save
      localStorage.removeItem('selectedPackageId');
      localStorage.removeItem('selectedAddOns');
      localStorage.removeItem('quotationTotal');
      
      toast.success('Quotation saved successfully!');
      
      // Navigate to my quotations
      navigate('/my-quotations');
    } catch (error) {
      console.error('Error saving quotation:', error);
      toast.error('Error saving quotation. Please try again.');
    }
  };
  return <div className="bg-lavender-light min-h-screen">
      <Sidebar />
      <div className="sm:pl-20 lg:pl-64 pb-20 sm:pb-0">
        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Final Quotation
            </h1>
            <p className="text-gray-600">
              Review your selections and complete your quotation
            </p>
          </div>
          {/* Client Information */}
          <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Client Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input type="text" value={clientInfo.name} onChange={e => setClientInfo({
                ...clientInfo,
                name: e.target.value
              })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input type="email" value={clientInfo.email} onChange={e => setClientInfo({
                ...clientInfo,
                email: e.target.value
              })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input type="tel" value={clientInfo.phone} onChange={e => setClientInfo({
                ...clientInfo,
                phone: e.target.value
              })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-100 p-4 border-b border-gray-200 flex items-center">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <input type="text" value={quotationName} onChange={e => setQuotationName(e.target.value)} className="mx-auto bg-transparent text-center text-gray-700 font-medium focus:outline-none" placeholder="Quotation Name" />
            </div>
            {/* Content */}
            <div className="p-4 sm:p-6">
              {/* Selected Package */}
              {selectedPackage && <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-primary-700">
                    Selected Package
                  </h2>
                  <div className="bg-primary-50 rounded-xl p-4 border border-primary-200">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {selectedPackage.category} - {selectedPackage.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedPackage.description}
                        </p>
                      </div>
                      <span className="font-bold text-xl text-primary-700">
                        ${selectedPackage.price}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-700 mb-2 mt-4">
                      Included Features:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedPackage.features.map((feature, index) => <div key={index} className="flex items-start">
                          <CheckIcon size={16} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>)}
                    </div>
                  </div>
                </div>}
              {/* Selected Add-ons */}
              {selectedAddOns.length > 0 && <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-secondary-600">
                    Selected Add-ons
                  </h2>
                  <div className="space-y-3">
                    {selectedAddOns.map(addon => <div key={addon.id} className="bg-secondary-50 rounded-xl p-4 border border-secondary-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {addon.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {addon.description}
                            </p>
                          </div>
                          <span className="font-bold text-secondary-700">
                            ${addon.price}
                          </span>
                        </div>
                      </div>)}
                  </div>
                </div>}
              {/* Coupon Code */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Apply Coupon
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
                    <TagIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Enter coupon code" className="pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 w-full" value={couponCode} onChange={e => setCouponCode(e.target.value)} />
                  </div>
                  <button onClick={handleApplyCoupon} disabled={!couponCode || isApplyingCoupon} className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors whitespace-nowrap">
                    {isApplyingCoupon ? 'Applying...' : 'Apply Coupon'}
                  </button>
                </div>
                {couponError && <div className="mt-2 text-red-500 flex items-center gap-1 text-sm">
                    <AlertCircleIcon size={14} />
                    {couponError}
                  </div>}
                {discount > 0 && <div className="mt-2 text-green-600 font-medium">
                    Coupon applied! You saved ${discount.toFixed(2)}
                  </div>}
                <div className="mt-2 text-sm text-gray-500">
                  Try codes: "WELCOME10" for 10% off or "SUMMER20" for 20% off
                </div>
              </div>
              {/* Payment Breakdown */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Payment Breakdown
                </h2>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="font-medium">Subtotal:</span>
                      <span className="font-medium">
                        ${calculateSubtotal().toLocaleString()}
                      </span>
                    </div>
                    {discount > 0 && <div className="flex justify-between items-center pb-3 border-b border-gray-200 text-green-600">
                        <span className="font-medium">Discount:</span>
                        <span className="font-medium">
                          -${discount.toFixed(2)}
                        </span>
                      </div>}
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="font-bold text-lg">Total:</span>
                      <span className="font-bold text-lg text-primary-700">
                        ${calculateTotal().toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-2">
                      <h3 className="font-medium mb-3">Payment Schedule:</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200">
                          <div>
                            <div className="font-medium">
                              First Payment (60%)
                            </div>
                            <div className="text-sm text-gray-600">
                              Due at project start
                            </div>
                          </div>
                          <span className="font-bold text-primary-700">
                            ${(calculateTotal() * 0.6).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200">
                          <div>
                            <div className="font-medium">
                              Second Payment (20%)
                            </div>
                            <div className="text-sm text-gray-600">
                              Due at project milestone
                            </div>
                          </div>
                          <span className="font-bold text-primary-700">
                            ${(calculateTotal() * 0.2).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200">
                          <div>
                            <div className="font-medium">
                              Final Payment (20%)
                            </div>
                            <div className="text-sm text-gray-600">
                              Due at project completion
                            </div>
                          </div>
                          <span className="font-bold text-primary-700">
                            ${(calculateTotal() * 0.2).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Payment Options */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Payment Options
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all text-center">
                    <CreditCardIcon size={24} className="mx-auto mb-2 text-primary-600" />
                    <span className="font-medium">Credit Card</span>
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all text-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" alt="PayPal" className="h-6 mx-auto mb-2" />
                    <span className="font-medium">PayPal</span>
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all text-center">
                    <img src="https://cdn.iconscout.com/icon/free/png-256/free-bank-transfer-2-1161078.png" alt="Bank Transfer" className="h-6 mx-auto mb-2" />
                    <span className="font-medium">Bank Transfer</span>
                  </button>
                </div>
              </div>
              {/* Final Actions */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button onClick={downloadPDF} className="px-6 py-3 border-2 border-secondary-600 text-secondary-600 rounded-xl hover:bg-secondary-50 transition-colors flex items-center justify-center gap-2">
                    <DownloadIcon size={18} />
                    Download PDF
                  </button>
                  <button onClick={saveQuotation} className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                    <ArrowRightIcon size={18} />
                    Complete Quotation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '../components/Sidebar';
import { CheckIcon, ClockIcon, XIcon, PlusIcon, MinusIcon, PackagePlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllServices, ServicePackage, PackageAddOn } from '../services/firebaseService';
import toast from 'react-hot-toast';

interface SelectedAddOn extends PackageAddOn {
  selected: boolean;
}

export function ServicesPageNew() {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOn[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const servicesData = await getAllServices();
      setServices(servicesData);
    } catch (error) {
      console.error('Failed to load services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPackage = (service: ServicePackage) => {
    setSelectedPackage(service);
    
    // Initialize add-ons selection
    if (service.addOns && service.addOns.length > 0) {
      setSelectedAddOns(
        service.addOns.map(addon => ({
          ...addon,
          selected: false
        }))
      );
    } else {
      setSelectedAddOns([]);
    }
    
    setIsModalOpen(true);
  };

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev =>
      prev.map(addon =>
        addon.id === addOnId ? { ...addon, selected: !addon.selected } : addon
      )
    );
  };

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!selectedPackage) return 0;
    
    const basePrice = selectedPackage.price;
    const addOnsPrice = selectedAddOns
      .filter(addon => addon.selected)
      .reduce((sum, addon) => sum + addon.price, 0);
    
    return basePrice + addOnsPrice;
  }, [selectedPackage, selectedAddOns]);

  // Calculate total delivery time
  const totalDeliveryTime = useMemo(() => {
    if (!selectedPackage) return 0;
    
    const baseTime = selectedPackage.deliveryTime || 0;
    const addOnsTime = selectedAddOns
      .filter(addon => addon.selected)
      .reduce((sum, addon) => sum + addon.deliveryTime, 0);
    
    return baseTime + addOnsTime;
  }, [selectedPackage, selectedAddOns]);

  const handleProceedToQuotation = () => {
    if (!selectedPackage) return;
    
    // Store selection in localStorage for the quotation page
    const quotationData = {
      package: selectedPackage,
      addOns: selectedAddOns.filter(addon => addon.selected),
      totalPrice,
      totalDeliveryTime
    };
    
    localStorage.setItem('quotationSelection', JSON.stringify(quotationData));
    
    toast.success('Package selected! Proceeding to quotation...');
    setIsModalOpen(false);
    
    // Navigate to quotation page
    navigate('/final-quotation');
  };

  // Group services by category
  const servicesByCategory = useMemo(() => {
    const grouped: Record<string, ServicePackage[]> = {};
    services.forEach(service => {
      if (!grouped[service.category]) {
        grouped[service.category] = [];
      }
      grouped[service.category].push(service);
    });
    return grouped;
  }, [services]);

  if (loading) {
    return (
      <div className="bg-lavender-light min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-lavender-light min-h-screen">
      <Sidebar />
      <div className="sm:pl-20 lg:pl-64 pb-20 sm:pb-0">
        <div className="p-4 sm:p-6">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-800 mb-2">
              Our Services
            </h1>
            <p className="text-gray-600 max-w-2xl">
              From concept to deployment, we provide comprehensive digital solutions tailored to your unique needs.
            </p>
          </div>

          {/* Services by Category */}
          {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
            <section key={category} className="mb-12 bg-white rounded-2xl shadow-retro-lg border border-gray-200 overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-primary-700 mb-3">
                  {category}
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {categoryServices.map((service, index) => (
                    <div
                      key={service.id}
                      className={`border-2 rounded-xl p-5 hover:shadow-retro transition-all h-full flex flex-col ${
                        index === 1 ? 'border-primary-500 bg-primary-50 relative' : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      {index === 1 && (
                        <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                          POPULAR
                        </div>
                      )}

                      <div className="mb-4">
                        <h3 className="font-bold text-lg mb-1">{service.name}</h3>
                        <p className="text-sm text-gray-600 min-h-[48px]">
                          {service.description}
                        </p>
                      </div>

                      <div className="mb-4">
                        <div className="text-2xl font-bold text-primary-700">
                          ${service.price}
                        </div>
                        {service.deliveryTime && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                            <ClockIcon size={14} />
                            <span>{service.deliveryTime} days delivery</span>
                          </div>
                        )}
                      </div>

                      <ul className="space-y-2 mb-6 flex-grow">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <CheckIcon
                              size={18}
                              className="text-primary-600 mr-2 mt-0.5 flex-shrink-0"
                            />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {service.addOns && service.addOns.length > 0 && (
                        <div className="mb-4 p-3 bg-secondary-50 border border-secondary-200 rounded-lg">
                          <div className="flex items-center gap-1 text-sm font-semibold text-secondary-700 mb-1">
                            <PackagePlusIcon size={14} />
                            <span>{service.addOns.length} Add-ons Available</span>
                          </div>
                          <p className="text-xs text-gray-600">
                            Customize your package with additional features
                          </p>
                        </div>
                      )}

                      <button
                        className={`w-full mt-auto px-4 py-2 rounded-lg transition-colors ${
                          index === 1
                            ? 'bg-primary-600 text-white hover:bg-primary-700'
                            : 'bg-primary-600 text-white hover:bg-primary-700'
                        }`}
                        onClick={() => handleSelectPackage(service)}
                      >
                        Select Package
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}

          {services.length === 0 && (
            <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-600 mb-4">No services available at the moment.</p>
              <p className="text-sm text-gray-500">Please check back later or contact support.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add-ons Selection Modal */}
      {isModalOpen && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedPackage.name} Package
                </h2>
                <p className="text-sm text-gray-600">{selectedPackage.category}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XIcon size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Package Details */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Package Includes:</h3>
                    <ul className="space-y-2">
                      {selectedPackage.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <CheckIcon size={16} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="ml-6 text-right">
                    <div className="text-3xl font-bold text-primary-700">${selectedPackage.price}</div>
                    {selectedPackage.deliveryTime && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-2 justify-end">
                        <ClockIcon size={14} />
                        <span>{selectedPackage.deliveryTime} days</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Add-ons Selection */}
              {selectedAddOns.length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Customize Your Package with Add-ons:
                  </h3>
                  <div className="space-y-3">
                    {selectedAddOns.map((addon) => (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddOn(addon.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          addon.selected
                            ? 'border-secondary-500 bg-secondary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
                                  addon.selected
                                    ? 'bg-secondary-500 border-secondary-500'
                                    : 'border-gray-300'
                                }`}
                              >
                                {addon.selected && <CheckIcon size={14} className="text-white" />}
                              </div>
                              <h4 className="font-semibold text-gray-800">{addon.name}</h4>
                            </div>
                            <p className="text-sm text-gray-600 ml-7">{addon.description}</p>
                          </div>
                          <div className="ml-4 text-right flex-shrink-0">
                            <div className="font-bold text-secondary-700">+${addon.price}</div>
                            <div className="text-xs text-gray-600 mt-1">
                              +{addon.deliveryTime} days
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-6 bg-gray-50 rounded-xl text-center">
                  <p className="text-gray-600">No add-ons available for this package.</p>
                </div>
              )}

              {/* Summary */}
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Base Package:</span>
                    <span className="font-medium">${selectedPackage.price}</span>
                  </div>
                  
                  {selectedAddOns.filter(a => a.selected).map((addon) => (
                    <div key={addon.id} className="flex justify-between text-gray-700 text-sm">
                      <span>+ {addon.name}:</span>
                      <span className="font-medium">${addon.price}</span>
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-300 pt-2 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Total Price:</span>
                      <span className="text-2xl font-bold text-primary-700">${totalPrice}</span>
                    </div>
                    {totalDeliveryTime > 0 && (
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-semibold text-gray-700">Estimated Delivery:</span>
                        <div className="flex items-center gap-1 text-primary-700 font-semibold">
                          <ClockIcon size={16} />
                          <span>{totalDeliveryTime} days</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedToQuotation}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                >
                  Proceed to Quotation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

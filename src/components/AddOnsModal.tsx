import React, { useState } from 'react';
import { CheckIcon, PlusIcon, XIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
type AddOnsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: ServicePackage | null;
};
export function AddOnsModal({
  isOpen,
  onClose,
  selectedPackage
}: AddOnsModalProps) {
  const navigate = useNavigate();
  const [addOns, setAddOns] = useState<AddOn[]>([{
    id: 'addon-1',
    name: 'Priority Support',
    description: '24/7 customer support with 4-hour response time',
    price: 99,
    selected: false
  }, {
    id: 'addon-2',
    name: 'SEO Package',
    description: 'Basic SEO optimization for better search engine rankings',
    price: 149,
    selected: false
  }, {
    id: 'addon-3',
    name: 'Content Creation',
    description: 'Professional copywriting for up to 5 pages',
    price: 199,
    selected: false
  }, {
    id: 'addon-4',
    name: 'Analytics Setup',
    description: 'Google Analytics and reporting dashboard setup',
    price: 79,
    selected: false
  }, {
    id: 'addon-5',
    name: 'Extended Support',
    description: 'Additional 30 days of technical support',
    price: 129,
    selected: false
  }]);
  const toggleAddOn = (id: string) => {
    setAddOns(addOns.map(addon => addon.id === id ? {
      ...addon,
      selected: !addon.selected
    } : addon));
  };
  const calculateTotal = () => {
    const packagePrice = selectedPackage?.price || 0;
    const addOnsPrice = addOns.filter(addon => addon.selected).reduce((sum, addon) => sum + addon.price, 0);
    return packagePrice + addOnsPrice;
  };
  const handleContinue = () => {
    if (!selectedPackage) return;
    // Store selected package and add-ons in localStorage
    const selectedAddOns = addOns.filter(addon => addon.selected);
    localStorage.setItem('selectedPackageId', selectedPackage.id);
    localStorage.setItem('selectedAddOns', JSON.stringify(selectedAddOns));
    localStorage.setItem('quotationTotal', calculateTotal().toString());
    // Navigate to final quotation page
    navigate('/final-quotation');
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Enhance Your Package
          </h2>
          <button onClick={onClose} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
            <XIcon size={20} />
          </button>
        </div>
        {selectedPackage && <div className="mb-6 bg-primary-50 rounded-xl p-4 border border-primary-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg text-primary-800">
                Selected Package: {selectedPackage.name}
              </h3>
              <span className="font-bold text-primary-700">
                ${selectedPackage.price}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {selectedPackage.description}
            </p>
          </div>}
        <div className="mb-6">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">
            Select Add-ons (Optional)
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {addOns.map(addon => <div key={addon.id} className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${addon.selected ? 'border-secondary-500 bg-secondary-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => toggleAddOn(addon.id)}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{addon.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {addon.description}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-col items-end">
                    <span className="font-semibold text-secondary-700">
                      ${addon.price}
                    </span>
                    <div className={`mt-2 h-5 w-5 rounded-full flex items-center justify-center ${addon.selected ? 'bg-secondary-500' : 'bg-gray-200'}`}>
                      {addon.selected && <CheckIcon size={14} className="text-white" />}
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-gray-800">Total</h3>
            <div className="text-2xl font-bold text-primary-700">
              ${calculateTotal().toLocaleString()}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button onClick={handleContinue} className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2">
              <PlusIcon size={18} />
              Continue to Final Quote
            </button>
          </div>
        </div>
      </div>
    </div>;
}
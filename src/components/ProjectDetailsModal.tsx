import React, { useEffect, useState } from 'react';
import { XIcon, CheckIcon, CalendarIcon, ClockIcon, PlusIcon, SaveIcon, AlertCircleIcon } from 'lucide-react';
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
  selected?: boolean;
};
type Project = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  status: 'active' | 'pending' | 'completed';
  servicePackage: ServicePackage;
  addOns: AddOn[];
  progress: number;
  nextMilestone: string;
  nextPaymentDate: string;
  nextPaymentAmount: number;
};
type ProjectDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onUpdateProject: (updatedProject: Project) => void;
};
export function ProjectDetailsModal({
  isOpen,
  onClose,
  project,
  onUpdateProject
}: ProjectDetailsModalProps) {
  const [availableAddOns, setAvailableAddOns] = useState<AddOn[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [originalTotal, setOriginalTotal] = useState(0);
  const [newTotal, setNewTotal] = useState(0);
  const [estimatedDeliveryExtension, setEstimatedDeliveryExtension] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  useEffect(() => {
    if (project) {
      // Get the project's current add-ons
      const currentAddOnIds = project.addOns.map(addon => addon.id);
      // Load all available add-ons
      const allAddOns: AddOn[] = [{
        id: 'addon-1',
        name: 'Priority Support',
        description: '24/7 customer support with 4-hour response time',
        price: 99
      }, {
        id: 'addon-2',
        name: 'SEO Package',
        description: 'Basic SEO optimization for better search engine rankings',
        price: 149
      }, {
        id: 'addon-3',
        name: 'Content Creation',
        description: 'Professional copywriting for up to 5 pages',
        price: 199
      }, {
        id: 'addon-4',
        name: 'Analytics Setup',
        description: 'Google Analytics and reporting dashboard setup',
        price: 79
      }, {
        id: 'addon-5',
        name: 'Extended Support',
        description: 'Additional 30 days of technical support',
        price: 129
      }];
      // Filter out add-ons the project already has
      const availableAddOns = allAddOns.filter(addon => !currentAddOnIds.includes(addon.id));
      setAvailableAddOns(availableAddOns);
      // Calculate original total
      const packagePrice = project.servicePackage.price;
      const addOnsPrice = project.addOns.reduce((sum, addon) => sum + addon.price, 0);
      setOriginalTotal(packagePrice + addOnsPrice);
      setNewTotal(packagePrice + addOnsPrice);
      // Reset selected add-ons
      setSelectedAddOns([]);
      setEstimatedDeliveryExtension(0);
      setSuccessMessage('');
    }
  }, [project, isOpen]);
  const toggleAddOn = (addon: AddOn) => {
    const isSelected = selectedAddOns.some(a => a.id === addon.id);
    if (isSelected) {
      // Remove add-on
      const updatedAddOns = selectedAddOns.filter(a => a.id !== addon.id);
      setSelectedAddOns(updatedAddOns);
      // Update total price
      setNewTotal(originalTotal + updatedAddOns.reduce((sum, a) => sum + a.price, 0));
      // Update delivery extension (7 days per add-on)
      setEstimatedDeliveryExtension(updatedAddOns.length * 7);
    } else {
      // Add add-on
      const updatedAddOns = [...selectedAddOns, addon];
      setSelectedAddOns(updatedAddOns);
      // Update total price
      setNewTotal(originalTotal + updatedAddOns.reduce((sum, a) => sum + a.price, 0));
      // Update delivery extension (7 days per add-on)
      setEstimatedDeliveryExtension(updatedAddOns.length * 7);
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const calculateNewDeliveryDate = () => {
    if (!project) return '';
    // Parse the next payment date as an estimate for the current delivery timeline
    const currentDate = new Date(project.nextPaymentDate);
    // Add the extension days
    currentDate.setDate(currentDate.getDate() + estimatedDeliveryExtension);
    return formatDate(currentDate.toISOString());
  };
  const handleSubmit = () => {
    if (!project) return;
    setIsSubmitting(true);
    // Simulate API call with timeout
    setTimeout(() => {
      // Create updated project with new add-ons
      const updatedProject = {
        ...project,
        addOns: [...project.addOns, ...selectedAddOns],
        // Update next payment date to reflect new delivery timeline
        nextPaymentDate: new Date(new Date(project.nextPaymentDate).getTime() + estimatedDeliveryExtension * 24 * 60 * 60 * 1000).toISOString(),
        // Update next payment amount to reflect the new price
        nextPaymentAmount: newTotal * 0.2 // Assuming 20% is the next payment
      };
      onUpdateProject(updatedProject);
      setSuccessMessage('Add-ons added successfully! Your project has been updated.');
      setIsSubmitting(false);
    }, 1000);
  };
  if (!isOpen || !project) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">{project.name}</h2>
          <button onClick={onClose} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
            <XIcon size={20} />
          </button>
        </div>
        {/* Content */}
        <div className="p-6">
          {successMessage && <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start">
              <CheckIcon size={20} className="text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-green-800">{successMessage}</p>
            </div>}
          {/* Project Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Project Details
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-gray-700 mb-2">{project.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <CalendarIcon size={16} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">
                      {formatDate(project.startDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <ClockIcon size={16} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Next Milestone</p>
                    <p className="font-medium">{project.nextMilestone}</p>
                  </div>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Project Progress
                  </span>
                  <span className="text-sm font-medium text-primary-600">
                    {project.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-primary-600 h-2.5 rounded-full" style={{
                  width: `${project.progress}%`
                }}></div>
                </div>
              </div>
            </div>
          </div>
          {/* Current Package & Add-ons */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Current Package & Add-ons
            </h3>
            <div className="bg-primary-50 rounded-xl p-4 border border-primary-200 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-primary-800">
                    {project.servicePackage.category} -{' '}
                    {project.servicePackage.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {project.servicePackage.description}
                  </p>
                </div>
                <span className="font-bold text-primary-700">
                  ${project.servicePackage.price}
                </span>
              </div>
            </div>
            {project.addOns.length > 0 ? <div className="space-y-3">
                {project.addOns.map(addon => <div key={addon.id} className="bg-secondary-50 rounded-xl p-4 border border-secondary-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {addon.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {addon.description}
                        </p>
                      </div>
                      <span className="font-bold text-secondary-700">
                        ${addon.price}
                      </span>
                    </div>
                  </div>)}
              </div> : <p className="text-gray-500 italic">
                No add-ons currently selected
              </p>}
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
              <span className="font-medium">Current Total</span>
              <span className="font-bold text-primary-700">
                ${originalTotal}
              </span>
            </div>
          </div>
          {/* Available Add-ons */}
          {availableAddOns.length > 0 && <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Add New Add-ons
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {availableAddOns.map(addon => <div key={addon.id} onClick={() => toggleAddOn(addon)} className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedAddOns.some(a => a.id === addon.id) ? 'border-secondary-500 bg-secondary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {addon.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {addon.description}
                        </p>
                      </div>
                      <div className="ml-4 flex flex-col items-end">
                        <span className="font-semibold text-secondary-700">
                          ${addon.price}
                        </span>
                        <div className={`mt-2 h-5 w-5 rounded-full flex items-center justify-center ${selectedAddOns.some(a => a.id === addon.id) ? 'bg-secondary-500' : 'bg-gray-200'}`}>
                          {selectedAddOns.some(a => a.id === addon.id) && <CheckIcon size={14} className="text-white" />}
                        </div>
                      </div>
                    </div>
                  </div>)}
              </div>
              {selectedAddOns.length > 0 && <div className="mt-6 bg-cream-light rounded-xl p-4 border border-secondary-200">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Summary of Changes
                  </h4>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>New Total:</span>
                      <span className="font-bold text-primary-700">
                        ${newTotal}
                        <span className="text-sm text-green-600 ml-1">
                          (+${newTotal - originalTotal})
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Delivery Extension:</span>
                      <span className="font-bold text-primary-700">
                        {estimatedDeliveryExtension} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>New Estimated Completion:</span>
                      <span className="font-bold text-primary-700">
                        {calculateNewDeliveryDate()}
                      </span>
                    </div>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 flex items-start">
                    <AlertCircleIcon size={18} className="text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      Adding these add-ons will extend your project timeline and
                      update your payment schedule.
                    </p>
                  </div>
                </div>}
            </div>}
        </div>
        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          {selectedAddOns.length > 0 && <button onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2">
              {isSubmitting ? <>Processing...</> : <>
                  <SaveIcon size={18} />
                  Add Selected Add-ons
                </>}
            </button>}
        </div>
      </div>
    </div>;
}
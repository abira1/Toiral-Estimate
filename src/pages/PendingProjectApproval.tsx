import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeftIcon, CheckIcon, ChevronRightIcon, PlusIcon, XIcon } from 'lucide-react';
import { AddOnsSelectionModal } from '../components/AddOnsSelectionModal';
import { getProjectSetupByClient } from '../services/workflowService';
import { ProjectSetup, ProjectAddOn, Coupon } from '../types/workflow';
import toast from 'react-hot-toast';

type ServicePackage = {
  id: string;
  category: string;
  name: string;
  price: number;
  description: string;
  features: string[];
};
type PendingProject = {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  servicePackage: ServicePackage;
  customPrice?: number;
  notes?: string;
};
export function PendingProjectApproval() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pendingProject, setPendingProject] = useState<PendingProject | null>(null);
  const [projectSetup, setProjectSetup] = useState<ProjectSetup | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<ProjectAddOn[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [finalPrice, setFinalPrice] = useState(0);
  const [finalDeliveryTime, setFinalDeliveryTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddOnsModal, setShowAddOnsModal] = useState(false);
  useEffect(() => {
    loadPendingProject();
  }, [navigate, user]);

  const loadPendingProject = async () => {
    try {
      // First try to load from localStorage (for backward compatibility)
      const storedProject = localStorage.getItem('pendingProject');
      if (storedProject) {
        const project = JSON.parse(storedProject);
        setPendingProject(project);
        setFinalPrice(project.customPrice || project.servicePackage.price);
        setFinalDeliveryTime(14); // Default delivery time
      }

      // Also try to load from workflow system if user is available
      if (user?.id) {
        const setup = await getProjectSetupByClient(user.id);
        if (setup && setup.status === 'sent_to_client') {
          setProjectSetup(setup);
          
          // If no localStorage project, create one from the setup
          if (!storedProject) {
            const projectFromSetup: PendingProject = {
              id: setup.id,
              name: setup.projectName,
              description: setup.description,
              createdDate: setup.createdAt,
              servicePackage: {
                id: 'custom',
                category: 'Custom Project',
                name: setup.projectName,
                price: setup.basePrice,
                description: setup.description,
                features: setup.features
              },
              customPrice: setup.basePrice
            };
            setPendingProject(projectFromSetup);
            setFinalPrice(setup.basePrice);
            setFinalDeliveryTime(setup.baseDeadline);
          }
        }
      }

      if (!storedProject && (!user?.id || !projectSetup)) {
        // If there's no pending project, redirect to projects page
        navigate('/my-projects');
        return;
      }

    } catch (error) {
      console.error('Error loading pending project:', error);
      toast.error('Failed to load pending project');
    } finally {
      setIsLoading(false);
    }
  };
  const handleOpenAddOnsModal = () => {
    setShowAddOnsModal(true);
  };

  const handleAddOnsConfirm = (addOns: ProjectAddOn[], coupon: Coupon | null, price: number, deliveryTime: number) => {
    setSelectedAddOns(addOns);
    setAppliedCoupon(coupon);
    setFinalPrice(price);
    setFinalDeliveryTime(deliveryTime);
    setShowAddOnsModal(false);
    toast.success('Add-ons selection updated!');
  };

  const calculateTotal = () => {
    return finalPrice;
  };

  const handleContinue = () => {
    if (!pendingProject) return;
    
    // Navigate to final quotation review with all the data
    navigate('/final-quotation-review', {
      state: {
        basePrice: pendingProject.customPrice || pendingProject.servicePackage.price,
        selectedAddOns: selectedAddOns,
        appliedCoupon: appliedCoupon,
        finalPrice: finalPrice,
        finalDeliveryTime: finalDeliveryTime,
        projectName: pendingProject.name,
        projectId: pendingProject.id
      }
    });
  };
  const handleCancel = () => {
    // Clear the pending project from localStorage
    localStorage.removeItem('pendingProject');
    // Navigate back to projects
    navigate('/my-projects');
  };
  if (isLoading || !pendingProject) {
    return <div className="bg-lavender-light min-h-screen">
        <Sidebar />
        <div className="sm:pl-20 lg:pl-64 p-6 flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>;
  }
  return <div className="bg-lavender-light min-h-screen">
      <Sidebar />
      <div className="sm:pl-20 lg:pl-64 pb-20 sm:pb-0">
        <div className="p-4 sm:p-6">
          <button onClick={handleCancel} className="flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-6">
            <ArrowLeftIcon size={18} className="mr-2" />
            Back to My Projects
          </button>
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Review Custom Package
            </h1>
            <p className="text-gray-600">
              Review your custom package and select any additional add-ons
            </p>
          </div>
          {/* Package Details */}
          <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <span className="flex h-6 w-6 bg-primary-100 rounded-full items-center justify-center mr-2">
                <span className="text-primary-600">1</span>
              </span>
              Custom Package Details
            </h2>
            <div className="bg-primary-50 rounded-xl p-4 border border-primary-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-800">
                    {pendingProject.servicePackage.category} -{' '}
                    {pendingProject.servicePackage.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {pendingProject.servicePackage.description}
                  </p>
                </div>
                <div className="text-right">
                  {pendingProject.customPrice ? <>
                      <span className="font-bold text-xl text-primary-700">
                        ${pendingProject.customPrice}
                      </span>
                      <div className="text-xs text-green-600 line-through">
                        ${pendingProject.servicePackage.price}
                      </div>
                    </> : <span className="font-bold text-xl text-primary-700">
                      ${pendingProject.servicePackage.price}
                    </span>}
                </div>
              </div>
              <h4 className="font-medium text-gray-700 mb-2 mt-4">
                Included Features:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pendingProject.servicePackage.features.map((feature, index) => <div key={index} className="flex items-start">
                      <CheckIcon size={16} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>)}
              </div>
              {pendingProject.notes && <div className="mt-4 pt-4 border-t border-primary-200">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Admin Notes:
                  </h4>
                  <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-primary-100">
                    {pendingProject.notes}
                  </p>
                </div>}
            </div>
          </div>
          {/* Add-ons Section */}
          <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <span className="flex h-6 w-6 bg-primary-100 rounded-full items-center justify-center mr-2">
                <span className="text-primary-600">2</span>
              </span>
              Customize with Add-ons
            </h2>
            
            {selectedAddOns.length > 0 ? (
              <div className="space-y-3 mb-4">
                <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-4">
                  <h4 className="font-medium text-secondary-800 mb-2">
                    Selected Add-ons ({selectedAddOns.length})
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {selectedAddOns.map(addon => (
                      <div key={addon.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <CheckIcon size={14} className="text-secondary-600 mr-2" />
                          <span>{addon.name}</span>
                        </div>
                        <span className="font-semibold text-secondary-700">+${addon.price}</span>
                      </div>
                    ))}
                  </div>
                  {appliedCoupon && (
                    <div className="mt-3 pt-3 border-t border-secondary-200">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-green-600">
                          <CheckIcon size={14} className="mr-2" />
                          <span>Coupon: {appliedCoupon.code}</span>
                        </div>
                        <span className="font-semibold text-green-600">
                          -{appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discount}%` : `$${appliedCoupon.discount}`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-4 text-center">
                <PlusIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">No add-ons selected</p>
                <p className="text-sm text-gray-500">Enhance your project with additional features and services</p>
              </div>
            )}
            
            <button
              onClick={handleOpenAddOnsModal}
              className="w-full bg-secondary-600 text-white px-6 py-3 rounded-xl hover:bg-secondary-700 transition-colors flex items-center justify-center gap-2"
            >
              <PlusIcon size={18} />
              {selectedAddOns.length > 0 ? 'Modify Add-ons & Coupons' : 'Select Add-ons & Apply Coupons'}
            </button>
          </div>
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <span className="flex h-6 w-6 bg-primary-100 rounded-full items-center justify-center mr-2">
                <span className="text-primary-600">3</span>
              </span>
              Order Summary
            </h2>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="font-medium">Package Price:</span>
                <span className="font-medium">
                  $
                  {pendingProject.customPrice || pendingProject.servicePackage.price}
                </span>
              </div>
              {addOns.some(addon => addon.selected) && <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-medium">Selected Add-ons:</span>
                  <span className="font-medium">
                    $
                    {addOns.filter(a => a.selected).reduce((sum, a) => sum + a.price, 0)}
                  </span>
                </div>}
              <div className="flex justify-between items-center pt-3">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-lg text-primary-700">
                  ${calculateTotal()}
                </span>
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button onClick={handleCancel} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              <XIcon size={18} />
              Cancel
            </button>
            <button onClick={handleContinue} className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
              Continue to Final Quote
              <ChevronRightIcon size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>;
}
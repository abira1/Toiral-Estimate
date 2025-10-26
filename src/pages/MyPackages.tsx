import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { 
  getUserPackageAssignments, 
  addAddOnToPackage,
  getAddOns 
} from '../services/packageAssignmentService';
import { UserPackageAssignment, PackageAddOn } from '../types/packages';
import { generateQuotationPDF } from '../services/quotationPDFService';
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  Download, 
  Plus,
  CheckCircle,
  Clock,
  Calendar,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export function MyPackages() {
  const { currentUser } = useAuth();
  const [packages, setPackages] = useState<UserPackageAssignment[]>([]);
  const [addOns, setAddOns] = useState<PackageAddOn[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<UserPackageAssignment | null>(null);
  const [showAddOnModal, setShowAddOnModal] = useState(false);

  useEffect(() => {
    loadPackages();
  }, [currentUser]);

  const loadPackages = async () => {
    try {
      if (!currentUser?.uid) return;
      
      const [packagesData, addOnsData] = await Promise.all([
        getUserPackageAssignments(currentUser.uid),
        getAddOns()
      ]);
      
      setPackages(packagesData);
      setAddOns(addOnsData);
    } catch (error) {
      console.error('Error loading packages:', error);
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQuotation = (pkg: UserPackageAssignment) => {
    try {
      generateQuotationPDF(pkg);
      toast.success('Quotation downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate quotation PDF');
    }
  };

  const handleOpenAddOnModal = (pkg: UserPackageAssignment) => {
    setSelectedPackage(pkg);
    setShowAddOnModal(true);
  };

  const handleAddAddOn = async (addOnId: string) => {
    if (!selectedPackage) return;

    try {
      await addAddOnToPackage(selectedPackage.id, addOnId);
      toast.success('Add-on added successfully!');
      setShowAddOnModal(false);
      loadPackages();
    } catch (error: any) {
      console.error('Error adding add-on:', error);
      toast.error(error.message || 'Failed to add add-on');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const availableAddOns = addOns.filter(addOn => 
    !selectedPackage?.selectedAddOns.some(selected => selected.id === addOn.id)
  );

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

  return (
    <div className="bg-lavender-light min-h-screen">
      <Sidebar />
      <main className="sm:pl-20 lg:pl-64 pb-20 sm:pb-0">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              My Packages
            </h1>
            <p className="text-gray-600">
              Track your packages, progress, and payments
            </p>
          </div>

          {/* Packages List */}
          {packages.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-retro border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-lavender rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No packages assigned yet
              </h3>
              <p className="text-gray-600 mb-6">
                When packages are assigned to you, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 overflow-hidden">
                  {/* Package Header */}
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Package size={24} />
                          <h2 className="text-2xl font-bold">
                            {pkg.packageCategory}
                          </h2>
                        </div>
                        <p className="text-xl opacity-90">{pkg.packageName}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pkg.status)} bg-white`}>
                          {pkg.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Description */}
                    <p className="text-gray-600 mb-6">{pkg.packageDescription}</p>

                    {/* Progress Section */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <TrendingUp size={20} className="text-blue-600" />
                          Project Progress
                        </h3>
                        <span className="text-2xl font-bold text-primary-600">
                          {pkg.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className={`h-4 rounded-full transition-all ${getProgressColor(pkg.progress)}`}
                          style={{ width: `${pkg.progress}%` }}
                        ></div>
                      </div>
                      
                      {/* Milestones */}
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {pkg.projectMilestones.slice(0, 4).map((milestone) => (
                          <div key={milestone.id} className="flex items-center gap-2 text-sm">
                            {milestone.status === 'completed' ? (
                              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                            ) : milestone.status === 'in_progress' ? (
                              <Clock size={16} className="text-blue-500 flex-shrink-0" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
                            )}
                            <span className={milestone.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-700'}>
                              {milestone.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Tracking */}
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <DollarSign size={20} className="text-blue-600" />
                        Payment Tracking
                      </h3>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-xl font-bold text-gray-800">
                            ${pkg.totalPrice.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Paid</p>
                          <p className="text-xl font-bold text-green-600">
                            ${pkg.totalPaid.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Remaining</p>
                          <p className="text-xl font-bold text-orange-600">
                            ${pkg.remainingBalance.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Progress</p>
                          <p className="text-xl font-bold text-blue-600">
                            {Math.round((pkg.totalPaid / pkg.totalPrice) * 100)}%
                          </p>
                        </div>
                      </div>

                      {/* Next Payment */}
                      {pkg.nextPaymentDue && pkg.nextPaymentAmount && (
                        <div className="bg-white border border-blue-300 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Next Payment Due</p>
                              <p className="text-lg font-bold text-primary-600">
                                ${pkg.nextPaymentAmount.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(pkg.nextPaymentDue).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Package Details */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {/* Base Package */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-800 mb-3">Base Package</h4>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700">{pkg.packageName}</span>
                          <span className="font-semibold text-gray-800">${pkg.basePrice.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Add-ons */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-gray-800">Add-ons</h4>
                          <button
                            onClick={() => handleOpenAddOnModal(pkg)}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                          >
                            <Plus size={14} />
                            Add More
                          </button>
                        </div>
                        {pkg.selectedAddOns.length === 0 ? (
                          <p className="text-gray-500 text-sm">No add-ons selected</p>
                        ) : (
                          <div className="space-y-2">
                            {pkg.selectedAddOns.map((addOn) => (
                              <div key={addOn.id} className="flex justify-between items-center">
                                <span className="text-sm text-gray-700">{addOn.name}</span>
                                <span className="text-sm font-semibold text-gray-800">
                                  ${addOn.price.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="mb-6 grid sm:grid-cols-3 gap-4">
                      {pkg.assignedDate && (
                        <div>
                          <p className="text-sm text-gray-600">Assigned Date</p>
                          <p className="font-medium text-gray-800">
                            {new Date(pkg.assignedDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {pkg.startDate && (
                        <div>
                          <p className="text-sm text-gray-600">Start Date</p>
                          <p className="font-medium text-gray-800">
                            {new Date(pkg.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {pkg.expectedCompletionDate && (
                        <div>
                          <p className="text-sm text-gray-600">Expected Completion</p>
                          <p className="font-medium text-gray-800">
                            {new Date(pkg.expectedCompletionDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {pkg.notes && (
                      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Notes</h4>
                        <p className="text-gray-700 text-sm">{pkg.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDownloadQuotation(pkg)}
                        className="flex-1 bg-primary-600 text-white px-4 py-3 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download size={18} />
                        Download Quotation PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add-on Modal */}
      {showAddOnModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add Extra Features</h2>
              <button onClick={() => setShowAddOnModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            {availableAddOns.length === 0 ? (
              <p className="text-center text-gray-500 py-8">All available add-ons have been added</p>
            ) : (
              <div className="grid gap-4">
                {availableAddOns.map((addOn) => (
                  <div key={addOn.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-primary-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-800 mb-1">{addOn.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{addOn.description}</p>
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {addOn.category}
                        </span>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xl font-bold text-primary-600 mb-2">
                          ${addOn.price}
                        </p>
                        <button
                          onClick={() => handleAddAddOn(addOn.id)}
                          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
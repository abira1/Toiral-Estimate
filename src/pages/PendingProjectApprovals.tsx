import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeftIcon, 
  CheckIcon, 
  ChevronRightIcon, 
  Calendar,
  DollarSign,
  Clock,
  AlertCircle,
  FileText
} from 'lucide-react';
import { 
  getClientDashboardData,
  getProjectSetupByClient 
} from '../services/workflowService';
import { ClientQuotation, ProjectSetup } from '../types/workflow';
import toast from 'react-hot-toast';

interface PendingProjectItem {
  id: string;
  type: 'quotation' | 'project_setup';
  title: string;
  description: string;
  price: number;
  createdDate: string;
  status: string;
  data: ClientQuotation | ProjectSetup;
}

export function PendingProjectApprovals() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [pendingItems, setPendingItems] = useState<PendingProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingApprovals();
  }, [user]);

  const loadPendingApprovals = async () => {
    try {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const items: PendingProjectItem[] = [];

      // Load pending quotations from workflow system
      const dashboardData = await getClientDashboardData(user.id);
      
      // Add pending quotations
      dashboardData.pendingApprovals.forEach((quotation) => {
        items.push({
          id: quotation.id,
          type: 'quotation',
          title: `Project Quotation #${quotation.id.slice(-6)}`,
          description: 'Review and approve your project quotation with selected add-ons',
          price: quotation.finalPrice,
          createdDate: quotation.createdAt,
          status: quotation.status,
          data: quotation
        });
      });

      // Check for pending project setup
      const projectSetup = await getProjectSetupByClient(user.id);
      if (projectSetup && projectSetup.status === 'sent_to_client') {
        items.push({
          id: projectSetup.id,
          type: 'project_setup',
          title: projectSetup.projectName,
          description: projectSetup.description,
          price: projectSetup.basePrice,
          createdDate: projectSetup.createdAt,
          status: projectSetup.status,
          data: projectSetup
        });
      }

      setPendingItems(items);

    } catch (error) {
      console.error('Error loading pending approvals:', error);
      toast.error('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveItem = (item: PendingProjectItem) => {
    if (item.type === 'project_setup') {
      // Store project setup for the approval flow
      const projectSetup = item.data as ProjectSetup;
      localStorage.setItem('pendingProject', JSON.stringify({
        id: projectSetup.id,
        name: projectSetup.projectName,
        description: projectSetup.description,
        createdDate: projectSetup.createdAt,
        servicePackage: {
          id: 'custom',
          category: 'Custom Project',
          name: projectSetup.projectName,
          price: projectSetup.basePrice,
          description: projectSetup.description,
          features: projectSetup.features
        },
        customPrice: projectSetup.basePrice,
        addOns: projectSetup.addOns
      }));
      navigate('/pending-project-approval');
    } else if (item.type === 'quotation') {
      // Handle quotation approval
      const quotation = item.data as ClientQuotation;
      navigate(`/project-approval-details/${quotation.id}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return (
          <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending Review
          </span>
        );
      case 'sent_to_client':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Awaiting Approval
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            {status.replace('_', ' ')}
          </span>
        );
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

  return (
    <div className="bg-lavender-light min-h-screen">
      <Sidebar />
      <div className="sm:pl-20 lg:pl-64 pb-20 sm:pb-0">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-6"
          >
            <ArrowLeftIcon size={18} className="mr-2" />
            Back to Dashboard
          </button>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Pending Project Approvals
            </h1>
            <p className="text-gray-600">
              Review and approve your project quotations and custom packages
            </p>
          </div>

          {/* Pending Items */}
          {pendingItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-12 text-center">
              <CheckIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                All Caught Up! 🎉
              </h3>
              <p className="text-gray-600 mb-6">
                You don't have any pending project approvals at the moment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/services')}
                  className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText size={18} />
                  Browse Services
                </button>
                <button
                  onClick={() => navigate('/my-projects')}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  View My Projects
                  <ChevronRightIcon size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {item.title}
                          </h3>
                          {getStatusBadge(item.status)}
                        </div>
                        <p className="text-gray-600 mb-3">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Created: {new Date(item.createdDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            Value: ${item.price}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Project Details Preview */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <h4 className="font-medium text-gray-800 mb-2">Project Details:</h4>
                      {item.type === 'project_setup' ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(item.data as ProjectSetup).features.slice(0, 4).map((feature, index) => (
                              <div key={index} className="flex items-center text-sm">
                                <CheckIcon size={14} className="text-green-600 mr-2 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                          {(item.data as ProjectSetup).features.length > 4 && (
                            <p className="text-xs text-gray-500 mt-2">
                              +{(item.data as ProjectSetup).features.length - 4} more features
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Base Price:</span>
                            <span>${(item.data as ClientQuotation).basePrice}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Add-ons:</span>
                            <span>${(item.data as ClientQuotation).addOnsTotal}</span>
                          </div>
                          {(item.data as ClientQuotation).discountAmount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                              <span>Discount:</span>
                              <span>-${(item.data as ClientQuotation).discountAmount}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm font-medium pt-2 border-t">
                            <span>Final Total:</span>
                            <span>${(item.data as ClientQuotation).finalPrice}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleApproveItem(item)}
                        className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                      >
                        Review & Approve
                        <ChevronRightIcon size={18} />
                      </button>
                      <button
                        onClick={() => {
                          if (item.type === 'project_setup') {
                            navigate('/my-projects');
                          } else {
                            navigate('/my-quotations');
                          }
                        }}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <FileText size={16} />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">
                  How Project Approvals Work
                </h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Review project details, features, and pricing</p>
                  <p>• Select additional add-ons if needed</p>
                  <p>• Apply any available coupons for discounts</p>
                  <p>• Approve to move your project to the active development stage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
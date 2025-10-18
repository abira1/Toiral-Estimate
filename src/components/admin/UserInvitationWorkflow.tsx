import React, { useState, useEffect } from 'react';
import { Mail, Eye, Copy, Send, CheckCircle, Clock, User, Code, X } from 'lucide-react';
import { getClient, getProjectSetupByClient, sendClientInvitation } from '../../services/workflowService';
import { sendInvitationEmail } from '../../services/emailService';
import { Client, ProjectSetup } from '../../types/workflow';
import toast from 'react-hot-toast';

interface UserInvitationWorkflowProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  projectId: string;
}

export function UserInvitationWorkflow({ isOpen, onClose, clientId, projectId }: UserInvitationWorkflowProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [project, setProject] = useState<ProjectSetup | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [invitationSent, setInvitationSent] = useState(false);
  const [accessCode, setAccessCode] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, clientId, projectId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [clientData, projectData] = await Promise.all([
        getClient(clientId),
        getProjectSetupByClient(clientId)
      ]);
      
      setClient(clientData);
      setProject(projectData);
      
      if (clientData?.accessCode) {
        setAccessCode(clientData.accessCode);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load client or project information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInvitation = async () => {
    if (!client || !project) {
      toast.error('Client or project information not available');
      return;
    }

    setIsSending(true);
    
    try {
      // Send client invitation and get/generate access code
      const generatedAccessCode = await sendClientInvitation(client.id, project.id);
      setAccessCode(generatedAccessCode);
      
      // Send email invitation
      await sendInvitationEmail(
        client.email,
        client.name,
        generatedAccessCode,
        project.projectName,
        'Admin User' // TODO: Get actual admin name
      );
      
      setInvitationSent(true);
      toast.success(`Invitation sent successfully to ${client.email}!`);
      
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const calculateTotalAddOnsPrice = () => {
    if (!project?.addOns) return 0;
    return project.addOns.reduce((total, addon) => total + addon.price, 0);
  };

  const calculateMaxDeliveryTime = () => {
    if (!project?.addOns) return project?.baseDeadline || 0;
    const maxAddOnTime = Math.max(...project.addOns.map(addon => addon.extraDeliveryTime), 0);
    return (project?.baseDeadline || 0) + maxAddOnTime;
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading client and project information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Mail className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">User Invitation Workflow</h2>
              <p className="text-sm text-gray-500">
                Send invitation to client and manage access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Client Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Client Information
            </h3>
            {client && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Name</p>
                  <p className="text-blue-900">{client.name}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 font-medium">Email</p>
                  <p className="text-blue-900">{client.email}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 font-medium">Client Code</p>
                  <p className="text-blue-900 font-mono bg-white px-2 py-1 rounded">{client.clientCode}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 font-medium">Phone</p>
                  <p className="text-blue-900">{client.phone || 'Not provided'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Project Summary */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-medium text-green-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Project Summary
            </h3>
            {project && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-green-700 font-medium">Project Name</p>
                  <p className="text-green-900 font-medium">{project.projectName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-green-700 font-medium">Description</p>
                  <p className="text-green-900">{project.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-green-700 font-medium">Base Price</p>
                    <p className="text-green-900 font-bold">${project.basePrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700 font-medium">Base Deadline</p>
                    <p className="text-green-900 font-bold">{project.baseDeadline} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700 font-medium">Add-ons Available</p>
                    <p className="text-green-900 font-bold">{project.addOns?.length || 0}</p>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <p className="text-sm text-green-700 font-medium mb-2">Features Included</p>
                  <ul className="space-y-1">
                    {project.features.map((feature, index) => (
                      <li key={index} className="text-green-900 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Add-ons Preview */}
                {project.addOns && project.addOns.length > 0 && (
                  <div>
                    <p className="text-sm text-green-700 font-medium mb-2">Available Add-ons</p>
                    <div className="space-y-2">
                      {project.addOns.map((addon, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border border-green-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">{addon.name}</p>
                              <p className="text-sm text-gray-600">{addon.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">+${addon.price}</p>
                              <p className="text-xs text-gray-500">+{addon.extraDeliveryTime} days</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coupons Preview */}
                {project.availableCoupons && project.availableCoupons.length > 0 && (
                  <div>
                    <p className="text-sm text-green-700 font-medium mb-2">Available Coupons</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {project.availableCoupons.map((coupon, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border border-green-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-mono font-bold text-orange-600">{coupon.code}</p>
                              <p className="text-xs text-gray-600">{coupon.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-orange-600">
                                {coupon.discountType === 'percentage' ? `${coupon.discount}%` : `$${coupon.discount}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Invitation Actions */}
          <div className="border-2 border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Invitation Actions</h3>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Send Invitation */}
              <div className="flex-1">
                <button
                  onClick={handleSendInvitation}
                  disabled={isSending || invitationSent}
                  className="w-full py-4 px-6 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-3"
                >
                  {isSending ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending Invitation...
                    </>
                  ) : invitationSent ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Invitation Sent
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Invitation Email
                    </>
                  )}
                </button>
                
                <p className="text-sm text-gray-500 mt-2 text-center">
                  {invitationSent ? 
                    `Email sent to ${client?.email}` : 
                    'Client will receive email with login instructions'
                  }
                </p>
              </div>

              {/* View Client Code */}
              <div className="flex-1">
                <div className="border-2 border-gray-300 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Client Access Code</span>
                    </div>
                    {accessCode && (
                      <button
                        onClick={() => copyToClipboard(accessCode)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Copy access code"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  {accessCode ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-mono text-xl font-bold text-center text-gray-900">{accessCode}</p>
                      <p className="text-sm text-gray-500 text-center mt-2">
                        Share this code with the client for login
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">
                        Access code will be generated when invitation is sent
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Email Content Preview */}
          {client && project && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Email Content Preview
              </h3>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Subject:</p>
                  <p className="font-medium">Project Invitation: {project.projectName}</p>
                </div>
                
                <div className="text-gray-800 space-y-3">
                  <p>Dear {client.name},</p>
                  
                  <p>
                    We're excited to invite you to review and approve your project quotation 
                    for "<strong>{project.projectName}</strong>".
                  </p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-medium">Your login credentials:</p>
                    <p>Access Code: <span className="font-mono font-bold">{accessCode || '[WILL_BE_GENERATED]'}</span></p>
                    <p>Login URL: <span className="text-blue-600">http://localhost:3001</span></p>
                  </div>
                  
                  <p>
                    Once logged in, you can:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Review your project details and features</li>
                    <li>Select optional add-ons to customize your package</li>
                    <li>Apply discount coupons if available</li>
                    <li>Approve the final quotation to start your project</li>
                  </ul>
                  
                  <p>
                    If you have any questions, please don't hesitate to reach out to us.
                  </p>
                  
                  <p>
                    Best regards,<br />
                    The Toiral Team
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              {invitationSent ? 'Close' : 'Cancel'}
            </button>
            
            {invitationSent && (
              <button
                onClick={() => {
                  onClose();
                  // Could redirect to client overview or project management
                }}
                className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
              >
                Go to Client Overview
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
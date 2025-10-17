import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { BriefcaseIcon, CalendarIcon, ClockIcon, CheckCircleIcon, AlertCircleIcon, ExternalLinkIcon, FileTextIcon, PlusIcon, ArrowRightIcon, PackageIcon, DollarSignIcon, CheckIcon, XIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProjectDetailsModal } from '../components/ProjectDetailsModal';
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
type PendingProject = {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  servicePackage: ServicePackage;
  customPrice?: number;
  notes?: string;
};
export function MyProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [pendingProjects, setPendingProjects] = useState<PendingProject[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    // In a real app, this would be fetched from an API
    // For now, we'll use mock data
    const mockProjects: Project[] = [{
      id: '1',
      name: 'Company Website Redesign',
      description: 'Complete overhaul of corporate website with new branding',
      startDate: '2023-06-15',
      status: 'active',
      servicePackage: {
        id: 'web-premium',
        category: 'Web & App Design',
        name: 'Premium',
        price: 500,
        description: 'For large organizations with complex design needs.',
        features: ['Complete website/app design (unlimited pages/screens)', 'Detailed design system (colors, typography, buttons, icons)', 'Unlimited revisions', 'Interactive prototype with animations', 'Delivery in all source files (Figma/Adobe XD)']
      },
      addOns: [{
        id: 'addon-2',
        name: 'SEO Package',
        description: 'Basic SEO optimization for better search engine rankings',
        price: 149
      }, {
        id: 'addon-3',
        name: 'Content Creation',
        description: 'Professional copywriting for up to 5 pages',
        price: 199
      }],
      progress: 65,
      nextMilestone: 'Final design approval',
      nextPaymentDate: '2023-07-15',
      nextPaymentAmount: 169.6 // 20% of total
    }, {
      id: '2',
      name: 'Social Media Campaign',
      description: 'Monthly social media management for product launch',
      startDate: '2023-05-01',
      status: 'active',
      servicePackage: {
        id: 'social-growth',
        category: 'Social Media',
        name: 'Growth',
        price: 600,
        description: 'For businesses ready to expand their social media presence.',
        features: ['15 posts per month', 'Advanced image and video creation', 'Engagement strategy', 'Hashtag research', 'Bi-weekly performance reports']
      },
      addOns: [{
        id: 'addon-5',
        name: 'Extended Support',
        description: 'Additional 30 days of technical support',
        price: 129
      }],
      progress: 40,
      nextMilestone: 'Mid-month content review',
      nextPaymentDate: '2023-07-01',
      nextPaymentAmount: 145.8 // Monthly payment
    }, {
      id: '3',
      name: 'E-commerce Store Setup',
      description: 'Complete online store implementation with payment processing',
      startDate: '2023-04-10',
      status: 'completed',
      servicePackage: {
        id: 'complete-website',
        category: 'Complete Website Package',
        name: 'Complete Website',
        price: 1200,
        description: 'All-in-one solution for businesses that want to establish a strong online presence.',
        features: ['Custom design', 'Full-stack development', 'SEO optimization', 'Hosting setup', 'Content management system', 'Mobile responsive', '30 days of support', 'Analytics integration']
      },
      addOns: [{
        id: 'addon-1',
        name: 'Priority Support',
        description: '24/7 customer support with 4-hour response time',
        price: 99
      }, {
        id: 'addon-4',
        name: 'Analytics Setup',
        description: 'Google Analytics and reporting dashboard setup',
        price: 79
      }],
      progress: 100,
      nextMilestone: 'Project completed',
      nextPaymentDate: '2023-05-10',
      nextPaymentAmount: 0 // All paid
    }];
    setProjects(mockProjects);
    // Mock pending projects
    const mockPendingProjects: PendingProject[] = [{
      id: 'pending-1',
      name: 'Custom E-commerce Solution',
      description: 'Tailored e-commerce platform with advanced features',
      createdDate: '2023-07-01',
      servicePackage: {
        id: 'custom-ecommerce',
        category: 'Custom Development',
        name: 'E-commerce Platform',
        price: 2500,
        description: 'Custom-built e-commerce solution tailored to your specific business needs',
        features: ['Custom product catalog', 'Payment processing integration', 'Inventory management system', 'Customer account management', 'Order tracking and management', 'Mobile-responsive design', '60 days of technical support']
      },
      customPrice: 2200,
      notes: 'Special pricing offered based on long-term partnership potential. Includes 3 rounds of revisions and priority support.'
    }, {
      id: 'pending-2',
      name: 'Enterprise CRM Integration',
      description: 'Custom CRM solution with existing systems integration',
      createdDate: '2023-07-05',
      servicePackage: {
        id: 'custom-crm',
        category: 'Enterprise Solutions',
        name: 'CRM Integration',
        price: 3800,
        description: 'Enterprise-grade CRM solution with seamless integration to your existing business systems',
        features: ['Custom CRM development', 'Data migration from existing systems', 'API integrations with current software', 'Custom reporting dashboard', 'User role management', 'Training sessions for staff', '90 days of technical support']
      },
      notes: 'This solution will be developed in phases with the first deliverable in 30 days.'
    }];
    setPendingProjects(mockPendingProjects);
  }, []);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const calculateTotalAmount = (project: Project) => {
    const packagePrice = project.servicePackage.price;
    const addOnsTotal = project.addOns.reduce((sum, addon) => sum + addon.price, 0);
    return packagePrice + addOnsTotal;
  };
  const activeProjects = projects.filter(project => project.status !== 'completed');
  const completedProjects = projects.filter(project => project.status === 'completed');
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };
  const handleUpdateProject = (updatedProject: Project) => {
    // Update the project in the projects array
    const updatedProjects = projects.map(project => project.id === updatedProject.id ? updatedProject : project);
    setProjects(updatedProjects);
  };
  const handleContinuePendingProject = (pendingProject: PendingProject) => {
    // Store the pending project in localStorage to use in the next steps
    localStorage.setItem('pendingProject', JSON.stringify(pendingProject));
    // Navigate to the add-ons selection page for this pending project
    navigate('/pending-project-approval');
  };
  return <div className="bg-lavender-light min-h-screen">
      <Sidebar />
      <div className="sm:pl-20 lg:pl-64 pb-20 sm:pb-0">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                My Projects
              </h1>
              <p className="text-gray-600">
                Track and manage your ongoing and completed projects
              </p>
            </div>
            <button onClick={() => navigate('/services')} className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2 whitespace-nowrap">
              <PlusIcon size={18} />
              New Project
            </button>
          </div>
          {/* Pending Projects Section */}
          {pendingProjects.length > 0 && <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <PackageIcon size={16} className="text-yellow-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Pending Project Approvals
                </h2>
              </div>
              <div className="space-y-4">
                {pendingProjects.map(pendingProject => <div key={pendingProject.id} className="bg-white rounded-2xl shadow-retro-lg border border-yellow-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-800">
                              {pendingProject.name}
                            </h3>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Awaiting Approval
                            </span>
                          </div>
                          <p className="text-gray-600">
                            {pendingProject.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
                          <CalendarIcon size={16} />
                          <span>
                            Created: {formatDate(pendingProject.createdDate)}
                          </span>
                        </div>
                      </div>
                      {/* Package Details */}
                      <div className="bg-yellow-50 rounded-xl p-4 mb-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {pendingProject.servicePackage.category} -{' '}
                              {pendingProject.servicePackage.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {pendingProject.servicePackage.description}
                            </p>
                          </div>
                          <div className="text-right">
                            {pendingProject.customPrice ? <>
                                <span className="font-bold text-primary-700">
                                  ${pendingProject.customPrice}
                                </span>
                                <div className="text-xs text-green-600 line-through">
                                  ${pendingProject.servicePackage.price}
                                </div>
                              </> : <span className="font-bold text-primary-700">
                                ${pendingProject.servicePackage.price}
                              </span>}
                          </div>
                        </div>
                        {/* Features */}
                        <div className="mt-3">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                            Included Features:
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {pendingProject.servicePackage.features.map((feature, index) => <div key={index} className="flex items-start">
                                  <CheckIcon size={16} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{feature}</span>
                                </div>)}
                          </div>
                        </div>
                        {/* Notes if any */}
                        {pendingProject.notes && <div className="mt-4 pt-4 border-t border-yellow-200">
                            <div className="flex items-start">
                              <AlertCircleIcon size={16} className="text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <h5 className="text-sm font-medium text-gray-700">
                                  Admin Notes:
                                </h5>
                                <p className="text-sm text-gray-600">
                                  {pendingProject.notes}
                                </p>
                              </div>
                            </div>
                          </div>}
                      </div>
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 justify-end">
                        <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2" onClick={() => {}}>
                          <XIcon size={18} />
                          Decline
                        </button>
                        <button onClick={() => handleContinuePendingProject(pendingProject)} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
                          <ArrowRightIcon size={18} />
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>}
          {/* Tabs */}
          <div className="bg-white rounded-xl p-1 flex w-full sm:w-auto mb-6 shadow-sm">
            <button className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'active' ? 'bg-primary-100 text-primary-800' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setActiveTab('active')}>
              Active Projects ({activeProjects.length})
            </button>
            <button className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'completed' ? 'bg-primary-100 text-primary-800' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setActiveTab('completed')}>
              Completed ({completedProjects.length})
            </button>
          </div>
          {/* Projects List */}
          <div className="space-y-6">
            {activeTab === 'active' && activeProjects.length === 0 && <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BriefcaseIcon size={24} className="text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  No active projects
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  You don't have any active projects at the moment. Browse our
                  services to start a new project.
                </p>
                <button onClick={() => navigate('/services')} className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                  Browse Services
                </button>
              </div>}
            {activeTab === 'completed' && completedProjects.length === 0 && <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon size={24} className="text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  No completed projects yet
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  You don't have any completed projects yet. Your finished
                  projects will appear here.
                </p>
                <button onClick={() => setActiveTab('active')} className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                  View Active Projects
                </button>
              </div>}
            {activeTab === 'active' && activeProjects.map(project => <div key={project.id} className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 overflow-hidden">
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl font-bold text-gray-800">
                            {project.name}
                          </h2>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-600">{project.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
                        <CalendarIcon size={16} />
                        <span>Started: {formatDate(project.startDate)}</span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mb-6">
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
                    {/* Service Package Details */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <h3 className="font-medium text-gray-800 mb-2">
                        Service Package
                      </h3>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium">
                            {project.servicePackage.category} -{' '}
                            {project.servicePackage.name}
                          </span>
                          <p className="text-sm text-gray-600">
                            {project.servicePackage.description}
                          </p>
                        </div>
                        <span className="font-semibold text-primary-700">
                          ${project.servicePackage.price}
                        </span>
                      </div>
                      {/* Add-ons */}
                      {project.addOns.length > 0 && <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="font-medium text-gray-700 mb-2">
                            Add-ons
                          </h4>
                          <div className="space-y-2">
                            {project.addOns.map(addon => <div key={addon.id} className="flex justify-between items-start">
                                <div>
                                  <span className="text-sm font-medium">
                                    {addon.name}
                                  </span>
                                  <p className="text-xs text-gray-600">
                                    {addon.description}
                                  </p>
                                </div>
                                <span className="text-sm font-medium text-primary-700">
                                  ${addon.price}
                                </span>
                              </div>)}
                          </div>
                        </div>}
                      {/* Total */}
                      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                        <span className="font-medium">Total</span>
                        <span className="font-bold text-primary-700">
                          ${calculateTotalAmount(project)}
                        </span>
                      </div>
                    </div>
                    {/* Next Steps */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div className="bg-primary-50 rounded-xl p-4 border border-primary-200">
                        <div className="flex items-start">
                          <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <ClockIcon size={18} className="text-primary-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-primary-800 mb-1">
                              Next Milestone
                            </h3>
                            <p className="text-sm">{project.nextMilestone}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-secondary-50 rounded-xl p-4 border border-secondary-200">
                        <div className="flex items-start">
                          <div className="h-8 w-8 bg-secondary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <CalendarIcon size={18} className="text-secondary-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-secondary-800 mb-1">
                              Next Payment
                            </h3>
                            <p className="text-sm">
                              ${project.nextPaymentAmount} on{' '}
                              {formatDate(project.nextPaymentDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 justify-end">
                      <button onClick={() => handleViewDetails(project)} className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
                        <FileTextIcon size={18} />
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
                        <ExternalLinkIcon size={18} />
                        Contact Manager
                      </button>
                    </div>
                  </div>
                </div>)}
            {activeTab === 'completed' && completedProjects.map(project => <div key={project.id} className="bg-white rounded-2xl shadow-retro border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-lg font-bold text-gray-800">
                            {project.name}
                          </h2>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Completed
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CalendarIcon size={16} />
                        <span>Completed: {formatDate(project.startDate)}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">
                          {project.servicePackage.category} -{' '}
                          {project.servicePackage.name}
                        </span>
                        <span className="font-semibold text-primary-700">
                          ${calculateTotalAmount(project)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-end">
                      <button onClick={() => handleViewDetails(project)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm flex items-center gap-1">
                        <FileTextIcon size={16} />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>)}
          </div>
          {/* Call to Action */}
          <div className="mt-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl shadow-retro-lg overflow-hidden text-white">
            <div className="p-6 sm:p-8 text-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-3">
                Need a custom project solution?
              </h2>
              <p className="mb-6 max-w-2xl mx-auto">
                Our team can create a tailored package specifically for your
                business needs. Get in touch with us for a personalized quote.
              </p>
              <button className="px-8 py-3 bg-white text-primary-700 rounded-xl hover:bg-cream transition-colors font-medium flex items-center gap-2 mx-auto">
                Request Custom Package
                <ArrowRightIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Project Details Modal */}
      <ProjectDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} project={selectedProject} onUpdateProject={handleUpdateProject} />
    </div>;
}
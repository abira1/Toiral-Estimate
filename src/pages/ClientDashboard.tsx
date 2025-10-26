import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  TrendingUp,
  ArrowRight,
  Calendar,
  DollarSign
} from 'lucide-react';
import { 
  getClientDashboardData, 
  getProjectSetupByClient 
} from '../services/workflowService';
import { getCurrentClientId, requireClientAccess } from '../services/accessControlService';
import { ClientDashboardData, ProjectSetup } from '../types/workflow';
import toast from 'react-hot-toast';

interface DashboardStats {
  pendingApprovals: number;
  activeProjects: number;
  completedProjects: number;
  totalValue: number;
}

export function ClientDashboard() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [dashboardData, setDashboardData] = useState<ClientDashboardData | null>(null);
  const [pendingProjectSetup, setPendingProjectSetup] = useState<ProjectSetup | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    pendingApprovals: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalValue: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  const loadDashboardData = async () => {
    try {
      if (!currentUser?.uid) {
        setLoading(false);
        return;
      }

      // Get the client ID from localStorage (set during login)
      const clientId = getCurrentClientId();
      
      if (!clientId) {
        toast.error('No client profile found. Please login again.');
        setLoading(false);
        return;
      }

      // Validate access - ensure user can only access their own data
      try {
        requireClientAccess(clientId);
      } catch (error: any) {
        toast.error('Access denied. You can only view your own profile.');
        navigate('/');
        return;
      }

      // Load dashboard data from workflow system using the correct clientId
      const data = await getClientDashboardData(clientId);
      setDashboardData(data);

      // Check for pending project setup
      const projectSetup = await getProjectSetupByClient(clientId);
      setPendingProjectSetup(projectSetup);

      // Calculate statistics
      const newStats: DashboardStats = {
        pendingApprovals: data.pendingApprovals.length,
        activeProjects: data.activeProjects.length,
        completedProjects: data.completedProjects.length,
        totalValue: [...data.activeProjects, ...data.completedProjects]
          .reduce((sum, project) => sum + project.finalPrice, 0)
      };
      setStats(newStats);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Don't show error toast for missing data - this is expected for new users
    } finally {
      setLoading(false);
    }
  };

  const handleViewPendingApprovals = () => {
    if (pendingProjectSetup) {
      // Store project setup in localStorage for the approval flow
      localStorage.setItem('pendingProject', JSON.stringify({
        id: pendingProjectSetup.id,
        name: pendingProjectSetup.projectName,
        description: pendingProjectSetup.description,
        createdDate: pendingProjectSetup.createdAt,
        servicePackage: {
          id: 'custom',
          category: 'Custom Project',
          name: pendingProjectSetup.projectName,
          price: pendingProjectSetup.basePrice,
          description: pendingProjectSetup.description,
          features: pendingProjectSetup.features
        },
        customPrice: pendingProjectSetup.basePrice
      }));
      navigate('/pending-project-approval');
    } else if (stats.pendingApprovals > 0) {
      navigate('/pending-project-approvals');
    } else {
      toast.error('No pending approvals found');
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
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {userProfile?.name || 'Client'}! 👋
            </h1>
            <p className="text-gray-600">
              Here's an overview of your projects and quotations with Toiral Estimate.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pendingApprovals}</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.activeProjects}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completedProjects}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-primary-600">${stats.totalValue}</p>
                </div>
                <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Pending Approvals Section */}
            <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Pending Project Approvals</h2>
                <AlertCircle className="h-5 w-5 text-orange-500" />
              </div>
              
              {pendingProjectSetup || stats.pendingApprovals > 0 ? (
                <div className="space-y-4">
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {pendingProjectSetup?.projectName || 'Project Quotation'}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {pendingProjectSetup?.description || 'Review and approve your project quotation'}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {pendingProjectSetup ? 
                            new Date(pendingProjectSetup.createdAt).toLocaleDateString() :
                            'Waiting for review'
                          }
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        Pending
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleViewPendingApprovals}
                    className="w-full bg-primary-600 text-white px-4 py-3 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Review & Approve
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">No pending approvals</p>
                  <p className="text-sm text-gray-500">All your projects are up to date!</p>
                </div>
              )}
            </div>

            {/* My Projects Section */}
            <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">My Projects</h2>
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              
              <div className="space-y-4">
                {stats.activeProjects > 0 ? (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-800">Active Projects</h3>
                          <p className="text-sm text-gray-600">
                            {stats.activeProjects} project{stats.activeProjects > 1 ? 's' : ''} in progress
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {stats.activeProjects}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => navigate('/my-projects')}
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      View All Projects
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">No active projects</p>
                    <button
                      onClick={() => navigate('/services')}
                      className="text-sm text-primary-600 hover:text-primary-700 underline"
                    >
                      Browse our services
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {dashboardData && dashboardData.quotationHistory.length > 0 && (
            <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {dashboardData.quotationHistory.slice(0, 3).map((quotation) => (
                  <div key={quotation.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-3 ${
                        quotation.status === 'confirmed' ? 'bg-green-500' :
                        quotation.status === 'pending_approval' ? 'bg-orange-500' :
                        'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-800">Quotation #{quotation.id.slice(-6)}</p>
                        <p className="text-sm text-gray-600">{new Date(quotation.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">${quotation.finalPrice}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        quotation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        quotation.status === 'pending_approval' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {quotation.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => navigate('/my-quotations')}
                className="w-full mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center justify-center gap-1"
              >
                View All Quotations
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Navigation Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <button
              onClick={() => navigate('/services')}
              className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 text-left hover:shadow-lg transition-shadow"
            >
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Browse Services</h3>
              <p className="text-sm text-gray-600">Explore our service packages and request new quotations</p>
            </button>

            <button
              onClick={() => navigate('/my-quotations')}
              className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 text-left hover:shadow-lg transition-shadow"
            >
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">My Quotations</h3>
              <p className="text-sm text-gray-600">View and manage all your quotation history</p>
            </button>

            <button
              onClick={() => navigate('/analytics')}
              className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 text-left hover:shadow-lg transition-shadow"
            >
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">Track your project progress and spending insights</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
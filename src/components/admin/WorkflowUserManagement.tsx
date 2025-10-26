import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Eye, 
  Settings, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  Users,
  Filter
} from 'lucide-react';
import { getAllClients, getAdminDashboardData } from '../../services/workflowService';
import { Client, AdminDashboardData } from '../../types/workflow';
import { AddClientModal } from './AddClientModal';
import { ProjectSetupModal } from './ProjectSetupModal';
import { UserInvitationWorkflow } from './UserInvitationWorkflow';
import toast from 'react-hot-toast';

export function WorkflowUserManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showProjectSetupModal, setShowProjectSetupModal] = useState(false);
  const [showInvitationWorkflow, setShowInvitationWorkflow] = useState(false);
  
  // Selected client/project for modals
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [clientsData, dashboardInfo] = await Promise.all([
        getAllClients(),
        getAdminDashboardData()
      ]);
      
      setClients(clientsData);
      setDashboardData(dashboardInfo);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load client data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientAdded = (clientId: string) => {
    setSelectedClientId(clientId);
    setShowProjectSetupModal(true);
    loadData(); // Refresh the list
  };

  const handleProjectSetup = (projectId: string) => {
    setSelectedProjectId(projectId);
    setShowInvitationWorkflow(true);
  };

  const handleViewClient = (clientId: string) => {
    // TODO: Navigate to detailed client view
    toast.info('Client detail view - Coming soon!');
  };

  const getStatusBadge = (status: Client['status']) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' }
    };
    
    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.clientCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Client Management</h1>
          <p className="text-gray-600">Manage clients and their quotation workflow</p>
        </div>
        
        {/* Quick Stats */}
        {dashboardData && (
          <div className="flex gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-blue-900">{dashboardData.totalClients}</p>
              <p className="text-sm text-blue-700">Total Clients</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-green-900">{dashboardData.totalProjects}</p>
              <p className="text-sm text-green-700">Active Projects</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
              <DollarSign className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-purple-900">${dashboardData.totalRevenue.toFixed(0)}</p>
              <p className="text-sm text-purple-700">Total Revenue</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 w-full sm:w-64"
            />
          </div>
          
          {/* Filter */}
          <div className="relative">
            <Filter className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="pl-10 pr-8 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setShowAddClientModal(true)}
          className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add New Client
        </button>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {client.profileImage ? (
                  <img
                    src={client.profileImage}
                    alt={client.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-500 font-mono">{client.clientCode}</p>
                </div>
              </div>
              {getStatusBadge(client.status)}
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-600 truncate">{client.email}</p>
              </div>
              
              {client.phone && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-600">{client.phone}</p>
                </div>
              )}
              
              {client.selectedPackage && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <p className="text-sm text-gray-600">{client.selectedPackage}</p>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <p className="text-sm text-gray-600">
                  Created {new Date(client.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleViewClient(client.id)}
                className="flex-1 py-2 px-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-1"
              >
                <Eye className="h-4 w-4" />
                View
              </button>
              
              <button
                onClick={() => {
                  setSelectedClientId(client.id);
                  setShowProjectSetupModal(true);
                }}
                className="flex-1 py-2 px-3 border-2 border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center gap-1"
              >
                <Settings className="h-4 w-4" />
                Setup
              </button>
              
              {client.accessCode && (
                <button
                  onClick={() => {
                    setSelectedClientId(client.id);
                    setShowInvitationWorkflow(true);
                  }}
                  className="flex-1 py-2 px-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                >
                  <Mail className="h-4 w-4" />
                  Invite
                </button>
              )}
            </div>

            {/* Access Code Display */}
            {client.accessCode && (
              <div className="mt-4 p-3 bg-green-50 border-2 border-green-300 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-green-700">🔑 LOGIN ACCESS CODE</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(client.accessCode!);
                      toast.success('Access code copied!');
                    }}
                    className="text-xs text-green-600 hover:text-green-800 underline"
                  >
                    Copy
                  </button>
                </div>
                <p className="font-mono text-lg font-bold text-green-900 bg-white px-3 py-2 rounded border border-green-200">
                  {client.accessCode}
                </p>
                <p className="text-xs text-green-600 mt-1">Share this code with client for login</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No clients found' : 'No clients yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first client'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => setShowAddClientModal(true)}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
            >
              Add First Client
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <AddClientModal
        isOpen={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        onClientAdded={handleClientAdded}
      />
      
      <ProjectSetupModal
        isOpen={showProjectSetupModal}
        onClose={() => setShowProjectSetupModal(false)}
        clientId={selectedClientId}
        onProjectSetup={handleProjectSetup}
      />
      
      <UserInvitationWorkflow
        isOpen={showInvitationWorkflow}
        onClose={() => setShowInvitationWorkflow(false)}
        clientId={selectedClientId}
        projectId={selectedProjectId}
      />
    </div>
  );
}
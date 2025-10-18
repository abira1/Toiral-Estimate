import React, { useEffect, useState } from 'react';
import { UsersIcon, FileTextIcon, PackageIcon, TrendingUpIcon, DollarSignIcon, BarChart3Icon, PieChartIcon, UserPlusIcon } from 'lucide-react';
import { SeedDataButton } from '../SeedDataButton';
import { InviteUserModal } from './InviteUserModal';
import { FirebaseMonitor } from './FirebaseMonitor';
type ServicePackage = {
  id: string;
  category: string;
  name: string;
  price: number;
  description: string;
  features: string[];
};
type Quotation = {
  id: string;
  name: string;
  date: string;
  servicePackage: ServicePackage;
  totalPrice: number;
  userId?: string;
};
type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  profilePicture?: string | null;
};
export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [services, setServices] = useState<ServicePackage[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [serviceDistribution, setServiceDistribution] = useState<Record<string, number>>({});
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  useEffect(() => {
    // Load data from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const storedQuotations = JSON.parse(localStorage.getItem('quotations') || '[]');
    const storedServices = JSON.parse(localStorage.getItem('servicePackages') || '[]');
    setUsers(storedUsers);
    setQuotations(storedQuotations);
    setServices(storedServices);
    // Calculate total revenue
    const revenue = storedQuotations.reduce((sum: number, quote: Quotation) => sum + quote.totalPrice, 0);
    setTotalRevenue(revenue);
    // Calculate service distribution
    const distribution: Record<string, number> = {};
    storedQuotations.forEach((quote: Quotation) => {
      const category = quote.servicePackage.category;
      distribution[category] = (distribution[category] || 0) + 1;
    });
    setServiceDistribution(distribution);
  }, []);
  // Get recent quotations (last 5)
  const recentQuotations = [...quotations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  return <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your business metrics</p>
      </div>
      
      {/* Admin Actions */}
      <div className="mb-6 flex flex-wrap gap-4">
        <SeedDataButton />
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="px-6 py-3 bg-secondary-600 text-white rounded-xl hover:bg-secondary-700 transition-colors flex items-center gap-2 shadow-retro"
        >
          <UserPlusIcon size={18} />
          Invite User
        </button>
      </div>

      {/* Invite User Modal */}
      <InviteUserModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInviteSent={() => {
          // Refresh data or show success message
          console.log('User invited successfully');
        }}
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-retro border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-600">Total Users</h3>
            <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
              <UsersIcon size={20} className="text-primary-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{users.length}</p>
          <p className="text-sm text-gray-500 mt-2">Active accounts</p>
        </div>
        <div className="bg-white rounded-2xl shadow-retro border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-600">Quotations</h3>
            <div className="h-10 w-10 bg-secondary-100 rounded-full flex items-center justify-center">
              <FileTextIcon size={20} className="text-secondary-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {quotations.length}
          </p>
          <p className="text-sm text-gray-500 mt-2">Total created</p>
        </div>
        <div className="bg-white rounded-2xl shadow-retro border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-600">Services</h3>
            <div className="h-10 w-10 bg-accent-100 rounded-full flex items-center justify-center">
              <PackageIcon size={20} className="text-accent-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{services.length}</p>
          <p className="text-sm text-gray-500 mt-2">Available packages</p>
        </div>
        <div className="bg-white rounded-2xl shadow-retro border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-600">Revenue</h3>
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSignIcon size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            ${totalRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">Potential revenue</p>
        </div>
      </div>
      {/* Firebase Monitoring */}
      <div className="mb-8">
        <FirebaseMonitor />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Quotations */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-retro border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              Recent Quotations
            </h3>
            <div className="h-8 w-8 bg-lavender rounded-full flex items-center justify-center">
              <TrendingUpIcon size={16} className="text-primary-600" />
            </div>
          </div>
          {recentQuotations.length > 0 ? <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2">Name</th>
                    <th className="text-left py-3 px-2">Package</th>
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-right py-3 px-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentQuotations.map(quote => <tr key={quote.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">{quote.name}</td>
                      <td className="py-3 px-2">{quote.servicePackage.name}</td>
                      <td className="py-3 px-2">
                        {new Date(quote.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2 text-right font-medium">
                        ${quote.totalPrice}
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div> : <p className="text-gray-500 py-4 text-center">
              No quotations found
            </p>}
        </div>
        {/* Service Distribution */}
        <div className="bg-white rounded-2xl shadow-retro border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              Service Distribution
            </h3>
            <div className="h-8 w-8 bg-cream rounded-full flex items-center justify-center">
              <PieChartIcon size={16} className="text-accent-600" />
            </div>
          </div>
          {Object.keys(serviceDistribution).length > 0 ? <div className="space-y-4">
              {Object.entries(serviceDistribution).map(([category, count]) => <div key={category}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">{category}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{
                width: `${count / quotations.length * 100}%`
              }}></div>
                  </div>
                </div>)}
            </div> : <p className="text-gray-500 py-4 text-center">No data available</p>}
        </div>
      </div>
    </div>;
}
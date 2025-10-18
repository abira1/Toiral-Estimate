import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboardIcon, UsersIcon, PackageIcon, FileTextIcon, LogOutIcon, ChevronLeftIcon } from 'lucide-react';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { UserManagement } from '../components/admin/UserManagement';
import { WorkflowUserManagement } from '../components/admin/WorkflowUserManagement';
import { ServiceManagementNew } from '../components/admin/ServiceManagementNew';
import { QuotationManagement } from '../components/admin/QuotationManagement';
import { PackageSetup } from '../components/admin/PackageSetup';
export function AdminPanel() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isAdmin');
    navigate('/');
  };
  const isActive = (path: string) => {
    return location.pathname === `/admin${path}` || path === '' && location.pathname === '/admin';
  };
  return <div className="bg-lavender-light min-h-screen flex">
      {/* Sidebar Toggle Button (Mobile) */}
      <button className="fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-md sm:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <ChevronLeftIcon size={20} className={`transform transition-transform ${isSidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
      </button>
      {/* Admin Sidebar */}
      <div className={`bg-primary-800 text-white w-64 flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 fixed sm:static h-screen z-40`}>
        <div className="p-4 border-b border-primary-700 flex items-center">
          <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center p-1">
            <img src="/toiraal.png" alt="Toiral Logo" className="h-full w-full object-contain" />
          </div>
          <span className="font-bold text-xl text-white ml-2">
            Toiral Admin
          </span>
        </div>
        <nav className="py-6">
          <ul className="space-y-1 px-3">
            <li>
              <button onClick={() => navigate('/admin')} className={`w-full flex items-center p-3 rounded-xl transition-colors ${isActive('') ? 'bg-primary-700 text-white' : 'text-primary-100 hover:bg-primary-700/50'}`}>
                <LayoutDashboardIcon size={20} className="flex-shrink-0" />
                <span className="ml-3">Dashboard</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/admin/users')} className={`w-full flex items-center p-3 rounded-xl transition-colors ${isActive('/users') ? 'bg-primary-700 text-white' : 'text-primary-100 hover:bg-primary-700/50'}`}>
                <UsersIcon size={20} className="flex-shrink-0" />
                <span className="ml-3">User Management</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/admin/services')} className={`w-full flex items-center p-3 rounded-xl transition-colors ${isActive('/services') ? 'bg-primary-700 text-white' : 'text-primary-100 hover:bg-primary-700/50'}`}>
                <PackageIcon size={20} className="flex-shrink-0" />
                <span className="ml-3">Service Packages</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/admin/quotations')} className={`w-full flex items-center p-3 rounded-xl transition-colors ${isActive('/quotations') ? 'bg-primary-700 text-white' : 'text-primary-100 hover:bg-primary-700/50'}`}>
                <FileTextIcon size={20} className="flex-shrink-0" />
                <span className="ml-3">Quotations</span>
              </button>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-primary-700">
          <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-xl text-primary-100 hover:bg-primary-700/50 transition-colors">
            <LogOutIcon size={20} className="flex-shrink-0" />
            <span className="ml-3">Logout</span>
          </button>
          <div className="mt-3 text-xs text-primary-300 text-center">
            <p>Admin Panel v1.0</p>
            <p>© 2023 Toiral</p>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-grow p-4 sm:p-6 overflow-auto">
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'sm:ml-0' : 'ml-0'}`}>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/services" element={<ServiceManagementNew />} />
            <Route path="/quotations" element={<QuotationManagement />} />
            <Route path="/package-setup/:userId" element={<PackageSetup />} />
          </Routes>
        </div>
      </div>
    </div>;
}
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { DataInitializer } from './components/DataInitializer';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { MyQuotations } from './pages/MyQuotations';
import { ServicesPage } from './pages/ServicesPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminPanel } from './pages/AdminPanel';
import { AdminRoute } from './components/AdminRoute';
import { FinalQuotationPage } from './pages/FinalQuotationPage';
import { MyProjects } from './pages/MyProjects';
import { PendingProjectApproval } from './pages/PendingProjectApproval';
import { InvoicePage } from './pages/InvoicePage';
import { AnalyticsPage } from './pages/AnalyticsPage';

export function App() {
  return (
    <DataInitializer>
      <AuthProvider>
        <BrowserRouter>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#363636',
              borderRadius: '12px',
              border: '2px solid #e5e7eb',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>} />
          <Route path="/my-quotations" element={<ProtectedRoute>
                <MyQuotations />
              </ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute>
                <ServicesPage />
              </ProtectedRoute>} />
          <Route path="/final-quotation" element={<ProtectedRoute>
                <FinalQuotationPage />
              </ProtectedRoute>} />
          <Route path="/my-projects" element={<ProtectedRoute>
                <MyProjects />
              </ProtectedRoute>} />
          <Route path="/pending-project-approval" element={<ProtectedRoute>
                <PendingProjectApproval />
              </ProtectedRoute>} />
          <Route path="/invoice" element={<ProtectedRoute>
                <InvoicePage />
              </ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>} />
          <Route path="/admin/*" element={<AdminRoute>
                <AdminPanel />
              </AdminRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
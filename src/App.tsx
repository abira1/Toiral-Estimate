import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { DataInitializer } from './components/DataInitializer';
import { LoadingScreen } from './components/LoadingScreen';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';

// Lazy load all page components for better performance
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const MyQuotations = lazy(() => import('./pages/MyQuotations').then(m => ({ default: m.MyQuotations })));
const ServicesPageNew = lazy(() => import('./pages/ServicesPageNew').then(m => ({ default: m.ServicesPageNew })));
const FinalQuotationPage = lazy(() => import('./pages/FinalQuotationPage').then(m => ({ default: m.FinalQuotationPage })));
const MyProjects = lazy(() => import('./pages/MyProjects').then(m => ({ default: m.MyProjects })));
const PendingProjectApproval = lazy(() => import('./pages/PendingProjectApproval').then(m => ({ default: m.PendingProjectApproval })));
const InvoicePage = lazy(() => import('./pages/InvoicePage').then(m => ({ default: m.InvoicePage })));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const AdminPanel = lazy(() => import('./pages/AdminPanel').then(m => ({ default: m.AdminPanel })));

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
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>} />
            <Route path="/my-quotations" element={<ProtectedRoute>
                  <MyQuotations />
                </ProtectedRoute>} />
            <Route path="/services" element={<ProtectedRoute>
                  <ServicesPageNew />
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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  </DataInitializer>
  );
}
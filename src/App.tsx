import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { DataInitializer } from './components/DataInitializer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { MyQuotations } from './pages/MyQuotations';
import { ServicesPageNew } from './pages/ServicesPageNew';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminPanel } from './pages/AdminPanel';
import { AdminRoute } from './components/AdminRoute';
import { FinalQuotationPage } from './pages/FinalQuotationPage';
import { MyProjects } from './pages/MyProjects';
import { PendingProjectApproval } from './pages/PendingProjectApproval';
import { InvoicePage } from './pages/InvoicePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SearchModal } from './components/SearchModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { useKeyboardShortcuts, KeyboardShortcut } from './hooks/useKeyboardShortcuts';

function AppWithKeyboardShortcuts() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      ctrlKey: true,
      action: () => setIsSearchOpen(true),
      description: 'Open search'
    },
    {
      key: 'k',
      metaKey: true,
      action: () => setIsSearchOpen(true),
      description: 'Open search'
    },
    {
      key: 'Escape',
      action: () => {
        setIsSearchOpen(false);
        setIsShortcutsOpen(false);
      },
      description: 'Close modals'
    },
    {
      key: '?',
      action: () => setIsShortcutsOpen(true),
      description: 'Show keyboard shortcuts'
    }
  ];

  useKeyboardShortcuts(shortcuts);

  return (
    <>
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
        </BrowserRouter>
      </AuthProvider>
    </DataInitializer>
  </ErrorBoundary>
  );
}
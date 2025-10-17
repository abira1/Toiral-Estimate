import React from 'react';
import { Navigate } from 'react-router-dom';
type AdminRouteProps = {
  children: React.ReactNode;
};
export function AdminRoute({
  children
}: AdminRouteProps) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
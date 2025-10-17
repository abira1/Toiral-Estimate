import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
type ProtectedRouteProps = {
  children: React.ReactNode;
};
export function ProtectedRoute({
  children
}: ProtectedRouteProps) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  lawyerOnly?: boolean; // If true, workers will be redirected
}

const ProtectedRoute = ({ children, lawyerOnly = false }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  // While checking localStorage on app load, show nothing (prevents flash)
  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  // Not logged in at all → redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but is a worker trying to access a lawyer-only page
  if (lawyerOnly && user.role !== 'lawyer') {
    return <Navigate to="/dashboard" replace />;
    // We redirect to dashboard, not login — they ARE logged in, just not a lawyer
  }

  // All checks passed — render the page
  return <>{children}</>;
};

export default ProtectedRoute;
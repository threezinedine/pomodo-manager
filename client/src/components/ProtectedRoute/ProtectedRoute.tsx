import React from 'react';
import { Navigate } from 'react-router-dom';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Whether the user is currently authenticated. Replace with auth store state later. */
  isAuthenticated?: boolean;
  /**
   * Where to redirect unauthenticated users.
   * Defaults to /login.
   */
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  isAuthenticated = false,
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
};

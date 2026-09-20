import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface RoleProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

/**
 * Returns the designated home dashboard route for a given user role.
 */
export const getRoleHome = (role: UserRole): string => {
  switch (role) {
    case 'student':
      return '/dashboard';
    case 'warden':
      return '/warden';
    case 'security':
      return '/security';
    case 'maintenance':
      return '/maintenance-team';
    case 'admin':
      return '/admin';
    default:
      return '/dashboard';
  }
};

/**
 * RoleProtectedRoute ensures that only authenticated users possessing one of
 * the specified `allowedRoles` can access the child view.
 * 
 * If unauthenticated: redirects to /login with state.from.
 * If authenticated but unauthorized: immediately redirects to the user's
 * own assigned operational dashboard without exposing unauthorized data.
 */
export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return <>{children}</>;
};

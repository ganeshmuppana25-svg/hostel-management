import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { AppLayout } from './components/layout/AppLayout';
import { RoleProtectedRoute } from './components/common/RoleProtectedRoute';
import { ScrollToTop } from './components/common/ScrollToTop';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { RoomDetailsPage } from './pages/RoomDetailsPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { LeaveManagementPage } from './pages/LeaveManagementPage';
import { MessPage } from './pages/MessPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { WardenDashboard } from './pages/warden/WardenDashboard';
import { SecurityDashboard } from './pages/security/SecurityDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { MaintenanceDashboard } from './pages/maintenance/MaintenanceDashboard';
import { NotFoundPage } from './pages/NotFoundPage';

// Protected route wrapper: redirects to /login if unauthenticated
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* Public Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* Authentication Screen */}
                <Route path="/login" element={<LoginPage />} />

                {/* Main Authenticated Application */}
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  {/* Student Exclusive Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <RoleProtectedRoute allowedRoles={['student']}>
                        <StudentDashboard />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route
                    path="/room"
                    element={
                      <RoleProtectedRoute allowedRoles={['student']}>
                        <RoomDetailsPage />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route
                    path="/maintenance"
                    element={
                      <RoleProtectedRoute allowedRoles={['student']}>
                        <MaintenancePage />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route
                    path="/leaves"
                    element={
                      <RoleProtectedRoute allowedRoles={['student']}>
                        <LeaveManagementPage />
                      </RoleProtectedRoute>
                    }
                  />

                  {/* Mess Operations (Students & Administrators) */}
                  <Route
                    path="/mess"
                    element={
                      <RoleProtectedRoute allowedRoles={['student', 'admin']}>
                        <MessPage />
                      </RoleProtectedRoute>
                    }
                  />

                  {/* Common Operational Views (All Authenticated Roles) */}
                  <Route path="/announcements" element={<AnnouncementsPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />

                  {/* Dedicated Role Command Centers */}
                  <Route
                    path="/warden"
                    element={
                      <RoleProtectedRoute allowedRoles={['warden']}>
                        <WardenDashboard />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route
                    path="/security"
                    element={
                      <RoleProtectedRoute allowedRoles={['security']}>
                        <SecurityDashboard />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route
                    path="/maintenance-team"
                    element={
                      <RoleProtectedRoute allowedRoles={['maintenance']}>
                        <MaintenanceDashboard />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <RoleProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </RoleProtectedRoute>
                    }
                  />

                  {/* Backward-compatibility aliases */}
                  <Route path="/warden-preview" element={<Navigate to="/warden" replace />} />
                  <Route path="/security-preview" element={<Navigate to="/security" replace />} />
                  <Route path="/maintenance-portal" element={<Navigate to="/maintenance-team" replace />} />
                  <Route path="/admin-preview" element={<Navigate to="/admin" replace />} />
                </Route>

                {/* 404 Catch-All Page */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;

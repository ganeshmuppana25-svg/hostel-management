import React, { createContext, useContext, useState } from 'react';
import usersData from '../data/users.json';
import { User, UserRole } from '../types';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string; role?: UserRole }>;
  loginAsRole: (role: UserRole, rememberMe?: boolean) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to student demo user if not logged in or initialize from localStorage
  const [user, setUser] = useState<User | null>(() => {
    return getFromStorage<User | null>(STORAGE_KEYS.USER, null);
  });

  const login = async (email: string, password: string, rememberMe = true): Promise<{ success: boolean; message?: string; role?: UserRole }> => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      return { success: false, message: 'Please enter your email address or Student ID.' };
    }
    if (!password) {
      return { success: false, message: 'Please enter your account password.' };
    }
    const found = usersData.find(
      (u) =>
        u.email.toLowerCase() === trimmed ||
        ('studentId' in u && (u.studentId as string)?.toLowerCase() === trimmed)
    );

    if (!found) {
      return { success: false, message: 'No account found with this email or student ID.' };
    }

    if (found.password !== password) {
      return { success: false, message: 'Invalid password. Please verify and try again.' };
    }

    const { password: _, ...userData } = found;
    const authenticatedUser: User = {
      ...userData,
      role: userData.role as UserRole,
    };

    // Ensure stale authentication storage does not remain when Remember Me is disabled
    if (rememberMe) {
      saveToStorage(STORAGE_KEYS.USER, authenticatedUser);
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    setUser(authenticatedUser);
    return { success: true, role: authenticatedUser.role };
  };

  const loginAsRole = (role: UserRole, rememberMe = true) => {
    const found = usersData.find((u) => u.role === role);
    if (found) {
      const { password: _, ...userData } = found;
      const authenticatedUser: User = {
        ...userData,
        role: userData.role as UserRole,
      };
      if (rememberMe) {
        saveToStorage(STORAGE_KEYS.USER, authenticatedUser);
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
      setUser(authenticatedUser);
    }
  };

  const switchRole = (role: UserRole) => {
    loginAsRole(role);
  };

  const updateUser = (updated: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const nextUser = { ...prev, ...updated };
      if (localStorage.getItem(STORAGE_KEYS.USER)) {
        saveToStorage(STORAGE_KEYS.USER, nextUser);
      }
      return nextUser;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginAsRole,
        logout,
        switchRole,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

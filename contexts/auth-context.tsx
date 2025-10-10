'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/api/api/userManagementController';

interface User {
  id: string;
  email: string;
  role: 'DOCTOR' | 'ADMIN';
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phoneNumber?: string;
  permissions: string[]; // Permission array from backend
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: Partial<User>) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Permission helpers
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasRole: (role: 'ADMIN' | 'DOCTOR') => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch user info with permissions from backend
  const fetchUserInfo = useCallback(async () => {
    const storedToken = localStorage.getItem('authToken');

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    try {
      // Always fetch fresh data from backend to ensure latest permissions
      const userData = await getCurrentUser();

      if (userData && userData.id) {
        const user: User = {
          id: String(userData.id),
          email: userData.email || '',
          role: userData.role as 'DOCTOR' | 'ADMIN',
          fullName: userData.fullName,
          phoneNumber: userData.phoneNumber,
          permissions: userData.permissions || [],
        };

        setUser(user);
        setToken(storedToken);

        // Save to localStorage as backup
        localStorage.setItem('userData', JSON.stringify(user));
      } else {
        // Invalid response, clear auth
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      // Use cached data as fallback only if API fails
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          if (userData && userData.permissions) {
            setUser(userData);
            setToken(storedToken);
          } else {
            throw new Error('Invalid cached data');
          }
        } catch {
          // Clear invalid stored data
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          setToken(null);
          setUser(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');

    if (storedToken) {
      setToken(storedToken);
      // Always fetch fresh user data with permissions from API
      fetchUserInfo();
    } else {
      setIsLoading(false);
    }
  }, [fetchUserInfo]);

  const login = async (newToken: string, userData: Partial<User>) => {
    localStorage.setItem('authToken', newToken);
    // Also set as cookie for middleware
    document.cookie = `authToken=${newToken}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
    setToken(newToken);

    // Fetch full user info with permissions from backend after login
    try {
      const fullUserData = await getCurrentUser();
      if (fullUserData && fullUserData.id) {
        const user: User = {
          id: String(fullUserData.id),
          email: fullUserData.email || '',
          role: fullUserData.role as 'DOCTOR' | 'ADMIN',
          fullName: fullUserData.fullName,
          phoneNumber: fullUserData.phoneNumber,
          permissions: fullUserData.permissions || [],
        };
        setUser(user);
        // Save to localStorage as backup
        localStorage.setItem('userData', JSON.stringify(user));
      } else {
        // Fallback to provided data if API call fails
        const user = { ...userData, permissions: [] } as User;
        setUser(user);
        localStorage.setItem('userData', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Failed to fetch user info after login:', error);
      // Fallback to provided data
      const user = { ...userData, permissions: [] } as User;
      setUser(user);
      localStorage.setItem('userData', JSON.stringify(user));
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    // Remove cookie
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setToken(null);
    setUser(null);
    router.push('/auth/login');
  };

  const refreshUser = useCallback(async () => {
    await fetchUserInfo();
  }, [fetchUserInfo]);

  // Permission helper functions
  const hasPermission = useCallback((permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }, [user]);

  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    if (!user || !user.permissions) return false;
    return permissions.some(permission => user.permissions.includes(permission));
  }, [user]);

  const hasAllPermissions = useCallback((permissions: string[]): boolean => {
    if (!user || !user.permissions) return false;
    return permissions.every(permission => user.permissions.includes(permission));
  }, [user]);

  const hasRole = useCallback((role: 'ADMIN' | 'DOCTOR'): boolean => {
    if (!user) return false;
    return user.role === role;
  }, [user]);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        isLoading,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
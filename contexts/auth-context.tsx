'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUserId = localStorage.getItem('userId');

    if (storedToken && storedUserId) {
      setToken(storedToken);
      // The storedUserId is actually the email, so we use it as both id and email
      setUser({ id: storedUserId, email: storedUserId });
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, userIdentifier: string) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('userId', userIdentifier);
    // Also set as cookie for middleware
    document.cookie = `authToken=${newToken}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
    setToken(newToken);
    // The userIdentifier is the email, so we use it as both id and email
    setUser({ id: userIdentifier, email: userIdentifier });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    // Remove cookie
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setToken(null);
    setUser(null);
    router.push('/auth/login');
  };

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
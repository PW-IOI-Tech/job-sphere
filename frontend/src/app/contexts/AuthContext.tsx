  'use client';
  import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
  import axios from 'axios';
  import { usePathname } from 'next/navigation';

  interface User {
    id: number;
    name: string;
    email: string;
    role: "EMPLOYER" | "JOB_SEEKER";
  }

  interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (userData: SignupData) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
  }

  interface SignupData {
    name: string;
    email: string;
    password: string;
    role: "EMPLOYER" | "JOB_SEEKER";
  }

  const AuthContext = createContext<AuthContextType | undefined>(undefined);

  // Base API URL - adjust according to your backend
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
const noAuthCheckPaths = ['/login/employer', '/login/jobseeker', '/'];

useEffect(() => {
  if (!noAuthCheckPaths.some(p => pathname.startsWith(p))) {
    checkAuth();
  } else {
    setLoading(false);
  }
}, [pathname]);

    const checkAuth = async (): Promise<void> => {
      try {
        const response = await axios.get(`${backendUrl}/api/auth/me`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    const login = async (email: string, password: string): Promise<void> => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/auth/login`,
          { email, password },
          { withCredentials: true }
        );

        if (!response.data.success) {
          throw new Error(response.data.message || 'Login failed');
        }

        setUser(response.data.user);
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    };

    const signup = async (userData: SignupData): Promise<void> => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/auth/signup`,
          userData,
          { withCredentials: true }
        );

        if (!response.data.success) {
          throw new Error(response.data.message || 'Signup failed');
        }

        setUser(response.data.user);
      } catch (error) {
        console.error('Signup error:', error);
        throw error;
      }
    };

    const logout = async (): Promise<void> => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/auth/logout`,
          {}, 
          { withCredentials: true }
        );

        if (response.status === 200) {
          setUser(null);
        }
      } catch (error) {
        console.error('Logout error:', error);
        throw error;
      }
    };

    const value = {
      user,
      loading,
      login,
      signup,
      logout,
      checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };

  export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };

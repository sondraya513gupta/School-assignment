'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check auth on mount
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Basic Role-Based Routing logic
    if (!loading) {
      const isAuthRoute = pathname.startsWith('/login');
      const isPublicRoute = pathname.startsWith('/live');
      
      if (!user && !isAuthRoute && !isPublicRoute) {
        router.push('/login');
      } else if (user && isAuthRoute) {
        // Redirect to respective dashboard if logged in
        if (user.role === 'principal') {
          router.push('/principal/dashboard');
        } else if (user.role === 'teacher') {
          router.push('/teacher/dashboard');
        }
      }
    }
  }, [user, loading, pathname, router]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

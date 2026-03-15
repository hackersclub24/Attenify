'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '../lib/axios';

interface User {
  username: string;
  role: string;
  id?: number;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (access_token: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/api/auth/me');
          setUser(res.data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (token: string, role: string) => {
    localStorage.setItem('token', token);
    try {
      const res = await api.get('/api/auth/me');
      setUser(res.data);
      redirectByRole(res.data.role || role);
    } catch {
      setUser({ username: 'User', role });
      redirectByRole(role);
    }
  };

  const redirectByRole = (currentRole: string) => {
    if (currentRole === 'admin') router.push('/dashboard/admin');
    else if (currentRole === 'teacher') router.push('/dashboard/teacher');
    else router.push('/dashboard/student');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

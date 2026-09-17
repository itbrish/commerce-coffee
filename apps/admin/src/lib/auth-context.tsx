'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl } from './api';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check saved session in localStorage
    try {
      const savedToken = localStorage.getItem('atelier_admin_token');
      const savedUser = localStorage.getItem('atelier_admin_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Failed to restore auth session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: pass }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.message || (typeof data === 'string' ? data : 'Email atau password yang Anda masukkan salah.'),
        };
      }

      // Support both wrapped response { success: true, data: { accessToken, user } } and direct response
      const payload = data?.data || data;
      const authToken = payload?.accessToken || payload?.token || data?.accessToken || data?.token;
      const authUser = payload?.user || data?.user;

      if (!authToken || !authUser) {
        console.error('Unexpected auth payload structure:', data);
        return { success: false, error: 'Respon otentikasi tidak valid dari server.' };
      }

      setToken(authToken);
      setUser(authUser);

      localStorage.setItem('atelier_admin_token', authToken);
      localStorage.setItem('atelier_admin_user', JSON.stringify(authUser));

      return { success: true };
    } catch (err: any) {
      console.error('Login network error:', err);
      return {
        success: false,
        error: 'Gagal terhubung ke server API. Pastikan server backend sedang berjalan.',
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('atelier_admin_token');
    localStorage.removeItem('atelier_admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAdmin: boolean;
  userEmail: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  userEmail: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('et_admin_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.authenticated) {
          setIsAdmin(true);
          setUserEmail(parsed.email || 'experiencetechservices@gmail.com');
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: pass.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const sessionEmail = data.email || 'experiencetechservices@gmail.com';
        const session = { authenticated: true, email: sessionEmail, timestamp: Date.now() };
        window.localStorage.setItem('et_admin_session', JSON.stringify(session));
        setIsAdmin(true);
        setUserEmail(sessionEmail);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    window.localStorage.removeItem('et_admin_session');
    setIsAdmin(false);
    setUserEmail(null);
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, userEmail, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

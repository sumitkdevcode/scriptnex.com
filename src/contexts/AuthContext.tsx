'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { api, ApiError } from '@/lib/api';
import type { User, AuthData, LoginPayload, RegisterPayload } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  fieldErrors: Record<string, string[]> | null;
  clearErrors: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);

  const clearErrors = useCallback(() => {
    setError(null);
    setFieldErrors(null);
  }, []);

  // Check for existing token on mount
  useEffect(() => {
    let isActive = true;

    const bootstrapSession = async () => {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        if (isActive) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const res = await api.get<{ user: User }>('/auth/me');
        if (isActive) {
          setUser(res.data.user);
        }
      } catch {
        localStorage.removeItem('auth_token');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void bootstrapSession();

    return () => {
      isActive = false;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    clearErrors();
    setIsLoading(true);
    try {
      const res = await api.post<AuthData>('/auth/login', payload);
      localStorage.setItem('auth_token', res.data.token);
      setUser(res.data.user);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.errors || null);
      } else {
        setError('An unexpected error occurred.');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [clearErrors]);

  const register = useCallback(async (payload: RegisterPayload) => {
    clearErrors();
    setIsLoading(true);
    try {
      const res = await api.post<AuthData>('/auth/register', payload);
      localStorage.setItem('auth_token', res.data.token);
      setUser(res.data.user);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.errors || null);
      } else {
        setError('An unexpected error occurred.');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [clearErrors]);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore errors
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        error,
        fieldErrors,
        clearErrors,
      }}
    >
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

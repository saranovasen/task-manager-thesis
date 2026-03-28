import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getMe } from '../api/getMe';
import { login as loginRequest } from '../api/login';
import { logout as logoutRequest } from '../api/logout';
import { register as registerRequest } from '../api/register';
import { ApiError } from '../../../shared/api/httpClient';
import type { AuthUser, LoginPayload, RegisterPayload } from './types';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const TOKEN_KEY = 'tm_access_token';

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initialToken = localStorage.getItem(TOKEN_KEY);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(initialToken);
  const [isLoading, setIsLoading] = useState(Boolean(initialToken));

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const profile = await getMe(token);
        setUser(profile);
      } catch (error) {
        setUser(null);

        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          setToken(null);
          localStorage.removeItem(TOKEN_KEY);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrap();
  }, [token]);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const response = await loginRequest(payload);
      setToken(response.accessToken);
      setUser(response.user);
      localStorage.setItem(TOKEN_KEY, response.accessToken);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const response = await registerRequest(payload);
      setToken(response.accessToken);
      setUser(response.user);
      localStorage.setItem(TOKEN_KEY, response.accessToken);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await logoutRequest(token);
      } catch {
        // ignore API logout failure and clear local session anyway
      }
    }

    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      accessToken: token,
      login,
      register,
      logout,
    }),
    [user, isLoading, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

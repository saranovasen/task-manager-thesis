import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getMe } from '../api/getMe';
import { login as loginRequest } from '../api/login';
import { logout as logoutRequest } from '../api/logout';
import type { AuthUser, LoginPayload } from './types';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const TOKEN_KEY = 'tm_access_token';

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        return;
      }

      setIsLoading(true);
      try {
        const profile = await getMe(token);
        setUser(profile);
      } catch {
        setUser(null);
        setToken(null);
        localStorage.removeItem(TOKEN_KEY);
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
      login,
      logout,
    }),
    [user, isLoading]
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

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  apiMe,
  apiLogout,
  apiRefresh,
  type AuthUser,
} from "@/utils/auth";

const TOKEN_KEY = "resortian_token";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setAuth = useCallback((u: AuthUser, t: string) => {
    setUser(u);
    setToken(t);
    localStorage.setItem(TOKEN_KEY, t);
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const logout = useCallback(async () => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (t) {
      try {
        await apiLogout(t);
      } catch {
        // ignore — clear locally regardless
      }
    }
    clearAuth();
  }, [clearAuth]);

  // On mount: restore session
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);

    async function restore() {
      if (!stored) {
        setLoading(false);
        return;
      }
      try {
        const me = await apiMe(stored);
        setUser(me);
        setToken(stored);
      } catch {
        // Token may be expired — try refresh
        try {
          const { accessToken } = await apiRefresh();
          const me = await apiMe(accessToken);
          setUser(me);
          setToken(accessToken);
          localStorage.setItem(TOKEN_KEY, accessToken);
        } catch {
          clearAuth();
        }
      } finally {
        setLoading(false);
      }
    }

    restore();
  }, [clearAuth]);

  return (
    <AuthContext.Provider value={{ user, token, loading, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

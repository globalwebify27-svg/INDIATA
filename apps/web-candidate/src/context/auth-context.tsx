"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import {
  AuthTokenPair,
  LoginResult,
} from "@rajtantra/common-types";
import {
  IS_DEV_PREVIEW,
  MOCK_DEV_CANDIDATE_USER,
  MOCK_DEV_TOKENS,
  ExtendedUser,
} from "@/data/mock-candidate-data";

export type { ExtendedUser };

interface AuthContextType {
  user: ExtendedUser | null;
  tokens: AuthTokenPair | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isDevPreview: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // In development UI preview mode, automatically seed the mock candidate session
  // Zero database, zero API requests, zero authentication blockages
  const [user, setUser] = useState<ExtendedUser | null>(
    IS_DEV_PREVIEW ? MOCK_DEV_CANDIDATE_USER : null
  );
  const [tokens, setTokens] = useState<AuthTokenPair | null>(
    IS_DEV_PREVIEW ? MOCK_DEV_TOKENS : null
  );
  const [isLoading, setIsLoading] = useState(!IS_DEV_PREVIEW);
  const router = useRouter();

  const loadProfile = useCallback(async () => {
    if (IS_DEV_PREVIEW) return;

    try {
      const response = await apiFetch<ExtendedUser>("/auth/me");
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch {
      // If fetching profile fails (e.g. token expired), attempt logout
      localStorage.removeItem("rajtantra_access_token");
      localStorage.removeItem("rajtantra_refresh_token");
      setUser(null);
      setTokens(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // In UI development preview mode, bypass token verification & /auth/me calls
    if (IS_DEV_PREVIEW) {
      setUser(MOCK_DEV_CANDIDATE_USER);
      setTokens(MOCK_DEV_TOKENS);
      setIsLoading(false);
      return;
    }

    const accessToken = localStorage.getItem("rajtantra_access_token");
    const refreshToken = localStorage.getItem("rajtantra_refresh_token");

    if (accessToken && refreshToken) {
      setTokens({
        accessToken,
        refreshToken,
        tokenType: "Bearer",
        expiresIn: 900,
      });
      loadProfile();
    } else {
      setIsLoading(false);
    }
  }, [loadProfile]);

  const login = async (identifier: string, password: string) => {
    if (IS_DEV_PREVIEW) {
      setUser(MOCK_DEV_CANDIDATE_USER);
      setTokens(MOCK_DEV_TOKENS);
      setIsLoading(false);
      router.push("/dashboard");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiFetch<LoginResult>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier, password }),
      });

      if (response.success && response.data) {
        const { user: authUser, tokens: authTokens } = response.data;
        setUser(authUser);
        setTokens(authTokens);

        localStorage.setItem("rajtantra_access_token", authTokens.accessToken);
        localStorage.setItem("rajtantra_refresh_token", authTokens.refreshToken);

        // Fetch full profile with organization details
        await loadProfile();
        router.push("/dashboard");
      }
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    if (IS_DEV_PREVIEW) {
      // In dev preview mode, remain in the preview dashboard
      router.push("/dashboard");
      return;
    }

    try {
      const refreshToken = localStorage.getItem("rajtantra_refresh_token");
      if (refreshToken) {
        await apiFetch("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch {
      // Non-blocking error
    } finally {
      localStorage.removeItem("rajtantra_access_token");
      localStorage.removeItem("rajtantra_refresh_token");
      setUser(null);
      setTokens(null);
      setIsLoading(false);
      router.push("/auth/login");
    }
  };

  const refreshSession = async () => {
    if (IS_DEV_PREVIEW) return;

    const refreshToken = localStorage.getItem("rajtantra_refresh_token");
    if (!refreshToken) return;

    try {
      const response = await apiFetch<AuthTokenPair>("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });

      if (response.success && response.data) {
        setTokens(response.data);
        localStorage.setItem("rajtantra_access_token", response.data.accessToken);
        localStorage.setItem("rajtantra_refresh_token", response.data.refreshToken);
      }
    } catch (err) {
      await logout();
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshSession,
        isDevPreview: IS_DEV_PREVIEW,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

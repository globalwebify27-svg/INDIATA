"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import {
  AuthTokenPair,
  LoginResult,
  UserRole,
  PortalType,
} from "@rajtantra/common-types";
import {
  IS_DEV_PREVIEW,
  MOCK_DEV_CANDIDATE_USER,
  MOCK_DEV_SUPERADMIN_USER,
  MOCK_DEV_TOKENS,
  ExtendedUser,
} from "@/data/mock-candidate-data";

export type { ExtendedUser };

interface AuthContextType {
  user: ExtendedUser | null;
  tokens: AuthTokenPair | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeRole: UserRole | null;
  login: (identifier: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  switchPortal: (portal: PortalType) => void;
  refreshSession: () => Promise<void>;
  isDevPreview: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
      localStorage.removeItem("rajtantra_access_token");
      localStorage.removeItem("rajtantra_refresh_token");
      document.cookie = "rajtantra_access_token=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      setUser(null);
      setTokens(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (IS_DEV_PREVIEW) {
      const wasLoggedOut =
        typeof window !== "undefined" &&
        sessionStorage.getItem("rajtantra_logged_out") === "true";
      const savedRole =
        typeof window !== "undefined"
          ? localStorage.getItem("rajtantra_active_role")
          : null;

      if (!wasLoggedOut) {
        if (savedRole === UserRole.SUPER_ADMIN) {
          setUser(MOCK_DEV_SUPERADMIN_USER);
        } else {
          setUser(MOCK_DEV_CANDIDATE_USER);
        }
        setTokens(MOCK_DEV_TOKENS);
      }
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

  const login = async (identifier: string, password: string): Promise<LoginResult> => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("rajtantra_logged_out");
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
        localStorage.setItem("rajtantra_active_role", authUser.role);
        document.cookie = `rajtantra_access_token=${authTokens.accessToken}; Path=/; SameSite=Lax; max-age=${authTokens.expiresIn}`;

        await loadProfile();

        return response.data;
      }
      throw new Error(response.message || "Failed to authenticate session");
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : "Invalid identifier or password";
      throw new Error(message);
    }
  };

  const switchPortal = (portal: PortalType) => {
    if (portal === "SUPER_ADMIN") {
      setUser(MOCK_DEV_SUPERADMIN_USER);
      if (typeof window !== "undefined") {
        localStorage.setItem("rajtantra_active_role", UserRole.SUPER_ADMIN);
      }
      router.push("/super-admin");
    } else {
      setUser(MOCK_DEV_CANDIDATE_USER);
      if (typeof window !== "undefined") {
        localStorage.setItem("rajtantra_active_role", UserRole.CANDIDATE_ADMIN);
      }
      router.push("/candidate");
    }
  };

  const logout = async () => {
    try {
      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("rajtantra_refresh_token")
          : null;
      if (refreshToken && !IS_DEV_PREVIEW) {
        await apiFetch("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (e) {
      console.warn("Logout request failed:", e);
    } finally {
      localStorage.removeItem("rajtantra_access_token");
      localStorage.removeItem("rajtantra_refresh_token");
      localStorage.removeItem("rajtantra_active_role");
      document.cookie = "rajtantra_access_token=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      if (typeof window !== "undefined") {
        sessionStorage.setItem("rajtantra_logged_out", "true");
      }
      setUser(null);
      setTokens(null);
      router.push("/login");
    }
  };

  const refreshSession = async () => {
    await loadProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isAuthenticated: !!user,
        isLoading,
        activeRole: user?.role || null,
        login,
        logout,
        switchPortal,
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

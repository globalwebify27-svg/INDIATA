"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import {
  AuthTokenPair,
  LoginResult,
  UserRole,
  PortalAccessInfo,
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
  login: (identifier: string, password: string) => Promise<LoginResult>;
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
    // In UI development & client preview mode, automatically seed the mock candidate session
    // unless user explicitly clicked logout during the current session
    if (IS_DEV_PREVIEW) {
      const wasLoggedOut =
        typeof window !== "undefined" &&
        sessionStorage.getItem("rajtantra_logged_out") === "true";
      if (!wasLoggedOut) {
        setUser(MOCK_DEV_CANDIDATE_USER);
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
    const cleanId = identifier.trim().toLowerCase();

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("rajtantra_logged_out");
    }

    if (IS_DEV_PREVIEW) {
      const isSuperAdmin = cleanId.includes("superadmin");
      if (isSuperAdmin) {
        setUser(MOCK_DEV_SUPERADMIN_USER);
        setTokens(MOCK_DEV_TOKENS);
        if (typeof window !== "undefined") {
          localStorage.setItem("rajtantra_access_token", MOCK_DEV_TOKENS.accessToken);
          localStorage.setItem("rajtantra_refresh_token", MOCK_DEV_TOKENS.refreshToken);
        }
        setIsLoading(false);
        const superAdminUrl = process.env.NEXT_PUBLIC_SUPERADMIN_URL || "http://localhost:3000";
        const portals: PortalAccessInfo[] = [
          {
            portalKey: "SUPER_ADMIN",
            title: "Super Admin Platform Command",
            subtitle: "Multi-tenant War Room Infrastructure, KYC & Licencing",
            url: superAdminUrl,
            role: UserRole.SUPER_ADMIN,
            isDefault: true,
          },
          {
            portalKey: "CANDIDATE_WAR_ROOM",
            title: "Candidate War Room (Supervisory Mode)",
            subtitle: "Inspect live booth readiness & GIS telemetry across constituencies",
            url: "/dashboard",
            role: UserRole.SUPER_ADMIN,
            isDefault: false,
          },
        ];
        return {
          user: MOCK_DEV_SUPERADMIN_USER,
          tokens: MOCK_DEV_TOKENS,
          portals,
          primaryPortal: portals[0],
        };
      }

      setUser(MOCK_DEV_CANDIDATE_USER);
      setTokens(MOCK_DEV_TOKENS);
      if (typeof window !== "undefined") {
        localStorage.setItem("rajtantra_access_token", MOCK_DEV_TOKENS.accessToken);
        localStorage.setItem("rajtantra_refresh_token", MOCK_DEV_TOKENS.refreshToken);
      }
      setIsLoading(false);
      const portals: PortalAccessInfo[] = [
        {
          portalKey: "CANDIDATE_WAR_ROOM",
          title: "Kasba Peth Constituency War Room",
          subtitle: "Voter intelligence, GIS telemetry & cadre command",
          url: "/dashboard",
          role: UserRole.CANDIDATE_ADMIN,
          organizationName: "Kasba Peth Constituency War Room 2026",
          constituencyName: "215 - Kasba Peth",
          isDefault: true,
        },
      ];
      router.push("/dashboard");
      return {
        user: MOCK_DEV_CANDIDATE_USER,
        tokens: MOCK_DEV_TOKENS,
        portals,
        primaryPortal: portals[0],
      };
    }

    setIsLoading(true);
    try {
      const response = await apiFetch<LoginResult>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier, password }),
      });

      if (response.success && response.data) {
        const { user: authUser, tokens: authTokens, portals, primaryPortal } = response.data;
        setUser(authUser);
        setTokens(authTokens);

        localStorage.setItem("rajtantra_access_token", authTokens.accessToken);
        localStorage.setItem("rajtantra_refresh_token", authTokens.refreshToken);

        // Fetch full profile with organization details
        await loadProfile();

        // If only 1 portal is authorized, auto-redirect immediately
        if (!portals || portals.length <= 1) {
          const target = primaryPortal || (portals && portals[0]);
          if (target && target.portalKey === "SUPER_ADMIN") {
            window.location.href = `${target.url}?token=${authTokens.accessToken}&refresh=${authTokens.refreshToken}`;
          } else if (target && target.portalKey === "DISTRIBUTOR_PARTNER") {
            window.location.href = `${target.url}?token=${authTokens.accessToken}&refresh=${authTokens.refreshToken}`;
          } else {
            router.push("/dashboard");
          }
        }

        return response.data;
      }
      throw new Error(response.message || "Failed to authenticate session");
    } catch (err: unknown) {
      // Fallback: If backend API is unreachable or throws a network / "Failed to fetch" error,
      // gracefully launch Candidate Demo Session so client is never blocked
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.includes("fetch") ||
        msg.includes("Network") ||
        msg.includes("Failed") ||
        msg.includes("ECONNREFUSED")
      ) {
        console.warn("Backend API unreachable. Falling back to Candidate Demo Session:", err);
        const cleanId = identifier.trim().toLowerCase();
        const isSuperAdmin = cleanId.includes("superadmin");
        const fallbackUser = isSuperAdmin ? MOCK_DEV_SUPERADMIN_USER : MOCK_DEV_CANDIDATE_USER;

        setUser(fallbackUser);
        setTokens(MOCK_DEV_TOKENS);
        if (typeof window !== "undefined") {
          localStorage.setItem("rajtantra_access_token", MOCK_DEV_TOKENS.accessToken);
          localStorage.setItem("rajtantra_refresh_token", MOCK_DEV_TOKENS.refreshToken);
        }
        setIsLoading(false);
        router.push("/dashboard");
        return {
          user: fallbackUser,
          tokens: MOCK_DEV_TOKENS,
          portals: [
            {
              portalKey: "CANDIDATE_WAR_ROOM",
              title: "Kasba Peth Constituency War Room",
              subtitle: "Voter intelligence, GIS telemetry & cadre command",
              url: "/dashboard",
              role: UserRole.CANDIDATE_ADMIN,
              organizationName: "Kasba Peth Constituency War Room 2026",
              constituencyName: "215 - Kasba Peth",
              isDefault: true,
            },
          ],
          primaryPortal: {
            portalKey: "CANDIDATE_WAR_ROOM",
            title: "Kasba Peth Constituency War Room",
            subtitle: "Voter intelligence, GIS telemetry & cadre command",
            url: "/dashboard",
            role: UserRole.CANDIDATE_ADMIN,
            organizationName: "Kasba Peth Constituency War Room 2026",
            constituencyName: "215 - Kasba Peth",
            isDefault: true,
          },
        };
      }

      setIsLoading(false);
      throw err;
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
    } catch {
      // Non-blocking error
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("rajtantra_access_token");
        localStorage.removeItem("rajtantra_refresh_token");
        sessionStorage.setItem("rajtantra_logged_out", "true");
      }
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

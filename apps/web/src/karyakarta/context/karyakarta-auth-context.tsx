"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { KaryakartaUser, KaryakartaStatus, VoterRecord } from "../types/karyakarta.types";
import { MOCK_KARYAKARTA_USERS } from "../data/mock-karyakarta-data";
import { apiFetch } from "@/lib/api-client";

interface KaryakartaAuthContextType {
  user: KaryakartaUser | null;
  isAuthenticated: boolean;
  status: KaryakartaStatus;
  assignedBooths: string[];
  canAccessVoter: (voter: VoterRecord) => boolean;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    phone: string;
    email: string;
    requestedBooth: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setMockAccount: (status: KaryakartaStatus) => void;
}

const KaryakartaAuthContext = createContext<KaryakartaAuthContextType | undefined>(undefined);

export function KaryakartaAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Read authenticated Karyakarta profile from localStorage first, else null
  const [user, setUser] = useState<KaryakartaUser | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("karyakarta_user");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore parsing error
        }
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Sync fresh profile from database via /auth/me
  const syncProfile = useCallback(async () => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("rajtantra_access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiFetch<any>("/auth/me");
      const userData = (res as any)?.data || res;
      if (userData && userData.id) {
        setUser((prev) => {
          const rawBooths = userData.assignedBooths || prev?.assignedBooths || ["101"];
          const formattedBooths = Array.isArray(rawBooths)
            ? rawBooths.map((b: any) => String(b).trim().replace(/^Booth\s*#?/i, "")).filter(Boolean)
            : ["101"];

          const updated: KaryakartaUser = {
            id: userData.id,
            name: userData.name || prev?.name || "Karyakarta",
            phone: userData.phone || prev?.phone || "",
            email: userData.email || prev?.email || "",
            organizationId: userData.organizationId || prev?.organizationId || "org-kasba-peth-2026",
            candidateName: prev?.candidateName || "Anand Shinde",
            constituencyName:
              userData.constituencyName ||
              userData.organizationName ||
              prev?.constituencyName ||
              "215 - Kasba Peth Assembly",
            assignedBooths: formattedBooths.length > 0 ? formattedBooths : ["101"],
            assignedArea: prev?.assignedArea || `Booth #${formattedBooths.join(", #")} Jurisdiction`,
            status: "ACTIVE",
            hasAiSeat: userData.hasAiSeat ?? false,
            deviceUuid: prev?.deviceUuid || "web-client",
            createdAt: prev?.createdAt || "Active",
          };
          localStorage.setItem("karyakarta_user", JSON.stringify(updated));
          return updated;
        });
      }
    } catch {
      // Keep existing profile from localStorage if offline or network hiccup
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncProfile();
  }, [syncProfile]);

  const status: KaryakartaStatus = user?.status ?? "ACTIVE";
  const isAuthenticated = !!user;
  const assignedBooths = user?.assignedBooths ?? [];

  // Protect and route based on status under /karyakarta
  useEffect(() => {
    if (!pathname.startsWith("/karyakarta")) return;
    if (isLoading) return;

    if (!user) {
      const token = typeof window !== "undefined" ? localStorage.getItem("rajtantra_access_token") : null;
      if (
        !token &&
        pathname !== "/login" &&
        pathname !== "/karyakarta/login" &&
        pathname !== "/karyakarta/register"
      ) {
        router.push("/login");
      }
      return;
    }

    if (user.status === "PENDING_APPROVAL") {
      if (pathname !== "/karyakarta/pending-approval") {
        router.push("/karyakarta/pending-approval");
      }
    } else if (user.status === "SUSPENDED" || user.status === "REJECTED") {
      if (pathname !== "/karyakarta/blocked") {
        router.push("/karyakarta/blocked");
      }
    } else if (user.status === "ACTIVE") {
      if (
        pathname === "/karyakarta/login" ||
        pathname === "/karyakarta/pending-approval" ||
        pathname === "/karyakarta/blocked"
      ) {
        router.push("/karyakarta/dashboard");
      }
    }
  }, [user, isLoading, pathname, router]);

  const canAccessVoter = (voter: VoterRecord): boolean => {
    if (!user || user.status !== "ACTIVE") return false;
    return user.assignedBooths.includes(voter.boothNumber);
  };

  const login = async (identifier: string, _pass: string) => {
    const clean = identifier.trim().toLowerCase();
    const matched = MOCK_KARYAKARTA_USERS.find(
      (u) => u.email.toLowerCase() === clean || u.phone.replace(/\s+/g, "") === clean.replace(/\s+/g, "")
    );

    if (matched) {
      setUser(matched);
      if (typeof window !== "undefined") {
        localStorage.setItem("karyakarta_user", JSON.stringify(matched));
      }
      if (matched.status === "PENDING_APPROVAL") {
        router.push("/karyakarta/pending-approval");
      } else if (matched.status === "SUSPENDED" || matched.status === "REJECTED") {
        router.push("/karyakarta/blocked");
      } else {
        router.push("/karyakarta/dashboard");
      }
      return { success: true };
    }

    return {
      success: false,
      error: "Invalid Karyakarta credentials. Please verify your registered mobile number or activation key.",
    };
  };

  const register = async (data: {
    name: string;
    phone: string;
    email: string;
    requestedBooth: string;
    password: string;
  }) => {
    const newRecord: KaryakartaUser = {
      id: `KAR-2026-${Math.floor(100 + Math.random() * 900)}`,
      name: data.name,
      phone: data.phone,
      email: data.email,
      organizationId: "org-kasba-peth-2026",
      candidateName: "Anand Shinde",
      constituencyName: "215 - Kasba Peth Assembly",
      assignedBooths: data.requestedBooth ? [data.requestedBooth] : [],
      assignedArea: "Registration In Review",
      status: "PENDING_APPROVAL",
      hasAiSeat: false,
      deviceUuid: `dev-web-${Date.now()}`,
      createdAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };

    setUser(newRecord);
    if (typeof window !== "undefined") {
      localStorage.setItem("karyakarta_user", JSON.stringify(newRecord));
    }
    router.push("/karyakarta/pending-approval");
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("karyakarta_user");
      localStorage.removeItem("rajtantra_user");
      localStorage.removeItem("rajtantra_access_token");
      localStorage.removeItem("rajtantra_refresh_token");
      localStorage.removeItem("rajtantra_active_role");
      document.cookie = "rajtantra_access_token=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.replace("/login");
    }
  };

  const setMockAccount = (mockStatus: KaryakartaStatus) => {
    const matched = MOCK_KARYAKARTA_USERS.find((u) => u.status === mockStatus);
    if (matched) {
      setUser(matched);
      if (typeof window !== "undefined") {
        localStorage.setItem("karyakarta_user", JSON.stringify(matched));
      }
      if (mockStatus === "PENDING_APPROVAL") {
        router.push("/karyakarta/pending-approval");
      } else if (mockStatus === "SUSPENDED" || mockStatus === "REJECTED") {
        router.push("/karyakarta/blocked");
      } else {
        router.push("/karyakarta/dashboard");
      }
    }
  };

  return (
    <KaryakartaAuthContext.Provider
      value={{
        user,
        isAuthenticated,
        status,
        assignedBooths,
        canAccessVoter,
        login,
        register,
        logout,
        setMockAccount,
      }}
    >
      {children}
    </KaryakartaAuthContext.Provider>
  );
}

export function useKaryakartaAuth() {
  const context = useContext(KaryakartaAuthContext);
  if (!context) {
    throw new Error("useKaryakartaAuth must be used within a KaryakartaAuthProvider");
  }
  return context;
}

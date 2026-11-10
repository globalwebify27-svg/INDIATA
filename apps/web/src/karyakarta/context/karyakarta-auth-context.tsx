"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { KaryakartaUser, KaryakartaStatus, VoterRecord } from "../types/karyakarta.types";
import { MOCK_KARYAKARTA_USERS } from "../data/mock-karyakarta-data";

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

  // Default to active Karyakarta KAR-2026-001 (Sachin Mane)
  const [user, setUser] = useState<KaryakartaUser | null>(MOCK_KARYAKARTA_USERS[0] ?? null);

  const status: KaryakartaStatus = user?.status ?? "ACTIVE";
  const isAuthenticated = !!user;
  const assignedBooths = user?.assignedBooths ?? [];

  // Protect and route based on status under /karyakarta
  useEffect(() => {
    if (!pathname.startsWith("/karyakarta")) return;

    if (!user) {
      if (
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
  }, [user, pathname, router]);

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
      if (matched.status === "PENDING_APPROVAL") {
        router.push("/karyakarta/pending-approval");
      } else if (matched.status === "SUSPENDED" || matched.status === "REJECTED") {
        router.push("/karyakarta/blocked");
      } else {
        router.push("/karyakarta/dashboard");
      }
      return { success: true };
    }

    // Default fallback to active Karyakarta KAR-2026-001
    if (clean.includes("karyakarta") || clean.includes("mane")) {
      setUser(MOCK_KARYAKARTA_USERS[0] ?? null);
      router.push("/karyakarta/dashboard");
      return { success: true };
    }

    return {
      success: false,
      error: "Invalid Karyakarta credentials. Please verify your registered mobile number.",
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
    router.push("/karyakarta/pending-approval");
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
  };

  const setMockAccount = (mockStatus: KaryakartaStatus) => {
    const matched = MOCK_KARYAKARTA_USERS.find((u) => u.status === mockStatus);
    if (matched) {
      setUser(matched);
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

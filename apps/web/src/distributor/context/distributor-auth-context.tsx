"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DistributorStatus } from "@rajtantra/common-types";
import { DistributorRecord, MOCK_DISTRIBUTORS } from "../data/mock-distributor-data";

interface AuthContextType {
  distributor: DistributorRecord | null;
  isAuthenticated: boolean;
  status: DistributorStatus;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    companyName: string;
    contactName: string;
    phone: string;
    email: string;
    location: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setMockAccount: (status: DistributorStatus) => void;
}

const DistributorAuthContext = createContext<AuthContextType | undefined>(undefined);

export function DistributorAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Default to active distributor DIS-101
  const [distributor, setDistributor] = useState<DistributorRecord | null>(MOCK_DISTRIBUTORS[0] ?? null);

  const status = distributor?.status ?? DistributorStatus.ACTIVE;
  const isAuthenticated = !!distributor;

  // Protect and route based on status under /distributor
  useEffect(() => {
    if (!pathname.startsWith("/distributor")) return;

    if (!distributor) {
      if (pathname !== "/login" && pathname !== "/distributor/register") {
        router.push("/login");
      }
      return;
    }

    if (distributor.status === DistributorStatus.PENDING) {
      if (pathname !== "/distributor/pending-approval") {
        router.push("/distributor/pending-approval");
      }
    } else if (
      distributor.status === DistributorStatus.SUSPENDED ||
      distributor.status === DistributorStatus.REJECTED
    ) {
      if (pathname !== "/distributor/blocked") {
        router.push("/distributor/blocked");
      }
    } else if (distributor.status === DistributorStatus.ACTIVE) {
      if (
        pathname === "/login" ||
        pathname === "/distributor/login" ||
        pathname === "/distributor/pending-approval" ||
        pathname === "/distributor/blocked"
      ) {
        router.push("/distributor/dashboard");
      }
    }
  }, [distributor, pathname, router]);

  const login = async (email: string, _pass: string) => {
    const matched = MOCK_DISTRIBUTORS.find((d) => d.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setDistributor(matched);
      if (matched.status === DistributorStatus.PENDING) {
        router.push("/distributor/pending-approval");
      } else if (
        matched.status === DistributorStatus.SUSPENDED ||
        matched.status === DistributorStatus.REJECTED
      ) {
        router.push("/distributor/blocked");
      } else {
        router.push("/distributor/dashboard");
      }
      return { success: true };
    }

    // Default fallback to active distributor DIS-101 if email matches distributor
    if (email.includes("distributor") || email.includes("mahamedia")) {
      setDistributor(MOCK_DISTRIBUTORS[0] ?? null);
      router.push("/distributor/dashboard");
      return { success: true };
    }

    return { success: false, error: "Invalid distributor credentials. Please verify your registered email and password." };
  };

  const register = async (data: {
    companyName: string;
    contactName: string;
    phone: string;
    email: string;
    location: string;
    password: string;
  }) => {
    const newRecord: DistributorRecord = {
      id: `DIS-${Math.floor(100 + Math.random() * 900)}`,
      distributorCode: `DIS-${Math.floor(100 + Math.random() * 900)}`,
      companyName: data.companyName,
      name: data.companyName,
      contactName: data.contactName,
      contactPerson: data.contactName,
      email: data.email,
      phone: data.phone,
      location: data.location,
      territory: data.location,
      status: DistributorStatus.PENDING,
      commissionRatePct: 15.0,
      totalCandidates: 0,
      activeCandidates: 0,
      registrationDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      createdAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };

    setDistributor(newRecord);
    router.push("/distributor/pending-approval");
    return { success: true };
  };

  const logout = () => {
    setDistributor(null);
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
  };

  const setMockAccount = (mockStatus: DistributorStatus) => {
    const matched = MOCK_DISTRIBUTORS.find((d) => d.status === mockStatus);
    if (matched) {
      setDistributor(matched);
      if (mockStatus === DistributorStatus.PENDING) {
        router.push("/distributor/pending-approval");
      } else if (
        mockStatus === DistributorStatus.SUSPENDED ||
        mockStatus === DistributorStatus.REJECTED
      ) {
        router.push("/distributor/blocked");
      } else {
        router.push("/distributor/dashboard");
      }
    }
  };

  return (
    <DistributorAuthContext.Provider
      value={{
        distributor,
        isAuthenticated,
        status,
        login,
        register,
        logout,
        setMockAccount,
      }}
    >
      {children}
    </DistributorAuthContext.Provider>
  );
}

export function useDistributorAuth() {
  const context = useContext(DistributorAuthContext);
  if (!context) {
    throw new Error("useDistributorAuth must be used within a DistributorAuthProvider");
  }
  return context;
}

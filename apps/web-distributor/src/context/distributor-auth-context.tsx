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

  // Protect and route based on status
  useEffect(() => {
    if (!distributor) {
      if (pathname !== "/login" && pathname !== "/register") {
        router.push("/login");
      }
      return;
    }

    if (distributor.status === DistributorStatus.PENDING) {
      if (pathname !== "/pending-approval") {
        router.push("/pending-approval");
      }
    } else if (
      distributor.status === DistributorStatus.SUSPENDED ||
      distributor.status === DistributorStatus.REJECTED
    ) {
      if (pathname !== "/blocked") {
        router.push("/blocked");
      }
    } else if (distributor.status === DistributorStatus.ACTIVE) {
      if (pathname === "/login" || pathname === "/pending-approval" || pathname === "/blocked") {
        router.push("/dashboard");
      }
    }
  }, [distributor, pathname, router]);

  const login = async (email: string, _pass: string) => {
    const matched = MOCK_DISTRIBUTORS.find((d) => d.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setDistributor(matched);
      if (matched.status === DistributorStatus.PENDING) {
        router.push("/pending-approval");
      } else if (
        matched.status === DistributorStatus.SUSPENDED ||
        matched.status === DistributorStatus.REJECTED
      ) {
        router.push("/blocked");
      } else {
        router.push("/dashboard");
      }
      return { success: true };
    }

    // Default fallback to active distributor DIS-101 if email matches distributor
    if (email.includes("distributor") || email.includes("mahamedia")) {
      setDistributor(MOCK_DISTRIBUTORS[0] ?? null);
      router.push("/dashboard");
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
      companyName: data.companyName,
      contactName: data.contactName,
      phone: data.phone,
      email: data.email,
      location: data.location,
      status: DistributorStatus.PENDING,
      commissionRatePct: 10.0,
      totalCandidates: 0,
      activeCandidates: 0,
      registrationDate: "Today, Just now",
    };

    setDistributor(newRecord);
    router.push("/pending-approval");
    return { success: true };
  };

  const logout = () => {
    setDistributor(null);
    router.push("/login");
  };

  const setMockAccount = (newStatus: DistributorStatus) => {
    const match = MOCK_DISTRIBUTORS.find((d) => d.status === newStatus);
    if (match) {
      setDistributor(match);
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
    throw new Error("useDistributorAuth must be used within DistributorAuthProvider");
  }
  return context;
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDistributorAuth } from "../context/distributor-auth-context";
import { DistributorStatus } from "@rajtantra/common-types";

export default function RootPage() {
  const router = useRouter();
  const { distributor, isAuthenticated } = useDistributorAuth();

  useEffect(() => {
    if (!isAuthenticated || !distributor) {
      router.replace("/login");
      return;
    }

    if (distributor.status === DistributorStatus.PENDING) {
      router.replace("/pending-approval");
    } else if (
      distributor.status === DistributorStatus.SUSPENDED ||
      distributor.status === DistributorStatus.REJECTED
    ) {
      router.replace("/blocked");
    } else {
      router.replace("/dashboard");
    }
  }, [distributor, isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-[#2087FE] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-500">Redirecting to Distributor Portal...</span>
      </div>
    </div>
  );
}

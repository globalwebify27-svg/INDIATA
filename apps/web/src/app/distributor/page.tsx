"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDistributorAuth } from "../../distributor/context/distributor-auth-context";

export default function DistributorEntryPage() {
  const router = useRouter();
  const { isAuthenticated, status } = useDistributorAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/distributor/login");
    } else {
      router.replace("/distributor/dashboard");
    }
  }, [isAuthenticated, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#2087FE] border-t-transparent animate-spin" />
        <span className="text-xs font-semibold text-slate-500">
          Entering Distributor Franchise Portal...
        </span>
      </div>
    </div>
  );
}

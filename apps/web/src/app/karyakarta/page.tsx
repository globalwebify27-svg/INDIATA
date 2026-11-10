"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useKaryakartaAuth } from "../../karyakarta/context/karyakarta-auth-context";

export default function KaryakartaEntryPage() {
  const router = useRouter();
  const { isAuthenticated, status } = useKaryakartaAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (status === "PENDING_APPROVAL") {
      router.replace("/karyakarta/pending-approval");
    } else if (status === "SUSPENDED" || status === "REJECTED") {
      router.replace("/karyakarta/blocked");
    } else {
      router.replace("/karyakarta/dashboard");
    }
  }, [isAuthenticated, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#6256d9] border-t-transparent animate-spin" />
        <span className="text-xs font-semibold text-slate-500">
          Entering INDIATA Karyakarta Field Portal...
        </span>
      </div>
    </div>
  );
}

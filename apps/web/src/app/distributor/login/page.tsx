"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DistributorLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center py-12 px-4">
      <div className="w-8 h-8 rounded-full border-2 border-[#2087FE] border-t-transparent animate-spin mb-3" />
      <span className="text-xs font-semibold text-slate-500">
        Redirecting to Central Platform Login...
      </span>
    </div>
  );
}

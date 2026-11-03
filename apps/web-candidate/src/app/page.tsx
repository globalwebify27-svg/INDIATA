"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/dashboard");
      } else {
        router.replace("/auth/login");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F3FA] dark:bg-[#0B1120]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-[#493BBF] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#707E94] dark:text-[#94A3B8] font-medium">
          Loading Rajtantra Candidate War Room...
        </p>
      </div>
    </div>
  );
}

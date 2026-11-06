"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@rajtantra/common-types";

export default function RootDispatcherPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      window.location.replace("/login");
      return;
    }

    if (user?.role === UserRole.SUPER_ADMIN) {
      window.location.replace("/super-admin");
    } else {
      window.location.replace("/candidate");
    }
  }, [user, isAuthenticated, isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium">
          Loading Election Platform Command...
        </p>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Initialize and persist sidebar collapse preference
  useEffect(() => {
    const saved = localStorage.getItem("rajtantra_candidate_sidebar_collapsed");
    if (saved !== null) {
      setCollapsed(saved === "true");
    }
  }, []);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("rajtantra_candidate_sidebar_collapsed", String(next));
      return next;
    });
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F3FA] dark:bg-[#0B1120]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#493BBF] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#707E94] dark:text-[#94A3B8] font-medium">
            Connecting to Rajtantra Election OS...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F3FA] dark:bg-[#0B1120] text-[#161B2A] dark:text-[#F8FAFC] flex flex-col font-sans">
      {/* COLLAPSIBLE SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* MAIN CONTENT SHELL (Adjusts automatically when sidebar collapses/expands) */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ease-in-out min-h-screen ${
          collapsed ? "md:ml-[76px]" : "md:ml-64"
        }`}
      >
        {/* COMPACT TOP HEADER */}
        <Header
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
          onOpenMobile={() => setMobileOpen(true)}
        />

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { DistributorSidebar } from "./distributor-sidebar";
import { DistributorHeader } from "./distributor-header";

interface DistributorLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function DistributorLayout({
  children,
  title,
  subtitle,
}: DistributorLayoutProps) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Initialize and persist sidebar collapse preference
  useEffect(() => {
    const saved = localStorage.getItem("rajtantra_distributor_sidebar_collapsed");
    if (saved !== null) {
      setCollapsed(saved === "true");
    }
  }, []);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("rajtantra_distributor_sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex text-slate-900 dark:text-slate-100 antialiased max-w-[100vw] overflow-x-clip">
      {/* Fixed Persistent Sidebar for Desktop */}
      <div
        className={`hidden md:block fixed top-0 left-0 bottom-0 z-40 h-screen transition-all duration-200 ease-in-out ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <DistributorSidebar
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-slate-950 shadow-2xl z-50 flex flex-col">
            <DistributorSidebar
              collapsed={false}
              onCloseMobile={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-200 ease-in-out ${
          collapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <DistributorHeader
          title={title}
          subtitle={subtitle}
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { KaryakartaSidebar } from "./karyakarta-sidebar";
import { KaryakartaHeader } from "./karyakarta-header";

export function KaryakartaLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Initialize and persist sidebar collapse preference
  useEffect(() => {
    const saved = localStorage.getItem("rajtantra_karyakarta_sidebar_collapsed");
    if (saved !== null) {
      setCollapsed(saved === "true");
    }
  }, []);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("rajtantra_karyakarta_sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased max-w-[100vw] overflow-x-hidden">
      {/* Desktop Persistent Sticky Sidebar */}
      <div
        className={`hidden lg:block shrink-0 h-screen sticky top-0 transition-all duration-200 ease-in-out z-40 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <KaryakartaSidebar
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-64 bg-slate-950 shadow-2xl z-50 flex flex-col">
            <KaryakartaSidebar
              collapsed={false}
              onCloseMobile={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <KaryakartaHeader
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

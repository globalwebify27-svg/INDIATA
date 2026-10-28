"use client";

import React, { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { NavKey, NotificationItem } from "../../types/superadmin.types";

export interface AppShellProps {
  activeNav: NavKey;
  onNavigate: (key: NavKey) => void;
  notifications: NotificationItem[];
  pricingVisible: boolean;
  onTogglePricingVisibility: (visible: boolean) => void;
  children: React.ReactNode;
}

export function AppShell({
  activeNav,
  onNavigate,
  notifications,
  pricingVisible,
  onTogglePricingVisibility,
  children,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sidebar Component */}
      <Sidebar
        activeNav={activeNav}
        onNavigate={onNavigate}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Sticky Top Header */}
        <Header
          activeNav={activeNav}
          onOpenMobile={() => setMobileOpen(true)}
          notifications={notifications}
          pricingVisible={pricingVisible}
          onTogglePricingVisibility={onTogglePricingVisibility}
          onNavigate={onNavigate}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900">
          Rajtantra Election Engine &bull; Multi-Tenant Platform Console v1.0.0 &bull; All Rights Reserved
        </footer>
      </div>
    </div>
  );
}

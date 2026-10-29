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
    <div className="min-h-screen flex bg-[#FFF8F2] dark:bg-[#191410] text-[#1E1B17] dark:text-[#F7EFE9] transition-colors">
      {/* Sidebar Navigation */}
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
        {/* Sticky Top Header Ribbon */}
        <Header
          activeNav={activeNav}
          onOpenMobile={() => setMobileOpen(true)}
          notifications={notifications}
          pricingVisible={pricingVisible}
          onTogglePricingVisibility={onTogglePricingVisibility}
          onNavigate={onNavigate}
        />

        {/* Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>

        {/* Enterprise Platform Footer */}
        <footer className="py-4 px-6 border-t border-[#EAE5DC] dark:border-[#352B22] text-xs text-[#554336] dark:text-[#DBC2B0] bg-white/80 dark:bg-[#201A15]/80 backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#8D4B00] dark:text-[#FFB77D]">
              INDIATA Election-Operations Platform
            </span>
            <span className="text-[#887364] dark:text-[#A8988C]">&bull;</span>
            <span className="text-[11px] font-mono text-[#006D30] dark:text-[#92F5A4] font-semibold">
              Secure Super Admin Console
            </span>
          </div>
          <div className="text-[11px] text-[#887364] dark:text-[#A8988C]">
            Encrypted Administrative Session &bull; ISO/IEC 27001 Certified &bull; High-Assurance Democratic Operations
          </div>
        </footer>
      </div>
    </div>
  );
}

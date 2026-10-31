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
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarWidth = collapsed ? "68px" : "270px";

  return (
    <div
      style={
        {
          "--sidebar-width": sidebarWidth,
          "--header-height": "64px",
        } as React.CSSProperties
      }
      className="min-h-screen bg-[#F3F8FD] dark:bg-[#191410] text-[#010627] dark:text-[#F7EFE9] transition-colors"
    >
      {/* 1. Permanently Fixed Left Sidebar (100vh) */}
      <Sidebar
        activeNav={activeNav}
        onNavigate={onNavigate}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* 2. Permanently Fixed Top Navbar */}
      <Header
        activeNav={activeNav}
        onOpenMobile={() => setMobileOpen(true)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        notifications={notifications}
        pricingVisible={pricingVisible}
        onTogglePricingVisibility={onTogglePricingVisibility}
        onNavigate={onNavigate}
      />

      {/* 3. Main Application Area (offset left by sidebar width, top by header height) */}
      <div className="min-h-screen flex flex-col md:ml-[var(--sidebar-width)] pt-[var(--header-height)] min-w-0 transition-all duration-200 ease-in-out">
        {/* Scrollable Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>

        {/* Enterprise Platform Footer */}
        <footer className="py-4 px-6 border-t border-[#ACB9D1] dark:border-[#352B22] text-xs text-[#010627] dark:text-[#DBC2B0] bg-[#FDFEFE]/80 dark:bg-[#201A15]/80 backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#2087FE] dark:text-[#FFB77D]">
              INDIATA Election-Operations Platform
            </span>
            <span className="text-[#ACB9D1] dark:text-[#A8988C]">&bull;</span>
            <span className="text-[11px] font-mono text-[#12CF94] dark:text-[#92F5A4] font-semibold">
              Secure Super Admin Console
            </span>
          </div>
          <div className="text-[11px] text-[#717785] dark:text-[#A8988C]">
            Encrypted Administrative Session &bull; ISO/IEC 27001 Certified &bull; High-Assurance Democratic Operations
          </div>
        </footer>
      </div>
    </div>
  );
}

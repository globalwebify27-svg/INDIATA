"use client";

import React from "react";
import {
  LayoutDashboard,
  ChevronRight,
  ChevronLeft,
  X,
  ShieldCheck,
} from "lucide-react";
import { NavKey } from "../../types/superadmin.types";

export interface SidebarProps {
  activeNav: NavKey;
  onNavigate: (key: NavKey) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  activeNav,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 flex flex-col h-screen bg-[#FAF2EB] dark:bg-[#1C1611] border-r border-[#EAE5DC] dark:border-[#352B22] text-[#554336] dark:text-[#DBC2B0] transition-all duration-200 select-none shadow-sm ${
          collapsed ? "w-16" : "w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Brand Header with Institutional Shield & INDIATA Mark */}
        <div className="h-16 px-3.5 flex items-center justify-between border-b border-[#EAE5DC] dark:border-[#352B22] bg-[#FAF2EB] dark:bg-[#1C1611]">
          <div
            className="flex items-center gap-2.5 overflow-hidden cursor-pointer"
            onClick={() => {
              onNavigate("dashboard");
              onCloseMobile();
            }}
          >
            {collapsed ? (
              /* Compact Icon Mark for Collapsed Dock */
              <div className="w-9 h-9 rounded-xl bg-[#8D4B00] text-white flex items-center justify-center flex-shrink-0 shadow-xs ring-2 ring-[#8D4B00]/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
            ) : (
              /* Full Official Wordmark for Expanded Sidebar */
              <div className="flex items-center gap-3">
                <div
                  aria-label="INDIATA Institutional Shield Emblem"
                  className="w-10 h-10 rounded-xl bg-[#8D4B00] flex items-center justify-center text-white shadow-xs ring-2 ring-[#8D4B00]/20 flex-shrink-0"
                >
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#8D4B00] dark:text-[#FFB77D] tracking-tight">
                      INDIATA
                    </span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006D30] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006D30]" />
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-[#554336] dark:text-[#DBC2B0] truncate">
                    Super Admin Console
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg text-[#887364] hover:text-[#1E1B17] dark:hover:text-[#F7EFE9] hover:bg-[#F4EDE6] dark:hover:bg-[#2B241E] transition-colors cursor-pointer"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-[#887364] hover:text-[#1E1B17] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Item — Exclusively Dashboard */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scroll">
          <button
            type="button"
            onClick={() => {
              onNavigate("dashboard");
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors duration-150 group cursor-pointer ${
              activeNav === "dashboard"
                ? "bg-[#E8E1DB]/70 dark:bg-[#352B22] text-[#8D4B00] dark:text-[#FFB77D] font-semibold shadow-xs"
                : "text-[#554336] dark:text-[#DBC2B0] hover:bg-[#F4EDE6]/60 dark:hover:bg-[#2B241E] hover:text-[#1E1B17]"
            }`}
            title={collapsed ? "Overview Dashboard" : undefined}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4 flex-shrink-0 text-[#8D4B00] dark:text-[#FFB77D]" />
              {!collapsed && <span>Overview Dashboard</span>}
            </div>

            {!collapsed && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFDCC3] dark:bg-[#6E3900] text-[#6E3900] dark:text-[#FFDCC3] border border-[#B15F00]/20">
                Active
              </span>
            )}
          </button>
        </nav>

        {/* Bottom Nav Section with Operational Utilities and Admin Profile */}
        <div className="p-3 border-t border-[#EAE5DC] dark:border-[#352B22] space-y-2.5 bg-[#FAF2EB] dark:bg-[#1C1611]">
          {!collapsed && (
            <div className="space-y-1">
              {/* Security Audit Status */}
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#F4EDE6]/60 dark:bg-[#251E18] text-[#554336] dark:text-[#DBC2B0] text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#006D30] dark:text-[#92F5A4]" />
                  <span>Security Audit</span>
                </div>
                <span className="text-[11px] text-[#006D30] dark:text-[#92F5A4] font-semibold">
                  Active
                </span>
              </div>

              {/* System Health Status */}
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#F4EDE6]/60 dark:bg-[#251E18] text-[#554336] dark:text-[#DBC2B0] text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#006D30] dark:bg-[#92F5A4] animate-pulse" />
                  <span>System Health</span>
                </div>
                <span className="text-[11px] text-[#006D30] dark:text-[#92F5A4] font-semibold font-mono">
                  99.98%
                </span>
              </div>
            </div>
          )}

          {/* Administrator Profile Badge */}
          <div className="p-2.5 rounded-xl bg-white dark:bg-[#251E18] border border-[#EAE5DC] dark:border-[#352B22] flex items-center gap-2.5 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-[#FFDCC3] text-[#8D4B00] font-bold text-xs flex items-center justify-center flex-shrink-0">
              SA
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1 leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-[#1E1B17] dark:text-[#F7EFE9] truncate">
                    Root Super Admin
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006D30]" />
                </div>
                <p className="text-[10px] text-[#887364] dark:text-[#A8988C] truncate font-mono mt-0.5">
                  admin@indiata.gov.in
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

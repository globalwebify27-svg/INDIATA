"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  User,
  LogOut,
  Key,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { useTheme } from "../../context/theme-context";
import { useToast } from "../../context/toast-context";
import { NotificationItem, NavKey } from "../../types/superadmin.types";
import { NotificationDrawer } from "./notification-drawer";

export interface HeaderProps {
  activeNav: NavKey;
  onOpenMobile: () => void;
  notifications: NotificationItem[];
  pricingVisible: boolean;
  onTogglePricingVisibility: (visible: boolean) => void;
  onNavigate: (key: NavKey) => void;
}

export function Header({
  activeNav,
  onOpenMobile,
  notifications,
  pricingVisible,
  onTogglePricingVisibility,
  onNavigate,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const unreadAlertsCount = notifications.filter((n) => !n.read).length;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(e.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePricingSwitch = () => {
    const nextState = !pricingVisible;
    onTogglePricingVisibility(nextState);
    toast(
      nextState
        ? "Global Pricing Visibility enabled. Standard rates displayed across candidate portals."
        : "Global Pricing Visibility disabled. Prices hidden; enquiry quotes enforced.",
      nextState ? "info" : "warning"
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    toast(`Searching platform for: "${searchQuery}"`, "info");
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile hamburger & Context breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="text-slate-400 dark:text-slate-500">Super Admin</span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
            {activeNav.replace(/-/g, " ")}
          </span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative hidden md:block w-64 lg:w-80"
      >
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search candidates, distributors, audits..."
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
        />
      </form>

      {/* Right: Quick actions, Status, Theme, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Pricing Visibility Switch (Module Rule) */}
        <button
          type="button"
          onClick={handlePricingSwitch}
          className={`hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
            pricingVisible
              ? "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
          }`}
          title="Global Pricing Visibility across Candidate Portals (Section 3.1)"
        >
          {pricingVisible ? (
            <Eye className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          ) : (
            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span>Pricing: {pricingVisible ? "Public" : "Hidden"}</span>
        </button>

        {/* System Health Operational Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Platform Operational</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Notifications Button with Drawer */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationDrawerOpen(!notificationDrawerOpen)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative"
            title="Administrative Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          <NotificationDrawer
            isOpen={notificationDrawerOpen}
            onClose={() => setNotificationDrawerOpen(false)}
            notifications={notifications}
            onMarkAllRead={() => {
              toast("All administrative alerts marked as reviewed.", "info");
              setNotificationDrawerOpen(false);
            }}
          />
        </div>

        {/* Super Admin Account Dropdown Menu */}
        <div className="relative" ref={accountMenuRef}>
          <button
            type="button"
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            className="flex items-center gap-2 p-1 pl-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-md bg-sky-600 text-white font-bold text-xs flex items-center justify-center">
              SA
            </div>
            <div className="hidden sm:block text-left pr-1 leading-tight">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Super Admin
              </div>
              <div className="text-[10px] text-slate-400">Security Clearance Level 0</div>
            </div>
          </button>

          {accountMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  Global Root Administrator
                </div>
                <div className="text-[11px] text-slate-500">
                  admin@rajtantra.gov.in
                </div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("profile");
                    setAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Administrator Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("settings");
                    setAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <Key className="w-3.5 h-3.5 text-slate-400" />
                  API Keys & Security
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("audit");
                    setAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  Access Audit Logs
                </button>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    toast("Administrative session ended successfully.", "info");
                    setAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out of Super Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

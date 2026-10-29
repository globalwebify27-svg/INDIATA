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
  Command,
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
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-[#201A15] border-b border-[#EAE5DC] dark:border-[#352B22] px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors shadow-2xs">
      {/* Left: Mobile hamburger & Context breadcrumb */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <button
          type="button"
          onClick={onOpenMobile}
          className="md:hidden p-1.5 rounded-lg text-[#554336] dark:text-[#DBC2B0] hover:bg-[#F4EDE6] dark:hover:bg-[#2B241E] cursor-pointer"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Stitch Breadcrumb Ribbon */}
        <nav className="flex items-center gap-1.5 text-xs text-[#554336] dark:text-[#DBC2B0] flex-shrink-0">
          <span className="text-[#8D4B00] dark:text-[#FFB77D] font-bold">INDIATA</span>
          <span className="text-[#887364] dark:text-[#A8988C] text-sm">&rsaquo;</span>
          <span>Super Admin</span>
          <span className="text-[#887364] dark:text-[#A8988C] text-sm">&rsaquo;</span>
          <span className="font-bold text-[#1E1B17] dark:text-[#F7EFE9] capitalize">
            {activeNav === "dashboard" ? "Overview" : activeNav.replace(/-/g, " ")}
          </span>
        </nav>

        {/* Center: Global Search Bar with ⌘K shortcut badge */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative hidden md:block w-full max-w-md ml-2"
        >
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#887364] dark:text-[#A8988C] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search organizations, subscriptions, audits... (Press ⌘K)"
            className="w-full pl-9 pr-12 py-1.5 text-xs rounded-lg border border-[#EAE5DC] dark:border-[#3F372F] bg-[#FAF2EB] dark:bg-[#2B241E] text-[#1E1B17] dark:text-[#F7EFE9] placeholder:text-[#887364] dark:placeholder:text-[#A8988C] focus:outline-none focus:border-[#8D4B00] focus:ring-2 focus:ring-[#8D4B00]/10 transition-colors"
          />
          <div className="absolute right-2.5 top-2 flex items-center gap-0.5 pointer-events-none text-[10px] text-[#554336] dark:text-[#DBC2B0] font-mono bg-[#F4EDE6] dark:bg-[#352B22] px-1.5 py-0.5 rounded border border-[#EAE5DC] dark:border-[#3F372F]">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </form>
      </div>

      {/* Right: Operational SLA, Pricing, Theme, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Operational SLA Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCFCE7]/70 dark:bg-[#005323]/30 border border-[#92F5A4] dark:border-[#005323] text-[#006D30] dark:text-[#92F5A4] text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#006D30] dark:bg-[#92F5A4] animate-pulse" />
          <span>Election Cycle 2024-25 • Operational (99.98% SLA)</span>
        </div>

        <div className="h-5 w-px bg-[#EAE5DC] dark:bg-[#352B22] mx-0.5 hidden sm:block" />

        {/* Global Pricing Visibility Switch (Module Rule) */}
        <button
          type="button"
          onClick={handlePricingSwitch}
          className={`hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
            pricingVisible
              ? "bg-[#FFDCC3]/60 dark:bg-[#6E3900]/40 text-[#8D4B00] dark:text-[#FFB77D] border-[#FFDCC3] dark:border-[#6E3900]"
              : "bg-[#FAF2EB] dark:bg-[#2B241E] text-[#554336] dark:text-[#DBC2B0] border-[#EAE5DC] dark:border-[#3F372F]"
          }`}
          title="Global Pricing Visibility across Candidate Portals"
        >
          {pricingVisible ? (
            <Eye className="w-3.5 h-3.5 text-[#8D4B00] dark:text-[#FFB77D]" />
          ) : (
            <EyeOff className="w-3.5 h-3.5 text-[#887364]" />
          )}
          <span>Pricing: {pricingVisible ? "Public" : "Hidden"}</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-[#EAE5DC] dark:border-[#352B22] text-[#554336] dark:text-[#DBC2B0] hover:bg-[#F4EDE6] dark:hover:bg-[#2B241E] transition-colors cursor-pointer"
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>

        {/* Notifications Button with Drawer */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationDrawerOpen(!notificationDrawerOpen)}
            className="p-2 rounded-lg border border-[#EAE5DC] dark:border-[#352B22] text-[#554336] dark:text-[#DBC2B0] hover:bg-[#F4EDE6] dark:hover:bg-[#2B241E] transition-colors relative cursor-pointer"
            title="Administrative Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8D4B00] animate-pulse" />
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
            className="flex items-center gap-2 p-1 pl-1.5 rounded-lg border border-[#EAE5DC] dark:border-[#352B22] hover:bg-[#F4EDE6] dark:hover:bg-[#2B241E] transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-md bg-[#8D4B00] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              SA
            </div>
            <div className="hidden sm:block text-left pr-1 leading-tight">
              <div className="text-xs font-semibold text-[#1E1B17] dark:text-[#F7EFE9]">
                Super Admin
              </div>
              <div className="text-[10px] text-[#887364] dark:text-[#A8988C] font-mono">
                Clearance L0
              </div>
            </div>
          </button>

          {accountMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#EAE5DC] dark:border-[#352B22] bg-white dark:bg-[#201A15] shadow-lg py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-[#EAE5DC] dark:border-[#352B22]">
                <div className="font-semibold text-[#1E1B17] dark:text-[#F7EFE9] flex items-center justify-between">
                  <span>Root Administrator</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#FFDCC3] dark:bg-[#6E3900] text-[#8D4B00] dark:text-[#FFB77D]">
                    Level 0
                  </span>
                </div>
                <div className="text-[11px] text-[#554336] dark:text-[#DBC2B0] font-mono mt-0.5">
                  admin@indiata.gov.in
                </div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("profile");
                    setAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[#554336] dark:text-[#DBC2B0] hover:bg-[#F4EDE6] dark:hover:bg-[#2B241E] text-left transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#887364]" />
                  Administrator Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("settings");
                    setAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[#554336] dark:text-[#DBC2B0] hover:bg-[#F4EDE6] dark:hover:bg-[#2B241E] text-left transition-colors cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-[#887364]" />
                  API Keys &amp; Security
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("audit");
                    setAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[#554336] dark:text-[#DBC2B0] hover:bg-[#F4EDE6] dark:hover:bg-[#2B241E] text-left transition-colors cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-[#887364]" />
                  Access Audit Ledger
                </button>
              </div>

              <div className="border-t border-[#EAE5DC] dark:border-[#352B22] pt-1">
                <button
                  type="button"
                  onClick={() => {
                    toast("Administrative session ended successfully.", "info");
                    setAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[#BA1A1A] dark:text-[#FFB4AB] hover:bg-[#FFDAD6]/50 dark:hover:bg-[#93000A]/30 text-left transition-colors cursor-pointer"
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

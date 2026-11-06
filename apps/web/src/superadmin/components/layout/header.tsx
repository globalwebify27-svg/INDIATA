"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
  BarChart3,
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
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  notifications: NotificationItem[];
  pricingVisible: boolean;
  onTogglePricingVisibility: (visible: boolean) => void;
  onNavigate: (key: NavKey) => void;
}

export function Header({
  activeNav,
  onOpenMobile,
  collapsed = true,
  onToggleCollapse,
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const unreadAlertsCount = notifications.filter((n) => !n.read).length;

  // Keyboard shortcut listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onOpenMobile();
    } else if (onToggleCollapse) {
      onToggleCollapse();
    }
  };

  return (
    <header
      id="superadmin-header"
      className="fixed top-0 right-0 left-0 md:left-[var(--sidebar-width)] z-30 h-16 bg-[#FDFEFE] dark:bg-[#062237] border-b border-[#ACB9D1] dark:border-[#0e3554] px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-200 ease-in-out shadow-2xs"
    >
      {/* Zone 1: Left Section - Single Designated Hamburger Toggle & Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
        {/* Single Designated Hamburger Toggle Button */}
        <button
          type="button"
          onClick={handleToggleSidebar}
          className="p-1.5 sm:p-2 rounded-lg text-[#010627] dark:text-[#94A3B8] hover:text-[#2087FE] dark:hover:text-[#0D79FD] hover:bg-[#E0EDFE] dark:hover:bg-[#072439] transition-colors cursor-pointer flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2087FE]"
          aria-label={collapsed ? "Expand sidebar navigation" : "Collapse sidebar navigation"}
          aria-expanded={!collapsed}
          title={collapsed ? "Expand sidebar navigation" : "Collapse sidebar navigation"}
        >
          <Menu className="w-5 h-5 text-[#2087FE] dark:text-[#0D79FD]" />
        </button>

        {/* Contextual Breadcrumb Ribbon */}
        <nav
          aria-label="Breadcrumb navigation"
          className="flex items-center gap-1.5 sm:gap-2 text-xs text-[#717785] dark:text-[#94A3B8] min-w-0"
        >
          <div className="h-5 flex items-center flex-shrink-0">
            <img
              src="/brand/indiata-logo.png"
              alt="INDIATA"
              className="h-5 w-auto object-contain dark:hidden"
            />
            <img
              src="/brand/indiata-logo-dark.png"
              alt="INDIATA"
              className="h-5 w-auto object-contain hidden dark:block"
            />
          </div>
          <span className="text-[#ACB9D1] dark:text-[#0e3554] text-xs flex-shrink-0">
            &rsaquo;
          </span>
          <span className="hidden sm:inline flex-shrink-0 text-[#717785] dark:text-[#94A3B8]">
            Super Admin
          </span>
          <span className="hidden sm:inline text-[#ACB9D1] dark:text-[#0e3554] text-xs flex-shrink-0">
            &rsaquo;
          </span>
          <span className="font-bold text-[#010627] dark:text-[#F5F6F6] capitalize truncate max-w-[120px] sm:max-w-[180px] md:max-w-none">
            {activeNav === "dashboard" ? "Overview" : activeNav.replace(/-/g, " ")}
          </span>
        </nav>
      </div>

      {/* Zone 2: Center Section - Search Bar with Controlled Width & Shortcut */}
      <div className="flex-1 max-w-xs md:max-w-sm lg:max-w-md mx-2 min-w-0 hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#717785] dark:text-[#94A3B8] pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search organizations, audits... (⌘K)"
            className="w-full pl-9 pr-12 py-1.5 text-xs rounded-lg border border-[#ACB9D1] dark:border-[#0e3554] bg-[#F3F8FD] dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] placeholder:text-[#717785] dark:placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2087FE] focus:ring-2 focus:ring-[#2087FE]/10 transition-colors truncate"
          />
          <div className="absolute right-2 top-2 flex items-center gap-0.5 pointer-events-none text-[10px] text-[#717785] dark:text-[#94A3B8] font-mono bg-[#E0EDFE] dark:bg-[#062237] px-1.5 py-0.5 rounded border border-[#ACB9D1] dark:border-[#0e3554] flex-shrink-0">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </form>
      </div>

      {/* Zone 3: Right Section - SLA Badge, Pricing, Theme, Notifications, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
        {/* Operational SLA Pill */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#B3EDD7] dark:bg-[#01C588]/15 border border-[#12CF94]/50 dark:border-[#01C588]/30 text-[#010627] dark:text-[#01C588] text-xs font-semibold flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#12CF94] dark:bg-[#01C588] animate-pulse flex-shrink-0" />
          <span className="hidden 2xl:inline whitespace-nowrap">
            Election Cycle 2024-25 &bull;
          </span>
          <span className="whitespace-nowrap">Operational (99.98% SLA)</span>
        </div>

        <div className="h-5 w-px bg-[#ACB9D1] dark:bg-[#0e3554] mx-0.5 hidden xl:block flex-shrink-0" />

        {/* Global Pricing Visibility Switch (Module Rule) */}
        <button
          type="button"
          onClick={handlePricingSwitch}
          className={`hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex-shrink-0 ${
            pricingVisible
              ? "bg-[#E0EDFE] dark:bg-[#072439] text-[#2087FE] dark:text-[#0D79FD] border-[#ACB9D1] dark:border-[#0e3554]"
              : "bg-[#F3F8FD] dark:bg-[#062237] text-[#717785] dark:text-[#94A3B8] border-[#ACB9D1] dark:border-[#0e3554]"
          }`}
          title="Global Pricing Visibility across Candidate Portals"
        >
          {pricingVisible ? (
            <Eye className="w-3.5 h-3.5 text-[#2087FE] dark:text-[#0D79FD]" />
          ) : (
            <EyeOff className="w-3.5 h-3.5 text-[#717785] dark:text-[#94A3B8]" />
          )}
          <span>Pricing: {pricingVisible ? "Public" : "Hidden"}</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-[#ACB9D1] dark:border-[#0e3554] text-[#010627] dark:text-[#94A3B8] hover:bg-[#E0EDFE] dark:hover:bg-[#072439] transition-colors cursor-pointer flex-shrink-0"
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4 text-[#F48637]" />
          )}
        </button>

        {/* Notifications Button with Drawer */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setNotificationDrawerOpen(!notificationDrawerOpen)}
            className="p-2 rounded-lg border border-[#ACB9D1] dark:border-[#0e3554] text-[#010627] dark:text-[#94A3B8] hover:bg-[#E0EDFE] dark:hover:bg-[#072439] transition-colors relative cursor-pointer"
            title="Administrative Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FC7C36] animate-pulse" />
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
        <div className="relative flex-shrink-0" ref={accountMenuRef}>
          <button
            type="button"
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-lg border border-[#ACB9D1] dark:border-[#0e3554] hover:bg-[#E0EDFE] dark:hover:bg-[#072439] transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-md bg-[#2087FE] dark:bg-[#0D79FD] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              SA
            </div>
            <div className="hidden sm:block text-left pr-1 leading-tight">
              <div className="text-xs font-semibold text-[#010627] dark:text-[#F5F6F6]">
                Super Admin
              </div>
              <div className="text-[10px] text-[#717785] dark:text-[#94A3B8] font-mono">
                Clearance L0
              </div>
            </div>
          </button>

          {accountMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#072439] shadow-lg py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-[#ACB9D1] dark:border-[#0e3554]">
                <div className="font-semibold text-[#010627] dark:text-[#F5F6F6] flex items-center justify-between">
                  <span>Root Administrator</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#E0EDFE] dark:bg-[#0D79FD]/15 text-[#2087FE] dark:text-[#0D79FD]">
                    Level 0
                  </span>
                </div>
                <div className="text-[11px] text-[#717785] dark:text-[#94A3B8] font-mono mt-0.5">
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
                  className="w-full flex items-center gap-2 px-3 py-2 text-[#010627] dark:text-[#F5F6F6] hover:bg-[#E0EDFE] dark:hover:bg-[#062237] text-left transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#717785] dark:text-[#94A3B8]" />
                  Administrator Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("settings");
                    setAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[#010627] dark:text-[#F5F6F6] hover:bg-[#E0EDFE] dark:hover:bg-[#062237] text-left transition-colors cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-[#717785] dark:text-[#94A3B8]" />
                  API Keys &amp; Security
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("audit");
                    setAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[#010627] dark:text-[#F5F6F6] hover:bg-[#E0EDFE] dark:hover:bg-[#062237] text-left transition-colors cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-[#717785] dark:text-[#94A3B8]" />
                  Access Audit Ledger
                </button>

                <Link
                  href="/candidate"
                  onClick={() => setAccountMenuOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[#2087FE] dark:text-[#0D79FD] hover:bg-[#E0EDFE] dark:hover:bg-[#062237] text-left transition-colors font-medium cursor-pointer"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-[#2087FE] dark:text-[#0D79FD]" />
                  Switch to Candidate War Room
                </Link>
              </div>

              <div className="border-t border-[#ACB9D1] dark:border-[#0e3554] pt-1">
                <button
                  type="button"
                  onClick={() => {
                    toast("Administrative session ended successfully.", "info");
                    setAccountMenuOpen(false);
                    if (typeof window !== "undefined") {
                      localStorage.removeItem("rajtantra_access_token");
                      localStorage.removeItem("rajtantra_refresh_token");
                      localStorage.removeItem("rajtantra_active_role");
                      sessionStorage.setItem("rajtantra_logged_out", "true");
                      window.location.href = "/login";
                    }
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[#FC7C36] dark:text-[#F48637] hover:bg-[#FC7C36]/10 dark:hover:bg-[#F48637]/15 text-left transition-colors cursor-pointer"
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

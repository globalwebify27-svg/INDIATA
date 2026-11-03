"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCheck,
  BadgeCheck,
  Vote,
  Shield,
  Users,
  FileText,
  FileEdit,
  AlertTriangle,
  Megaphone,
  PhoneCall,
  Bot,
  BarChart3,
  Settings,
  Building,
  HelpCircle,
  Radio,
  X,
  LucideIcon,
} from "lucide-react";

export interface NavItemConfig {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse?: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const NAV_ITEMS: NavItemConfig[] = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "voters", label: "Voter Management", href: "/voters", icon: UserCheck },
  { key: "members", label: "Members & Registrations", href: "/members", icon: BadgeCheck },
  { key: "booths", label: "Booth Management", href: "/booths", icon: Vote },
  { key: "blo", label: "BLO Officers", href: "/blo", icon: Shield },
  { key: "karyakarta", label: "Karyakarta Management", href: "/users", icon: Users },
  { key: "forms", label: "Survey & Forms", href: "/forms", icon: FileText },
  { key: "requests", label: "Voter Update Requests", href: "/voters/requests", icon: FileEdit, badge: 14 },
  { key: "tickets", label: "Issue Management", href: "/office/tickets", icon: AlertTriangle },
  { key: "campaigns", label: "Campaign Management", href: "/campaigns", icon: Megaphone },
  { key: "ai-calling", label: "AI Calling", href: "/ai/calling", icon: PhoneCall },
  { key: "ai-assistant", label: "AI Assistant", href: "/ai/assistant", icon: Bot },
  { key: "reports", label: "Reports & Analytics", href: "/reports", icon: BarChart3 },
  { key: "settings", label: "Settings", href: "/settings", icon: Settings },
];

export const FOOTER_ITEMS: NavItemConfig[] = [
  { key: "organization", label: "Organization", href: "/settings/organization", icon: Building },
  { key: "help", label: "Help & Support", href: "/help", icon: HelpCircle },
];

export function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  // Close mobile drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        onCloseMobile();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, onCloseMobile]);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isItemActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          role="presentation"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-[#161B2A]/60 backdrop-blur-xs md:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR ASIDE ELEMENT */}
      <aside
        aria-label="INDIATA Navigation"
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col justify-between p-3.5 h-screen bg-white dark:bg-[#162235] border-r border-[#E1E6EE] dark:border-[#23344E] shadow-xs select-none transition-all duration-200 ease-in-out ${
          collapsed ? "md:w-[72px]" : "md:w-60"
        } ${
          mobileOpen
            ? "translate-x-0 w-60"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* TOP BRAND ANCHOR */}
        <div className="flex flex-col gap-3">
          {collapsed && !mobileOpen ? (
            /* COLLAPSED LOGO */
            <div className="flex justify-center pt-1 pb-1">
              <Link
                href="/dashboard"
                className="w-9 h-9 rounded-lg bg-white dark:bg-[#1E2D44] border border-[#E1E6EE] dark:border-[#23344E] p-1 flex items-center justify-center shadow-2xs relative group cursor-pointer hover:border-[#3159A8] transition-colors"
                aria-label="INDIATA Election OS"
              >
                <img
                  src="/brand/indiata-logo-compact.png"
                  alt="INDIATA"
                  className="w-full h-full object-contain"
                />
                {/* Floating Tooltip */}
                <div
                  role="tooltip"
                  className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-md bg-[#253247] text-white px-2.5 py-1 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 flex items-center gap-1.5"
                >
                  <span>INDIATA</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded">v4.2</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#253247]" />
                </div>
              </Link>
            </div>
          ) : (
            /* EXPANDED LOGO */
            <div className="flex items-center justify-between px-2 pt-1 pb-1">
              <Link
                href="/dashboard"
                onClick={onCloseMobile}
                className="flex items-center gap-2 overflow-hidden cursor-pointer group"
                aria-label="INDIATA Dashboard"
              >
                <div className="h-7 flex items-center">
                  <img
                    src="/brand/indiata-logo.png"
                    alt="INDIATA"
                    className="h-6 w-auto object-contain dark:hidden"
                  />
                  <img
                    src="/brand/indiata-logo-dark.png"
                    alt="INDIATA"
                    className="h-6 w-auto object-contain hidden dark:block"
                  />
                </div>
              </Link>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#EDF2F8] dark:bg-[#1E2D44] text-[#526B91] dark:text-[#8B9BB4] border border-[#D5DFEE] dark:border-[#2A3E5C]">
                  v4.2
                </span>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="md:hidden p-1 rounded-md text-[#68758A] hover:text-[#253247]"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* LIVE WAR ROOM STATUS */}
          {collapsed && !mobileOpen ? (
            <div className="flex justify-center">
              <Link
                href="/field-map"
                className="w-9 h-9 rounded-lg bg-[#F0F4FA] dark:bg-[#1A2844] border border-[#D5DFEE] dark:border-[#2A3E5C] text-[#3159A8] dark:text-[#4C74C9] flex items-center justify-center relative group cursor-pointer hover:bg-[#E2EAF6] transition-colors"
                title="Live War Room"
              >
                <span className="w-2 h-2 rounded-full bg-[#24866A]" />
                {/* Floating Tooltip */}
                <div
                  role="tooltip"
                  className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-md bg-[#253247] text-white px-2.5 py-1 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 flex items-center gap-2"
                >
                  <span>Live War Room</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#253247]" />
                </div>
              </Link>
            </div>
          ) : (
            <Link
              href="/field-map"
              onClick={onCloseMobile}
              className="w-full flex items-center justify-between px-3 py-2 bg-[#F0F4FA] dark:bg-[#1A2844] border border-[#D5DFEE] dark:border-[#2A3E5C] text-[#3159A8] dark:text-[#4C74C9] rounded-lg text-xs font-semibold hover:bg-[#E2EAF6] transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#24866A]" />
                <span>Live War Room</span>
              </span>
              <Radio className="w-3.5 h-3.5 text-[#3159A8] dark:text-[#4C74C9]" />
            </Link>
          )}

          {/* NAV ITEMS SECTION */}
          <div className="space-y-0.5 max-h-[calc(100vh-250px)] overflow-y-auto pr-1 custom-scrollbar">
            {NAV_ITEMS.map((item) => {
              const active = isItemActive(item.href);
              const IconComp = item.icon;

              if (collapsed && !mobileOpen) {
                return (
                  <div key={item.key} className="relative flex justify-center py-0.5">
                    <Link
                      href={item.href}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 relative group cursor-pointer ${
                        active
                          ? "bg-[#F0F4FA] dark:bg-[#1A2844] text-[#3159A8] dark:text-[#4C74C9] font-semibold border-l-2 border-[#3159A8] dark:border-[#4C74C9]"
                          : "text-[#68758A] dark:text-[#8B9BB4] hover:bg-[#F4F6F9] dark:hover:bg-[#1E2D44] hover:text-[#253247] dark:hover:text-[#F1F5F9]"
                      }`}
                      aria-label={item.label}
                    >
                      <IconComp className="w-4 h-4 shrink-0" />

                      {/* Notification Dot */}
                      {item.badge && !active && (
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#C58A32]" />
                      )}

                      {/* Floating Tooltip */}
                      <div
                        role="tooltip"
                        className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-md bg-[#253247] text-white px-2.5 py-1 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 flex items-center gap-2"
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#C58A32] text-white">
                            {item.badge}
                          </span>
                        )}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#253247]" />
                      </div>
                    </Link>
                  </div>
                );
              }

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] transition-colors duration-150 ${
                    active
                      ? "bg-[#F0F4FA] dark:bg-[#1A2844] text-[#3159A8] dark:text-[#4C74C9] border-l-3 border-[#3159A8] dark:border-[#4C74C9] font-semibold"
                      : "text-[#253247] dark:text-[#F1F5F9] hover:text-[#3159A8] dark:hover:text-[#4C74C9] hover:bg-[#F4F6F9] dark:hover:bg-[#1E2D44] font-medium"
                  } ${item.badge ? "justify-between" : ""}`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <IconComp className={`w-4 h-4 shrink-0 ${active ? "text-[#3159A8] dark:text-[#4C74C9]" : "text-[#68758A] dark:text-[#8B9BB4]"}`} />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FDF7ED] text-[#C58A32] border border-[#F5E2C4] shrink-0">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* FOOTER CLUSTER */}
        <div className="pt-2.5 border-t border-[#E1E6EE] dark:border-[#23344E] space-y-1">
          {FOOTER_ITEMS.map((item) => {
            const IconComp = item.icon;
            if (collapsed && !mobileOpen) {
              return (
                <div key={item.key} className="flex justify-center py-0.5">
                  <Link
                    href={item.href}
                    className="w-9 h-9 rounded-md flex items-center justify-center text-[#68758A] hover:text-[#3159A8] hover:bg-[#F4F6F9] dark:hover:bg-[#1E2D44] transition-colors relative group"
                    aria-label={item.label}
                  >
                    <IconComp className="w-4 h-4" />
                    <div
                      role="tooltip"
                      className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-md bg-[#253247] text-white px-2.5 py-1 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                    >
                      <span>{item.label}</span>
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#253247]" />
                    </div>
                  </Link>
                </div>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={onCloseMobile}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium text-[#68758A] dark:text-[#8B9BB4] hover:text-[#253247] dark:hover:text-[#F1F5F9] hover:bg-[#F4F6F9] dark:hover:bg-[#1E2D44] transition-colors"
              >
                <IconComp className="w-4 h-4 text-[#68758A] dark:text-[#8B9BB4]" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* ECI SERVERS SYNC STATUS INDICATOR */}
          {collapsed && !mobileOpen ? (
            <div className="flex justify-center pt-1">
              <div
                className="w-8 h-8 rounded-md bg-[#EDF2F8] dark:bg-[#1E2D44] flex items-center justify-center relative group cursor-pointer"
                title="ECI Servers Sync: Optimal"
              >
                <span className="w-2 h-2 rounded-full bg-[#24866A]" />
                <div
                  role="tooltip"
                  className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-md bg-[#253247] text-white px-2.5 py-1 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                >
                  <span>ECI Servers Sync: Optimal</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#253247]" />
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-1.5 p-2 rounded-md bg-[#EDF2F8] dark:bg-[#1E2D44] border border-[#D5DFEE] dark:border-[#2A3E5C] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#24866A]" />
                <span className="text-[10px] font-semibold text-[#68758A] dark:text-[#8B9BB4] uppercase tracking-wider">
                  ECI Sync
                </span>
              </div>
              <span className="text-xs font-semibold text-[#24866A] dark:text-[#2EA885]">
                Optimal
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

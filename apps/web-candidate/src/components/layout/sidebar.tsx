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
        aria-label="Rajtantra Navigation"
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col justify-between p-4 h-screen bg-white dark:bg-[#0F172A] border-r border-[#C8C4D6]/60 dark:border-[#1E293B] shadow-sm select-none transition-all duration-200 ease-in-out ${
          collapsed ? "md:w-[76px]" : "md:w-64"
        } ${
          mobileOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* TOP BRAND ANCHOR */}
        <div className="flex flex-col gap-4">
          {collapsed && !mobileOpen ? (
            /* COLLAPSED LOGO */
            <div className="flex justify-center pt-1 pb-1">
              <Link
                href="/dashboard"
                className="w-10 h-10 rounded-xl bg-[#6256D9] text-white flex items-center justify-center shadow-sm relative group cursor-pointer"
                aria-label="Rajtantra Election OS"
              >
                <Vote className="w-5 h-5 text-white" />
                {/* Floating Tooltip */}
                <div
                  role="tooltip"
                  className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-lg bg-[#161B2A] text-white px-3 py-1.5 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 flex items-center gap-1.5"
                >
                  <span>Rajtantra Election OS</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded">v4.2</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#161B2A]" />
                </div>
              </Link>
            </div>
          ) : (
            /* EXPANDED LOGO */
            <div className="flex items-center justify-between px-2 pt-1 pb-1">
              <Link
                href="/dashboard"
                onClick={onCloseMobile}
                className="flex items-center gap-3 overflow-hidden cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#6256D9] text-white flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                  <Vote className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-[#493BBF] dark:text-[#C5C0FF] tracking-tight leading-none">
                    Rajtantra
                  </div>
                  <div className="text-[11px] font-semibold text-[#707E94] dark:text-[#94A3B8] tracking-wider uppercase mt-0.5">
                    Election OS
                  </div>
                </div>
              </Link>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECE8FF] dark:bg-[#1E1B4B] text-[#493BBF] dark:text-[#C5C0FF]">
                  v4.2
                </span>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="md:hidden p-1 rounded-lg text-[#707E94] hover:text-[#161B2A]"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* LIVE WAR ROOM CTA */}
          {collapsed && !mobileOpen ? (
            <div className="flex justify-center">
              <Link
                href="/field-map"
                className="w-10 h-10 rounded-xl bg-[#6256D9] text-white flex items-center justify-center shadow-sm relative group cursor-pointer hover:opacity-95"
                title="Live War Room"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#86F5E9] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#86F5E9]" />
                </span>
                {/* Floating Tooltip */}
                <div
                  role="tooltip"
                  className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-lg bg-[#161B2A] text-white px-3 py-1.5 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 flex items-center gap-2"
                >
                  <span>Live War Room</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#161B2A]" />
                </div>
              </Link>
            </div>
          ) : (
            <Link
              href="/field-map"
              onClick={onCloseMobile}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#6256D9] text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-95 transition-all active:scale-[0.99] cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#86F5E9] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#86F5E9]" />
                </span>
                <span>Live War Room</span>
              </span>
              <Radio className="w-4 h-4 text-white" />
            </Link>
          )}

          {/* NAV ITEMS SECTION */}
          <div className="space-y-0.5 max-h-[calc(100vh-270px)] overflow-y-auto pr-1 custom-scrollbar">
            {NAV_ITEMS.map((item) => {
              const active = isItemActive(item.href);
              const IconComp = item.icon;

              if (collapsed && !mobileOpen) {
                return (
                  <div key={item.key} className="relative flex justify-center py-0.5">
                    <Link
                      href={item.href}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150 relative group cursor-pointer ${
                        active
                          ? "bg-[#493BBF] text-white shadow-xs font-bold"
                          : "text-[#707E94] dark:text-[#94A3B8] hover:bg-[#F2F3FF] dark:hover:bg-[#1E293B] hover:text-[#493BBF] dark:hover:text-[#C5C0FF]"
                      }`}
                      aria-label={item.label}
                    >
                      <IconComp className="w-5 h-5 shrink-0" />

                      {/* Active Left Pip */}
                      {active && (
                        <span className="absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full bg-white" />
                      )}

                      {/* Notification Dot */}
                      {item.badge && !active && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#BA1A1A] ring-2 ring-white dark:ring-[#0F172A]" />
                      )}

                      {/* Floating Tooltip */}
                      <div
                        role="tooltip"
                        className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-lg bg-[#161B2A] text-white px-3 py-1.5 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 flex items-center gap-2"
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#BA1A1A] text-white">
                            {item.badge}
                          </span>
                        )}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#161B2A]" />
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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors duration-150 ${
                    active
                      ? "bg-[#493BBF]/10 text-[#493BBF] dark:text-[#C5C0FF] border-l-4 border-[#493BBF]"
                      : "text-[#474554] dark:text-[#94A3B8] hover:text-[#161B2A] dark:hover:text-[#F8FAFC] hover:bg-[#F2F3FF] dark:hover:bg-[#1E293B]"
                  } ${item.badge ? "justify-between" : ""}`}
                >
                  <span className="flex items-center gap-3 truncate">
                    <IconComp className={`w-4 h-4 shrink-0 ${active ? "text-[#493BBF] dark:text-[#C5C0FF]" : "text-[#707E94] dark:text-[#94A3B8]"}`} />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFDAD6] text-[#BA1A1A] shrink-0">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* FOOTER CLUSTER */}
        <div className="pt-3 border-t border-[#C8C4D6]/60 dark:border-[#1E293B] space-y-1">
          {FOOTER_ITEMS.map((item) => {
            const IconComp = item.icon;
            if (collapsed && !mobileOpen) {
              return (
                <div key={item.key} className="flex justify-center py-0.5">
                  <Link
                    href={item.href}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[#707E94] hover:text-[#493BBF] hover:bg-[#F2F3FF] dark:hover:bg-[#1E293B] transition-colors relative group"
                    aria-label={item.label}
                  >
                    <IconComp className="w-4 h-4" />
                    <div
                      role="tooltip"
                      className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-lg bg-[#161B2A] text-white px-3 py-1.5 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                    >
                      <span>{item.label}</span>
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#161B2A]" />
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
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#474554] dark:text-[#94A3B8] hover:text-[#161B2A] dark:hover:text-[#F8FAFC] hover:bg-[#F2F3FF] dark:hover:bg-[#1E293B] transition-colors"
              >
                <IconComp className="w-4 h-4 text-[#707E94]" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* ECI SERVERS SYNC STATUS INDICATOR */}
          {collapsed && !mobileOpen ? (
            <div className="flex justify-center pt-1">
              <div
                className="w-8 h-8 rounded-lg bg-[#EAEDFF] dark:bg-[#1E293B] flex items-center justify-center relative group cursor-pointer"
                title="ECI Servers Sync: Optimal"
              >
                <span className="w-2 h-2 rounded-full bg-[#005C56]" />
                <div
                  role="tooltip"
                  className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-lg bg-[#161B2A] text-white px-3 py-1.5 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                >
                  <span>ECI Servers Sync: Optimal</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#161B2A]" />
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-2 p-2.5 rounded-lg bg-[#EAEDFF] dark:bg-[#1E293B] border border-[#C8C4D6]/60 dark:border-[#334155] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#005C56]" />
                <span className="text-[10px] font-bold text-[#474554] dark:text-[#94A3B8] uppercase tracking-wider">
                  ECI Servers Sync
                </span>
              </div>
              <span className="text-xs font-bold text-[#493BBF] dark:text-[#C5C0FF]">
                Optimal
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

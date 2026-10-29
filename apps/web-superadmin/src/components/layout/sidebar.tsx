"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  UserPlus,
  Inbox,
  FileQuestion,
  Briefcase,
  Megaphone,
  Bot,
  CreditCard,
  ShieldAlert,
  Settings,
  Layers,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Activity,
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

interface NavSubItem {
  key: NavKey;
  label: string;
  badge?: string;
  icon: React.ReactNode;
}

interface NavItemConfig {
  key: NavKey;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  subItems?: NavSubItem[];
}

export function Sidebar({
  activeNav,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const [candidatesExpanded, setCandidatesExpanded] = useState(false);
  const [distributorsExpanded, setDistributorsExpanded] = useState(false);

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

  const navItems: NavItemConfig[] = [
    {
      key: "dashboard",
      label: "Overview Dashboard",
      icon: <LayoutDashboard className="w-5 h-5 flex-shrink-0" />,
    },
    {
      key: "organizations",
      label: "Organizations & War Rooms",
      icon: <Building2 className="w-5 h-5 flex-shrink-0" />,
    },
    {
      key: "all-candidates",
      label: "Candidate Directory",
      icon: <Users className="w-5 h-5 flex-shrink-0" />,
      badge: "3",
      subItems: [
        {
          key: "all-candidates",
          label: "All Candidates",
          icon: <Users className="w-4 h-4" />,
        },
        {
          key: "add-candidate",
          label: "Onboard Candidate",
          icon: <UserPlus className="w-4 h-4" />,
        },
        {
          key: "candidate-requests",
          label: "Registration Leads",
          badge: "3",
          icon: <Inbox className="w-4 h-4" />,
        },
        {
          key: "enquiries",
          label: "Quota Enquiries",
          badge: "4",
          icon: <FileQuestion className="w-4 h-4" />,
        },
      ],
    },
    {
      key: "all-distributors",
      label: "Distributor Partners",
      icon: <Briefcase className="w-5 h-5 flex-shrink-0" />,
      badge: "2",
      subItems: [
        {
          key: "all-distributors",
          label: "All Distributors",
          icon: <Briefcase className="w-4 h-4" />,
        },
        {
          key: "distributor-requests",
          label: "Partner Applications",
          badge: "2",
          icon: <Inbox className="w-4 h-4" />,
        },
      ],
    },
    {
      key: "campaigns",
      label: "Broadcast Campaigns",
      icon: <Megaphone className="w-5 h-5 flex-shrink-0" />,
    },
    {
      key: "ai-dashboard",
      label: "AI Governance",
      icon: <Bot className="w-5 h-5 flex-shrink-0" />,
    },
    {
      key: "subscriptions",
      label: "Subscriptions & Licences",
      icon: <CreditCard className="w-5 h-5 flex-shrink-0" />,
    },
    {
      key: "audit",
      label: "Security Audit Ledger",
      icon: <ShieldAlert className="w-5 h-5 flex-shrink-0" />,
    },
    {
      key: "settings",
      label: "Platform Settings",
      icon: <Settings className="w-5 h-5 flex-shrink-0" />,
    },
    {
      key: "components",
      label: "UI Design System",
      icon: <Layers className="w-5 h-5 flex-shrink-0" />,
    },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        id="superadmin-sidebar"
        aria-label="Super Admin Primary Navigation"
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 flex flex-col h-screen bg-[#FAF2EB] dark:bg-[#1C1611] border-r border-[#EAE5DC] dark:border-[#352B22] text-[#554336] dark:text-[#DBC2B0] transition-all duration-200 ease-in-out motion-reduce:transition-none select-none shadow-sm ${
          collapsed ? "w-[68px]" : "w-[270px]"
        } ${mobileOpen ? "translate-x-0 !w-[270px]" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Brand Header with Institutional Shield, Wordmark, and Hamburger Toggle */}
        {collapsed && !mobileOpen ? (
          /* COLLAPSED HEADER (68px Rail): Shield Logo + Hamburger Toggle */
          <div className="h-20 py-2.5 px-2 flex flex-col items-center justify-between border-b border-[#EAE5DC] dark:border-[#352B22] flex-shrink-0">
            {/* Brand Shield Logo with Tooltip */}
            <button
              type="button"
              onClick={() => {
                onNavigate("dashboard");
                onCloseMobile();
              }}
              className="w-9 h-9 rounded-xl bg-[#8D4B00] text-white flex items-center justify-center flex-shrink-0 shadow-xs ring-2 ring-[#8D4B00]/20 transition-transform hover:scale-105 cursor-pointer relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
              aria-label="INDIATA Super Admin Overview"
            >
              <ShieldCheck className="w-5 h-5 text-white" />
              {/* Tooltip */}
              <div
                role="tooltip"
                className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-lg bg-[#1E1B17] dark:bg-[#FAF2EB] text-white dark:text-[#1E1B17] px-3 py-1.5 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <span>INDIATA Super Admin</span>
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1E1B17] dark:border-r-[#FAF2EB]" />
              </div>
            </button>

            {/* Hamburger Toggle Button */}
            <button
              type="button"
              onClick={onToggleCollapse}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#554336] dark:text-[#DBC2B0] hover:text-[#8D4B00] dark:hover:text-[#FFB77D] hover:bg-[#E8E1DB]/70 dark:hover:bg-[#2B241E] transition-colors cursor-pointer relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
              aria-label="Expand sidebar"
              aria-expanded={false}
            >
              <Menu className="w-4 h-4 text-[#8D4B00] dark:text-[#FFB77D]" />
              {/* Tooltip */}
              <div
                role="tooltip"
                className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-lg bg-[#1E1B17] dark:bg-[#FAF2EB] text-white dark:text-[#1E1B17] px-3 py-1.5 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <span>Expand sidebar</span>
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1E1B17] dark:border-r-[#FAF2EB]" />
              </div>
            </button>
          </div>
        ) : (
          /* EXPANDED HEADER (270px Width): Full Wordmark, Indicators, and Collapse Button */
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#EAE5DC] dark:border-[#352B22] flex-shrink-0 bg-[#FAF2EB] dark:bg-[#1C1611]">
            <div
              className="flex items-center gap-3 overflow-hidden cursor-pointer"
              onClick={() => {
                onNavigate("dashboard");
                onCloseMobile();
              }}
            >
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

            {/* Desktop Collapse Button */}
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-lg text-[#887364] hover:text-[#8D4B00] dark:hover:text-[#FFB77D] hover:bg-[#E8E1DB]/70 dark:hover:bg-[#2B241E] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
              aria-label="Collapse sidebar"
              aria-expanded={true}
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4 text-[#8D4B00] dark:text-[#FFB77D]" />
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-[#887364] hover:text-[#1E1B17] dark:hover:text-[#F7EFE9] hover:bg-[#E8E1DB]/70 cursor-pointer"
              aria-label="Close mobile navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Navigation Items Scroll Area */}
        <nav
          className={`flex-1 overflow-y-auto space-y-1.5 custom-scroll ${
            collapsed && !mobileOpen ? "px-2 py-3" : "px-3 py-4"
          }`}
        >
          {navItems.map((item) => {
            const hasSub = Boolean(item.subItems && item.subItems.length > 0);
            const isGroupActive =
              activeNav === item.key ||
              (item.subItems && item.subItems.some((s) => s.key === activeNav));

            const isSubExpanded =
              item.key === "all-candidates"
                ? candidatesExpanded
                : distributorsExpanded;

            const toggleAccordion = () => {
              if (item.key === "all-candidates") {
                setCandidatesExpanded(!candidatesExpanded);
              }
              if (item.key === "all-distributors") {
                setDistributorsExpanded(!distributorsExpanded);
              }
            };

            // 1. COLLAPSED MODE: Clean centered icon rail with accessible tooltips
            if (collapsed && !mobileOpen) {
              return (
                <div key={item.key} className="relative flex justify-center py-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate(item.key);
                      onCloseMobile();
                    }}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150 relative group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                      isGroupActive
                        ? "bg-[#E8E1DB] dark:bg-[#352B22] text-[#8D4B00] dark:text-[#FFB77D] font-bold shadow-xs ring-1 ring-[#8D4B00]/30"
                        : "text-[#554336] dark:text-[#DBC2B0] hover:bg-[#F4EDE6] dark:hover:bg-[#251E18] hover:text-[#8D4B00] dark:hover:text-[#FFB77D]"
                    }`}
                    aria-label={item.label}
                  >
                    {item.icon}

                    {/* Active Route Left Pip */}
                    {isGroupActive && (
                      <span className="absolute left-0.5 top-2.5 bottom-2.5 w-1 rounded-full bg-[#8D4B00] dark:bg-[#FFB77D]" />
                    )}

                    {/* Notification/Pending Micro Badge Dot */}
                    {item.badge && !isGroupActive && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#8D4B00]" />
                    )}

                    {/* Accessible Floating Tooltip (Hover and Focus-Visible) */}
                    <div
                      role="tooltip"
                      className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-lg bg-[#1E1B17] dark:bg-[#FAF2EB] text-white dark:text-[#1E1B17] px-3 py-1.5 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                    >
                      <div className="flex items-center gap-2">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#FFDCC3] dark:bg-[#6E3900] text-[#6E3900] dark:text-[#FFDCC3]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {/* Tooltip Arrow */}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1E1B17] dark:border-r-[#FAF2EB]" />
                    </div>
                  </button>
                </div>
              );
            }

            // 2. EXPANDED MODE: Full hierarchical navigation list with accordion support
            return (
              <div key={item.key} className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    if (hasSub) {
                      toggleAccordion();
                    } else {
                      onNavigate(item.key);
                      onCloseMobile();
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                    isGroupActive && (!hasSub || !isSubExpanded)
                      ? "bg-[#E8E1DB]/80 dark:bg-[#352B22] text-[#8D4B00] dark:text-[#FFB77D] font-bold shadow-xs border border-[#8D4B00]/20"
                      : "text-[#554336] dark:text-[#DBC2B0] hover:bg-[#F4EDE6] dark:hover:bg-[#251E18] hover:text-[#1E1B17] dark:hover:text-[#F7EFE9]"
                  }`}
                  aria-expanded={hasSub ? isSubExpanded : undefined}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={
                        isGroupActive
                          ? "text-[#8D4B00] dark:text-[#FFB77D]"
                          : "text-[#554336] dark:text-[#DBC2B0]"
                      }
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFDCC3] dark:bg-[#6E3900] text-[#6E3900] dark:text-[#FFDCC3]">
                        {item.badge}
                      </span>
                    )}
                    {hasSub && (
                      <span className="text-[#887364]">
                        {isSubExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </button>

                {/* Sub-Items Tree when Expanded */}
                {hasSub && isSubExpanded && (
                  <div className="pl-6 space-y-1 pt-0.5">
                    {item.subItems?.map((sub) => {
                      const isSubActive = activeNav === sub.key;
                      return (
                        <button
                          key={sub.key}
                          type="button"
                          onClick={() => {
                            onNavigate(sub.key);
                            onCloseMobile();
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00] ${
                            isSubActive
                              ? "bg-[#E8E1DB] dark:bg-[#352B22] text-[#8D4B00] dark:text-[#FFB77D] font-bold shadow-xs border-l-2 border-[#8D4B00]"
                              : "text-[#554336] dark:text-[#DBC2B0] hover:bg-[#F4EDE6] dark:hover:bg-[#251E18] hover:text-[#1E1B17]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="text-[#887364]">{sub.icon}</span>
                            <span className="truncate">{sub.label}</span>
                          </div>
                          {sub.badge && (
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#FFDCC3] dark:bg-[#6E3900] text-[#6E3900] dark:text-[#FFDCC3]">
                              {sub.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer Operational Utilities and Admin Profile */}
        <div className="border-t border-[#EAE5DC] dark:border-[#352B22] bg-[#FAF2EB] dark:bg-[#1C1611] flex-shrink-0">
          {collapsed && !mobileOpen ? (
            /* COLLAPSED FOOTER (68px Rail): Centered Tooltip Buttons */
            <div className="py-3 px-2 flex flex-col items-center gap-2">
              {/* Security Audit Icon */}
              <button
                type="button"
                onClick={() => onNavigate("audit")}
                className="w-10 h-10 rounded-xl bg-[#DCFCE7]/60 dark:bg-[#005323]/40 border border-[#92F5A4]/40 flex items-center justify-center text-[#006D30] dark:text-[#92F5A4] transition-colors relative group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                aria-label="Security Audit: Active"
              >
                <ShieldCheck className="w-4 h-4" />
                {/* Tooltip */}
                <div
                  role="tooltip"
                  className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-lg bg-[#1E1B17] dark:bg-[#FAF2EB] text-white dark:text-[#1E1B17] px-3 py-1.5 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <span>Security Audit: Active (L0)</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1E1B17] dark:border-r-[#FAF2EB]" />
                </div>
              </button>

              {/* System Health Pulse Icon */}
              <button
                type="button"
                className="w-10 h-10 rounded-xl bg-white dark:bg-[#201A15] border border-[#EAE5DC] dark:border-[#352B22] flex items-center justify-center text-[#006D30] dark:text-[#92F5A4] transition-colors relative group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                aria-label="System Health: 99.98% Operational"
              >
                <Activity className="w-4 h-4 animate-pulse text-[#006D30] dark:text-[#92F5A4]" />
                {/* Tooltip */}
                <div
                  role="tooltip"
                  className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-lg bg-[#1E1B17] dark:bg-[#FAF2EB] text-white dark:text-[#1E1B17] px-3 py-1.5 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <span>System Health: 99.98% SLA</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1E1B17] dark:border-r-[#FAF2EB]" />
                </div>
              </button>

              {/* Administrator Profile Avatar Badge */}
              <button
                type="button"
                onClick={() => onNavigate("profile")}
                className="w-10 h-10 rounded-xl bg-[#FFDCC3] dark:bg-[#6E3900] text-[#8D4B00] dark:text-[#FFB77D] font-bold text-xs flex items-center justify-center border border-[#8D4B00]/20 shadow-xs relative group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                aria-label="Root Super Admin (admin@indiata.gov.in)"
              >
                SA
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#006D30] border-2 border-[#FAF2EB] dark:border-[#1C1611]" />
                {/* Tooltip */}
                <div
                  role="tooltip"
                  className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-lg bg-[#1E1B17] dark:bg-[#FAF2EB] text-white dark:text-[#1E1B17] px-3 py-1.5 text-xs font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <div>
                    <div className="font-bold">Root Super Admin</div>
                    <div className="text-[10px] opacity-80 font-mono">admin@indiata.gov.in (L0)</div>
                  </div>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1E1B17] dark:border-r-[#FAF2EB]" />
                </div>
              </button>
            </div>
          ) : (
            /* EXPANDED FOOTER (270px Width): Full Information Rows & Profile Card */
            <div className="p-3.5 space-y-2.5">
              <div className="space-y-1.5">
                {/* Security Audit Row */}
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#F4EDE6]/60 dark:bg-[#251E18] text-[#554336] dark:text-[#DBC2B0] text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#006D30] dark:text-[#92F5A4]" />
                    <span>Security Audit</span>
                  </div>
                  <span className="text-[11px] text-[#006D30] dark:text-[#92F5A4] font-bold">
                    Active
                  </span>
                </div>

                {/* System Health Row */}
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#F4EDE6]/60 dark:bg-[#251E18] text-[#554336] dark:text-[#DBC2B0] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#006D30] dark:bg-[#92F5A4] animate-pulse" />
                    <span>System Health</span>
                  </div>
                  <span className="text-[11px] text-[#006D30] dark:text-[#92F5A4] font-bold font-mono">
                    99.98%
                  </span>
                </div>
              </div>

              {/* Full Admin Profile Badge Card */}
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#201A15] border border-[#EAE5DC] dark:border-[#352B22] flex items-center gap-2.5 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-[#FFDCC3] dark:bg-[#6E3900] text-[#8D4B00] dark:text-[#FFB77D] font-bold text-xs flex items-center justify-center flex-shrink-0">
                  SA
                </div>
                <div className="min-w-0 flex-1 leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#1E1B17] dark:text-[#F7EFE9] truncate">
                      Root Super Admin
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006D30]" />
                  </div>
                  <p className="text-[10px] text-[#887364] dark:text-[#A8988C] truncate font-mono mt-0.5">
                    admin@indiata.gov.in
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

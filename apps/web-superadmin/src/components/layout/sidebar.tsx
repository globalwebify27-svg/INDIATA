"use client";

import React, { useState } from "react";
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
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Layers,
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

interface NavItemConfig {
  key: NavKey;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  subItems?: { key: NavKey; label: string; badge?: string; icon?: React.ReactNode }[];
}

export function Sidebar({
  activeNav,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const [candidatesExpanded, setCandidatesExpanded] = useState(true);
  const [distributorsExpanded, setDistributorsExpanded] = useState(true);

  const navItems: NavItemConfig[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4 flex-shrink-0" />,
    },
    {
      key: "organizations",
      label: "Organizations",
      icon: <Building2 className="w-4 h-4 flex-shrink-0" />,
    },
    {
      key: "all-candidates",
      label: "Candidates",
      icon: <Users className="w-4 h-4 flex-shrink-0" />,
      subItems: [
        {
          key: "all-candidates",
          label: "All Candidates",
          icon: <Users className="w-3.5 h-3.5" />,
        },
        {
          key: "add-candidate",
          label: "Add Candidate",
          icon: <UserPlus className="w-3.5 h-3.5" />,
        },
        {
          key: "candidate-requests",
          label: "Candidate Requests",
          badge: "3",
          icon: <Inbox className="w-3.5 h-3.5" />,
        },
        {
          key: "enquiries",
          label: "Generated Enquiries",
          badge: "5",
          icon: <FileQuestion className="w-3.5 h-3.5" />,
        },
      ],
    },
    {
      key: "all-distributors",
      label: "Distributors",
      icon: <Briefcase className="w-4 h-4 flex-shrink-0" />,
      subItems: [
        {
          key: "all-distributors",
          label: "All Distributors",
          icon: <Briefcase className="w-3.5 h-3.5" />,
        },
        {
          key: "distributor-requests",
          label: "Distributor Requests",
          badge: "2",
          icon: <Inbox className="w-3.5 h-3.5" />,
        },
      ],
    },
    {
      key: "campaigns",
      label: "Campaigns",
      icon: <Megaphone className="w-4 h-4 flex-shrink-0" />,
    },
    {
      key: "ai-dashboard",
      label: "AI Governance",
      icon: <Bot className="w-4 h-4 flex-shrink-0" />,
    },
    {
      key: "subscriptions",
      label: "Subscriptions",
      icon: <CreditCard className="w-4 h-4 flex-shrink-0" />,
    },
    {
      key: "audit",
      label: "Platform Audit",
      icon: <ShieldAlert className="w-4 h-4 flex-shrink-0" />,
    },
    {
      key: "settings",
      label: "Platform Settings",
      icon: <Settings className="w-4 h-4 flex-shrink-0" />,
    },
    {
      key: "components",
      label: "UI System",
      icon: <Layers className="w-4 h-4 flex-shrink-0" />,
    },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 flex flex-col h-screen bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-200 select-none ${
          collapsed ? "w-16" : "w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
          <div
            className="flex items-center gap-3 overflow-hidden cursor-pointer"
            onClick={() => {
              onNavigate("dashboard");
              onCloseMobile();
            }}
          >
            <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center font-bold text-white text-base shadow-xs flex-shrink-0">
              RT
            </div>
            {!collapsed && (
              <div className="leading-tight overflow-hidden">
                <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                  RAJTANTRA
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-sky-400">
                  Super Admin Console
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
            className="md:hidden p-1.5 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Item Tree */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
          {navItems.map((item) => {
            if (item.subItems) {
              const isGroupActive = item.subItems.some((s) => s.key === activeNav);
              const isExpanded =
                item.key === "all-candidates"
                  ? candidatesExpanded
                  : distributorsExpanded;
              const toggleGroup = () => {
                if (item.key === "all-candidates")
                  setCandidatesExpanded(!candidatesExpanded);
                if (item.key === "all-distributors")
                  setDistributorsExpanded(!distributorsExpanded);
              };

              return (
                <div key={item.key} className="space-y-1">
                  <button
                    type="button"
                    onClick={toggleGroup}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isGroupActive
                        ? "text-sky-400 bg-slate-800/70 font-semibold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-slate-500">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </button>

                  {isExpanded && !collapsed && (
                    <div className="pl-7 space-y-0.5">
                      {item.subItems.map((sub) => {
                        const isSubActive = activeNav === sub.key;
                        return (
                          <button
                            key={sub.key}
                            type="button"
                            onClick={() => {
                              onNavigate(sub.key);
                              onCloseMobile();
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                              isSubActive
                                ? "bg-sky-600/20 text-sky-400 font-semibold"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                            }`}
                          >
                            <span className="truncate">{sub.label}</span>
                            {sub.badge && (
                              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-sky-500 text-white">
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
            }

            const isActive = activeNav === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  onNavigate(item.key);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-sky-600 text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
                title={collapsed ? item.label : undefined}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer Identity Card */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/80">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-800/60">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 leading-tight">
                <div className="text-xs font-semibold text-white truncate">
                  Root Super Admin
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  admin@rajtantra.gov.in
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

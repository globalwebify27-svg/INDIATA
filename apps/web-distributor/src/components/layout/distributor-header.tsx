"use client";

import React from "react";
import Link from "next/link";
import {
  Bell,
  UserPlus,
  Building,
  MapPin,
} from "lucide-react";
import { useDistributorAuth } from "../../context/distributor-auth-context";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function DistributorHeader({ title, subtitle }: HeaderProps) {
  const { distributor } = useDistributorAuth();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Title & Territory Info */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            {title || "Distributor Console"}
          </h1>
          {subtitle ? (
            <p className="text-xs text-slate-600 dark:text-slate-300">{subtitle}</p>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200">
                <Building className="w-3.5 h-3.5 text-[#2087FE]" />
                {distributor?.name || "Maharashtra Western"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                {distributor?.territory || "Pune Metro"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Scoped Tenant Isolation Security Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Tenant Isolated ({distributor?.distributorCode || "DIS-101"})</span>
        </div>

        {/* Quick Candidate Onboarding Button */}
        <Link
          href="/candidates/new"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#2087FE] hover:bg-blue-600 text-white transition-colors shadow-premium-xs"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>New Candidate</span>
        </Link>

        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
        </button>

        {/* User Avatar & Name */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200">
            {distributor?.contactPerson?.slice(0, 2).toUpperCase() || "SP"}
          </div>
          <div className="hidden lg:block text-left text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-100">
              {distributor?.contactPerson || "Suresh Patil"}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300">Franchise Lead</div>
          </div>
        </div>
      </div>
    </header>
  );
}

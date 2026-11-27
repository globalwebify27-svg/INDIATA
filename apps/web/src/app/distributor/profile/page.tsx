"use client";

import React from "react";
import {
  MapPin,
  LogOut,
} from "lucide-react";
import { DistributorLayout } from "../../../distributor/components/distributor-layout";
import { useDistributorAuth } from "../../../distributor/context/distributor-auth-context";
import { Badge } from "@rajtantra/ui/feedback";
import { ChangePasswordCard } from "@/components/auth/change-password-card";

export default function DistributorProfilePage() {
  const { distributor, logout } = useDistributorAuth();

  return (
    <DistributorLayout
      title="Franchise Profile & Security Credentials"
      subtitle="Manage regional partner details, verification status, and authentication credentials"
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Franchise Verification Banner */}
        <div className="bg-white dark:bg-[#151E2D] rounded-3xl p-6 border border-slate-200 dark:border-[#29364A] shadow-premium-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#010627] to-[#1D61E0] text-white flex items-center justify-center font-black text-xl shadow-premium-xs shrink-0">
              {distributor?.name?.slice(0, 2).toUpperCase() || "MW"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">
                  {distributor?.name || "Maharashtra Western Agency"}
                </h2>
                <Badge variant="success" size="md">
                  {distributor?.status || "ACTIVE"}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-[#94A3B8] mt-1">
                <span className="font-mono font-bold text-blue-600 dark:text-[#38BDF8]">
                  ID: {distributor?.distributorCode || "DIS-101"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-[#94A3B8]" />
                  <span>{distributor?.territory || "Pune Metro"}</span>
                </span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Verified Franchise Partner
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>

        {/* Agency Information Grid */}
        <div className="bg-white dark:bg-[#151E2D] rounded-3xl p-6 border border-slate-200 dark:border-[#29364A] shadow-premium-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC] pb-2 border-b border-slate-100 dark:border-[#29364A]">
            Franchise Agency Records
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B101A] border border-slate-200/80 dark:border-[#29364A]">
              <span className="text-slate-500 dark:text-[#94A3B8]">Registered Enterprise Name:</span>
              <div className="font-bold text-slate-900 dark:text-[#F8FAFC] text-sm mt-0.5">
                {distributor?.name}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B101A] border border-slate-200/80 dark:border-[#29364A]">
              <span className="text-slate-500 dark:text-[#94A3B8]">Franchise Territory:</span>
              <div className="font-bold text-slate-900 dark:text-[#F8FAFC] text-sm mt-0.5">
                {distributor?.territory}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B101A] border border-slate-200/80 dark:border-[#29364A]">
              <span className="text-slate-500 dark:text-[#94A3B8]">Lead Contact Person:</span>
              <div className="font-bold text-slate-900 dark:text-[#F8FAFC] text-sm mt-0.5">
                {distributor?.contactPerson}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B101A] border border-slate-200/80 dark:border-[#29364A]">
              <span className="text-slate-500 dark:text-[#94A3B8]">Primary Contact Email:</span>
              <div className="font-bold text-slate-900 dark:text-[#F8FAFC] text-sm mt-0.5">
                {distributor?.email}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B101A] border border-slate-200/80 dark:border-[#29364A]">
              <span className="text-slate-500 dark:text-[#94A3B8]">Official Mobile / WhatsApp:</span>
              <div className="font-bold font-mono text-slate-900 dark:text-[#F8FAFC] text-sm mt-0.5">
                {distributor?.phone}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B101A] border border-slate-200/80 dark:border-[#29364A]">
              <span className="text-slate-500 dark:text-[#94A3B8]">Registration Date:</span>
              <div className="font-bold text-slate-900 dark:text-[#F8FAFC] text-sm mt-0.5">
                {distributor?.createdAt || "2026-01-15"}
              </div>
            </div>
          </div>
        </div>

        {/* Security & Password Modification */}
        <ChangePasswordCard />
      </div>
    </DistributorLayout>
  );
}

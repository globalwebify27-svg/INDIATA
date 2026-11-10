"use client";

import React, { useState } from "react";
import { Clock, RefreshCw, LogOut, CheckCircle2, ShieldAlert, Building2, MapPin, Mail, Phone } from "lucide-react";
import { useDistributorAuth } from "../../../distributor/context/distributor-auth-context";
import { DistributorStatus } from "@rajtantra/common-types";
import { Button } from "@rajtantra/ui/buttons";

export default function PendingApprovalPage() {
  const { distributor, logout, setMockAccount } = useDistributorAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshMessage(null);
    await new Promise((res) => setTimeout(res, 600));
    setIsRefreshing(false);
    setRefreshMessage("Application status verified. Review is currently underway by Super Admin.");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        {/* Header Icon */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-premium-sm">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 mb-2">
            <span>APPLICATION UNDER REVIEW</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Franchise Application Pending
          </h2>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Your distributor registration request has been created and assigned to the Super Admin review queue. Protected dashboard access is withheld until your account is approved.
          </p>
        </div>

        {/* Application Summary Card */}
        <div className="mt-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-premium-md space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#2087FE]" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {distributor?.companyName || "Marathwada Election Tech Partners"}
              </span>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {distributor?.id || "DIS-105"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-1">Franchise Lead</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {distributor?.contactName || "Kailash M. Deshmukh"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>Operating Territory</span>
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                {distributor?.location || "Chhatrapati Sambhajinagar & Jalna"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                <span>Email Address</span>
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                {distributor?.email || "pending@marathwada.com"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>Mobile Phone</span>
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {distributor?.phone || "+91 98220 55441"}
              </span>
            </div>
          </div>

          {/* Verification Steps Checklist */}
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 text-xs space-y-2">
            <span className="font-bold text-amber-900 dark:text-amber-200 block">Approval Workflow:</span>
            <div className="space-y-1.5 text-amber-800 dark:text-amber-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Application submitted and initial account payload generated.</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Super Admin territorial franchise conflict verification in progress.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                <div className="w-3.5 h-3.5 rounded-full border border-dashed border-slate-400 shrink-0" />
                <span>Account activation, credential delivery &amp; dashboard release.</span>
              </div>
            </div>
          </div>

          {refreshMessage && (
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{refreshMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              isLoading={isRefreshing}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Check Status
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={logout}
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Development QA Test Helper Banner */}
        <div className="mt-6 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs text-slate-500 space-y-2">
          <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>QA Testing State Switcher:</span>
            <span className="text-[10px] text-indigo-600 font-mono">Dev Mode</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMockAccount(DistributorStatus.ACTIVE)}
              className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-semibold cursor-pointer"
            >
              Simulate Super Admin Approval (Active)
            </button>
            <button
              type="button"
              onClick={() => setMockAccount(DistributorStatus.SUSPENDED)}
              className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-[11px] font-semibold cursor-pointer"
            >
              Simulate Suspension (Blocked)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

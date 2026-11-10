"use client";

import React from "react";
import { ShieldX, LogOut, Mail, Phone, Building2, AlertTriangle } from "lucide-react";
import { useDistributorAuth } from "../../context/distributor-auth-context";
import { DistributorStatus } from "@rajtantra/common-types";
import { Button } from "@rajtantra/ui/buttons";

export default function BlockedAccountPage() {
  const { distributor, logout, setMockAccount } = useDistributorAuth();

  const isRejected = distributor?.status === DistributorStatus.REJECTED;

  const title = isRejected
    ? "Franchise Application Not Approved"
    : "Distributor Account Suspended";

  const reason = isRejected
    ? distributor?.rejectionReason || "Incomplete compliance documentation or territorial franchise rights allocation."
    : distributor?.suspendedReason || "Temporary administrative hold pending compliance and field operations audit.";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 shadow-premium-sm">
            <ShieldX className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 mb-2">
            <span>{isRejected ? "APPLICATION REJECTED" : "ACCOUNT SUSPENDED"}</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Access to the Rajtantra Distributor Portal and candidate management workspaces has been restricted by Super Admin governance.
          </p>
        </div>

        {/* Reason Card */}
        <div className="mt-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-premium-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {distributor?.companyName || "Khandesh Digital Campaign Network"}
              </span>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
              {distributor?.id || "DIS-106"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 space-y-1.5 text-xs">
            <span className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Administrative Determination:</span>
            </span>
            <p className="text-rose-800 dark:text-rose-300 leading-relaxed text-[11px]">
              {reason}
            </p>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Next Steps &amp; Appeal:</span>
            <p className="leading-relaxed text-[11px]">
              If you believe this decision is in error or wish to submit revised territorial agreements, please contact the Central Platform Operations desk.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1 text-[11px]">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>support@rajtantra.com • partners@rajtantra.com</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Toll-Free Partner Desk: +91 (020) 2553-9000</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={logout}
              className="w-full"
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
            >
              Sign Out &amp; Return to Login
            </Button>
          </div>
        </div>

        {/* Development QA Testing Helper */}
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
              Switch to Active (Approved)
            </button>
            <button
              type="button"
              onClick={() => setMockAccount(DistributorStatus.PENDING)}
              className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 text-[11px] font-semibold cursor-pointer"
            >
              Switch to Pending
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Clock, RefreshCw, LogOut, CheckCircle2, ShieldAlert, Users, MapPin, Mail, Phone } from "lucide-react";
import { useKaryakartaAuth } from "@/karyakarta/context/karyakarta-auth-context";
import { Button } from "@rajtantra/ui/buttons";

export default function KaryakartaPendingApprovalPage() {
  const { user, logout, setMockAccount } = useKaryakartaAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshMessage(null);
    await new Promise((res) => setTimeout(res, 600));
    setIsRefreshing(false);
    setRefreshMessage("Application status verified. Review is currently underway by Candidate Admin.");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        {/* Header Icon */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 mb-2">
            <span>VOLUNTEER APPLICATION UNDER REVIEW</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Karyakarta Application Pending
          </h2>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Your field volunteer registration has been forwarded to Candidate Admin for booth allotment and identity verification. Access to voter rolls and door-to-door surveys will be enabled upon approval.
          </p>
        </div>

        {/* Application Summary Card */}
        <div className="mt-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {user?.name || "Rahul V. Patil"}
              </span>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {user?.id || "KAR-2026-002"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-1">Assigned / Requested Booth</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {user?.assignedBooths?.length ? user.assignedBooths.join(", ") : "Booth 143 (Pending Allotment)"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>Constituency</span>
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                {user?.constituencyName || "215 - Kasba Peth, Pune"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                <span>Email Address</span>
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                {user?.email || "rahul.patil@volunteer.in"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>Mobile Phone</span>
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {user?.phone || "+91 94220 11223"}
              </span>
            </div>
          </div>

          {/* Verification Steps Checklist */}
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 text-xs space-y-2">
            <span className="font-bold text-amber-900 dark:text-amber-200 block">Allotment Workflow:</span>
            <div className="space-y-1.5 text-amber-800 dark:text-amber-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Application submitted and initial credentials registered.</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Candidate War Room desk verifying residency and booth mapping.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                <span>Activation SMS &amp; Doorstep Survey clearance.</span>
              </div>
            </div>
          </div>

          {refreshMessage && (
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-blue-800 dark:text-blue-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{refreshMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex-1 flex items-center justify-center gap-2 text-xs py-2.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Checking Status..." : "Refresh Approval Status"}</span>
            </Button>
            <Button
              variant="danger"
              onClick={logout}
              className="flex-1 flex items-center justify-center gap-2 text-xs py-2.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out to SSO</span>
            </Button>
          </div>
        </div>

        {/* Development & QA Simulator */}
        <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
              <span>QA Workflow Simulation:</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">DEMO TOGGLE</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
            Simulate Candidate Admin approval to enter the active Karyakarta Field Console:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setMockAccount("ACTIVE")}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              Approve Account (Switch to ACTIVE)
            </button>
            <button
              onClick={() => setMockAccount("SUSPENDED")}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              Simulate Suspension
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

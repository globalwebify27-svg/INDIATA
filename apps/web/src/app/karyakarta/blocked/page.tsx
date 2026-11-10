"use client";

import React, { useState } from "react";
import { ShieldX, HelpCircle, LogOut, Phone, Mail, Users, AlertTriangle } from "lucide-react";
import { useKaryakartaAuth } from "@/karyakarta/context/karyakarta-auth-context";
import { Button } from "@rajtantra/ui/buttons";

export default function KaryakartaBlockedPage() {
  const { user, logout, setMockAccount } = useKaryakartaAuth();
  const [appealSubmitted, setAppealSubmitted] = useState(false);
  const [appealText, setAppealText] = useState("");

  const handleAppealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealText.trim()) return;
    setAppealSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        {/* Header Icon */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <ShieldX className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 mb-2">
            <span>FIELD CADRE ACCOUNT SUSPENDED</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Access Temporarily Suspended
          </h2>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Your volunteer account credentials have been suspended by the Candidate War Room. Access to voter rolls, surveys, and issue management has been restricted.
          </p>
        </div>

        {/* Account Details Card */}
        <div className="mt-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-600" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {user?.name || "Vikas G. Shinde"}
              </span>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
              {user?.id || "KAR-2026-003"}
            </span>
          </div>

          {/* Reason Box */}
          <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/30 text-xs">
            <span className="font-bold text-rose-900 dark:text-rose-200 block mb-1">Suspension Reason:</span>
            <p className="text-rose-800 dark:text-rose-300 leading-relaxed">
              Account placed under administrative review due to duplicate volunteer registration or inactive booth reporting during the pre-campaign window.
            </p>
          </div>

          {/* Candidate Admin Support Info */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
            <span className="font-bold text-slate-900 dark:text-white block">Constituency War Room Support Desk:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>+91 20 2445 9900</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>support@indiata.in</span>
              </div>
            </div>
          </div>

          {/* Appeal Box */}
          {!appealSubmitted ? (
            <form onSubmit={handleAppealSubmit} className="space-y-3 pt-1">
              <label htmlFor="appealNotes" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Submit Clarification or Re-Activation Request:
              </label>
              <textarea
                id="appealNotes"
                value={appealText}
                onChange={(e) => setAppealText(e.target.value)}
                placeholder="State your booth assignment, team lead contact, or reason for review..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
              <Button type="submit" disabled={!appealText.trim()} className="w-full text-xs py-2">
                Submit Request to Candidate Admin
              </Button>
            </form>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your request has been forwarded to the Constituency War Room coordinator.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2">
            <Button
              variant="outline"
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 text-xs py-2.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out to Central SSO</span>
            </Button>
          </div>
        </div>

        {/* Development & QA Simulator */}
        <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>QA Simulation Switcher:</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">DEMO TOGGLE</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setMockAccount("ACTIVE")}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              Re-activate Account (ACTIVE)
            </button>
            <button
              onClick={() => setMockAccount("PENDING_APPROVAL")}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              Set to PENDING_APPROVAL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  Building,
  User,
  Shield,
  Save,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/context/toast-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PortalSettingsView() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeSection, setActiveSection] = useState<"candidate" | "organization" | "security" | "telemetry">("candidate");
  const [candidateName, setCandidateName] = useState(user?.name || "Anand Shinde");
  const [constituencyName, setConstituencyName] = useState(user?.constituencyName || "215 - Kasba Peth");
  const [electionDate, setElectionDate] = useState("2026-11-20");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast(
        "success",
        "Settings Saved Successfully",
        "Constituency parameters and candidate profile updated.",
      );
    }, 600);
  };

  return (
    <div className="space-y-5">
      {/* Module Title Header */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded-full">
              System Configuration
            </span>
            <Badge variant="teal">Tenant Isolated</Badge>
            <Badge variant="neutral">AC-215 Bound</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            Portal, Organization &amp; Campaign Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Configure candidate credentials, constituency boundaries, ECI roll sync schedules, and team permissions.
          </p>
        </div>
      </section>

      {/* Main Settings Navigation & Form Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Settings Navigation Tabs (Span 1) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 shadow-premium-xs space-y-1 h-fit">
          <button
            type="button"
            onClick={() => setActiveSection("candidate")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
              activeSection === "candidate"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-[#1E293B]"
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>Candidate Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("organization")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
              activeSection === "organization"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-[#1E293B]"
            }`}
          >
            <Building className="w-4 h-4 shrink-0" />
            <span>Constituency War Room</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("security")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
              activeSection === "security"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-[#1E293B]"
            }`}
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span>Security &amp; 2FA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("telemetry")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
              activeSection === "telemetry"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-[#1E293B]"
            }`}
          >
            <RefreshCw className="w-4 h-4 shrink-0" />
            <span>ECI Sync Telemetry</span>
          </button>
        </div>

        {/* Settings Form Body (Span 3) */}
        <div className="md:col-span-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-premium-xs">
          <form onSubmit={handleSave} className="space-y-5">
            {activeSection === "candidate" && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    Candidate &amp; Authorized Nominee Profile
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official candidate name displayed across campaign war rooms, mobile apps, and reports.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-white mb-1.5 uppercase">
                      Candidate Full Name
                    </label>
                    <input
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-white mb-1.5 uppercase">
                      Official Candidate Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || "candidate@rajtantra.in"}
                      disabled
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-white mb-1.5 uppercase">
                      Constituency Name &amp; Code
                    </label>
                    <input
                      type="text"
                      value={constituencyName}
                      onChange={(e) => setConstituencyName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-white mb-1.5 uppercase">
                      Election Polling Date
                    </label>
                    <input
                      type="date"
                      value={electionDate}
                      onChange={(e) => setElectionDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "organization" && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    Kasba Peth War Room Organization Credentials
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tenant isolation identifier, physical campaign office address, and RO contact details.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">Tenant Organization ID:</span>
                    <span className="font-mono font-bold text-brand-600">
                      {user?.organizationId || "org-kasba-peth-2026"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Constituency Type:</span>
                    <span className="font-bold text-slate-800 dark:text-white">
                      Maharashtra Legislative Assembly (Vidhan Sabha AC-215)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "security" && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    Account Security &amp; Access Authentication
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Two-factor authentication (2FA), API key access tokens, and candidate role permissions.
                  </p>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-lg bg-emerald-50 border border-[#0DAD9B]/20">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-white">
                        Two-Factor Authentication (2FA) Active
                      </div>
                      <div className="text-[11px] text-slate-500">
                        SMS OTP required on every new device session.
                      </div>
                    </div>
                  </div>
                  <Badge variant="teal">Protected</Badge>
                </div>
              </div>
            )}

            {activeSection === "telemetry" && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    ECI Server Roll Synchronization
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Master roll telemetry bridge for 264 Polling Stations in AC-215.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-white">
                      Roll Synchronization Status: Optimal
                    </div>
                    <div className="text-[11px] text-emerald-600 mt-0.5">
                      Last synchronized today at 04:30 AM (Batch #4029)
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      showToast("info", "Sync In Progress", "Querying ECI API for electoral roll revisions...")
                    }
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Force Re-sync</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Save Button Row */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <Button type="submit" variant="primary" size="md" isLoading={isSaving}>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

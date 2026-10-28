import React from "react";
import { Vote, Users, MapPin, CheckCircle2 } from "lucide-react";
import { UserRole } from "@rajtantra/common-types";

export default function CandidateWarRoomHomePage() {
  return (
    <main className="flex-1 flex flex-col p-6 max-w-6xl mx-auto w-full">
      {/* Header Bar */}
      <header className="flex justify-between items-center py-4 border-b border-[var(--border)] mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-xl shadow">
            WR
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Rajtantra Candidate War Room
            </h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              Constituency Command Center & Campaign Intelligence
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            Tenant Isolated
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-medium border border-[var(--border)] bg-[var(--card)]">
            Role: {UserRole.CANDIDATE_ADMIN}
          </span>
        </div>
      </header>

      {/* Hero Welcome Card */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-2">
          Module 00: Foundation Shell Active
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          The candidate war room shell is connected to the backend foundation.
          The 19 operational modules (Voter Roll, 22 Quick Filters, Booth
          Mappings, Doorstep Surveys, and Karyakarta assignments) will be
          introduced in their respective phased modules.
        </p>

        {/* Campaign Intelligence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-lg bg-[var(--muted)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
              <Vote className="w-5 h-5" />
              <h3 className="font-semibold text-sm">Voter Roll Core</h3>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">
              Prepared for 1M+ voters with sub-second composite indexing.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--muted)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
              <MapPin className="w-5 h-5" />
              <h3 className="font-semibold text-sm">Booths & BLOs</h3>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">
              Polling station registry mapped to Prabhaags and ranges.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--muted)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
              <Users className="w-5 h-5" />
              <h3 className="font-semibold text-sm">Field Cadre</h3>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">
              Karyakarta mobile activation and geo-survey coordination.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--muted)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 mb-1">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="font-semibold text-sm">Strict Security</h3>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">
              Server-side tenant isolation guarding candidate data.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto pt-8 border-t border-[var(--border)] text-center text-xs text-[var(--muted-foreground)]">
        Rajtantra Platform Engine v1.0.0 &bull; Architecture Baseline Approved
        (Oct 2026)
      </footer>
    </main>
  );
}

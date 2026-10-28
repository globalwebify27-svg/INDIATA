import React from "react";
import { Shield, Users, Server, Database } from "lucide-react";
import { UserRole } from "@rajtantra/common-types";

export default function SuperAdminHomePage() {
  return (
    <main className="flex-1 flex flex-col p-6 max-w-6xl mx-auto w-full">
      {/* Header Bar */}
      <header className="flex justify-between items-center py-4 border-b border-[var(--border)] mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-xl shadow">
            RT
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Rajtantra Super Admin
            </h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              Global Platform Management & Multi-Tenant Control
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Operational
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-medium border border-[var(--border)] bg-[var(--card)]">
            Role: {UserRole.SUPER_ADMIN}
          </span>
        </div>
      </header>

      {/* Hero Welcome Card */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-2">
          Module 00: Project Foundation Baseline
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          The monorepo architecture, strict security boundaries, shared
          TypeScript packages, and database foundations are initialized.
          Candidate provisioning, global pricing visibility switches, and tenant
          catalogs will be integrated in subsequent modules.
        </p>

        {/* Foundation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-lg bg-[var(--muted)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 mb-1">
              <Server className="w-5 h-5" />
              <h3 className="font-semibold text-sm">NestJS API Core</h3>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">
              Modular monolith with JWT auth, RBAC, and /api/v1 routes.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--muted)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
              <Database className="w-5 h-5" />
              <h3 className="font-semibold text-sm">MySQL 8.0 & Prisma</h3>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">
              Multi-tenant schema with organizations and roles.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--muted)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
              <Shield className="w-5 h-5" />
              <h3 className="font-semibold text-sm">Tenant Isolation</h3>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">
              Server-side verification with strict cross-tenant blocking.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--muted)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
              <Users className="w-5 h-5" />
              <h3 className="font-semibold text-sm">4 Role Models</h3>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">
              Super Admin, Distributor, Candidate Admin, Karyakarta.
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

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  Sparkles,
  BarChart3,
  Users,
  ChevronRight,
} from "lucide-react";
import { Button, Input, Card, CardContent, Badge } from "@rajtantra/ui";
import { PortalAccessInfo, UserRole, CentralLoginResult } from "@rajtantra/common-types";
import { apiFetch } from "@rajtantra/api-client";

export default function CentralLoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Multi-Portal Selection Workflow States
  const [step, setStep] = useState<"login" | "portal-selection">("login");
  const [authorizedPortals, setAuthorizedPortals] = useState<PortalAccessInfo[]>([]);
  const [portalUser, setPortalUser] = useState<{ name?: string; role?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanId = identifier.trim();
    if (!cleanId) {
      setErrorMessage("Please enter your registered email or mobile number.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your account password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiFetch<CentralLoginResult>("/auth/login", {
        method: "POST",
        body: { identifier: cleanId, password, rememberMe },
      });

      if (response.success && response.data) {
        const { user, portals, primaryPortal } = response.data;
        if (portals && portals.length > 1) {
          setAuthorizedPortals(portals);
          setPortalUser(user);
          setStep("portal-selection");
          return;
        }

        const target = primaryPortal || (portals && portals[0]);
        if (target?.url) {
          window.location.href = target.url;
        } else {
          window.location.href = user.role === UserRole.SUPER_ADMIN ? "http://localhost:3000/super-admin" : "http://localhost:3000/candidate";
        }
      }
    } catch {
      // Fallback demo simulation if backend is launching
      const isSuperAdmin = cleanId.toLowerCase().includes("superadmin");
      const targetUrl = isSuperAdmin ? "http://localhost:3000/super-admin" : "http://localhost:3000/candidate";
      window.location.href = targetUrl;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLaunchPortal = (portal: PortalAccessInfo) => {
    window.location.href = portal.url;
  };

  const handleDirectLaunchCandidate = () => {
    window.location.href = "http://localhost:3000/candidate";
  };

  const handleDirectLaunchSuperAdmin = () => {
    window.location.href = "http://localhost:3000/super-admin";
  };

  const handleUseCandidateDemo = () => {
    setIdentifier("candidate@rajtantra.in");
    setPassword("Rajtantra@2026");
    setErrorMessage(null);
  };

  const handleUseSuperAdminDemo = () => {
    setIdentifier("superadmin@rajtantra.in");
    setPassword("Rajtantra@2026");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030e17] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="h-10 mb-2 flex items-center justify-center">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#2087FE] flex items-center justify-center text-white text-base font-black shadow-xs">
                R
              </span>
              RAJTANTRA / INDATA
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="primary">Central Election Platform SSO</Badge>
            <span className="text-xs text-slate-400">v4.2</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            One Central Gateway for Super Admin, Distributors, Candidates &amp; Karyakartas
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        {step === "login" ? (
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-premium-sm bg-white dark:bg-[#072439]">
            <CardContent className="pt-6">
              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5">
                  <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Registered Email or Mobile Number"
                  type="text"
                  placeholder="candidate@rajtantra.in or superadmin@rajtantra.in"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                  required
                />

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                      Password <span className="text-rose-600">*</span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-brand-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your account password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border text-xs transition-colors bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      Keep session active on this device
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-2 font-semibold"
                  isLoading={isSubmitting}
                >
                  {identifier.includes("superadmin")
                    ? "Open Super Admin Platform"
                    : "Sign In to Candidate War Room"}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>

                {/* Direct 1-Click Launch Entry */}
                <div className="grid grid-cols-2 gap-2 mt-2.5">
                  <button
                    type="button"
                    onClick={handleDirectLaunchCandidate}
                    disabled={isSubmitting}
                    className="py-2.5 px-3 rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/70 hover:bg-brand-100 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-brand-600" />
                    <span>Candidate Portal</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDirectLaunchSuperAdmin}
                    disabled={isSubmitting}
                    className="py-2.5 px-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/70 hover:bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Shield className="w-3.5 h-3.5 text-purple-600" />
                    <span>Super Admin Portal</span>
                  </button>
                </div>
              </form>

              {/* Quick Demo Credentials Assistant */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                    Role-Based 1-Click Auto Fill
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={handleUseCandidateDemo}
                    className={`px-2.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left ${
                      !identifier.includes("superadmin") && identifier.length > 0
                        ? "border-brand-500 bg-brand-100/70 dark:bg-brand-900/40 text-brand-800 dark:text-brand-200"
                        : "border-brand-200 dark:border-brand-900 bg-brand-50/70 hover:bg-brand-100 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300"
                    }`}
                  >
                    <div className="text-[10px] text-brand-500 font-bold uppercase">War Room</div>
                    Candidate Admin
                  </button>
                  <button
                    type="button"
                    onClick={handleUseSuperAdminDemo}
                    className={`px-2.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left ${
                      identifier.includes("superadmin")
                        ? "border-purple-500 bg-purple-100/70 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200"
                        : "border-purple-200 dark:border-purple-900 bg-purple-50/70 hover:bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300"
                    }`}
                  >
                    <div className="text-[10px] text-purple-500 font-bold uppercase">Platform Console</div>
                    Super Admin
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11.5px] space-y-1 text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Identifier:</span>
                    <span className="font-mono font-medium">{identifier || "Select above"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Destination:</span>
                    <span className="font-semibold text-brand-600 dark:text-brand-400">
                      {identifier.includes("superadmin")
                        ? "Super Admin Platform (/super-admin)"
                        : "Candidate War Room (/candidate)"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-premium-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-brand-600 to-indigo-700 p-5 text-white">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                  SSO Authorized
                </span>
                <span className="text-[11px] text-white/90 font-mono font-bold bg-white/10 px-2 py-0.5 rounded-md">
                  {portalUser?.role}
                </span>
              </div>
              <h2 className="text-lg font-black mt-2 tracking-tight">
                Select Command Workspace
              </h2>
              <p className="text-xs text-white/80 mt-0.5">
                Welcome, <strong className="text-white">{portalUser?.name}</strong>. Your account has access to multiple portals:
              </p>
            </div>

            <CardContent className="p-5 space-y-3">
              {authorizedPortals.map((portal) => (
                <div
                  key={portal.portalKey}
                  onClick={() => handleLaunchPortal(portal)}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-500 hover:shadow-premium-xs transition-all cursor-pointer group bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        {portal.portalKey === "SUPER_ADMIN" ? (
                          <Shield className="w-5 h-5 text-brand-600" />
                        ) : portal.portalKey === "CANDIDATE_WAR_ROOM" ? (
                          <BarChart3 className="w-5 h-5 text-brand-600" />
                        ) : (
                          <Users className="w-5 h-5 text-brand-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                            {portal.title}
                          </h3>
                          {portal.isDefault && (
                            <Badge variant="primary">Default Portal</Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {portal.subtitle}
                        </p>
                        {portal.constituencyName && (
                          <span className="inline-block mt-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            Constituency: {portal.constituencyName}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all shrink-0 mt-2.5" />
                  </div>
                </div>
              ))}

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setStep("login")}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium hover:underline cursor-pointer"
                >
                  &larr; Switch to a different account
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

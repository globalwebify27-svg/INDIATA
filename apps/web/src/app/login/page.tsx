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
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/context/toast-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CentralLoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSuperAdminIdentifier = (id: string) => {
    const clean = id.trim().toLowerCase();
    if (!clean) return false;
    return (
      clean.includes("superadmin") ||
      clean.includes("premsons") ||
      clean.startsWith("admin@") ||
      clean === "admin" ||
      (clean.includes("admin") && !clean.includes("candidate"))
    );
  };

  const isCurrentSuperAdmin = isSuperAdminIdentifier(identifier);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    // Read directly from form in case browser autofill didn't trigger synthetic onChange
    const form = e.currentTarget;
    const formId = (form.elements.namedItem("identifier") as HTMLInputElement)?.value || identifier;
    const formPass = (form.elements.namedItem("password") as HTMLInputElement)?.value || password;

    const cleanId = (formId || identifier).trim();
    const cleanPass = formPass || password;

    if (!cleanId) {
      setErrorMessage("Please enter your registered email or mobile number.");
      return;
    }
    if (!cleanPass) {
      setErrorMessage("Please enter your account password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(cleanId, cleanPass);
      const isSuper = isSuperAdminIdentifier(cleanId) || result?.user?.role === "SUPER_ADMIN";

      if (isSuper) {
        showToast("success", "Super Admin Authorized", "Redirecting to Super Admin Console...");
        window.location.replace("/super-admin");
      } else {
        showToast("success", "Candidate War Room Authorized", "Redirecting to Candidate Portal...");
        window.location.replace("/candidate");
      }
    } catch (err: unknown) {
      const isSuper = isSuperAdminIdentifier(cleanId);
      const targetUrl = isSuper ? "/super-admin" : "/candidate";
      showToast("info", "Opening Election Command", `Redirecting to ${isSuper ? "Super Admin" : "Candidate"} Portal...`);
      window.location.replace(targetUrl);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectLaunchCandidate = async () => {
    setIsSubmitting(true);
    try {
      await login("candidate@rajtantra.in", "Rajtantra@2026");
    } catch {
      // Continue to target
    }
    window.location.replace("/candidate");
  };

  const handleDirectLaunchSuperAdmin = async () => {
    setIsSubmitting(true);
    try {
      await login("superadmin@rajtantra.in", "Rajtantra@2026");
    } catch {
      // Continue to target
    }
    window.location.replace("/super-admin");
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
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-premium-sm bg-white dark:bg-[#072439]">
          <CardContent className="pt-6">
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5">
                <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-1.5"
                >
                  Registered Email or Mobile Number <span className="text-rose-600">*</span>
                </label>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="candidate@rajtantra.in or superadmin@rajtantra.in"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                  required
                  className="w-full rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs px-3.5 py-2.5 transition-colors border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2087FE] focus:border-transparent placeholder:text-slate-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide"
                  >
                    Password <span className="text-rose-600">*</span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
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
                variant={isCurrentSuperAdmin ? "secondary" : "primary"}
                size="lg"
                className={`w-full mt-2 font-semibold ${
                  isCurrentSuperAdmin
                    ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                    : ""
                }`}
                isLoading={isSubmitting}
              >
                {isCurrentSuperAdmin
                  ? "Sign In to Super Admin Platform"
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
                    !isCurrentSuperAdmin && identifier.length > 0
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
                    isCurrentSuperAdmin
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
                  <span
                    className={`font-semibold ${
                      isCurrentSuperAdmin
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-brand-600 dark:text-brand-400"
                    }`}
                  >
                    {isCurrentSuperAdmin
                      ? "Super Admin Platform (/super-admin)"
                      : "Candidate War Room (/candidate)"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onboarding Registration Link */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Not yet registered for this election cycle?{" "}
            <Link
              href="/candidate/subscriptions"
              className="font-semibold text-brand-600 hover:underline"
            >
              Submit Registration Enquiry
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

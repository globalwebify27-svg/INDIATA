"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Shield,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  BarChart3,
  Building2,
  FileCheck2,
  Headphones,
  BadgeAlert,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/context/toast-context";

type PortalType = "candidate" | "superadmin" | "distributor" | "karyakarta";

export default function CentralLoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [activePortal, setActivePortal] = useState<PortalType>("superadmin");
  const [identifier, setIdentifier] = useState("superadmin@indiata.in");
  const [password, setPassword] = useState("Indiata@2026");
  const [karyakartaKey, setKaryakartaKey] = useState("KAS101");
  const [karyakartaPhone, setKaryakartaPhone] = useState("+919876543213");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectPortal = (portal: PortalType) => {
    setActivePortal(portal);
    setErrorMessage(null);
    if (portal === "superadmin") {
      setIdentifier("superadmin@indiata.in");
      setPassword("Indiata@2026");
    } else if (portal === "candidate") {
      setIdentifier("candidate@indiata.in");
      setPassword("Indiata@2026");
    } else if (portal === "distributor") {
      setIdentifier("distributor@indiata.in");
      setPassword("Indiata@2026");
    } else if (portal === "karyakarta") {
      setKaryakartaKey("KAS101");
      setKaryakartaPhone("+919876543213");
    }
  };

  const getPortalMeta = (portal: PortalType) => {
    switch (portal) {
      case "candidate":
        return {
          title: "Candidate War Room",
          subtitle: "215 - Kasba Peth Constituency Telemetry & Cadre Command",
          route: "/candidate",
          color: "cyan",
          badge: "bg-cyan-50 border-cyan-200 text-cyan-800",
          buttonBg: "from-cyan-600 to-sky-700 hover:from-cyan-700 hover:to-sky-800",
          submitLabel: "Sign In to Candidate War Room",
          icon: BarChart3,
          demoHint: "candidate@indiata.in / Indiata@2026",
        };
      case "distributor":
        return {
          title: "Franchise Regional Distributor Desk",
          subtitle: "Commercial Agency Oversight, Turnover Ledger & Payouts",
          route: "/distributor/dashboard",
          color: "blue",
          badge: "bg-blue-50 border-blue-200 text-blue-800",
          buttonBg: "from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800",
          submitLabel: "Sign In to Distributor Desk",
          icon: Building2,
          demoHint: "distributor@indiata.in / Indiata@2026",
        };
      case "karyakarta":
        return {
          title: "Field Karyakarta Cadre Portal",
          subtitle: "Zero-Friction 6-Char Key Activation & Booth Assignment",
          route: "/karyakarta/dashboard",
          color: "emerald",
          badge: "bg-emerald-50 border-emerald-200 text-emerald-800",
          buttonBg: "from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800",
          submitLabel: "Activate & Enter Field Portal",
          icon: Users,
          demoHint: "Key: KAS101  •  Mobile: +919876543213",
        };
      case "superadmin":
      default:
        return {
          title: "Super Admin Platform Command",
          subtitle: "Global Multi-Tenant Infrastructure, Licensing & ECI Audit",
          route: "/super-admin",
          color: "purple",
          badge: "bg-purple-50 border-purple-200 text-purple-900",
          buttonBg: "from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9]",
          submitLabel: "Sign In to Super Admin Console",
          icon: Shield,
          demoHint: "superadmin@indiata.in / Indiata@2026",
        };
    }
  };

  const portalMeta = getPortalMeta(activePortal);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    // KARYAKARTA ACTIVATION WORKFLOW
    if (activePortal === "karyakarta") {
      const cleanKey = karyakartaKey.trim().toUpperCase();
      const cleanPhone = karyakartaPhone.trim();

      if (!cleanKey) {
        setErrorMessage("Please enter your 6-character activation key.");
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await fetch("http://localhost:4000/api/v1/auth/karyakarta/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activationKey: cleanKey,
            phone: cleanPhone || undefined,
            deviceUuid: "web-client-" + (typeof window !== "undefined" ? window.navigator.userAgent.substring(0, 32) : "device"),
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && (data.data || data.tokens)) {
          const authData = data.data || data;
          if (authData.tokens?.accessToken) {
            localStorage.setItem("rajtantra_access_token", authData.tokens.accessToken);
            localStorage.setItem("rajtantra_refresh_token", authData.tokens.refreshToken);
            localStorage.setItem("rajtantra_active_role", authData.user?.role || "KARYAKARTA");
            document.cookie = `rajtantra_access_token=${authData.tokens.accessToken}; Path=/; SameSite=Lax; max-age=86400`;
          }
          showToast("success", "Karyakarta Activated", `Welcome ${authData.user?.name || "Volunteer"}! Assigned booths: ${authData.assignedBooths?.join(", ") || "101, 102"}`);
          window.location.replace("/karyakarta/dashboard");
          return;
        }

        // If response is NOT ok (e.g. 401 Unauthorized or wrong phone/key)
        const errorMsg = data.message || "Invalid activation key or phone number.";
        setErrorMessage(errorMsg);
        showToast("error", "Activation Failed", errorMsg);
        return;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Could not connect to authentication service";
        setErrorMessage(msg);
        showToast("error", "Activation Failed", msg);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // STANDARD ROLES LOGIN WORKFLOW (Super Admin, Candidate, Distributor)
    const cleanId = identifier.trim();
    const cleanPass = password;

    if (!cleanId) {
      setErrorMessage("Please enter your registered email or username.");
      return;
    }

    if (!cleanPass) {
      setErrorMessage("Please enter your secure password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(cleanId, cleanPass);
      showToast("success", `${portalMeta.title} Authorized`, `Opening ${portalMeta.route}...`);
      window.location.replace(portalMeta.route);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid identifier or password";
      setErrorMessage(msg);
      showToast("error", "Authentication Failed", msg);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen h-screen w-full relative flex flex-col items-center justify-center p-3 sm:p-4 bg-[#071426] text-slate-900 selection:bg-[#4F46E5] selection:text-white font-sans antialiased overflow-y-auto sm:overflow-hidden">
      {/* Background Visual Effects & Subtle Glowing Gradients */}
      <div
        className="fixed inset-0 opacity-60 pointer-events-none"
        style={{
          backgroundSize: "36px 36px",
          backgroundImage:
            "linear-gradient(to right, rgba(96, 165, 250, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(96, 165, 250, 0.05) 1px, transparent 1px)",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(79, 70, 229, 0.25), transparent)",
        }}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-tr from-[#4F46E5]/20 via-[#7C3AED]/20 to-[#60A5FA]/15 rounded-full blur-[110px] pointer-events-none" />
      <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-[#4F46E5]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed -top-24 -right-24 w-96 h-96 bg-[#7C3AED]/15 rounded-full blur-[120px] pointer-events-none" />

      {/* ========================================================= */}
      {/* COMPACT CENTERED GLASSMORPHISM MODULE (NO-SCROLL FIT)     */}
      {/* ========================================================= */}
      <div className="w-full max-w-[465px] relative z-10 flex flex-col justify-center my-auto">
        <div className="bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/80 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.65)] p-4 sm:p-5 sm:py-5 transition-all">
          {/* Card Brand & Title Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-tr from-[#2087FE] to-[#6256D9] flex items-center justify-center text-white font-black text-xs shadow-sm shadow-[#2087FE]/20">
                  I
                </div>
                <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-wider">
                  INDIATA
                </span>
              </div>
              <p className="text-slate-500 text-[10.5px] mt-0.5 font-medium leading-tight">
                Election Intelligence &amp; Campaign Command Platform
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#4F46E5] px-2 py-0.5 rounded-full bg-[#4F46E5]/10 border border-[#4F46E5]/20 shadow-sm">
              SSO v5.0
            </span>
          </div>

          {/* Portal Selection Prompt */}
          <div className="mb-2.5">
            <label className="block text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-1.5">
              SELECT WORKSTATION PORTAL
            </label>

            {/* 4 Clean Portal Option Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {/* Candidate */}
              <button
                type="button"
                onClick={() => selectPortal("candidate")}
                className={`p-1.5 sm:p-2 rounded-xl border text-left transition-all cursor-pointer group ${
                  activePortal === "candidate"
                    ? "border-2 border-cyan-500 bg-cyan-50/80 text-cyan-900 shadow-sm"
                    : "border-slate-200 bg-white/70 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <BarChart3 className="w-3.5 h-3.5 text-cyan-600" />
                  <span className="text-[8.5px] font-mono px-1 py-0.5 rounded bg-cyan-100 text-cyan-800 font-bold">
                    /cand
                  </span>
                </div>
                <div className="text-[11.5px] font-bold leading-tight">Candidate</div>
                <div className="text-[9.5px] text-slate-500 leading-tight">War Room</div>
              </button>

              {/* Super Admin */}
              <button
                type="button"
                onClick={() => selectPortal("superadmin")}
                className={`p-1.5 sm:p-2 rounded-xl border text-left transition-all cursor-pointer group ${
                  activePortal === "superadmin"
                    ? "border-2 border-purple-500 bg-purple-50/80 text-purple-900 shadow-sm"
                    : "border-slate-200 bg-white/70 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <Shield className="w-3.5 h-3.5 text-purple-700" />
                  <span className="text-[8.5px] font-mono px-1 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                    /admin
                  </span>
                </div>
                <div className="text-[11.5px] font-bold leading-tight">Super Admin</div>
                <div className="text-[9.5px] text-slate-500 leading-tight">Console</div>
              </button>

              {/* Distributor */}
              <button
                type="button"
                onClick={() => selectPortal("distributor")}
                className={`p-1.5 sm:p-2 rounded-xl border text-left transition-all cursor-pointer group ${
                  activePortal === "distributor"
                    ? "border-2 border-blue-500 bg-blue-50/80 text-blue-900 shadow-sm"
                    : "border-slate-200 bg-white/70 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-[8.5px] font-mono px-1 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                    /dist
                  </span>
                </div>
                <div className="text-[11.5px] font-bold leading-tight">Distributor</div>
                <div className="text-[9.5px] text-slate-500 leading-tight">Franchise</div>
              </button>

              {/* Karyakarta */}
              <button
                type="button"
                onClick={() => selectPortal("karyakarta")}
                className={`p-1.5 sm:p-2 rounded-xl border text-left transition-all cursor-pointer group ${
                  activePortal === "karyakarta"
                    ? "border-2 border-emerald-500 bg-emerald-50/80 text-emerald-900 shadow-sm"
                    : "border-slate-200 bg-white/70 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[8.5px] font-mono px-1 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    /karya
                  </span>
                </div>
                <div className="text-[11.5px] font-bold leading-tight">Karyakarta</div>
                <div className="text-[9.5px] text-slate-500 leading-tight">Field Cadre</div>
              </button>
            </div>
          </div>

          {/* Dynamic Role Header Badge */}
          <div className={`p-2 px-2.5 rounded-xl border mb-2.5 flex items-center justify-between transition-all ${portalMeta.badge}`}>
            <div className="flex items-center gap-2">
              <portalMeta.icon className="w-3.5 h-3.5 shrink-0" />
              <div>
                <h3 className="text-[11px] font-bold leading-tight">{portalMeta.title}</h3>
                <p className="text-[9.5px] opacity-80 leading-tight mt-0.5">{portalMeta.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Dynamic Error Banner */}
          {errorMessage && (
            <div className="mb-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-medium flex items-start gap-1.5">
              <BadgeAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* THE AUTHENTICATION FORM */}
          <form className="space-y-2.5" onSubmit={handleSubmit}>
            {activePortal === "karyakarta" ? (
              <>
                {/* Karyakarta Field 1: Activation Key */}
                <div>
                  <label
                    htmlFor="karyakartaKeyInput"
                    className="block text-slate-700 text-[10px] font-bold uppercase tracking-wider mb-1"
                  >
                    6-CHARACTER ACTIVATION KEY <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      id="karyakartaKeyInput"
                      name="activationKey"
                      type="text"
                      required
                      maxLength={12}
                      value={karyakartaKey}
                      onChange={(e) => setKaryakartaKey(e.target.value.toUpperCase())}
                      placeholder="e.g. KAS101"
                      className="block w-full pl-9 pr-3 py-1.5 sm:py-2 text-xs text-slate-900 bg-slate-50/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono font-bold tracking-widest uppercase transition-colors"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    6-character key issued by candidate war room for booth volunteer access.
                  </p>
                </div>

                {/* Karyakarta Field 2: Mobile Number */}
                <div>
                  <label
                    htmlFor="karyakartaPhoneInput"
                    className="block text-slate-700 text-[10px] font-bold uppercase tracking-wider mb-1"
                  >
                    REGISTERED MOBILE NUMBER <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <input
                      id="karyakartaPhoneInput"
                      name="phone"
                      type="tel"
                      required
                      value={karyakartaPhone}
                      onChange={(e) => setKaryakartaPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43213"
                      className="block w-full pl-9 pr-3 py-1.5 sm:py-2 text-xs text-slate-900 bg-slate-50/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-mono"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Field 1: Identifier (Email/Username/Franchise ID) */}
                <div>
                  <label
                    htmlFor="userIdentifier"
                    className="block text-slate-700 text-[10px] font-bold uppercase tracking-wider mb-1"
                  >
                    {activePortal === "superadmin"
                      ? "SUPER ADMIN USERNAME / EMAIL"
                      : activePortal === "distributor"
                      ? "DISTRIBUTOR EMAIL / FRANCHISE ID"
                      : "CANDIDATE EMAIL OR PHONE"}{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FileCheck2 className="w-3.5 h-3.5" />
                    </div>
                    <input
                      id="userIdentifier"
                      name="identifier"
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        activePortal === "superadmin"
                          ? "superadmin@indiata.in"
                          : activePortal === "distributor"
                          ? "distributor@indiata.in"
                          : "candidate@indiata.in"
                      }
                      className="block w-full pl-9 pr-3 py-1.5 sm:py-2 text-xs text-slate-900 bg-slate-50/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] transition-colors"
                    />
                  </div>
                </div>

                {/* Field 2: Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="passwordInput"
                      className="block text-slate-700 text-[10px] font-bold uppercase tracking-wider"
                    >
                      SECURE PASSWORD <span className="text-rose-500">*</span>
                    </label>
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Password reset instructions have been dispatched to your registered security contact.");
                      }}
                      className="text-[10.5px] text-[#4F46E5] font-semibold hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      id="passwordInput"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your confidential password"
                      className="block w-full pl-9 pr-9 py-1.5 sm:py-2 text-xs text-slate-900 bg-slate-50/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Session Persistence & Secure TLS Info */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 text-[#4F46E5] rounded border-slate-300 focus:ring-[#4F46E5]"
                />
                <span className="ml-1.5 text-[11px] text-slate-600 font-medium">
                  Remember workstation session
                </span>
              </label>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Secure TLS 1.3</span>
              </span>
            </div>

            {/* Primary Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2.5 px-4 rounded-xl bg-gradient-to-r ${portalMeta.buttonBg} text-white font-bold text-xs tracking-wide shadow-sm hover:shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70`}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full mr-1" />
                    <span>Authenticating Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>{portalMeta.submitLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Quick Demo Pill Helper */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1 text-slate-400">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Seed Demo Credentials:</span>
              </span>
              <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[9.5px]">
                {portalMeta.demoHint}
              </span>
            </div>
          </form>
        </div>

        {/* Footer Inquiries & Helpline Support */}
        <div className="mt-2.5 sm:mt-3 text-center space-y-1">
          <p className="text-[11px] text-slate-400">
            New franchise inquiry?{" "}
            <Link href="/distributor/register" className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline">
              Apply for Regional Distribution Rights
            </Link>
          </p>
          <p className="text-[10px] text-slate-400/80 flex items-center justify-center gap-1.5">
            <Headphones className="w-3 h-3 text-slate-400" />
            <span>Central Election Command Helpdesk:</span>
            <span className="font-mono font-bold text-slate-300">1800-INDIATA</span>
            <span className="text-slate-500">(Toll Free 24/7)</span>
          </p>
        </div>
      </div>
    </div>
  );
}

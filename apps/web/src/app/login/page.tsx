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
  CheckCircle2,
  Radio,
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
  const [identifier, setIdentifier] = useState("superadmin@rajtantra.in");
  const [password, setPassword] = useState("Rajtantra@2026");
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
      setIdentifier("superadmin@rajtantra.in");
      setPassword("Rajtantra@2026");
    } else if (portal === "candidate") {
      setIdentifier("candidate@rajtantra.in");
      setPassword("Rajtantra@2026");
    } else if (portal === "distributor") {
      setIdentifier("distributor@rajtantra.in");
      setPassword("Rajtantra@2026");
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
          demoHint: "candidate@rajtantra.in / Rajtantra@2026",
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
          demoHint: "distributor@rajtantra.in / Rajtantra@2026",
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
          badge: "bg-purple-50 border-purple-200 text-purple-800",
          buttonBg: "from-[#493bbf] to-[#6256d9] hover:from-[#3e2db4] hover:to-[#5346c8]",
          submitLabel: "Sign In to Super Admin Console",
          icon: Shield,
          demoHint: "superadmin@rajtantra.in / Rajtantra@2026",
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F1F3FA] text-[#161b2a] selection:bg-[#6256d9] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Dynamic Cyber Style definitions scoped to this page */}
      <style jsx global>{`
        .cyber-grid {
          background-size: 38px 38px;
          background-image: 
            linear-gradient(to right, rgba(98, 86, 217, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(98, 86, 217, 0.08) 1px, transparent 1px);
        }
        .radial-cyber-glow {
          background: radial-gradient(circle at 35% 45%, rgba(73, 59, 191, 0.35) 0%, rgba(0, 96, 171, 0.18) 45%, transparent 75%);
        }
        .glass-telemetry {
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      {/* ========================================================= */}
      {/* LEFT SHOWCASE: 58% Analytical Sovereign Telemetry & Command */}
      {/* ========================================================= */}
      <section className="lg:w-[58%] w-full bg-[#070E18] relative flex flex-col justify-between p-7 lg:p-14 text-white overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
        {/* Ambient Visual Effects & Background Cyber Grid */}
        <div className="absolute inset-0 cyber-grid opacity-60 pointer-events-none" />
        <div className="absolute inset-0 radial-cyber-glow pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#493bbf]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-[#0060ab]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header / Sovereign Status Pill */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* INDIATA Brand Logo Badge */}
            <div className="h-10 px-3.5 bg-white/95 rounded-xl border border-white/20 flex items-center shadow-lg gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#2087FE] to-[#6256D9] flex items-center justify-center text-white font-black text-sm">
                I
              </div>
              <span className="font-extrabold text-[#070E18] text-base tracking-wider">
                INDIATA
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SOVEREIGN NODE V5.0 ONLINE
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-400 text-xs font-semibold bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-700/60 backdrop-blur-md">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>INDIATA SECURE PROTOCOL • 256-BIT ENCRYPTION</span>
          </div>
        </div>

        {/* Center Narrative & Intelligence Highlights */}
        <div className="relative z-10 my-8 lg:my-auto max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6256d9]/20 border border-[#6256d9]/40 text-[#c5c0ff] text-xs font-semibold mb-5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>CENTRAL ELECTION PLATFORM SSO v5.0 • SOVEREIGN GRADE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white leading-tight font-display">
            Empowering Winning Campaigns with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
              Precision Sovereign Intelligence.
            </span>
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            Unified sovereign access gateway orchestrating real-time voter rolls, micro-constituency telemetry, AI sentiment tracking, and multi-tier cadre dispatches across all 543 Lok Sabha seats.
          </p>

          {/* Floating Glassmorphism Telemetry Cards Bento Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Telemetry Card 1 */}
            <div className="glass-telemetry rounded-xl p-4 transition-all duration-300 hover:border-[#6256d9]/60 hover:shadow-lg hover:shadow-[#493bbf]/10">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  Active Constituencies
                </span>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">288 Live</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  +18.4% Sentiment
                </span>
              </div>
              {/* Mini Sparkline Simulation */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/60">
                <div className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Voter Pulse Index: 74.2</span>
                </div>
                <svg className="w-20 h-5 text-emerald-400" fill="none" viewBox="0 0 80 20">
                  <path
                    d="M0 16L15 13L30 15L45 8L60 11L75 3L80 4"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* Telemetry Card 2 */}
            <div className="glass-telemetry rounded-xl p-4 transition-all duration-300 hover:border-[#6256d9]/60 hover:shadow-lg hover:shadow-[#493bbf]/10">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  Constituency Geo-Telemetry
                </span>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                  12ms Latency
                </span>
              </div>
              <div className="mt-2">
                <span className="text-lg font-bold text-white">AC-54 East Delhi</span>
                <p className="text-xs text-slate-300 mt-0.5">
                  14,290 Cadre Nodes Active &amp; Synchronized
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/60">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full w-[84%]" />
                </div>
                <span className="ml-2 text-[10px] font-mono text-slate-300">84%</span>
              </div>
            </div>

            {/* Security Architecture Banner Span 2 */}
            <div className="md:col-span-2 glass-telemetry rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 border border-slate-700/70">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c5c0ff]" />
                <span className="font-semibold text-white">Security Architecture:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-Bit Military Grade</span>
                </span>
                <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ECI Data Governance Compliant</span>
                </span>
                <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ISO 27001 Certified</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Left Bottom Compliance Footer */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>STQC Certified System</span>
            <span className="text-slate-600">•</span>
            <span>Sovereign Cloud Hosted in MeitY Empaneled Data Centers</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-slate-400 text-[11px]">
            <span>PLATFORM BUILD: 5.0.4-LOKSABHA</span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* RIGHT AUTHENTICATION CARD: 42% High-Density SaaS Form */}
      {/* ========================================================= */}
      <section className="lg:w-[42%] w-full bg-[#F8FAFC] flex flex-col justify-center items-center p-5 sm:p-10 lg:p-12 relative overflow-y-auto">
        <div className="w-full max-w-[460px] mx-auto py-2">
          {/* Top Auth Container Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 p-6 sm:p-8">
            {/* Card Brand & Title Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#2087FE] to-[#6256D9] flex items-center justify-center text-white font-black text-xs shadow-xs">
                    R
                  </div>
                  <span className="font-extrabold text-slate-900 text-lg tracking-wider">
                    RAJTANTRA
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-0.5">
                  Election Intelligence &amp; Campaign Command Platform
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#493bbf] px-2.5 py-1 rounded bg-[#493bbf]/10 border border-[#493bbf]/20">
                SSO v5.0
              </span>
            </div>

            {/* Portal Selection Prompt */}
            <div className="mb-4">
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                SELECT WORKSTATION PORTAL
              </label>

              {/* 4 Clean Portal Option Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* Candidate */}
                <button
                  type="button"
                  onClick={() => selectPortal("candidate")}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer group ${
                    activePortal === "candidate"
                      ? "border-2 border-cyan-500 bg-cyan-50/80 text-cyan-900 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <BarChart3 className="w-4 h-4 text-cyan-600" />
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-cyan-100 text-cyan-800 font-bold">
                      /candidate
                    </span>
                  </div>
                  <div className="text-xs font-bold">Candidate</div>
                  <div className="text-[10px] text-slate-500">War Room</div>
                </button>

                {/* Super Admin */}
                <button
                  type="button"
                  onClick={() => selectPortal("superadmin")}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer group ${
                    activePortal === "superadmin"
                      ? "border-2 border-purple-500 bg-purple-50/80 text-purple-900 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Shield className="w-4 h-4 text-purple-700" />
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                      /super-admin
                    </span>
                  </div>
                  <div className="text-xs font-bold">Super Admin</div>
                  <div className="text-[10px] text-slate-500">Console</div>
                </button>

                {/* Distributor */}
                <button
                  type="button"
                  onClick={() => selectPortal("distributor")}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer group ${
                    activePortal === "distributor"
                      ? "border-2 border-blue-500 bg-blue-50/80 text-blue-900 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                      /distributor
                    </span>
                  </div>
                  <div className="text-xs font-bold">Distributor</div>
                  <div className="text-[10px] text-slate-500">Franchise</div>
                </button>

                {/* Karyakarta */}
                <button
                  type="button"
                  onClick={() => selectPortal("karyakarta")}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer group ${
                    activePortal === "karyakarta"
                      ? "border-2 border-emerald-500 bg-emerald-50/80 text-emerald-900 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      /karyakarta
                    </span>
                  </div>
                  <div className="text-xs font-bold">Karyakarta</div>
                  <div className="text-[10px] text-slate-500">Field Cadre</div>
                </button>
              </div>
            </div>

            {/* Role Header Badge */}
            <div className={`p-3 rounded-xl border mb-5 flex items-center justify-between transition-all ${portalMeta.badge}`}>
              <div className="flex items-center gap-2.5">
                <portalMeta.icon className="w-4 h-4 shrink-0" />
                <div>
                  <h3 className="text-xs font-bold leading-tight">{portalMeta.title}</h3>
                  <p className="text-[10px] opacity-80 leading-tight mt-0.5">{portalMeta.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
                <BadgeAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* THE FORM */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {activePortal === "karyakarta" ? (
                <>
                  {/* Karyakarta Field 1: Activation Key */}
                  <div>
                    <label
                      htmlFor="karyakartaKeyInput"
                      className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5"
                    >
                      6-CHARACTER ACTIVATION KEY <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
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
                        className="block w-full pl-10 pr-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono font-bold tracking-widest uppercase transition-colors"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      6-character key issued by candidate war room for booth volunteer access.
                    </p>
                  </div>

                  {/* Karyakarta Field 2: Mobile Number */}
                  <div>
                    <label
                      htmlFor="karyakartaPhoneInput"
                      className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5"
                    >
                      REGISTERED MOBILE NUMBER <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Users className="w-4 h-4" />
                      </div>
                      <input
                        id="karyakartaPhoneInput"
                        name="phone"
                        type="tel"
                        required
                        value={karyakartaPhone}
                        onChange={(e) => setKaryakartaPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43213"
                        className="block w-full pl-10 pr-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-mono"
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
                      className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5"
                    >
                      {activePortal === "superadmin"
                        ? "SUPER ADMIN USERNAME / EMAIL"
                        : activePortal === "distributor"
                        ? "DISTRIBUTOR EMAIL / FRANCHISE ID"
                        : "CANDIDATE EMAIL OR PHONE"}{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <FileCheck2 className="w-4 h-4" />
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
                            ? "superadmin@rajtantra.in"
                            : activePortal === "distributor"
                            ? "distributor@rajtantra.in"
                            : "candidate@rajtantra.in"
                        }
                        className="block w-full pl-10 pr-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#493bbf] focus:border-[#493bbf] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Field 2: Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="passwordInput"
                        className="block text-slate-700 text-xs font-bold uppercase tracking-wider"
                      >
                        SECURE PASSWORD <span className="text-rose-500">*</span>
                      </label>
                      <a
                        href="#forgot"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Password reset instructions have been dispatched to your registered security contact.");
                        }}
                        className="text-xs text-[#493bbf] font-semibold hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="passwordInput"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your confidential password"
                        className="block w-full pl-10 pr-10 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#493bbf] focus:border-[#493bbf] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Session Persistence & Secure TLS Info */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#493bbf] rounded border-slate-300 focus:ring-[#493bbf]"
                  />
                  <span className="ml-2 text-xs text-slate-600 font-medium">
                    Remember workstation session
                  </span>
                </label>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Secure TLS 1.3</span>
                </span>
              </div>

              {/* Primary Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r ${portalMeta.buttonBg} text-white font-bold text-xs tracking-wide shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>{portalMeta.submitLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Quick Demo Pill Helper */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Seed Demo Credentials:</span>
                </span>
                <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {portalMeta.demoHint}
                </span>
              </div>
            </form>
          </div>

          {/* Footer Inquiries & Helpline Support */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-slate-600">
              New franchise inquiry?{" "}
              <Link href="/distributor/register" className="text-[#493bbf] font-bold hover:underline">
                Apply for Regional Distribution Rights
              </Link>
            </p>
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-slate-400" />
              <span>Central Election Command Helpdesk:</span>
              <span className="font-mono font-bold text-slate-700">1800-INDIATA</span>
              <span className="text-slate-400">(Toll Free 24/7)</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

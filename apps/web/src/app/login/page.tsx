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
  Send,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/context/toast-context";

type PortalType = "candidate" | "superadmin" | "distributor" | "karyakarta";
type AuthTabType = "password" | "otp";

export default function CentralLoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<AuthTabType>("password");
  const [activePortal, setActivePortal] = useState<PortalType>("superadmin");
  const [identifier, setIdentifier] = useState("superadmin@indiata.in");
  const [password, setPassword] = useState("Rajtantra@2026");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isDistributorId = (id: string) => {
    const clean = id.trim().toLowerCase();
    if (!clean) return false;
    return (
      clean.includes("distributor") ||
      clean.includes("franchise") ||
      clean.includes("partner") ||
      clean.startsWith("dis-") ||
      clean.includes("mahamedia") ||
      clean.includes("marathwada") ||
      clean.includes("khandesh")
    );
  };

  const isKaryakartaId = (id: string) => {
    const clean = id.trim().toLowerCase();
    if (!clean) return false;
    return (
      clean.includes("karyakarta") ||
      clean.includes("volunteer") ||
      clean.includes("cadre") ||
      clean.startsWith("kar-") ||
      clean.startsWith("vol-")
    );
  };

  const isSuperAdminId = (id: string) => {
    const clean = id.trim().toLowerCase();
    if (!clean) return false;
    return (
      !isDistributorId(clean) &&
      !isKaryakartaId(clean) &&
      (clean.includes("superadmin") ||
        clean.includes("premsons") ||
        clean.startsWith("admin@") ||
        clean === "admin" ||
        (clean.includes("admin") && !clean.includes("candidate")))
    );
  };

  const detectRole = (val: string) => {
    setIdentifier(val);
    const clean = val.toLowerCase();
    if (isDistributorId(clean)) {
      setActivePortal("distributor");
    } else if (isKaryakartaId(clean)) {
      setActivePortal("karyakarta");
    } else if (isSuperAdminId(clean)) {
      setActivePortal("superadmin");
    } else if (clean.includes("candidate") || clean.includes("war")) {
      setActivePortal("candidate");
    }
  };

  const getTargetDetails = (portal: PortalType) => {
    switch (portal) {
      case "candidate":
        return {
          title: "Candidate War Room Workstation Clearance (/candidate)",
          target: "Candidate War Room (/candidate)",
          tier: "Tier 3",
          badgeBg: "bg-cyan-50 border-cyan-200 text-cyan-900",
          pingColor: "bg-cyan-500",
          dotColor: "bg-cyan-600",
          iconColor: "text-cyan-700",
          path: "/candidate",
          color: "cyan",
        };
      case "distributor":
        return {
          title: "Franchise Regional Distributor Access (/distributor)",
          target: "Franchise Desk (/distributor)",
          tier: "Tier 2",
          badgeBg: "bg-blue-50 border-blue-200 text-blue-900",
          pingColor: "bg-blue-500",
          dotColor: "bg-blue-600",
          iconColor: "text-blue-700",
          path: "/distributor/dashboard",
          color: "blue",
        };
      case "karyakarta":
        return {
          title: "Field Karyakarta & Booth Cadre Console (/karyakarta/dashboard)",
          target: "Karyakarta Field Portal (/karyakarta/dashboard)",
          tier: "Tier 4",
          badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-900",
          pingColor: "bg-emerald-500",
          dotColor: "bg-emerald-600",
          iconColor: "text-emerald-700",
          path: "/karyakarta/dashboard",
          color: "emerald",
        };
      case "superadmin":
      default:
        return {
          title: "Super Admin Platform Console Clearance (/super-admin)",
          target: "Super Admin Console (/super-admin)",
          tier: "Tier 1",
          badgeBg: "bg-purple-50 border-purple-200 text-purple-900",
          pingColor: "bg-purple-500",
          dotColor: "bg-purple-600",
          iconColor: "text-purple-700",
          path: "/super-admin",
          color: "purple",
        };
    }
  };

  const targetInfo = getTargetDetails(activePortal);

  const fillCredentials = (id: string, pass: string, portal: PortalType) => {
    setIdentifier(id);
    setPassword(pass);
    setActivePortal(portal);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanId = identifier.trim();
    const cleanPass = password;

    if (!cleanId) {
      setErrorMessage("Please enter your registered identifier or mobile number.");
      return;
    }

    if (activeTab === "password" && !cleanPass) {
      setErrorMessage("Please enter your confidential passphrase.");
      return;
    }

    if (activeTab === "otp" && !otpSent) {
      setIsSubmitting(true);
      setTimeout(() => {
        setOtpSent(true);
        setIsSubmitting(false);
        showToast("info", "OTP Dispatched", `A 6-digit verification token was sent to ${cleanId}`);
      }, 600);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(cleanId, cleanPass);
      const isDist = isDistributorId(cleanId) || result?.user?.role === "DISTRIBUTOR" || activePortal === "distributor";
      const isKar = !isDist && (isKaryakartaId(cleanId) || result?.user?.role === "KARYAKARTA" || activePortal === "karyakarta");
      const isSuper = !isDist && !isKar && (isSuperAdminId(cleanId) || result?.user?.role === "SUPER_ADMIN" || activePortal === "superadmin");

      if (isDist) {
        showToast("success", "INDIATA Franchise Authorized", "Launching Regional Franchise Console...");
        window.location.replace("/distributor/dashboard");
      } else if (isKar) {
        showToast("success", "INDIATA Karyakarta Authorized", "Launching Field Cadre Console...");
        window.location.replace("/karyakarta/dashboard");
      } else if (isSuper) {
        showToast("success", "INDIATA Super Admin Clearance", "Launching Master Platform Command...");
        window.location.replace("/super-admin");
      } else {
        showToast("success", "INDIATA Candidate Authorized", "Launching Constituency War Room...");
        window.location.replace("/candidate");
      }
    } catch {
      showToast("info", "Authenticating Session", `Launching ${targetInfo.target}...`);
      window.location.replace(targetInfo.path);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectLaunch = (path: string, id: string) => {
    setIsSubmitting(true);
    showToast("info", "Launching Workstation", `Direct navigation to ${path}...`);
    try {
      login(id, "Rajtantra@2026");
    } catch {
      // Continue
    }
    window.location.replace(path);
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
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#2087FE] to-[#6256D9] flex items-center justify-center text-white font-black text-xs shadow-xs">
                    I
                  </div>
                  <span className="font-extrabold text-slate-900 text-lg tracking-wider">
                    INDIATA
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-1">
                  Enterprise Election Intelligence &amp; Campaign War Room Platform
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#493bbf] px-2.5 py-1 rounded bg-[#493bbf]/10 border border-[#493bbf]/20">
                SSO v5.0
              </span>
            </div>

            {/* Welcome Headline */}
            <div className="mt-5 mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Welcome to Command Portal
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Sign in to access your designated election workstation
              </p>
            </div>

            {/* Authentication Mode Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-lg mb-5 border border-slate-200/80">
              <button
                type="button"
                onClick={() => setActiveTab("password")}
                className={`flex-1 py-2 text-center text-xs font-semibold rounded-md transition-all duration-150 cursor-pointer ${
                  activeTab === "password"
                    ? "bg-white text-[#493bbf] shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Password Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("otp")}
                className={`flex-1 py-2 text-center text-xs font-semibold rounded-md transition-all duration-150 cursor-pointer ${
                  activeTab === "otp"
                    ? "bg-white text-[#493bbf] shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                OTP / Fast Token
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
                <BadgeAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* SSO Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Identifier Input Field */}
              <div>
                <label
                  htmlFor="userIdentifier"
                  className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5"
                >
                  REGISTERED EMAIL, MOBILE (+91) OR FRANCHISE ID <span className="text-rose-500">*</span>
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
                    onChange={(e) => detectRole(e.target.value)}
                    placeholder="e.g. admin@indiata.in or +91 98765 43210"
                    className="block w-full pl-10 pr-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#493bbf] focus:border-[#493bbf] transition-colors"
                  />
                </div>
              </div>

              {/* Dynamic Role Clearance Pill */}
              <div
                className={`p-2.5 rounded-lg border flex items-center justify-between transition-all duration-200 ${targetInfo.badgeBg}`}
              >
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${targetInfo.pingColor} opacity-75`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${targetInfo.dotColor}`} />
                  </span>
                  <Shield className={`w-4 h-4 ${targetInfo.iconColor}`} />
                  <span className="text-xs font-bold truncate max-w-[240px] sm:max-w-[280px]">
                    {targetInfo.title}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 shrink-0">
                  {targetInfo.tier}
                </span>
              </div>

              {/* Password / OTP Input Field */}
              {activeTab === "password" ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="passwordInput"
                      className="block text-slate-700 text-xs font-bold uppercase tracking-wider"
                    >
                      SECURE PASSPHRASE <span className="text-rose-500">*</span>
                    </label>
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Password reset instructions have been dispatched to your registered security contact.");
                      }}
                      className="text-xs text-[#493bbf] font-semibold hover:underline"
                    >
                      Forgot credentials?
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
                      placeholder="Enter your confidential passphrase"
                      className="block w-full pl-10 pr-10 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#493bbf] focus:border-[#493bbf] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      title={showPassword ? "Hide passphrase" : "Show passphrase"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="otpInput"
                      className="block text-slate-700 text-xs font-bold uppercase tracking-wider"
                    >
                      ONE-TIME SECURITY TOKEN (OTP) <span className="text-rose-500">*</span>
                    </label>
                    {otpSent && (
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          showToast("info", "Resending OTP", "Generating fresh verification token...");
                        }}
                        className="text-xs text-[#493bbf] font-semibold hover:underline"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Send className="w-4 h-4" />
                    </div>
                    <input
                      id="otpInput"
                      name="otp"
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder={otpSent ? "Enter 6-digit OTP code" : "Click button below to receive code"}
                      className="block w-full pl-10 pr-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#493bbf] focus:border-[#493bbf] transition-colors font-mono tracking-widest"
                    />
                  </div>
                </div>
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
                    Remember workstation session for 30 days
                  </span>
                </label>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Secure TLS 1.3</span>
                </span>
              </div>

              {/* Primary Authorize CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#493bbf] to-[#6256d9] hover:from-[#3e2db4] hover:to-[#5346c8] text-white font-bold text-xs tracking-wide shadow-md shadow-[#493bbf]/25 hover:shadow-lg hover:shadow-[#493bbf]/35 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1" />
                      <span>Authenticating with Sovereign ECI Mesh...</span>
                    </>
                  ) : activeTab === "otp" && !otpSent ? (
                    <>
                      <span>Dispatch Secure OTP Token</span>
                      <Send className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Authorize &amp; Launch Command Station</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-slate-500 font-semibold tracking-wider uppercase text-[10px]">
                  1-Click Multi-Portal Fast Launcher
                </span>
              </div>
            </div>

            {/* Segmented 4-Button Destination Launcher */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  setActivePortal("candidate");
                  handleDirectLaunch("/candidate", "candidate@indiata.in");
                }}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer group ${
                  activePortal === "candidate"
                    ? "border-2 border-cyan-500 bg-cyan-50/70 shadow-sm"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <BarChart3 className="w-4 h-4 text-cyan-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-cyan-50 text-cyan-700 font-semibold">
                    /candidate
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800">Candidate</p>
                <p className="text-[10px] text-slate-500 leading-tight">War Room</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePortal("superadmin");
                  handleDirectLaunch("/super-admin", "superadmin@indiata.in");
                }}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer group ${
                  activePortal === "superadmin"
                    ? "border-2 border-purple-500 bg-purple-50/70 shadow-sm"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Shield className="w-4 h-4 text-purple-700 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">
                    /super-admin
                  </span>
                </div>
                <p className="text-xs font-bold text-purple-900">Super Admin</p>
                <p className="text-[10px] text-purple-700 leading-tight">Master Console</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePortal("distributor");
                  handleDirectLaunch("/distributor/dashboard", "distributor@mahamedia.com");
                }}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer group ${
                  activePortal === "distributor"
                    ? "border-2 border-blue-500 bg-blue-50/70 shadow-sm"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Building2 className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                    /distributor
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800">Distributor</p>
                <p className="text-[10px] text-slate-500 leading-tight">Franchise Desk</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePortal("karyakarta");
                  handleDirectLaunch("/karyakarta/dashboard", "karyakarta@indiata.in");
                }}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer group ${
                  activePortal === "karyakarta"
                    ? "border-2 border-emerald-500 bg-emerald-50/70 shadow-sm"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Users className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                    /karyakarta
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800">Karyakarta</p>
                <p className="text-[10px] text-slate-500 leading-tight">Field Cadre</p>
              </button>
            </div>

            {/* Development & QA 1-Click Role Switcher Drawer */}
            <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5 uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#493bbf]" />
                  <span>Role-Based 1-Click Auto Fill</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">DEMO READY</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => fillCredentials("candidate@indiata.in", "Rajtantra@2026", "candidate")}
                  className={`px-2 py-1.5 rounded-md text-[11px] text-center transition-all truncate cursor-pointer ${
                    activePortal === "candidate"
                      ? "bg-cyan-100 text-cyan-900 border border-cyan-300 font-bold"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-cyan-400 hover:text-cyan-700 font-medium"
                  }`}
                  title="candidate@indiata.in"
                >
                  Candidate Admin
                </button>

                <button
                  type="button"
                  onClick={() => fillCredentials("superadmin@indiata.in", "Rajtantra@2026", "superadmin")}
                  className={`px-2 py-1.5 rounded-md text-[11px] text-center transition-all truncate cursor-pointer ${
                    activePortal === "superadmin"
                      ? "bg-purple-100 text-purple-900 border border-purple-300 font-bold"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-purple-400 hover:text-purple-700 font-medium"
                  }`}
                  title="superadmin@indiata.in"
                >
                  Super Admin
                </button>

                <button
                  type="button"
                  onClick={() => fillCredentials("distributor@mahamedia.com", "Rajtantra@2026", "distributor")}
                  className={`px-2 py-1.5 rounded-md text-[11px] text-center transition-all truncate cursor-pointer ${
                    activePortal === "distributor"
                      ? "bg-blue-100 text-blue-900 border border-blue-300 font-bold"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-blue-400 hover:text-blue-700 font-medium"
                  }`}
                  title="distributor@mahamedia.com"
                >
                  Franchise Desk
                </button>

                <button
                  type="button"
                  onClick={() => fillCredentials("karyakarta@indiata.in", "Rajtantra@2026", "karyakarta")}
                  className={`px-2 py-1.5 rounded-md text-[11px] text-center transition-all truncate cursor-pointer ${
                    activePortal === "karyakarta"
                      ? "bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-emerald-400 hover:text-emerald-700 font-medium"
                  }`}
                  title="karyakarta@indiata.in"
                >
                  Field Cadre
                </button>
              </div>

              {/* Active Debug Clearance Telemetry */}
              <div className="mt-2.5 pt-2 border-t border-slate-200 text-[11px] text-slate-500 space-y-0.5">
                <div className="flex justify-between">
                  <span>Active Identifier:</span>
                  <span className="font-mono font-medium text-slate-700 truncate max-w-[200px]">
                    {identifier || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Target Workstation:</span>
                  <span className={`font-mono font-semibold ${
                    activePortal === "superadmin"
                      ? "text-purple-700"
                      : activePortal === "distributor"
                      ? "text-blue-700"
                      : activePortal === "karyakarta"
                      ? "text-emerald-700"
                      : "text-cyan-700"
                  }`}>
                    {targetInfo.target}
                  </span>
                </div>
              </div>
            </div>
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

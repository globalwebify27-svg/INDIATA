"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserCheck,
  Smartphone,
  Printer,
  Globe,
  ShieldCheck,
  LogOut,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useKaryakartaAuth } from "../../../karyakarta/context/karyakarta-auth-context";
import { useKaryakartaLanguage } from "../../../karyakarta/context/karyakarta-language-context";
import { LanguageType } from "../../../karyakarta/types/karyakarta.types";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, setMockAccount } = useKaryakartaAuth();
  const { language, setLanguage, t } = useKaryakartaLanguage();

  const [paperWidth, setPaperWidth] = useState<"80mm" | "58mm">("80mm");
  const [autoCut, setAutoCut] = useState(true);
  const [slipLanguage, setSlipLanguage] = useState<"BILINGUAL" | "MARATHI_ONLY">("BILINGUAL");
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast("Workstation & printer preferences saved successfully!");
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleTestPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Toast */}
      {saveToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">{saveToast}</p>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400">
              Field Cadre Credentials
            </span>
            <span className="text-xs text-slate-500 font-medium">
              INDIATA Platform Build 5.0.4-LOKSABHA
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-[#2087fe]" />
            {t("profile.title", "Karyakarta Profile & Field Workstation")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your hardware binding, Bluetooth thermal printer preferences, language locale, and campaign sector authorizations.
          </p>
        </div>

        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl transition-colors border border-rose-200 dark:border-rose-900"
        >
          <LogOut className="w-4 h-4" />
          Sign Out of Field Console
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile & Authorizations */}
        <div className="space-y-6 lg:col-span-1">
          {/* Identity Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#2087fe] to-[#6256d9] text-white text-2xl font-black flex items-center justify-center mx-auto mb-3 shadow-md">
              {user?.name?.charAt(0) || "S"}
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {user?.name || "Sachin D. Mane"}
            </h2>
            <div className="text-xs font-mono font-bold text-[#2087fe] mt-0.5">
              ID: {user?.id || "KAR-2026-001"}
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <CheckCircle2 className="w-3 h-3" />
              Status: {user?.status || "ACTIVE"}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-left space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Candidate:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {user?.candidateName || "Anand Shinde"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Constituency:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {user?.constituencyName || "215 - Kasba Peth Assembly"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Sector:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {user?.assignedArea || "Shaniwar Peth & Raviwar Peth"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Allocated Booths:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user?.assignedBooths?.map((b) => (
                    <span
                      key={b}
                      className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    >
                      Booth {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Persona Switcher for Evaluation */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Demo Persona Switcher
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Switch role states to evaluate approval gates:
            </p>
            <div className="space-y-1.5 pt-1">
              <button
                type="button"
                onClick={() => setMockAccount("ACTIVE")}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 flex items-center justify-between"
              >
                <span>Active Karyakarta</span>
                <span className="text-[10px] text-emerald-600 font-bold">Active</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMockAccount("PENDING_APPROVAL");
                  router.push("/karyakarta/pending-approval");
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500 flex items-center justify-between"
              >
                <span>Pending Approval Gate</span>
                <span className="text-[10px] text-amber-600 font-bold">Pending</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMockAccount("SUSPENDED");
                  router.push("/karyakarta/blocked");
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-500 flex items-center justify-between"
              >
                <span>Suspended / Blocked Gate</span>
                <span className="text-[10px] text-rose-600 font-bold">Blocked</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Columns: Hardware Binding, Printer & Language Preferences */}
        <div className="space-y-6 lg:col-span-2">
          {/* Language Preference */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Globe className="w-5 h-5 text-[#2087fe]" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Application Language (भाषा प्राधान्य)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select your interface language for field operation screens and forms
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { code: "en", label: "English", sub: "Default System" },
                { code: "mr", label: "मराठी (Marathi)", sub: "स्थानिक भाषा" },
                { code: "hi", label: "हिंदी (Hindi)", sub: "राजभाषा" },
              ].map((lang) => {
                const active = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code as LanguageType)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      active
                        ? "bg-blue-50 dark:bg-blue-950/60 border-[#2087fe] shadow-xs"
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {lang.label}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {lang.sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bluetooth Thermal Printer Configuration */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Portable Bluetooth Thermal Printer Configuration
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pairing and layout settings for on-the-spot voter slip printing
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleTestPrint}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              >
                Send Test Print Slip
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Paper Width Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Thermal Paper Width:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaperWidth("80mm")}
                    className={`p-3 rounded-xl border text-left ${
                      paperWidth === "80mm"
                        ? "bg-emerald-50/70 border-emerald-500 text-emerald-950 font-bold"
                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    80mm (Standard Field Width - 3 Inch)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaperWidth("58mm")}
                    className={`p-3 rounded-xl border text-left ${
                      paperWidth === "58mm"
                        ? "bg-emerald-50/70 border-emerald-500 text-emerald-950 font-bold"
                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    58mm (Pocket Compact - 2 Inch)
                  </button>
                </div>
              </div>

              {/* Slip Language Layout */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Slip Elector Name Format:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSlipLanguage("BILINGUAL")}
                    className={`p-3 rounded-xl border text-left ${
                      slipLanguage === "BILINGUAL"
                        ? "bg-emerald-50/70 border-emerald-500 text-emerald-950 font-bold"
                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    Bilingual (English + मराठी)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSlipLanguage("MARATHI_ONLY")}
                    className={`p-3 rounded-xl border text-left ${
                      slipLanguage === "MARATHI_ONLY"
                        ? "bg-emerald-50/70 border-emerald-500 text-emerald-950 font-bold"
                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    मराठी Only (Devanagari Priority)
                  </button>
                </div>
              </div>

              {/* Auto Cut Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Automatic Paper Cut Command
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Sends ESC/POS auto-cut sequence after each completed voter slip
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoCut}
                  onChange={(e) => setAutoCut(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </div>
            </div>
          </div>

          {/* Device Telemetry & Hardware Binding (M11) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Smartphone className="w-5 h-5 text-[#2087fe]" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Device Hardware Binding & Telemetry (M11)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cryptographic workstation binding and field geofence telemetry
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Hardware Device UUID:
                </span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {user?.deviceUuid || "dev-pixel-7a-karyakarta-01"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Security Protocol:
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  STQC Sovereign Verified
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Candidate War Room Sync:
                </span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-0.5">
                  <RefreshCw className="w-3 h-3" />
                  Live Sync (Online)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Active Geofence:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Kasba Peth Constituency Zone 4
                </span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#2087fe] hover:bg-blue-600 shadow-md transition-transform active:scale-95"
            >
              Save Preferences & Sync
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

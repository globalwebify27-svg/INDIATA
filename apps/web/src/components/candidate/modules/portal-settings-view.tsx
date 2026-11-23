"use client";

import React, { useState } from "react";
import {
  User,
  Building2,
  Contact,
  MapPin,
  Palette,
  Globe,
  Bell,
  Megaphone,
  Sparkles,
  Printer,
  Smartphone,
  Save,
  QrCode,
} from "lucide-react";
import { useToast, ToastType } from "@/context/toast-context";
import { ChangePasswordCard } from "@/components/auth/change-password-card";

interface SettingsState {
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  role: string;
  partyName: string;
  partyShortCode: string;
  electionSymbol: string;
  headquarters: string;
  candidateFormalName: string;
  qualification: string;
  criminalCasesDeclared: string;
  constituency: string;
  state: string;
  boothCount: number;
  portalBrandColor: string;
  themeMode: string;
  selectedLanguage: string;
  enableWhatsAppAlerts: boolean;
  enableTurnoutCriticalAlerts: boolean;
  defaultSmsSenderId: string;
  defaultVoiceLanguage: string;
  aiModelCreativity: string;
  autoDetectSwingBooths: boolean;
  slipHeaderLine1: string;
  slipCandidateName: string;
  slipShowQrCode: boolean;
  karyakartaGpsInterval: string;
  requirePhotoAtVoterHouse: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  adminName: "Adv. Vikram Patil",
  adminEmail: "vikram.patil@indata-election.in",
  adminPhone: "+91 98220 99000",
  role: "Candidate Admin",
  partyName: "Rashtriya Vikas Morcha",
  partyShortCode: "RVM",
  electionSymbol: "Sun & Wheel",
  headquarters: "Shivaji Nagar, Pune 411005",
  candidateFormalName: "Adv. Vikram Shankarrao Patil",
  qualification: "B.Com, LL.B (Pune University)",
  criminalCasesDeclared: "None (Nil Form 26 Affidavit)",
  constituency: "34 - Pune Parliamentary Constituency",
  state: "Maharashtra",
  boothCount: 2045,
  portalBrandColor: "#254deb",
  themeMode: "Light Modern",
  selectedLanguage: "English",
  enableWhatsAppAlerts: true,
  enableTurnoutCriticalAlerts: true,
  defaultSmsSenderId: "INDATA",
  defaultVoiceLanguage: "Marathi",
  aiModelCreativity: "Balanced (Recommended)",
  autoDetectSwingBooths: true,
  slipHeaderLine1: "LOK SABHA GENERAL ELECTIONS 2024",
  slipCandidateName: "Adv. Vikram Patil",
  slipShowQrCode: true,
  karyakartaGpsInterval: "30 seconds",
  requirePhotoAtVoterHouse: true,
};

export function PortalSettingsView() {
  const { showToast } = useToast();

  const notify = (title: string, type: ToastType = "info") => {
    showToast(type, title);
  };

  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  const updateField = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setHasChanges(false);
    notify("Portal configuration and campaign settings saved successfully.", "success");
  };

  const handleDiscard = () => {
    setFormData(DEFAULT_SETTINGS);
    setHasChanges(false);
    notify("Changes discarded.", "info");
  };

  const navTabs = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "party", label: "Organization & Party", icon: Building2 },
    { id: "candidate", label: "Candidate Details", icon: Contact },
    { id: "constituency", label: "Constituency & Geometry", icon: MapPin },
    { id: "branding", label: "Branding & Theme", icon: Palette },
    { id: "language", label: "Language (भाषा)", icon: Globe },
    { id: "notifications", label: "Alerts & Notifications", icon: Bell },
    { id: "campaign", label: "Campaign Defaults", icon: Megaphone },
    { id: "ai", label: "AI Intelligence Preferences", icon: Sparkles },
    { id: "voterSlip", label: "Voter-Slip Layout Designer", icon: Printer },
    { id: "karyakartaApp", label: "Karyakarta App Settings", icon: Smartphone },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              System Configuration
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Admin Governance
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Profile &amp; Party Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage election credentials, voter-slip thermal layouts, regional languages, and karyakarta app policies.
          </p>
        </div>

        {hasChanges && (
          <div className="flex items-center gap-2 animate-fade-in">
            <button
              type="button"
              onClick={handleDiscard}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-colors"
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Sidebar Tabs + Settings Form Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Vertical Navigation Menu */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 shadow-xs space-y-1 h-fit">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Form Stage */}
        <div className="md:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <form onSubmit={handleSave} className="space-y-6 text-xs">
            {/* TAB: My Profile */}
            {activeTab === "profile" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Administrator Profile &amp; Credentials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Administrator Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.adminName}
                      onChange={(e) => updateField("adminName", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Registered Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => updateField("adminEmail", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Contact (SMS / WhatsApp)
                    </label>
                    <input
                      type="tel"
                      value={formData.adminPhone}
                      onChange={(e) => updateField("adminPhone", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Assigned Security Role
                    </label>
                    <input
                      type="text"
                      disabled
                      value={formData.role}
                      className="w-full p-2.5 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 font-semibold cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <ChangePasswordCard />
                </div>
              </div>
            )}

            {/* TAB: Organization & Party */}
            {activeTab === "party" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Political Party &amp; Organization Attributes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Party / Organization Name
                    </label>
                    <input
                      type="text"
                      value={formData.partyName}
                      onChange={(e) => updateField("partyName", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Abbreviation / Short Code
                    </label>
                    <input
                      type="text"
                      value={formData.partyShortCode}
                      onChange={(e) => updateField("partyShortCode", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      ECI Allotted Election Symbol
                    </label>
                    <input
                      type="text"
                      value={formData.electionSymbol}
                      onChange={(e) => updateField("electionSymbol", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Central Party Office Headquarters
                    </label>
                    <input
                      type="text"
                      value={formData.headquarters}
                      onChange={(e) => updateField("headquarters", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Candidate Details */}
            {activeTab === "candidate" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Official Candidate Nomination Record
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Candidate Legal Name
                    </label>
                    <input
                      type="text"
                      value={formData.candidateFormalName}
                      onChange={(e) => updateField("candidateFormalName", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Educational Qualification
                    </label>
                    <input
                      type="text"
                      value={formData.qualification}
                      onChange={(e) => updateField("qualification", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Criminal Cases Declaration (Form 26)
                    </label>
                    <input
                      type="text"
                      value={formData.criminalCasesDeclared}
                      onChange={(e) => updateField("criminalCasesDeclared", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Constituency & Geometry */}
            {activeTab === "constituency" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Constituency Boundaries &amp; Geography
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Parliamentary Constituency
                    </label>
                    <input
                      type="text"
                      value={formData.constituency}
                      onChange={(e) => updateField("constituency", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      State / UT
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Total Polling Booths
                    </label>
                    <input
                      type="number"
                      value={formData.boothCount}
                      onChange={(e) => updateField("boothCount", parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Language */}
            {activeTab === "language" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Portal Interface &amp; Messaging Language
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { code: "English", label: "English (Default)", note: "Candidate Admin & War Room" },
                    { code: "Marathi", label: "मराठी (Marathi)", note: "Karyakarta field app & voter slips" },
                    { code: "Hindi", label: "हिन्दी (Hindi)", note: "Outbound campaign messaging" },
                  ].map((lang) => (
                    <div
                      key={lang.code}
                      onClick={() => updateField("selectedLanguage", lang.code)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.selectedLanguage === lang.code
                          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="font-bold text-slate-900 dark:text-white block text-sm">
                        {lang.label}
                      </span>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">
                        {lang.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Voter Slip Layout */}
            {activeTab === "voterSlip" && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Voter Information Slip Layout Customizer
                  </h3>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-[11px]">
                    Live 58mm / A6 Preview
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Slip Main Header Line
                      </label>
                      <input
                        type="text"
                        value={formData.slipHeaderLine1}
                        onChange={(e) => updateField("slipHeaderLine1", e.target.value)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Candidate Banner Attribution
                      </label>
                      <input
                        type="text"
                        value={formData.slipCandidateName}
                        onChange={(e) => updateField("slipCandidateName", e.target.value)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                    </div>
                    <label className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.slipShowQrCode}
                        onChange={(e) => updateField("slipShowQrCode", e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Print Google Maps Polling Station QR Code on Slip
                      </span>
                    </label>
                  </div>

                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between">
                    <div>
                      <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-2">
                        <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 block">
                          {formData.slipHeaderLine1}
                        </span>
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                          Candidate: {formData.slipCandidateName} ({formData.partyShortCode})
                        </span>
                      </div>
                      <div className="py-3 text-[11px] space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Voter:</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            Sunita Ramesh Deshmukh
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Booth:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            Booth #101 • Sr #42
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">EPIC ID:</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            MH34089211
                          </span>
                        </div>
                      </div>
                    </div>

                    {formData.slipShowQrCode && (
                      <div className="flex items-center justify-center gap-2 border-t border-slate-200 dark:border-slate-700 pt-2 text-[10px] text-slate-500 dark:text-slate-400">
                        <QrCode className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                        <span>Scan for Polling Station Navigation</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Karyakarta App Settings */}
            {activeTab === "karyakartaApp" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Mobile Field App Policies &amp; Synchronization
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      GPS Telemetry Heartbeat
                    </label>
                    <select
                      value={formData.karyakartaGpsInterval}
                      onChange={(e) => updateField("karyakartaGpsInterval", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="30 seconds">Every 30 seconds</option>
                      <option value="60 seconds">Every 60 seconds</option>
                      <option value="5 minutes">Every 5 minutes (Battery Saver)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Survey Doorstep Photo Verification
                    </label>
                    <select
                      value={formData.requirePhotoAtVoterHouse ? "Mandatory" : "Optional"}
                      onChange={(e) => updateField("requirePhotoAtVoterHouse", e.target.value === "Mandatory")}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Mandatory">Mandatory Doorstep Photo</option>
                      <option value="Optional">Optional (Faster survey speed)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Branding & Theme */}
            {activeTab === "branding" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Branding &amp; Theme Customization
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Portal Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.portalBrandColor}
                        onChange={(e) => updateField("portalBrandColor", e.target.value)}
                        className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-800"
                      />
                      <input
                        type="text"
                        value={formData.portalBrandColor}
                        onChange={(e) => updateField("portalBrandColor", e.target.value)}
                        className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Interface Theme Mode
                    </label>
                    <select
                      value={formData.themeMode}
                      onChange={(e) => updateField("themeMode", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Light Modern</option>
                      <option>Dark Obsidian</option>
                      <option>System Default</option>
                    </select>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Status: All branding tokens loaded &amp; synchronized
                  </span>
                  <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                    Active
                  </span>
                </div>
              </div>
            )}

            {/* TAB: Alerts & Notifications */}
            {activeTab === "notifications" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Alerts &amp; Real-Time Dispatch Triggers
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        WhatsApp Real-Time Emergency Alerts
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Notify candidate and core managers for critical booth turnout shifts.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.enableWhatsAppAlerts}
                      onChange={(e) => updateField("enableWhatsAppAlerts", e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        Hourly Turnout Target Alerts
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Broadcast push telemetry reminders to prabhaag in-charges on polling day.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.enableTurnoutCriticalAlerts}
                      onChange={(e) => updateField("enableTurnoutCriticalAlerts", e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* TAB: Campaign Defaults */}
            {activeTab === "campaign" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Campaign Communication Channels &amp; DLT Headers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      TRAI Registered SMS Header (Sender ID)
                    </label>
                    <input
                      type="text"
                      value={formData.defaultSmsSenderId}
                      onChange={(e) => updateField("defaultSmsSenderId", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Default AI Voice Call Dialect
                    </label>
                    <select
                      value={formData.defaultVoiceLanguage}
                      onChange={(e) => updateField("defaultVoiceLanguage", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Marathi</option>
                      <option>Hindi</option>
                      <option>English</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: AI Intelligence Preferences */}
            {activeTab === "ai" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  AI Intelligence &amp; Autonomous Strategy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      AI Analytical Posture
                    </label>
                    <select
                      value={formData.aiModelCreativity}
                      onChange={(e) => updateField("aiModelCreativity", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Balanced (Recommended)</option>
                      <option>Conservative ECI Historical Grounding</option>
                      <option>Aggressive Swing Outreach</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Swing Booth Auto-Flagging
                    </label>
                    <select
                      value={formData.autoDetectSwingBooths ? "Active" : "Disabled"}
                      onChange={(e) => updateField("autoDetectSwingBooths", e.target.value === "Active")}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Active">Active (Real-time telemetry delta &gt; 3%)</option>
                      <option value="Disabled">Disabled</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleDiscard}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition"
              >
                Reset Defaults
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PortalSettingsView;

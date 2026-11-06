"use client";

import React, { useState } from "react";
import {
  Building,
  User,
  Shield,
  Save,
  Palette,
  Languages,
  FileText,
  Smartphone,
  Bell,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/context/toast-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PortalSettingsView() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeSection, setActiveSection] = useState<
    "candidate" | "organization" | "constituency" | "branding" | "language" | "voterSlip" | "app" | "notifications"
  >("candidate");

  // State fields
  const [candidateName, setCandidateName] = useState(user?.name || "Adv. Vikram Patil");
  const [candidatePhone, setCandidatePhone] = useState("+91 98220 12345");
  const [partyName, setPartyName] = useState("National Democratic Alliance (NDA)");
  const [partySymbol, setPartySymbol] = useState("Bow & Arrow (Dhanushyaban)");
  const [constituencyName, setConstituencyName] = useState(user?.constituencyName || "215 - Kasba Peth");
  const [slogan, setSlogan] = useState("विकास, विश्वास आणि प्रगती - आपल्या हक्काचा आमदार!");
  const [selectedLanguage, setSelectedLanguage] = useState<"mr" | "en" | "hi">("mr");

  // Voter Slip Layout Sliders
  const [slipMargin, setSlipMargin] = useState(8);
  const [slipFontSize, setSlipFontSize] = useState(100);
  const [showSlipPhoto, setShowSlipPhoto] = useState(true);
  const [showSlipQrCode, setShowSlipQrCode] = useState(true);

  // App Settings
  const [appWelcomeMsg, setAppWelcomeMsg] = useState("स्वागत आहे! आपल्या प्रभागातील प्रत्येक मतदारापर्यंत पोहोचा.");

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast(
        "success",
        "Settings Saved Successfully",
        "Constituency parameters, slip alignment, and candidate profile updated."
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
              Module 17: Candidate System Configuration
            </span>
            <Badge variant="teal">Tenant Isolated</Badge>
            <Badge variant="neutral">AC-215 Kasba Peth</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            Profile &amp; Party Settings Workspace
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Configure candidate credentials, party branding, voter slip layout alignment, and Karyakarta field app customization.
          </p>
        </div>
      </section>

      {/* Main Settings Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Settings Navigation Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 shadow-premium-xs space-y-1 h-fit">
          <button
            type="button"
            onClick={() => setActiveSection("candidate")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
              activeSection === "candidate"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>My Candidate Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("organization")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
              activeSection === "organization"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Building className="w-4 h-4 shrink-0" />
            <span>Party &amp; Organization</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("constituency")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
              activeSection === "constituency"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span>Constituency Boundaries</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("branding")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
              activeSection === "branding"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Palette className="w-4 h-4 shrink-0" />
            <span>Logo &amp; Campaign Slogan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("language")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
              activeSection === "language"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Languages className="w-4 h-4 shrink-0" />
            <span>Language &amp; Localization</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("voterSlip")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
              activeSection === "voterSlip"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Voter Slip Layout Spacing</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("app")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
              activeSection === "app"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Smartphone className="w-4 h-4 shrink-0" />
            <span>Karyakarta Mobile App</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("notifications")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
              activeSection === "notifications"
                ? "bg-brand-600 text-white shadow-premium-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Bell className="w-4 h-4 shrink-0" />
            <span>Notifications &amp; Alerts</span>
          </button>
        </div>

        {/* Settings Form Body */}
        <div className="md:col-span-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-premium-xs">
          <form onSubmit={handleSave} className="space-y-5 text-xs">
            {activeSection === "candidate" && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Candidate Personal Credentials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Candidate Official Name *</label>
                    <input
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Direct Helpline / Mobile *</label>
                    <input
                      type="tel"
                      value={candidatePhone}
                      onChange={(e) => setCandidatePhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "organization" && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Party &amp; Political Affiliation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Party / Front Name</label>
                    <input
                      type="text"
                      value={partyName}
                      onChange={(e) => setPartyName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Allocated Election Symbol</label>
                    <input
                      type="text"
                      value={partySymbol}
                      onChange={(e) => setPartySymbol(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "constituency" && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Constituency Geography Boundaries
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Assembly Constituency</label>
                    <input
                      type="text"
                      value={constituencyName}
                      onChange={(e) => setConstituencyName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Parliamentary PC</span>
                    <span className="font-bold text-sm text-slate-800 dark:text-white">34 - Pune PC</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Mapped Polling Booths</span>
                    <span className="font-bold text-sm text-slate-800 dark:text-white">264 Booth Stations</span>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "branding" && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Campaign Slogan &amp; Theme Colors
                </h3>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Campaign Slogan (Devnagari / Marathi)</label>
                  <input
                    type="text"
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                </div>
              </div>
            )}

            {activeSection === "language" && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Default Language &amp; Localization
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedLanguage("mr")}
                    className={`p-3 rounded-xl border text-center font-bold cursor-pointer ${
                      selectedLanguage === "mr" ? "border-brand-600 bg-brand-50 text-brand-600" : "border-slate-200"
                    }`}
                  >
                    मराठी (Default)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedLanguage("en")}
                    className={`p-3 rounded-xl border text-center font-bold cursor-pointer ${
                      selectedLanguage === "en" ? "border-brand-600 bg-brand-50 text-brand-600" : "border-slate-200"
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedLanguage("hi")}
                    className={`p-3 rounded-xl border text-center font-bold cursor-pointer ${
                      selectedLanguage === "hi" ? "border-brand-600 bg-brand-50 text-brand-600" : "border-slate-200"
                    }`}
                  >
                    हिन्दी
                  </button>
                </div>
              </div>
            )}

            {activeSection === "voterSlip" && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                    Voter Slip Layout Spacing &amp; Alignment
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Fine-tune print margins and alignment without redesigning the core approved voter slip structure.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>Card Outer Margin ({slipMargin}px)</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="16"
                        value={slipMargin}
                        onChange={(e) => setSlipMargin(Number(e.target.value))}
                        className="w-full accent-brand-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>Typography Scale ({slipFontSize}%)</span>
                      </div>
                      <input
                        type="range"
                        min="90"
                        max="115"
                        value={slipFontSize}
                        onChange={(e) => setSlipFontSize(Number(e.target.value))}
                        className="w-full accent-brand-600"
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer font-semibold">
                        <input
                          type="checkbox"
                          checked={showSlipPhoto}
                          onChange={(e) => setShowSlipPhoto(e.target.checked)}
                          className="rounded text-brand-600"
                        />
                        <span>Include Candidate Campaign Portrait on Slip Header</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer font-semibold">
                        <input
                          type="checkbox"
                          checked={showSlipQrCode}
                          onChange={(e) => setShowSlipQrCode(e.target.checked)}
                          className="rounded text-brand-600"
                        />
                        <span>Include Google Maps Navigation QR Code to Polling Station</span>
                      </label>
                    </div>
                  </div>

                  {/* Live Mini Preview Box */}
                  <div
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/40 text-[11px]"
                    style={{ padding: `${slipMargin * 1.5}px`, fontSize: `${slipFontSize}%` }}
                  >
                    <div className="font-bold text-center border-b pb-1 text-brand-600">
                      विधानसभा सार्वत्रिक निवडणूक २०२४
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between font-mono"><span>EPIC:</span> <strong>WXE4829102</strong></div>
                      <div>नाव: <strong>राजेश कुमार वर्मा</strong></div>
                      <div>मतदान केंद्र: <strong>#101 - नवभारत हायस्कूल</strong></div>
                      <div>अनुक्रमांक: <strong>४४२</strong></div>
                    </div>
                    {showSlipQrCode && (
                      <div className="mt-2 text-center text-[10px] text-slate-400 border-t pt-1">
                        [QR: Google Maps Polling Station]
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "app" && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Karyakarta Mobile Application Branding
                </h3>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Doorstep Welcome Message to Workers
                  </label>
                  <textarea
                    rows={2}
                    value={appWelcomeMsg}
                    onChange={(e) => setAppWelcomeMsg(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
                  />
                </div>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Emergency Alerts &amp; Daily Broadcasts
                </h3>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input type="checkbox" defaultChecked className="rounded text-brand-600" />
                  <span>SMS notification on CRITICAL civic issues raised in candidate office</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input type="checkbox" defaultChecked className="rounded text-brand-600" />
                  <span>Daily morning 08:00 AM WhatsApp War Room summary briefing</span>
                </label>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button type="submit" variant="primary" size="md" disabled={isSaving}>
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Settings Changes"}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  CheckCircle2,
  ShieldCheck,
  User,
  Flag,
  Vote,
  MapPin,
  Smartphone,
  PhoneCall,
  CreditCard,
  KeyRound,
  Palette,
  FileCheck2,
  AlertCircle,
  Database,
  Building2,
  Calendar,
} from "lucide-react";
import { DistributorLayout } from "../../../../distributor/components/distributor-layout";
import { useDistributorAuth } from "../../../../distributor/context/distributor-auth-context";

interface FormData {
  // Step 1: Account
  username: string;
  password: string;
  mobile: string;
  email: string;
  accountType: "SALE" | "DEMO";

  // Step 2: Candidate
  candidateName: string;
  candidateMarathiName: string;
  candidateType: "MAIN" | "ALLIANCE" | "INDEPENDENT" | "DUMMY";

  // Step 3: Party
  partyName: string;
  partyMarathiName: string;
  partyAcronym: string;
  partyLogoUrl: string;
  partySymbolUrl: string;

  // Step 4: Election
  electionType: "VIDHAN_SABHA" | "LOK_SABHA" | "MUNICIPAL_CORP" | "ZILLA_PARISHAD";
  electionName: string;
  electionYear: string;
  pollingDate: string;

  // Step 5: Geography & Structured Data Segregation
  state: string;
  district: string;
  acNumber: string;
  acName: string;
  pcNumber: string;
  pcName: string;
  corporationName: string;
  wardNumber: string;
  zpName: string;
  gatName: string;

  // Election Data Segregation
  constituencyPartitionKey: string;
  boothStart: number;
  boothEnd: number;
  partitionStrategy: "CLUSTERED_BY_WARD" | "PRABHAAG_SEGMENTED" | "FULL_CONSTITUENCY";
  campaignCriteria: string[];
  isolationBoundaryStatus: "ENFORCED" | "FLEXIBLE";
  electoralRollCap: number;

  // Step 6: Application
  appName: string;
  whatsappSupportNumber: string;
  facebookUrl: string;
  instagramUrl: string;
  slipDownloadUrl: string;
  helplineNumber: string;

  // Step 7: Communication
  whatsappBotNumber: string;
  smsSenderId: string;
  aiCallerId: string;

  // Step 8: Subscription Request
  requestedPlan: "ELECTION_AI" | "ELECTION_NO_AI" | "OFFICE_12M_AI" | "OFFICE_12M_NO_AI" | "OFFICE_6M_AI" | "OFFICE_6M_NO_AI" | "TRIAL_5D";
  requestedPlanTier: string;
  requestedDuration: string;
  estimatedPrice: string;

  // Step 9: Permissions
  enablePdfExport: boolean;
  enableExcelExport: boolean;
  enableFamilyMapping: boolean;
  aiSeats: number;

  // Step 10: Theme & Assets
  primaryColor: string;
  secondaryColor: string;
  appIconUrl: string;
  splashBannerUrl: string;
  slipBannerUrl: string;

  // Step 11: Distributor Ownership (Binds automatically)
  distributorId: string;
  distributorName: string;

  // Step 12: Affirmation
  agreedToTerms: boolean;
}

export default function NewCandidateWizardPage() {
  const { distributor } = useDistributorAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    mobile: "",
    email: "",
    accountType: "SALE",

    candidateName: "",
    candidateMarathiName: "",
    candidateType: "MAIN",

    partyName: "",
    partyMarathiName: "",
    partyAcronym: "",
    partyLogoUrl: "",
    partySymbolUrl: "",

    electionType: "VIDHAN_SABHA",
    electionName: "Maharashtra Legislative Assembly 2026",
    electionYear: "2026",
    pollingDate: "2026-11-20",

    state: "Maharashtra",
    district: "Pune",
    acNumber: "214",
    acName: "Pune Cantonment",
    pcNumber: "34",
    pcName: "Pune",
    corporationName: "PMC",
    wardNumber: "12",
    zpName: "Pune Zilla Parishad",
    gatName: "Haveli",

    constituencyPartitionKey: "MH-AC214-KOTHRUD",
    boothStart: 1,
    boothEnd: 284,
    partitionStrategy: "FULL_CONSTITUENCY",
    campaignCriteria: ["Main Candidate War Room", "Booth Coordinators Only"],
    isolationBoundaryStatus: "ENFORCED",
    electoralRollCap: 342150,

    appName: "INDIATA War Room",
    whatsappSupportNumber: "+91 98220 11223",
    facebookUrl: "https://facebook.com/candidate",
    instagramUrl: "https://instagram.com/candidate",
    slipDownloadUrl: "https://indiata.in/slips/pune214",
    helplineNumber: "1800-200-9988",

    whatsappBotNumber: "+91 98220 99881",
    smsSenderId: "RAJTAN",
    aiCallerId: "+91 20 6789 0000",

    requestedPlan: "ELECTION_AI",
    requestedPlanTier: "Election Module with AI Mode",
    requestedDuration: "Election End Date + 15 Days Grace Period",
    estimatedPrice: "â‚¹ 1,50,000",

    enablePdfExport: true,
    enableExcelExport: true,
    enableFamilyMapping: true,
    aiSeats: 5,

    primaryColor: "#2087FE",
    secondaryColor: "#010627",
    appIconUrl: "",
    splashBannerUrl: "",
    slipBannerUrl: "",

    distributorId: distributor?.id || "DIS-101",
    distributorName: distributor?.name || "Maharashtra Western Agency",

    agreedToTerms: false,
  });

  const steps = [
    { id: 1, title: "Account Details", icon: User },
    { id: 2, title: "Candidate Details", icon: User },
    { id: 3, title: "Party Details", icon: Flag },
    { id: 4, title: "Election Details", icon: Vote },
    { id: 5, title: "Geography & Segregation", icon: MapPin },
    { id: 6, title: "App & Branding", icon: Smartphone },
    { id: 7, title: "Communication", icon: PhoneCall },
    { id: 8, title: "Subscription Request", icon: CreditCard },
    { id: 9, title: "Access & Rights", icon: KeyRound },
    { id: 10, title: "Theme & Assets", icon: Palette },
    { id: 11, title: "Distributor Bound", icon: ShieldCheck },
    { id: 12, title: "Review & Submit", icon: FileCheck2 },
  ];

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 12) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate backend submission strictly bounded to authenticated distributor
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  if (isSuccess) {
    return (
      <DistributorLayout title="Candidate Onboarding Complete">
        <div className="max-w-xl mx-auto py-12 text-center bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-premium">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Onboarding Request Generated!
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
            Candidate <span className="font-bold text-slate-800 dark:text-slate-200">{formData.candidateName}</span> has been provisioned under your franchise ({distributor?.distributorCode || "DIS-101"}).
          </p>
          <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-left text-slate-700 dark:text-slate-300 space-y-1">
            <div className="flex justify-between">
              <span>Candidate ID:</span>
              <span className="font-mono font-bold">CAND-2026-NEW</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-amber-600 font-bold">Pending Super Admin Verification</span>
            </div>
            <div className="flex justify-between">
              <span>Franchise Binding:</span>
              <span className="text-[#2087FE] font-bold">{distributor?.name}</span>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/distributor/candidates"
              className="px-4 py-2 text-xs font-bold bg-[#2087FE] hover:bg-blue-600 text-white rounded-xl shadow-premium-xs transition"
            >
              Return to Candidates
            </Link>
            <Link
              href="/distributor/dashboard"
              className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 rounded-xl transition"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </DistributorLayout>
    );
  }

  return (
    <DistributorLayout
      title="12-Step Candidate Creation Wizard"
      subtitle="Complete official candidate onboarding strictly bound to your franchise territory"
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Step Progress Stepper */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-premium-xs overflow-x-auto">
          <div className="flex items-center min-w-max gap-2">
            {steps.map((st) => {
              const isPast = currentStep > st.id;
              const isCurr = currentStep === st.id;

              return (
                <button
                  key={st.id}
                  onClick={() => setCurrentStep(st.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    isCurr
                      ? "bg-[#2087FE] text-white shadow-premium-xs"
                      : isPast
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurr
                        ? "bg-white text-[#2087FE]"
                        : isPast
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {isPast ? <Check className="w-3 h-3" /> : st.id}
                  </span>
                  <span className="whitespace-nowrap">{st.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Step Form Body */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-premium-sm min-h-[420px] flex flex-col justify-between">
          <div>
            {/* Step 1: Account Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Step 1: Account Login & Initial Provisioning
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Establish credential baseline and trial/sale designation for the candidate war room.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Account Username / User ID *
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => updateField("username", e.target.value)}
                      placeholder="e.g. rajesh.patil"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Temporary Access Password *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Primary Candidate Mobile *
                    </label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => updateField("mobile", e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Official Contact Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="candidate@elections.in"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Provisioning Account Type *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => updateField("accountType", "SALE")}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                          formData.accountType === "SALE"
                            ? "border-[#2087FE] bg-blue-50/60 dark:bg-blue-950/40 text-[#2087FE]"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                        }`}
                      >
                        <div className="font-bold">Commercial Sale</div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300">
                          Full campaign license requiring commercial payment verification
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateField("accountType", "DEMO")}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                          formData.accountType === "DEMO"
                            ? "border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                        }`}
                      >
                        <div className="font-bold">Trial / Demo</div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300">
                          Time-restricted trial account for preliminary candidate presentation
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Candidate Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Step 2: Candidate Name & Designation
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Bilingual name records required for voter slips, EVM ballots, and reports.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Candidate Name (English) *
                    </label>
                    <input
                      type="text"
                      value={formData.candidateName}
                      onChange={(e) => updateField("candidateName", e.target.value)}
                      placeholder="e.g. Adv. Rajesh Mohan Patil"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Candidate Name (Marathi / Devnagari) *
                    </label>
                    <input
                      type="text"
                      value={formData.candidateMarathiName}
                      onChange={(e) => updateField("candidateMarathiName", e.target.value)}
                      placeholder="à¤‰à¤¦à¤¾. à¤…à¥…à¤¡. à¤°à¤¾à¤œà¥‡à¤¶ à¤®à¥‹à¤¹à¤¨ à¤ªà¤¾à¤Ÿà¥€à¤²"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Candidate Role Classification *
                    </label>
                    <select
                      value={formData.candidateType}
                      onChange={(e) => updateField("candidateType", e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
                    >
                      <option value="MAIN">Lead Principal Candidate</option>
                      <option value="ALLIANCE">Alliance Supported Candidate</option>
                      <option value="INDEPENDENT">Independent Candidate</option>
                      <option value="DUMMY">Covering / Dummy Candidate</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Party Details */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Step 3: Political Party Affiliation & Symbols
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Party branding for voter slips, posters, and booth worker mobile views.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Party Full Name (English) *
                    </label>
                    <input
                      type="text"
                      value={formData.partyName}
                      onChange={(e) => updateField("partyName", e.target.value)}
                      placeholder="e.g. Rashtriya Janata Party"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Party Name (Marathi) *
                    </label>
                    <input
                      type="text"
                      value={formData.partyMarathiName}
                      onChange={(e) => updateField("partyMarathiName", e.target.value)}
                      placeholder="à¤‰à¤¦à¤¾. à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°à¥€à¤¯ à¤œà¤¨à¤¤à¤¾ à¤ªà¤¾à¤°à¥à¤Ÿà¥€"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Party Acronym (e.g. RJP, INC, BJP)
                    </label>
                    <input
                      type="text"
                      value={formData.partyAcronym}
                      onChange={(e) => updateField("partyAcronym", e.target.value)}
                      placeholder="RJP"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Election Symbol Name / URL
                    </label>
                    <input
                      type="text"
                      value={formData.partySymbolUrl}
                      onChange={(e) => updateField("partySymbolUrl", e.target.value)}
                      placeholder="e.g. Lotus / Clock / Bow & Arrow"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Election Details */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Step 4: Election Type & Schedule
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Determines the dynamic electoral geography inputs in Step 5.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Election Category *
                    </label>
                    <select
                      value={formData.electionType}
                      onChange={(e) => updateField("electionType", e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
                    >
                      <option value="VIDHAN_SABHA">Vidhan Sabha (Assembly)</option>
                      <option value="LOK_SABHA">Lok Sabha (Parliament)</option>
                      <option value="MUNICIPAL_CORP">Municipal Corporation (Mahanagarpalika)</option>
                      <option value="ZILLA_PARISHAD">Zilla Parishad & Panchayat Samiti</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Official Election Name *
                    </label>
                    <input
                      type="text"
                      value={formData.electionName}
                      onChange={(e) => updateField("electionName", e.target.value)}
                      placeholder="Maharashtra Assembly General 2026"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Election Year *
                    </label>
                    <input
                      type="text"
                      value={formData.electionYear}
                      onChange={(e) => updateField("electionYear", e.target.value)}
                      placeholder="2026"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2087FE]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Dynamic Geography */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Step 5: Dynamic Electoral Locus & Geography
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#2087FE]">
                      {formData.electionType.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Fields dynamically adapt to the selected election level.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      State / Union Territory *
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Administrative District *
                    </label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => updateField("district", e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Morphing according to Election Type */}
                  {formData.electionType === "VIDHAN_SABHA" && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          AC Number (Assembly Constituency) *
                        </label>
                        <input
                          type="text"
                          value={formData.acNumber}
                          onChange={(e) => updateField("acNumber", e.target.value)}
                          placeholder="e.g. 214"
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          AC Name (English & Marathi) *
                        </label>
                        <input
                          type="text"
                          value={formData.acName}
                          onChange={(e) => updateField("acName", e.target.value)}
                          placeholder="Pune Cantonment (à¤ªà¥à¤£à¥‡ à¤›à¤¾à¤µà¤£à¥€)"
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </>
                  )}

                  {formData.electionType === "LOK_SABHA" && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          PC Number (Parliamentary Constituency) *
                        </label>
                        <input
                          type="text"
                          value={formData.pcNumber}
                          onChange={(e) => updateField("pcNumber", e.target.value)}
                          placeholder="e.g. 34"
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          PC Name *
                        </label>
                        <input
                          type="text"
                          value={formData.pcName}
                          onChange={(e) => updateField("pcName", e.target.value)}
                          placeholder="Pune"
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </>
                  )}

                  {formData.electionType === "MUNICIPAL_CORP" && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Municipal Corporation Name *
                        </label>
                        <input
                          type="text"
                          value={formData.corporationName}
                          onChange={(e) => updateField("corporationName", e.target.value)}
                          placeholder="Pune Municipal Corporation (PMC)"
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Ward / Prabhag Number & Name *
                        </label>
                        <input
                          type="text"
                          value={formData.wardNumber}
                          onChange={(e) => updateField("wardNumber", e.target.value)}
                          placeholder="Ward No. 12 (Kothrud Depot)"
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </>
                  )}

                  {formData.electionType === "ZILLA_PARISHAD" && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Zilla Parishad Body *
                        </label>
                        <input
                          type="text"
                          value={formData.zpName}
                          onChange={(e) => updateField("zpName", e.target.value)}
                          placeholder="Pune ZP"
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Gat / Gan Electoral Circle *
                        </label>
                        <input
                          type="text"
                          value={formData.gatName}
                          onChange={(e) => updateField("gatName", e.target.value)}
                          placeholder="Haveli Gan"
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Structured Election Data Segregation & Partitioning Boundary */}
                <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#2087FE] text-white flex items-center justify-center shrink-0">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          Structured Election Data Segregation
                        </h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          Enforce strict data isolation boundaries to partition voter rolls by booth number, constituency, and campaign roles.
                        </p>
                      </div>
                    </div>
                    <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      ENFORCED (Zero Cross-Leakage)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Constituency Data Partition Key *
                      </label>
                      <input
                        type="text"
                        value={formData.constituencyPartitionKey}
                        onChange={(e) => updateField("constituencyPartitionKey", e.target.value)}
                        placeholder="e.g. MH-AC214-KOTHRUD"
                        className="w-full px-3.5 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[#2087FE] dark:text-blue-400 uppercase"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Unique database partition key mapping this candidate's voter records.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Data Partitioning Strategy *
                      </label>
                      <select
                        value={formData.partitionStrategy}
                        onChange={(e) => updateField("partitionStrategy", e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="FULL_CONSTITUENCY">Full Assembly / Constituency Electoral Roll</option>
                        <option value="CLUSTERED_BY_WARD">Clustered by Ward / Prabhag Boundaries</option>
                        <option value="PRABHAAG_SEGMENTED">Prabhaag Segmented Micro-Boundaries</option>
                      </select>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Controls how voter clusters and polling booths are segmented across teams.
                      </span>
                    </div>

                    {/* Booth Number Partitioning Range */}
                    <div className="md:col-span-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Polling Booth Number Partitioning Range
                        </label>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#2087FE]">
                          {Math.max(1, formData.boothEnd - formData.boothStart + 1)} Booths Assigned
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <span className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">
                            Start Booth #
                          </span>
                          <input
                            type="number"
                            min={1}
                            value={formData.boothStart}
                            onChange={(e) => updateField("boothStart", Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                          />
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">
                            End Booth #
                          </span>
                          <input
                            type="number"
                            min={formData.boothStart}
                            value={formData.boothEnd}
                            onChange={(e) => updateField("boothEnd", Math.max(formData.boothStart, parseInt(e.target.value) || formData.boothStart))}
                            className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                          />
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">
                            Maximum Voter Roll Cap
                          </span>
                          <input
                            type="number"
                            step={1000}
                            value={formData.electoralRollCap}
                            onChange={(e) => updateField("electoralRollCap", Math.max(1000, parseInt(e.target.value) || 1000))}
                            className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Specific Campaign Data Criteria Tags */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Campaign Data Partitioning Criteria (Select Applied Segments)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Main Candidate War Room",
                          "Alliance Partner Bloc",
                          "Youth Wing Desk",
                          "Women Front (Mahila Aghadi)",
                          "Booth Coordinators Only",
                          "Independent Campaign Desk",
                          "Prabhaag Incharge Access Only",
                        ].map((criterion) => {
                          const isSelected = formData.campaignCriteria.includes(criterion);
                          return (
                            <button
                              key={criterion}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  updateField(
                                    "campaignCriteria",
                                    formData.campaignCriteria.filter((c) => c !== criterion)
                                  );
                                } else {
                                  updateField("campaignCriteria", [...formData.campaignCriteria, criterion]);
                                }
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                isSelected
                                  ? "bg-[#2087FE] text-white shadow-premium-xs"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                              }`}
                            >
                              {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                              <span>{criterion}</span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Segmented campaign access ensures karyakartas only see voter chits and phone directories within their designated wing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Application & Public Details */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Step 6: Mobile Application & Public Links
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Candidate-branded portals, voter slip search URLs, and support helplines.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      App Title / War Room Label
                    </label>
                    <input
                      type="text"
                      value={formData.appName}
                      onChange={(e) => updateField("appName", e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Voter Helpline Number
                    </label>
                    <input
                      type="text"
                      value={formData.helplineNumber}
                      onChange={(e) => updateField("helplineNumber", e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      WhatsApp Support Number
                    </label>
                    <input
                      type="text"
                      value={formData.whatsappSupportNumber}
                      onChange={(e) => updateField("whatsappSupportNumber", e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Voter Slip Web Link
                    </label>
                    <input
                      type="text"
                      value={formData.slipDownloadUrl}
                      onChange={(e) => updateField("slipDownloadUrl", e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Communication */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Step 7: Automated Communication Channels
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Configuration for outbound messaging, DLT sender IDs, and AI voice calls.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Official WhatsApp Bot Number
                    </label>
                    <input
                      type="text"
                      value={formData.whatsappBotNumber}
                      onChange={(e) => updateField("whatsappBotNumber", e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      6-Character DLT SMS Sender Header
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={formData.smsSenderId}
                      onChange={(e) => updateField("smsSenderId", e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white uppercase font-mono"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      AI Outbound Voice Caller DID
                    </label>
                    <input
                      type="text"
                      value={formData.aiCallerId}
                      onChange={(e) => updateField("aiCallerId", e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 8: Subscription Request (Official Catalog from Super Admin) */}
            {currentStep === 8 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Step 8: Subscription Package Request
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      Request Mode Only
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Select official subscription tier according to central price book. Super Admin verifies and activates.
                  </p>
                </div>

                {/* Module Group 1: Election Module */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Vote className="w-4 h-4 text-[#2087FE]" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      1. Election Module Plans (Validity: Election End Date + 15 Days Grace Period)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        id: "ELECTION_AI",
                        name: "Election Module with AI Mode",
                        price: "â‚¹ 1,50,000",
                        tag: "Full AI Suite",
                        hasAi: true,
                        validity: "Election End Date + 15 Days Grace Period",
                        desc: "Full AI Voice Calling Suite (15,000 mins), WhatsApp Bot, AI Family Clustering, Turnout Guard.",
                      },
                      {
                        id: "ELECTION_NO_AI",
                        name: "Election Module without AI Mode",
                        price: "â‚¹ 95,000",
                        tag: "Standard Roll",
                        hasAi: false,
                        validity: "Election End Date + 15 Days Grace Period",
                        desc: "Standard WhatsApp broadcast, full voter directory, slip printing, and data segregation.",
                      },
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => {
                          updateField("requestedPlan", tier.id);
                          updateField("requestedPlanTier", tier.name);
                          updateField("estimatedPrice", tier.price);
                          updateField("requestedDuration", tier.validity);
                        }}
                        className={`p-4 rounded-2xl border text-left transition ${
                          formData.requestedPlan === tier.id
                            ? "border-[#2087FE] bg-blue-50/70 dark:bg-blue-950/40 text-slate-900 dark:text-white ring-2 ring-[#2087FE]/20"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold">{tier.name}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#2087FE]">
                            {tier.tag}
                          </span>
                        </div>
                        <div className="text-lg font-black text-[#2087FE]">{tier.price}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#2087FE]" />
                          <span>{tier.validity}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2">
                          {tier.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Module Group 2: Office Module */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      2. Office Module Plans (Continuous Office & Grievance Governance)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      {
                        id: "OFFICE_12M_AI",
                        name: "Office â€“ 12 Months with AI Mode",
                        price: "â‚¹ 1,20,000",
                        validity: "12 Months Continuous",
                        hasAi: true,
                        tag: "12M + AI",
                      },
                      {
                        id: "OFFICE_12M_NO_AI",
                        name: "Office â€“ 12 Months without AI",
                        price: "â‚¹ 75,000",
                        validity: "12 Months Continuous",
                        hasAi: false,
                        tag: "12M Standard",
                      },
                      {
                        id: "OFFICE_6M_AI",
                        name: "Office â€“ 6 Months with AI Mode",
                        price: "â‚¹ 65,000",
                        validity: "6 Months Continuous",
                        hasAi: true,
                        tag: "6M + AI",
                      },
                      {
                        id: "OFFICE_6M_NO_AI",
                        name: "Office â€“ 6 Months without AI",
                        price: "â‚¹ 40,000",
                        validity: "6 Months Continuous",
                        hasAi: false,
                        tag: "6M Standard",
                      },
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => {
                          updateField("requestedPlan", tier.id);
                          updateField("requestedPlanTier", tier.name);
                          updateField("estimatedPrice", tier.price);
                          updateField("requestedDuration", tier.validity);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition ${
                          formData.requestedPlan === tier.id
                            ? "border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 text-slate-900 dark:text-white ring-2 ring-purple-500/20"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] font-bold truncate">{tier.name}</span>
                          {tier.hasAi && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                              AI
                            </span>
                          )}
                        </div>
                        <div className="text-base font-black text-purple-600 dark:text-purple-400">
                          {tier.price}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{tier.validity}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Module Group 3: Trial / Demo */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      3. Evaluation Sandbox
                    </span>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        updateField("requestedPlan", "TRIAL_5D");
                        updateField("requestedPlanTier", "Trial Demo (5 Days)");
                        updateField("estimatedPrice", "â‚¹ 0 (Free Trial)");
                        updateField("requestedDuration", "Strict 5-Day Evaluation Window");
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${
                        formData.requestedPlan === "TRIAL_5D"
                          ? "border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-slate-900 dark:text-white ring-2 ring-amber-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold">Trial Demo (5 Days)</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            Pitch Sandbox
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                          5-day evaluation sandbox with sample 1,000 verified voter records and watermarked slips.
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-base font-black text-amber-600 dark:text-amber-400">â‚¹ 0</div>
                        <div className="text-[10px] text-slate-500">Free 5 Days</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Distributor Access Restriction:</span> Distributors cannot directly activate commercial paid plans or issue receipts. This request is transmitted to Super Admin billing for verification.
                  </div>
                </div>
              </div>
            )}

            {/* Step 9: Access & Permissions */}
            {currentStep === 9 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Step 9: Feature Entitlements & Permissions
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Configure granular tool permissions for the candidate campaign staff.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Voter Roll PDF Generation & Export
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">
                        Allow printing polling-booth voter lists and family chits
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.enablePdfExport}
                      onChange={(e) => updateField("enablePdfExport", e.target.checked)}
                      className="w-4 h-4 rounded text-[#2087FE] focus:ring-[#2087FE]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Raw Excel Data Export
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">
                        Allow exporting filtered voter subsets to Excel spreadsheet
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.enableExcelExport}
                      onChange={(e) => updateField("enableExcelExport", e.target.checked)}
                      className="w-4 h-4 rounded text-[#2087FE] focus:ring-[#2087FE]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        AI Family Tree Hierarchy Mapping
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">
                        Enable automatic family grouping based on surname, house no., and locality
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.enableFamilyMapping}
                      onChange={(e) => updateField("enableFamilyMapping", e.target.checked)}
                      className="w-4 h-4 rounded text-[#2087FE] focus:ring-[#2087FE]"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Step 10: Theme & Assets */}
            {currentStep === 10 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Step 10: Campaign Visual Identity
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Colors and assets for candidate war room theme styling.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Primary Brand Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => updateField("primaryColor", e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-0"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => updateField("primaryColor", e.target.value)}
                        className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Secondary Brand Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.secondaryColor}
                        onChange={(e) => updateField("secondaryColor", e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-0"
                      />
                      <input
                        type="text"
                        value={formData.secondaryColor}
                        onChange={(e) => updateField("secondaryColor", e.target.value)}
                        className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 11: Distributor Ownership (System Bounded) */}
            {currentStep === 11 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Step 11: Tenant Ownership & Security Binding
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Zero-Trust Enforced
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    System verifies that this candidate record is permanently locked to your authenticated franchise session.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2087FE] text-white flex items-center justify-center font-bold">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Authenticated Distributor ID: {distributor?.distributorCode || "DIS-101"}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">
                        Franchise Partner: {distributor?.name || "Maharashtra Western Agency"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-300">Franchise Territory:</span>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {distributor?.territory || "Pune Metro"}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-300">Tenant Isolation:</span>
                      <div className="font-bold text-emerald-600">STRICTLY ISOLATED</div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Per the platform security specification, distributors cannot change or reassign ownership to other partners or access non-assigned records.
                </p>
              </div>
            )}

            {/* Step 12: Review & Submit */}
            {currentStep === 12 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Step 12: Comprehensive Review & Confirmation
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Verify all candidate parameters before generating the official onboarding record.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span>Candidate Identity</span>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="text-[10px] text-[#2087FE] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Name:</span>
                      <span className="font-bold">{formData.candidateName || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Marathi:</span>
                      <span>{formData.candidateMarathiName || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Mobile:</span>
                      <span className="font-mono">{formData.mobile || "Not specified"}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span>Electoral Geography</span>
                      <button
                        onClick={() => setCurrentStep(5)}
                        className="text-[10px] text-[#2087FE] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Election:</span>
                      <span className="font-bold">{formData.electionType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Constituency:</span>
                      <span>{formData.acName || formData.pcName || formData.wardNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">District:</span>
                      <span>{formData.district}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span>Subscription & Plan</span>
                      <button
                        onClick={() => setCurrentStep(8)}
                        className="text-[10px] text-[#2087FE] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Package:</span>
                      <span className="font-bold text-[#2087FE]">{formData.requestedPlanTier || formData.requestedPlan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Validity:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{formData.requestedDuration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Est. Super Admin Quote:</span>
                      <span className="font-bold">{formData.estimatedPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Account Type:</span>
                      <span className="font-bold">{formData.accountType}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span>Franchise Binding</span>
                      <span className="text-[10px] text-emerald-600 font-bold">Locked</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Distributor ID:</span>
                      <span className="font-mono font-bold text-[#2087FE]">
                        {distributor?.distributorCode || "DIS-101"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Territory:</span>
                      <span>{distributor?.territory || "Pune Metro"}</span>
                    </div>
                  </div>

                  {/* Electoral Data Segregation Card */}
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 md:col-span-2 bg-blue-50/40 dark:bg-blue-950/20">
                    <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-[#2087FE]" />
                        <span>Election Data Segregation & Boundaries</span>
                      </span>
                      <button
                        onClick={() => setCurrentStep(5)}
                        className="text-[10px] text-[#2087FE] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-600 dark:text-slate-300 block">Partition Key:</span>
                        <span className="font-mono font-bold text-[#2087FE]">{formData.constituencyPartitionKey}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-300 block">Assigned Booth Range:</span>
                        <span className="font-bold">
                          Booth #{formData.boothStart} â€“ #{formData.boothEnd} ({formData.boothEnd - formData.boothStart + 1} Booths)
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-300 block">Isolation Status:</span>
                        <span className="font-bold text-emerald-600 inline-flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          ENFORCED
                        </span>
                      </div>
                    </div>
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      <span className="text-[10px] text-slate-500 font-medium">Applied Wings:</span>
                      {formData.campaignCriteria.map((c, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#2087FE] font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={(e) => updateField("agreedToTerms", e.target.checked)}
                    className="w-4 h-4 rounded text-[#2087FE] focus:ring-[#2087FE] mt-0.5"
                  />
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-bold">Distributor Compliance Affirmation:</span> I certify that this candidate is within my assigned franchise geographical boundary and that all candidate data adheres to election commission regulations.
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Stepper Navigation Footer Buttons */}
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                currentStep === 1
                  ? "opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800"
                  : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Step {currentStep} of 12
            </div>

            {currentStep < 12 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-[#2087FE] hover:bg-blue-600 text-white shadow-premium-xs transition"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting || !formData.agreedToTerms}
                onClick={handleSubmit}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-premium-sm ${
                  formData.agreedToTerms && !isSubmitting
                    ? "bg-[#2087FE] hover:bg-blue-600 text-white"
                    : "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <span>Generating Onboarding Request...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Generate Candidate Request</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </DistributorLayout>
  );
}

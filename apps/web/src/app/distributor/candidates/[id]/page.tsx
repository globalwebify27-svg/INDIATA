"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Vote,
  MapPin,
  CreditCard,
  FileQuestion,
  Edit,
  Image as ImageIcon,
  Smartphone,
  Phone,
  Building,
  Sparkles,
} from "lucide-react";
import { DistributorLayout } from "../../../../distributor/components/distributor-layout";
import { candidateStore, CandidateProfile } from "../../../../distributor/data/candidate-store";
import { mockScopedEnquiries, ScopedEnquiry } from "../../../../distributor/data/mock-distributor-data";
import { EditCandidateModal } from "../../../../distributor/components/edit-candidate-modal";
import { CandidateImageManager } from "../../../../distributor/components/candidate-image-manager";
import { CandidateAppPreview } from "../../../../distributor/components/candidate-app-preview";
import { Badge } from "@rajtantra/ui/feedback";

export default function CandidateControlPanelPage() {
  const params = useParams();
  const candidateId = (params?.id as string) || "CAND-201";

  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [activeTab, setActiveTab] = useState<
    "profile" | "images" | "app_preview" | "users" | "geography" | "subscription" | "enquiries"
  >("profile");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Subscribe to central candidate store for instant reactivity
  useEffect(() => {
    const cand = candidateStore.getCandidateById(candidateId) || candidateStore.getAllCandidates()[0] || null;
    setCandidate(cand);

    const unsubscribe = candidateStore.subscribe(() => {
      const updated = candidateStore.getCandidateById(candidateId);
      if (updated) setCandidate(updated);
    });
    return unsubscribe;
  }, [candidateId]);

  if (!candidate) {
    return (
      <DistributorLayout title="Candidate Not Found">
        <div className="p-8 text-center text-xs text-slate-500">
          The requested candidate could not be found or is not assigned to your franchise.
        </div>
      </DistributorLayout>
    );
  }

  const candidateEnquiries = mockScopedEnquiries.filter(
    (e: ScopedEnquiry) => e.candidateName.includes(candidate.name) || e.candidateId === candidate.id
  );

  return (
    <DistributorLayout
      title={`Candidate Control Panel: ${candidate.name}`}
      subtitle={`ID: ${candidate.id} • ${candidate.constituency} (${candidate.electionType})`}
    >
      <div className="space-y-6">
        {/* Back navigation & Quick status bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/distributor/candidates"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Candidates Directory</span>
          </Link>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                candidate.accountType === "DEMO" || candidate.accountType === "Demo"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
              }`}
            >
              {candidate.accountType} ACCOUNT
            </span>
            <Badge
              variant={
                candidate.status === "ACTIVE"
                  ? "success"
                  : candidate.status === "PENDING_APPROVAL"
                  ? "warning"
                  : "neutral"
              }
              size="md"
            >
              {candidate.status.replace("_", " ")}
            </Badge>
          </div>
        </div>

        {/* HERO PROFILE & BRANDING BANNER (Cover Banner Background + Profile Photo) */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-premium-sm bg-white dark:bg-slate-900">
          {/* Cover Banner Image with Gradient Overlay */}
          <div className="h-44 sm:h-52 w-full relative bg-slate-900 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={candidate.images.coverBannerUrl}
              alt="Candidate Cover Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            {/* Quick Slogan Tag */}
            <div className="absolute bottom-3 left-6 right-6 flex items-center justify-between text-white/90">
              <span className="text-xs font-marathi font-bold tracking-wide truncate max-w-xl">
                &ldquo;{candidate.slogan}&rdquo;
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md hidden sm:inline-block">
                Franchise Managed
              </span>
            </div>
          </div>

          {/* Profile Details & Actions Row */}
          <div className="p-6 pt-0 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-12 sm:-mt-14">
            {/* Left: Avatar & Candidate Names */}
            <div className="flex items-end gap-4.5">
              {/* Profile Photo */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white dark:bg-slate-900 p-1.5 shadow-2xl ring-4 ring-[#2087FE] shrink-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={candidate.images.profilePhotoUrl}
                  alt={candidate.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              {/* Names & Badges */}
              <div className="space-y-1 pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {candidate.name}
                  </h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#2087FE] border border-blue-200 dark:border-blue-900 flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-white p-0.5 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={candidate.images.partySymbolUrl}
                        alt="Symbol"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span>{candidate.party}</span>
                  </span>
                </div>

                <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 font-marathi">
                  {candidate.marathiName} • {candidate.constituency}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1 font-mono font-bold text-slate-700 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{candidate.mobile}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{candidate.district}, {candidate.state}</span>
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {candidate.subscriptionTier}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {/* Edit Candidate Profile Button */}
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm transition cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5 text-blue-600" />
                <span>Edit Profile</span>
              </button>

              {/* Manage Images Hub Button */}
              <button
                type="button"
                onClick={() => setActiveTab("images")}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                  activeTab === "images"
                    ? "bg-purple-600 text-white"
                    : "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 border border-purple-200 dark:border-purple-900"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Manage Images</span>
              </button>

              {/* Live App Preview Shortcut */}
              <button
                type="button"
                onClick={() => setActiveTab("app_preview")}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-premium-xs cursor-pointer ${
                  activeTab === "app_preview"
                    ? "bg-blue-600 text-white"
                    : "bg-[#2087FE] hover:bg-blue-600 text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Candidate App Preview</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto">
          {[
            { id: "profile", label: "Candidate 360° Profile", icon: Users },
            { id: "images", label: "Major Images & Assets (6)", icon: ImageIcon, badge: "Editable" },
            { id: "app_preview", label: "Live App & Slip Preview", icon: Smartphone, badge: "Real-Time" },
            { id: "users", label: `War Room Staff (${candidate.totalUsers})`, icon: Users },
            { id: "geography", label: "Election & Geography", icon: MapPin },
            { id: "subscription", label: "Subscription & Services", icon: CreditCard },
            {
              id: "enquiries",
              label: `Enquiries (${candidateEnquiries.length})`,
              icon: FileQuestion,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition -mb-px whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "border-[#2087FE] text-[#2087FE]"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* TAB PANELS                                                */}
        {/* ========================================================= */}

        {/* TAB 1: CANDIDATE 360° PROFILE */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            {/* Quick Action Bar inside Profile */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Central Candidate Profile Information
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Synchronized with Candidate Admin credentials and public campaign channels
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#2087FE] hover:bg-blue-600 text-white shadow-premium-xs transition cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Information</span>
              </button>
            </div>

            {/* Profile Information Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* 1. Personal Information */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-premium-xs space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>1. Personal Information</span>
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Official English Name:</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{candidate.name}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Marathi / Devnagari Name:</span>
                    <strong className="text-slate-900 dark:text-white font-marathi font-bold">{candidate.marathiName}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Gender / Age:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{candidate.gender} • {candidate.age || 48} Years</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Education:</span>
                    <span className="text-slate-700 dark:text-slate-300">{candidate.education || "Post Graduate"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Profession / Occupation:</span>
                    <span className="text-slate-700 dark:text-slate-300">{candidate.occupation || "Social Reformer"}</span>
                  </div>
                </div>
              </div>

              {/* 2. Contact & Helpline Information */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-premium-xs space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>2. Contact &amp; Helpline</span>
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Direct Contact Mobile:</span>
                    <strong className="font-mono text-slate-900 dark:text-white font-bold">{candidate.mobile}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Campaign Email:</span>
                    <span className="text-blue-600 font-mono">{candidate.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">WhatsApp Citizen Helpline:</span>
                    <span className="font-mono text-emerald-600 font-bold">{candidate.whatsappHelpline}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Office Phone:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{candidate.officePhone || "020-25448899"}</span>
                  </div>
                </div>
              </div>

              {/* 3. Political & Party Affiliation */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-premium-xs space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Building className="w-4 h-4 text-purple-600" />
                  <span>3. Political Party &amp; Symbol</span>
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Party Name:</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{candidate.party}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Party Acronym:</span>
                    <span className="font-mono font-bold text-blue-600">{candidate.partyAcronym}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">ECI Election Symbol:</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded bg-white p-0.5 border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={candidate.images.partySymbolUrl}
                          alt="Symbol"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Allocated</span>
                    </div>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Candidate Role:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {candidate.candidateType === "MAIN" ? "Lead Principal Candidate" : candidate.candidateType}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Election Information */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-premium-xs space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Vote className="w-4 h-4 text-blue-600" />
                  <span>4. Election &amp; Schedule</span>
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Election Type:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{candidate.electionType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Seat Category:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{candidate.seatCategory || "GENERAL"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Polling Date:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{candidate.pollingDate || "20 Nov 2026"}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Election Year:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{candidate.electionYear || "2026"}</span>
                  </div>
                </div>
              </div>

              {/* 5. Constituency Geography */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-premium-xs space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>5. Constituency Geography</span>
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Constituency:</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{candidate.constituency}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">District &amp; State:</span>
                    <span className="text-slate-700 dark:text-slate-300">{candidate.district}, {candidate.state}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Mapped Polling Booths:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{candidate.totalBooths || 284} Polling Stations</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Total Registered Electors:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {candidate.totalVoters ? candidate.totalVoters.toLocaleString() : "342,150"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 6. Office Address & Channels */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-premium-xs space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>6. Campaign Office &amp; Slogan</span>
                </h4>
                <div className="space-y-2">
                  <div className="py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 block mb-0.5">Campaign Head Office Address:</span>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">
                      {candidate.officeAddress}, {candidate.city} - {candidate.pincode}
                    </p>
                  </div>
                  <div className="py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 block mb-0.5">Campaign Slogan:</span>
                    <p className="text-amber-600 dark:text-amber-400 font-marathi font-bold">
                      &ldquo;{candidate.slogan}&rdquo;
                    </p>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Public Slip Download:</span>
                    <a
                      href={candidate.publicSlipUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-mono underline truncate max-w-[200px]"
                    >
                      {candidate.publicSlipUrl}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MAJOR IMAGES & ASSETS HUB (REQ: Client Major Requirement) */}
        {activeTab === "images" && (
          <CandidateImageManager
            candidate={candidate}
            onImagesUpdated={(updated) => setCandidate(updated)}
          />
        )}

        {/* TAB 3: LIVE CANDIDATE APP PREVIEW */}
        {activeTab === "app_preview" && (
          <CandidateAppPreview candidate={candidate} />
        )}

        {/* TAB 4: USERS */}
        {activeTab === "users" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-premium-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Campaign Staff &amp; War Room Seats
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Users authorized to access this candidate&apos;s mobile and desktop portal
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#2087FE]">
                4 of 10 Seats Used
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {[
                { name: "Rahul Deshmukh", role: "Campaign Manager", mobile: "+91 98220 54321", status: "Active" },
                { name: "Sunil Shinde", role: "Booth Coordinator", mobile: "+91 98220 65432", status: "Active" },
                { name: "Pooja Kulkarni", role: "Social & WhatsApp Lead", mobile: "+91 98220 76543", status: "Active" },
                { name: "Mahesh Jadhav", role: "Field Karyakarta", mobile: "+91 98220 87654", status: "Active" },
              ].map((user, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{user.name}</div>
                    <div className="text-[11px] text-slate-500">{user.role} • {user.mobile}</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    {user.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: GEOGRAPHY */}
        {activeTab === "geography" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-premium-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Electoral Geography &amp; Territorial Mapping
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10.5px]">Assembly Constituency</span>
                <strong className="text-slate-900 dark:text-white text-sm block mt-0.5">{candidate.constituency}</strong>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10.5px]">Parent Parliamentary (PC)</span>
                <strong className="text-slate-900 dark:text-white text-sm block mt-0.5">{candidate.pcName || "34 - Pune"}</strong>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10.5px]">Mapped Booth Stations</span>
                <strong className="text-slate-900 dark:text-white text-sm block mt-0.5">{candidate.totalBooths || 284} Polling Booths</strong>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SUBSCRIPTION */}
        {activeTab === "subscription" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-premium-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Franchise Subscription &amp; Add-on Modules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 block">Current Plan Tier</span>
                <strong className="text-slate-900 dark:text-white text-base block">{candidate.subscriptionTier}</strong>
                <span className="text-emerald-600 font-semibold block">Expires: {candidate.subscriptionExpiresAt}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">Active Add-on Modules</span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold">
                    Voice AI Caller
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                    WhatsApp Dynamic Slips
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
                    Family Tree AI
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: ENQUIRIES */}
        {activeTab === "enquiries" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-premium-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Generated Service Enquiries ({candidateEnquiries.length})
            </h3>
            {candidateEnquiries.length === 0 ? (
              <p className="text-slate-400 italic">No enquiries logged for this candidate.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {candidateEnquiries.map((enq) => (
                  <div key={enq.id} className="py-3 flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 dark:text-white block">{enq.serviceType}: {enq.requestedPackage}</strong>
                      <span className="text-slate-400">{enq.enquiryNumber} • {enq.requestDate}</span>
                    </div>
                    <div className="text-right">
                      <strong className="text-slate-900 dark:text-white block font-bold">{enq.amount}</strong>
                      <span className="text-emerald-600 font-semibold">{enq.paymentStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Candidate Profile Modal */}
      {isEditModalOpen && (
        <EditCandidateModal
          isOpen={isEditModalOpen}
          candidate={candidate}
          onClose={() => setIsEditModalOpen(false)}
          onSaved={(updated) => {
            setCandidate(updated);
          }}
        />
      )}
    </DistributorLayout>
  );
}

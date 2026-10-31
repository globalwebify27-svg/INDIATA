"use client";

import React, { useState } from "react";
import {
  User,
  Building,
  MapPin,
  Smartphone,
  Shield,
  Layers,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Send,
  FileCheck,
} from "lucide-react";
import { CandidateRecord, ElectionType, AccountType, DistributorRecord } from "../../../types/superadmin.types";
import { OrganizationPlanType } from "@rajtantra/common-types";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select } from "../../ui/select";
import { Badge } from "../../ui/badge";
import { useToast } from "../../../context/toast-context";

export interface CandidateOnboardingWizardProps {
  distributors: DistributorRecord[];
  onCandidateCreated: (candidate: CandidateRecord) => void;
  onCancel: () => void;
}

const WIZARD_STEPS = [
  { id: 1, title: "Account & Type", short: "Account" },
  { id: 2, title: "Candidate Identity", short: "Identity" },
  { id: 3, title: "Party & Symbol", short: "Party" },
  { id: 4, title: "Election Project", short: "Election" },
  { id: 5, title: "Election Geography", short: "Geography" },
  { id: 6, title: "White-label App", short: "App" },
  { id: 7, title: "Feature Permissions", short: "Features" },
  { id: 8, title: "Acquisition Source", short: "Source" },
  { id: 9, title: "Review Summary", short: "Review" },
  { id: 10, title: "Activation & Launch", short: "Activate" },
];

const ELECTION_CATEGORIES: { value: ElectionType; label: string }[] = [
  { value: "Vidhan Sabha", label: "Vidhan Sabha (Legislative Assembly)" },
  { value: "Lok Sabha", label: "Lok Sabha (Parliamentary)" },
  { value: "Municipal Corporation", label: "Municipal Corporation (PMC/BMC)" },
  { value: "Zilla Parishad", label: "Zilla Parishad" },
  { value: "Nagar Parishad", label: "Nagar Parishad" },
  { value: "Gram Panchayat", label: "Gram Panchayat" },
];

const MAHARASHTRA_DISTRICTS = [
  "Pune",
  "Satara",
  "Sangli",
  "Kolhapur",
  "Solapur",
  "Mumbai City",
  "Mumbai Suburban",
  "Thane",
  "Nashik",
  "Aurangabad (Chhatrapati Sambhajinagar)",
  "Jalna",
  "Nagpur",
  "Amravati",
  "Nanded",
];

export function CandidateOnboardingWizard({
  distributors,
  onCandidateCreated,
  onCancel,
}: CandidateOnboardingWizardProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10;

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Account
    username: "",
    email: "",
    phone: "",
    passwordOption: "secure_link",
    accountType: "Sale" as AccountType,
    // Step 2: Candidate
    nameEnglish: "",
    nameMarathi: "",
    candidateType: "Single Contestant",
    // Step 3: Party
    partyEnglish: "Bharatiya Janata Party",
    partyMarathi: "भारतीय जनता पक्ष",
    votingSymbol: "Lotus",
    // Step 4: Election
    electionType: "Vidhan Sabha" as ElectionType,
    electionName: "Maharashtra Assembly Election 2024",
    electionYear: "2024",
    electionProject: "Assembly Sweep 2024",
    // Step 5: Geography
    state: "Maharashtra",
    district: "Pune",
    parliamentaryConstituency: "Pune",
    assemblyConstituency: "Kothrud (AC-210)",
    ward: "Ward 12",
    panchayat: "",
    boothCount: "342",
    // Step 6: Application details
    appName: "",
    whatsappNumber: "",
    slipUrl: "",
    // Step 7: Permissions & Access
    pdfAccess: true,
    excelAccess: true,
    imageAccess: true,
    apkBuildAccess: false,
    aiAccess: true,
    aiSeats: 5,
    // Step 8: Acquisition
    acquisitionSource: "Distributor" as "Distributor" | "Direct",
    distributorId: distributors[0]?.id || "DIS-101",
    // Step 10: Activation dispatch
    deliveryChannel: "whatsapp" as "whatsapp" | "email" | "both",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProvisioning, setIsProvisioning] = useState(false);

  // Field Updater
  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-suggest username if English name is typed and username is empty/matching previous
      if (field === "nameEnglish" && (!prev.username || prev.username.startsWith("cand_"))) {
        const clean = (value as string)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/(^_|_$)+/g, "");
        if (clean) updated.username = clean;
      }
      // Auto-suggest app title if candidate name typed and appName empty
      if (field === "nameEnglish" && !prev.appName && value) {
        updated.appName = `${value} Connect`;
      }
      return updated;
    });
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.phone.trim()) {
        errs.phone = "Contact phone number is required.";
      } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.phone.trim())) {
        errs.phone = "Enter a valid 10-digit mobile number.";
      }

      if (!formData.email.trim()) {
        errs.email = "Email address is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        errs.email = "Enter a valid email address.";
      }
    }

    if (step === 2) {
      if (!formData.nameEnglish.trim()) {
        errs.nameEnglish = "Candidate full name in English is required.";
      }
      if (!formData.nameMarathi.trim()) {
        errs.nameMarathi = "Candidate full name in Marathi (देवनागरी) is required.";
      }
    }

    if (step === 3) {
      if (!formData.partyEnglish.trim()) {
        errs.partyEnglish = "Political party name is required.";
      }
      if (!formData.votingSymbol.trim()) {
        errs.votingSymbol = "Voting symbol is required.";
      }
    }

    if (step === 4) {
      if (!formData.electionYear.trim()) {
        errs.electionYear = "Election year is required.";
      }
    }

    if (step === 5) {
      if (formData.electionType === "Lok Sabha" && !formData.parliamentaryConstituency.trim()) {
        errs.parliamentaryConstituency = "Parliamentary constituency is required.";
      } else if (formData.electionType === "Vidhan Sabha" && !formData.assemblyConstituency.trim()) {
        errs.assemblyConstituency = "Assembly constituency is required.";
      } else if (formData.electionType === "Municipal Corporation" && !formData.ward.trim()) {
        errs.ward = "Prabhag / Ward number is required.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleJumpToStep = (stepNumber: number) => {
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
    } else {
      // Validate current step before allowing forward jump
      if (validateStep(currentStep)) {
        setCurrentStep(stepNumber);
      }
    }
  };

  const handleFinalActivation = () => {
    setIsProvisioning(true);

    setTimeout(() => {
      const generatedId = `CAN-${Math.floor(8100 + Math.random() * 900)}`;
      const activeDistributor = distributors.find((d) => d.id === formData.distributorId);

      const geographySummary =
        formData.electionType === "Lok Sabha"
          ? formData.parliamentaryConstituency
          : formData.electionType === "Vidhan Sabha"
          ? formData.assemblyConstituency
          : formData.electionType === "Municipal Corporation"
          ? `${formData.district} (${formData.ward})`
          : `${formData.district} Hub`;

      const isDemo = formData.accountType === "Demo";

      const newCand: CandidateRecord = {
        id: generatedId,
        name: formData.nameEnglish.trim(),
        marathiName: formData.nameMarathi.trim(),
        username: formData.username.trim() || `cand_${Date.now()}`,
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        party: formData.partyEnglish.trim(),
        partyMarathi: formData.partyMarathi.trim(),
        symbol: formData.votingSymbol.trim(),
        electionType: formData.electionType,
        electionName: formData.electionName.trim(),
        electionYear: formData.electionYear.trim(),
        geography: geographySummary,
        accountType: formData.accountType,
        status: "Active",
        subscriptionStatus: "Active",
        planName: isDemo
          ? `${formData.electionType} (14-Day Pilot Demo)`
          : `${formData.electionType} Enterprise Pro`,
        planType: isDemo ? OrganizationPlanType.TRIAL_5D : OrganizationPlanType.OFFICE_12M,
        usersUsed: 1,
        usersAllowed: isDemo ? 10 : 50,
        aiAccess: isDemo ? false : formData.aiAccess,
        aiSeats: isDemo ? 0 : formData.aiSeats,
        campaignStatus: "Active",
        acquisitionSource: formData.acquisitionSource,
        acquisitionDistributor:
          formData.acquisitionSource === "Distributor"
            ? activeDistributor?.name || "MahaMedia Political Solutions"
            : "Direct Portal Provision",
        pendingEnquiries: 0,
        appName: formData.appName.trim() || `${formData.nameEnglish} Connect`,
        slipUrl: formData.slipUrl.trim() || `https://slips.indiata.gov.in/${generatedId.toLowerCase()}`,
        pdfAccess: formData.pdfAccess,
        excelAccess: formData.excelAccess,
        imageAccess: formData.imageAccess,
        apkAccess: formData.apkBuildAccess,
        createdAt: new Date().toISOString().split("T")[0]!,
        expiresAt: isDemo
          ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]!
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]!,
      };

      onCandidateCreated(newCand);
      setIsProvisioning(false);

      toast(
        `Candidate account ${newCand.name} (${newCand.id}) activated and credentials dispatched via ${formData.deliveryChannel.toUpperCase()}!`,
        "success"
      );
    }, 450);
  };

  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header & Cancel Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ACB9D1] dark:border-[#0e3554]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#010627] dark:text-[#F5F6F6]">
            Candidate Onboarding Wizard
          </h1>
          <p className="text-xs text-[#717785] dark:text-[#94A3B8] mt-0.5">
            Provision campaign accounts, configure jurisdiction hierarchies, and dispatch secure credentials.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          leftIcon={<X className="w-3.5 h-3.5" />}
        >
          Cancel Onboarding
        </Button>
      </div>

      {/* Wizard Progress Stepper (Horizontal) */}
      <div className="p-4 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#062237] shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#010627] dark:text-[#F5F6F6]">
            Step {currentStep} of {totalSteps}:{" "}
            <span className="text-[#2087FE] dark:text-[#0D79FD]">
              {WIZARD_STEPS[currentStep - 1]?.title}
            </span>
          </span>
          <span className="text-[#717785] dark:text-[#94A3B8] font-mono text-[11px]">
            {progressPercentage}% Complete
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-[#E0EDFE] dark:bg-[#011A2D] h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2087FE] dark:bg-[#0D79FD] rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Stepper Pills (Scrollable on small screens) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {WIZARD_STEPS.map((s) => {
            const isCompleted = s.id < currentStep;
            const isCurrent = s.id === currentStep;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleJumpToStep(s.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                  isCurrent
                    ? "bg-[#2087FE] dark:bg-[#0D79FD] text-white font-semibold shadow-xs"
                    : isCompleted
                    ? "bg-[#B3EDD7]/30 dark:bg-[#01C588]/15 text-[#12CF94] dark:text-[#01C588] border border-[#12CF94]/30 dark:border-[#01C588]/30"
                    : "bg-[#F3F8FD] dark:bg-[#072439] text-[#717785] dark:text-[#94A3B8] hover:text-[#010627] dark:hover:text-[#F5F6F6]"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3 h-3 text-[#12CF94] dark:text-[#01C588]" />
                ) : (
                  <span>{s.id}.</span>
                )}
                <span>{s.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Step Body Form Container */}
      <div className="p-5 sm:p-6 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#062237] shadow-xs min-h-[420px] flex flex-col justify-between">
        <div className="space-y-5">
          {/* STEP 1: Account Classification & Credentials */}
          {currentStep === 1 && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h2 className="text-base font-bold text-[#010627] dark:text-[#F5F6F6] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#2087FE] dark:text-[#0D79FD]" />
                  Step 1: Account Classification & Administrative Credentials
                </h2>
                <p className="text-xs text-[#717785] dark:text-[#94A3B8] mt-1">
                  Configure primary communication credentials and specify whether this is a paid commercial deployment or a temporary pilot demo.
                </p>
              </div>

              {/* Demo vs Permanent Selection */}
              <div className="p-4 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#F3F8FD]/50 dark:bg-[#072439] space-y-3">
                <label className="block text-xs font-semibold text-[#010627] dark:text-[#F5F6F6]">
                  Account Classification Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updateField("accountType", "Sale")}
                    className={`p-3 rounded-lg border text-left transition-colors flex flex-col justify-between cursor-pointer ${
                      formData.accountType === "Sale"
                        ? "border-[#2087FE] dark:border-[#0D79FD] bg-[#E0EDFE] dark:bg-[#0D79FD]/15 text-[#010627] dark:text-[#F5F6F6]"
                        : "border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#062237] text-[#717785] dark:text-[#94A3B8]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">Sale (Commercial Deployment)</span>
                      {formData.accountType === "Sale" && (
                        <CheckCircle2 className="w-4 h-4 text-[#2087FE] dark:text-[#0D79FD]" />
                      )}
                    </div>
                    <span className="text-[11px] text-[#717785] dark:text-[#94A3B8]">
                      Standard annual/6M validity, 50+ workers capacity, unwatermarked voter exports, and full AI access.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateField("accountType", "Demo")}
                    className={`p-3 rounded-lg border text-left transition-colors flex flex-col justify-between cursor-pointer ${
                      formData.accountType === "Demo"
                        ? "border-[#FC7C36] dark:border-[#F48637] bg-[#FC7C36]/10 dark:bg-[#F48637]/15 text-[#010627] dark:text-[#F5F6F6]"
                        : "border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#062237] text-[#717785] dark:text-[#94A3B8]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">Demo (14-Day Pilot)</span>
                      {formData.accountType === "Demo" && (
                        <CheckCircle2 className="w-4 h-4 text-[#FC7C36] dark:text-[#F48637]" />
                      )}
                    </div>
                    <span className="text-[11px] text-[#717785] dark:text-[#94A3B8]">
                      Strict 14-day validity, capped at 10 team workers, demo watermark on slips, no paid AI quotas.
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Administrative Username"
                  required
                  value={formData.username}
                  onChange={(e) => updateField("username", e.target.value)}
                  placeholder="e.g., rameshwar_patil"
                  helperText="Unique login identifier for the candidate."
                />
                <Input
                  label="Primary Contact Phone"
                  required
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+91 98220 00000"
                  error={errors.phone}
                  helperText="Used to dispatch one-time activation links."
                />
              </div>

              <Input
                label="Primary Email Address"
                type="email"
                required
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="candidate@campaign.in"
                error={errors.email}
              />

              {/* Password Option Advisory */}
              <div className="p-3 rounded-lg border border-[#ACB9D1] dark:border-[#0e3554] bg-[#F3F8FD]/50 dark:bg-[#072439] text-xs text-[#717785] dark:text-[#94A3B8] flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#2087FE] dark:text-[#0D79FD] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#010627] dark:text-[#F5F6F6] block font-semibold">
                    Encrypted Activation Flow Enforced
                  </strong>
                  To uphold enterprise cybersecurity, plaintext passwords are never set manually. The candidate will receive a time-limited one-time link upon creation.
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Candidate Identity */}
          {currentStep === 2 && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h2 className="text-base font-bold text-[#010627] dark:text-[#F5F6F6] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#2087FE] dark:text-[#0D79FD]" />
                  Step 2: Candidate Legal & Electoral Identity
                </h2>
                <p className="text-xs text-[#717785] dark:text-[#94A3B8] mt-1">
                  Specify both English and official Marathi (देवनागरी) naming for voter slips and ballot generation.
                </p>
              </div>

              <Input
                label="Candidate Full Name (English)"
                required
                value={formData.nameEnglish}
                onChange={(e) => updateField("nameEnglish", e.target.value)}
                placeholder="e.g., Rameshwar Anand Patil"
                error={errors.nameEnglish}
              />

              <Input
                label="Candidate Full Name (Marathi - देवनागरी)"
                required
                value={formData.nameMarathi}
                onChange={(e) => updateField("nameMarathi", e.target.value)}
                placeholder="उदा. रामेश्वर आनंद पाटील"
                error={errors.nameMarathi}
                helperText="Printed on official voter slips and mobile campaign header."
              />

              <Select
                label="Candidate Contestant Type"
                value={formData.candidateType}
                onChange={(e) => updateField("candidateType", e.target.value)}
                options={[
                  { value: "Single Contestant", label: "Single Contestant (Official Party Nominee)" },
                  { value: "Independent", label: "Independent Candidate (अपक्ष उमेदवार)" },
                  { value: "Panel / Alliance", label: "Alliance / Coalition Panel Candidate" },
                ]}
              />
            </div>
          )}

          {/* STEP 3: Political Party & Symbol */}
          {currentStep === 3 && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h2 className="text-base font-bold text-[#010627] dark:text-[#F5F6F6] flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#2087FE] dark:text-[#0D79FD]" />
                  Step 3: Political Party & Voting Symbol Assets
                </h2>
                <p className="text-xs text-[#717785] dark:text-[#94A3B8] mt-1">
                  Configure political affiliation and voting symbol rendered on mobile voter slips.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Party Name (English)"
                  required
                  value={formData.partyEnglish}
                  onChange={(e) => updateField("partyEnglish", e.target.value)}
                  placeholder="e.g., Bharatiya Janata Party"
                  error={errors.partyEnglish}
                />
                <Input
                  label="Party Name (Marathi)"
                  value={formData.partyMarathi}
                  onChange={(e) => updateField("partyMarathi", e.target.value)}
                  placeholder="उदा. भारतीय जनता पक्ष"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                <Input
                  label="Official Voting Symbol"
                  required
                  value={formData.votingSymbol}
                  onChange={(e) => updateField("votingSymbol", e.target.value)}
                  placeholder="e.g., Lotus / Clock / Bow"
                  error={errors.votingSymbol}
                />
                <div className="space-y-1">
                  <span className="block text-xs font-semibold text-[#010627] dark:text-[#F5F6F6] uppercase tracking-wider">
                    Symbol Asset Status
                  </span>
                  <div className="p-2.5 rounded-lg border border-[#ACB9D1] dark:border-[#0e3554] bg-[#F3F8FD] dark:bg-[#072439] flex items-center justify-between text-xs">
                    <span className="font-medium text-[#010627] dark:text-[#F5F6F6]">
                      Standard_Symbol_SVG.svg
                    </span>
                    <Badge variant="success">Verified</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Election Project Metadata */}
          {currentStep === 4 && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h2 className="text-base font-bold text-[#010627] dark:text-[#F5F6F6] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#2087FE] dark:text-[#0D79FD]" />
                  Step 4: Election Project Metadata
                </h2>
                <p className="text-xs text-[#717785] dark:text-[#94A3B8] mt-1">
                  Define the broad electoral tier and campaign project designation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Election Category *"
                  value={formData.electionType}
                  onChange={(e) => updateField("electionType", e.target.value as ElectionType)}
                  options={ELECTION_CATEGORIES}
                />
                <Input
                  label="Election Year *"
                  value={formData.electionYear}
                  onChange={(e) => updateField("electionYear", e.target.value)}
                  placeholder="2024"
                  error={errors.electionYear}
                />
              </div>

              <Input
                label="Official Project Title / Code"
                value={formData.electionProject}
                onChange={(e) => updateField("electionProject", e.target.value)}
                placeholder="e.g., Assembly Sweep 2024"
                helperText="Internal code name used for Super Admin metrics and reporting."
              />
            </div>
          )}

          {/* STEP 5: Dynamic Election Geography */}
          {currentStep === 5 && (
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#010627] dark:text-[#F5F6F6] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#2087FE] dark:text-[#0D79FD]" />
                    Step 5: Dynamic Geographic Jurisdiction
                  </h2>
                  <p className="text-xs text-[#717785] dark:text-[#94A3B8] mt-1">
                    Tailored jurisdiction fields for <strong className="text-[#010627] dark:text-[#F5F6F6]">{formData.electionType}</strong>:
                  </p>
                </div>
                <Badge variant="purple">{formData.electionType}</Badge>
              </div>

              {/* Dynamic form fields based on Election Category */}
              {formData.electionType === "Lok Sabha" && (
                <div className="space-y-3 p-4 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#F3F8FD]/50 dark:bg-[#072439]">
                  <Input
                    label="Parliamentary Constituency (PC)"
                    required
                    value={formData.parliamentaryConstituency}
                    onChange={(e) => updateField("parliamentaryConstituency", e.target.value)}
                    placeholder="e.g., Baramati (PC-35)"
                    error={errors.parliamentaryConstituency}
                  />
                  <Input
                    label="Included Assembly Segments (ACs)"
                    defaultValue="Daund, Indapur, Baramati, Purandar, Bhor, Khadakwasla"
                    helperText="Assembly segments composing this parliamentary jurisdiction."
                  />
                </div>
              )}

              {formData.electionType === "Vidhan Sabha" && (
                <div className="space-y-3 p-4 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#F3F8FD]/50 dark:bg-[#072439]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Select
                      label="District"
                      value={formData.district}
                      onChange={(e) => updateField("district", e.target.value)}
                      options={MAHARASHTRA_DISTRICTS.map((d) => ({ value: d, label: d }))}
                    />
                    <Input
                      label="Assembly Constituency (AC)"
                      required
                      value={formData.assemblyConstituency}
                      onChange={(e) => updateField("assemblyConstituency", e.target.value)}
                      placeholder="e.g., Kothrud (AC-210)"
                      error={errors.assemblyConstituency}
                    />
                  </div>
                  <Input
                    label="Authorized Booth Count"
                    type="number"
                    value={formData.boothCount}
                    onChange={(e) => updateField("boothCount", e.target.value)}
                    placeholder="342"
                    helperText="Total polling stations in this assembly constituency."
                  />
                </div>
              )}

              {formData.electionType === "Municipal Corporation" && (
                <div className="space-y-3 p-4 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#F3F8FD]/50 dark:bg-[#072439]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Select
                      label="Municipal Corporation City"
                      value={formData.district}
                      onChange={(e) => updateField("district", e.target.value)}
                      options={[
                        { value: "Pune", label: "Pune Municipal Corporation (PMC)" },
                        { value: "Mumbai City", label: "Brihanmumbai Municipal Corp (BMC)" },
                        { value: "Thane", label: "Thane Municipal Corporation (TMC)" },
                        { value: "Nagpur", label: "Nagpur Municipal Corporation (NMC)" },
                      ]}
                    />
                    <Input
                      label="Prabhag / Ward Number"
                      required
                      value={formData.ward}
                      onChange={(e) => updateField("ward", e.target.value)}
                      placeholder="e.g., Ward 14"
                      error={errors.ward}
                    />
                  </div>
                </div>
              )}

              {(formData.electionType === "Zilla Parishad" ||
                formData.electionType === "Nagar Parishad" ||
                formData.electionType === "Gram Panchayat") && (
                <div className="space-y-3 p-4 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#F3F8FD]/50 dark:bg-[#072439]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Select
                      label="District"
                      value={formData.district}
                      onChange={(e) => updateField("district", e.target.value)}
                      options={MAHARASHTRA_DISTRICTS.map((d) => ({ value: d, label: d }))}
                    />
                    <Input
                      label="Taluka / Electoral Circle"
                      defaultValue="Badnapur Circle 04"
                      onChange={(e) => updateField("assemblyConstituency", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: White-label Application Details */}
          {currentStep === 6 && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h2 className="text-base font-bold text-[#010627] dark:text-[#F5F6F6] flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#2087FE] dark:text-[#0D79FD]" />
                  Step 6: White-label Application Setup
                </h2>
                <p className="text-xs text-[#717785] dark:text-[#94A3B8] mt-1">
                  Configure candidate branding and citizen-facing voter search endpoints.
                </p>
              </div>

              <Input
                label="Branded Application Title"
                value={formData.appName}
                onChange={(e) => updateField("appName", e.target.value)}
                placeholder="e.g., Rameshwar Patil Connect"
                helperText="Displayed in mobile app header and APK manifest."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Official WhatsApp Campaign No."
                  value={formData.whatsappNumber}
                  onChange={(e) => updateField("whatsappNumber", e.target.value)}
                  placeholder="+91 98220 00000"
                  helperText="Helpline number for voter slip inquiries."
                />
                <Input
                  label="Voter Slip Public Endpoint"
                  value={formData.slipUrl}
                  onChange={(e) => updateField("slipUrl", e.target.value)}
                  placeholder="https://slips.indiata.gov.in/ac210"
                />
              </div>
            </div>
          )}

          {/* STEP 7: Administrative Feature Access */}
          {currentStep === 7 && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h2 className="text-base font-bold text-[#010627] dark:text-[#F5F6F6] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#2087FE] dark:text-[#0D79FD]" />
                  Step 7: Administrative Feature Access Permissions
                </h2>
                <p className="text-xs text-[#717785] dark:text-[#94A3B8] mt-1">
                  Authorize specific export tools and AI capabilities for this candidate:
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    key: "pdfAccess",
                    label: "Voter List PDF Export Access",
                    desc: "Allows generating booth reports, alphabetical lists, and voter slips in PDF.",
                  },
                  {
                    key: "excelAccess",
                    label: "Voter List Excel/CSV Extraction",
                    desc: "Authorizes raw data exports for third-party analytics.",
                  },
                  {
                    key: "imageAccess",
                    label: "Voter Slip Image Generation",
                    desc: "Creates JPEG voter slips tailored for 1-click WhatsApp transmission.",
                  },
                  {
                    key: "apkBuildAccess",
                    label: "Standalone White-label APK Compilation",
                    desc: "Compiles custom branded Android APK binary for field volunteers.",
                  },
                ].map((perm) => (
                  <div
                    key={perm.key}
                    className="p-3 rounded-lg border border-[#ACB9D1] dark:border-[#0e3554] bg-[#F3F8FD]/50 dark:bg-[#072439] flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#010627] dark:text-[#F5F6F6]">
                        {perm.label}
                      </div>
                      <div className="text-[11px] text-[#717785] dark:text-[#94A3B8]">{perm.desc}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(formData[perm.key as keyof typeof formData])}
                      onChange={(e) => updateField(perm.key, e.target.checked)}
                      className="w-4 h-4 rounded text-[#2087FE] dark:text-[#0D79FD] focus:ring-[#2087FE] dark:focus:ring-[#0D79FD] cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              {formData.accountType === "Sale" && (
                <div className="p-3.5 rounded-lg border border-[#6C43FC]/30 dark:border-[#6C43FC]/40 bg-[#6C43FC]/10 dark:bg-[#072439] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[#6C43FC] dark:text-[#6C43FC] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#6C43FC]" />
                      INDIATA AI Intelligence Engine Access
                    </div>
                    <div className="text-[11px] text-[#717785] dark:text-[#94A3B8]">
                      Enables natural language booth sentiment synthesis and voice speech drafts.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.aiAccess}
                    onChange={(e) => updateField("aiAccess", e.target.checked)}
                    className="w-4 h-4 rounded text-[#2087FE] dark:text-[#0D79FD] cursor-pointer"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 8: Acquisition Channel Source */}
          {currentStep === 8 && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h2 className="text-base font-bold text-[#010627] dark:text-[#F5F6F6] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#2087FE] dark:text-[#0D79FD]" />
                  Step 8: Acquisition Channel Attribution
                </h2>
                <p className="text-xs text-[#717785] dark:text-[#94A3B8] mt-1">
                  Attribute this candidate onboarding to a regional franchise distributor partner or direct headquarters.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-[#010627] dark:text-[#F5F6F6]">
                  Channel Attribution Origin
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updateField("acquisitionSource", "Distributor")}
                    className={`p-3 rounded-lg border text-left transition-colors flex items-center justify-between cursor-pointer ${
                      formData.acquisitionSource === "Distributor"
                        ? "border-[#2087FE] dark:border-[#0D79FD] bg-[#E0EDFE] dark:bg-[#0D79FD]/15 text-[#010627] dark:text-[#F5F6F6] font-semibold"
                        : "border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#072439] text-[#717785] dark:text-[#94A3B8]"
                    }`}
                  >
                    <span className="text-xs">Distributor Partner Franchise</span>
                    {formData.acquisitionSource === "Distributor" && (
                      <CheckCircle2 className="w-4 h-4 text-[#2087FE] dark:text-[#0D79FD]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => updateField("acquisitionSource", "Direct")}
                    className={`p-3 rounded-lg border text-left transition-colors flex items-center justify-between cursor-pointer ${
                      formData.acquisitionSource === "Direct"
                        ? "border-[#2087FE] dark:border-[#0D79FD] bg-[#E0EDFE] dark:bg-[#0D79FD]/15 text-[#010627] dark:text-[#F5F6F6] font-semibold"
                        : "border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#072439] text-[#717785] dark:text-[#94A3B8]"
                    }`}
                  >
                    <span className="text-xs">Direct Site / Super Admin</span>
                    {formData.acquisitionSource === "Direct" && (
                      <CheckCircle2 className="w-4 h-4 text-[#2087FE] dark:text-[#0D79FD]" />
                    )}
                  </button>
                </div>

                {formData.acquisitionSource === "Distributor" && (
                  <div className="pt-2">
                    <Select
                      label="Attributed Distributor Partner"
                      value={formData.distributorId}
                      onChange={(e) => updateField("distributorId", e.target.value)}
                      options={distributors.map((d) => ({
                        value: d.id,
                        label: `${d.name} (${d.id}) - ${d.city}`,
                      }))}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 9: Review-Before-Submit Screen */}
          {currentStep === 9 && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h2 className="text-base font-bold text-[#010627] dark:text-[#F5F6F6] flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#2087FE] dark:text-[#0D79FD]" />
                  Step 9: Review Before Account Creation
                </h2>
                <p className="text-xs text-[#717785] dark:text-[#94A3B8] mt-1">
                  Confirm candidate parameters before allocating database partitions and generating credentials.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#F3F8FD]/50 dark:bg-[#072439] text-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-[#ACB9D1]/30 dark:border-[#0e3554]/50">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Candidate Name</span>
                  <div className="text-right">
                    <span className="font-bold text-[#010627] dark:text-[#F5F6F6] block">
                      {formData.nameEnglish || "N/A"}
                    </span>
                    <span className="text-[#717785] dark:text-[#94A3B8]">{formData.nameMarathi}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-[#ACB9D1]/30 dark:border-[#0e3554]/50">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Account Classification</span>
                  <Badge variant={formData.accountType === "Sale" ? "success" : "warning"}>
                    {formData.accountType === "Sale" ? "Commercial Deployment" : "14-Day Pilot Demo"}
                  </Badge>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-[#ACB9D1]/30 dark:border-[#0e3554]/50">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Election & Jurisdiction</span>
                  <span className="font-medium text-[#010627] dark:text-[#F5F6F6]">
                    {formData.electionType} •{" "}
                    {formData.electionType === "Lok Sabha"
                      ? formData.parliamentaryConstituency
                      : formData.assemblyConstituency}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-[#ACB9D1]/30 dark:border-[#0e3554]/50">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Party & Symbol</span>
                  <span className="font-medium text-[#010627] dark:text-[#F5F6F6]">
                    {formData.partyEnglish} ({formData.votingSymbol})
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-[#ACB9D1]/30 dark:border-[#0e3554]/50">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Contact Information</span>
                  <span className="font-mono text-[#010627] dark:text-[#F5F6F6]">
                    {formData.phone} • {formData.email}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#717785] dark:text-[#94A3B8]">Attributed Channel</span>
                  <span className="font-medium text-[#010627] dark:text-[#F5F6F6]">
                    {formData.acquisitionSource === "Distributor"
                      ? `Distributor (${formData.distributorId})`
                      : "Direct HQ"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 10: Activation & Launch Confirmation Screen */}
          {currentStep === 10 && (
            <div className="space-y-4 max-w-xl text-center py-4 mx-auto">
              <div className="w-14 h-14 rounded-full bg-[#B3EDD7] dark:bg-[#01C588]/20 text-[#12CF94] dark:text-[#01C588] flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-[#010627] dark:text-[#F5F6F6]">
                Ready to Provision Candidate Account
              </h2>
              <p className="text-xs text-[#717785] dark:text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                Clicking confirm will establish voter partitions, assign quotas, and dispatch the encrypted administrative activation link to:
              </p>

              <div className="p-3.5 rounded-lg bg-[#F3F8FD] dark:bg-[#072439] border border-[#ACB9D1] dark:border-[#0e3554] text-xs font-mono text-[#010627] dark:text-[#F5F6F6] max-w-sm mx-auto">
                <div>{formData.nameEnglish}</div>
                <div className="text-[#717785] dark:text-[#94A3B8] mt-1">{formData.phone} • {formData.email}</div>
              </div>

              {/* Delivery Channel Selector */}
              <div className="text-left space-y-1.5 max-w-sm mx-auto pt-2">
                <label className="block text-xs font-semibold text-[#010627] dark:text-[#F5F6F6]">
                  Select Dispatch Channel:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "whatsapp", label: "WhatsApp" },
                    { id: "email", label: "Email" },
                    { id: "both", label: "Both" },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => updateField("deliveryChannel", ch.id)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                        formData.deliveryChannel === ch.id
                          ? "border-[#2087FE] dark:border-[#0D79FD] bg-[#E0EDFE] dark:bg-[#0D79FD]/15 text-[#2087FE] dark:text-[#0D79FD] font-semibold"
                          : "border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#072439] text-[#717785] dark:text-[#94A3B8]"
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleFinalActivation}
                  isLoading={isProvisioning}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Confirm & Provision Account
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Control Navigation Footer */}
        {currentStep < 10 && (
          <div className="mt-8 pt-4 border-t border-[#ACB9D1] dark:border-[#0e3554] flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={currentStep === 1}
              onClick={handleBack}
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Previous Step
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              {currentStep === 9 ? "Proceed to Activation" : "Continue to Next Step"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Check, ChevronRight, UserPlus, Building, CreditCard, Sparkles } from "lucide-react";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Switch } from "../ui/switch";
import { useToast } from "../../context/toast-context";
import { CandidateRecord, ElectionType } from "../../types/superadmin.types";
import { OrganizationPlanType } from "@rajtantra/common-types";

export interface AddCandidateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCandidateAdded: (newCandidate: CandidateRecord) => void;
}

export function AddCandidateDialog({
  isOpen,
  onClose,
  onCandidateAdded,
}: AddCandidateDialogProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [fullName, setFullName] = useState("");
  const [marathiName, setMarathiName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [electionType, setElectionType] = useState<ElectionType>("Vidhan Sabha");
  const [constituency, setConstituency] = useState("");
  const [party, setParty] = useState("Bharatiya Janata Party");
  const [accountType, setAccountType] = useState<"Sale" | "Demo">("Sale");
  const [maxWorkers, setMaxWorkers] = useState("50");
  const [aiAccess, setAiAccess] = useState(true);
  const [aiSeats, setAiSeats] = useState("5");
  const [appName, setAppName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (currentStep === 1) {
      if (!fullName.trim() || !phone.trim()) {
        toast("Full Name and Contact Number are required.", "warning");
        return;
      }
    } else if (currentStep === 2) {
      if (!constituency.trim()) {
        toast("Constituency details are required.", "warning");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const today = new Date().toISOString().split("T")[0] || "2026-10-28";
      const newCand: CandidateRecord = {
        id: `CAN-${Math.floor(8100 + Math.random() * 900)}`,
        name: fullName || "Aniket Patil",
        marathiName: marathiName || "अननिकेत पाटील",
        username: fullName.toLowerCase().replace(/\s+/g, "_") || "aniket_patil",
        email: email || "candidate@indiata.gov.in",
        phone: phone || "+91 98200 00000",
        party: party,
        partyMarathi: party === "Bharatiya Janata Party" ? "भारतीय जनता पक्ष" : "राष्ट्रवादी काँग्रेस",
        symbol: "Standard Symbol",
        electionType: electionType,
        electionName: `${constituency} Election 2024`,
        electionYear: "2024",
        geography: constituency || "Pune Area",
        accountType: accountType,
        status: "Active",
        subscriptionStatus: "Active",
        planName: accountType === "Demo" ? "5-Day Evaluation Trial" : "Enterprise Annual Plan",
        planType: accountType === "Demo" ? OrganizationPlanType.TRIAL_5D : OrganizationPlanType.OFFICE_12M,
        usersUsed: 1,
        usersAllowed: parseInt(maxWorkers, 10) || 50,
        aiAccess: aiAccess,
        aiSeats: aiAccess ? parseInt(aiSeats, 10) || 5 : 0,
        campaignStatus: "Active",
        acquisitionSource: "Direct",
        acquisitionDistributor: "Direct Platform Portal",
        pendingEnquiries: 0,
        appName: appName || `${fullName || "Candidate"} Connect`,
        slipUrl: `https://slips.indiata.gov.in/${fullName.toLowerCase().replace(/\s+/g, "") || "portal"}`,
        pdfAccess: true,
        excelAccess: true,
        imageAccess: true,
        apkAccess: true,
        createdAt: today,
        expiresAt: accountType === "Demo" ? "2026-11-05" : "2027-10-28",
      };

      onCandidateAdded(newCand);
      setIsSubmitting(false);
      toast(`Candidate ${newCand.name} (${newCand.id}) successfully provisioned. Welcome SMS dispatched.`, "success");
      onClose();
      // Reset form
      setCurrentStep(1);
      setFullName("");
      setMarathiName("");
      setPhone("");
      setEmail("");
      setConstituency("");
    }, 600);
  };

  const steps = [
    { num: 1, label: "Identity", icon: <UserPlus className="w-3.5 h-3.5" /> },
    { num: 2, label: "Jurisdiction", icon: <Building className="w-3.5 h-3.5" /> },
    { num: 3, label: "Quotas", icon: <CreditCard className="w-3.5 h-3.5" /> },
    { num: 4, label: "Branding", icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Provision New Candidate Account"
      description="Step-by-step tenant creation, jurisdiction scope, quotas, and mobile app configuration."
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={currentStep === 1 ? onClose : handlePrev}
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>

          <div className="flex items-center gap-2">
            {currentStep < 4 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleNext}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Proceed to Step {currentStep + 1}
              </Button>
            ) : (
              <Button
                variant="success"
                size="sm"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                leftIcon={<Check className="w-3.5 h-3.5" />}
              >
                Complete Provisioning
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Step Indicator Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          {steps.map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    currentStep === s.num
                      ? "bg-sky-600 text-white"
                      : currentStep > s.num
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {currentStep > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span
                  className={`text-xs hidden sm:inline font-medium ${
                    currentStep === s.num
                      ? "text-slate-900 dark:text-slate-100 font-semibold"
                      : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 bg-slate-200 dark:bg-slate-800" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Credentials & Identity */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Candidate Full Name (English)*"
                placeholder="e.g. Rameshwar Patil"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Candidate Name (Marathi)*"
                placeholder="उदा. रामेश्वर पाटील"
                value={marathiName}
                onChange={(e) => setMarathiName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Primary Contact Phone (10 Digits)*"
                placeholder="+91 98220 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Input
                label="Official Campaign Email"
                placeholder="office@candidatecampaign.in"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 2: Jurisdiction & Scope */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Election Type Hierarchy*"
                value={electionType}
                onChange={(e) => setElectionType(e.target.value as ElectionType)}
                options={[
                  { value: "Vidhan Sabha", label: "Vidhan Sabha (Assembly)" },
                  { value: "Lok Sabha", label: "Lok Sabha (Parliamentary)" },
                  { value: "Municipal Corporation", label: "Municipal Corporation (Maha-Nagar Palika)" },
                  { value: "Zilla Parishad", label: "Zilla Parishad / Taluka" },
                  { value: "Nagar Parishad", label: "Nagar Parishad" },
                  { value: "Gram Panchayat", label: "Gram Panchayat" },
                ]}
              />
              <Input
                label="Constituency / Area / Ward*"
                placeholder="e.g. Pune Cantonment (AC-214)"
                value={constituency}
                onChange={(e) => setConstituency(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Political Party"
                value={party}
                onChange={(e) => setParty(e.target.value)}
                options={[
                  { value: "Bharatiya Janata Party", label: "Bharatiya Janata Party (BJP)" },
                  { value: "Nationalist Congress Party", label: "Nationalist Congress Party (NCP)" },
                  { value: "Indian National Congress", label: "Indian National Congress (INC)" },
                  { value: "Shiv Sena", label: "Shiv Sena" },
                  { value: "Independent", label: "Independent / Other" },
                ]}
              />
              <Input
                label="Public Voter Slip Subdomain Slug"
                placeholder="e.g. pune214"
                helperText="Will map to slips.indiata.gov.in/<slug>"
              />
            </div>
          </div>
        )}

        {/* Step 3: Quotas & Commercial Account Type */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Commercial Account Tier*"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value as "Sale" | "Demo")}
                options={[
                  { value: "Sale", label: "Permanent / Annual Commercial Sale" },
                  { value: "Demo", label: "Demo Account (5-Day Evaluation Trial)" },
                ]}
              />
              <Input
                label="Maximum Field Workers Allowed*"
                type="number"
                value={maxWorkers}
                onChange={(e) => setMaxWorkers(e.target.value)}
              />
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <Switch
                checked={aiAccess}
                onChange={setAiAccess}
                label="Enable Agentic AI Digital Karyakarta"
                description="Allows natural-language query filters, instant report generation, and strategy assistant."
              />
              {aiAccess && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <Input
                    label="Allocated AI Seats Quota"
                    type="number"
                    value={aiSeats}
                    onChange={(e) => setAiSeats(e.target.value)}
                    helperText="Number of war-room strategists entitled to concurrent AI mode."
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Branding & App Deployment */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <Input
              label="Mobile Application Display Name"
              placeholder="e.g. Patil Express 2024"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              helperText="The branded title displayed on workers' Android & iOS home screens."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="text-xs text-slate-700 dark:text-slate-300">
                <span className="font-semibold block mb-1">Deployment Flags:</span>
                <ul className="space-y-1 text-slate-500 list-disc list-inside">
                  <li>Automatic Welcome SMS with initial passwords</li>
                  <li>Prisma tenant isolation initialization</li>
                  <li>Default 22 caste/scheme filter schemas</li>
                </ul>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                <span className="font-semibold block mb-1">Immediate Provisioning:</span>
                <p className="text-slate-500">
                  Clicking Complete Provisioning writes the client organization, triggers database schemas, and adds the tenant to the global catalog.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}

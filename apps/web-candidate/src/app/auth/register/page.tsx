"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  Vote,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api-client";
import { RegisterEnquiryResult } from "@rajtantra/common-types";

// Standard Election Tiers
const ELECTION_TYPES = [
  { id: "LOK_SABHA", label: "Lok Sabha (Parliament)", desc: "National Parliamentary General / By-Election" },
  { id: "VIDHAN_SABHA", label: "Vidhan Sabha (Assembly)", desc: "State Legislative Assembly General / By-Election" },
  { id: "MUNICIPAL", label: "Municipal Corporation", desc: "Maha-Nagar Palika / Nagar Parishad Ward Elections" },
  { id: "ZILLA_PARISHAD", label: "Zilla Parishad", desc: "District Level Panchayati Raj Election" },
  { id: "GRAM_PANCHAYAT", label: "Gram Panchayat", desc: "Village Level Local Body Election" },
];

// Available Data & Service Addons
const DATA_SERVICES = [
  { id: "VOTER_DATA", title: "Official Electoral Roll Indexing", desc: "Full constituency voter list with OCR verification & duplicate detection" },
  { id: "BOOTH_DATA", title: "Polling Booth & BLO Directory", desc: "Polling station GPS coordinates and mapped government BLO contacts" },
  { id: "HISTORICAL_DATA", title: "Historical Election Trends (2014-2024)", desc: "Booth-level winning margins, voter turnout, and party swing analytics" },
  { id: "AI_MODE", title: "AI Karyakarta & Strategy Bot RAG", desc: "Digital campaign assistant with natural language query parsing" },
  { id: "OUTREACH_HUB", title: "Meta WhatsApp & Voice Broadcast Setup", desc: "Official WhatsApp Cloud API templates and AI Voice calling integration" },
];

export default function RegisterEnquiryPage() {
  const router = useRouter();
  const { isAuthenticated, isDevPreview } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // In UI preview development mode, redirect away from the registration flow
  useEffect(() => {
    if (isDevPreview || isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isDevPreview, isAuthenticated, router]);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Account
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",

    // Step 2: Candidate & Organization
    candidateName: "",
    candidateContact: "",
    candidateType: "MLA",
    partyName: "",

    // Step 3: Election Type
    electionType: "VIDHAN_SABHA",

    // Step 4: Geography
    state: "Maharashtra",
    district: "Pune",
    constituencyName: "",
    subDivision: "",
    boothsCount: 250,

    // Step 5: Election Details
    electionName: "Maharashtra Assembly General Election 2026",
    electionYear: 2026,
    pollingDate: "2026-11-20",

    // Step 6: Data & Services
    requestedServices: ["VOTER_DATA", "BOOTH_DATA", "AI_MODE"],
    notes: "",
  });

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMsg(null);
  };

  const toggleService = (serviceId: string) => {
    setFormData((prev) => {
      const exists = prev.requestedServices.includes(serviceId);
      return {
        ...prev,
        requestedServices: exists
          ? prev.requestedServices.filter((s) => s !== serviceId)
          : [...prev.requestedServices, serviceId],
      };
    });
  };

  const handleNextStep = () => {
    setErrorMsg(null);

    // Step 1 Validation
    if (currentStep === 1) {
      if (!formData.fullName.trim()) return setErrorMsg("Full name is required.");
      if (formData.mobile.trim().length < 10) return setErrorMsg("Valid 10-digit mobile number is required.");
      if (formData.password.length < 6) return setErrorMsg("Password must be at least 6 characters.");
      if (formData.password !== formData.confirmPassword) return setErrorMsg("Passwords do not match.");
      // Auto-populate candidate name and contact if empty
      if (!formData.candidateName) updateField("candidateName", formData.fullName);
      if (!formData.candidateContact) updateField("candidateContact", formData.mobile);
    }

    // Step 2 Validation
    if (currentStep === 2) {
      if (!formData.candidateName.trim()) return setErrorMsg("Candidate name is required.");
      if (!formData.partyName.trim()) return setErrorMsg("Party / Organization name is required.");
    }

    // Step 4 Validation
    if (currentStep === 4) {
      if (!formData.state.trim()) return setErrorMsg("State is required.");
      if (!formData.district.trim()) return setErrorMsg("District is required.");
      if (!formData.constituencyName.trim()) return setErrorMsg("Constituency name is required.");
    }

    setCurrentStep((prev) => Math.min(prev + 1, 7));
  };

  const handlePrevStep = () => {
    setErrorMsg(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        fullName: formData.fullName,
        mobile: formData.mobile,
        email: formData.email || undefined,
        password: formData.password,
        candidateName: formData.candidateName,
        candidateContact: formData.candidateContact,
        candidateType: formData.candidateType,
        partyName: formData.partyName,
        electionType: formData.electionType,
        state: formData.state,
        district: formData.district,
        constituencyName: formData.constituencyName,
        subDivision: formData.subDivision || undefined,
        boothsCount: Number(formData.boothsCount) || 0,
        electionName: formData.electionName || undefined,
        electionYear: Number(formData.electionYear) || 2026,
        pollingDate: formData.pollingDate || undefined,
        requestedServices: formData.requestedServices,
        notes: formData.notes || undefined,
      };

      const response = await apiFetch<RegisterEnquiryResult>("/auth/register-enquiry", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.success && response.data) {
        const enqNum = response.data.enquiryNumber;
        router.push(
          `/auth/register/success?enq=${encodeURIComponent(enqNum)}&candidate=${encodeURIComponent(
            formData.candidateName,
          )}&constituency=${encodeURIComponent(formData.constituencyName)}`,
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit enquiry. Please check your inputs.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels = [
    "Account",
    "Candidate",
    "Election",
    "Geography",
    "Details",
    "Services",
    "Review",
  ];

  return (
    <div className="min-h-screen bg-[#F3F8FD] dark:bg-[#011A2D] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-[#2087FE] items-center justify-center text-white shadow-md mb-2">
            <Vote className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#010627] dark:text-[#F5F6F6]">
            Candidate Registration Enquiry
          </h1>
          <p className="text-xs text-[#717785] dark:text-[#94A3B8] mt-1">
            Complete the 7-step election configuration for Super Admin review & activation
          </p>
        </div>

        {/* 7-Step Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {stepLabels.map((label, index) => {
              const stepNumber = index + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;

              return (
                <div key={label} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isCompleted
                        ? "bg-[#12CF94] text-white"
                        : isCurrent
                          ? "bg-[#2087FE] text-white ring-4 ring-[#2087FE]/20"
                          : "bg-slate-200 dark:bg-[#072439] text-[#717785] dark:text-[#94A3B8]"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepNumber}
                  </div>
                  <span
                    className={`mt-1.5 text-[10px] font-medium hidden sm:block ${
                      isCurrent
                        ? "text-[#2087FE] font-bold"
                        : isCompleted
                          ? "text-[#12CF94]"
                          : "text-[#717785] dark:text-[#94A3B8]"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Card Content */}
        <Card className="border-[#ACB9D1] dark:border-[#0e3554] shadow-sm">
          {errorMsg && (
            <div className="m-5 mb-0 p-3.5 rounded-lg bg-[#FFDAD6] border border-[#BA1A1A]/30 text-[#BA1A1A] text-xs font-medium flex items-start gap-2">
              <Shield className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2087FE] uppercase tracking-wider">
                Step {currentStep} of 7: {stepLabels[currentStep - 1]}
              </span>
              <Badge variant="neutral">Pre-Activation Enquiry</Badge>
            </div>
            <CardTitle className="text-lg mt-1">
              {currentStep === 1 && "Account Credentials"}
              {currentStep === 2 && "Candidate & Organization Profile"}
              {currentStep === 3 && "Select Election Tier"}
              {currentStep === 4 && "Election Geography & Booth Scope"}
              {currentStep === 5 && "Election Schedule & Details"}
              {currentStep === 6 && "Required Data & Services"}
              {currentStep === 7 && "Review & Submit Registration Enquiry"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Provide the administrative login credentials for your campaign manager."}
              {currentStep === 2 && "Candidate identifying information and political party affiliation."}
              {currentStep === 3 && "The election tier determines the geographic hierarchy and field tools."}
              {currentStep === 4 && "Specify the constituency territory to scope voter roll and booth allocations."}
              {currentStep === 5 && "Election dates and estimated electoral scale."}
              {currentStep === 6 && "Select the voter data sets and automated outreach modules required."}
              {currentStep === 7 && "Carefully review all selections before submitting to Super Admin for verification."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* STEP 1: Account Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <Input
                  label="Campaign Manager Full Name"
                  placeholder="e.g. Rameshwar Patil"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Mobile Number (Login ID)"
                    placeholder="e.g. 9822014590"
                    value={formData.mobile}
                    onChange={(e) => updateField("mobile", e.target.value)}
                    required
                  />
                  <Input
                    label="Email Address (Optional)"
                    type="email"
                    placeholder="e.g. contact@patilcampaign.in"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    required
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Candidate & Organization Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Official Candidate Name"
                    placeholder="e.g. Anand Shinde"
                    value={formData.candidateName}
                    onChange={(e) => updateField("candidateName", e.target.value)}
                    required
                  />
                  <Input
                    label="Candidate Contact Number"
                    placeholder="e.g. 9890188421"
                    value={formData.candidateContact}
                    onChange={(e) => updateField("candidateContact", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#010627] dark:text-[#F5F6F6] mb-1.5 uppercase tracking-wide">
                      Candidate Type <span className="text-[#BA1A1A]">*</span>
                    </label>
                    <select
                      value={formData.candidateType}
                      onChange={(e) => updateField("candidateType", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] border-[#ACB9D1] dark:border-[#0e3554] focus:ring-2 focus:ring-[#2087FE]"
                    >
                      <option value="MP">Member of Parliament (MP)</option>
                      <option value="MLA">Member of Legislative Assembly (MLA)</option>
                      <option value="CORPORATOR">Municipal Corporator / Ward Councillor</option>
                      <option value="ZP_MEMBER">Zilla Parishad Member</option>
                      <option value="GRAM_PANCHAYAT">Sarpanch / Gram Panchayat Member</option>
                      <option value="OTHER">Other Campaign Representative</option>
                    </select>
                  </div>

                  <Input
                    label="Political Party / Organization"
                    placeholder="e.g. Bharatiya Janata Party, NCP, INC, Independent"
                    value={formData.partyName}
                    onChange={(e) => updateField("partyName", e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Election Type */}
            {currentStep === 3 && (
              <div className="space-y-3">
                {ELECTION_TYPES.map((tier) => {
                  const isSelected = formData.electionType === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => updateField("electionType", tier.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                        isSelected
                          ? "bg-[#E0EDFE]/50 dark:bg-[#072439] border-[#2087FE] ring-2 ring-[#2087FE]/20"
                          : "bg-white dark:bg-[#062237] border-[#ACB9D1] dark:border-[#0e3554] hover:border-[#2087FE]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "border-[#2087FE] bg-[#2087FE] text-white"
                              : "border-[#ACB9D1]"
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#010627] dark:text-[#F5F6F6]">
                            {tier.label}
                          </div>
                          <div className="text-xs text-[#717785] dark:text-[#94A3B8] mt-0.5">
                            {tier.desc}
                          </div>
                        </div>
                      </div>
                      <Badge variant={isSelected ? "primary" : "neutral"} size="sm">
                        {tier.id}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP 4: Election Geography */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="State"
                    placeholder="e.g. Maharashtra"
                    value={formData.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    required
                  />
                  <Input
                    label="District"
                    placeholder="e.g. Pune"
                    value={formData.district}
                    onChange={(e) => updateField("district", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Constituency Name & Number"
                    placeholder="e.g. 215 - Kasba Peth"
                    value={formData.constituencyName}
                    onChange={(e) => updateField("constituencyName", e.target.value)}
                    required
                  />
                  <Input
                    label="Sub-Division / Ward / Segment"
                    placeholder="e.g. Pune Cantonment Division"
                    value={formData.subDivision}
                    onChange={(e) => updateField("subDivision", e.target.value)}
                  />
                </div>

                <Input
                  label="Estimated Polling Booths Count"
                  type="number"
                  placeholder="e.g. 250"
                  value={formData.boothsCount}
                  onChange={(e) => updateField("boothsCount", e.target.value)}
                  helperText="Approximate number of polling stations in your constituency"
                />
              </div>
            )}

            {/* STEP 5: Election Details */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <Input
                  label="Election Campaign Title"
                  placeholder="e.g. Maharashtra Vidhan Sabha 2026 Campaign"
                  value={formData.electionName}
                  onChange={(e) => updateField("electionName", e.target.value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Election Year"
                    type="number"
                    value={formData.electionYear}
                    onChange={(e) => updateField("electionYear", e.target.value)}
                  />
                  <Input
                    label="Expected Polling Date"
                    type="date"
                    value={formData.pollingDate}
                    onChange={(e) => updateField("pollingDate", e.target.value)}
                    helperText="Election Module remains valid until 15 days post-polling date"
                  />
                </div>
              </div>
            )}

            {/* STEP 6: Data & Service Selection */}
            {currentStep === 6 && (
              <div className="space-y-3">
                <p className="text-xs text-[#717785] dark:text-[#94A3B8] mb-2">
                  Select the specialized data rolls and campaign modules you require. Final terms will be reviewed by Super Admin.
                </p>
                {DATA_SERVICES.map((service) => {
                  const isChecked = formData.requestedServices.includes(service.id);
                  return (
                    <div
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-colors flex items-start gap-3 ${
                        isChecked
                          ? "bg-[#E0EDFE]/40 dark:bg-[#072439] border-[#2087FE]"
                          : "bg-white dark:bg-[#062237] border-[#ACB9D1] dark:border-[#0e3554]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Handled by container
                        className="mt-1 rounded border-[#ACB9D1] text-[#2087FE] focus:ring-[#2087FE]"
                      />
                      <div className="flex-1">
                        <div className="text-xs font-bold text-[#010627] dark:text-[#F5F6F6]">
                          {service.title}
                        </div>
                        <div className="text-[11px] text-[#717785] dark:text-[#94A3B8] mt-0.5">
                          {service.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-[#010627] dark:text-[#F5F6F6] mb-1.5 uppercase tracking-wide">
                    Additional Requirements or Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Specify any custom requirements (e.g. number of field worker seats, regional languages)..."
                    value={formData.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] border-[#ACB9D1] dark:border-[#0e3554] focus:ring-2 focus:ring-[#2087FE]"
                  />
                </div>
              </div>
            )}

            {/* STEP 7: Review & Submit */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#E0EDFE]/30 dark:bg-[#072439]/50 border border-[#2087FE]/20 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#ACB9D1]/30 pb-2">
                    <span className="text-xs font-semibold text-[#717785] dark:text-[#94A3B8]">
                      Candidate Profile
                    </span>
                    <Badge variant="primary">{formData.candidateType}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#717785] dark:text-[#94A3B8]">Candidate:</span>{" "}
                      <span className="font-semibold text-[#010627] dark:text-[#F5F6F6]">
                        {formData.candidateName}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#717785] dark:text-[#94A3B8]">Party:</span>{" "}
                      <span className="font-semibold text-[#010627] dark:text-[#F5F6F6]">
                        {formData.partyName}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#717785] dark:text-[#94A3B8]">Login Mobile:</span>{" "}
                      <span className="font-semibold text-[#010627] dark:text-[#F5F6F6]">
                        {formData.mobile}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#717785] dark:text-[#94A3B8]">Constituency:</span>{" "}
                      <span className="font-semibold text-[#010627] dark:text-[#F5F6F6]">
                        {formData.constituencyName} ({formData.district})
                      </span>
                    </div>
                    <div>
                      <span className="text-[#717785] dark:text-[#94A3B8]">Election Tier:</span>{" "}
                      <span className="font-semibold text-[#010627] dark:text-[#F5F6F6]">
                        {formData.electionType}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#717785] dark:text-[#94A3B8]">Target Booths:</span>{" "}
                      <span className="font-semibold text-[#010627] dark:text-[#F5F6F6]">
                        ~{formData.boothsCount} Polling Stations
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-[#717785] dark:text-[#94A3B8] block mb-1.5">
                    Selected Services & Addons ({formData.requestedServices.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.requestedServices.map((id) => (
                      <Badge key={id} variant="neutral" size="sm">
                        {id}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200">
                  <span className="font-bold">Next Steps:</span> Submitting this enquiry forwards your details to the platform Super Admin. Upon validation, your permanent workspace license will be generated and you will receive an activation notification.
                </div>
              </div>
            )}
          </CardContent>

          {/* Stepper Navigation Actions */}
          <div className="p-5 border-t border-[#ACB9D1] dark:border-[#0e3554] flex items-center justify-between">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" onClick={handlePrevStep}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous Step
              </Button>
            ) : (
              <Link href="/auth/login" className="text-xs text-[#717785] hover:underline">
                Return to Login
              </Link>
            )}

            {currentStep < 7 ? (
              <Button type="button" variant="primary" onClick={handleNextStep}>
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                isLoading={isSubmitting}
                onClick={handleSubmit}
                className="font-bold"
              >
                Submit Registration Enquiry
                <CheckCircle2 className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

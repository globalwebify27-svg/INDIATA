"use client";

import React, { useState } from "react";
import {
  X,
  User,
  MapPin,
  Building2,
  Users,
  FileText,
  Phone,
  Mail,
  Loader2,
  Sparkles,
  ShieldAlert,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Scale,
  Star,
  Check,
} from "lucide-react";
import {
  VoterRecord,
  VoterClassification,
} from "../../types/karyakarta.types";
import { useKaryakartaAuth } from "../../context/karyakarta-auth-context";
import { VoterTicketService } from "../../services/voter-ticket-service";

interface CreateVoterProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVoterCreated: (voter: VoterRecord) => void;
  initialQuery?: string;
  defaultBooth?: string;
}

type SectionTab =
  | "personal"
  | "electoral"
  | "contact_address"
  | "family"
  | "cadre"
  | "schemes";

export function CreateVoterProfileModal({
  isOpen,
  onClose,
  onVoterCreated,
  initialQuery = "",
  defaultBooth,
}: CreateVoterProfileModalProps) {
  const { user } = useKaryakartaAuth();

  const [activeTab, setActiveTab] = useState<SectionTab>("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // 1. Personal & Demographics
  const [name, setName] = useState(initialQuery || "");
  const [marathiName, setMarathiName] = useState("");
  const [relativeName, setRelativeName] = useState("");
  const [relation, setRelation] = useState<"S/o" | "D/o" | "W/o" | "Other">("S/o");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"M" | "F" | "Other">("M");
  const [dob, setDob] = useState("");
  const [caste, setCaste] = useState("");
  const [occupation, setOccupation] = useState("");
  const [qualification, setQualification] = useState("");

  // 2. Electoral Details
  const [epicId, setEpicId] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [electoralPart, setElectoralPart] = useState("Part 42");
  const [boothNumber, setBoothNumber] = useState(
    defaultBooth || user?.assignedBooths?.[0] || "#101"
  );
  const [boothName, setBoothName] = useState("Navbharat High School");

  // 3. Contact & Address
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [address, setAddress] = useState("");
  const [village, setVillage] = useState("Pune City");
  const [ward, setWard] = useState("Ward 12");
  const [prabhaag, setPrabhaag] = useState("Prabhaag 18");

  // 4. Household & Family
  const [familyId, setFamilyId] = useState("");
  const [familyHead, setFamilyHead] = useState(false);
  const [familyMembersCount, setFamilyMembersCount] = useState<string>("1");

  // 5. Cadre Intelligence & Tagging
  const [classification, setClassification] = useState<VoterClassification>("Neutral");
  const [isImportant, setIsImportant] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isVisited, setIsVisited] = useState(false);
  const [isVoted, setIsVoted] = useState(false);
  const [isOutside, setIsOutside] = useState(false);
  const [isDeceased, setIsDeceased] = useState(false);

  // 6. Schemes & Demands
  const [scheme, setScheme] = useState("");
  const [demand, setDemand] = useState("");
  const [candidateHelp, setCandidateHelp] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [remarks, setRemarks] = useState("");

  if (!isOpen) return null;

  // Real-time format validation for entered fields
  const validateEnteredFormats = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate mobile only if provided
    if (phone.trim()) {
      const cleanPhone = phone.replace(/[\s-]/g, "");
      const phoneRegex = /^(\+?91)?[6-9]\d{9}$/;
      if (!phoneRegex.test(cleanPhone)) {
        errors.phone = "Please enter a valid 10-digit Indian mobile number (e.g. 9822100000)";
      }
    }

    // Validate email only if provided
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = "Please enter a valid email address (e.g. name@domain.com)";
      }
    }

    // Validate EPIC format only if provided
    if (epicId.trim()) {
      const cleanEpic = epicId.trim();
      if (cleanEpic.length < 5 || cleanEpic.length > 20) {
        errors.epicId = "EPIC ID should be between 5 and 20 alphanumeric characters";
      }
    }

    // Validate Age only if provided
    if (age.trim()) {
      const numAge = parseInt(age, 10);
      if (isNaN(numAge) || numAge < 18 || numAge > 120) {
        errors.age = "Age must be a valid number between 18 and 120";
      }
    }

    // Validate DOB only if provided
    if (dob.trim()) {
      const dobDate = new Date(dob);
      if (isNaN(dobDate.getTime())) {
        errors.dob = "Please select a valid date of birth";
      } else if (dobDate > new Date()) {
        errors.dob = "Date of birth cannot be in the future";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Format validation
    if (!validateEnteredFormats()) {
      // Find which tab contains the error and switch to it for smooth UX
      if (fieldErrors.phone || fieldErrors.email) {
        setActiveTab("contact_address");
      } else if (fieldErrors.epicId) {
        setActiveTab("electoral");
      } else if (fieldErrors.age || fieldErrors.dob) {
        setActiveTab("personal");
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Partial<VoterRecord> = {
        name: name.trim() || undefined,
        marathiName: marathiName.trim() || undefined,
        relativeName: relativeName.trim() || undefined,
        relation,
        age: age.trim() ? parseInt(age, 10) : undefined,
        gender,
        dob: dob || undefined,
        caste: caste.trim() || undefined,
        occupation: occupation.trim() || undefined,
        qualification: qualification.trim() || undefined,
        epicId: epicId.trim().toUpperCase() || undefined,
        serialNumber: serialNumber.trim() ? parseInt(serialNumber, 10) : undefined,
        electoralPart: electoralPart.trim() || undefined,
        boothNumber: boothNumber.trim() || undefined,
        boothName: boothName.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        houseNo: houseNo.trim() || undefined,
        address: address.trim() || undefined,
        village: village.trim() || undefined,
        ward: ward.trim() || undefined,
        prabhaag: prabhaag.trim() || undefined,
        familyId: familyId.trim() || undefined,
        familyHead,
        familyMembersCount: familyMembersCount.trim() ? parseInt(familyMembersCount, 10) : 1,
        classification,
        isImportant,
        isFavourite,
        isVisited,
        isVoted,
        isOutside,
        isDeceased,
        scheme: scheme.trim() || undefined,
        demand: demand.trim() || undefined,
        candidateHelp: candidateHelp.trim() || undefined,
        extraInfo: extraInfo.trim() || undefined,
        remarks: remarks.trim() || undefined,
        organizationId: user?.organizationId || "org-kasba-peth-2026",
        assignedKaryakartaId: user?.id || "KAR-2026-001",
      };

      const response = await VoterTicketService.createVoter(payload, {
        karyakartaId: user?.id,
        organizationId: user?.organizationId,
      });

      if (response.success && response.data) {
        onVoterCreated(response.data);
        onClose();
      } else {
        setServerError(response.error || "Failed to create voter profile. Please try again.");
      }
    } catch (err: unknown) {
      setServerError((err as Error)?.message || "Network error. Entered data has been preserved.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl my-6 overflow-hidden flex flex-col max-h-[92vh]">
        {/* ========================================================= */}
        {/* MODAL HERO HEADER                                         */}
        {/* ========================================================= */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#2087FE] to-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black tracking-tight text-white">
                  Create New Voter Profile
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  All Fields Optional
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                  Module 07/08
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Central ECI master record creation. Enter available details now; update anytime from field.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* SECTION NAVIGATION TABS                                   */}
        {/* ========================================================= */}
        <div className="flex items-center gap-1 px-4 pt-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className={`pb-2 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "personal"
                ? "border-[#2087FE] text-[#2087FE] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Personal &amp; ID</span>
            {(fieldErrors.age || fieldErrors.dob) && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("electoral")}
            className={`pb-2 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "electoral"
                ? "border-[#2087FE] text-[#2087FE] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>2. Electoral &amp; Booth</span>
            {fieldErrors.epicId && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("contact_address")}
            className={`pb-2 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "contact_address"
                ? "border-[#2087FE] text-[#2087FE] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>3. Contact &amp; Address</span>
            {(fieldErrors.phone || fieldErrors.email) && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("family")}
            className={`pb-2 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "family"
                ? "border-[#2087FE] text-[#2087FE] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>4. Household / Family</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cadre")}
            className={`pb-2 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "cadre"
                ? "border-[#2087FE] text-[#2087FE] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>5. Cadre Intelligence</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("schemes")}
            className={`pb-2 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "schemes"
                ? "border-[#2087FE] text-[#2087FE] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>6. Schemes &amp; Demands</span>
          </button>
        </div>

        {/* Server Alert Message */}
        {serverError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* FORM BODY                                                 */}
        {/* ========================================================= */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* TAB 1: PERSONAL & DEMOGRAPHICS */}
          {activeTab === "personal" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Voter Name (English) <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh S. Kulkarni"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Regional Name (Marathi) <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={marathiName}
                    onChange={(e) => setMarathiName(e.target.value)}
                    placeholder="उदा. रमेश एस. कुलकर्णी"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-marathi focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Relation Type <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value as "S/o" | "D/o" | "W/o" | "Other")}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  >
                    <option value="S/o">Son of (S/o)</option>
                    <option value="D/o">Daughter of (D/o)</option>
                    <option value="W/o">Wife of (W/o)</option>
                    <option value="Other">Other / Guardian</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Relative / Father / Husband Name <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={relativeName}
                    onChange={(e) => setRelativeName(e.target.value)}
                    placeholder="e.g. Sitaram Kulkarni"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Age <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 42"
                    min="18"
                    max="120"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      fieldErrors.age ? "border-rose-500 bg-rose-50/20" : "border-slate-200 dark:border-slate-700"
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]`}
                  />
                  {fieldErrors.age && <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.age}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gender <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as "M" | "F" | "Other")}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  >
                    <option value="M">Male (M)</option>
                    <option value="F">Female (F)</option>
                    <option value="Other">Other / Third Gender</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date of Birth <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      fieldErrors.dob ? "border-rose-500 bg-rose-50/20" : "border-slate-200 dark:border-slate-700"
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]`}
                  />
                  {fieldErrors.dob && <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.dob}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Caste / Community <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={caste}
                    onChange={(e) => setCaste(e.target.value)}
                    placeholder="e.g. Maratha, Brahmin, OBC"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Occupation <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Retail Trader, Teacher"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Qualification <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g. Graduate (B.Com)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ELECTORAL IDENTIFICATION */}
          {activeTab === "electoral" && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-xl flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-900 dark:text-blue-300">ECI Roll Identification</p>
                  <p className="text-[11px] text-blue-800 dark:text-blue-400">
                    If EPIC ID is unavailable from citizen, the system generates an indexed temporary tag (e.g. TEMP...) until official roll reconciliation.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    EPIC / Voter ID Number <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={epicId}
                    onChange={(e) => setEpicId(e.target.value.toUpperCase())}
                    placeholder="e.g. WXE4829101"
                    className={`w-full px-3 py-2 rounded-lg border font-mono ${
                      fieldErrors.epicId ? "border-rose-500 bg-rose-50/20" : "border-slate-200 dark:border-slate-700"
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]`}
                  />
                  {fieldErrors.epicId && <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.epicId}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Serial Number in Roll <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="e.g. 428"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Booth Number <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <select
                    value={boothNumber}
                    onChange={(e) => setBoothNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  >
                    {user?.assignedBooths?.map((b) => (
                      <option key={b} value={b}>
                        Booth {b}
                      </option>
                    ))}
                    <option value="#101">Booth #101</option>
                    <option value="#102">Booth #102</option>
                    <option value="#103">Booth #103</option>
                    <option value="#104">Booth #104</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Polling Station Centre <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={boothName}
                    onChange={(e) => setBoothName(e.target.value)}
                    placeholder="e.g. Navbharat High School, Ground Floor"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Electoral Part / Section <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={electoralPart}
                  onChange={(e) => setElectoralPart(e.target.value)}
                  placeholder="e.g. Part 42 - Shaniwar Peth East"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                />
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT & RESIDENTIAL ADDRESS */}
          {activeTab === "contact_address" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98221 00000"
                      className={`w-full pl-9 pr-3 py-2 rounded-lg border ${
                        fieldErrors.phone ? "border-rose-500 bg-rose-50/20" : "border-slate-200 dark:border-slate-700"
                      } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]`}
                    />
                  </div>
                  {fieldErrors.phone && <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.phone}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="citizen@example.com"
                      className={`w-full pl-9 pr-3 py-2 rounded-lg border ${
                        fieldErrors.email ? "border-rose-500 bg-rose-50/20" : "border-slate-200 dark:border-slate-700"
                      } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]`}
                    />
                  </div>
                  {fieldErrors.email && <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    House / Flat / Plot No <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={houseNo}
                    onChange={(e) => setHouseNo(e.target.value)}
                    placeholder="e.g. Plot 14, Lane 3"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Registered Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 14, Somwar Ali, Shaniwar Peth, Pune 411030"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ward Number <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    placeholder="e.g. Ward 12"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Prabhaag / Sector <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={prabhaag}
                    onChange={(e) => setPrabhaag(e.target.value)}
                    placeholder="e.g. Prabhaag 18"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Village / City <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Pune City"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HOUSEHOLD & FAMILY */}
          {activeTab === "family" && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 rounded-xl text-xs text-purple-900 dark:text-purple-300 flex items-start gap-2.5">
                <Users className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Unified Household Linkage</p>
                  <p className="text-[11px] text-purple-800 dark:text-purple-400">
                    Group electors sharing the same home under a common Family ID to sync voter slips and doorstep outreach.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Family / Ration ID <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={familyId}
                    onChange={(e) => setFamilyId(e.target.value)}
                    placeholder="e.g. fam-kulkarni-01 (auto if empty)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Family Members Count <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    value={familyMembersCount}
                    onChange={(e) => setFamilyMembersCount(e.target.value)}
                    min="1"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <input
                    type="checkbox"
                    checked={familyHead}
                    onChange={(e) => setFamilyHead(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2087FE] border-slate-300 focus:ring-[#2087FE]"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Mark as Head of Household
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Primary family point of contact for candidate visits and doorstep deliveries.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 5: CADRE INTELLIGENCE & TAGGING */}
          {activeTab === "cadre" && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Political Sentiment / Classification <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      { id: "Supporter", label: "Supporter (अनुकूल)", icon: ThumbsUp, color: "emerald" },
                      { id: "Doubtful", label: "Doubtful (साशंक)", icon: HelpCircle, color: "amber" },
                      { id: "Opponent", label: "Opponent (विरोधी)", icon: ThumbsDown, color: "rose" },
                      { id: "Neutral", label: "Neutral (तटस्थ)", icon: Scale, color: "slate" },
                    ] as const
                  ).map((item) => {
                    const active = classification === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setClassification(item.id)}
                        className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          active
                            ? item.id === "Supporter"
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                              : item.id === "Doubtful"
                              ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                              : item.id === "Opponent"
                              ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                              : "bg-slate-700 text-white border-slate-700 shadow-sm"
                            : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isImportant}
                    onChange={(e) => setIsImportant(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span>Starred / Important Voter</span>
                    </span>
                    <span className="text-[11px] text-slate-500">Local influencer, community leader, or key contact</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVisited}
                    onChange={(e) => setIsVisited(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      Doorstep Visited
                    </span>
                    <span className="text-[11px] text-slate-500">Contact has already been visited by Karyakarta</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFavourite}
                    onChange={(e) => setIsFavourite(e.target.checked)}
                    className="w-4 h-4 rounded text-pink-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-pink-500 fill-pink-400" />
                      <span>Candidate Priority / VIP</span>
                    </span>
                    <span className="text-[11px] text-slate-500">Flagged for personal candidate touchpoint</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVoted}
                    onChange={(e) => setIsVoted(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      Has Voted (Poll Day)
                    </span>
                    <span className="text-[11px] text-slate-500">Voter turnout confirmation tracked by cadre</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOutside}
                    onChange={(e) => setIsOutside(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      Resides Outside (Migrant Voter)
                    </span>
                    <span className="text-[11px] text-slate-500">Works in another city, needs travel coordination</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDeceased}
                    onChange={(e) => setIsDeceased(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      Flag as Deceased / Form 7 Deletion
                    </span>
                    <span className="text-[11px] text-slate-500">Reported deceased in field checks</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 6: WELFARE SCHEMES & LOCAL DEMANDS */}
          {activeTab === "schemes" && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Government Welfare Scheme Beneficiary <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={scheme}
                  onChange={(e) => setScheme(e.target.value)}
                  placeholder="e.g. Mukhyamantri Ladki Bahin Yojana, PMAY, PMJAY"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Local Grievance / Citizen Demand <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={demand}
                  onChange={(e) => setDemand(e.target.value)}
                  placeholder="e.g. Low municipal water pressure, streetlight repair in lane..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Additional Field Intelligence / Extra Info <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={extraInfo}
                  onChange={(e) => setExtraInfo(e.target.value)}
                  placeholder="Any additional background observations, local community standing, etc."
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Past Candidate Help <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={candidateHelp}
                    onChange={(e) => setCandidateHelp(e.target.value)}
                    placeholder="e.g. Hospital admission assistance in 2024"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Field Cadre Remarks <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="e.g. Respected elder, family committed to Anand Shinde"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ACTIONS & FOOTER                                          */}
          {/* ========================================================= */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="text-[11px] text-slate-400">
              Creator Signature: <strong className="text-slate-700 dark:text-slate-300">{user?.name || "Karyakarta"}</strong> ({user?.id || "KAR-2026-001"})
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Voter Profile...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Voter Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

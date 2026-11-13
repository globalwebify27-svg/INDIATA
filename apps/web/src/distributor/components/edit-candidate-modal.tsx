"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Phone,
  Vote,
  MapPin,
  Building,
  Sparkles,
  Check,
  Loader2,
} from "lucide-react";
import { CandidateProfile, candidateStore } from "../data/candidate-store";

interface EditCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateProfile;
  onSaved?: (updatedCandidate: CandidateProfile) => void;
}

type TabKey = "personal" | "contact" | "party" | "election" | "geography" | "address" | "campaign";

export function EditCandidateModal({
  isOpen,
  onClose,
  candidate,
  onSaved,
}: EditCandidateModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form Fields
  // 1. Personal
  const [name, setName] = useState(candidate.name || "");
  const [nameMarathi, setNameMarathi] = useState(candidate.marathiName || candidate.nameMarathi || "");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">(candidate.gender || "MALE");
  const [age, setAge] = useState<string>(candidate.age ? candidate.age.toString() : "");
  const [dateOfBirth, setDateOfBirth] = useState(candidate.dateOfBirth || "");
  const [education, setEducation] = useState(candidate.education || "");
  const [occupation, setOccupation] = useState(candidate.occupation || "");

  // 2. Contact
  const [mobile, setMobile] = useState(candidate.mobile || "");
  const [email, setEmail] = useState(candidate.email || "");
  const [whatsappHelpline, setWhatsappHelpline] = useState(candidate.whatsappHelpline || candidate.mobile || "");
  const [officePhone, setOfficePhone] = useState(candidate.officePhone || "");

  // 3. Party & Political
  const [party, setParty] = useState(candidate.party || "");
  const [partyName, setPartyName] = useState(candidate.partyName || candidate.party || "");
  const [partyAcronym, setPartyAcronym] = useState(candidate.partyAcronym || "");
  const [partyMarathiName, setPartyMarathiName] = useState(candidate.partyMarathiName || "");
  const [candidateType, setCandidateType] = useState<"MAIN" | "ALLIANCE" | "INDEPENDENT" | "DUMMY">(
    candidate.candidateType || "MAIN"
  );
  const [allianceName, setAllianceName] = useState(candidate.allianceName || "");

  // 4. Election
  const [electionType, setElectionType] = useState(candidate.electionType || "Vidhan Sabha");
  const [electionName, setElectionName] = useState(candidate.electionName || "");
  const [electionYear, setElectionYear] = useState(candidate.electionYear || "2026");
  const [pollingDate, setPollingDate] = useState(candidate.pollingDate || "");
  const [seatCategory, setSeatCategory] = useState<"GENERAL" | "SC" | "ST" | "OBC">(
    candidate.seatCategory || "GENERAL"
  );

  // 5. Geography
  const [state, setState] = useState(candidate.state || "Maharashtra");
  const [district, setDistrict] = useState(candidate.district || "Pune");
  const [constituency, setConstituency] = useState(candidate.constituency || "");
  const [acNumber, setAcNumber] = useState(candidate.acNumber || "");
  const [acName, setAcName] = useState(candidate.acName || "");
  const [pcName, setPcName] = useState(candidate.pcName || "");
  const [totalVoters, setTotalVoters] = useState(candidate.totalVoters ? candidate.totalVoters.toString() : "");
  const [totalBooths, setTotalBooths] = useState(candidate.totalBooths ? candidate.totalBooths.toString() : "");

  // 6. Address
  const [officeAddress, setOfficeAddress] = useState(candidate.officeAddress || "");
  const [city, setCity] = useState(candidate.city || "Pune");
  const [pincode, setPincode] = useState(candidate.pincode || "411038");

  // 7. Campaign
  const [slogan, setSlogan] = useState(candidate.slogan || "");
  const [publicSlipUrl, setPublicSlipUrl] = useState(candidate.publicSlipUrl || "");
  const [facebookUrl, setFacebookUrl] = useState(candidate.facebookUrl || "");
  const [instagramUrl, setInstagramUrl] = useState(candidate.instagramUrl || "");
  const [twitterUrl, setTwitterUrl] = useState(candidate.twitterUrl || "");
  const [youtubeUrl, setYoutubeUrl] = useState(candidate.youtubeUrl || "");

  // Sync state whenever candidate prop changes
  useEffect(() => {
    setName(candidate.name || "");
    setNameMarathi(candidate.marathiName || candidate.nameMarathi || "");
    setGender(candidate.gender || "MALE");
    setAge(candidate.age ? candidate.age.toString() : "");
    setDateOfBirth(candidate.dateOfBirth || "");
    setEducation(candidate.education || "");
    setOccupation(candidate.occupation || "");

    setMobile(candidate.mobile || "");
    setEmail(candidate.email || "");
    setWhatsappHelpline(candidate.whatsappHelpline || candidate.mobile || "");
    setOfficePhone(candidate.officePhone || "");

    setParty(candidate.party || "");
    setPartyName(candidate.partyName || candidate.party || "");
    setPartyAcronym(candidate.partyAcronym || "");
    setPartyMarathiName(candidate.partyMarathiName || "");
    setCandidateType(candidate.candidateType || "MAIN");
    setAllianceName(candidate.allianceName || "");

    setElectionType(candidate.electionType || "Vidhan Sabha");
    setElectionName(candidate.electionName || "");
    setElectionYear(candidate.electionYear || "2026");
    setPollingDate(candidate.pollingDate || "");
    setSeatCategory(candidate.seatCategory || "GENERAL");

    setState(candidate.state || "Maharashtra");
    setDistrict(candidate.district || "Pune");
    setConstituency(candidate.constituency || "");
    setAcNumber(candidate.acNumber || "");
    setAcName(candidate.acName || "");
    setPcName(candidate.pcName || "");
    setTotalVoters(candidate.totalVoters ? candidate.totalVoters.toString() : "");
    setTotalBooths(candidate.totalBooths ? candidate.totalBooths.toString() : "");

    setOfficeAddress(candidate.officeAddress || "");
    setCity(candidate.city || "Pune");
    setPincode(candidate.pincode || "411038");

    setSlogan(candidate.slogan || "");
    setPublicSlipUrl(candidate.publicSlipUrl || "");
    setFacebookUrl(candidate.facebookUrl || "");
    setInstagramUrl(candidate.instagramUrl || "");
    setTwitterUrl(candidate.twitterUrl || "");
    setYoutubeUrl(candidate.youtubeUrl || "");
    setErrors({});
  }, [candidate]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Candidate official name is required";
    }

    if (mobile.trim()) {
      const cleanPhone = mobile.replace(/[\s-]/g, "");
      const phoneRegex = /^(\+?91)?[6-9]\d{9}$/;
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.mobile = "Please enter a valid 10-digit Indian mobile number";
      }
    } else {
      newErrors.mobile = "Contact mobile number is required";
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!party.trim()) {
      newErrors.party = "Political party is required";
    }

    if (!constituency.trim()) {
      newErrors.constituency = "Constituency name is required";
    }

    if (age.trim()) {
      const numAge = parseInt(age, 10);
      if (isNaN(numAge) || numAge < 25 || numAge > 120) {
        newErrors.age = "Candidate age must be between 25 and 120 (constitutional eligibility)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      if (errors.name || errors.age) setActiveTab("personal");
      else if (errors.mobile || errors.email) setActiveTab("contact");
      else if (errors.party) setActiveTab("party");
      else if (errors.constituency) setActiveTab("geography");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const updates: Partial<CandidateProfile> = {
        name: name.trim(),
        nameEnglish: name.trim(),
        nameMarathi: nameMarathi.trim() || name.trim(),
        marathiName: nameMarathi.trim() || name.trim(),
        gender,
        age: age.trim() ? parseInt(age, 10) : undefined,
        dateOfBirth: dateOfBirth || undefined,
        education: education.trim(),
        occupation: occupation.trim(),

        mobile: mobile.trim(),
        email: email.trim(),
        whatsappHelpline: whatsappHelpline.trim() || mobile.trim(),
        officePhone: officePhone.trim(),

        party: party.trim(),
        partyName: partyName.trim() || party.trim(),
        partyAcronym: partyAcronym.trim() || party.slice(0, 4).toUpperCase(),
        partyMarathiName: partyMarathiName.trim(),
        candidateType,
        allianceName: allianceName.trim(),

        electionType,
        electionName: electionName.trim(),
        electionYear: electionYear.trim(),
        pollingDate: pollingDate.trim(),
        seatCategory,

        state: state.trim(),
        district: district.trim(),
        constituency: constituency.trim(),
        acNumber: acNumber.trim(),
        acName: acName.trim(),
        pcName: pcName.trim(),
        totalVoters: totalVoters.trim() ? parseInt(totalVoters, 10) : undefined,
        totalBooths: totalBooths.trim() ? parseInt(totalBooths, 10) : undefined,

        officeAddress: officeAddress.trim(),
        city: city.trim(),
        pincode: pincode.trim(),

        slogan: slogan.trim(),
        publicSlipUrl: publicSlipUrl.trim(),
        facebookUrl: facebookUrl.trim(),
        instagramUrl: instagramUrl.trim(),
        twitterUrl: twitterUrl.trim(),
        youtubeUrl: youtubeUrl.trim(),
      };

      const updated = candidateStore.updateCandidateBasicInfo(candidate.id, updates);
      setIsSubmitting(false);

      if (updated) {
        setSuccessToast("Candidate Profile updated successfully!");
        if (onSaved) onSaved(updated);
        setTimeout(() => {
          setSuccessToast(null);
          onClose();
        }, 600);
      }
    }, 400);
  };

  const navItems: { id: TabKey; label: string; icon: React.ElementType }[] = [
    { id: "personal", label: "1. Personal", icon: User },
    { id: "contact", label: "2. Contact & Helpline", icon: Phone },
    { id: "party", label: "3. Party & Affiliation", icon: Building },
    { id: "election", label: "4. Election & Seat", icon: Vote },
    { id: "geography", label: "5. Constituency Locus", icon: MapPin },
    { id: "address", label: "6. Office Address", icon: MapPin },
    { id: "campaign", label: "7. Slogan & Channels", icon: Sparkles },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl my-6 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#2087FE] to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
              {candidate.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black tracking-tight text-white">
                  Edit Candidate Profile
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                  {candidate.id}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  {candidate.accountType} Account
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {candidate.name} • {candidate.constituency} ({candidate.party})
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 pt-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 overflow-x-auto text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  active
                    ? "border-[#2087FE] text-[#2087FE] font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Success Alert */}
        {successToast && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">{successToast}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* TAB 1: PERSONAL */}
          {activeTab === "personal" && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Candidate Personal Credentials</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Candidate Official English Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikramaditya Shinde"
                    className={`w-full px-3 py-2 rounded-xl border ${
                      errors.name ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 dark:border-slate-700"
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]`}
                  />
                  {errors.name && <p className="text-rose-500 text-[11px] mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Regional Marathi / Devnagari Name
                  </label>
                  <input
                    type="text"
                    value={nameMarathi}
                    onChange={(e) => setNameMarathi(e.target.value)}
                    placeholder="उदा. विक्रमादित्य शिंदे"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-marathi focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  >
                    <option value="MALE">Male (पुरुष)</option>
                    <option value="FEMALE">Female (महिला)</option>
                    <option value="OTHER">Other (इतर)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Age (Years)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 48"
                    min="25"
                    max="120"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                  {errors.age && <p className="text-rose-500 text-[11px] mt-1">{errors.age}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Educational Qualification</label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="e.g. MBA, B.Sc., LL.B"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Profession / Occupation</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Industrialist, Advocate, Agriculturist"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTACT */}
          {activeTab === "contact" && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Contact Channels &amp; War Room Helpline</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Direct Contact Mobile <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="e.g. +91 98220 11221"
                    className={`w-full px-3 py-2 rounded-xl border ${
                      errors.mobile ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 dark:border-slate-700"
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe] font-mono`}
                  />
                  {errors.mobile && <p className="text-rose-500 text-[11px] mt-1">{errors.mobile}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Official Campaign Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. candidate@domain.org"
                    className={`w-full px-3 py-2 rounded-xl border ${
                      errors.email ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 dark:border-slate-700"
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]`}
                  />
                  {errors.email && <p className="text-rose-500 text-[11px] mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Public WhatsApp Bot / Citizen Helpline
                  </label>
                  <input
                    type="tel"
                    value={whatsappHelpline}
                    onChange={(e) => setWhatsappHelpline(e.target.value)}
                    placeholder="e.g. +91 98220 11221"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Central Office Landline / Reception
                  </label>
                  <input
                    type="text"
                    value={officePhone}
                    onChange={(e) => setOfficePhone(e.target.value)}
                    placeholder="e.g. 020-25448899"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe] font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PARTY */}
          {activeTab === "party" && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                <Building className="w-4 h-4 text-purple-600" />
                <span>Political Party &amp; Alliance Configuration</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Party Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={party}
                    onChange={(e) => {
                      setParty(e.target.value);
                      setPartyName(e.target.value);
                    }}
                    placeholder="e.g. Rashtriya Vikas Congress"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Party Acronym / Short Code
                  </label>
                  <input
                    type="text"
                    value={partyAcronym}
                    onChange={(e) => setPartyAcronym(e.target.value.toUpperCase())}
                    placeholder="e.g. RVC, MJA, IND, SVM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe] font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Candidate Role Type</label>
                  <select
                    value={candidateType}
                    onChange={(e) => setCandidateType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  >
                    <option value="MAIN">Main Principal Candidate</option>
                    <option value="ALLIANCE">Alliance Partner Candidate</option>
                    <option value="INDEPENDENT">Independent (अपक्ष)</option>
                    <option value="DUMMY">Dummy / Supporting Candidate</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Grand Alliance / Mahayuti / Front Name
                  </label>
                  <input
                    type="text"
                    value={allianceName}
                    onChange={(e) => setAllianceName(e.target.value)}
                    placeholder="e.g. Maha Vikas Mahayuti"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ELECTION */}
          {activeTab === "election" && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                <Vote className="w-4 h-4 text-blue-600" />
                <span>Election Details &amp; Polling Schedule</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Election Type</label>
                  <select
                    value={electionType}
                    onChange={(e) => setElectionType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  >
                    <option value="Vidhan Sabha">Vidhan Sabha (State Assembly)</option>
                    <option value="Lok Sabha">Lok Sabha (Parliamentary)</option>
                    <option value="Municipal Corporation">Municipal Corporation (Mahanagarpalika)</option>
                    <option value="Zilla Parishad">Zilla Parishad &amp; Panchayat Samiti</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Seat Category</label>
                  <select
                    value={seatCategory}
                    onChange={(e) => setSeatCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  >
                    <option value="GENERAL">General (खुला प्रवर्ग)</option>
                    <option value="OBC">OBC (इतर मागास प्रवर्ग)</option>
                    <option value="SC">SC (अनुसूचित जाती)</option>
                    <option value="ST">ST (अनुसूचित जमाती)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Official Election Title</label>
                  <input
                    type="text"
                    value={electionName}
                    onChange={(e) => setElectionName(e.target.value)}
                    placeholder="e.g. Maharashtra Legislative Assembly General Election 2026"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Polling Date</label>
                  <input
                    type="text"
                    value={pollingDate}
                    onChange={(e) => setPollingDate(e.target.value)}
                    placeholder="e.g. 20 Nov 2026"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GEOGRAPHY */}
          {activeTab === "geography" && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>Constituency Geography &amp; Electorate Locus</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Constituency Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={constituency}
                    onChange={(e) => setConstituency(e.target.value)}
                    placeholder="e.g. 214 - Kothrud Assembly"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">AC Number</label>
                  <input
                    type="text"
                    value={acNumber}
                    onChange={(e) => setAcNumber(e.target.value)}
                    placeholder="e.g. 214"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Parent PC</label>
                  <input
                    type="text"
                    value={pcName}
                    onChange={(e) => setPcName(e.target.value)}
                    placeholder="e.g. 34 - Pune"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Electors</label>
                  <input
                    type="number"
                    value={totalVoters}
                    onChange={(e) => setTotalVoters(e.target.value)}
                    placeholder="e.g. 342150"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mapped Booths</label>
                  <input
                    type="number"
                    value={totalBooths}
                    onChange={(e) => setTotalBooths(e.target.value)}
                    placeholder="e.g. 284"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ADDRESS */}
          {activeTab === "address" && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Campaign Central Office &amp; Secretariat Address</span>
              </h3>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Office / Postal Address
                </label>
                <textarea
                  rows={3}
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  placeholder="Street name, landmark, building name..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">City / Taluka</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Postal Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 411038"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe] font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: CAMPAIGN & SLOGAN */}
          {activeTab === "campaign" && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Campaign Slogan &amp; Social Outreach Channels</span>
              </h3>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Official Campaign Slogan (Marathi / Regional / English)
                </label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="उदा. विकास, विश्वास आणि प्रगती - आपल्या हक्काचा आमदार!"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe] font-marathi"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Public Voter Slip Download Portal URL
                </label>
                <input
                  type="url"
                  value={publicSlipUrl}
                  onChange={(e) => setPublicSlipUrl(e.target.value)}
                  placeholder="https://rajtantra.in/slips/CAND-XXX"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe] font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Facebook Profile / Page</label>
                  <input
                    type="url"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    placeholder="https://facebook.com/candidate"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Instagram Handle</label>
                  <input
                    type="url"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/candidate"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Modal Actions Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400">
              Franchise ID: <strong className="text-slate-600 dark:text-slate-300">{candidate.distributorId}</strong> • Candidate ID: <strong className="text-slate-600 dark:text-slate-300">{candidate.id}</strong>
            </span>

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
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Candidate Profile</span>
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

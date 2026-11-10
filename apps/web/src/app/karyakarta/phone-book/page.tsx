"use client";

import React, { useState, useMemo } from "react";
import {
  Phone,
  Search,
  MessageCircle,
  User,
  MapPin,
  X,
  Send,
  Sparkles,
  PhoneCall,
  PhoneOff,
  Copy,
} from "lucide-react";
import { useKaryakartaAuth } from "../../../karyakarta/context/karyakarta-auth-context";
import { useKaryakartaLanguage } from "../../../karyakarta/context/karyakarta-language-context";
import { MOCK_VOTERS } from "../../../karyakarta/data/mock-karyakarta-data";
import { VoterRecord } from "../../../karyakarta/types/karyakarta.types";
import { CentralVoterProfile } from "../../../karyakarta/components/voters/central-voter-profile";

interface WhatsAppTemplate {
  id: string;
  title: string;
  description: string;
  getText: (voter: VoterRecord, candidateName: string) => string;
}

const WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: "polling-station",
    title: "Polling Station & Booth Info",
    description: "Send official booth location, room number, and serial details",
    getText: (v: VoterRecord, cand: string) =>
      `सादर नमस्कार ${v.name},\n\nआगामी विधानसभा निवडणुकीसाठी आपले मतदान केंद्र व माहिती खालीलप्रमाणे आहे:\n\n• नाव: ${v.name} (${v.marathiName || ""})\n• मतदार ओळखपत्र (EPIC): ${v.epicId}\n• मतदान केंद्र: Booth ${v.boothNumber} - Navbharat High School\n• यादी अनुक्रमांक (Serial): #${v.serialNumber || 42}\n\nआपला एक मत अत्यंत मोलाचा आहे! कृपया वेळेवर मतदान करा.\n— ${cand} प्रचार कार्यालय व कार्यकर्ता पथक.`,
  },
  {
    id: "greeting",
    title: "Candidate Namaskar & Greetings",
    description: "Personalized constituency greetings from candidate",
    getText: (v: VoterRecord, cand: string) =>
      `सस्नेह जय महाराष्ट्र ${v.name},\n\nआपले लाडके उमेदवार ${cand} यांच्या वतीने आपणास व आपल्या संपूर्ण परिवारास हार्दिक शुभेच्छा.\n\nआपल्या प्रभागातील पाणी, रस्ते, स्वच्छता व जनहितार्थ सुरू असलेल्या विविध योजनांचा लाभ आपणापर्यंत पोहोचवण्यासाठी आम्ही कटिबद्ध आहोत. कोणत्याही मदतीसाठी आम्हाला संपर्क करा.\n\nधन्यवाद,\nआपला नम्र,\n${cand} प्रचार समन्वय कक्ष`,
  },
  {
    id: "visit-followup",
    title: "Doorstep Survey Follow-up",
    description: "Follow up on citizen requests and welfare schemes",
    getText: (v: VoterRecord, cand: string) =>
      `नमस्कार ${v.name},\n\nआज आपल्या घरी दिलेल्या भेटीबद्दल आपले मनःपूर्वक आभार. आपल्या प्रभागातील समस्या व आपल्या सूचनांची नोंद घेतली असून उमेदवार ${cand} यांच्या वॉर रूमकडे तात्काळ पाठवली आहे.\n\n— आपले स्थानिक बूथ कार्यकर्ते.`,
  },
  {
    id: "voter-slip",
    title: "Digital Voter Slip Dispatch",
    description: "Direct link to digital voting card",
    getText: (v: VoterRecord, cand: string) =>
      `निवडणूक आयोग अधिकृत मतदार माहिती स्लिप:\n\nमतदार: ${v.name}\nEPIC: ${v.epicId}\nबूथ: ${v.boothNumber}\nअनुक्रमांक: #${v.serialNumber || 42}\n\nमतदानाचा हक्क नक्की बजवा!\n— ${cand} जनसंपर्क कक्ष`,
  },
];

export default function PhoneBookPage() {
  const { user } = useKaryakartaAuth();
  const { t } = useKaryakartaLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooth, setSelectedBooth] = useState<string>("ALL");
  const [phoneFilter, setPhoneFilter] = useState<"ALL" | "WITH_PHONE" | "NO_PHONE">("ALL");
  const [classificationFilter, setClassificationFilter] = useState<string>("ALL");
  const [selectedVoterForProfile, setSelectedVoterForProfile] = useState<VoterRecord | null>(null);

  // WhatsApp Modal state
  const [waModalVoter, setWaModalVoter] = useState<VoterRecord | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    WHATSAPP_TEMPLATES[0]?.id || "polling-station"
  );
  const [customWaText, setCustomWaText] = useState<string>("");
  const [copiedToast, setCopiedToast] = useState(false);

  // Scoped voters
  const scopedVoters = useMemo(() => {
    return MOCK_VOTERS.filter((v: VoterRecord) => {
      if (user?.assignedBooths?.length && !user.assignedBooths.includes(v.boothNumber)) {
        return false;
      }
      return true;
    });
  }, [user]);

  // Filtered voters
  const filteredVoters = useMemo(() => {
    return scopedVoters.filter((v: VoterRecord) => {
      if (selectedBooth !== "ALL" && v.boothNumber !== selectedBooth) return false;
      if (phoneFilter === "WITH_PHONE" && !v.phone) return false;
      if (phoneFilter === "NO_PHONE" && !!v.phone) return false;
      if (classificationFilter !== "ALL" && v.classification !== classificationFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const mName = v.name.toLowerCase().includes(q);
        const mMar = v.marathiName ? v.marathiName.includes(q) : false;
        const mPhone = v.phone ? v.phone.includes(q) : false;
        const mEpic = v.epicId.toLowerCase().includes(q);
        const mHouse = v.houseNo ? v.houseNo.toLowerCase().includes(q) : false;
        if (!mName && !mMar && !mPhone && !mEpic && !mHouse) return false;
      }
      return true;
    });
  }, [scopedVoters, selectedBooth, phoneFilter, classificationFilter, searchQuery]);

  // Stats
  const totalCount = scopedVoters.length;
  const withPhoneCount = scopedVoters.filter((v: VoterRecord) => !!v.phone).length;
  const noPhoneCount = totalCount - withPhoneCount;
  const phonePercentage = totalCount > 0 ? Math.round((withPhoneCount / totalCount) * 100) : 0;

  const handleOpenWhatsAppModal = (voter: VoterRecord) => {
    setWaModalVoter(voter);
    const tmpl = WHATSAPP_TEMPLATES[0];
    if (tmpl) {
      setSelectedTemplateId(tmpl.id);
      setCustomWaText(tmpl.getText(voter, user?.candidateName || "Anand Shinde"));
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (waModalVoter) {
      const tmpl = WHATSAPP_TEMPLATES.find((t) => t.id === templateId);
      if (tmpl) {
        setCustomWaText(tmpl.getText(waModalVoter, user?.candidateName || "Anand Shinde"));
      }
    }
  };

  const handleSendWhatsApp = () => {
    if (!waModalVoter?.phone) return;
    const cleanPhone = waModalVoter.phone.replace(/[^0-9]/g, "");
    const encoded = encodeURIComponent(customWaText);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, "_blank");
    setWaModalVoter(null);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(customWaText);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400">
              Field Telephony Directory
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Assigned Booths: {user?.assignedBooths?.join(", ") || "All"}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Phone className="w-6 h-6 text-[#2087fe]" />
            {t("phonebook.title", "Constituency Phone Book & Outreach")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Rapid dialer, direct WhatsApp dispatch, and voter contact directory for booth field cadre.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl text-center min-w-[110px]">
            <div className="text-xl font-black text-emerald-700 dark:text-emerald-400">
              {withPhoneCount}
            </div>
            <div className="text-[11px] font-medium text-emerald-800/80 dark:text-emerald-300">
              Mobile Verified ({phonePercentage}%)
            </div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-center min-w-[110px]">
            <div className="text-xl font-black text-slate-700 dark:text-slate-300">
              {noPhoneCount}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Phone Missing
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by voter name, phone number, house no, or EPIC ID..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Booth Selector */}
          <div className="w-full md:w-48">
            <select
              value={selectedBooth}
              onChange={(e) => setSelectedBooth(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
            >
              <option value="ALL">All Assigned Booths</option>
              {user?.assignedBooths?.map((b) => (
                <option key={b} value={b}>
                  Booth {b}
                </option>
              ))}
            </select>
          </div>

          {/* Phone Availability Filter */}
          <div className="w-full md:w-48">
            <select
              value={phoneFilter}
              onChange={(e) => setPhoneFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
            >
              <option value="ALL">All Phone Status</option>
              <option value="WITH_PHONE">Phone Available Only</option>
              <option value="NO_PHONE">Phone Missing Only</option>
            </select>
          </div>

          {/* Political Leaning Filter */}
          <div className="w-full md:w-44">
            <select
              value={classificationFilter}
              onChange={(e) => setClassificationFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#2087fe]"
            >
              <option value="ALL">All Leanings</option>
              <option value="Supporter">Supporter</option>
              <option value="Doubtful">Doubtful</option>
              <option value="Opponent">Opponent</option>
              <option value="Neutral">Neutral</option>
            </select>
          </div>
        </div>

        {/* Results summary counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span>
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredVoters.length}</strong> of {totalCount} assigned contacts
          </span>
          {(selectedBooth !== "ALL" || phoneFilter !== "ALL" || classificationFilter !== "ALL" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedBooth("ALL");
                setPhoneFilter("ALL");
                setClassificationFilter("ALL");
                setSearchQuery("");
              }}
              className="text-[#2087fe] font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVoters.map((voter: VoterRecord) => {
          const hasPhone = !!voter.phone;
          return (
            <div
              key={voter.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header row: Leaning badge and Booth Pill */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    Booth {voter.boothNumber} • #{voter.serialNumber || 42}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      voter.classification === "Supporter"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                        : voter.classification === "Doubtful"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400"
                        : voter.classification === "Opponent"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400"
                        : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {voter.classification}
                  </span>
                </div>

                {/* Voter Identity */}
                <div className="mb-2">
                  <div className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {voter.name}
                  </div>
                  {voter.marathiName && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {voter.marathiName}
                    </div>
                  )}
                  <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                    EPIC: {voter.epicId} • {voter.gender}, {voter.age} yrs
                  </div>
                </div>

                {/* Address */}
                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5 mb-3 line-clamp-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    {voter.houseNo ? `House ${voter.houseNo}, ` : ""}
                    {voter.address}
                  </span>
                </div>

                {/* Phone Display */}
                <div className="mb-4">
                  {hasPhone ? (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/50 text-blue-900 dark:text-blue-300 font-mono font-bold text-sm">
                      <Phone className="w-4 h-4 text-[#2087fe]" />
                      <span>{voter.phone}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40 text-slate-400 text-xs italic">
                      <PhoneOff className="w-3.5 h-3.5" />
                      <span>Phone not in roll (Doorstep collection required)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2">
                {/* Call Button */}
                {hasPhone ? (
                  <a
                    href={`tel:${voter.phone?.replace(/[^0-9+]/g, "")}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
                    title="Direct Phone Call"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Call
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                  >
                    <PhoneOff className="w-3.5 h-3.5" />
                    No Phone
                  </button>
                )}

                {/* WhatsApp Button */}
                {hasPhone ? (
                  <button
                    onClick={() => handleOpenWhatsAppModal(voter)}
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                    title="Send WhatsApp Template"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </button>
                )}

                {/* Profile View */}
                <button
                  onClick={() => setSelectedVoterForProfile(voter)}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="View Full Profile"
                >
                  <User className="w-3.5 h-3.5" />
                  Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVoters.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto">
          <PhoneOff className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            No contacts match the filter criteria
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Try adjusting your search query, booth selection, or phone availability filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedBooth("ALL");
              setPhoneFilter("ALL");
              setClassificationFilter("ALL");
            }}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-[#2087fe] text-white hover:bg-blue-600 shadow-xs"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* WhatsApp Template Dispatch Modal */}
      {waModalVoter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Send WhatsApp Campaign Message
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    To: {waModalVoter.name} ({waModalVoter.phone})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWaModalVoter(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Template Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Select Pre-Approved Marathi / English Message Template:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {WHATSAPP_TEMPLATES.map((tmpl) => {
                    const active = selectedTemplateId === tmpl.id;
                    return (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => handleSelectTemplate(tmpl.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          active
                            ? "bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-500 shadow-xs"
                            : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {tmpl.title}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {tmpl.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message Preview / Editable Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Message Preview (Personalized):
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:underline"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedToast ? "Copied!" : "Copy Text"}
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={customWaText}
                  onChange={(e) => setCustomWaText(e.target.value)}
                  className="w-full p-3 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Notice */}
              <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Clicking <strong>Open WhatsApp</strong> will launch WhatsApp Web or Mobile with this pre-filled message ready to dispatch.
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50/50 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setWaModalVoter(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                Open WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Central Voter Profile Modal */}
      {selectedVoterForProfile && (
        <CentralVoterProfile
          isOpen={!!selectedVoterForProfile}
          voter={selectedVoterForProfile}
          onClose={() => setSelectedVoterForProfile(null)}
        />
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  X,
  ThumbsUp,
  HelpCircle,
  ThumbsDown,
  Scale,
  MapPin,
  Save,
  Navigation,
  FileText,
  Tag,
} from "lucide-react";
import { VoterRecord, VoterClassification } from "../../types/karyakarta.types";
import { useKaryakartaAuth } from "../../context/karyakarta-auth-context";

interface IndividualSurveyModalProps {
  voter: VoterRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedVoter: VoterRecord) => void;
}

const COMMON_SCHEMES = [
  "Mukhyamantri Ladki Bahin Yojana",
  "Pradhan Mantri Awas Yojana (PMAY)",
  "PM-KISAN Samman Nidhi",
  "Ayushman Bharat / Mahatma Phule Jan Arogya",
  "Student Free Bus Pass Scheme",
  "Senior Citizen Travel Concession",
  "Ujjwala Gas Yojana",
  "Svanidhi Street Vendor Loan",
];

const COMMON_DEMANDS = [
  "Road repaving and pothole fixing",
  "Low water pressure / irregular supply timing",
  "Stormwater drain cleaning & desilting",
  "Streetlights installation / maintenance",
  "Garbage collection frequency increase",
  "Senior citizen garden / walking track",
  "Youth sports ground / library facility",
];

const OCCUPATION_OPTIONS = [
  "Retail Trader / Merchant",
  "IT Professional / Software Engineer",
  "Government Employee / Officer",
  "Homemaker & Self-Help Group",
  "College Student",
  "Retired Professional",
  "Healthcare / Doctor / Nurse",
  "Small Business Owner",
  "Daily Wage / Construction",
  "Transport / Auto / Cab Driver",
];

export function IndividualSurveyModal({
  voter,
  isOpen,
  onClose,
  onSave,
}: IndividualSurveyModalProps) {
  const { user } = useKaryakartaAuth();

  if (!isOpen || !voter) return null;

  // Form states initialized with voter current attributes
  const [classification, setClassification] = useState<VoterClassification>(
    voter.classification || "Neutral"
  );
  const [isVisited, setIsVisited] = useState<boolean>(true); // default true upon survey submission
  const [caste, setCaste] = useState<string>(voter.caste || "");
  const [occupation, setOccupation] = useState<string>(voter.occupation || "");
  const [selectedSchemes, setSelectedSchemes] = useState<string[]>(
    voter.scheme ? voter.scheme.split(", ").filter(Boolean) : []
  );
  const [demand, setDemand] = useState<string>(voter.demand || "");
  const [candidateHelp, setCandidateHelp] = useState<string>(voter.candidateHelp || "");
  const [remarks, setRemarks] = useState<string>(voter.remarks || "");
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isCapturingGps, setIsCapturingGps] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const toggleScheme = (sch: string) => {
    setSelectedSchemes((prev) =>
      prev.includes(sch) ? prev.filter((s) => s !== sch) : [...prev, sch]
    );
  };

  const handleCaptureGps = () => {
    setIsCapturingGps(true);
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({
            lat: Number(pos.coords.latitude.toFixed(6)),
            lng: Number(pos.coords.longitude.toFixed(6)),
          });
          setIsCapturingGps(false);
        },
        () => {
          // Fallback simulation for booth #101 coordinates
          setGpsCoords({ lat: 18.520432, lng: 73.856743 });
          setIsCapturingGps(false);
        },
        { timeout: 3000 }
      );
    } else {
      setGpsCoords({ lat: 18.520432, lng: 73.856743 });
      setIsCapturingGps(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const updated: VoterRecord = {
      ...voter,
      classification,
      isVisited,
      caste: caste.trim(),
      occupation: occupation.trim(),
      scheme: selectedSchemes.join(", "),
      demand: demand.trim(),
      candidateHelp: candidateHelp.trim(),
      remarks: remarks.trim(),
      lastVisitDate: formattedDate,
      lastUpdated: `${formattedDate}, ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
      assignedKaryakartaId: user?.id || voter.assignedKaryakartaId,
    };

    setTimeout(() => {
      onSave(updated);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold leading-tight">
                  Doorstep Survey: {voter.name}
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-cyan-300 border border-white/20">
                  {voter.epicId}
                </span>
              </div>
              <p className="text-xs text-purple-200 mt-0.5 font-marathi">
                {voter.marathiName} • Booth {voter.boothNumber} ({voter.boothName})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Political Leaning / Classification */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Voter Leaning &amp; Sentiment Classification <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setClassification("Supporter")}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  classification === "Supporter"
                    ? "border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                }`}
              >
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold">Supporter</span>
                <span className="text-[10px] text-emerald-600 font-marathi">अनुकूल</span>
              </button>

              <button
                type="button"
                onClick={() => setClassification("Doubtful")}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  classification === "Doubtful"
                    ? "border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                }`}
              >
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold">Doubtful</span>
                <span className="text-[10px] text-amber-600 font-marathi">साशंक</span>
              </button>

              <button
                type="button"
                onClick={() => setClassification("Opponent")}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  classification === "Opponent"
                    ? "border-2 border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                }`}
              >
                <ThumbsDown className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold">Opponent</span>
                <span className="text-[10px] text-rose-600 font-marathi">विरोधी</span>
              </button>

              <button
                type="button"
                onClick={() => setClassification("Neutral")}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  classification === "Neutral"
                    ? "border-2 border-slate-500 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                }`}
              >
                <Scale className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-bold">Neutral</span>
                <span className="text-[10px] text-slate-500 font-marathi">तटस्थ</span>
              </button>
            </div>
          </div>

          {/* Section 2: Visit Confirmation & GPS */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isVisited}
                onChange={(e) => setIsVisited(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Mark as Visited (Doorstep completed)
              </span>
            </label>

            <div className="flex items-center gap-2">
              {gpsCoords ? (
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{gpsCoords.lat}, {gpsCoords.lng}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleCaptureGps}
                  disabled={isCapturingGps}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
                >
                  <Navigation className={`w-3.5 h-3.5 text-cyan-600 ${isCapturingGps ? "animate-spin" : ""}`} />
                  <span>{isCapturingGps ? "Capturing..." : "Pin GPS Location"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 3: Caste & Occupation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Caste / Community
              </label>
              <input
                type="text"
                value={caste}
                onChange={(e) => setCaste(e.target.value)}
                placeholder="e.g. Maratha, Brahmin, OBC, etc."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Occupation / Profession
              </label>
              <select
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
              >
                <option value="">Select or leave blank</option>
                {OCCUPATION_OPTIONS.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 4: Government Schemes Availed */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-purple-600" />
              <span>Government Schemes Availed / Requested</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SCHEMES.map((sch) => {
                const isSelected = selectedSchemes.includes(sch);
                return (
                  <button
                    key={sch}
                    type="button"
                    onClick={() => toggleScheme(sch)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                      isSelected
                        ? "bg-purple-100 text-purple-900 border-purple-300 font-bold dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800"
                        : "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {sch}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Specific Civic Demands */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span>Specific Citizen Demand / Local Area Issue</span>
              <span className="text-[10px] text-slate-400 font-normal">Click suggestion to autofill</span>
            </label>
            <div className="flex flex-wrap gap-1 mb-2">
              {COMMON_DEMANDS.slice(0, 4).map((cd) => (
                <button
                  key={cd}
                  type="button"
                  onClick={() => setDemand(cd)}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                >
                  + {cd}
                </button>
              ))}
            </div>
            <textarea
              value={demand}
              onChange={(e) => setDemand(e.target.value)}
              placeholder="Record local grievance, drainage, street, water, or housing query..."
              rows={2}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Section 6: Candidate Past Help & Remarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Candidate Help Provided in Past
              </label>
              <input
                type="text"
                value={candidateHelp}
                onChange={(e) => setCandidateHelp(e.target.value)}
                placeholder="e.g. Medical aid, school admission, ration card"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Cadre Remarks / Follow-up Notes
              </label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Influential in Somwar Ali, visit again"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Actions Footer */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 cursor-pointer transition-all disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Saving Survey..." : "Save Doorstep Survey"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

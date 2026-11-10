"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, AlertCircle } from "lucide-react";
import { useKaryakartaAuth } from "@/karyakarta/context/karyakarta-auth-context";
import {
  MOCK_SCOPED_VOTERS,
  MOCK_BOOTHS,
  MOCK_ACTIVITIES,
  MOCK_ISSUES,
} from "@/karyakarta/data/mock-karyakarta-data";
import { VoterRecord } from "@/karyakarta/types/karyakarta.types";
import { CentralVoterProfile } from "@/karyakarta/components/voters/central-voter-profile";
import { IndividualSurveyModal } from "@/karyakarta/components/surveys/individual-survey-modal";

export default function VoterProfileDeepLinkPage() {
  const params = useParams();
  const router = useRouter();
  const { assignedBooths } = useKaryakartaAuth();

  const voterId = (params?.id as string) || "";

  // Dynamic voters state
  const [voters, setVoters] = useState<VoterRecord[]>(MOCK_SCOPED_VOTERS);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);

  // Find target voter by ID or EPIC ID
  const matchedVoter = useMemo(() => {
    return voters.find(
      (v) =>
        v.id.toLowerCase() === voterId.toLowerCase() ||
        v.epicId.toLowerCase() === voterId.toLowerCase()
    );
  }, [voters, voterId]);

  // Check booth scoping access
  const isAccessible = useMemo(() => {
    if (!matchedVoter) return false;
    if (!assignedBooths || assignedBooths.length === 0) return true;
    return assignedBooths.includes(matchedVoter.boothNumber);
  }, [matchedVoter, assignedBooths]);

  const handleUpdateVoter = (updated: VoterRecord) => {
    setVoters((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
  };

  if (!matchedVoter) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mt-8 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Voter Record Not Found</h2>
        <p className="text-xs text-slate-500">
          No voter matches ID or EPIC <code className="font-mono font-bold text-slate-800">{voterId}</code>.
        </p>
        <Link
          href="/karyakarta/search-voter"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2087FE] text-white font-bold text-xs"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Back to Voter Search</span>
        </Link>
      </div>
    );
  }

  if (!isAccessible) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900 shadow-sm mt-8 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Access Restricted</h2>
        <p className="text-xs text-slate-500">
          This voter belongs to Booth <strong>{matchedVoter.boothNumber}</strong>, which is not in your allocated field booths ({assignedBooths?.join(", ")}).
        </p>
        <Link
          href="/karyakarta/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <CentralVoterProfile
        voter={matchedVoter}
        isOpen={true}
        onClose={() => router.push("/karyakarta/search-voter")}
        allVoters={voters}
        allBooths={MOCK_BOOTHS}
        allActivities={MOCK_ACTIVITIES}
        allIssues={MOCK_ISSUES}
        onOpenSurvey={() => setIsSurveyOpen(true)}
        onPrintSlip={(v) => router.push(`/karyakarta/slip-history?voter=${v.epicId}`)}
        onRaiseIssue={(v) => router.push(`/karyakarta/issues?voter=${v.epicId}`)}
        onSelectFamilyMember={(m) => router.push(`/karyakarta/voters/${m.id}`)}
      />

      <IndividualSurveyModal
        voter={matchedVoter}
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
        onSave={handleUpdateVoter}
      />
    </div>
  );
}

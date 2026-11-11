"use client";

import React from "react";
import {
  X,
  Home,
  Crown,
  FileText,
} from "lucide-react";
import { VoterRecord } from "../../types/karyakarta.types";

interface FamilyTreeModalProps {
  familyId: string | null;
  isOpen: boolean;
  onClose: () => void;
  allVoters: VoterRecord[];
  onSelectVoter: (voter: VoterRecord) => void;
  onOpenSurvey?: (voter: VoterRecord) => void;
}

export function FamilyTreeModal({
  familyId,
  isOpen,
  onClose,
  allVoters,
  onSelectVoter,
  onOpenSurvey,
}: FamilyTreeModalProps) {
  if (!isOpen || !familyId) return null;

  const members = allVoters.filter((v) => v.familyId === familyId);
  const head = members.find((m) => m.familyHead) || members[0];
  const otherMembers = members.filter((m) => m.id !== head?.id);

  if (!head) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-cyan-300 border border-blue-400/30">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold leading-tight">
                  Household Family Tree: {head.name}
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-cyan-300 border border-white/20">
                  {familyId}
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                {head.houseNo}, {head.address} &bull; {members.length} Registered Voters
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

        {/* Tree Container */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Level 1: Head of Family */}
          <div className="flex flex-col items-center">
            <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-50 to-indigo-50/60 dark:from-blue-950/40 dark:to-slate-800/80 border-2 border-blue-400 dark:border-blue-700 shadow-md max-w-md w-full relative">
              <span className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#2087FE] text-white flex items-center gap-1 shadow-xs">
                <Crown className="w-3 h-3 text-amber-300" />
                <span>Head of Household</span>
              </span>

              <div className="flex items-start justify-between gap-3 pt-1">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {head.name}
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-marathi">
                    {head.marathiName}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                    <span>{head.age} Yrs / {head.gender}</span>
                    <span>•</span>
                    <span className="font-mono">{head.epicId}</span>
                    <span>•</span>
                    <span className="font-bold text-blue-600">{head.classification}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      onSelectVoter(head);
                      onClose();
                    }}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 hover:bg-blue-50 text-xs font-semibold cursor-pointer"
                    title="Open Full Profile"
                  >
                    Profile &rarr;
                  </button>
                  {onOpenSurvey && (
                    <button
                      onClick={() => {
                        onOpenSurvey(head);
                        onClose();
                      }}
                      className="p-1.5 rounded-lg bg-[#2087FE] text-white hover:bg-blue-600 text-xs font-semibold cursor-pointer"
                      title="Conduct Survey"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tree Branch Line */}
            {otherMembers.length > 0 && (
              <div className="w-0.5 h-8 bg-purple-300 dark:bg-purple-700 my-1" />
            )}
          </div>

          {/* Level 2: Other Family Members Grid */}
          {otherMembers.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                Dependent &amp; Household Voters ({otherMembers.length})
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {otherMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-2.5 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          {member.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700">
                          {member.relation} {member.relativeName.split(" ")[0]}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-marathi">
                        {member.marathiName}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                        <span>{member.age} Yrs / {member.gender}</span>
                        <span>•</span>
                        <span className="font-mono">{member.epicId}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-600">
                        {member.classification}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            onSelectVoter(member);
                            onClose();
                          }}
                          className="px-2 py-1 rounded-md text-[11px] font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer"
                        >
                          Profile
                        </button>
                        {onOpenSurvey && (
                          <button
                            onClick={() => {
                              onOpenSurvey(member);
                              onClose();
                            }}
                            className="p-1 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300 cursor-pointer"
                            title="Survey Member"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

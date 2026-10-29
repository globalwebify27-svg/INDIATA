"use client";

import React, { useState } from "react";
import { Send, ShieldCheck } from "lucide-react";
import { CandidateRecord } from "../../types/superadmin.types";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import { useToast } from "../../context/toast-context";

export interface CredentialDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateRecord | null;
}

export function CredentialDeliveryModal({
  isOpen,
  onClose,
  candidate,
}: CredentialDeliveryModalProps) {
  const { toast } = useToast();
  const [deliveryChannel, setDeliveryChannel] = useState<"whatsapp" | "email" | "both">("whatsapp");
  const [isDispatching, setIsDispatching] = useState(false);

  if (!isOpen || !candidate) return null;

  const handleDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      const channelLabel =
        deliveryChannel === "both"
          ? "WhatsApp and Email"
          : deliveryChannel === "whatsapp"
          ? "WhatsApp"
          : "Email";

      toast(
        `Secure activation link dispatched via ${channelLabel} to ${candidate.phone} / ${candidate.email}.`,
        "success"
      );
      setIsDispatching(false);
      onClose();
    }, 400);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Candidate Credential Delivery & Activation"
      description="Dispatch one-time activation credentials to the candidate or campaign manager."
      maxWidth="md"
      footer={
        <div className="flex items-center justify-end gap-2.5">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isDispatching}>
            Skip / Later
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDispatch}
            isLoading={isDispatching}
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            Dispatch Activation
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Candidate Identity Card */}
        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              {candidate.name}
            </span>
            <span className="font-mono text-[11px] text-slate-500 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              {candidate.id}
            </span>
          </div>
          <div className="text-slate-600 dark:text-slate-400">
            Registered Username: <strong className="font-mono text-slate-800 dark:text-slate-200">{candidate.username}</strong>
          </div>
          <div className="text-slate-600 dark:text-slate-400">
            Phone: <strong className="text-slate-800 dark:text-slate-200">{candidate.phone}</strong>
          </div>
          <div className="text-slate-600 dark:text-slate-400">
            Email: <strong className="text-slate-800 dark:text-slate-200">{candidate.email}</strong>
          </div>
        </div>

        {/* Channel Selection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Select Delivery Channel
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "whatsapp", label: "WhatsApp" },
              { id: "email", label: "Email" },
              { id: "both", label: "Both Channels" },
            ].map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => setDeliveryChannel(ch.id as "whatsapp" | "email" | "both")}
                className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-colors ${
                  deliveryChannel === ch.id
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 font-semibold"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>

        {/* Security Guard Advisory */}
        <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 flex items-start gap-2 text-sky-800 dark:text-sky-300 text-xs">
          <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0 text-sky-600 dark:text-sky-400" />
          <div className="text-[11px] leading-relaxed">
            <strong className="block font-semibold">Security Guard Protocol:</strong>
            INDIATA never dispatches plaintext passwords over telecommunication channels. The recipient will receive a one-time encrypted activation link to configure their own administrative password.
          </div>
        </div>
      </div>
    </Dialog>
  );
}

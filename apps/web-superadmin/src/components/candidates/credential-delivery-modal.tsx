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
        <div className="p-3.5 rounded-lg bg-[#F3F8FD]/50 dark:bg-[#072439] border border-[#ACB9D1] dark:border-[#0e3554] text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#010627] dark:text-[#F5F6F6] text-sm">
              {candidate.name}
            </span>
            <span className="font-mono text-[11px] text-[#717785] dark:text-[#94A3B8] bg-[#FDFEFE] dark:bg-[#062237] px-2 py-0.5 rounded border border-[#ACB9D1] dark:border-[#0e3554]">
              {candidate.id}
            </span>
          </div>
          <div className="text-[#717785] dark:text-[#94A3B8]">
            Registered Username: <strong className="font-mono text-[#010627] dark:text-[#F5F6F6]">{candidate.username}</strong>
          </div>
          <div className="text-[#717785] dark:text-[#94A3B8]">
            Phone: <strong className="text-[#010627] dark:text-[#F5F6F6]">{candidate.phone}</strong>
          </div>
          <div className="text-[#717785] dark:text-[#94A3B8]">
            Email: <strong className="text-[#010627] dark:text-[#F5F6F6]">{candidate.email}</strong>
          </div>
        </div>

        {/* Channel Selection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#010627] dark:text-[#F5F6F6]">
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
                className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                  deliveryChannel === ch.id
                    ? "border-[#2087FE] dark:border-[#0D79FD] bg-[#E0EDFE] dark:bg-[#0D79FD]/15 text-[#2087FE] dark:text-[#0D79FD] font-semibold"
                    : "border-[#ACB9D1] dark:border-[#0e3554] hover:border-[#2087FE] dark:hover:border-[#0D79FD] bg-[#FDFEFE] dark:bg-[#072439] text-[#717785] dark:text-[#94A3B8]"
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>

        {/* Security Guard Advisory */}
        <div className="p-3 rounded-lg bg-[#E0EDFE]/50 dark:bg-[#072439] border border-[#2087FE]/20 dark:border-[#0e3554] flex items-start gap-2 text-[#010627] dark:text-[#F5F6F6] text-xs">
          <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#2087FE] dark:text-[#0D79FD]" />
          <div className="text-[11px] leading-relaxed">
            <strong className="block font-semibold">Security Guard Protocol:</strong>
            INDIATA never dispatches plaintext passwords over telecommunication channels. The recipient will receive a one-time encrypted activation link to configure their own administrative password.
          </div>
        </div>
      </div>
    </Dialog>
  );
}

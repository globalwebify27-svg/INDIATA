"use client";

import React, { useState } from "react";
import {
  X,
  Printer,
  Share2,
  QrCode,
  CheckCircle2,
} from "lucide-react";
import { VoterRecord } from "../../types/karyakarta.types";
import { useKaryakartaAuth } from "../../context/karyakarta-auth-context";

interface VoterSlipPreviewModalProps {
  isOpen: boolean;
  voter: VoterRecord | null;
  onClose: () => void;
  onSlipDispatched?: (method: "PRINTED" | "DIGITAL_WHATSAPP") => void;
}

export function VoterSlipPreviewModal({
  isOpen,
  voter,
  onClose,
  onSlipDispatched,
}: VoterSlipPreviewModalProps) {
  const { user } = useKaryakartaAuth();
  const [layoutMode, setLayoutMode] = useState<"A4_CARD" | "THERMAL_80MM">("A4_CARD");
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  if (!isOpen || !voter) return null;

  const candidateName = user?.candidateName || "Anand Shinde";
  const constituencyName = user?.constituencyName || "215 - Kasba Peth Assembly";

  const handlePrint = () => {
    // Record dispatch
    if (onSlipDispatched) {
      onSlipDispatched("PRINTED");
    }
    setDispatchStatus("Slip dispatched to printer!");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleWhatsAppShare = () => {
    if (!voter.phone) {
      alert("No mobile phone recorded for this voter. Please update phone number first.");
      return;
    }
    const cleanPhone = voter.phone.replace(/[^0-9]/g, "");
    const message = encodeURIComponent(
      `*अधिकृत मतदार माहिती स्लिप (VOTER SLIP)*\n\n` +
      `विधानसभा: ${constituencyName}\n` +
      `मतदार: *${voter.name}* (${voter.marathiName || ""})\n` +
      `ओळखपत्र (EPIC): *${voter.epicId}*\n` +
      `मतदान केंद्र (Booth): *Booth ${voter.boothNumber}*\n` +
      `यादीतील अनुक्रमांक (Serial): *#${voter.serialNumber || 42}*\n` +
      `घर क्र / पत्ता: ${voter.houseNo ? voter.houseNo + ", " : ""}${voter.address}\n\n` +
      `मतदान दिनांक: २० नोव्हेंबर २०२६ (सकाळी ७:०० ते संध्याकाळी ६:००)\n` +
      `स्थानिक केंद्र: नवभारत हायस्कूल, शनिवार पेठ, पुणे.\n\n` +
      `— उमेदवार: *${candidateName}* प्रचार व जनसंपर्क कक्ष`
    );

    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
    if (onSlipDispatched) {
      onSlipDispatched("DIGITAL_WHATSAPP");
    }
    setDispatchStatus("Digital slip shared via WhatsApp!");
    setTimeout(() => setDispatchStatus(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl my-6 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header (Hidden during print) */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2087fe] text-white flex items-center justify-center font-bold">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Voter Slip Preview & Dispatch
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                ECI Format Official Elector Information Slip
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Layout Mode Toggle */}
            <div className="flex bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLayoutMode("A4_CARD")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  layoutMode === "A4_CARD"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Standard Card
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode("THERMAL_80MM")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  layoutMode === "THERMAL_80MM"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Thermal (80mm)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Voter Slip Container */}
        <div className="p-6 overflow-y-auto flex-1 flex justify-center bg-slate-100 dark:bg-slate-950">
          {/* THE PHYSICAL SLIP (Styled for screen & print) */}
          <div
            id="printable-voter-slip"
            className={`bg-white text-slate-900 shadow-md border border-slate-300 rounded-xl overflow-hidden print:m-0 print:border-none print:shadow-none ${
              layoutMode === "THERMAL_80MM"
                ? "w-[300px] p-4 font-mono text-xs space-y-2 border-dashed border-2"
                : "w-[440px] p-5 space-y-4"
            }`}
          >
            {/* Header / National Emblem simulation */}
            <div className="text-center border-b border-slate-300 pb-2.5">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-700">
                ELECTION COMMISSION OF INDIA
              </div>
              <div className="text-xs font-black text-slate-900 mt-0.5">
                VOTER INFORMATION SLIP (मतदार माहिती स्लिप)
              </div>
              <div className="text-[10px] font-semibold text-slate-600">
                {constituencyName} • Part #42
              </div>
            </div>

            {/* Candidate & Campaign branding badge */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center justify-between text-xs">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Candidate:</span>
                <span className="font-extrabold text-blue-900">{candidateName}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Polling Date:</span>
                <span className="font-bold text-slate-800">20 Nov 2026</span>
              </div>
            </div>

            {/* Voter Primary Identity Table */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-600">Voter Name:</span>
                <span className="font-bold text-slate-900 text-right">
                  {voter.name}
                  {voter.marathiName && <div className="text-[11px] font-normal text-slate-700">{voter.marathiName}</div>}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-600">EPIC (Voter ID):</span>
                <span className="font-mono font-black text-slate-900 text-sm tracking-wider">
                  {voter.epicId}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-600">Booth / Polling Station:</span>
                <span className="font-extrabold text-blue-800 text-right">
                  Booth {voter.boothNumber}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-600">Serial No in Roll:</span>
                <span className="font-mono font-black text-base text-rose-700">
                  #{voter.serialNumber || 42}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-600">Age / Gender:</span>
                <span className="font-semibold text-slate-800">
                  {voter.age} Yrs / {voter.gender}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-600">Relative Name:</span>
                <span className="font-semibold text-slate-800">
                  {voter.relativeName || "S. Verma"} ({voter.relation || "S/o"})
                </span>
              </div>

              <div className="flex justify-between pt-1">
                <span className="text-slate-600">Address / House:</span>
                <span className="text-slate-800 text-right max-w-[220px] font-medium text-[11px]">
                  {voter.houseNo ? `House ${voter.houseNo}, ` : ""}
                  {voter.address}
                </span>
              </div>
            </div>

            {/* Polling Station Address & Simulated Barcode */}
            <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-center space-y-1">
              <div className="text-[10px] font-bold uppercase text-blue-900">
                Polling Centre (मतदान केंद्र):
              </div>
              <div className="text-xs font-bold text-slate-900">
                Navbharat High School, Ground Floor (East Wing)
              </div>
              <div className="text-[10px] text-slate-600">
                124, Shaniwar Peth, Near Shaniwar Wada, Pune 411030
              </div>
            </div>

            {/* QR Code / Barcode Simulation */}
            <div className="pt-2 flex flex-col items-center justify-center border-t border-slate-200">
              <div className="w-16 h-16 border-2 border-slate-800 p-1 flex items-center justify-center">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
              <span className="text-[9px] font-mono text-slate-500 mt-1">
                {voter.epicId}-B{voter.boothNumber}-S{voter.serialNumber || 42}
              </span>
              <p className="text-[9px] text-slate-500 text-center mt-1">
                * हा अधिकृत ओळख पुरावा नाही. कृपया मतदानासाठी मूळ आधार किंवा मतदार कार्ड सोबत आणा.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden during print) */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {dispatchStatus ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {dispatchStatus}
              </span>
            ) : (
              <span>Select Thermal Bluetooth or Laser A4 printer</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* WhatsApp Share Button */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share on WhatsApp
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-[#2087fe] hover:bg-blue-600 text-white shadow-md transition-transform active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Slip Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

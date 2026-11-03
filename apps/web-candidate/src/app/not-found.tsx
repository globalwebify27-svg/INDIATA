import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto bg-[#F1F3FA] dark:bg-[#0B1120] text-[#161B2A] dark:text-[#F8FAFC]">
      <div className="w-14 h-14 rounded-2xl bg-[#E0E7FF] dark:bg-[#1E1B4B] text-[#493BBF] dark:text-[#818CF8] flex items-center justify-center mb-4 shadow-sm border border-[#C7D2FE] dark:border-[#3730A3]">
        <ShieldAlert className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-bold mb-2">404 - Section Not Found</h2>
      <p className="text-sm text-[#707E94] dark:text-[#94A3B8] mb-6">
        The requested candidate portal section or war room module does not exist or has been relocated.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#493BBF] hover:bg-[#3D2FA8] text-white text-sm font-semibold shadow-md transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to War Room Command
      </Link>
    </div>
  );
}

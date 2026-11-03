"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto bg-[#F1F3FA] dark:bg-[#0B1120] text-[#161B2A] dark:text-[#F8FAFC]">
      <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-4 shadow-sm border border-red-200 dark:border-red-800">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-bold mb-2">Candidate War Room Error</h2>
      <p className="text-sm text-[#707E94] dark:text-[#94A3B8] mb-6">
        {error.message ||
          "An unexpected error occurred while rendering the Candidate War Room interface."}
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#493BBF] hover:bg-[#3D2FA8] text-white text-sm font-semibold shadow-md transition-all cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" />
        Reload War Room
      </button>
    </div>
  );
}

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
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-[#F48637]/15 text-red-600 dark:text-[#F48637] flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
      <p className="text-sm text-[#717785] dark:text-[#94A3B8] mb-6">
        {error.message ||
          "An unexpected error occurred while loading this screen."}
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2087FE] hover:bg-[#1A6ED1] dark:bg-[#0D79FD] dark:hover:bg-[#0B68D9] text-white text-sm font-medium transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}

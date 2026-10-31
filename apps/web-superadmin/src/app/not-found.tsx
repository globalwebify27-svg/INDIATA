import React from "react";
import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#072439] text-[#717785] dark:text-[#94A3B8] flex items-center justify-center mb-4">
        <FileQuestion className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold mb-2">404 - Page Not Found</h2>
      <p className="text-sm text-[#717785] dark:text-[#94A3B8] mb-6">
        The platform resource you are looking for does not exist or has been
        moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E0EDFE] hover:bg-[#ACB9D1]/30 dark:bg-[#072439] dark:hover:bg-[#0e3554] text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Super Admin Home
      </Link>
    </div>
  );
}

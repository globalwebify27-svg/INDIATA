"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "md",
}: DialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Box */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${maxWidthMap[maxWidth]} bg-[#FDFEFE] dark:bg-slate-900 rounded-xl border border-[#ACB9D1] dark:border-slate-800 shadow-xl overflow-hidden z-10 animate-in zoom-in-95 duration-150`}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[#ACB9D1] dark:border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-[#010627] dark:text-slate-100">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-xs text-[#717785] dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#717785] hover:text-[#010627] dark:hover:text-slate-200 hover:bg-[#E0EDFE] dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 bg-[#F3F8FD] dark:bg-slate-800/50 border-t border-[#ACB9D1] dark:border-slate-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

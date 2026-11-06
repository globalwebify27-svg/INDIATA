"use client";

import React from "react";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: SwitchProps) {
  return (
    <label className={`flex items-start gap-3 select-none ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2087FE]/30 dark:focus-visible:ring-[#0D79FD]/30 ${
          checked ? "bg-[#2087FE] dark:bg-[#0D79FD]" : "bg-[#ACB9D1] dark:bg-[#072439] dark:border dark:border-[#0e3554]"
        }`}
      >
        <span
          className={`pointer-events-none block h-3.5 w-3.5 rounded-full bg-white shadow-xs transition-transform ${
            checked ? "translate-x-4.5" : "translate-x-1"
          }`}
        />
      </button>
      {(label || description) && (
        <div className="leading-tight">
          {label && (
            <span className="text-xs font-medium text-[#010627] dark:text-[#F5F6F6]">
              {label}
            </span>
          )}
          {description && (
            <p className="text-[11px] text-[#717785] dark:text-[#94A3B8] mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}
    </label>
  );
}

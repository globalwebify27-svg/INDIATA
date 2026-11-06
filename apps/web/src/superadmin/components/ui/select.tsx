"use client";

import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, helperText, options, className = "", id, ...props },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-[#010627] dark:text-[#94A3B8] uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={`w-full text-xs sm:text-sm rounded-lg border bg-[#FDFEFE] dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] py-2 pl-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-[#2087FE]/20 dark:focus:ring-[#0D79FD]/20 focus:border-[#2087FE] dark:focus:border-[#0D79FD] disabled:opacity-50 disabled:bg-[#F3F8FD] dark:disabled:bg-[#011A2D] transition-colors cursor-pointer ${
              error
                ? "border-[#FC7C36] focus:border-[#FC7C36] focus:ring-[#FC7C36]/20 dark:border-[#F48637] dark:focus:border-[#F48637] dark:focus:ring-[#F48637]/20"
                : "border-[#ACB9D1] dark:border-[#0e3554]"
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="bg-[#FDFEFE] dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6]"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 text-[#717785] dark:text-[#94A3B8] pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error ? (
          <p className="text-xs text-[#FC7C36] dark:text-[#F48637]">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#717785] dark:text-[#94A3B8]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";

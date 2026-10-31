"use client";

import React, { forwardRef } from "react";
import { Search, X } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-[#010627] dark:text-[#94A3B8] uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#717785] dark:text-[#94A3B8] pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={`w-full text-xs sm:text-sm rounded-lg border bg-[#FDFEFE] dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] placeholder:text-[#717785] dark:placeholder:text-[#94A3B8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2087FE]/20 dark:focus:ring-[#0D79FD]/20 focus:border-[#2087FE] dark:focus:border-[#0D79FD] disabled:opacity-50 disabled:bg-[#F3F8FD] dark:disabled:bg-[#011A2D] py-2 ${
              leftIcon ? "pl-9" : "pl-3"
            } ${rightIcon ? "pr-9" : "pr-3"} ${
              error
                ? "border-[#FC7C36] focus:border-[#FC7C36] focus:ring-[#FC7C36]/20 dark:border-[#F48637] dark:focus:border-[#F48637] dark:focus:ring-[#F48637]/20"
                : "border-[#ACB9D1] dark:border-[#0e3554]"
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[#717785] dark:text-[#94A3B8]">
              {rightIcon}
            </div>
          )}
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

Input.displayName = "Input";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  className = "",
  ...props
}: SearchInputProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 absolute left-3 text-[#717785] dark:text-[#94A3B8] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-xs pl-9 pr-8 py-1.5 rounded-lg border border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] placeholder:text-[#717785] dark:placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2087FE]/20 dark:focus:ring-[#0D79FD]/20 focus:border-[#2087FE] dark:focus:border-[#0D79FD]"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            if (onClear) onClear();
          }}
          className="absolute right-2.5 text-[#717785] hover:text-[#010627] dark:hover:text-[#F5F6F6]"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

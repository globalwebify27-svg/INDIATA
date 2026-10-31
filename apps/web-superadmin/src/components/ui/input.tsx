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
            className="block text-xs font-semibold text-[#010627] dark:text-slate-300 uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#717785] dark:text-slate-500 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={`w-full text-xs sm:text-sm rounded-lg border bg-[#FDFEFE] dark:bg-slate-900 text-[#010627] dark:text-slate-100 placeholder:text-[#717785] dark:placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2087FE]/20 focus:border-[#2087FE] disabled:opacity-50 disabled:bg-[#F3F8FD] dark:disabled:bg-slate-950 py-2 ${
              leftIcon ? "pl-9" : "pl-3"
            } ${rightIcon ? "pr-9" : "pr-3"} ${
              error
                ? "border-[#FC7C36] focus:border-[#FC7C36] focus:ring-[#FC7C36]/20"
                : "border-[#ACB9D1] dark:border-slate-700"
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[#717785] dark:text-slate-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-[#FC7C36] dark:text-rose-400">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#717785] dark:text-slate-400">{helperText}</p>
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
      <Search className="w-4 h-4 absolute left-3 text-[#717785] dark:text-slate-500 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-xs pl-9 pr-8 py-1.5 rounded-lg border border-[#ACB9D1] dark:border-slate-700 bg-[#FDFEFE] dark:bg-slate-900 text-[#010627] dark:text-slate-100 placeholder:text-[#717785] dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2087FE]/20 focus:border-[#2087FE]"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            if (onClear) onClear();
          }}
          className="absolute right-2.5 text-[#717785] hover:text-[#010627] dark:hover:text-slate-200"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

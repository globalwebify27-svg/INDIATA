import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-[#252A3A] dark:text-[#F8FAFC] mb-1.5 uppercase tracking-wide"
          >
            {label}
            {props.required && <span className="text-[#E15B70] ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={twMerge(
            clsx(
              "w-full px-3.5 py-2 rounded-lg border text-sm transition-colors",
              "bg-white dark:bg-[#0F172A] text-[#252A3A] dark:text-[#F8FAFC]",
              "border-[#E2E8F0] dark:border-[#1E293B]",
              "focus:outline-none focus:ring-2 focus:ring-[#6256D9] focus:border-[#6256D9]",
              "placeholder:text-[#707E94] dark:placeholder:text-[#94A3B8]",
              "disabled:bg-[#F1F3FA] dark:disabled:bg-[#1E293B] disabled:cursor-not-allowed",
              error && "border-[#E15B70] focus:ring-[#E15B70] focus:border-[#E15B70]",
              className,
            ),
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-[#E15B70] font-medium">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs text-[#707E94] dark:text-[#94A3B8]">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

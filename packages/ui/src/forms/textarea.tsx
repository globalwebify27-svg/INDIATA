import React, { forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = "", id, disabled, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
          >
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          className={twMerge(
            clsx(
              "w-full rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs p-3 transition-colors",
              "border-slate-200 dark:border-slate-800",
              "focus:outline-none focus:ring-2 focus:ring-[#2087FE]/30 focus:border-[#2087FE]",
              "placeholder:text-slate-400 dark:placeholder:text-slate-500",
              "disabled:bg-slate-100 dark:disabled:bg-slate-800/60 disabled:cursor-not-allowed",
              error ? "border-rose-500 focus:ring-rose-500/30 focus:border-rose-500" : "",
              className
            )
          )}
          {...props}
        />
        {error && (
          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

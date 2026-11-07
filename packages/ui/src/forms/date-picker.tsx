import React, { forwardRef } from "react";
import { Calendar } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, helperText, className = "", id, disabled, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
          >
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <div className="absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <input
            ref={ref}
            type="date"
            id={inputId}
            disabled={disabled}
            className={twMerge(
              clsx(
                "w-full rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs pl-9 pr-3.5 py-2 transition-colors",
                "border-slate-200 dark:border-slate-800",
                "focus:outline-none focus:ring-2 focus:ring-[#2087FE]/30 focus:border-[#2087FE]",
                "disabled:bg-slate-100 dark:disabled:bg-slate-800/60 disabled:cursor-not-allowed",
                error ? "border-rose-500 focus:ring-rose-500/30 focus:border-rose-500" : "",
                className
              )
            )}
            {...props}
          />
        </div>
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

DatePicker.displayName = "DatePicker";

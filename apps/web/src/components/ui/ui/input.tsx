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
            className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5 uppercase tracking-wide"
          >
            {label}
            {props.required && <span className="text-rose-600 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={twMerge(
            clsx(
              "w-full px-3.5 py-2 rounded-xl border text-xs transition-colors",
              "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100",
              "border-slate-200 dark:border-slate-700",
              "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
              "placeholder:text-slate-400 dark:placeholder:text-slate-500",
              "disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed",
              error && "border-rose-500 focus:ring-rose-500",
              className,
            ),
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

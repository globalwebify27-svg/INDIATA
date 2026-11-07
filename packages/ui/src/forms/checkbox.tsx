import React, { forwardRef } from "react";
import { Check } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, checked, className = "", id, disabled, onChange, ...props }, ref) => {
    const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <label
        htmlFor={checkboxId}
        className={twMerge(
          clsx(
            "inline-flex items-start gap-2.5 cursor-pointer select-none",
            disabled ? "opacity-50 cursor-not-allowed" : "",
            className
          )
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="sr-only peer"
            {...props}
          />
          <div
            className={clsx(
              "w-4 h-4 rounded-md border transition-all flex items-center justify-center",
              "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900",
              "peer-checked:bg-[#2087FE] peer-checked:border-[#2087FE] peer-checked:text-white",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-[#2087FE]/40"
            )}
          >
            {checked && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {label}
              </span>
            )}
            {description && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

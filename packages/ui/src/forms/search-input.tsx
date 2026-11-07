import React, { forwardRef } from "react";
import { Search, X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className = "", value, onClear, onChange, placeholder = "Search...", ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={twMerge(
            clsx(
              "w-full rounded-xl border bg-slate-50 dark:bg-slate-900/80 text-slate-800 dark:text-slate-100 text-xs pl-8.5 pr-8 py-2 transition-colors",
              "border-slate-200 dark:border-slate-800",
              "focus:outline-none focus:ring-2 focus:ring-[#2087FE]/20 focus:border-[#2087FE] focus:bg-white dark:focus:bg-slate-900",
              "placeholder:text-slate-400 dark:placeholder:text-slate-500",
              className
            )
          )}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

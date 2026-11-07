import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ArrowLeft } from "lucide-react";

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  onBack?: () => void;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
  breadcrumbs,
  onBack,
  className,
}: PageHeaderProps) {
  return (
    <div className={twMerge(clsx("space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800", className))}>
      {breadcrumbs && <div className="mb-1">{breadcrumbs}</div>}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mt-0.5 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {title}
              </h1>
              {badge && <div>{badge}</div>}
            </div>
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: "full" | "7xl" | "6xl" | "5xl";
}

export function PageContainer({
  children,
  maxWidth = "full",
  className,
  ...props
}: PageContainerProps) {
  const maxWidthStyles = {
    full: "max-w-full",
    "7xl": "max-w-7xl mx-auto",
    "6xl": "max-w-6xl mx-auto",
    "5xl": "max-w-5xl mx-auto",
  }[maxWidth];

  return (
    <div
      className={twMerge(
        clsx("p-4 md:p-6 lg:p-8 space-y-6", maxWidthStyles, className)
      )}
      {...props}
    >
      {children}
    </div>
  );
}

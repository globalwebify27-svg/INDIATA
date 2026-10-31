import React from "react";
import { FolderSearch } from "lucide-react";
import { Button } from "./button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-[#ACB9D1] dark:border-slate-700 bg-[#F3F8FD]/50 dark:bg-slate-900/50 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#E0EDFE] dark:bg-slate-800 text-[#2087FE] dark:text-slate-500 flex items-center justify-center mb-3">
        {icon || <FolderSearch className="w-6 h-6" />}
      </div>
      <h3 className="text-sm font-semibold text-[#010627] dark:text-slate-200 mb-1">
        {title}
      </h3>
      <p className="text-xs text-[#717785] dark:text-slate-400 max-w-sm mb-4">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

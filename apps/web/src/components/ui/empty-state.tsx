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
      className={`flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-[#ACB9D1] dark:border-[#0e3554] bg-[#F3F8FD]/50 dark:bg-[#062237]/50 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#E0EDFE] dark:bg-[#072439] text-[#2087FE] dark:text-[#0D79FD] flex items-center justify-center mb-3">
        {icon || <FolderSearch className="w-6 h-6" />}
      </div>
      <h3 className="text-sm font-semibold text-[#010627] dark:text-[#F5F6F6] mb-1">
        {title}
      </h3>
      <p className="text-xs text-[#717785] dark:text-[#94A3B8] max-w-sm mb-4">
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

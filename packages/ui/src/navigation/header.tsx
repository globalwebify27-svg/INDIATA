import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface HeaderProps {
  leftContent?: React.ReactNode;
  centerContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
}

export function Header({
  leftContent,
  centerContent,
  rightContent,
  className,
}: HeaderProps) {
  return (
    <header
      className={twMerge(
        clsx(
          "h-16 px-4 md:px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between sticky top-0 z-20",
          className
        )
      )}
    >
      <div className="flex items-center gap-3">
        {leftContent}
      </div>

      {centerContent && (
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          {centerContent}
        </div>
      )}

      <div className="flex items-center gap-3">
        {rightContent}
      </div>
    </header>
  );
}

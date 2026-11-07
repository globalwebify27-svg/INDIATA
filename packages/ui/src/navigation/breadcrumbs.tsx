import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  homeHref?: string;
  className?: string;
  onNavigate?: (href: string) => void;
}

export function Breadcrumbs({
  items,
  homeHref = "/",
  className,
  onNavigate,
}: BreadcrumbsProps) {
  const handleClick = (e: React.MouseEvent, href?: string) => {
    if (href && onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={twMerge(
        clsx(
          "flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-1.5 overflow-x-auto py-1",
          className
        )
      )}
    >
      <a
        href={homeHref}
        onClick={(e) => handleClick(e, homeHref)}
        className="flex items-center gap-1 hover:text-[#2087FE] dark:hover:text-[#0D79FD] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
      </a>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            {isLast || !item.href ? (
              <span className="font-semibold text-slate-900 dark:text-white truncate">
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className="hover:text-[#2087FE] dark:hover:text-[#0D79FD] transition-colors truncate"
              >
                {item.label}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

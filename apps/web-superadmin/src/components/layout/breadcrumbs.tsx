import React from "react";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onItemClick?: (item: BreadcrumbItem) => void;
}

export function Breadcrumbs({ items, onItemClick }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-slate-500 dark:text-slate-400">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
          <Home className="w-3.5 h-3.5" />
          <span>INDIATA</span>
        </span>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={`${item.label}-${index}`}>
              <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600 flex-shrink-0" />
              {isLast || item.active ? (
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onItemClick && onItemClick(item)}
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {item.label}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}

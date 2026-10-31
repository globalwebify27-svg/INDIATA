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
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-[#717785] dark:text-[#94A3B8]">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="flex items-center gap-1 text-[#ACB9D1] dark:text-[#0e3554]">
          <Home className="w-3.5 h-3.5" />
          <span>INDIATA</span>
        </span>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={`${item.label}-${index}`}>
              <ChevronRight className="w-3 h-3 text-[#ACB9D1] dark:text-[#0e3554] flex-shrink-0" />
              {isLast || item.active ? (
                <span className="font-semibold text-[#010627] dark:text-[#F5F6F6]">
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onItemClick && onItemClick(item)}
                  className="hover:text-[#2087FE] dark:hover:text-[#0D79FD] transition-colors"
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

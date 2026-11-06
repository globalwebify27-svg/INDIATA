"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  currentPage?: string;
}

export function Breadcrumbs({ items, currentPage }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-[#667085] dark:text-[#94A3B8]">
      <div className="flex items-center gap-1.5 flex-wrap">
        <Link
          href="/candidate"
          className="flex items-center gap-1 font-bold text-[#5146D8] dark:text-[#8B7CEF] hover:opacity-80 transition-opacity"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Rajtantra</span>
        </Link>

        <ChevronRight className="w-3 h-3 text-[#98A2B3] shrink-0" />
        <span className="text-[#667085] dark:text-[#94A3B8]">Candidate Portal</span>

        <ChevronRight className="w-3 h-3 text-[#98A2B3] shrink-0" />
        <span className="font-semibold text-[#17243B] dark:text-[#F8FAFC]">
          {currentPage || "War Room Overview"}
        </span>

        {items &&
          items.map((item, idx) => (
            <React.Fragment key={`${item.label}-${idx}`}>
              <ChevronRight className="w-3 h-3 text-[#98A2B3] shrink-0" />
              {item.href && !item.active ? (
                <Link
                  href={item.href}
                  className="hover:text-[#5146D8] dark:hover:text-[#8B7CEF] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-[#17243B] dark:text-[#F8FAFC]">
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
      </div>
    </nav>
  );
}

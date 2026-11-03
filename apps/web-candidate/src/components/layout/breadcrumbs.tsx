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
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-[#707E94] dark:text-[#94A3B8]">
      <div className="flex items-center gap-1.5 flex-wrap">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 font-bold text-[#6256D9] dark:text-[#C5C0FF] hover:opacity-80 transition-opacity"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>INDIATA</span>
        </Link>

        <ChevronRight className="w-3 h-3 text-[#CBD5E1] dark:text-[#334155] shrink-0" />
        <span className="text-[#707E94] dark:text-[#94A3B8]">Candidate Admin</span>

        <ChevronRight className="w-3 h-3 text-[#CBD5E1] dark:text-[#334155] shrink-0" />
        <span className="font-bold text-[#252A3A] dark:text-[#F8FAFC]">
          {currentPage || "War Room Overview"}
        </span>

        {items &&
          items.map((item, idx) => (
            <React.Fragment key={`${item.label}-${idx}`}>
              <ChevronRight className="w-3 h-3 text-[#CBD5E1] dark:text-[#334155] shrink-0" />
              {item.href && !item.active ? (
                <Link
                  href={item.href}
                  className="hover:text-[#6256D9] dark:hover:text-[#C5C0FF] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-bold text-[#252A3A] dark:text-[#F8FAFC]">
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
      </div>
    </nav>
  );
}

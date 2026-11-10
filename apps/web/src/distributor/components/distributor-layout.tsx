"use client";

import React from "react";
import { DistributorSidebar } from "./distributor-sidebar";
import { DistributorHeader } from "./distributor-header";

interface DistributorLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function DistributorLayout({
  children,
  title,
  subtitle,
}: DistributorLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <DistributorSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DistributorHeader title={title} subtitle={subtitle} />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

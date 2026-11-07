import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  href?: string;
  isActive?: boolean;
  badge?: React.ReactNode;
  onClick?: () => void;
  collapsed?: boolean;
}

export function SidebarItem({
  label,
  icon,
  href,
  isActive = false,
  badge,
  onClick,
  collapsed = false,
}: SidebarItemProps) {
  const content = (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      title={collapsed ? label : undefined}
      className={clsx(
        "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none",
        isActive
          ? "bg-[#2087FE] text-white shadow-premium-xs dark:bg-[#0D79FD]"
          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white",
        collapsed ? "justify-center px-2" : ""
      )}
    >
      <span className="shrink-0 w-4 h-4">{icon}</span>
      {!collapsed && <span className="truncate flex-1">{label}</span>}
      {!collapsed && badge && <span className="shrink-0">{badge}</span>}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block no-underline">
        {content}
      </a>
    );
  }

  return content;
}

export interface SidebarGroupProps {
  title?: string;
  children: React.ReactNode;
  collapsed?: boolean;
}

export function SidebarGroup({ title, children, collapsed = false }: SidebarGroupProps) {
  return (
    <div className="space-y-1 py-1">
      {title && !collapsed && (
        <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {title}
        </div>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

export interface SidebarLayoutProps {
  children: React.ReactNode;
  collapsed?: boolean;
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function SidebarLayout({
  children,
  collapsed = false,
  logo,
  footer,
  className,
}: SidebarLayoutProps) {
  return (
    <aside
      className={twMerge(
        clsx(
          "h-screen flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-200 z-30",
          collapsed ? "w-18" : "w-64",
          className
        )
      )}
    >
      {logo && (
        <div className={clsx("p-4 border-b border-slate-100 dark:border-slate-800 flex items-center", collapsed ? "justify-center" : "justify-between")}>
          {logo}
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {children}
      </div>
      {footer && (
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          {footer}
        </div>
      )}
    </aside>
  );
}

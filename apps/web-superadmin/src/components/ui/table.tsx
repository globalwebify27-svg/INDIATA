import React from "react";

export function Table({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-[#ACB9D1] dark:border-slate-800 bg-[#FDFEFE] dark:bg-slate-900 shadow-xs">
      <table className={`w-full text-left border-collapse ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={`bg-[#F3F8FD] dark:bg-slate-800/60 border-b border-[#ACB9D1] dark:border-slate-800 text-[#717785] dark:text-slate-400 ${className}`}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={`divide-y divide-[#ACB9D1]/40 dark:divide-slate-800/60 ${className}`}
      {...props}
    >
      {children}
    </tbody>
  );
}

export function TableRow({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`transition-colors hover:bg-[#E0EDFE]/40 dark:hover:bg-slate-800/40 ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  className = "",
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-[#717785] dark:text-slate-400 select-none ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({
  className = "",
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={`py-3 px-4 text-xs sm:text-sm text-[#010627] dark:text-slate-300 align-middle ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}

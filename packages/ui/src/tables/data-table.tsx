import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./table";
import { ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import { clsx } from "clsx";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T, index: number) => string | number;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (columnKey: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  sortColumn,
  sortDirection,
  onSort,
  isLoading = false,
  emptyMessage = "No records found.",
  onRowClick,
}: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead
              key={col.key}
              className={clsx(col.sortable ? "cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200" : "", col.className)}
              onClick={() => col.sortable && onSort?.(col.key)}
            >
              <div className="flex items-center gap-1.5">
                <span>{col.header}</span>
                {col.sortable && (
                  <span className="text-slate-400">
                    {sortColumn === col.key ? (
                      sortDirection === "asc" ? (
                        <ChevronUp className="w-3.5 h-3.5 text-[#2087FE]" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-[#2087FE]" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                    )}
                  </span>
                )}
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="py-12 text-center text-slate-500">
              <div className="inline-flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#2087FE] border-t-transparent rounded-full animate-spin" />
                <span>Loading data...</span>
              </div>
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="py-12 text-center text-slate-400">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          data.map((item, idx) => (
            <TableRow
              key={keyExtractor(item, idx)}
              className={onRowClick ? "cursor-pointer" : ""}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <TableCell key={col.key} className={col.className}>
                  {col.render
                    ? col.render(item, idx)
                    : (item as Record<string, unknown>)[col.key] != null
                    ? String((item as Record<string, unknown>)[col.key])
                    : "—"}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

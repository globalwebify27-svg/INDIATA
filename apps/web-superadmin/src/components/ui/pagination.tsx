"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const startItem = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
      <div className="flex items-center gap-2">
        <span>
          Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{startItem}</span> to{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">{endItem}</span> of{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">{totalRecords}</span> entries
        </span>
        {onPageSizeChange && (
          <div className="ml-3 flex items-center gap-1.5">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none text-xs"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="xs"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
        >
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === totalPages ||
                (p >= currentPage - 1 && p <= currentPage + 1)
            )
            .map((page, idx, array) => {
              const prev = array[idx - 1];
              return (
                <React.Fragment key={page}>
                  {prev && page - prev > 1 && (
                    <span className="px-1 text-slate-400">...</span>
                  )}
                  <button
                    onClick={() => onPageChange(page)}
                    className={`min-w-[28px] h-7 px-2 rounded text-xs font-medium transition-colors ${
                      currentPage === page
                        ? "bg-sky-600 text-white font-semibold"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}
        </div>

        <Button
          variant="outline"
          size="xs"
          disabled={currentPage >= totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

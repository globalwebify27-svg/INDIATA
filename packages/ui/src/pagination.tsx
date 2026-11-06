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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-[#FDFEFE] dark:bg-[#062237] border-t border-[#ACB9D1] dark:border-[#0e3554] text-xs text-[#717785] dark:text-[#94A3B8]">
      <div className="flex items-center gap-2">
        <span>
          Showing <span className="font-semibold text-[#010627] dark:text-[#F5F6F6]">{startItem}</span> to{" "}
          <span className="font-semibold text-[#010627] dark:text-[#F5F6F6]">{endItem}</span> of{" "}
          <span className="font-semibold text-[#010627] dark:text-[#F5F6F6]">{totalRecords}</span> entries
        </span>
        {onPageSizeChange && (
          <div className="ml-3 flex items-center gap-1.5">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 rounded border border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#072439] text-[#010627] dark:text-[#F5F6F6] outline-none text-xs"
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
                    <span className="px-1 text-[#717785]">...</span>
                  )}
                  <button
                    onClick={() => onPageChange(page)}
                    className={`min-w-[28px] h-7 px-2 rounded text-xs font-medium transition-colors cursor-pointer ${
                      currentPage === page
                        ? "bg-[#2087FE] dark:bg-[#0D79FD] text-white font-semibold"
                        : "hover:bg-[#E0EDFE] dark:hover:bg-[#072439] text-[#010627] dark:text-[#94A3B8]"
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

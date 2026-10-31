"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Eye,
  Sparkles,
  Download,
} from "lucide-react";
import { CandidateRecord } from "../../types/superadmin.types";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { SearchInput } from "../ui/input";
import { Select } from "../ui/select";
import { Pagination } from "../ui/pagination";
import { EmptyState } from "../ui/empty-state";
import { CandidateDetailModal } from "./candidate-detail-modal";
import { AddCandidateDialog } from "./add-candidate-dialog";
import { useToast } from "../../context/toast-context";

export interface CandidateTableViewProps {
  candidates: CandidateRecord[];
  onAddCandidate: (candidate: CandidateRecord) => void;
  onUpdateCandidateStatus: (
    id: string,
    status: CandidateRecord["status"]
  ) => void;
}

export function CandidateTableView({
  candidates,
  onAddCandidate,
  onUpdateCandidateStatus,
}: CandidateTableViewProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedElectionType, setSelectedElectionType] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [selectedCandidate, setSelectedCandidate] = useState<CandidateRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.marathiName.includes(searchTerm) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.geography.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.party.toLowerCase().includes(searchTerm.toLowerCase());

      const matchElection =
        selectedElectionType === "ALL" || c.electionType === selectedElectionType;

      const matchStatus =
        selectedStatus === "ALL" || c.status === selectedStatus;

      return matchSearch && matchElection && matchStatus;
    });
  }, [candidates, searchTerm, selectedElectionType, selectedStatus]);

  // Paginate
  const totalPages = Math.ceil(filteredCandidates.length / pageSize) || 1;
  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCandidates.slice(start, start + pageSize);
  }, [filteredCandidates, currentPage, pageSize]);

  const handleOpenDetail = (cand: CandidateRecord) => {
    setSelectedCandidate(cand);
    setIsDetailModalOpen(true);
  };

  const handleExportCSV = () => {
    toast(`Exporting ${filteredCandidates.length} candidate tenant records to CSV.`, "info");
  };

  return (
    <div className="space-y-4">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#0e3554] bg-white dark:bg-[#062237] shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
            Total Candidates
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F5F6F6] mt-1">
            {candidates.length}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-[#94A3B8] mt-0.5">Across 4 election tiers</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#0e3554] bg-white dark:bg-[#062237] shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
            Active War Rooms
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-[#01C588] mt-1">
            {candidates.filter((c) => c.status === "Active").length}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-[#94A3B8] mt-0.5">Live operational tenants</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#0e3554] bg-white dark:bg-[#062237] shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
            Field Cadre Deployed
          </div>
          <div className="text-xl sm:text-2xl font-bold text-sky-600 dark:text-[#0D79FD] mt-1">
            {candidates.reduce((acc, c) => acc + c.usersUsed, 0)}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-[#94A3B8] mt-0.5">Karyakartas on ground</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#0e3554] bg-white dark:bg-[#062237] shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
            Service Enquiries
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-[#F48637] mt-1">
            {candidates.reduce((acc, c) => acc + c.pendingEnquiries, 0)}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-[#94A3B8] mt-0.5">Recharges & hardware</div>
        </div>
      </div>

      {/* Action / Filter Bar */}
      <div className="p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-[#0e3554] bg-white dark:bg-[#062237] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search & dropdown filters */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto flex-1">
          <SearchInput
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            placeholder="Search candidate, party, constituency..."
            className="w-full sm:w-64"
          />

          <div className="w-full sm:w-44">
            <Select
              value={selectedElectionType}
              onChange={(e) => {
                setSelectedElectionType(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: "ALL", label: "All Election Tiers" },
                { value: "Vidhan Sabha", label: "Vidhan Sabha" },
                { value: "Lok Sabha", label: "Lok Sabha" },
                { value: "Municipal Corporation", label: "Municipal Corp" },
                { value: "Zilla Parishad", label: "Zilla Parishad" },
              ]}
            />
          </div>

          <div className="w-full sm:w-36">
            <Select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: "ALL", label: "All Statuses" },
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Main Table */}
      {filteredCandidates.length === 0 ? (
        <EmptyState
          title="No candidates match your criteria"
          description="Try adjusting your search keywords, election type filter, or status selection."
          actionLabel="Reset All Filters"
          onAction={() => {
            setSearchTerm("");
            setSelectedElectionType("ALL");
            setSelectedStatus("ALL");
            setCurrentPage(1);
          }}
        />
      ) : (
        <div className="space-y-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate Identity</TableHead>
                <TableHead>Scope & Party</TableHead>
                <TableHead>Field Quota</TableHead>
                <TableHead>Account Tier</TableHead>
                <TableHead>Tenant Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCandidates.map((cand) => (
                <TableRow key={cand.id}>
                  {/* Candidate Identity */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-[#0D79FD]/15 text-sky-700 dark:text-[#0D79FD] font-bold text-xs flex items-center justify-center flex-shrink-0 border border-sky-200 dark:border-[#0D79FD]/30">
                        {cand.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-[#F5F6F6] flex items-center gap-1.5">
                          {cand.name}
                          <span className="text-[10px] font-mono text-slate-400 dark:text-[#94A3B8]">
                            {cand.id}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-[#94A3B8]">
                          {cand.marathiName} &bull; {cand.phone}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Scope & Party */}
                  <TableCell>
                    <div className="font-medium text-slate-800 dark:text-[#F5F6F6] text-xs">
                      {cand.geography}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-[#94A3B8] flex items-center gap-1">
                      <span>{cand.party}</span>
                      <span>&bull;</span>
                      <span className="text-slate-400 dark:text-[#94A3B8]">{cand.electionType}</span>
                    </div>
                  </TableCell>

                  {/* Field Quota & AI */}
                  <TableCell>
                    <div className="flex items-center justify-between text-xs text-slate-700 dark:text-[#F5F6F6] mb-1 max-w-[140px]">
                      <span>
                        {cand.usersUsed} / {cand.usersAllowed} workers
                      </span>
                    </div>
                    <div className="w-32 bg-slate-100 dark:bg-[#072439] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-sky-600 dark:bg-[#0D79FD] h-1.5 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (cand.usersUsed / cand.usersAllowed) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    {cand.aiAccess && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-[#01C588] font-medium mt-1">
                        <Sparkles className="w-2.5 h-2.5" /> AI Mode ({cand.aiSeats} seats)
                      </span>
                    )}
                  </TableCell>

                  {/* Account Tier */}
                  <TableCell>
                    <Badge variant={cand.accountType === "Sale" ? "info" : "purple"}>
                      {cand.accountType === "Sale" ? "Permanent Sale" : "5-Day Demo"}
                    </Badge>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      variant={
                        cand.status === "Active"
                          ? "success"
                          : cand.status === "Pending"
                          ? "warning"
                          : "neutral"
                      }
                      withDot
                    >
                      {cand.status}
                    </Badge>
                  </TableCell>

                  {/* Action */}
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => handleOpenDetail(cand)}
                      leftIcon={<Eye className="w-3 h-3" />}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={filteredCandidates.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        </div>
      )}

      {/* Detail Modal */}
      <CandidateDetailModal
        candidate={selectedCandidate}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCandidate(null);
        }}
        onStatusChange={(id, newStatus) => {
          onUpdateCandidateStatus(id, newStatus);
          toast(`Candidate ${id} status updated to "${newStatus}".`, "info");
        }}
      />

      {/* Add Candidate Dialog */}
      <AddCandidateDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onCandidateAdded={onAddCandidate}
      />
    </div>
  );
}

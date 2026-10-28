"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  UserPlus,
  Eye,
  Key,
  Lock,
  Unlock,
  Download,
  Filter,
  Sparkles,
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
import { CredentialDeliveryModal } from "./credential-delivery-modal";
import { useToast } from "../../context/toast-context";

export interface CandidateDirectoryProps {
  candidates: CandidateRecord[];
  onSelectCandidate: (candidate: CandidateRecord) => void;
  onOpenAddWizard: () => void;
  onToggleCandidateStatus: (candId: string) => void;
}

export function CandidateDirectory({
  candidates,
  onSelectCandidate,
  onOpenAddWizard,
  onToggleCandidateStatus,
}: CandidateDirectoryProps) {
  const { toast } = useToast();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedElectionType, setSelectedElectionType] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedAccountType, setSelectedAccountType] = useState<string>("ALL");
  const [selectedSubscriptionStatus, setSelectedSubscriptionStatus] = useState<string>("ALL");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Delivery Modal State
  const [selectedCandForDelivery, setSelectedCandForDelivery] = useState<CandidateRecord | null>(null);

  // KPIs
  const totalCount = candidates.length;
  const activeCount = candidates.filter((c) => c.status === "Active").length;
  const totalCadre = candidates.reduce((acc, c) => acc + c.usersUsed, 0);
  const demoCount = candidates.filter((c) => c.accountType === "Demo").length;

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        c.name.toLowerCase().includes(q) ||
        c.marathiName.includes(searchTerm) ||
        c.id.toLowerCase().includes(q) ||
        c.geography.toLowerCase().includes(q) ||
        c.party.toLowerCase().includes(q) ||
        c.phone.includes(searchTerm) ||
        c.email.toLowerCase().includes(q);

      const matchElection =
        selectedElectionType === "ALL" || c.electionType === selectedElectionType;

      const matchStatus =
        selectedStatus === "ALL" || c.status === selectedStatus;

      const matchAccount =
        selectedAccountType === "ALL" || c.accountType === selectedAccountType;

      const matchSub =
        selectedSubscriptionStatus === "ALL" || c.subscriptionStatus === selectedSubscriptionStatus;

      return matchSearch && matchElection && matchStatus && matchAccount && matchSub;
    });
  }, [
    candidates,
    searchTerm,
    selectedElectionType,
    selectedStatus,
    selectedAccountType,
    selectedSubscriptionStatus,
  ]);

  // Pagination
  const totalRecords = filteredCandidates.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCandidates.slice(start, start + pageSize);
  }, [filteredCandidates, currentPage, pageSize]);

  const handleExportCSV = () => {
    toast(`Exporting ${filteredCandidates.length} candidate tenant records to CSV.`, "info");
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedElectionType("ALL");
    setSelectedStatus("ALL");
    setSelectedAccountType("ALL");
    setSelectedSubscriptionStatus("ALL");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5">
      {/* 1. Summary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Candidates</span>
            <Users className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {totalCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Registered campaign tenants
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 mb-1">
            <span>Active War Rooms</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {activeCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Live field voter operations
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-xs text-sky-600 dark:text-sky-400 mb-1">
            <span>Field Cadre Deployed</span>
            <Users className="w-3.5 h-3.5 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
            {totalCadre}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Karyakartas & booth agents active
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 mb-1">
            <span>Demo Accounts</span>
            <div className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {demoCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            14-Day pilots awaiting conversion
          </div>
        </div>
      </div>

      {/* 2. Search & Multi-Filter Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <SearchInput
              value={searchTerm}
              onChange={(val) => {
                setSearchTerm(val);
                setCurrentPage(1);
              }}
              placeholder="Search by name, ID, party, area, phone..."
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenAddWizard}
              leftIcon={<UserPlus className="w-3.5 h-3.5" />}
            >
              Add Candidate Wizard
            </Button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-medium">Filters:</span>
          </div>

          {/* Election Type */}
          <div className="w-40">
            <Select
              value={selectedElectionType}
              onChange={(e) => {
                setSelectedElectionType(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: "ALL", label: "All Election Types" },
                { value: "Vidhan Sabha", label: "Vidhan Sabha" },
                { value: "Lok Sabha", label: "Lok Sabha" },
                { value: "Municipal Corporation", label: "Municipal Corporation" },
                { value: "Zilla Parishad", label: "Zilla Parishad" },
              ]}
            />
          </div>

          {/* Account Status */}
          <div className="w-32">
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
                { value: "Suspended", label: "Suspended" },
                { value: "Pending", label: "Pending" },
              ]}
            />
          </div>

          {/* Account Type (Sale vs Demo) */}
          <div className="w-36">
            <Select
              value={selectedAccountType}
              onChange={(e) => {
                setSelectedAccountType(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: "ALL", label: "All Account Types" },
                { value: "Sale", label: "Sale (Permanent)" },
                { value: "Demo", label: "Demo (14-Day Pilot)" },
              ]}
            />
          </div>

          {/* Subscription Status */}
          <div className="w-40">
            <Select
              value={selectedSubscriptionStatus}
              onChange={(e) => {
                setSelectedSubscriptionStatus(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: "ALL", label: "All Subscriptions" },
                { value: "Active", label: "Active" },
                { value: "Trial Expiring", label: "Trial Expiring" },
                { value: "Expired", label: "Expired" },
                { value: "Pending Renewal", label: "Pending Renewal" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* 3. Candidate Master Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        {filteredCandidates.length === 0 ? (
          <EmptyState
            title="No candidates found"
            description="No candidate records match your current search and filter selections."
            actionLabel="Reset All Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Party & Symbol</TableHead>
                  <TableHead>Jurisdiction</TableHead>
                  <TableHead>Classification</TableHead>
                  <TableHead>Field Cadre</TableHead>
                  <TableHead>AI Intelligence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCandidates.map((cand) => {
                  const usagePercent = Math.min(
                    Math.round((cand.usersUsed / (cand.usersAllowed || 1)) * 100),
                    100
                  );

                  return (
                    <TableRow key={cand.id}>
                      {/* Name & ID */}
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-primary-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {cand.name.charAt(0)}
                          </div>
                          <div>
                            <button
                              onClick={() => onSelectCandidate(cand)}
                              className="font-semibold text-slate-900 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-400 text-left transition-colors block text-xs"
                            >
                              {cand.name}
                            </button>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                              <span>{cand.id}</span> • <span>{cand.marathiName}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Party & Symbol */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <span className="font-medium text-slate-800 dark:text-slate-200 text-xs block">
                            {cand.party}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Symbol: {cand.symbol}
                          </span>
                        </div>
                      </TableCell>

                      {/* Geography */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <span className="font-medium text-slate-800 dark:text-slate-200 text-xs block">
                            {cand.geography}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {cand.electionType}
                          </span>
                        </div>
                      </TableCell>

                      {/* Classification (Sale vs Demo) */}
                      <TableCell>
                        <div className="flex flex-col items-start gap-1">
                          <Badge variant={cand.accountType === "Sale" ? "success" : "warning"}>
                            {cand.accountType === "Sale" ? "Commercial" : "Demo Pilot"}
                          </Badge>
                          <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                            {cand.planName}
                          </span>
                        </div>
                      </TableCell>

                      {/* Field Cadre Quota */}
                      <TableCell>
                        <div className="space-y-1 w-24">
                          <div className="flex justify-between text-[11px]">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {cand.usersUsed}
                            </span>
                            <span className="text-slate-400">/ {cand.usersAllowed}</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                usagePercent > 90
                                  ? "bg-rose-500"
                                  : usagePercent > 70
                                  ? "bg-amber-500"
                                  : "bg-primary-500"
                              }`}
                              style={{ width: `${usagePercent}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>

                      {/* AI Intelligence */}
                      <TableCell>
                        {cand.aiAccess ? (
                          <Badge variant="purple" className="text-[10px] py-0 px-1.5 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            AI ({cand.aiSeats || 5} seats)
                          </Badge>
                        ) : (
                          <span className="text-[11px] text-slate-400">Disabled</span>
                        )}
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

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1.5 h-auto text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                            onClick={() => onSelectCandidate(cand)}
                            title="View Full Profile & Control Panel"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1.5 h-auto text-slate-500 hover:text-primary-600 dark:hover:text-primary-400"
                            onClick={() => setSelectedCandForDelivery(cand)}
                            title="Dispatch Credentials"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1.5 h-auto text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
                            onClick={() => onToggleCandidateStatus(cand.id)}
                            title={cand.status === "Active" ? "Deactivate" : "Activate"}
                          >
                            {cand.status === "Active" ? (
                              <Lock className="w-3.5 h-3.5" />
                            ) : (
                              <Unlock className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalRecords={totalRecords}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
            />
          </>
        )}
      </div>

      {/* Reusable Credential Delivery Modal */}
      <CredentialDeliveryModal
        isOpen={Boolean(selectedCandForDelivery)}
        onClose={() => setSelectedCandForDelivery(null)}
        candidate={selectedCandForDelivery}
      />
    </div>
  );
}

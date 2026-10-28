"use client";

import React, { useState, useMemo } from "react";
import {
  Building2,
  Plus,
  Eye,
  Edit2,
  ShieldAlert,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
  Filter,
} from "lucide-react";
import {
  OrganizationRecord,
} from "../../types/superadmin.types";
import { OrganizationStatus, OrganizationPlanType } from "@rajtantra/common-types";
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
import { OrganizationDetailsDrawer } from "./organization-details-drawer";
import { OrganizationFormDialog } from "./organization-form-dialog";
import { StatusChangeDialog } from "./status-change-dialog";
import { useToast } from "../../context/toast-context";

export interface OrganizationDirectoryProps {
  organizations: OrganizationRecord[];
  onAddOrganization: (org: OrganizationRecord) => void;
  onEditOrganization: (org: OrganizationRecord) => void;
  onUpdateOrgStatus: (orgId: string, status: OrganizationStatus, reason?: string) => void;
}

type SortField = "name" | "createdAt" | "status" | "workers";

export function OrganizationDirectory({
  organizations,
  onAddOrganization,
  onEditOrganization,
  onUpdateOrgStatus,
}: OrganizationDirectoryProps) {
  const { toast } = useToast();

  // Search, Filters & Sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortAsc, setSortAsc] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Simulated Loading State for Testing UI Resilience
  const [isLoading, setIsLoading] = useState(false);

  // Modals & Drawer State
  const [selectedOrg, setSelectedOrg] = useState<OrganizationRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [orgToEdit, setOrgToEdit] = useState<OrganizationRecord | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [orgForStatusChange, setOrgForStatusChange] = useState<OrganizationRecord | null>(null);

  // Trigger simulated loading
  const handleSimulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast("Organization directory refreshed successfully.", "info");
    }, 800);
  };

  // KPI Calculations
  const totalOrgs = organizations.length;
  const activeCount = organizations.filter((o) => o.status === OrganizationStatus.ACTIVE).length;
  const pendingCount = organizations.filter((o) => o.status === OrganizationStatus.PENDING).length;
  const suspendedOrExpiredCount = organizations.filter(
    (o) => o.status === OrganizationStatus.SUSPENDED || o.status === OrganizationStatus.EXPIRED
  ).length;

  // Filtered & Sorted Records
  const filteredOrganizations = useMemo(() => {
    return organizations
      .filter((org) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          org.name.toLowerCase().includes(query) ||
          org.slug.toLowerCase().includes(query) ||
          org.associatedCandidateName.toLowerCase().includes(query) ||
          org.constituencyName.toLowerCase().includes(query) ||
          org.district.toLowerCase().includes(query);

        const matchesStatus =
          selectedStatus === "ALL" || org.status === selectedStatus;

        const matchesType =
          selectedType === "ALL" || org.organizationType === selectedType;

        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === "name") {
          comp = a.name.localeCompare(b.name);
        } else if (sortBy === "createdAt") {
          comp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortBy === "status") {
          comp = a.status.localeCompare(b.status);
        } else if (sortBy === "workers") {
          comp = a.activeWorkersCount - b.activeWorkersCount;
        }
        return sortAsc ? comp : -comp;
      });
  }, [organizations, searchTerm, selectedStatus, selectedType, sortBy, sortAsc]);

  // Pagination slice
  const totalRecords = filteredOrganizations.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedOrganizations = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrganizations.slice(start, start + pageSize);
  }, [filteredOrganizations, currentPage, pageSize]);

  // Handlers
  const handleOpenDetails = (org: OrganizationRecord) => {
    setSelectedOrg(org);
    setIsDrawerOpen(true);
  };

  const handleOpenCreate = () => {
    setOrgToEdit(null);
    setIsFormDialogOpen(true);
  };

  const handleOpenEdit = (org: OrganizationRecord) => {
    setOrgToEdit(org);
    setIsFormDialogOpen(true);
  };

  const handleOpenStatusChange = (org: OrganizationRecord) => {
    setOrgForStatusChange(org);
    setIsStatusDialogOpen(true);
  };

  const handleSaveOrganization = (org: OrganizationRecord) => {
    if (orgToEdit) {
      onEditOrganization(org);
      toast(`Organization "${org.name}" updated successfully.`, "success");
    } else {
      onAddOrganization(org);
      toast(`Organization "${org.name}" created and provisioned.`, "success");
    }
  };

  const handleConfirmStatusChange = (orgId: string, newStatus: OrganizationStatus, reason: string) => {
    onUpdateOrgStatus(orgId, newStatus, reason);
    toast(
      `Status for organization updated to ${newStatus}${reason ? `: ${reason}` : "."}`,
      newStatus === OrganizationStatus.ACTIVE ? "success" : "info"
    );
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("ALL");
    setSelectedType("ALL");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5">
      {/* 1. KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Organizations</span>
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {totalOrgs}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Registered campaign entities
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
            Live JWT & field voter operations
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 mb-1">
            <span>Pending Review</span>
            <div className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {pendingCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Awaiting onboarding verification
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Suspended / Expired</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {suspendedOrExpiredCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Restricted field write access
          </div>
        </div>
      </div>

      {/* 2. Filters & Actions Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <SearchInput
              value={searchTerm}
              onChange={(val) => {
                setSearchTerm(val);
                setCurrentPage(1);
              }}
              placeholder="Search by name, slug, candidate, constituency..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSimulateLoading}
              isLoading={isLoading}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />}
              title="Test UI loading state"
            >
              Simulate Loading
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Create Organization
            </Button>
          </div>
        </div>

        {/* Second Row: Filters & Sort */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-medium">Filters:</span>
          </div>

          {/* Status Filter */}
          <div className="w-36">
            <Select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: "ALL", label: "All Statuses" },
                { value: OrganizationStatus.ACTIVE, label: "Active" },
                { value: OrganizationStatus.PENDING, label: "Pending" },
                { value: OrganizationStatus.SUSPENDED, label: "Suspended" },
                { value: OrganizationStatus.EXPIRED, label: "Expired" },
              ]}
            />
          </div>

          {/* Type Filter */}
          <div className="w-52">
            <Select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: "ALL", label: "All Organization Types" },
                { value: "Candidate Campaign War Room", label: "Campaign War Room" },
                { value: "Constituency Party Office", label: "Party Office" },
                { value: "Distributor Partner Entity", label: "Distributor Entity" },
                { value: "Coalition Campaign Hub", label: "Coalition Hub" },
              ]}
            />
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-slate-500 text-xs">Sort:</span>
            <div className="w-36">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortField)}
                options={[
                  { value: "createdAt", label: "Created Date" },
                  { value: "name", label: "Name (A-Z)" },
                  { value: "status", label: "Status" },
                  { value: "workers", label: "Worker Capacity" },
                ]}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortAsc(!sortAsc)}
              className="px-2"
              title={sortAsc ? "Ascending order" : "Descending order"}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Table or Loading or Empty State */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-7 h-7 text-primary-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">
              Synchronizing organization directory with Rajtantra master registry...
            </p>
          </div>
        ) : filteredOrganizations.length === 0 ? (
          <EmptyState
            title="No organizations found"
            description="No organization records match your current search and filter criteria."
            actionLabel="Reset All Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Jurisdiction & Scope</TableHead>
                  <TableHead>Associated Candidate</TableHead>
                  <TableHead>Plan & AI</TableHead>
                  <TableHead>Worker Quota</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrganizations.map((org) => {
                  const usagePercent = Math.min(
                    Math.round((org.activeWorkersCount / (org.maxWorkersLimit || 1)) * 100),
                    100
                  );

                  return (
                    <TableRow key={org.id}>
                      {/* Name & Slug */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <button
                            onClick={() => handleOpenDetails(org)}
                            className="font-semibold text-slate-900 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-400 text-left transition-colors"
                          >
                            {org.name}
                          </button>
                          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                            {org.slug}
                          </div>
                        </div>
                      </TableCell>

                      {/* Type & Constituency */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <span className="text-slate-800 dark:text-slate-200 font-medium block">
                            {org.constituencyName}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {org.electionType} • {org.district}
                          </span>
                        </div>
                      </TableCell>

                      {/* Associated Candidate & Contact */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <span className="font-medium text-slate-900 dark:text-slate-100 block">
                            {org.associatedCandidateName}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {org.clientContactName}
                          </span>
                        </div>
                      </TableCell>

                      {/* Plan & AI */}
                      <TableCell>
                        <div className="flex flex-col gap-1 items-start">
                          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                            {org.planType === OrganizationPlanType.OFFICE_12M
                              ? "Annual Office (12M)"
                              : org.planType === OrganizationPlanType.OFFICE_6M
                              ? "Office (6M)"
                              : org.planType === OrganizationPlanType.ELECTION_MODULE
                              ? "Full Election"
                              : "Trial (5D)"}
                          </span>
                          {org.hasAiMode ? (
                            <Badge variant="purple" className="text-[10px] py-0 px-1.5 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              AI ({org.aiSeatsLimit} seats)
                            </Badge>
                          ) : (
                            <span className="text-[10px] text-slate-400">No AI Mode</span>
                          )}
                        </div>
                      </TableCell>

                      {/* Worker Quota */}
                      <TableCell>
                        <div className="space-y-1 w-28">
                          <div className="flex justify-between text-[11px]">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {org.activeWorkersCount}
                            </span>
                            <span className="text-slate-400">/ {org.maxWorkersLimit}</span>
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

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant={
                            org.status === OrganizationStatus.ACTIVE
                              ? "success"
                              : org.status === OrganizationStatus.PENDING
                              ? "warning"
                              : org.status === OrganizationStatus.SUSPENDED
                              ? "danger"
                              : "neutral"
                          }
                          withDot
                        >
                          {org.status}
                        </Badge>
                      </TableCell>

                      {/* Created Date */}
                      <TableCell className="text-[11px] text-slate-500">
                        {org.createdAt}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1.5 h-auto text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                            onClick={() => handleOpenDetails(org)}
                            title="View full organization details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1.5 h-auto text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                            onClick={() => handleOpenEdit(org)}
                            title="Edit organization"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1.5 h-auto text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
                            onClick={() => handleOpenStatusChange(org)}
                            title="Change status"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
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

      {/* Details Slide-Over Drawer */}
      <OrganizationDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        organization={selectedOrg}
        onEdit={(org) => {
          setIsDrawerOpen(false);
          handleOpenEdit(org);
        }}
        onChangeStatus={(org) => {
          setIsDrawerOpen(false);
          handleOpenStatusChange(org);
        }}
      />

      {/* Create / Edit Form Modal */}
      <OrganizationFormDialog
        isOpen={isFormDialogOpen}
        onClose={() => setIsFormDialogOpen(false)}
        organizationToEdit={orgToEdit}
        onSave={handleSaveOrganization}
      />

      {/* Status Change Confirmation Dialog */}
      <StatusChangeDialog
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        organization={orgForStatusChange}
        onConfirm={handleConfirmStatusChange}
      />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Switch } from "../ui/switch";
import {
  OrganizationRecord,
  OrganizationType,
  ElectionType,
} from "../../types/superadmin.types";
import {
  OrganizationPlanType,
  OrganizationStatus,
} from "@rajtantra/common-types";

export interface OrganizationFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  organizationToEdit?: OrganizationRecord | null;
  onSave: (org: OrganizationRecord) => void;
}

const ORG_TYPES: { value: OrganizationType; label: string }[] = [
  { value: "Candidate Campaign War Room", label: "Candidate Campaign War Room" },
  { value: "Constituency Party Office", label: "Constituency Party Office" },
  { value: "Distributor Partner Entity", label: "Distributor Partner Entity" },
  { value: "Coalition Campaign Hub", label: "Coalition Campaign Hub" },
];

const ELECTION_TYPES: { value: ElectionType; label: string }[] = [
  { value: "Vidhan Sabha", label: "Vidhan Sabha (Legislative Assembly)" },
  { value: "Lok Sabha", label: "Lok Sabha (Parliamentary)" },
  { value: "Municipal Corporation", label: "Municipal Corporation (PMC/BMC)" },
  { value: "Zilla Parishad", label: "Zilla Parishad" },
  { value: "Nagar Parishad", label: "Nagar Parishad" },
  { value: "Gram Panchayat", label: "Gram Panchayat" },
];

const PLAN_TYPES: { value: OrganizationPlanType; label: string }[] = [
  { value: OrganizationPlanType.TRIAL_5D, label: "Trial (5-Day Active Trial)" },
  { value: OrganizationPlanType.OFFICE_6M, label: "Office 6 Months" },
  { value: OrganizationPlanType.OFFICE_12M, label: "Office 12 Months (Annual)" },
  { value: OrganizationPlanType.ELECTION_MODULE, label: "Full Election Module" },
];

const MAHARASHTRA_DISTRICTS = [
  "Pune",
  "Satara",
  "Sangli",
  "Kolhapur",
  "Solapur",
  "Mumbai City",
  "Mumbai Suburban",
  "Thane",
  "Nashik",
  "Aurangabad (Chhatrapati Sambhajinagar)",
  "Jalna",
  "Nagpur",
  "Amravati",
  "Nanded",
];

export function OrganizationFormDialog({
  isOpen,
  onClose,
  organizationToEdit,
  onSave,
}: OrganizationFormDialogProps) {
  const isEditing = Boolean(organizationToEdit);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [orgType, setOrgType] = useState<OrganizationType>("Candidate Campaign War Room");
  const [associatedCandidateName, setAssociatedCandidateName] = useState("");
  const [clientContactName, setClientContactName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [state, setState] = useState("Maharashtra");
  const [district, setDistrict] = useState("Pune");
  const [constituencyName, setConstituencyName] = useState("");
  const [electionType, setElectionType] = useState<ElectionType>("Vidhan Sabha");
  const [planType, setPlanType] = useState<OrganizationPlanType>(OrganizationPlanType.OFFICE_12M);
  const [hasAiMode, setHasAiMode] = useState(false);
  const [aiSeatsLimit, setAiSeatsLimit] = useState(5);
  const [maxWorkersLimit, setMaxWorkersLimit] = useState(50);
  const [pollingDate, setPollingDate] = useState("");
  const [distributorName, setDistributorName] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset or initialize values
  useEffect(() => {
    if (organizationToEdit) {
      setName(organizationToEdit.name);
      setSlug(organizationToEdit.slug);
      setSlugTouched(true);
      setOrgType(organizationToEdit.organizationType);
      setAssociatedCandidateName(organizationToEdit.associatedCandidateName);
      setClientContactName(organizationToEdit.clientContactName);
      setClientPhone(organizationToEdit.clientPhone);
      setClientEmail(organizationToEdit.clientEmail);
      setState(organizationToEdit.state);
      setDistrict(organizationToEdit.district);
      setConstituencyName(organizationToEdit.constituencyName);
      setElectionType(organizationToEdit.electionType);
      setPlanType(organizationToEdit.planType);
      setHasAiMode(organizationToEdit.hasAiMode);
      setAiSeatsLimit(organizationToEdit.aiSeatsLimit || 0);
      setMaxWorkersLimit(organizationToEdit.maxWorkersLimit);
      setPollingDate(organizationToEdit.pollingDate || "");
      setDistributorName(organizationToEdit.distributorName || "");
    } else {
      setName("");
      setSlug("");
      setSlugTouched(false);
      setOrgType("Candidate Campaign War Room");
      setAssociatedCandidateName("");
      setClientContactName("");
      setClientPhone("");
      setClientEmail("");
      setState("Maharashtra");
      setDistrict("Pune");
      setConstituencyName("");
      setElectionType("Vidhan Sabha");
      setPlanType(OrganizationPlanType.OFFICE_12M);
      setHasAiMode(false);
      setAiSeatsLimit(5);
      setMaxWorkersLimit(50);
      setPollingDate("");
      setDistributorName("");
    }
    setErrors({});
  }, [organizationToEdit, isOpen]);

  // Auto slug generation if not touched
  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugTouched) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generated);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 3) {
      newErrors.name = "Organization name must be at least 3 characters.";
    }

    if (!slug.trim()) {
      newErrors.slug = "Slug is required.";
    } else if (!/^[a-z0-9-]+$/.test(slug)) {
      newErrors.slug = "Slug may only contain lowercase letters, numbers, and hyphens.";
    }

    if (!associatedCandidateName.trim()) {
      newErrors.associatedCandidateName = "Associated candidate name is required.";
    }

    if (!clientContactName.trim()) {
      newErrors.clientContactName = "Primary contact name is required.";
    }

    if (!clientPhone.trim()) {
      newErrors.clientPhone = "Phone number is required.";
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(clientPhone.trim())) {
      newErrors.clientPhone = "Enter a valid 10-digit phone number.";
    }

    if (!clientEmail.trim()) {
      newErrors.clientEmail = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.trim())) {
      newErrors.clientEmail = "Enter a valid email address.";
    }

    if (!constituencyName.trim()) {
      newErrors.constituencyName = "Constituency name is required.";
    }

    if (hasAiMode && aiSeatsLimit < 1) {
      newErrors.aiSeatsLimit = "AI mode requires at least 1 seat limit.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const savedOrg: OrganizationRecord = {
        id: organizationToEdit ? organizationToEdit.id : `ORG-${Math.floor(1000 + Math.random() * 9000)}`,
        name: name.trim(),
        slug: slug.trim(),
        organizationType: orgType,
        associatedCandidateName: associatedCandidateName.trim(),
        associatedCandidateId: organizationToEdit?.associatedCandidateId,
        clientContactName: clientContactName.trim(),
        clientEmail: clientEmail.trim().toLowerCase(),
        clientPhone: clientPhone.trim(),
        state: state.trim(),
        district: district.trim(),
        constituencyName: constituencyName.trim(),
        electionType,
        status: organizationToEdit ? organizationToEdit.status : OrganizationStatus.ACTIVE,
        planType,
        hasAiMode,
        aiSeatsLimit: hasAiMode ? Number(aiSeatsLimit) : 0,
        pollingDate: pollingDate ? pollingDate : undefined,
        distributorName: distributorName.trim() ? distributorName.trim() : undefined,
        activeWorkersCount: organizationToEdit ? organizationToEdit.activeWorkersCount : 0,
        maxWorkersLimit: Number(maxWorkersLimit) || 50,
        createdAt: organizationToEdit ? organizationToEdit.createdAt : new Date().toISOString().split("T")[0]!,
        updatedAt: new Date().toISOString().split("T")[0]!,
      };

      onSave(savedOrg);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Organization" : "Create New Organization"}
      description={
        isEditing
          ? "Update details, quota capacity, and administrative properties."
          : "Provision a new campaign tenant, assign candidate link, and configure quotas."
      }
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-end gap-2.5">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            {isEditing ? "Save Changes" : "Create Organization"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[68vh] overflow-y-auto pr-1">
        {/* Section 1: Entity Identity */}
        <div className="space-y-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            1. Identity & Classification
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Organization Name"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Patil Campaign Office - Pune"
              error={errors.name}
            />
            <div>
              <Input
                label="URL Slug (Tenant Key)"
                required
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
                placeholder="patil-campaign-pune"
                error={errors.slug}
                helperText="Unique identifier used for subdomains and API routing."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Organization Type"
              value={orgType}
              onChange={(e) => setOrgType(e.target.value as OrganizationType)}
              options={ORG_TYPES}
            />
            <Input
              label="Associated Candidate"
              required
              value={associatedCandidateName}
              onChange={(e) => setAssociatedCandidateName(e.target.value)}
              placeholder="e.g., Rameshwar Patil"
              error={errors.associatedCandidateName}
            />
          </div>
        </div>

        {/* Section 2: Contact Information */}
        <div className="space-y-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            2. Client Contact Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Primary Contact Person"
              required
              value={clientContactName}
              onChange={(e) => setClientContactName(e.target.value)}
              placeholder="Full name"
              error={errors.clientContactName}
            />
            <Input
              label="Contact Phone"
              required
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="+91 98220 00000"
              error={errors.clientPhone}
            />
            <Input
              label="Contact Email"
              type="email"
              required
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="contact@campaign.in"
              error={errors.clientEmail}
            />
          </div>
        </div>

        {/* Section 3: Electoral Jurisdiction */}
        <div className="space-y-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            3. Electoral Jurisdiction
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Election Type"
              value={electionType}
              onChange={(e) => setElectionType(e.target.value as ElectionType)}
              options={ELECTION_TYPES}
            />
            <Input
              label="Constituency Name"
              required
              value={constituencyName}
              onChange={(e) => setConstituencyName(e.target.value)}
              placeholder="e.g., Pune Cantonment (AC-214)"
              error={errors.constituencyName}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Maharashtra"
            />
            <Select
              label="District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              options={MAHARASHTRA_DISTRICTS.map((d) => ({ value: d, label: d }))}
            />
            <Input
              label="Scheduled Polling Date"
              type="date"
              value={pollingDate}
              onChange={(e) => setPollingDate(e.target.value)}
            />
          </div>
        </div>

        {/* Section 4: Commercial Plan & Quotas */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            4. Subscription & System Quotas
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Subscription Plan"
              value={planType}
              onChange={(e) => setPlanType(e.target.value as OrganizationPlanType)}
              options={PLAN_TYPES}
            />
            <Input
              label="Maximum Worker Seats"
              type="number"
              min={5}
              max={500}
              value={maxWorkersLimit}
              onChange={(e) => setMaxWorkersLimit(Number(e.target.value))}
              helperText="Field volunteer & booth manager accounts allowed."
            />
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                INDIATA AI Intelligence Mode
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Enables LLM-assisted booth sentiment synthesis, speech drafting, and voter query triage.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={hasAiMode}
                onChange={setHasAiMode}
              />
              {hasAiMode && (
                <div className="w-24">
                  <Input
                    label="AI Seats"
                    type="number"
                    min={1}
                    max={50}
                    value={aiSeatsLimit}
                    onChange={(e) => setAiSeatsLimit(Number(e.target.value))}
                    error={errors.aiSeatsLimit}
                  />
                </div>
              )}
            </div>
          </div>

          <Input
            label="Distributor Partner (Optional)"
            value={distributorName}
            onChange={(e) => setDistributorName(e.target.value)}
            placeholder="e.g., MahaMedia Political Solutions"
            helperText="Leave empty if this organization is managed directly by Super Admin."
          />
        </div>
      </form>
    </Dialog>
  );
}

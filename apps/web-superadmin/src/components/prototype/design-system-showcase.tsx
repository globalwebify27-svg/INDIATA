"use client";

import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { SearchInput } from "../ui/input";
import { Select } from "../ui/select";
import { Switch } from "../ui/switch";
import { Dialog } from "../ui/dialog";
import { useToast } from "../../context/toast-context";

export function DesignSystemShowcase() {
  const { toast } = useToast();
  const [testSearch, setTestSearch] = useState("Rajtantra");
  const [testSelect, setTestSelect] = useState("vidhan-sabha");
  const [testSwitch, setTestSwitch] = useState(true);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const handleTestLoading = () => {
    setBtnLoading(true);
    setTimeout(() => {
      setBtnLoading(false);
      toast("Action executed successfully with simulated latency.", "success");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Intro Card */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          Rajtantra Enterprise Design System Specification
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Living design tokens, reusable components, and states built specifically for high-concurrency multi-tenant administration.
        </p>
      </div>

      {/* 1. Color Palette Tokens */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Core Semantic Color Palette
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-900 text-white">
            <div className="text-xs font-bold">Dark Navy</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">#0F172A</div>
            <div className="text-[10px] text-slate-400 mt-2">Sidebar Canvas</div>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-sky-600 text-white">
            <div className="text-xs font-bold">Restrained Blue</div>
            <div className="text-[10px] text-sky-200 font-mono mt-0.5">#0284C7</div>
            <div className="text-[10px] text-sky-100 mt-2">Primary Accent</div>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-emerald-600 text-white">
            <div className="text-xs font-bold">Emerald Green</div>
            <div className="text-[10px] text-emerald-200 font-mono mt-0.5">#059669</div>
            <div className="text-[10px] text-emerald-100 mt-2">Active / Success</div>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-amber-500 text-white">
            <div className="text-xs font-bold">Amber Warning</div>
            <div className="text-[10px] text-amber-100 font-mono mt-0.5">#D97706</div>
            <div className="text-[10px] text-amber-100 mt-2">Expiring / Review</div>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-rose-600 text-white">
            <div className="text-xs font-bold">Rose Danger</div>
            <div className="text-[10px] text-rose-200 font-mono mt-0.5">#E11D48</div>
            <div className="text-[10px] text-rose-100 mt-2">Suspended / Error</div>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
            <div className="text-xs font-bold">Neutral Slate</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">#F8FAFC</div>
            <div className="text-[10px] text-slate-500 mt-2">Content Canvas</div>
          </div>
        </div>
      </div>

      {/* 2. Button System */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Button Variants & States
        </h4>
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="primary" size="sm" onClick={() => toast("Primary button clicked", "info")}>
            Primary Blue
          </Button>
          <Button variant="secondary" size="sm" onClick={() => toast("Secondary button clicked", "info")}>
            Secondary Navy
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast("Outline button clicked", "info")}>
            Outline Neutral
          </Button>
          <Button variant="ghost" size="sm" onClick={() => toast("Ghost button clicked", "info")}>
            Ghost Minimal
          </Button>
          <Button variant="success" size="sm" leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>
            Verified Action
          </Button>
          <Button variant="danger" size="sm" leftIcon={<AlertTriangle className="w-3.5 h-3.5" />}>
            Destructive
          </Button>
          <Button variant="primary" size="sm" isLoading={btnLoading} onClick={handleTestLoading}>
            {btnLoading ? "Processing" : "Trigger Spinner"}
          </Button>
        </div>
      </div>

      {/* 3. Badges & Status Indicators */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Semantic Status Badges
        </h4>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="success" withDot>Active Tenant</Badge>
          <Badge variant="warning" withDot>Trial Expiring</Badge>
          <Badge variant="danger" withDot>Account Suspended</Badge>
          <Badge variant="info">Permanent Sale</Badge>
          <Badge variant="purple">5-Day Demo</Badge>
          <Badge variant="neutral">Pending Activation</Badge>
        </div>
      </div>

      {/* 4. Form Controls */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Input & Filter Controls
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SearchInput
            value={testSearch}
            onChange={setTestSearch}
            placeholder="Type search keyword..."
          />
          <Select
            value={testSelect}
            onChange={(e) => setTestSelect(e.target.value)}
            options={[
              { value: "vidhan-sabha", label: "Vidhan Sabha (Assembly)" },
              { value: "lok-sabha", label: "Lok Sabha (Parliamentary)" },
              { value: "municipal", label: "Municipal Corporation" },
            ]}
          />
          <div className="flex items-center pt-1">
            <Switch
              checked={testSwitch}
              onChange={setTestSwitch}
              label="Global Service Pricing"
              description="Sync visibility across all candidate panels"
            />
          </div>
        </div>
      </div>

      {/* 5. Modals & Notifications Test */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Interactive Modal Dialog Primitive
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Test accessible focus trapping, keyboard Escape handler, and responsive backdrop.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsTestModalOpen(true)}>
          Open Sample Dialog
        </Button>
      </div>

      {/* Test Dialog */}
      <Dialog
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        title="Administrative Security Confirmation"
        description="This action triggers a system event recorded in the immutable audit log."
        footer={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="xs" onClick={() => setIsTestModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="xs"
              onClick={() => {
                setIsTestModalOpen(false);
                toast("Sample confirmation logged in audit history.", "success");
              }}
            >
              Confirm Action
            </Button>
          </div>
        }
      >
        <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          The Super Admin portal enforces strict RBAC and ISO/IEC 27001 data isolation boundaries. Changes made here affect downstream war-room managers, karyakartas, and voter slip printers.
        </div>
      </Dialog>
    </div>
  );
}

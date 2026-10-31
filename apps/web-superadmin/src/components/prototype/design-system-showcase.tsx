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
  const [testSearch, setTestSearch] = useState("INDIATA");
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
      <div className="p-5 rounded-xl border border-[#ACB9D1] dark:border-slate-800 bg-[#FDFEFE] dark:bg-slate-900 shadow-xs">
        <h3 className="text-base font-semibold text-[#010627] dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#2087FE] dark:text-sky-400" />
          INDIATA Client-Approved Design System Specification
        </h3>
        <p className="mt-1 text-xs text-[#717785] dark:text-slate-400 leading-relaxed">
          Living design tokens, reusable components, and states built specifically for high-concurrency multi-tenant administration.
        </p>
      </div>

      {/* 1. Color Palette Tokens */}
      <div className="p-5 rounded-xl border border-[#ACB9D1] dark:border-slate-800 bg-[#FDFEFE] dark:bg-slate-900 shadow-xs">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#717785] dark:text-slate-400 mb-4">
          Client-Approved Light Theme Color Palette
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <div className="p-3 rounded-lg border border-[#ACB9D1] dark:border-slate-800 bg-[#F3F8FD] text-[#010627]">
            <div className="text-xs font-bold">Primary Background</div>
            <div className="text-[10px] text-[#717785] font-mono mt-0.5">#F3F8FD</div>
            <div className="text-[10px] text-[#717785] mt-2">App Canvas</div>
          </div>
          <div className="p-3 rounded-lg border border-[#ACB9D1] dark:border-slate-800 bg-[#FDFEFE] text-[#010627]">
            <div className="text-xs font-bold">Secondary Background</div>
            <div className="text-[10px] text-[#717785] font-mono mt-0.5">#FDFEFE</div>
            <div className="text-[10px] text-[#717785] mt-2">Cards & Panels</div>
          </div>
          <div className="p-3 rounded-lg border border-[#ACB9D1] dark:border-slate-800 bg-[#E0EDFE] text-[#010627]">
            <div className="text-xs font-bold">Soft Blue Surface</div>
            <div className="text-[10px] text-[#2087FE] font-mono mt-0.5">#E0EDFE</div>
            <div className="text-[10px] text-[#717785] mt-2">Highlighted Areas</div>
          </div>
          <div className="p-3 rounded-lg border border-[#ACB9D1] dark:border-slate-800 bg-[#ACB9D1] text-[#010627]">
            <div className="text-xs font-bold">Border / Muted UI</div>
            <div className="text-[10px] text-[#010627] font-mono mt-0.5">#ACB9D1</div>
            <div className="text-[10px] text-[#010627]/80 mt-2">Dividers & Lines</div>
          </div>
          <div className="p-3 rounded-lg border border-[#ACB9D1] dark:border-slate-800 bg-[#2087FE] text-white">
            <div className="text-xs font-bold">Primary Blue</div>
            <div className="text-[10px] text-white/90 font-mono mt-0.5">#2087FE</div>
            <div className="text-[10px] text-white/80 mt-2">Active Navigation</div>
          </div>
          <div className="p-3 rounded-lg border border-[#ACB9D1] dark:border-slate-800 bg-[#12CF94] text-[#010627]">
            <div className="text-xs font-bold">Success Green</div>
            <div className="text-[10px] text-[#010627] font-mono mt-0.5">#12CF94</div>
            <div className="text-[10px] text-[#010627]/80 mt-2">Live Status & OK</div>
          </div>
          <div className="p-3 rounded-lg border border-[#ACB9D1] dark:border-slate-800 bg-[#FC7C36] text-white">
            <div className="text-xs font-bold">Warning Orange</div>
            <div className="text-[10px] text-white/90 font-mono mt-0.5">#FC7C36</div>
            <div className="text-[10px] text-white/80 mt-2">Alerts & Actions</div>
          </div>
          <div className="p-3 rounded-lg border border-[#ACB9D1] dark:border-slate-800 bg-[#010627] text-white">
            <div className="text-xs font-bold">Primary Text</div>
            <div className="text-[10px] text-white/80 font-mono mt-0.5">#010627</div>
            <div className="text-[10px] text-white/70 mt-2">Headings & Copy</div>
          </div>
          <div className="p-3 rounded-lg border border-[#ACB9D1] dark:border-slate-800 bg-[#B3EDD7] text-[#010627]">
            <div className="text-xs font-bold">Soft Success Bg</div>
            <div className="text-[10px] text-[#010627] font-mono mt-0.5">#B3EDD7</div>
            <div className="text-[10px] text-[#010627]/80 mt-2">Pills & Badges</div>
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

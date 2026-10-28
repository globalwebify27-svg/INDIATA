import { useState } from "react";

// ─── Node Types ───────────────────────────────────────────────────────────────
type NodeType =
  | "screen"
  | "decision"
  | "success"
  | "error"
  | "ai"
  | "start"
  | "status";

interface Node {
  id: string;
  label: string;
  type: NodeType;
  sub?: string;
}

// ─── Reusable FlowNode ─────────────────────────────────────────────────────────
function FlowNode({ node }: { node: Node }) {
  const base =
    "flex items-center justify-center text-center leading-tight select-none";

  if (node.type === "decision") {
    return (
      <div className="flex flex-col items-center">
        <div
          className="relative flex items-center justify-center"
          style={{ width: 120, height: 60 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: "#f5c518",
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            }}
          />
          <span
            className="relative z-10 font-semibold text-[10px] text-[#1a1200] px-3 text-center leading-tight"
            style={{ maxWidth: 90 }}
          >
            {node.label}
          </span>
        </div>
        {node.sub && (
          <span className="mt-1 text-[9px] text-[#888] italic">{node.sub}</span>
        )}
      </div>
    );
  }

  const styles: Record<NodeType, string> = {
    screen:
      "bg-[#1e2232] border border-[#3a4060] text-[#c8d0f0] rounded-[6px]",
    decision: "",
    success:
      "bg-[#0d2e1a] border border-[#1f6b3a] text-[#4ade80] rounded-[6px]",
    error: "bg-[#2e0d0d] border border-[#7a1f1f] text-[#f87171] rounded-[6px]",
    ai: "bg-[#1a0d2e] border border-[#6b3a7a] text-[#c084fc] rounded-[6px]",
    start: "bg-[#0d1a2e] border border-[#1a4060] text-[#60a5fa] rounded-full",
    status:
      "bg-[#1a1a2e] border border-[#3a3a60] text-[#94a3b8] rounded-[4px]",
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`${base} ${styles[node.type]} font-medium text-[11px] px-3 py-2`}
        style={{ minWidth: 120, maxWidth: 150 }}
      >
        {node.label}
      </div>
      {node.sub && (
        <span className="mt-1 text-[9px] text-[#666] italic">{node.sub}</span>
      )}
    </div>
  );
}

// ─── Arrow ─────────────────────────────────────────────────────────────────────
function Arrow({
  dir = "down",
  label,
}: {
  dir?: "down" | "right";
  label?: string;
}) {
  if (dir === "right") {
    return (
      <div className="flex items-center gap-1 mx-1">
        {label && (
          <span className="text-[9px] text-[#666] italic">{label}</span>
        )}
        <div className="flex items-center">
          <div className="w-6 h-px bg-[#444]" />
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "4px solid transparent",
              borderBottom: "4px solid transparent",
              borderLeft: "6px solid #444",
            }}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center my-0.5">
      {label && (
        <span className="text-[9px] text-[#666] italic mb-0.5">{label}</span>
      )}
      <div className="flex flex-col items-center">
        <div className="w-px h-4 bg-[#444]" />
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            borderTop: "6px solid #444",
          }}
        />
      </div>
    </div>
  );
}

// ─── Linear Flow Column ────────────────────────────────────────────────────────
function FlowColumn({ nodes }: { nodes: (Node | "arrow" | { arrow: string })[] }) {
  return (
    <div className="flex flex-col items-center">
      {nodes.map((n, i) => {
        if (n === "arrow") return <Arrow key={i} />;
        if (typeof n === "object" && "arrow" in n)
          return <Arrow key={i} label={n.arrow} />;
        return <FlowNode key={(n as Node).id} node={n as Node} />;
      })}
    </div>
  );
}

// ─── Branch Row ────────────────────────────────────────────────────────────────
function BranchRow({
  left,
  right,
  leftLabel,
  rightLabel,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  leftLabel?: string;
  rightLabel?: string;
}) {
  return (
    <div className="flex items-start gap-6 justify-center w-full">
      <div className="flex flex-col items-center">
        {leftLabel && (
          <span className="text-[9px] font-semibold text-[#60a5fa] mb-1">
            {leftLabel}
          </span>
        )}
        {left}
      </div>
      <div className="flex flex-col items-center">
        {rightLabel && (
          <span className="text-[9px] font-semibold text-[#f87171] mb-1">
            {rightLabel}
          </span>
        )}
        {right}
      </div>
    </div>
  );
}

// ─── Flow Section Wrapper ──────────────────────────────────────────────────────
function FlowSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className="rounded-xl border border-[#252840] bg-[#0c0d1a] p-6"
    >
      <div className="mb-5 pb-4 border-b border-[#1e2040]">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono text-[10px] text-[#6366f1] tracking-widest uppercase">
            {id}
          </span>
          <h3 className="text-sm font-semibold text-[#e0e4ff]">{title}</h3>
        </div>
        <p className="text-[11px] text-[#6b7280]">{description}</p>
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="flex justify-center min-w-max">{children}</div>
      </div>
    </div>
  );
}

// ─── Legend ────────────────────────────────────────────────────────────────────
function Legend() {
  const items = [
    { color: "bg-[#1e2232] border-[#3a4060] text-[#c8d0f0]", label: "Screen / Page / Action", shape: "rect" },
    { color: "bg-[#f5c518]", label: "Decision", shape: "diamond" },
    { color: "bg-[#0d2e1a] border-[#1f6b3a] text-[#4ade80]", label: "Success / Completion", shape: "rect" },
    { color: "bg-[#2e0d0d] border-[#7a1f1f] text-[#f87171]", label: "Error / Blocked State", shape: "rect" },
    { color: "bg-[#1a0d2e] border-[#6b3a7a] text-[#c084fc]", label: "AI / External Service", shape: "rect" },
    { color: "bg-[#0d1a2e] border-[#1a4060] text-[#60a5fa]", label: "Entry Point", shape: "pill" },
  ];

  return (
    <div className="rounded-xl border border-[#252840] bg-[#0c0d1a] p-4">
      <h4 className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-widest mb-3">
        Legend
      </h4>
      <div className="flex flex-wrap gap-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            {item.shape === "diamond" ? (
              <div className="relative" style={{ width: 16, height: 16 }}>
                <div
                  className="absolute inset-0"
                  style={{
                    background: "#f5c518",
                    clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                  }}
                />
              </div>
            ) : (
              <div
                className={`w-4 h-3 border ${item.color} ${item.shape === "pill" ? "rounded-full" : "rounded-[3px]"}`}
              />
            )}
            <span className="text-[10px] text-[#9ca3af]">{item.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="w-5 h-px bg-[#444]" />
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "3px solid transparent",
                borderBottom: "3px solid transparent",
                borderLeft: "5px solid #444",
              }}
            />
          </div>
          <span className="text-[10px] text-[#9ca3af]">Navigation / Flow Direction</span>
        </div>
      </div>
    </div>
  );
}

// ─── Overview Tree ─────────────────────────────────────────────────────────────
function OverviewTree() {
  const clientFlows = [
    { cat: "Voter Management", flows: ["Voter Search & Profile", "Add Voter", "Voter Data Import", "Update Request"] },
    { cat: "User Management", flows: ["Add Worker / User", "AI Mode Access Management"] },
    { cat: "AI & Intelligence", flows: ["AI Natural Language Search", "Generate AI Report", "Previous Election Analysis"] },
    { cat: "Campaigns", flows: ["Create Campaign"] },
    { cat: "Forms & Surveys", flows: ["Create Survey / Form"] },
  ];
  const adminFlows = [
    { cat: "Admin Panel", flows: ["Admin Create Client Account"] },
  ];

  return (
    <div className="rounded-xl border border-[#252840] bg-[#0c0d1a] p-6">
      <div className="mb-4 pb-3 border-b border-[#1e2040]">
        <span className="font-mono text-[10px] text-[#6366f1] tracking-widest uppercase">
          Overview
        </span>
        <h3 className="text-sm font-semibold text-[#e0e4ff] mt-1">
          Election Management Platform — Flow Map
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="text-[11px] font-semibold text-[#818cf8] mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6366f1]" />
            Client Panel Flows
          </div>
          {clientFlows.map((group) => (
            <div key={group.cat} className="mb-3 ml-4">
              <div className="text-[10px] font-semibold text-[#94a3b8] mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#475569]" />
                {group.cat}
              </div>
              {group.flows.map((f) => (
                <div
                  key={f}
                  className="ml-4 text-[10px] text-[#6b7280] flex items-center gap-1.5 py-0.5"
                >
                  <span className="text-[#374151]">└</span> {f}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div>
          <div className="text-[11px] font-semibold text-[#fb923c] mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f97316]" />
            Admin Panel Flows
          </div>
          {adminFlows.map((group) => (
            <div key={group.cat} className="mb-3 ml-4">
              <div className="text-[10px] font-semibold text-[#94a3b8] mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#475569]" />
                {group.cat}
              </div>
              {group.flows.map((f) => (
                <div
                  key={f}
                  className="ml-4 text-[10px] text-[#6b7280] flex items-center gap-1.5 py-0.5"
                >
                  <span className="text-[#374151]">└</span> {f}
                </div>
              ))}
            </div>
          ))}
          <div className="mt-6 p-3 rounded-lg bg-[#0f1025] border border-[#1e2040]">
            <div className="text-[10px] text-[#6b7280] mb-2 font-semibold">Total Flows</div>
            <div className="text-2xl font-bold text-[#e0e4ff] font-mono">12</div>
            <div className="text-[9px] text-[#4b5563] mt-1">User flows documented</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FLOW 01: Voter Search & Profile ──────────────────────────────────────────
function Flow01() {
  const mainPath: (Node | "arrow" | { arrow: string })[] = [
    { id: "f1-login", label: "Login", type: "start" },
    "arrow",
    { id: "f1-dash", label: "Dashboard", type: "screen" },
    "arrow",
    { id: "f1-voters", label: "Voters", type: "screen" },
    "arrow",
    { id: "f1-search", label: "Search Voter", type: "screen" },
    "arrow",
    { id: "f1-qf", label: "Quick Filters", type: "screen" },
    "arrow",
    { id: "f1-af", label: "Advanced Filters", type: "screen" },
    "arrow",
    { id: "f1-sr", label: "Search Results", type: "screen" },
    "arrow",
    { id: "f1-dec", label: "Results Found?", type: "decision" },
  ];

  const actions = [
    { id: "f1-call", label: "Call", type: "screen" as NodeType },
    { id: "f1-wa", label: "WhatsApp", type: "screen" as NodeType },
    { id: "f1-fam", label: "View Family", type: "screen" as NodeType },
    { id: "f1-slip", label: "Voter Slip", type: "screen" as NodeType },
    { id: "f1-edit", label: "Edit Voter", type: "screen" as NodeType },
    { id: "f1-survey", label: "Survey / Update Info", type: "screen" as NodeType },
  ];

  return (
    <FlowSection
      id="Flow 01"
      title="Voter Search & Voter Profile"
      description="Entry to voter search with filters, decision on results, profile actions, and empty state handling."
    >
      <div className="flex gap-6 items-start">
        {/* Main path */}
        <div className="flex flex-col items-center">
          <FlowColumn nodes={mainPath} />
          <div className="flex gap-4 mt-2">
            {/* YES branch */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-[#4ade80] mb-1">YES</span>
              <Arrow />
              <FlowNode node={{ id: "f1-profile", label: "Voter Profile", type: "screen" }} />
              <Arrow />
              <FlowNode node={{ id: "f1-action", label: "Select Action", type: "screen" }} />
              <Arrow />
              <div className="flex gap-2 flex-wrap justify-center" style={{ maxWidth: 360 }}>
                {actions.map((a) => (
                  <FlowNode key={a.id} node={a} />
                ))}
              </div>
            </div>
            {/* NO branch */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-[#f87171] mb-1">NO</span>
              <Arrow />
              <FlowNode node={{ id: "f1-empty", label: "Empty State", type: "error" }} />
              <Arrow />
              <FlowNode node={{ id: "f1-modify", label: "Modify Search / Filters", type: "screen" }} />
              <Arrow />
              <FlowNode node={{ id: "f1-again", label: "Search Again", type: "screen" }} />
            </div>
          </div>
        </div>
      </div>
    </FlowSection>
  );
}

// ─── FLOW 02: Add Voter ────────────────────────────────────────────────────────
function Flow02() {
  return (
    <FlowSection
      id="Flow 02"
      title="Add Voter"
      description="Multi-step voter creation with identity, profile, occupation, and political interest fields. Includes validation error handling."
    >
      <div className="flex gap-8 items-start">
        {/* Happy path */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-semibold text-[#60a5fa] mb-2">
            Happy Path
          </span>
          <FlowColumn
            nodes={[
              { id: "f2-dash", label: "Dashboard", type: "start" },
              "arrow",
              { id: "f2-voters", label: "Voters", type: "screen" },
              "arrow",
              { id: "f2-add", label: "Add Voter", type: "screen" },
              "arrow",
              { id: "f2-id", label: "Identity", type: "screen" },
              "arrow",
              { id: "f2-profile", label: "Profile", type: "screen" },
              "arrow",
              { id: "f2-occ", label: "Occupation", type: "screen" },
              "arrow",
              { id: "f2-pol", label: "Political Interest", type: "screen" },
              "arrow",
              { id: "f2-review", label: "Review Information", type: "screen" },
              "arrow",
              { id: "f2-create", label: "Create Voter", type: "screen" },
              "arrow",
              { id: "f2-success", label: "Success", type: "success" },
            ]}
          />
        </div>
        {/* Validation path */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-semibold text-[#f87171] mb-2">
            Validation Error Path
          </span>
          <FlowColumn
            nodes={[
              { id: "f2-invalid", label: "Invalid / Missing Info", type: "decision" },
              "arrow",
              { id: "f2-valerr", label: "Show Validation Error", type: "error" },
              "arrow",
              { id: "f2-correct", label: "Correct Information", type: "screen" },
              "arrow",
              { id: "f2-review2", label: "Review", type: "screen" },
              "arrow",
              { id: "f2-create2", label: "Create Voter", type: "screen" },
              "arrow",
              { id: "f2-success2", label: "Success", type: "success" },
            ]}
          />
        </div>
      </div>
    </FlowSection>
  );
}

// ─── FLOW 03: Add Worker / User ────────────────────────────────────────────────
function Flow03() {
  return (
    <FlowSection
      id="Flow 03"
      title="Add Worker / User"
      description="Worker/user creation with hierarchical Prabhaag → Booth dependency, SR No. range, and permissions. Validation gate before creation."
    >
      <div className="flex gap-8 items-start">
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-semibold text-[#60a5fa] mb-2">Main Flow</span>
          <FlowColumn
            nodes={[
              { id: "f3-dash", label: "Dashboard", type: "start" },
              "arrow",
              { id: "f3-users", label: "Users / Workers", type: "screen" },
              "arrow",
              { id: "f3-add", label: "Add User", type: "screen" },
              "arrow",
              { id: "f3-details", label: "User Details", type: "screen" },
              "arrow",
              { id: "f3-prab", label: "Select Prabhaag", type: "screen" },
              { arrow: "Loads available Booths" },
              { id: "f3-booth", label: "Select Booth", type: "screen" },
              "arrow",
              { id: "f3-sr", label: "Sr No. Range", type: "screen" },
              "arrow",
              { id: "f3-perms", label: "Permissions", type: "screen" },
              "arrow",
              { id: "f3-review", label: "Review", type: "screen" },
              "arrow",
              { id: "f3-dec", label: "Information Valid?", type: "decision" },
            ]}
          />
          <div className="flex gap-6 mt-2">
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-[#4ade80] mb-1">YES</span>
              <Arrow />
              <FlowNode node={{ id: "f3-cu", label: "Create User", type: "screen" }} />
              <Arrow />
              <FlowNode node={{ id: "f3-success", label: "Success", type: "success" }} />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-[#f87171] mb-1">NO</span>
              <Arrow />
              <FlowNode node={{ id: "f3-valerr", label: "Validation Error", type: "error" }} />
              <Arrow />
              <FlowNode node={{ id: "f3-edit", label: "Edit Information", type: "screen" }} />
            </div>
          </div>
        </div>
      </div>
    </FlowSection>
  );
}

// ─── FLOW 04: AI Mode Access Management ───────────────────────────────────────
function Flow04() {
  return (
    <FlowSection
      id="Flow 04"
      title="AI Mode Access Management"
      description="Subscription-controlled AI user slot management. Shows both grant path (slot available) and revoke-then-grant path (limit reached)."
    >
      <div className="flex gap-8 items-start">
        <div className="flex flex-col items-center">
          <FlowColumn
            nodes={[
              { id: "f4-cp", label: "Client Panel", type: "start" },
              "arrow",
              { id: "f4-um", label: "User Management", type: "screen" },
              "arrow",
              { id: "f4-aim", label: "AI Mode Access", type: "ai" },
              "arrow",
              { id: "f4-sub", label: "View Subscription", type: "screen" },
              "arrow",
              { id: "f4-sel", label: "Select Users", type: "screen" },
              "arrow",
              { id: "f4-chk", label: "Check AI User Limit", type: "ai" },
              "arrow",
              { id: "f4-dec", label: "Available AI User Slot?", type: "decision" },
            ]}
          />
          <div className="flex gap-8 mt-2">
            {/* YES */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-[#4ade80] mb-1">YES — Slot Available</span>
              <Arrow />
              <FlowNode node={{ id: "f4-grant", label: "Grant AI Access", type: "ai" }} />
              <Arrow />
              <FlowNode node={{ id: "f4-save", label: "Save Changes", type: "screen" }} />
              <Arrow />
              <FlowNode node={{ id: "f4-suc", label: "Success", type: "success" }} />
            </div>
            {/* NO */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-[#f87171] mb-1">NO — Limit Reached</span>
              <Arrow />
              <FlowNode node={{ id: "f4-warn", label: "Subscription Limit Warning", type: "error" }} />
              <Arrow />
              <FlowNode node={{ id: "f4-selexist", label: "Select Existing Authorized User", type: "screen" }} />
              <Arrow />
              <FlowNode node={{ id: "f4-revoke", label: "Revoke Access", type: "screen" }} />
              <Arrow />
              <FlowNode node={{ id: "f4-selnew", label: "Select New User", type: "screen" }} />
              <Arrow />
              <FlowNode node={{ id: "f4-grant2", label: "Grant Access", type: "ai" }} />
              <Arrow />
              <FlowNode node={{ id: "f4-save2", label: "Save Changes", type: "screen" }} />
              <Arrow />
              <FlowNode node={{ id: "f4-suc2", label: "Success", type: "success" }} />
            </div>
          </div>
        </div>
      </div>
    </FlowSection>
  );
}

// ─── FLOW 05: AI Natural Language Search ──────────────────────────────────────
function Flow05() {
  return (
    <FlowSection
      id="Flow 05"
      title="AI Natural Language Search"
      description="AI-powered query interface that converts natural language or voice input into search filters, with clarification loop on failure."
    >
      <div className="flex gap-8 items-start">
        <div className="flex flex-col items-center">
          <FlowColumn
            nodes={[
              { id: "f5-dash", label: "Dashboard", type: "start" },
              "arrow",
              { id: "f5-aim", label: "AI Mode", type: "ai" },
              "arrow",
              { id: "f5-ask", label: "Ask Question", type: "screen" },
              "arrow",
              { id: "f5-nl", label: "Natural Language / Voice Query", type: "ai" },
              "arrow",
              { id: "f5-dec", label: "Query Understood?", type: "decision" },
            ]}
          />
          <div className="flex gap-8 mt-2">
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-[#4ade80] mb-1">YES</span>
              <Arrow />
              <FlowNode node={{ id: "f5-conv", label: "Convert Query to Filters", type: "ai" }} />
              <Arrow />
              <FlowNode node={{ id: "f5-srch", label: "Search Election Data", type: "ai" }} />
              <Arrow />
              <FlowNode node={{ id: "f5-res", label: "Results", type: "screen" }} />
              <Arrow />
              <FlowNode node={{ id: "f5-view", label: "View Table / Graph / Analysis", type: "screen" }} />
              <Arrow />
              <FlowNode node={{ id: "f5-fup", label: "Follow-up Question", type: "screen" }} />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-[#f87171] mb-1">NO</span>
              <Arrow />
              <FlowNode node={{ id: "f5-clarify", label: "Ask User to Clarify", type: "error" }} />
              <Arrow />
              <FlowNode node={{ id: "f5-retry", label: "Ask Question", type: "screen" }} />
            </div>
          </div>
        </div>
      </div>
    </FlowSection>
  );
}

// ─── FLOW 06: Create Campaign ──────────────────────────────────────────────────
function Flow06() {
  const statuses = [
    { id: "s-draft", label: "Draft", type: "status" as NodeType },
    { id: "s-sched", label: "Scheduled", type: "status" as NodeType },
    { id: "s-active", label: "Active", type: "status" as NodeType },
    { id: "s-comp", label: "Completed", type: "success" as NodeType },
    { id: "s-fail", label: "Failed", type: "error" as NodeType },
  ];

  return (
    <FlowSection
      id="Flow 06"
      title="Create Campaign"
      description="Multi-channel campaign creation (WhatsApp / SMS / Voice) with audience targeting, human approval gate, and lifecycle status tracking."
    >
      <div className="flex gap-8 items-start">
        <div className="flex flex-col items-center">
          <FlowColumn
            nodes={[
              { id: "f6-dash", label: "Dashboard", type: "start" },
              "arrow",
              { id: "f6-camp", label: "Campaigns", type: "screen" },
              "arrow",
              { id: "f6-create", label: "Create Campaign", type: "screen" },
              "arrow",
              { id: "f6-ch", label: "Select Channel", type: "screen" },
              "arrow",
              { id: "f6-wa", label: "WhatsApp / SMS / Voice", type: "screen" },
              "arrow",
              { id: "f6-aud", label: "Select Target Audience", type: "screen" },
              "arrow",
              { id: "f6-msg", label: "Generate / Create Message or Script", type: "ai" },
              "arrow",
              { id: "f6-rev", label: "Review Content", type: "screen" },
              "arrow",
              { id: "f6-dec", label: "Human Approval Required?", type: "decision" },
            ]}
          />
          <div className="flex gap-6 mt-2">
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-[#4ade80] mb-1">YES — Approved</span>
              <Arrow />
              <FlowNode node={{ id: "f6-approve", label: "Approve", type: "success" }} />
              <Arrow />
              <FlowNode node={{ id: "f6-sched", label: "Schedule / Send", type: "screen" }} />
              <Arrow />
              <FlowNode node={{ id: "f6-active", label: "Campaign Active", type: "success" }} />
              <Arrow />
              <FlowNode node={{ id: "f6-status", label: "Campaign Status", type: "screen" }} />
              <Arrow />
              <FlowNode node={{ id: "f6-analytics", label: "Campaign Analytics", type: "screen" }} />
              <div className="mt-3 p-2 rounded-lg border border-[#1e2040] bg-[#0a0b18]">
                <div className="text-[9px] text-[#6b7280] mb-1 font-semibold">Campaign Statuses</div>
                <div className="flex gap-1 flex-wrap">
                  {statuses.map((s) => (
                    <FlowNode key={s.id} node={s} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-[#f87171] mb-1">NO — Edit</span>
              <Arrow />
              <FlowNode node={{ id: "f6-edit", label: "Edit Content", type: "screen" }} />
            </div>
          </div>
        </div>
      </div>
    </FlowSection>
  );
}

// ─── FLOW 07: Create Survey / Form ────────────────────────────────────────────
function Flow07() {
  return (
    <FlowSection
      id="Flow 07"
      title="Create Survey / Form"
      description="End-to-end survey creation: basic details, audience selection, question builder, activation, sharing, response collection, and analytics."
    >
      <FlowColumn
        nodes={[
          { id: "f7-dash", label: "Dashboard", type: "start" },
          "arrow",
          { id: "f7-forms", label: "Forms / Surveys", type: "screen" },
          "arrow",
          { id: "f7-create", label: "Create Form", type: "screen" },
          "arrow",
          { id: "f7-basic", label: "Basic Details", type: "screen" },
          "arrow",
          { id: "f7-aud", label: "Select Audience", type: "screen" },
          "arrow",
          { id: "f7-q", label: "Create Questions / Sections", type: "screen" },
          "arrow",
          { id: "f7-review", label: "Review", type: "screen" },
          "arrow",
          { id: "f7-save", label: "Save", type: "screen" },
          "arrow",
          { id: "f7-act", label: "Activate", type: "screen" },
          "arrow",
          { id: "f7-share", label: "Share Form", type: "screen" },
          "arrow",
          { id: "f7-collect", label: "Collect Responses", type: "screen" },
          "arrow",
          { id: "f7-analytics", label: "View Analytics", type: "success" },
        ]}
      />
    </FlowSection>
  );
}

// ─── FLOW 08: Generate AI Report ──────────────────────────────────────────────
function Flow08() {
  return (
    <FlowSection
      id="Flow 08"
      title="Generate AI Report"
      description="Natural language report request processed by AI, previewed, exported in PDF / Excel / CSV."
    >
      <FlowColumn
        nodes={[
          { id: "f8-dash", label: "Dashboard", type: "start" },
          "arrow",
          { id: "f8-rep", label: "Reports / AI Mode", type: "screen" },
          "arrow",
          { id: "f8-req", label: "Request Report", type: "screen" },
          "arrow",
          { id: "f8-nl", label: "Natural Language Request", type: "ai" },
          "arrow",
          { id: "f8-filt", label: "Select / Generate Filters", type: "ai" },
          "arrow",
          { id: "f8-proc", label: "AI Processes Data", type: "ai" },
          "arrow",
          { id: "f8-prev", label: "Preview Report", type: "screen" },
          "arrow",
          { id: "f8-fmt", label: "Choose Format", type: "screen" },
          "arrow",
          { id: "f8-pdf", label: "PDF / Excel / CSV", type: "screen" },
          "arrow",
          { id: "f8-gen", label: "Generate Report", type: "screen" },
          "arrow",
          { id: "f8-dl", label: "Download / Export", type: "success" },
        ]}
      />
    </FlowSection>
  );
}

// ─── FLOW 09: Previous Election Analysis ──────────────────────────────────────
function Flow09() {
  return (
    <FlowSection
      id="Flow 09"
      title="Previous Election Analysis"
      description="Historical drill-down from election → constituency → booth, AI/RAG comparative analysis, strategy recommendations, and report export."
    >
      <FlowColumn
        nodes={[
          { id: "f9-dash", label: "Dashboard", type: "start" },
          "arrow",
          { id: "f9-pea", label: "Previous Election Analysis", type: "screen" },
          "arrow",
          { id: "f9-sel", label: "Select Election", type: "screen" },
          "arrow",
          { id: "f9-const", label: "Select Constituency / Area", type: "screen" },
          "arrow",
          { id: "f9-booth", label: "Select Booth / Locality", type: "screen" },
          "arrow",
          { id: "f9-hist", label: "Historical Data", type: "screen" },
          "arrow",
          { id: "f9-ai", label: "AI / RAG Analysis", type: "ai" },
          "arrow",
          { id: "f9-comp", label: "Comparative Analysis", type: "ai" },
          "arrow",
          { id: "f9-ins", label: "Insights", type: "screen" },
          "arrow",
          { id: "f9-strat", label: "Strategy Recommendations", type: "ai" },
          "arrow",
          { id: "f9-gen", label: "Generate Report", type: "success" },
        ]}
      />
    </FlowSection>
  );
}

// ─── FLOW 10: Voter Data Import ────────────────────────────────────────────────
function Flow10() {
  return (
    <FlowSection
      id="Flow 10"
      title="Voter Data Import"
      description="CSV / Excel / PDF import with file validation, duplicate/error checking, and re-upload loop on failure."
    >
      <div className="flex flex-col items-center">
        <FlowColumn
          nodes={[
            { id: "f10-dash", label: "Dashboard", type: "start" },
            "arrow",
            { id: "f10-voters", label: "Voters", type: "screen" },
            "arrow",
            { id: "f10-import", label: "Import Voter Data", type: "screen" },
            "arrow",
            { id: "f10-upload", label: "Upload CSV / Excel / PDF", type: "screen" },
            "arrow",
            { id: "f10-val", label: "Validate File", type: "screen" },
            "arrow",
            { id: "f10-dup", label: "Check Duplicates / Errors", type: "screen" },
            "arrow",
            { id: "f10-review", label: "Review Records", type: "screen" },
            "arrow",
            { id: "f10-dec", label: "Validation Successful?", type: "decision" },
          ]}
        />
        <div className="flex gap-8 mt-2">
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-bold text-[#4ade80] mb-1">YES</span>
            <Arrow />
            <FlowNode node={{ id: "f10-imp", label: "Import Data", type: "screen" }} />
            <Arrow />
            <FlowNode node={{ id: "f10-suc", label: "Success", type: "success" }} />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-bold text-[#f87171] mb-1">NO</span>
            <Arrow />
            <FlowNode node={{ id: "f10-err", label: "Show Errors", type: "error" }} />
            <Arrow />
            <FlowNode node={{ id: "f10-fix", label: "Fix / Re-upload", type: "screen" }} />
            <Arrow />
            <FlowNode node={{ id: "f10-revalidate", label: "Validate Again", type: "screen" }} />
          </div>
        </div>
      </div>
    </FlowSection>
  );
}

// ─── FLOW 11: Update Request ───────────────────────────────────────────────────
function Flow11() {
  return (
    <FlowSection
      id="Flow 11"
      title="Update Request"
      description="Worker-initiated voter data change with pending approval queue, admin approve/reject decision, and worker notification."
    >
      <div className="flex flex-col items-center">
        <FlowColumn
          nodes={[
            { id: "f11-worker", label: "Worker", type: "start" },
            "arrow",
            { id: "f11-vp", label: "Voter Profile", type: "screen" },
            "arrow",
            { id: "f11-edit", label: "Edit Voter Information", type: "screen" },
            "arrow",
            { id: "f11-submit", label: "Submit Update Request", type: "screen" },
            "arrow",
            { id: "f11-pending", label: "Pending Approval", type: "status" },
            "arrow",
            { id: "f11-admin", label: "Client / Admin", type: "screen" },
            "arrow",
            { id: "f11-queue", label: "Update Requests", type: "screen" },
            "arrow",
            { id: "f11-review", label: "Review Request", type: "screen" },
            "arrow",
            { id: "f11-dec", label: "Approve?", type: "decision" },
          ]}
        />
        <div className="flex gap-8 mt-2">
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-bold text-[#4ade80] mb-1">YES</span>
            <Arrow />
            <FlowNode node={{ id: "f11-upd", label: "Update Voter Data", type: "screen" }} />
            <Arrow />
            <FlowNode node={{ id: "f11-approved", label: "Approved", type: "success" }} />
            <Arrow />
            <FlowNode node={{ id: "f11-suc", label: "Notify Worker — Success", type: "success" }} />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-bold text-[#f87171] mb-1">NO</span>
            <Arrow />
            <FlowNode node={{ id: "f11-reject", label: "Reject Request", type: "screen" }} />
            <Arrow />
            <FlowNode node={{ id: "f11-rejected", label: "Rejected", type: "error" }} />
            <Arrow />
            <FlowNode node={{ id: "f11-notify", label: "Notify Worker", type: "screen" }} />
          </div>
        </div>
      </div>
    </FlowSection>
  );
}

// ─── FLOW 12: Admin Create Client Account ─────────────────────────────────────
function Flow12() {
  return (
    <FlowSection
      id="Flow 12"
      title="Admin Create Client Account"
      description="Admin-level client account provisioning including election config, party branding, permissions, and activating client login."
    >
      <FlowColumn
        nodes={[
          { id: "f12-login", label: "Admin Login", type: "start" },
          "arrow",
          { id: "f12-dash", label: "Admin Dashboard", type: "screen" },
          "arrow",
          { id: "f12-mgmt", label: "Client / Account Management", type: "screen" },
          "arrow",
          { id: "f12-create", label: "Create Client Account", type: "screen" },
          "arrow",
          { id: "f12-details", label: "Client Details", type: "screen" },
          "arrow",
          { id: "f12-elec", label: "Election Configuration", type: "screen" },
          "arrow",
          { id: "f12-brand", label: "Party / Branding Configuration", type: "screen" },
          "arrow",
          { id: "f12-type", label: "Account Type", type: "screen" },
          "arrow",
          { id: "f12-perms", label: "Permissions / Access", type: "screen" },
          "arrow",
          { id: "f12-review", label: "Review", type: "screen" },
          "arrow",
          { id: "f12-acc", label: "Create Account", type: "screen" },
          "arrow",
          { id: "f12-created", label: "Account Created", type: "success" },
          "arrow",
          { id: "f12-login2", label: "Client Login Available", type: "success" },
        ]}
      />
    </FlowSection>
  );
}

// ─── Nav ───────────────────────────────────────────────────────────────────────
function FlowNav({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  const flows = [
    "Flow 01", "Flow 02", "Flow 03", "Flow 04",
    "Flow 05", "Flow 06", "Flow 07", "Flow 08",
    "Flow 09", "Flow 10", "Flow 11", "Flow 12",
  ];
  return (
    <div className="flex flex-wrap gap-1.5">
      {flows.map((f) => (
        <button
          key={f}
          onClick={() => onSelect(f)}
          className={`px-2.5 py-1 rounded text-[10px] font-mono font-semibold transition-colors ${
            active === f
              ? "bg-[#6366f1] text-white"
              : "bg-[#0c0d1a] border border-[#252840] text-[#6b7280] hover:text-[#a5b4fc] hover:border-[#6366f1]"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────
export default function UserFlows() {
  const [activeNav, setActiveNav] = useState("Flow 01");

  const handleNav = (id: string) => {
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="min-h-full bg-[#080910] text-[#e0e4ff]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#080910]/95 backdrop-blur border-b border-[#151728]">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-6">
          <div>
            <div className="text-[9px] font-mono text-[#6366f1] tracking-widest uppercase">
              03 — User Flows
            </div>
            <h1 className="text-sm font-semibold text-[#e0e4ff]">
              Election Management Platform
            </h1>
          </div>
          <div className="flex-1 overflow-x-auto">
            <FlowNav active={activeNav} onSelect={handleNav} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
        {/* Page title */}
        <div className="pb-2">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-mono text-[11px] text-[#4b5563] tracking-widest">
              UX DOCUMENTATION
            </span>
            <span className="text-[#1e2040]">—</span>
            <span className="font-mono text-[11px] text-[#6366f1]">v1.0</span>
          </div>
          <h2 className="text-2xl font-bold text-[#e8eaff] tracking-tight">
            User Flow Diagrams
          </h2>
          <p className="mt-1 text-sm text-[#4b5563] max-w-2xl">
            12 user flows covering all major platform interactions. Intended for
            UI/UX designers and developers. Rectangles = screens/actions,
            diamonds = decisions, green = success, red = error, purple = AI/external.
          </p>
        </div>

        <Legend />
        <OverviewTree />

        {/* Separator */}
        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-[#151728]" />
          <span className="text-[10px] font-mono text-[#4b5563] tracking-widest">
            CLIENT PANEL FLOWS
          </span>
          <div className="flex-1 h-px bg-[#151728]" />
        </div>

        {/* Voter Management */}
        <div className="text-[10px] font-semibold text-[#818cf8] uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
          Voter Management
        </div>
        <Flow01 />
        <Flow02 />
        <Flow10 />
        <Flow11 />

        {/* User Management */}
        <div className="text-[10px] font-semibold text-[#818cf8] uppercase tracking-widest flex items-center gap-2 pt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
          User Management
        </div>
        <Flow03 />
        <Flow04 />

        {/* AI & Intelligence */}
        <div className="text-[10px] font-semibold text-[#c084fc] uppercase tracking-widest flex items-center gap-2 pt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
          AI & Intelligence
        </div>
        <Flow05 />
        <Flow08 />
        <Flow09 />

        {/* Campaigns */}
        <div className="text-[10px] font-semibold text-[#fb923c] uppercase tracking-widest flex items-center gap-2 pt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
          Campaigns
        </div>
        <Flow06 />

        {/* Forms */}
        <div className="text-[10px] font-semibold text-[#34d399] uppercase tracking-widest flex items-center gap-2 pt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          Forms & Surveys
        </div>
        <Flow07 />

        {/* Admin Panel */}
        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-[#151728]" />
          <span className="text-[10px] font-mono text-[#4b5563] tracking-widest">
            ADMIN PANEL FLOWS
          </span>
          <div className="flex-1 h-px bg-[#151728]" />
        </div>
        <div className="text-[10px] font-semibold text-[#fb923c] uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
          Client Account Management
        </div>
        <Flow12 />

        <div className="h-12" />
      </div>
    </div>
  );
}

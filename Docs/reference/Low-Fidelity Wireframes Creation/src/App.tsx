import { useState } from "react";

// ─── Navigation types ──────────────────────────────────────────────────────────

type Screen = "dashboard" | "voters" | "voter-profile" | "ai-mode" | "add-voter";

// ─── Shared wireframe primitives ───────────────────────────────────────────────

function WFBox({
  label,
  className = "",
  children,
  onClick,
}: {
  label?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`border border-gray-400 bg-gray-100 flex flex-col items-center justify-center text-gray-500 text-xs font-mono ${onClick ? "cursor-pointer hover:bg-gray-200 active:bg-gray-300" : ""} ${className}`}
    >
      {label && !children && <span className="px-2 text-center">{label}</span>}
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
      {children}
    </div>
  );
}

// ─── Clickable nav link ────────────────────────────────────────────────────────

function NavLink({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <span
      onClick={onClick}
      className={`cursor-pointer hover:underline underline-offset-2 ${className}`}
    >
      {children}
    </span>
  );
}

// ─── Navigation hint badge ─────────────────────────────────────────────────────

function NavHint({ label }: { label: string }) {
  return (
    <span className="ml-1 text-[9px] font-mono text-gray-300 border border-gray-300 px-1 py-px leading-none">
      {label}
    </span>
  );
}

// ─── Shared sidebar ────────────────────────────────────────────────────────────

const NAV_ITEMS: { label: string; screen?: Screen }[] = [
  { label: "Dashboard", screen: "dashboard" },
  { label: "Voters", screen: "voters" },
  { label: "Members" },
  { label: "Workers" },
  { label: "BLO" },
  { label: "Booths" },
  { label: "Forms" },
  { label: "Campaigns" },
  { label: "AI Mode", screen: "ai-mode" },
  { label: "Reports" },
  { label: "Filters" },
  { label: "Import / Export" },
  { label: "Activities" },
  { label: "Organization" },
  { label: "Settings" },
];

function Sidebar({
  active,
  navigate,
}: {
  active: string;
  navigate: (screen: Screen) => void;
}) {
  return (
    <div className="w-44 border-r border-gray-300 bg-gray-50 flex-shrink-0 flex flex-col">
      <div className="px-3 py-3 border-b border-gray-300">
        <WFBox label="Logo / Org" className="h-7 w-full" />
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = item.label === active;
          const isClickable = !!item.screen;
          return (
            <div
              key={item.label}
              onClick={() => item.screen && navigate(item.screen)}
              className={`px-3 py-1.5 text-xs font-mono flex items-center gap-2 select-none ${
                isActive
                  ? "bg-gray-300 text-gray-900 font-bold"
                  : isClickable
                  ? "text-gray-600 hover:bg-gray-200 cursor-pointer"
                  : "text-gray-400"
              }`}
            >
              <WFBox className="w-3 h-3 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isClickable && !isActive && (
                <NavHint label="→" />
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

// ─── Shared header ─────────────────────────────────────────────────────────────

function Header() {
  return (
    <div className="h-11 border-b border-gray-300 bg-white flex items-center px-4 gap-3 flex-shrink-0">
      <WFBox label="Election / Org Selector" className="h-7 w-48" />
      <div className="flex-1" />
      <WFBox label="Global Search" className="h-7 w-52" />
      <WFBox label="🔔 Notifs" className="h-7 w-20" />
      <WFBox label="User ▾" className="h-7 w-24" />
    </div>
  );
}

// ─── WIREFRAME 01 — Client Dashboard ──────────────────────────────────────────

function WF01Dashboard({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar active="Dashboard" navigate={navigate} />
        <main className="flex-1 overflow-y-auto bg-white p-5 space-y-4">
          {/* Title + selectors */}
          <div className="flex items-center justify-between">
            <h1 className="text-base font-bold font-mono text-gray-800">
              Dashboard
            </h1>
            <div className="flex gap-2">
              <WFBox label="Election ▾" className="h-7 w-36" />
              <WFBox label="Constituency ▾" className="h-7 w-36" />
            </div>
          </div>

          {/* Summary cards */}
          <div>
            <SectionLabel>Summary Cards</SectionLabel>
            <div className="grid grid-cols-5 gap-3">
              {[
                ["Total Voters", "2,45,310", "voters"],
                ["Total Members", "1,842", null],
                ["Total Workers", "634", null],
                ["Total Booths", "312", null],
                ["BLO Count", "28", null],
              ].map(([label, value, target]) => (
                <div
                  key={label as string}
                  onClick={() => target === "voters" && navigate("voters")}
                  className={`border border-gray-300 bg-gray-50 p-3 flex flex-col gap-1 ${target === "voters" ? "cursor-pointer hover:bg-gray-100" : ""}`}
                >
                  <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                    {label as string}
                    {target === "voters" && <NavHint label="→ Voters" />}
                  </span>
                  <span className="text-lg font-bold font-mono text-gray-700">
                    {value as string}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Org / booth coverage + gender + caste */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1 space-y-1">
              <SectionLabel>Org / Booth Coverage</SectionLabel>
              <WFBox label="Coverage Summary Table" className="h-28 w-full" />
            </div>
            <div className="space-y-1">
              <SectionLabel>Gender Distribution</SectionLabel>
              <WFBox label="Chart — Gender" className="h-28 w-full" />
            </div>
            <div className="space-y-1">
              <SectionLabel>Caste Distribution</SectionLabel>
              <WFBox label="Chart — Caste" className="h-28 w-full" />
            </div>
          </div>

          {/* Analytics */}
          <div>
            <SectionLabel>Analytics</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <WFBox label="Chart — Voter Registration Trend" className="h-32 w-full" />
              <WFBox label="Chart — Member / Worker Growth" className="h-32 w-full" />
            </div>
          </div>

          {/* Booth data */}
          <div>
            <SectionLabel>Top Booths / Booth-Wise Voter Data</SectionLabel>
            <div className="border border-gray-300 font-mono text-xs">
              <div className="grid grid-cols-5 bg-gray-200 border-b border-gray-300 px-3 py-1.5 text-gray-600 font-bold">
                <span>Booth #</span>
                <span>Booth Name</span>
                <span>Voters</span>
                <span>Workers</span>
                <span>Coverage %</span>
              </div>
              {[
                ["001", "Booth Alpha", "892", "4", "78%"],
                ["002", "Booth Beta", "741", "3", "65%"],
                ["003", "Booth Gamma", "1,104", "5", "91%"],
                ["004", "Booth Delta", "623", "2", "54%"],
              ].map(([num, name, voters, workers, cov]) => (
                <div
                  key={num}
                  className="grid grid-cols-5 px-3 py-1.5 border-b border-gray-200 text-gray-700"
                >
                  <span>{num}</span>
                  <span>{name}</span>
                  <span>{voters}</span>
                  <span>{workers}</span>
                  <span>{cov}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div>
            <SectionLabel>Quick Actions</SectionLabel>
            <div className="flex gap-2">
              <WFBox
                label="Add Voter"
                className="h-8 px-3 w-auto min-w-24"
                onClick={() => navigate("add-voter")}
              />
              {["Import CSV", "Send Campaign", "View Reports", "Export Data"].map((a) => (
                <WFBox key={a} label={a} className="h-8 px-3 w-auto min-w-24" />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── WIREFRAME 02 — Voter Board ────────────────────────────────────────────────

function WF02VoterBoard({ navigate }: { navigate: (s: Screen) => void }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const VOTERS = [
    ["Ramesh Kumar", "XYZ1234567", "M", "42", "Booth Alpha"],
    ["Sunita Devi", "XYZ2345678", "F", "35", "Booth Beta"],
    ["Arvind Singh", "XYZ3456789", "M", "58", "Booth Gamma"],
    ["Priya Verma", "XYZ4567890", "F", "29", "Booth Alpha"],
    ["Mohammed Ali", "XYZ5678901", "M", "47", "Booth Delta"],
    ["Geeta Sharma", "XYZ6789012", "F", "33", "Booth Beta"],
  ];

  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar active="Voters" navigate={navigate} />
        <main className="flex-1 overflow-y-auto bg-white p-5 space-y-3">
          {/* Title */}
          <div className="flex items-center justify-between">
            <h1 className="text-base font-bold font-mono text-gray-800">Voters</h1>
            <div className="flex gap-2">
              <WFBox label="Upload CSV" className="h-7 w-28" />
              <WFBox
                label="+ Add Voter"
                className="h-7 w-28"
                onClick={() => navigate("add-voter")}
              />
            </div>
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <WFBox label="Search voters by name / EPIC..." className="h-8 flex-1" />
            <WFBox label="🔍 Search" className="h-8 w-20" />
          </div>

          {/* Quick filters */}
          <div>
            <SectionLabel>Quick Filters</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {["Gender ▾", "Age Range ▾", "Booth ▾", "Caste ▾", "Status ▾", "Ward ▾"].map(
                (f) => (
                  <WFBox key={f} label={f} className="h-7 px-3 w-auto min-w-20" />
                )
              )}
              <button
                className="border border-gray-400 bg-gray-100 text-xs font-mono text-gray-600 px-3 h-7 hover:bg-gray-200 cursor-pointer flex items-center gap-1"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                Advanced Filters {showAdvanced ? "▲" : "▼"}
                {!showAdvanced && <NavHint label="click to open" />}
              </button>
            </div>
          </div>

          {/* Advanced filters panel */}
          {showAdvanced && (
            <div className="border border-gray-400 bg-gray-50 p-4">
              <div className="flex items-center justify-between mb-2">
                <SectionLabel>Advanced Filters Panel</SectionLabel>
                <button
                  className="text-xs font-mono text-gray-400 hover:text-gray-600"
                  onClick={() => setShowAdvanced(false)}
                >
                  ✕ Close
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  "State",
                  "Lok Sabha",
                  "Vidhan Sabha",
                  "Booth",
                  "Gender",
                  "Age (from–to)",
                  "Caste",
                  "Location / Village",
                  "Contact Available",
                  "Voting Status",
                  "Member Link",
                  "Survey Status",
                ].map((f) => (
                  <WFBox key={f} label={f} className="h-8 w-full" />
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <WFBox label="Apply Filters" className="h-7 w-28" />
                <WFBox label="Clear All" className="h-7 w-24" />
              </div>
            </div>
          )}

          {/* Results summary */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-500">
              Results: 2,45,310 voters found
            </span>
            <div className="flex gap-2">
              <WFBox label="Columns ▾" className="h-6 w-20" />
              <WFBox label="Export ▾" className="h-6 w-20" />
            </div>
          </div>

          {/* Table */}
          <div className="border border-gray-300 font-mono text-xs">
            <div className="grid grid-cols-8 bg-gray-200 border-b border-gray-300 px-3 py-1.5 text-gray-600 font-bold">
              <span className="col-span-1">☐</span>
              <span className="col-span-2">Name</span>
              <span>EPIC No.</span>
              <span>Gender</span>
              <span>Age</span>
              <span>Booth</span>
              <span>Actions</span>
            </div>
            {VOTERS.map(([name, epic, gender, age, booth]) => (
              <div
                key={epic}
                onClick={() => navigate("voter-profile")}
                className="grid grid-cols-8 px-3 py-1.5 border-b border-gray-200 text-gray-700 hover:bg-gray-100 cursor-pointer group"
                title="Click to open voter profile"
              >
                <span onClick={(e) => e.stopPropagation()}>☐</span>
                <span className="col-span-2 group-hover:underline underline-offset-1">
                  {name}
                </span>
                <span>{epic}</span>
                <span>{gender}</span>
                <span>{age}</span>
                <span>{booth}</span>
                <span className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <WFBox
                    label="View"
                    className="h-5 px-1.5 w-auto"
                    onClick={() => navigate("voter-profile")}
                  />
                  <WFBox label="Edit" className="h-5 px-1.5 w-auto" />
                </span>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-500">Page 1 of 245</span>
            <div className="flex gap-1">
              {["‹ Prev", "1", "2", "3", "...", "245", "Next ›"].map((p) => (
                <WFBox key={p} label={p} className="h-6 w-10" />
              ))}
            </div>
            <WFBox label="Rows / page: 50 ▾" className="h-6 w-32" />
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── WIREFRAME 03 — Voter Profile ─────────────────────────────────────────────

function InfoBlock({
  title,
  fields,
}: {
  title: string;
  fields: [string, string][];
}) {
  return (
    <div>
      <SectionLabel>{title}</SectionLabel>
      <div className="border border-gray-300 bg-gray-50 p-3 grid grid-cols-3 gap-x-4 gap-y-1.5">
        {fields.map(([label, value]) => (
          <div key={label} className="flex flex-col">
            <span className="text-xs text-gray-400 font-mono">{label}</span>
            <span className="text-xs font-mono text-gray-700 border-b border-gray-300 pb-0.5">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WF03VoterProfile({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar active="Voters" navigate={navigate} />
        <main className="flex-1 overflow-y-auto bg-white p-5 space-y-4">
          {/* Back */}
          <div className="text-xs font-mono text-gray-500">
            <NavLink onClick={() => navigate("voters")} className="text-gray-600 hover:text-gray-900">
              ← Back to Voters
            </NavLink>
          </div>

          {/* Profile header card */}
          <div className="border border-gray-300 bg-gray-50 p-4 flex items-start justify-between">
            <div className="flex gap-4 items-start">
              <WFBox label="Photo" className="w-14 h-14 flex-shrink-0" />
              <div className="space-y-1">
                <div className="text-base font-bold font-mono text-gray-800">
                  Ramesh Kumar
                </div>
                <div className="text-xs font-mono text-gray-500">
                  Male · 42 yrs · Active Voter
                </div>
                <div className="text-xs font-mono text-gray-400">
                  EPIC: XYZ1234567
                </div>
                <div className="text-xs font-mono text-gray-400">
                  Voter No: 312 · Booth: Booth Alpha (001)
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <WFBox label="Edit" className="h-7 w-16" />
              <WFBox label="Delete" className="h-7 w-16" />
              <WFBox label="Actions ▾" className="h-7 w-24" />
            </div>
          </div>

          <InfoBlock
            title="Identity"
            fields={[
              ["Voter Name", "Ramesh Kumar"],
              ["Father / Husband", "Rajendra Kumar"],
              ["EPIC Number", "XYZ1234567"],
              ["Voter Serial No.", "312"],
              ["Part No.", "04"],
              ["Constituency", "Varanasi Cantonment"],
            ]}
          />

          <InfoBlock
            title="Contact / Profile"
            fields={[
              ["Mobile", "+91 98765 43210"],
              ["Email", "ramesh@example.com"],
              ["Gender", "Male"],
              ["Age", "42"],
              ["Date of Birth", "12 Mar 1982"],
              ["Marital Status", "Married"],
            ]}
          />

          <InfoBlock
            title="Occupation"
            fields={[
              ["Occupation", "Farmer"],
              ["Education", "Secondary (10th)"],
              ["Income Range", "₹1L – ₹3L"],
            ]}
          />

          <InfoBlock
            title="Political Interest"
            fields={[
              ["Classification", "Supporter"],
              ["Caste", "OBC"],
              ["Sub-caste", "Kushwaha"],
              ["Survey Status", "Completed"],
              ["Remarks", "Likely to vote. Strong supporter."],
              ["Last Contact", "15 Aug 2024"],
            ]}
          />

          <InfoBlock
            title="Address"
            fields={[
              ["House No.", "12A"],
              ["Village / Locality", "Sigra"],
              ["Ward", "Ward 07"],
              ["Booth", "Booth Alpha"],
              ["Block", "Cantt Block"],
              ["Full Address", "12A Sigra, Varanasi Cantt, UP – 221001"],
            ]}
          />

          <div>
            <SectionLabel>Activity / History</SectionLabel>
            <div className="border border-gray-300 bg-gray-50 p-3 space-y-2">
              {[
                ["15 Aug 2024", "Profile updated via CSV import"],
                ["04 Jun 2024", "Marked as Supporter by worker Anil P."],
                ["10 Jan 2024", "WhatsApp campaign sent — Delivered"],
                ["22 Oct 2023", "Voter first added to system"],
              ].map(([date, event]) => (
                <div key={date} className="flex gap-3 text-xs font-mono text-gray-600">
                  <span className="text-gray-400 w-28 flex-shrink-0">{date}</span>
                  <span>{event}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── WIREFRAME 04 — AI Mode ────────────────────────────────────────────────────

function WF04AIMode({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Conversation sidebar — AI Mode has its own left panel */}
        <div className="w-48 border-r border-gray-300 bg-gray-50 flex flex-col flex-shrink-0">
          {/* Sidebar nav items for Dashboard / Voters access */}
          <div className="border-b border-gray-300">
            {(
              [
                { label: "Dashboard", screen: "dashboard" as Screen },
                { label: "Voters", screen: "voters" as Screen },
              ]
            ).map((item) => (
              <div
                key={item.label}
                onClick={() => navigate(item.screen)}
                className="px-3 py-1.5 text-xs font-mono flex items-center gap-2 text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                <WFBox className="w-3 h-3 flex-shrink-0" />
                {item.label}
                <NavHint label="→" />
              </div>
            ))}
            <div className="px-3 py-1.5 text-xs font-mono flex items-center gap-2 bg-gray-300 text-gray-900 font-bold">
              <WFBox className="w-3 h-3 flex-shrink-0" />
              AI Mode
            </div>
          </div>

          {/* Chat history */}
          <div className="p-3 border-b border-gray-300">
            <WFBox label="+ New Chat" className="h-7 w-full" />
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-3">
            <div>
              <div className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wider px-1 mb-1">
                Today
              </div>
              {[
                "Booth 12 voter count",
                "OBC women aged 25–40",
                "Worker coverage gap",
              ].map((c) => (
                <div
                  key={c}
                  className="text-xs font-mono text-gray-600 px-2 py-1.5 hover:bg-gray-200 truncate cursor-pointer"
                >
                  · {c}
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wider px-1 mb-1">
                Yesterday
              </div>
              {["Campaign performance", "Add voter in Booth 7"].map((c) => (
                <div
                  key={c}
                  className="text-xs font-mono text-gray-600 px-2 py-1.5 hover:bg-gray-200 truncate cursor-pointer"
                >
                  · {c}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="border-b border-gray-200 px-5 py-2.5 flex items-center justify-between">
            <span className="text-sm font-bold font-mono text-gray-700">
              AI Assistant — Election Intelligence
            </span>
            <div className="flex gap-2">
              <WFBox label="Clear" className="h-6 w-16" />
              <WFBox label="Export" className="h-6 w-16" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {/* User message */}
            <div className="flex justify-end">
              <div className="border border-gray-300 bg-gray-100 px-4 py-2 max-w-md">
                <p className="text-xs font-mono text-gray-700">
                  Show me all female voters aged 25 to 40 in Booth Alpha who
                  haven't been contacted yet.
                </p>
              </div>
            </div>

            {/* AI text response */}
            <div className="flex gap-3">
              <WFBox label="AI" className="w-7 h-7 flex-shrink-0 text-[10px]" />
              <div className="border border-gray-300 bg-gray-50 px-4 py-2 max-w-lg space-y-2">
                <p className="text-xs font-mono text-gray-700">
                  Found 148 female voters aged 25–40 in Booth Alpha with no
                  contact logged. Here is the list:
                </p>
                <WFBox
                  label="Table — 148 results (Name, EPIC, Age, Last Contact)"
                  className="h-24 w-full"
                />
                <div className="flex gap-2">
                  <WFBox label="Export CSV" className="h-6 w-24" />
                  <WFBox label="Send Campaign" className="h-6 w-28" />
                  <WFBox label="Assign Workers" className="h-6 w-28" />
                </div>
              </div>
            </div>

            {/* User follow-up */}
            <div className="flex justify-end">
              <div className="border border-gray-300 bg-gray-100 px-4 py-2 max-w-md">
                <p className="text-xs font-mono text-gray-700">
                  Send a WhatsApp message to all 148 voters.
                </p>
              </div>
            </div>

            {/* AI approval-required response */}
            <div className="flex gap-3">
              <WFBox label="AI" className="w-7 h-7 flex-shrink-0 text-[10px]" />
              <div className="space-y-2 max-w-lg">
                <div className="border border-gray-300 bg-gray-50 px-4 py-2">
                  <p className="text-xs font-mono text-gray-700">
                    This action requires your approval before it can be executed.
                  </p>
                </div>
                <div className="border-2 border-gray-400 bg-white p-4 space-y-2">
                  <div className="text-xs font-bold font-mono text-gray-600 uppercase tracking-wider">
                    AI Action Requires Approval
                  </div>
                  <div className="border-t border-gray-200 pt-2 space-y-1">
                    {[
                      ["Action", "Send WhatsApp Campaign"],
                      ["Audience", "148 voters — Booth Alpha, F, 25–40"],
                      ["Message", "Namaste! Please confirm your support..."],
                      ["Estimated Cost", "₹222 (₹1.50 / message)"],
                      ["Sender", "AI Mode — Verified Campaign"],
                    ].map(([k, v]) => (
                      <div key={k} className="grid grid-cols-5 text-xs font-mono">
                        <span className="text-gray-400 col-span-2">{k}</span>
                        <span className="text-gray-700 col-span-3">{v}</span>
                      </div>
                    ))}
                  </div>
                  <WFBox label="Message Preview Placeholder" className="h-10 w-full" />
                  <div className="flex gap-2 pt-1">
                    <WFBox label="Cancel" className="h-7 w-24" />
                    <WFBox label="Approve & Send" className="h-7 w-36" />
                  </div>
                </div>
              </div>
            </div>

            {/* Graph result placeholder */}
            <div className="flex gap-3">
              <WFBox label="AI" className="w-7 h-7 flex-shrink-0 text-[10px]" />
              <div className="border border-gray-300 bg-gray-50 px-4 py-2 max-w-lg space-y-2">
                <p className="text-xs font-mono text-gray-500 italic">
                  [AI can also return chart / graph results]
                </p>
                <WFBox label="Graph / Chart Result Placeholder" className="h-24 w-full" />
              </div>
            </div>
          </div>

          {/* Input area */}
          <div className="border-t border-gray-200 px-5 py-3">
            <div className="flex gap-2 items-center">
              <div className="flex-1 border border-gray-400 bg-gray-50 h-9 flex items-center px-3">
                <span className="text-xs font-mono text-gray-400">
                  Ask anything about voters, booths, campaigns, analytics...
                </span>
              </div>
              <WFBox label="🎤" className="h-9 w-10" />
              <WFBox label="Send ›" className="h-9 w-16" />
            </div>
            <div className="flex gap-2 mt-2">
              {[
                "Show booth coverage",
                "Identify floating voters",
                "Draft campaign message",
                "Worker performance",
              ].map((s) => (
                <WFBox key={s} label={s} className="h-6 px-2 w-auto text-[10px]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIREFRAME 05 — Add Voter (placeholder) ────────────────────────────────────

function WF05AddVoter({ navigate }: { navigate: (s: Screen) => void }) {
  const FIELDS = [
    ["Full Name", "text"],
    ["EPIC Number", "text"],
    ["Father / Husband Name", "text"],
    ["Date of Birth", "date"],
    ["Gender", "select"],
    ["Mobile Number", "text"],
    ["Email", "text"],
    ["Caste", "select"],
    ["Sub-caste", "text"],
    ["Occupation", "select"],
    ["Education", "select"],
    ["Marital Status", "select"],
    ["State", "select"],
    ["Lok Sabha", "select"],
    ["Vidhan Sabha", "select"],
    ["Booth", "select"],
    ["Ward", "text"],
    ["House No.", "text"],
    ["Village / Locality", "text"],
    ["Full Address", "textarea"],
    ["Political Classification", "select"],
    ["Survey Status", "select"],
    ["Remarks", "textarea"],
  ];

  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar active="Voters" navigate={navigate} />
        <main className="flex-1 overflow-y-auto bg-white p-5 space-y-4">
          {/* Back */}
          <div className="text-xs font-mono text-gray-500">
            <NavLink onClick={() => navigate("voters")} className="text-gray-600 hover:text-gray-900">
              ← Back to Voters
            </NavLink>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-base font-bold font-mono text-gray-800">Add New Voter</h1>
            <div className="flex gap-2">
              <WFBox
                label="Cancel"
                className="h-7 w-20"
                onClick={() => navigate("voters")}
              />
              <WFBox label="Save Voter" className="h-7 w-28" />
            </div>
          </div>

          <div className="border border-gray-300 bg-gray-50 p-4">
            <SectionLabel>Voter Information Form</SectionLabel>
            <div className="grid grid-cols-3 gap-3">
              {FIELDS.map(([label, type]) => (
                <div
                  key={label}
                  className={`flex flex-col gap-1 ${type === "textarea" ? "col-span-3" : ""}`}
                >
                  <span className="text-xs font-mono text-gray-400">{label}</span>
                  <WFBox
                    label={
                      type === "select"
                        ? `[ ${label} ▾ ]`
                        : type === "textarea"
                        ? `[ ${label} — multi-line input ]`
                        : `[ ${label} ]`
                    }
                    className={type === "textarea" ? "h-12 w-full" : "h-7 w-full"}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <WFBox
              label="Cancel"
              className="h-8 w-24"
              onClick={() => navigate("voters")}
            />
            <WFBox label="Save & Add Another" className="h-8 w-40" />
            <WFBox label="Save Voter" className="h-8 w-28" />
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Section label banner ──────────────────────────────────────────────────────

function SectionBanner({ index, title }: { index: string; title: string }) {
  return (
    <div className="bg-gray-800 text-white px-5 py-2 flex items-center gap-3 flex-shrink-0">
      <span className="text-xs font-mono text-gray-400">{index}</span>
      <span className="text-sm font-mono font-bold">{title}</span>
      <div className="flex-1" />
      <span className="text-xs font-mono text-gray-500">
        Low-Fidelity Wireframe · Grayscale Only
      </span>
    </div>
  );
}

// ─── Screen → tab mapping ──────────────────────────────────────────────────────

const TABS: { index: string; label: string; screen: Screen }[] = [
  { index: "WF-01", label: "Client Dashboard", screen: "dashboard" },
  { index: "WF-02", label: "Voter Board", screen: "voters" },
  { index: "WF-03", label: "Voter Profile", screen: "voter-profile" },
  { index: "WF-04", label: "AI Mode", screen: "ai-mode" },
];

const SCREEN_META: Record<Screen, { index: string; title: string }> = {
  dashboard: { index: "WF-01", title: "Client Dashboard" },
  voters: { index: "WF-02", title: "Voter Board" },
  "voter-profile": { index: "WF-03", title: "Voter Profile" },
  "ai-mode": { index: "WF-04", title: "AI Mode" },
  "add-voter": { index: "WF-05", title: "Add Voter" },
};

// ─── Root App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");

  const navigate = (s: Screen) => {
    setScreen(s);
  };

  const meta = SCREEN_META[screen];

  return (
    <div className="h-full flex flex-col bg-gray-100 font-sans">
      {/* Document header */}
      <div className="bg-white border-b border-gray-300 px-5 py-3 flex-shrink-0">
        <div className="text-xs font-mono text-gray-400 mb-0.5">
          04 — Low-Fidelity Wireframes
        </div>
        <div className="text-sm font-bold font-mono text-gray-700">
          Election Management Platform · Desktop Wireframes
        </div>
      </div>

      {/* Wireframe tabs */}
      <div className="bg-white border-b border-gray-300 flex flex-shrink-0 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = screen === tab.screen ||
            (screen === "add-voter" && tab.screen === "voters");
          return (
            <button
              key={tab.screen}
              onClick={() => navigate(tab.screen)}
              className={`px-5 py-2 text-xs font-mono border-r border-gray-200 whitespace-nowrap flex-shrink-0 ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <span className={isActive ? "text-gray-400" : "text-gray-400"}>
                {tab.index}
              </span>
              <span className="ml-1.5">{tab.label}</span>
            </button>
          );
        })}
        {/* Show WF-05 tab only when on add-voter */}
        {screen === "add-voter" && (
          <button className="px-5 py-2 text-xs font-mono border-r border-gray-200 whitespace-nowrap flex-shrink-0 bg-gray-800 text-white">
            <span className="text-gray-400">WF-05</span>
            <span className="ml-1.5">Add Voter</span>
          </button>
        )}
      </div>

      {/* Active wireframe */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <SectionBanner index={meta.index} title={meta.title} />
        <div className="flex-1 overflow-hidden">
          {screen === "dashboard" && <WF01Dashboard navigate={navigate} />}
          {screen === "voters" && <WF02VoterBoard navigate={navigate} />}
          {screen === "voter-profile" && <WF03VoterProfile navigate={navigate} />}
          {screen === "ai-mode" && <WF04AIMode navigate={navigate} />}
          {screen === "add-voter" && <WF05AddVoter navigate={navigate} />}
        </div>
      </div>
    </div>
  );
}

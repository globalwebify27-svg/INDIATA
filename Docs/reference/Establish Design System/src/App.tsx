import { useState } from "react";
import {
  LayoutDashboard, Users, UserCheck, HardHat, Building2, Tent,
  FileText, Megaphone, Bot, BarChart2, Filter, Upload,
  Activity, Network, Settings, Search, Bell, User,
  ChevronDown, ChevronRight, Check, X, AlertTriangle,
  Info, Loader2, Plus, MoreHorizontal, Eye, Trash2,
  Edit, ArrowUpRight, ArrowDownRight, Minus,
} from "lucide-react";

// ─── Design Tokens ─────────────────────────────────────────────────────────
const tokens = {
  colors: {
    "Primary": { hex: "#2563EB", label: "primary" },
    "Primary Hover": { hex: "#1D4ED8", label: "primary-hover" },
    "Background": { hex: "#F8FAFC", label: "bg" },
    "Surface": { hex: "#FFFFFF", label: "surface" },
    "Surface Secondary": { hex: "#F1F5F9", label: "surface-secondary" },
    "Text": { hex: "#0F172A", label: "text" },
    "Text Secondary": { hex: "#475569", label: "text-secondary" },
    "Text Muted": { hex: "#94A3B8", label: "text-muted" },
    "Border": { hex: "#E2E8F0", label: "border" },
    "Success": { hex: "#16A34A", label: "success" },
    "Warning": { hex: "#D97706", label: "warning" },
    "Danger": { hex: "#DC2626", label: "danger" },
    "Info": { hex: "#0284C7", label: "info" },
  },
  spacing: [4, 8, 12, 16, 20, 24, 32, 40, 48, 64],
  radii: [
    { px: 6, usage: "Small controls" },
    { px: 8, usage: "Buttons & inputs" },
    { px: 10, usage: "Standard cards" },
    { px: 12, usage: "Larger panels" },
    { px: 16, usage: "Large surfaces" },
  ],
  typography: [
    { name: "Display", size: 36, weight: 700, lh: 44, sample: "Election Management Platform" },
    { name: "Heading 1", size: 30, weight: 700, lh: 38, sample: "Voter Registration Dashboard" },
    { name: "Heading 2", size: 24, weight: 700, lh: 32, sample: "Constituency Overview" },
    { name: "Heading 3", size: 20, weight: 600, lh: 28, sample: "Active Voter Records" },
    { name: "Body", size: 16, weight: 400, lh: 24, sample: "Manage voter registrations, polling booths, and election workers across all districts." },
    { name: "Body Medium", size: 16, weight: 500, lh: 24, sample: "Total registered voters in the current election cycle." },
    { name: "Small", size: 14, weight: 400, lh: 20, sample: "Last updated 2 minutes ago — Sync status: Active" },
    { name: "Caption", size: 12, weight: 400, lh: 16, sample: "ID: VTR-2024-00142 · Ward 7 · District North" },
  ],
};

// ─── Section Wrapper ────────────────────────────────────────────────────────
function Section({ id, label, title, children }: { id: string; label: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="border-t border-[#E2E8F0] pt-12 pb-16">
      <div className="flex items-baseline gap-4 mb-8">
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, color: "#94A3B8", letterSpacing: "0.08em" }}>
          {label}
        </span>
        <h2 style={{ fontSize: 24, fontWeight: 700, lineHeight: "32px", color: "#0F172A" }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function TokenLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#94A3B8" }}>{children}</span>
  );
}

// ─── 01 Colors ──────────────────────────────────────────────────────────────
function ColorsSection() {
  const groups = [
    {
      title: "Brand",
      items: [
        { name: "Primary", hex: "#2563EB", var: "--color-primary", light: false },
        { name: "Primary Hover", hex: "#1D4ED8", var: "--color-primary-hover", light: false },
      ],
    },
    {
      title: "Backgrounds",
      items: [
        { name: "Background", hex: "#F8FAFC", var: "--color-bg", light: true },
        { name: "Surface", hex: "#FFFFFF", var: "--color-surface", light: true },
        { name: "Surface Secondary", hex: "#F1F5F9", var: "--color-surface-secondary", light: true },
      ],
    },
    {
      title: "Typography",
      items: [
        { name: "Text", hex: "#0F172A", var: "--color-text", light: false },
        { name: "Text Secondary", hex: "#475569", var: "--color-text-secondary", light: false },
        { name: "Text Muted", hex: "#94A3B8", var: "--color-text-muted", light: false },
      ],
    },
    {
      title: "Structure",
      items: [
        { name: "Border", hex: "#E2E8F0", var: "--color-border", light: true },
      ],
    },
    {
      title: "Semantic",
      items: [
        { name: "Success", hex: "#16A34A", var: "--color-success", light: false },
        { name: "Warning", hex: "#D97706", var: "--color-warning", light: false },
        { name: "Danger", hex: "#DC2626", var: "--color-danger", light: false },
        { name: "Info", hex: "#0284C7", var: "--color-info", light: false },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {groups.map((g) => (
        <div key={g.title}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", marginBottom: 12 }}>{g.title}</p>
          <div className="flex flex-wrap gap-3">
            {g.items.map((c) => (
              <div key={c.name} className="flex flex-col" style={{ width: 160 }}>
                <div
                  style={{
                    backgroundColor: c.hex,
                    height: 72,
                    borderRadius: 8,
                    border: c.light ? "1px solid #E2E8F0" : "none",
                    marginBottom: 8,
                  }}
                />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", lineHeight: "18px" }}>{c.name}</span>
                <TokenLabel>{c.hex}</TokenLabel>
                <TokenLabel>{c.var}</TokenLabel>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── 02 Typography ──────────────────────────────────────────────────────────
function TypographySection() {
  return (
    <div className="space-y-0 divide-y divide-[#E2E8F0]">
      {tokens.typography.map((t) => (
        <div key={t.name} className="py-5 flex items-start gap-8">
          <div style={{ width: 160, flexShrink: 0, paddingTop: 4 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{t.name}</p>
            <TokenLabel>{t.size}px · {t.weight} · {t.lh}px lh</TokenLabel>
          </div>
          <p style={{ fontSize: t.size, fontWeight: t.weight, lineHeight: `${t.lh}px`, color: "#0F172A", flex: 1 }}>
            {t.sample}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── 03 Spacing ─────────────────────────────────────────────────────────────
function SpacingSection() {
  return (
    <div className="space-y-3">
      {tokens.spacing.map((s) => (
        <div key={s} className="flex items-center gap-4">
          <div style={{ width: 120, flexShrink: 0 }}>
            <TokenLabel>Spacing / {s}</TokenLabel>
          </div>
          <div style={{ width: s, height: 20, backgroundColor: "#2563EB", borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "#94A3B8" }}>{s}px</span>
        </div>
      ))}
    </div>
  );
}

// ─── 04 Border Radius ───────────────────────────────────────────────────────
function RadiusSection() {
  return (
    <div className="flex flex-wrap gap-8">
      {tokens.radii.map((r) => (
        <div key={r.px} className="flex flex-col items-center gap-3">
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: r.px,
              backgroundColor: "#F1F5F9",
              border: "1px solid #E2E8F0",
            }}
          />
          <div className="text-center">
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>Radius / {r.px}</p>
            <TokenLabel>{r.px}px</TokenLabel>
            <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{r.usage}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── 05 Shadows ─────────────────────────────────────────────────────────────
function ShadowsSection() {
  const shadows = [
    { name: "Shadow / Small", css: "0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)" },
    { name: "Shadow / Medium", css: "0 4px 8px -2px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.05)" },
    { name: "Shadow / Large", css: "0 12px 24px -4px rgba(0,0,0,0.10), 0 4px 8px -4px rgba(0,0,0,0.06)" },
  ];
  return (
    <div className="flex flex-wrap gap-10">
      {shadows.map((s) => (
        <div key={s.name} className="flex flex-col gap-4">
          <div
            style={{
              width: 160,
              height: 100,
              backgroundColor: "#FFFFFF",
              borderRadius: 10,
              boxShadow: s.css,
            }}
          />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{s.name}</p>
            <TokenLabel>{s.css}</TokenLabel>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── 06 Icons ───────────────────────────────────────────────────────────────
function IconsSection() {
  const icons = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Voters", icon: Users },
    { label: "Members", icon: UserCheck },
    { label: "Workers", icon: HardHat },
    { label: "BLO", icon: Building2 },
    { label: "Booths", icon: Tent },
    { label: "Forms", icon: FileText },
    { label: "Campaigns", icon: Megaphone },
    { label: "AI Mode", icon: Bot },
    { label: "Reports", icon: BarChart2 },
    { label: "Filters", icon: Filter },
    { label: "Import / Export", icon: Upload },
    { label: "Activities", icon: Activity },
    { label: "Organization", icon: Network },
    { label: "Settings", icon: Settings },
    { label: "Search", icon: Search },
    { label: "Notifications", icon: Bell },
    { label: "User", icon: User },
  ];
  return (
    <div className="flex flex-wrap gap-4">
      {icons.map(({ label, icon: Icon }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-2 p-4"
          style={{
            width: 96,
            backgroundColor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: 10,
          }}
        >
          <Icon size={22} color="#475569" strokeWidth={1.75} />
          <TokenLabel>{label}</TokenLabel>
        </div>
      ))}
    </div>
  );
}

// ─── 07 Grid & Layout ───────────────────────────────────────────────────────
function GridSection() {
  const breakpoints = [
    { label: "Desktop", width: "1440px", note: "Full sidebar + content" },
    { label: "Laptop", width: "1280px", note: "Compact sidebar" },
    { label: "Tablet", width: "768px", note: "Collapsed sidebar" },
    { label: "Mobile", width: "390px", note: "Bottom nav" },
  ];
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-4">
        {breakpoints.map((b) => (
          <div
            key={b.label}
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: 10,
              padding: "16px 20px",
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{b.label}</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#2563EB", margin: "4px 0" }}>{b.width}</p>
            <p style={{ fontSize: 12, color: "#94A3B8" }}>{b.note}</p>
          </div>
        ))}
      </div>
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 10,
          padding: "20px 24px",
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 16 }}>Desktop Application Shell</p>
        <div className="flex gap-0" style={{ height: 180, borderRadius: 8, overflow: "hidden", border: "1px solid #E2E8F0" }}>
          <div style={{ width: 250, backgroundColor: "#0F172A", display: "flex", flexDirection: "column", padding: 16, gap: 8, flexShrink: 0 }}>
            <div style={{ height: 32, borderRadius: 6, backgroundColor: "#1E293B", marginBottom: 4 }} />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ height: 22, borderRadius: 4, backgroundColor: i === 1 ? "#2563EB" : "#1E293B" }} />
            ))}
            <span style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>240–260px sidebar</span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ height: 68, backgroundColor: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "0 24px", display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "#94A3B8" }}>64–72px header</span>
            </div>
            <div style={{ flex: 1, backgroundColor: "#F8FAFC", padding: 24 }}>
              <span style={{ fontSize: 10, color: "#94A3B8" }}>Content area · 24–32px padding · 8px spacing rhythm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 08 Components ──────────────────────────────────────────────────────────

// Button
function Btn({ variant = "primary", size = "md", disabled = false, loading = false, children }: {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md";
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}) {
  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    fontFamily: "'Inter', sans-serif", fontWeight: 500,
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none", outline: "none", transition: "background 0.15s",
    borderRadius: 8, whiteSpace: "nowrap",
    fontSize: size === "sm" ? 13 : 14,
    padding: size === "sm" ? "5px 12px" : "8px 16px",
    opacity: disabled ? 0.45 : 1,
  };
  const styles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: "#2563EB", color: "#FFFFFF" },
    secondary: { backgroundColor: "#F1F5F9", color: "#0F172A" },
    outline: { backgroundColor: "transparent", color: "#2563EB", border: "1px solid #2563EB" },
    ghost: { backgroundColor: "transparent", color: "#475569" },
    danger: { backgroundColor: "#DC2626", color: "#FFFFFF" },
  };
  return (
    <button style={{ ...base, ...styles[variant] }}>
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}

// Badge
function Bdg({ variant, children }: { variant: "success" | "warning" | "danger" | "info" | "neutral"; children: React.ReactNode }) {
  const map: Record<string, { bg: string; color: string }> = {
    success: { bg: "#DCFCE7", color: "#15803D" },
    warning: { bg: "#FEF3C7", color: "#B45309" },
    danger: { bg: "#FEE2E2", color: "#B91C1C" },
    info: { bg: "#DBEAFE", color: "#1D4ED8" },
    neutral: { bg: "#F1F5F9", color: "#475569" },
  };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 8px", borderRadius: 99,
      fontSize: 12, fontWeight: 500, lineHeight: "18px",
      backgroundColor: map[variant].bg, color: map[variant].color,
    }}>
      {children}
    </span>
  );
}

// Input
function Inp({ state = "default", label = "Label", placeholder = "Enter value", helper = "", error = "" }: {
  state?: "default" | "focus" | "filled" | "error" | "disabled";
  label?: string; placeholder?: string; helper?: string; error?: string;
}) {
  const borderColor = state === "error" ? "#DC2626" : state === "focus" ? "#2563EB" : "#E2E8F0";
  const ring = state === "focus" ? "0 0 0 3px rgba(37,99,235,0.15)" : "none";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 240 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "#0F172A" }}>{label}</label>
      <input
        disabled={state === "disabled"}
        placeholder={placeholder}
        defaultValue={state === "filled" ? "Filled value" : ""}
        style={{
          padding: "8px 12px", borderRadius: 8, fontSize: 14,
          border: `1px solid ${borderColor}`,
          boxShadow: ring,
          backgroundColor: state === "disabled" ? "#F8FAFC" : "#FFFFFF",
          color: "#0F172A", fontFamily: "'Inter', sans-serif",
          outline: "none",
        }}
      />
      {state === "error" && error && <span style={{ fontSize: 12, color: "#DC2626" }}>{error}</span>}
      {state !== "error" && helper && <span style={{ fontSize: 12, color: "#94A3B8" }}>{helper}</span>}
    </div>
  );
}

// Search Input
function SearchInp() {
  return (
    <div style={{ position: "relative", width: 260 }}>
      <Search size={15} color="#94A3B8" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
      <input
        placeholder="Search voters, districts..."
        style={{
          width: "100%", padding: "8px 12px 8px 32px", borderRadius: 8,
          fontSize: 14, border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC",
          fontFamily: "'Inter', sans-serif", color: "#0F172A", outline: "none",
        }}
      />
    </div>
  );
}

// Checkbox, Radio, Switch
function CheckRow({ label, checked }: { label: string; checked: boolean }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
      <div style={{
        width: 16, height: 16, borderRadius: 4,
        border: checked ? "none" : "1px solid #CBD5E1",
        backgroundColor: checked ? "#2563EB" : "#FFFFFF",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {checked && <Check size={10} color="#fff" strokeWidth={3} />}
      </div>
      <span style={{ fontSize: 14, color: "#0F172A" }}>{label}</span>
    </label>
  );
}
function RadioRow({ label, checked }: { label: string; checked: boolean }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
      <div style={{
        width: 16, height: 16, borderRadius: 99,
        border: checked ? "5px solid #2563EB" : "1px solid #CBD5E1",
        backgroundColor: "#FFFFFF",
      }} />
      <span style={{ fontSize: 14, color: "#0F172A" }}>{label}</span>
    </label>
  );
}
function SwitchRow({ label, on }: { label: string; on: boolean }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      <div style={{
        width: 36, height: 20, borderRadius: 99,
        backgroundColor: on ? "#2563EB" : "#CBD5E1",
        position: "relative", transition: "background 0.2s",
      }}>
        <div style={{
          width: 14, height: 14, borderRadius: 99,
          backgroundColor: "#FFFFFF",
          position: "absolute", top: 3,
          left: on ? 19 : 3, transition: "left 0.2s",
        }} />
      </div>
      <span style={{ fontSize: 14, color: "#0F172A" }}>{label}</span>
    </label>
  );
}

// Avatar
function Av({ initials, size = 36, color = "#2563EB" }: { initials: string; size?: number; color?: string }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 99,
      backgroundColor: color + "22", color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 600,
    }}>
      {initials}
    </div>
  );
}

// Card
function CardDemo() {
  return (
    <div style={{
      backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0",
      borderRadius: 10, padding: "20px 24px", width: 280,
      boxShadow: "0 1px 3px 0 rgba(0,0,0,0.07)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4 }}>Total Voters</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: "#0F172A" }}>245,310</p>
        </div>
        <div style={{ padding: 8, backgroundColor: "#EFF6FF", borderRadius: 8 }}>
          <Users size={18} color="#2563EB" />
        </div>
      </div>
      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 4 }}>
        <ArrowUpRight size={14} color="#16A34A" />
        <span style={{ fontSize: 13, fontWeight: 500, color: "#16A34A" }}>+4.2%</span>
        <span style={{ fontSize: 13, color: "#94A3B8" }}>vs last cycle</span>
      </div>
    </div>
  );
}

// Stat Card
function StatCardDemo() {
  const stats = [
    { label: "Registered Voters", value: "2,45,310", change: "+4.2%", up: true, icon: Users },
    { label: "Active Booths", value: "1,842", change: "+12", up: true, icon: Tent },
    { label: "Pending Approvals", value: "384", change: "-22", up: false, icon: FileText },
    { label: "Field Workers", value: "5,120", change: "+0.8%", up: true, icon: HardHat },
  ];
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} style={{
            backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0",
            borderRadius: 10, padding: "16px 20px",
            boxShadow: "0 1px 3px 0 rgba(0,0,0,0.06)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>{s.label}</span>
              <Icon size={16} color="#94A3B8" />
            </div>
            <p style={{ fontSize: 22, fontWeight: 700, color: "#0F172A" }}>{s.value}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 4 }}>
              {s.up ? <ArrowUpRight size={12} color="#16A34A" /> : <ArrowDownRight size={12} color="#DC2626" />}
              <span style={{ fontSize: 12, fontWeight: 500, color: s.up ? "#16A34A" : "#DC2626" }}>{s.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Tabs
function TabsDemo() {
  const [active, setActive] = useState("voters");
  const tabs = [
    { id: "voters", label: "Voters" },
    { id: "booths", label: "Booths" },
    { id: "workers", label: "Workers" },
    { id: "reports", label: "Reports" },
  ];
  return (
    <div>
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #E2E8F0" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            style={{
              padding: "8px 16px", fontSize: 14, fontWeight: active === t.id ? 600 : 400,
              color: active === t.id ? "#2563EB" : "#475569",
              borderBottom: active === t.id ? "2px solid #2563EB" : "2px solid transparent",
              background: "none", border: "none", cursor: "pointer",
              marginBottom: -1,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ padding: "12px 0", fontSize: 14, color: "#94A3B8" }}>
        Active tab: <strong style={{ color: "#0F172A" }}>{tabs.find((t) => t.id === active)?.label}</strong>
      </div>
    </div>
  );
}

// Dropdown
function DropdownDemo() {
  const [open, setOpen] = useState(false);
  const options = ["All Districts", "North District", "South District", "East District", "West District"];
  const [selected, setSelected] = useState("All Districts");
  return (
    <div style={{ position: "relative", width: 200 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "8px 12px", borderRadius: 8, border: "1px solid #E2E8F0",
          backgroundColor: "#FFFFFF", cursor: "pointer", fontFamily: "'Inter', sans-serif",
          fontSize: 14, color: "#0F172A",
        }}
      >
        {selected}
        <ChevronDown size={14} color="#94A3B8" />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0",
          borderRadius: 8, boxShadow: "0 4px 8px -2px rgba(0,0,0,0.08)",
          zIndex: 10, overflow: "hidden",
        }}>
          {options.map((o) => (
            <button
              key={o}
              onClick={() => { setSelected(o); setOpen(false); }}
              style={{
                width: "100%", textAlign: "left", padding: "8px 12px",
                fontSize: 14, color: selected === o ? "#2563EB" : "#0F172A",
                backgroundColor: selected === o ? "#EFF6FF" : "transparent",
                border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif",
              }}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Modal
function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Btn variant="outline" onClick={() => setOpen(true)}>Open Modal</Btn>
      {open && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
        }}>
          <div style={{
            backgroundColor: "#FFFFFF", borderRadius: 12, width: 440,
            boxShadow: "0 12px 24px -4px rgba(0,0,0,0.12)",
            padding: 24,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0F172A" }}>Confirm Action</h3>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} color="#94A3B8" />
              </button>
            </div>
            <p style={{ fontSize: 14, color: "#475569", marginBottom: 20 }}>
              Are you sure you want to approve this voter registration? This action cannot be undone.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Btn variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
              <Btn variant="primary" onClick={() => setOpen(false)}>Confirm</Btn>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Drawer
function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Btn variant="outline" onClick={() => setOpen(true)}>Open Drawer</Btn>
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex" }}>
          <div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.25)" }} onClick={() => setOpen(false)} />
          <div style={{
            width: 360, backgroundColor: "#FFFFFF",
            boxShadow: "-8px 0 24px rgba(0,0,0,0.08)",
            display: "flex", flexDirection: "column",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #E2E8F0" }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#0F172A" }}>Voter Details</p>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} color="#94A3B8" />
              </button>
            </div>
            <div style={{ padding: 24, flex: 1, fontSize: 14, color: "#475569" }}>
              Drawer content goes here — voter profile, filters, or detail panels.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Tooltip
function TooltipDemo() {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <Btn variant="ghost" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
        Hover for tooltip
      </Btn>
      {show && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#0F172A", color: "#FFFFFF",
          fontSize: 12, padding: "5px 10px", borderRadius: 6, whiteSpace: "nowrap",
          boxShadow: "0 4px 8px rgba(0,0,0,0.12)",
          pointerEvents: "none",
        }}>
          VTR-2024-00142 — Ward 7
        </div>
      )}
    </div>
  );
}

// Toast
function ToastDemo() {
  const toasts = [
    { variant: "success", icon: Check, msg: "Voter registration approved successfully." },
    { variant: "warning", icon: AlertTriangle, msg: "Duplicate entry detected. Review required." },
    { variant: "danger", icon: X, msg: "Failed to sync booth data. Retry." },
    { variant: "info", icon: Info, msg: "New election cycle scheduled for Q4 2024." },
  ] as const;
  const map = {
    success: { bg: "#F0FDF4", border: "#86EFAC", icon: "#16A34A" },
    warning: { bg: "#FFFBEB", border: "#FCD34D", icon: "#D97706" },
    danger: { bg: "#FEF2F2", border: "#FCA5A5", icon: "#DC2626" },
    info: { bg: "#EFF6FF", border: "#BFDBFE", icon: "#0284C7" },
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((t) => {
        const Icon = t.icon;
        const m = map[t.variant];
        return (
          <div key={t.msg} style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            padding: "10px 14px", borderRadius: 8,
            backgroundColor: m.bg, border: `1px solid ${m.border}`,
            maxWidth: 400,
          }}>
            <Icon size={15} color={m.icon} style={{ marginTop: 1, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#0F172A" }}>{t.msg}</span>
          </div>
        );
      })}
    </div>
  );
}

// Alert
function AlertDemo() {
  return (
    <div style={{
      padding: "14px 16px", borderRadius: 8,
      backgroundColor: "#FEF3C7", border: "1px solid #FCD34D",
      display: "flex", gap: 10, maxWidth: 500,
    }}>
      <AlertTriangle size={16} color="#D97706" style={{ marginTop: 1, flexShrink: 0 }} />
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#92400E", marginBottom: 2 }}>Voter data sync pending</p>
        <p style={{ fontSize: 13, color: "#92400E" }}>
          3 districts have not synced in over 24 hours. Check connectivity or trigger a manual sync.
        </p>
      </div>
    </div>
  );
}

// Pagination
function PaginationDemo() {
  const [page, setPage] = useState(3);
  const pages = [1, 2, 3, 4, 5];
  const btnStyle = (active: boolean): React.CSSProperties => ({
    width: 32, height: 32, borderRadius: 6,
    border: active ? "none" : "1px solid #E2E8F0",
    backgroundColor: active ? "#2563EB" : "#FFFFFF",
    color: active ? "#FFFFFF" : "#475569",
    fontSize: 13, fontWeight: active ? 600 : 400,
    cursor: "pointer", fontFamily: "'Inter', sans-serif",
    display: "flex", alignItems: "center", justifyContent: "center",
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <button style={btnStyle(false)} onClick={() => setPage(Math.max(1, page - 1))}>‹</button>
      {pages.map((p) => (
        <button key={p} style={btnStyle(p === page)} onClick={() => setPage(p)}>{p}</button>
      ))}
      <button style={btnStyle(false)} onClick={() => setPage(Math.min(5, page + 1))}>›</button>
      <span style={{ fontSize: 13, color: "#94A3B8", marginLeft: 8 }}>of 248 pages</span>
    </div>
  );
}

// Filter Chip
function FilterChipDemo() {
  const [chips, setChips] = useState(["Active", "North District", "Ward 7"]);
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {chips.map((c) => (
        <div key={c} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "4px 10px", borderRadius: 99,
          backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE",
          fontSize: 13, color: "#2563EB",
        }}>
          {c}
          <button
            onClick={() => setChips(chips.filter((x) => x !== c))}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
          >
            <X size={12} color="#2563EB" />
          </button>
        </div>
      ))}
      {chips.length === 0 && <span style={{ fontSize: 13, color: "#94A3B8" }}>No active filters</span>}
    </div>
  );
}

// Table
function TableDemo() {
  const rows = [
    { id: "VTR-001", name: "Aarav Mehta", ward: "Ward 3", district: "North", status: "active" as const },
    { id: "VTR-002", name: "Priya Sharma", ward: "Ward 7", district: "South", status: "pending" as const },
    { id: "VTR-003", name: "Ravi Kumar", ward: "Ward 1", district: "East", status: "rejected" as const },
    { id: "VTR-004", name: "Sunita Patel", ward: "Ward 5", district: "West", status: "active" as const },
  ];
  const statusMap: Record<string, { variant: "success" | "warning" | "danger"; label: string }> = {
    active: { variant: "success", label: "Active" },
    pending: { variant: "warning", label: "Pending" },
    rejected: { variant: "danger", label: "Rejected" },
  };
  const [checked, setChecked] = useState<string[]>([]);
  const toggle = (id: string) => setChecked((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  return (
    <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 10, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
            <th style={{ padding: "10px 16px", width: 40 }}>
              <div style={{
                width: 16, height: 16, borderRadius: 4,
                border: "1px solid #CBD5E1", backgroundColor: "#FFFFFF",
              }} />
            </th>
            {["Voter ID", "Name", "Ward", "District", "Status", "Actions"].map((h) => (
              <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#475569", fontSize: 12, letterSpacing: "0.04em" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.id}
              style={{
                borderBottom: i < rows.length - 1 ? "1px solid #F1F5F9" : "none",
                backgroundColor: checked.includes(r.id) ? "#EFF6FF" : "transparent",
              }}
            >
              <td style={{ padding: "12px 16px" }}>
                <div
                  onClick={() => toggle(r.id)}
                  style={{
                    width: 16, height: 16, borderRadius: 4, cursor: "pointer",
                    border: checked.includes(r.id) ? "none" : "1px solid #CBD5E1",
                    backgroundColor: checked.includes(r.id) ? "#2563EB" : "#FFFFFF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {checked.includes(r.id) && <Check size={10} color="#fff" strokeWidth={3} />}
                </div>
              </td>
              <td style={{ padding: "12px 16px" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#94A3B8" }}>{r.id}</span>
              </td>
              <td style={{ padding: "12px 16px", color: "#0F172A", fontWeight: 500 }}>{r.name}</td>
              <td style={{ padding: "12px 16px", color: "#475569" }}>{r.ward}</td>
              <td style={{ padding: "12px 16px", color: "#475569" }}>{r.district}</td>
              <td style={{ padding: "12px 16px" }}>
                <Bdg variant={statusMap[r.status].variant}>{statusMap[r.status].label}</Bdg>
              </td>
              <td style={{ padding: "12px 16px" }}>
                <div style={{ display: "flex", gap: 4 }}>
                  <button style={{ padding: 4, background: "none", border: "none", cursor: "pointer", borderRadius: 4 }}>
                    <Eye size={15} color="#94A3B8" />
                  </button>
                  <button style={{ padding: 4, background: "none", border: "none", cursor: "pointer", borderRadius: 4 }}>
                    <Edit size={15} color="#94A3B8" />
                  </button>
                  <button style={{ padding: 4, background: "none", border: "none", cursor: "pointer", borderRadius: 4 }}>
                    <Trash2 size={15} color="#94A3B8" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Empty, Loading, Error States
function EmptyState() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "48px 24px", backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0",
      borderRadius: 10, textAlign: "center",
    }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <FileText size={22} color="#94A3B8" />
      </div>
      <p style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>No voters found</p>
      <p style={{ fontSize: 13, color: "#94A3B8", maxWidth: 260, marginBottom: 16 }}>
        No records match your current filters. Try adjusting the search criteria.
      </p>
      <Btn variant="outline" size="sm"><Plus size={13} /> Add Voter</Btn>
    </div>
  );
}
function LoadingState() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "48px 24px", backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0",
      borderRadius: 10, textAlign: "center", gap: 12,
    }}>
      <Loader2 size={28} color="#2563EB" className="animate-spin" />
      <p style={{ fontSize: 14, color: "#475569" }}>Loading voter records…</p>
    </div>
  );
}
function ErrorState() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "48px 24px", backgroundColor: "#FFFFFF", border: "1px solid #FCA5A5",
      borderRadius: 10, textAlign: "center",
    }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <X size={22} color="#DC2626" />
      </div>
      <p style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>Failed to load data</p>
      <p style={{ fontSize: 13, color: "#94A3B8", maxWidth: 280, marginBottom: 16 }}>
        An error occurred while fetching voter records. Check your connection and retry.
      </p>
      <Btn variant="danger" size="sm">Retry</Btn>
    </div>
  );
}

// Select
function SelectDemo() {
  return (
    <div style={{ position: "relative", width: 200 }}>
      <select style={{
        width: "100%", padding: "8px 32px 8px 12px",
        borderRadius: 8, border: "1px solid #E2E8F0",
        backgroundColor: "#FFFFFF", fontSize: 14,
        fontFamily: "'Inter', sans-serif", color: "#0F172A",
        appearance: "none", cursor: "pointer", outline: "none",
      }}>
        <option>All Statuses</option>
        <option>Active</option>
        <option>Pending</option>
        <option>Rejected</option>
      </select>
      <ChevronDown size={14} color="#94A3B8" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
    </div>
  );
}

// ─── Component Section Wrapper ───────────────────────────────────────────────
function CompBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", marginBottom: 16 }}>{title}</p>
      <div style={{ padding: "24px", backgroundColor: "#FAFBFC", border: "1px solid #E2E8F0", borderRadius: 10 }}>
        {children}
      </div>
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "colors", label: "01 Colors" },
  { id: "typography", label: "02 Typography" },
  { id: "spacing", label: "03 Spacing" },
  { id: "radius", label: "04 Border Radius" },
  { id: "shadows", label: "05 Shadows" },
  { id: "icons", label: "06 Icons" },
  { id: "grid", label: "07 Grid & Layout" },
  { id: "components", label: "08 Components" },
];

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeNav, setActiveNav] = useState("colors");

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveNav(id);
  };

  return (
    <div style={{ display: "flex", minHeight: "100%", backgroundColor: "#F8FAFC", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar Nav */}
      <aside style={{
        width: 240, flexShrink: 0,
        position: "sticky", top: 0, height: "100vh",
        backgroundColor: "#FFFFFF", borderRight: "1px solid #E2E8F0",
        display: "flex", flexDirection: "column",
        padding: "28px 0",
        overflowY: "auto",
      }}>
        <div style={{ padding: "0 20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LayoutDashboard size={14} color="#ffffff" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>EMP Design System</span>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#94A3B8" }}>v1.0 · 2024</span>
        </div>
        <nav style={{ padding: "0 8px", flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              style={{
                width: "100%", textAlign: "left", padding: "8px 12px",
                borderRadius: 6, border: "none", cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13, fontWeight: activeNav === item.id ? 600 : 400,
                color: activeNav === item.id ? "#2563EB" : "#475569",
                backgroundColor: activeNav === item.id ? "#EFF6FF" : "transparent",
                marginBottom: 2,
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: "48px 64px", maxWidth: 1100, overflowY: "auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, fontWeight: 500, color: "#2563EB",
              backgroundColor: "#EFF6FF", padding: "3px 10px", borderRadius: 99,
              letterSpacing: "0.06em",
            }}>04 — Design System</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 700, lineHeight: "44px", color: "#0F172A", marginBottom: 12 }}>
            Election Management Platform
          </h1>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: "24px", maxWidth: 600 }}>
            A systematic foundation of reusable tokens, components, and patterns for building consistent, accessible enterprise election management interfaces.
          </p>
          <div style={{ display: "flex", gap: 24, marginTop: 24, paddingTop: 24, borderTop: "1px solid #E2E8F0" }}>
            {[
              { label: "Version", value: "1.0" },
              { label: "Font", value: "Inter" },
              { label: "Base unit", value: "8px" },
              { label: "Breakpoints", value: "390 / 768 / 1280 / 1440" },
            ].map((m) => (
              <div key={m.label}>
                <p style={{ fontSize: 11, color: "#94A3B8", marginBottom: 2 }}>{m.label}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", fontFamily: "'JetBrains Mono', monospace" }}>{m.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 01 Colors */}
        <Section id="colors" label="01" title="Colors">
          <ColorsSection />
        </Section>

        {/* 02 Typography */}
        <Section id="typography" label="02" title="Typography">
          <TypographySection />
        </Section>

        {/* 03 Spacing */}
        <Section id="spacing" label="03" title="Spacing">
          <SpacingSection />
        </Section>

        {/* 04 Border Radius */}
        <Section id="radius" label="04" title="Border Radius">
          <RadiusSection />
        </Section>

        {/* 05 Shadows */}
        <Section id="shadows" label="05" title="Shadows">
          <ShadowsSection />
        </Section>

        {/* 06 Icons */}
        <Section id="icons" label="06" title="Icons">
          <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20 }}>
            Lucide Icons · 22px · strokeWidth 1.75 · consistent across all modules
          </p>
          <IconsSection />
        </Section>

        {/* 07 Grid & Layout */}
        <Section id="grid" label="07" title="Grid &amp; Layout">
          <GridSection />
        </Section>

        {/* 08 Components */}
        <Section id="components" label="08" title="Components">

          {/* Buttons */}
          <CompBlock title="Button — Variants">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <Btn variant="primary">Primary</Btn>
              <Btn variant="secondary">Secondary</Btn>
              <Btn variant="outline">Outline</Btn>
              <Btn variant="ghost">Ghost</Btn>
              <Btn variant="danger">Danger</Btn>
            </div>
          </CompBlock>

          <CompBlock title="Button — States">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <Btn variant="primary">Default</Btn>
              <Btn variant="primary" disabled>Disabled</Btn>
              <Btn variant="primary" loading>Loading</Btn>
              <Btn variant="primary" size="sm">Small</Btn>
            </div>
          </CompBlock>

          {/* Input */}
          <CompBlock title="Input — States">
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <Inp state="default" label="Default" helper="Voter ID or full name" />
              <Inp state="focus" label="Focus" />
              <Inp state="filled" label="Filled" />
              <Inp state="error" label="Error" error="This field is required" />
              <Inp state="disabled" label="Disabled" />
            </div>
          </CompBlock>

          <CompBlock title="Search Input">
            <SearchInp />
          </CompBlock>

          {/* Select */}
          <CompBlock title="Select">
            <SelectDemo />
          </CompBlock>

          {/* Checkbox / Radio / Switch */}
          <CompBlock title="Checkbox">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <CheckRow label="Active voters" checked={true} />
              <CheckRow label="Pending verification" checked={false} />
              <CheckRow label="Include deleted" checked={false} />
            </div>
          </CompBlock>

          <CompBlock title="Radio">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <RadioRow label="All Districts" checked={true} />
              <RadioRow label="North District" checked={false} />
              <RadioRow label="South District" checked={false} />
            </div>
          </CompBlock>

          <CompBlock title="Switch">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <SwitchRow label="Enable AI Mode" on={true} />
              <SwitchRow label="Auto-sync voter data" on={false} />
              <SwitchRow label="Show archived records" on={true} />
            </div>
          </CompBlock>

          {/* Badge */}
          <CompBlock title="Badge — Semantic Variants">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Bdg variant="success">Active</Bdg>
              <Bdg variant="warning">Pending</Bdg>
              <Bdg variant="danger">Rejected</Bdg>
              <Bdg variant="info">Scheduled</Bdg>
              <Bdg variant="neutral">Draft</Bdg>
              <Bdg variant="success">Approved</Bdg>
              <Bdg variant="danger">Failed</Bdg>
              <Bdg variant="neutral">Inactive</Bdg>
              <Bdg variant="success">Completed</Bdg>
            </div>
          </CompBlock>

          {/* Avatar */}
          <CompBlock title="Avatar">
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Av initials="AM" size={40} color="#2563EB" />
              <Av initials="PS" size={40} color="#0284C7" />
              <Av initials="RK" size={40} color="#16A34A" />
              <Av initials="SP" size={32} color="#D97706" />
              <Av initials="VT" size={28} color="#94A3B8" />
              <Av initials="EL" size={48} color="#0F172A" />
            </div>
          </CompBlock>

          {/* Card */}
          <CompBlock title="Card">
            <CardDemo />
          </CompBlock>

          {/* Stat Card */}
          <CompBlock title="Stat Card">
            <StatCardDemo />
          </CompBlock>

          {/* Tabs */}
          <CompBlock title="Tabs">
            <TabsDemo />
          </CompBlock>

          {/* Dropdown */}
          <CompBlock title="Dropdown">
            <DropdownDemo />
          </CompBlock>

          {/* Modal */}
          <CompBlock title="Modal">
            <ModalDemo />
          </CompBlock>

          {/* Drawer */}
          <CompBlock title="Drawer">
            <DrawerDemo />
          </CompBlock>

          {/* Tooltip */}
          <CompBlock title="Tooltip">
            <TooltipDemo />
          </CompBlock>

          {/* Toast */}
          <CompBlock title="Toast / Notification">
            <ToastDemo />
          </CompBlock>

          {/* Alert */}
          <CompBlock title="Alert">
            <AlertDemo />
          </CompBlock>

          {/* Filter Chip */}
          <CompBlock title="Filter Chip">
            <FilterChipDemo />
          </CompBlock>

          {/* Pagination */}
          <CompBlock title="Pagination">
            <PaginationDemo />
          </CompBlock>

          {/* Table */}
          <CompBlock title="Table">
            <TableDemo />
          </CompBlock>

          {/* Empty / Loading / Error */}
          <CompBlock title="Empty State">
            <EmptyState />
          </CompBlock>

          <CompBlock title="Loading State">
            <LoadingState />
          </CompBlock>

          <CompBlock title="Error State">
            <ErrorState />
          </CompBlock>

        </Section>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: 32, marginTop: 8, paddingBottom: 48 }}>
          <p style={{ fontSize: 12, color: "#94A3B8" }}>
            Election Management Platform — Design System v1.0 · Built with Inter · Tokens, components, and patterns for enterprise election management.
          </p>
        </div>
      </main>
    </div>
  );
}

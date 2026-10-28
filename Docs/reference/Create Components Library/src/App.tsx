import { useState } from "react";

// ─── Design Tokens (mirrors CSS vars) ───────────────────────────────────────
const T = {
  bg: "#0D1117",
  surface: "#161B22",
  elevated: "#21262D",
  hover: "#2D333B",
  text: "#E6EDF3",
  secondary: "#8B949E",
  muted: "#484F58",
  brand: "#2563EB",
  brandHover: "#1D4ED8",
  border: "#30363D",
  borderStrong: "#484F58",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
  pending: "#A855F7",
};

// ─── Icons (inline SVG) ──────────────────────────────────────────────────────
const Icon = {
  Search: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  Upload: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  Warning: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Info: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  Loader: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  ),
  Trend: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  Users: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Vote: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  AI: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M12 2v2M4.93 4.93l1.41 1.41M2 12h2m15 0h2M4.93 19.07l1.41-1.41M12 22v-2m7.07 1.07-1.41-1.41"/>
    </svg>
  ),
  Zap: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
};

// ─── Shared helpers ──────────────────────────────────────────────────────────
const cx = (...classes: (string | false | undefined | null)[]) =>
  classes.filter(Boolean).join(" ");

// ─── Label wrapper ────────────────────────────────────────────────────────────
const CompLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    letterSpacing: "0.08em",
    color: T.muted,
    textTransform: "uppercase",
    marginBottom: "8px",
  }}>{children}</div>
);

const SectionTitle = ({ num, title }: { num: string; title: string }) => (
  <div style={{ marginBottom: "32px", paddingBottom: "16px", borderBottom: `1px solid ${T.border}` }}>
    <div style={{
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      color: T.muted,
      letterSpacing: "0.1em",
      marginBottom: "6px",
    }}>{num}</div>
    <h2 style={{
      fontFamily: "var(--font-display)",
      fontSize: "28px",
      fontWeight: "600",
      color: T.text,
      margin: 0,
    }}>{title}</h2>
  </div>
);

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: "40px" }}>
    <div style={{
      fontSize: "11px",
      fontFamily: "var(--font-mono)",
      color: T.muted,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      marginBottom: "16px",
      paddingBottom: "8px",
      borderBottom: `1px solid ${T.border}`,
    }}>{title}</div>
    {children}
  </div>
);

const Row = ({ children, gap = 12, wrap = true }: { children: React.ReactNode; gap?: number; wrap?: boolean }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap, flexWrap: wrap ? "wrap" : "nowrap" }}>
    {children}
  </div>
);

const Col = ({ children, gap = 12 }: { children: React.ReactNode; gap?: number }) => (
  <div style={{ display: "flex", flexDirection: "column", gap }}>
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── 01 BUTTON ───────────────────────────────────────────────────────────────
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: T.brand, color: "#fff", border: `1px solid ${T.brand}` },
  secondary: { background: T.elevated, color: T.text, border: `1px solid ${T.border}` },
  outline: { background: "transparent", color: T.text, border: `1px solid ${T.borderStrong}` },
  ghost: { background: "transparent", color: T.text, border: "1px solid transparent" },
  danger: { background: T.danger, color: "#fff", border: `1px solid ${T.danger}` },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: "5px 12px", fontSize: "12px", borderRadius: "var(--radius-sm)", height: "28px", gap: "5px" },
  md: { padding: "7px 16px", fontSize: "13px", borderRadius: "var(--radius-md)", height: "34px", gap: "6px" },
  lg: { padding: "10px 20px", fontSize: "14px", borderRadius: "var(--radius-md)", height: "42px", gap: "8px" },
};

function Button({ variant = "primary", size = "md", label = "Button", icon, iconPosition = "left", disabled, loading }: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const style: React.CSSProperties = {
    ...variantStyles[variant],
    ...sizeStyles[size],
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-sans)",
    fontWeight: "500",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: "all 0.15s ease",
    userSelect: "none",
    whiteSpace: "nowrap",
  };
  if (hovered && !disabled) {
    if (variant === "primary") style.background = T.brandHover;
    else if (variant === "secondary") style.background = T.hover;
    else if (variant === "outline") style.background = T.elevated;
    else if (variant === "ghost") style.background = T.elevated;
    else if (variant === "danger") style.background = "#DC2626";
  }
  const ico = loading ? <Icon.Loader /> : icon;
  return (
    <button
      style={style}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {ico && iconPosition === "left" && ico}
      {label}
      {ico && iconPosition === "right" && ico}
    </button>
  );
}

// ─── 02 BADGE ─────────────────────────────────────────────────────────────────
type BadgeVariant =
  | "active" | "inactive" | "pending" | "approved" | "rejected"
  | "draft" | "scheduled" | "completed" | "failed" | "default";

const badgeConfig: Record<BadgeVariant, { bg: string; color: string; dot?: string }> = {
  active:    { bg: "#052E16", color: T.success, dot: T.success },
  inactive:  { bg: "#1C1917", color: T.secondary, dot: T.secondary },
  pending:   { bg: "#2E1065", color: T.pending, dot: T.pending },
  approved:  { bg: "#052E16", color: T.success, dot: T.success },
  rejected:  { bg: "#450A0A", color: T.danger, dot: T.danger },
  draft:     { bg: T.elevated, color: T.secondary, dot: T.muted },
  scheduled: { bg: "#1C1917", color: T.warning, dot: T.warning },
  completed: { bg: "#052E16", color: T.success, dot: T.success },
  failed:    { bg: "#450A0A", color: T.danger, dot: T.danger },
  default:   { bg: T.elevated, color: T.secondary, dot: T.muted },
};

function StatusBadge({ variant = "default", label }: { variant?: BadgeVariant; label?: string }) {
  const cfg = badgeConfig[variant];
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      padding: "3px 8px",
      borderRadius: "var(--radius-sm)",
      background: cfg.bg,
      color: cfg.color,
      fontSize: "11px",
      fontWeight: "500",
      fontFamily: "var(--font-mono)",
      letterSpacing: "0.02em",
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
      {label || variant.charAt(0).toUpperCase() + variant.slice(1)}
    </span>
  );
}

// ─── 02 INPUT ─────────────────────────────────────────────────────────────────
type InputState = "default" | "focus" | "filled" | "error" | "disabled";

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  state?: InputState;
  value?: string;
  type?: string;
}

function InputField({ label = "Label", placeholder = "Placeholder text", helperText, errorText, state = "default", type = "text" }: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const isError = state === "error";
  const isDisabled = state === "disabled";
  const borderColor = isError ? T.danger : focused ? T.brand : T.border;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: "220px" }}>
      {label && <label style={{ fontSize: "12px", fontWeight: "500", color: T.secondary, fontFamily: "var(--font-sans)" }}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        disabled={isDisabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: T.surface,
          border: `1px solid ${borderColor}`,
          borderRadius: "var(--radius-md)",
          padding: "7px 12px",
          fontSize: "13px",
          color: isDisabled ? T.muted : T.text,
          fontFamily: "var(--font-sans)",
          outline: "none",
          transition: "border-color 0.15s",
          cursor: isDisabled ? "not-allowed" : "text",
          opacity: isDisabled ? 0.6 : 1,
          width: "100%",
        }}
      />
      {isError && errorText && <span style={{ fontSize: "11px", color: T.danger }}>{errorText}</span>}
      {!isError && helperText && <span style={{ fontSize: "11px", color: T.secondary }}>{helperText}</span>}
    </div>
  );
}

function SearchInput({ placeholder = "Search..." }: { placeholder?: string }) {
  const [value, setValue] = useState("");
  return (
    <div style={{ position: "relative", minWidth: "240px" }}>
      <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: T.muted, pointerEvents: "none" }}>
        <Icon.Search />
      </span>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: "var(--radius-md)",
          padding: "7px 32px",
          fontSize: "13px",
          color: T.text,
          fontFamily: "var(--font-sans)",
          outline: "none",
          width: "100%",
        }}
      />
      {value && (
        <button
          onClick={() => setValue("")}
          style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: T.muted, cursor: "pointer", padding: "2px", display: "flex" }}
        >
          <Icon.X />
        </button>
      )}
    </div>
  );
}

function SelectField({ label = "Select", options = ["Option 1", "Option 2", "Option 3"] }: { label?: string; options?: string[] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>("");
  return (
    <div style={{ position: "relative", minWidth: "200px" }}>
      {label && <div style={{ fontSize: "12px", fontWeight: "500", color: T.secondary, marginBottom: "5px" }}>{label}</div>}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: T.surface, border: `1px solid ${open ? T.brand : T.border}`,
          borderRadius: "var(--radius-md)", padding: "7px 12px",
          fontSize: "13px", color: selected ? T.text : T.muted,
          fontFamily: "var(--font-sans)", cursor: "pointer", width: "100%",
        }}
      >
        {selected || "Select option"}
        <Icon.ChevronDown />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, marginTop: "4px",
          background: T.elevated, border: `1px solid ${T.border}`,
          borderRadius: "var(--radius-md)", zIndex: 50, overflow: "hidden",
        }}>
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => { setSelected(opt); setOpen(false); }}
              style={{
                padding: "8px 12px", fontSize: "13px", color: T.text, cursor: "pointer",
                background: selected === opt ? T.hover : "transparent",
                transition: "background 0.1s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = T.hover)}
              onMouseLeave={e => (e.currentTarget.style.background = selected === opt ? T.hover : "transparent")}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CheckboxField({ label = "Checkbox option", defaultChecked = false }: { label?: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none" }}>
      <div
        onClick={() => setChecked(!checked)}
        style={{
          width: "16px", height: "16px", borderRadius: "3px", flexShrink: 0,
          border: `2px solid ${checked ? T.brand : T.borderStrong}`,
          background: checked ? T.brand : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
        }}
      >
        {checked && <Icon.Check />}
      </div>
      <span style={{ fontSize: "13px", color: T.text }}>{label}</span>
    </label>
  );
}

function RadioField({ label = "Radio option", name = "radio", checked = false, onChange }: { label?: string; name?: string; checked?: boolean; onChange?: () => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none" }} onClick={onChange}>
      <div style={{
        width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0,
        border: `2px solid ${checked ? T.brand : T.borderStrong}`,
        background: "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {checked && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: T.brand }} />}
      </div>
      <span style={{ fontSize: "13px", color: T.text }}>{label}</span>
    </label>
  );
}

function Switch({ label = "Toggle", defaultOn = false }: { label?: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none" }}>
      <div
        onClick={() => setOn(!on)}
        style={{
          width: "36px", height: "20px", borderRadius: "10px",
          background: on ? T.brand : T.elevated,
          border: `1px solid ${on ? T.brand : T.border}`,
          position: "relative", transition: "all 0.2s", flexShrink: 0,
        }}
      >
        <div style={{
          position: "absolute", top: "2px",
          left: on ? "17px" : "2px",
          width: "14px", height: "14px", borderRadius: "50%", background: "#fff",
          transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }} />
      </div>
      <span style={{ fontSize: "13px", color: T.text }}>{label}</span>
    </label>
  );
}

function TextareaField({ label = "Message", placeholder = "Enter text...", rows = 3 }: { label?: string; placeholder?: string; rows?: number }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: "240px" }}>
      <label style={{ fontSize: "12px", fontWeight: "500", color: T.secondary }}>{label}</label>
      <textarea
        rows={rows}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: T.surface, border: `1px solid ${focused ? T.brand : T.border}`,
          borderRadius: "var(--radius-md)", padding: "8px 12px",
          fontSize: "13px", color: T.text, fontFamily: "var(--font-sans)",
          resize: "vertical", outline: "none", transition: "border-color 0.15s",
        }}
      />
    </div>
  );
}

function FileUpload() {
  const [dragging, setDragging] = useState(false);
  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={() => setDragging(false)}
      style={{
        border: `2px dashed ${dragging ? T.brand : T.border}`,
        borderRadius: "var(--radius-lg)", padding: "24px",
        background: dragging ? "rgba(37,99,235,0.05)" : T.surface,
        textAlign: "center", cursor: "pointer",
        transition: "all 0.15s", minWidth: "240px",
      }}
    >
      <div style={{ color: T.muted, marginBottom: "8px" }}><Icon.Upload /></div>
      <div style={{ fontSize: "13px", color: T.secondary, marginBottom: "4px" }}>Drop files here or <span style={{ color: T.brand }}>browse</span></div>
      <div style={{ fontSize: "11px", color: T.muted }}>PDF, XLS, CSV up to 10MB</div>
    </div>
  );
}

// ─── 03 NAVIGATION ────────────────────────────────────────────────────────────
type NavItemState = "default" | "hover" | "active" | "disabled";

interface NavItemProps {
  icon?: React.ReactNode;
  label: string;
  badge?: string | number;
  state?: NavItemState;
  depth?: number;
}

function SidebarItem({ icon, label, badge, state = "default", depth = 0 }: NavItemProps) {
  const [hovered, setHovered] = useState(false);
  const isActive = state === "active";
  const isDisabled = state === "disabled";
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: `6px ${depth > 0 ? 28 + depth * 8 : 10}px`,
        borderRadius: "var(--radius-md)", cursor: isDisabled ? "not-allowed" : "pointer",
        background: isActive ? "rgba(37,99,235,0.15)" : hovered && !isDisabled ? T.elevated : "transparent",
        color: isActive ? T.brand : isDisabled ? T.muted : T.secondary,
        transition: "all 0.12s",
        opacity: isDisabled ? 0.45 : 1,
        userSelect: "none",
        borderLeft: isActive ? `2px solid ${T.brand}` : "2px solid transparent",
      }}
    >
      {icon && <span style={{ flexShrink: 0, opacity: 0.8 }}>{icon}</span>}
      <span style={{ fontSize: "13px", fontWeight: isActive ? "500" : "400", flex: 1 }}>{label}</span>
      {badge && (
        <span style={{
          fontSize: "10px", background: T.brand, color: "#fff",
          borderRadius: "10px", padding: "1px 6px", fontFamily: "var(--font-mono)",
        }}>{badge}</span>
      )}
    </div>
  );
}

function SidebarSection({ title }: { title: string }) {
  return (
    <div style={{
      fontSize: "10px", fontFamily: "var(--font-mono)", color: T.muted,
      letterSpacing: "0.1em", textTransform: "uppercase",
      padding: "12px 12px 4px", marginTop: "4px",
    }}>{title}</div>
  );
}

function Breadcrumb({ items = ["Dashboard", "Voters", "Profile"] }: { items?: string[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      {items.map((item, i) => (
        <span key={item} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{
            fontSize: "12px",
            color: i === items.length - 1 ? T.text : T.secondary,
            cursor: i < items.length - 1 ? "pointer" : "default",
            fontWeight: i === items.length - 1 ? "500" : "400",
          }}>{item}</span>
          {i < items.length - 1 && <span style={{ color: T.muted, opacity: 0.6, display: "flex" }}><Icon.ChevronRight /></span>}
        </span>
      ))}
    </div>
  );
}

function Tabs({ tabs = ["Overview", "Voters", "Workers", "Reports"], defaultActive = 0 }: { tabs?: string[]; defaultActive?: number }) {
  const [active, setActive] = useState(defaultActive);
  return (
    <div style={{ display: "flex", gap: "0", borderBottom: `1px solid ${T.border}` }}>
      {tabs.map((tab, i) => (
        <button
          key={tab}
          onClick={() => setActive(i)}
          style={{
            padding: "9px 16px", fontSize: "13px", fontFamily: "var(--font-sans)",
            color: active === i ? T.text : T.secondary,
            background: "transparent", border: "none", cursor: "pointer",
            borderBottom: `2px solid ${active === i ? T.brand : "transparent"}`,
            fontWeight: active === i ? "500" : "400",
            transition: "all 0.12s", marginBottom: "-1px",
          }}
        >{tab}</button>
      ))}
    </div>
  );
}

function Pagination({ total = 1240, page = 1, perPage = 20 }: { total?: number; page?: number; perPage?: number }) {
  const [current, setCurrent] = useState(page);
  const totalPages = Math.ceil(total / perPage);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ fontSize: "12px", color: T.secondary }}>
        {(current - 1) * perPage + 1}–{Math.min(current * perPage, total)} of {total.toLocaleString()}
      </span>
      <div style={{ display: "flex", gap: "2px" }}>
        {[1, 2, 3, "...", totalPages].map((p, i) => (
          <button
            key={i}
            onClick={() => typeof p === "number" && setCurrent(p)}
            style={{
              width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "var(--radius-sm)", border: `1px solid ${current === p ? T.brand : T.border}`,
              background: current === p ? T.brand : "transparent",
              color: current === p ? "#fff" : T.secondary,
              fontSize: "12px", fontFamily: "var(--font-mono)", cursor: "pointer",
            }}
          >{p}</button>
        ))}
      </div>
    </div>
  );
}

function DropdownMenu({ trigger = "Options", items = ["Edit", "Duplicate", "Archive", "Delete"] }: { trigger?: string; items?: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <Button variant="secondary" size="sm" label={trigger} icon={<Icon.ChevronDown />} iconPosition="right" onClick={() => setOpen(!open)} />
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, marginTop: "4px", minWidth: "150px",
          background: T.elevated, border: `1px solid ${T.border}`, borderRadius: "var(--radius-md)",
          zIndex: 50, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}>
          {items.map(item => (
            <div
              key={item}
              onClick={() => setOpen(false)}
              style={{
                padding: "8px 12px", fontSize: "13px", color: item === "Delete" ? T.danger : T.text,
                cursor: "pointer", transition: "background 0.1s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = T.hover)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >{item}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 04 DATA DISPLAY ─────────────────────────────────────────────────────────
function Avatar({ name = "John Doe", size = 32, src }: { name?: string; size?: number; src?: string }) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const colors = ["#1D4ED8", "#7C3AED", "#B45309", "#065F46", "#9F1239"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return src ? (
    <img src={src} alt={name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }} />
  ) : (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: "600", color: "#fff", flexShrink: 0,
    }}>{initials}</div>
  );
}

interface TableRow {
  name: string;
  id: string;
  booth: string;
  status: BadgeVariant;
  ward: string;
}

const tableData: TableRow[] = [
  { name: "Priya Sharma", id: "MH/21/00123", booth: "Booth 04 — Ward A", status: "active", ward: "Ward A" },
  { name: "Rajesh Kumar", id: "MH/21/00456", booth: "Booth 07 — Ward B", status: "pending", ward: "Ward B" },
  { name: "Fatima Noor", id: "MH/21/00789", booth: "Booth 02 — Ward A", status: "inactive", ward: "Ward A" },
  { name: "Arjun Patel", id: "MH/21/01012", booth: "Booth 11 — Ward C", status: "approved", ward: "Ward C" },
];

function DataTable() {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const toggleAll = () => setSelected(selected.size === tableData.length ? new Set() : new Set(tableData.map((_, i) => i)));
  const toggle = (i: number) => { const s = new Set(selected); s.has(i) ? s.delete(i) : s.add(i); setSelected(s); };
  return (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: "var(--radius-lg)", overflow: "hidden", background: T.surface }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${T.border}`, background: T.elevated }}>
            <th style={{ padding: "10px 14px", width: "40px" }}>
              <div onClick={toggleAll} style={{
                width: "16px", height: "16px", borderRadius: "3px",
                border: `2px solid ${selected.size === tableData.length ? T.brand : T.borderStrong}`,
                background: selected.size === tableData.length ? T.brand : "transparent",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {selected.size === tableData.length && <Icon.Check />}
              </div>
            </th>
            {["Voter Name", "EPIC / ID", "Booth", "Ward", "Status", "Actions"].map(h => (
              <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: T.muted, fontWeight: "500", fontSize: "11px", letterSpacing: "0.06em", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, i) => (
            <tr key={i} style={{
              borderBottom: i < tableData.length - 1 ? `1px solid ${T.border}` : "none",
              background: selected.has(i) ? "rgba(37,99,235,0.06)" : "transparent",
              transition: "background 0.1s",
            }}
              onMouseEnter={e => { if (!selected.has(i)) e.currentTarget.style.background = T.elevated; }}
              onMouseLeave={e => { e.currentTarget.style.background = selected.has(i) ? "rgba(37,99,235,0.06)" : "transparent"; }}
            >
              <td style={{ padding: "10px 14px" }}>
                <div onClick={() => toggle(i)} style={{
                  width: "16px", height: "16px", borderRadius: "3px",
                  border: `2px solid ${selected.has(i) ? T.brand : T.borderStrong}`,
                  background: selected.has(i) ? T.brand : "transparent",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {selected.has(i) && <Icon.Check />}
                </div>
              </td>
              <td style={{ padding: "10px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Avatar name={row.name} size={28} />
                  <span style={{ color: T.text, fontWeight: "500" }}>{row.name}</span>
                </div>
              </td>
              <td style={{ padding: "10px 14px", color: T.secondary, fontFamily: "var(--font-mono)", fontSize: "11px" }}>{row.id}</td>
              <td style={{ padding: "10px 14px", color: T.secondary }}>{row.booth}</td>
              <td style={{ padding: "10px 14px", color: T.secondary }}>{row.ward}</td>
              <td style={{ padding: "10px 14px" }}><StatusBadge variant={row.status} /></td>
              <td style={{ padding: "10px 14px" }}>
                <div style={{ display: "flex", gap: "4px" }}>
                  <Button variant="ghost" size="sm" label="View" />
                  <Button variant="ghost" size="sm" label="Edit" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Card({ title, children, action }: { title?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: "var(--radius-lg)",
      padding: "20px", display: "flex", flexDirection: "column", gap: "12px",
    }}>
      {title && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "14px", fontWeight: "600", color: T.text }}>{title}</span>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

function StatCard({ label, value, trend, trendPositive = true, icon }: {
  label: string; value: string; trend?: string; trendPositive?: boolean; icon?: React.ReactNode;
}) {
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: "var(--radius-lg)",
      padding: "20px", display: "flex", flexDirection: "column", gap: "12px", minWidth: "180px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: "12px", color: T.secondary, fontWeight: "500" }}>{label}</span>
        {icon && <div style={{ color: T.muted }}>{icon}</div>}
      </div>
      <div>
        <div style={{ fontSize: "28px", fontWeight: "700", color: T.text, fontFamily: "var(--font-display)", lineHeight: 1.1 }}>{value}</div>
        {trend && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "6px" }}>
            <Icon.Trend />
            <span style={{ fontSize: "12px", color: trendPositive ? T.success : T.danger }}>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ title = "No data found", description = "Try adjusting your search or filter to find what you're looking for." }: { title?: string; description?: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "48px 24px", gap: "12px", textAlign: "center",
    }}>
      <div style={{
        width: "48px", height: "48px", borderRadius: "var(--radius-lg)",
        background: T.elevated, border: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "center", color: T.muted,
      }}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </div>
      <div>
        <div style={{ fontSize: "14px", fontWeight: "600", color: T.text, marginBottom: "4px" }}>{title}</div>
        <div style={{ fontSize: "12px", color: T.secondary, maxWidth: "280px" }}>{description}</div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px", color: T.secondary }}>
      <div style={{ animation: "spin 1s linear infinite", color: T.brand }}><Icon.Loader /></div>
      <span style={{ fontSize: "13px" }}>Loading data...</span>
    </div>
  );
}

function ErrorState({ message = "Failed to load data. Please try again." }: { message?: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px",
      background: "rgba(239,68,68,0.08)", border: `1px solid rgba(239,68,68,0.2)`,
      borderRadius: "var(--radius-md)", color: T.danger,
    }}>
      <Icon.AlertCircle />
      <span style={{ fontSize: "13px" }}>{message}</span>
    </div>
  );
}

function TimelineItem({ title, description, time, status = "completed" }: { title: string; description: string; time: string; status?: "completed" | "pending" | "failed" }) {
  const dotColor = status === "completed" ? T.success : status === "failed" ? T.danger : T.warning;
  return (
    <div style={{ display: "flex", gap: "12px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: dotColor, marginTop: "3px" }} />
        <div style={{ width: "1px", flex: 1, background: T.border, marginTop: "4px" }} />
      </div>
      <div style={{ paddingBottom: "16px" }}>
        <div style={{ fontSize: "13px", fontWeight: "500", color: T.text }}>{title}</div>
        <div style={{ fontSize: "12px", color: T.secondary, marginTop: "2px" }}>{description}</div>
        <div style={{ fontSize: "11px", color: T.muted, marginTop: "4px", fontFamily: "var(--font-mono)" }}>{time}</div>
      </div>
    </div>
  );
}

// ─── 05 FILTERS ──────────────────────────────────────────────────────────────
function FilterChip({ label, onRemove, active = false }: { label: string; onRemove?: () => void; active?: boolean }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "4px 10px", borderRadius: "var(--radius-xl)",
      background: active ? "rgba(37,99,235,0.15)" : T.elevated,
      border: `1px solid ${active ? T.brand : T.border}`,
      color: active ? T.brand : T.secondary, fontSize: "12px", cursor: "pointer",
      transition: "all 0.15s",
    }}>
      {label}
      {onRemove && (
        <button onClick={onRemove} style={{ background: "none", border: "none", color: "currentColor", cursor: "pointer", display: "flex", padding: 0 }}>
          <Icon.X />
        </button>
      )}
    </div>
  );
}

function FilterButton({ label, count }: { label: string; count?: number }) {
  const [active, setActive] = useState(false);
  return (
    <button
      onClick={() => setActive(!active)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "6px 12px", borderRadius: "var(--radius-md)",
        background: active ? T.brand : T.elevated,
        border: `1px solid ${active ? T.brand : T.border}`,
        color: active ? "#fff" : T.secondary, fontSize: "12px", cursor: "pointer",
        transition: "all 0.15s", fontFamily: "var(--font-sans)",
      }}
    >
      {label}
      {count !== undefined && (
        <span style={{
          background: active ? "rgba(255,255,255,0.2)" : T.border,
          borderRadius: "10px", padding: "0 5px", fontSize: "10px", fontFamily: "var(--font-mono)",
          color: active ? "#fff" : T.muted,
        }}>{count}</span>
      )}
    </button>
  );
}

function QuickFilterBar() {
  const filters = [
    { label: "Gender", count: 2 },
    { label: "Booth", count: 5 },
    { label: "Ward", count: 3 },
    { label: "Caste", count: 8 },
    { label: "Age Group", count: 4 },
    { label: "Status", count: 3 },
    { label: "Occupation", count: 6 },
  ];
  const [activeChips, setActiveChips] = useState<string[]>(["Ward A", "Male"]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
        {filters.map(f => <FilterButton key={f.label} label={f.label} count={f.count} />)}
        <Button variant="ghost" size="sm" label="Advanced Filters" icon={<Icon.Plus />} />
      </div>
      {activeChips.length > 0 && (
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "11px", color: T.muted }}>Active:</span>
          {activeChips.map(chip => (
            <FilterChip key={chip} label={chip} active onRemove={() => setActiveChips(activeChips.filter(c => c !== chip))} />
          ))}
          <button
            onClick={() => setActiveChips([])}
            style={{ fontSize: "11px", color: T.danger, background: "none", border: "none", cursor: "pointer", padding: "4px 6px" }}
          >Clear All</button>
        </div>
      )}
    </div>
  );
}

function AdvancedFilterPanel() {
  const [expanded, setExpanded] = useState(true);
  const [gender, setGender] = useState<string>("");
  const sections = [
    { id: "gender", label: "Gender", opts: ["Male", "Female", "Other"] },
    { id: "age", label: "Age Group", opts: ["18–25", "26–40", "41–60", "60+"] },
    { id: "status", label: "Status", opts: ["Active", "Inactive", "Pending"] },
  ];
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: "var(--radius-lg)", overflow: "hidden", minWidth: "220px" }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", cursor: "pointer", borderBottom: `1px solid ${T.border}` }}
      >
        <span style={{ fontSize: "12px", fontWeight: "600", color: T.text }}>Advanced Filters</span>
        <div style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: T.muted }}><Icon.ChevronDown /></div>
      </div>
      {expanded && (
        <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {sections.map(sec => (
            <div key={sec.id}>
              <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>{sec.label}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {sec.opts.map(opt => <CheckboxField key={opt} label={opt} />)}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: "8px", paddingTop: "4px", borderTop: `1px solid ${T.border}` }}>
            <Button variant="primary" size="sm" label="Apply" />
            <Button variant="ghost" size="sm" label="Clear" />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 06 FEEDBACK ─────────────────────────────────────────────────────────────
type AlertType = "success" | "warning" | "error" | "info";

const alertConfig: Record<AlertType, { bg: string; border: string; color: string; Icon: () => JSX.Element }> = {
  success: { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)", color: T.success, Icon: Icon.CheckCircle },
  warning: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", color: T.warning, Icon: Icon.Warning },
  error:   { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)",   color: T.danger,  Icon: Icon.AlertCircle },
  info:    { bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", color: T.info,    Icon: Icon.Info },
};

function Alert({ type = "info", title, message, dismissible = true }: { type?: AlertType; title?: string; message: string; dismissible?: boolean }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  const cfg = alertConfig[type];
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: "10px",
      padding: "12px 14px", background: cfg.bg, border: `1px solid ${cfg.border}`,
      borderRadius: "var(--radius-md)", color: cfg.color,
    }}>
      <div style={{ flexShrink: 0, marginTop: "1px" }}><cfg.Icon /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "2px", color: T.text }}>{title}</div>}
        <div style={{ fontSize: "12px", color: T.secondary }}>{message}</div>
      </div>
      {dismissible && (
        <button onClick={() => setVisible(false)} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", flexShrink: 0 }}>
          <Icon.X />
        </button>
      )}
    </div>
  );
}

function Toast({ type = "success", message = "Action completed successfully" }: { type?: AlertType; message?: string }) {
  const cfg = alertConfig[type];
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "10px",
      padding: "12px 16px", background: T.elevated,
      border: `1px solid ${T.border}`, borderRadius: "var(--radius-lg)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)", color: T.text, fontSize: "13px",
    }}>
      <span style={{ color: cfg.color }}><cfg.Icon /></span>
      {message}
      <button style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", display: "flex" }}>
        <Icon.X />
      </button>
    </div>
  );
}

function ProgressIndicator({ value = 65, label = "Processing voters..." }: { value?: number; label?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "240px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "12px", color: T.secondary }}>{label}</span>
        <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: T.text }}>{value}%</span>
      </div>
      <div style={{ height: "6px", background: T.elevated, borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: T.brand, borderRadius: "3px", transition: "width 0.3s ease" }} />
      </div>
    </div>
  );
}

// ─── 07 OVERLAYS ─────────────────────────────────────────────────────────────
type ModalSize = "sm" | "md" | "lg";
const modalWidths: Record<ModalSize, string> = { sm: "380px", md: "540px", lg: "720px" };

function Modal({ size = "md", title = "Confirm Action", children, onClose }: { size?: ModalSize; title?: string; children?: React.ReactNode; onClose?: () => void }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
    }}
      onClick={onClose}
    >
      <div
        style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: "var(--radius-xl)", width: modalWidths[size],
          maxWidth: "calc(100vw - 32px)", boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: "16px", fontWeight: "600", color: T.text }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", display: "flex" }}>
            <Icon.X />
          </button>
        </div>
        <div style={{ padding: "20px 24px" }}>
          {children || <p style={{ fontSize: "13px", color: T.secondary, margin: 0 }}>Are you sure you want to proceed with this action? This cannot be undone.</p>}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", padding: "16px 24px", borderTop: `1px solid ${T.border}` }}>
          <Button variant="secondary" label="Cancel" onClick={onClose} />
          <Button variant="primary" label="Confirm" />
        </div>
      </div>
    </div>
  );
}

function Tooltip({ children, label }: { children: React.ReactNode; label: string }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
          background: T.text, color: T.bg, padding: "5px 10px", borderRadius: "var(--radius-sm)",
          fontSize: "11px", fontFamily: "var(--font-sans)", whiteSpace: "nowrap",
          pointerEvents: "none", zIndex: 50, boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        }}>
          {label}
          <div style={{
            position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
            borderTop: `5px solid ${T.text}`,
          }} />
        </div>
      )}
    </div>
  );
}

function CommandPanel({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState("");
  const items = ["View Voter Dashboard", "Import Voter List", "Generate Report", "Manage AI Access", "Configure Booths", "Add Campaign", "View Audit Log"];
  const filtered = items.filter(i => i.toLowerCase().includes(query.toLowerCase()));
  return (
    <div style={{
      background: T.elevated, border: `1px solid ${T.border}`,
      borderRadius: "var(--radius-xl)", width: "480px", overflow: "hidden",
      boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", borderBottom: `1px solid ${T.border}` }}>
        <Icon.Search />
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search commands, voters, reports..."
          style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: "14px", color: T.text, fontFamily: "var(--font-sans)" }}
        />
        <kbd style={{ fontSize: "10px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: "3px", padding: "2px 5px", color: T.muted, fontFamily: "var(--font-mono)" }}>ESC</kbd>
      </div>
      <div style={{ maxHeight: "320px", overflowY: "auto" }}>
        {filtered.map(item => (
          <div
            key={item}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", cursor: "pointer", transition: "background 0.1s" }}
            onMouseEnter={e => e.currentTarget.style.background = T.hover}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <Icon.Zap />
            <span style={{ fontSize: "13px", color: T.text }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 08 DASHBOARD COMPONENTS ─────────────────────────────────────────────────
function ChartCard({ title = "Voter Registration Trend", subtitle }: { title?: string; subtitle?: string }) {
  const bars = [45, 72, 58, 89, 67, 94, 78, 85, 91, 73, 88, 96];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const max = Math.max(...bars);
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: "var(--radius-lg)", padding: "20px", minWidth: "320px" }}>
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "14px", fontWeight: "600", color: T.text }}>{title}</div>
        {subtitle && <div style={{ fontSize: "12px", color: T.secondary, marginTop: "2px" }}>{subtitle}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "5px", height: "80px" }}>
        {bars.map((val, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
              <div style={{
                width: "100%", background: T.brand, opacity: 0.7 + (val / max) * 0.3,
                borderRadius: "2px 2px 0 0", height: `${(val / max) * 100}%`,
                transition: "height 0.3s ease",
              }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
        {months.filter((_, i) => i % 3 === 0).map(m => (
          <span key={m} style={{ fontSize: "10px", color: T.muted, fontFamily: "var(--font-mono)" }}>{m}</span>
        ))}
      </div>
    </div>
  );
}

function DataSummaryRow() {
  const stats = [
    { label: "Total Voters", value: "2,45,310", trend: "+4.2%", pos: true },
    { label: "Active Members", value: "1,847", trend: "+12%", pos: true },
    { label: "Workers Assigned", value: "326", trend: "-2.1%", pos: false },
    { label: "Booths Covered", value: "184 / 220", trend: "84%", pos: true },
  ];
  return (
    <div style={{ display: "flex", gap: "1px", background: T.border, borderRadius: "var(--radius-lg)", overflow: "hidden", border: `1px solid ${T.border}` }}>
      {stats.map((s, i) => (
        <div key={s.label} style={{ flex: 1, padding: "16px 20px", background: T.surface }}>
          <div style={{ fontSize: "11px", color: T.muted, marginBottom: "6px", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: T.text, fontFamily: "var(--font-display)" }}>{s.value}</div>
          <div style={{ fontSize: "11px", color: s.pos ? T.success : T.danger, marginTop: "4px" }}>{s.trend}</div>
        </div>
      ))}
    </div>
  );
}

function QuickAction({ label, icon, description }: { label: string; icon: React.ReactNode; description: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? T.elevated : T.surface, border: `1px solid ${hovered ? T.borderStrong : T.border}`,
        borderRadius: "var(--radius-lg)", padding: "16px", cursor: "pointer",
        transition: "all 0.15s", display: "flex", flexDirection: "column", gap: "8px",
      }}
    >
      <div style={{ color: T.brand }}>{icon}</div>
      <div style={{ fontSize: "13px", fontWeight: "600", color: T.text }}>{label}</div>
      <div style={{ fontSize: "11px", color: T.secondary }}>{description}</div>
    </div>
  );
}

// ─── 09 ELECTION-SPECIFIC ─────────────────────────────────────────────────────
type VoterClassification = "supporter" | "opponent" | "doubtful" | "neutral";

const classificationConfig: Record<VoterClassification, { color: string; bg: string; label: string }> = {
  supporter: { color: T.success, bg: "rgba(34,197,94,0.12)", label: "Supporter" },
  opponent:  { color: T.danger,  bg: "rgba(239,68,68,0.12)",  label: "Opponent" },
  doubtful:  { color: T.warning, bg: "rgba(245,158,11,0.12)", label: "Doubtful" },
  neutral:   { color: T.secondary, bg: T.elevated,            label: "Neutral" },
};

function VoterClassificationBadge({ classification = "neutral" }: { classification?: VoterClassification }) {
  const cfg = classificationConfig[classification];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "3px 10px", borderRadius: "var(--radius-xl)",
      background: cfg.bg, color: cfg.color, fontSize: "11px", fontWeight: "600",
      letterSpacing: "0.03em",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

function AIAccessIndicator({ enabled = true }: { enabled?: boolean }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "8px",
      padding: "6px 12px", borderRadius: "var(--radius-md)",
      background: enabled ? "rgba(37,99,235,0.1)" : T.elevated,
      border: `1px solid ${enabled ? "rgba(37,99,235,0.3)" : T.border}`,
      color: enabled ? T.brand : T.secondary,
    }}>
      <Icon.AI />
      <span style={{ fontSize: "12px", fontWeight: "500" }}>{enabled ? "AI Access Enabled" : "AI Access Disabled"}</span>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: enabled ? T.success : T.muted }} />
    </div>
  );
}

function AISubscriptionUsage({ used = 2, total = 3 }: { used?: number; total?: number }) {
  const available = total - used;
  const pct = (used / total) * 100;
  const isWarning = available === 0;
  return (
    <div style={{
      background: T.surface, border: `1px solid ${isWarning ? "rgba(239,68,68,0.3)" : T.border}`,
      borderRadius: "var(--radius-lg)", padding: "16px", minWidth: "240px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div>
          <div style={{ fontSize: "12px", color: T.secondary, marginBottom: "4px" }}>AI Access</div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: T.text, fontFamily: "var(--font-display)" }}>{used} / {total} <span style={{ fontSize: "13px", fontWeight: "400", color: T.secondary }}>Users</span></div>
        </div>
        <div style={{ color: T.brand }}><Icon.AI /></div>
      </div>
      <div style={{ height: "6px", background: T.elevated, borderRadius: "3px", overflow: "hidden", marginBottom: "8px" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: isWarning ? T.danger : T.brand, borderRadius: "3px" }} />
      </div>
      {isWarning ? (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "11px", color: T.danger, fontWeight: "500" }}>AI user limit reached</span>
          <button style={{ fontSize: "11px", color: T.brand, background: "none", border: "none", cursor: "pointer", padding: 0 }}>Manage AI Access →</button>
        </div>
      ) : (
        <div style={{ fontSize: "11px", color: T.secondary }}>{available} slot{available !== 1 ? "s" : ""} available</div>
      )}
    </div>
  );
}

function BoothStatusCard({ booth = "Booth 04", ward = "Ward A", workers = 3, coverage = 78, status = "active" }: {
  booth?: string; ward?: string; workers?: number; coverage?: number; status?: BadgeVariant;
}) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: "var(--radius-lg)", padding: "16px", minWidth: "200px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "600", color: T.text }}>{booth}</div>
          <div style={{ fontSize: "12px", color: T.secondary, marginTop: "1px" }}>{ward}</div>
        </div>
        <StatusBadge variant={status} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", color: T.muted }}>Workers</span>
          <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: T.text }}>{workers} assigned</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "11px", color: T.muted }}>Coverage</span>
          <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: T.text }}>{coverage}%</span>
        </div>
        <div style={{ height: "4px", background: T.elevated, borderRadius: "2px" }}>
          <div style={{ height: "100%", width: `${coverage}%`, background: coverage >= 80 ? T.success : coverage >= 60 ? T.warning : T.danger, borderRadius: "2px" }} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE LAYOUT
// ═══════════════════════════════════════════════════════════════════════════════

const NAV_SECTIONS = [
  { id: "s01", label: "01 — Buttons" },
  { id: "s02", label: "02 — Inputs & Forms" },
  { id: "s03", label: "03 — Navigation" },
  { id: "s04", label: "04 — Data Display" },
  { id: "s05", label: "05 — Filters" },
  { id: "s06", label: "06 — Feedback" },
  { id: "s07", label: "07 — Overlays" },
  { id: "s08", label: "08 — Dashboard" },
  { id: "s09", label: "09 — Election-Specific" },
];

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [activeSection, setActiveSection] = useState("s01");
  const [radioVal, setRadioVal] = useState("opt1");

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: T.bg, fontFamily: "var(--font-sans)" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Left sidebar nav */}
      <div style={{
        width: "220px", flexShrink: 0, height: "100%", overflow: "auto",
        borderRight: `1px solid ${T.border}`, background: T.surface, padding: "20px 0",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "0 16px 20px", borderBottom: `1px solid ${T.border}`, marginBottom: "8px" }}>
          <div style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: T.muted, letterSpacing: "0.08em", marginBottom: "4px" }}>05 — COMPONENTS</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: "600", color: T.text }}>Component Library</div>
          <div style={{ fontSize: "10px", color: T.muted, marginTop: "2px" }}>Election Management Platform v1.0</div>
        </div>
        {NAV_SECTIONS.map(s => (
          <div
            key={s.id}
            onClick={() => scrollTo(s.id)}
            style={{
              padding: "7px 16px", fontSize: "12px", cursor: "pointer",
              color: activeSection === s.id ? T.brand : T.secondary,
              background: activeSection === s.id ? "rgba(37,99,235,0.08)" : "transparent",
              borderLeft: `2px solid ${activeSection === s.id ? T.brand : "transparent"}`,
              transition: "all 0.12s",
            }}
            onMouseEnter={e => { if (activeSection !== s.id) e.currentTarget.style.color = T.text; }}
            onMouseLeave={e => { if (activeSection !== s.id) e.currentTarget.style.color = T.secondary; }}
          >
            {s.label}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: "auto", padding: "40px 48px" }}>

        {/* Page header */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: T.muted, letterSpacing: "0.1em", marginBottom: "8px" }}>ELECTION MANAGEMENT PLATFORM — COMPONENT LIBRARY</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "42px", fontWeight: "700", color: T.text, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            05 — Components
          </h1>
          <p style={{ fontSize: "14px", color: T.secondary, maxWidth: "560px", margin: 0, lineHeight: 1.6 }}>
            Reusable UI components for the Election Management Platform. All components use design system tokens and support Auto Layout. Version 1.0.
          </p>
          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <div style={{ fontSize: "12px", color: T.muted }}>
              <span style={{ fontFamily: "var(--font-mono)", color: T.success }}>●</span> 9 categories &nbsp;·&nbsp;
              <span style={{ fontFamily: "var(--font-mono)", color: T.brand }}>●</span> 60+ components &nbsp;·&nbsp;
              <span style={{ fontFamily: "var(--font-mono)", color: T.warning }}>●</span> Fully tokenized
            </div>
          </div>
        </div>

        {/* ═══ 01 BUTTONS ═══ */}
        <div id="s01" style={{ marginBottom: "64px" }}>
          <SectionTitle num="01" title="Buttons" />

          <SubSection title="Button / Primary — Variants">
            <Row>
              <Col>
                <CompLabel>Primary</CompLabel>
                <Button variant="primary" label="Primary Button" />
              </Col>
              <Col>
                <CompLabel>Secondary</CompLabel>
                <Button variant="secondary" label="Secondary" />
              </Col>
              <Col>
                <CompLabel>Outline</CompLabel>
                <Button variant="outline" label="Outline" />
              </Col>
              <Col>
                <CompLabel>Ghost</CompLabel>
                <Button variant="ghost" label="Ghost" />
              </Col>
              <Col>
                <CompLabel>Danger</CompLabel>
                <Button variant="danger" label="Delete" />
              </Col>
            </Row>
          </SubSection>

          <SubSection title="Button / Sizes">
            <Row gap={8} wrap={false}>
              <Col>
                <CompLabel>Large</CompLabel>
                <Button size="lg" label="Large Button" />
              </Col>
              <Col>
                <CompLabel>Medium</CompLabel>
                <Button size="md" label="Medium Button" />
              </Col>
              <Col>
                <CompLabel>Small</CompLabel>
                <Button size="sm" label="Small Button" />
              </Col>
            </Row>
          </SubSection>

          <SubSection title="Button / States">
            <Row>
              <Col><CompLabel>Default</CompLabel><Button label="Default" /></Col>
              <Col><CompLabel>Disabled</CompLabel><Button label="Disabled" disabled /></Col>
              <Col><CompLabel>Loading</CompLabel><Button label="Loading..." loading /></Col>
              <Col><CompLabel>Icon Left</CompLabel><Button label="Import" icon={<Icon.Upload />} iconPosition="left" /></Col>
              <Col><CompLabel>Icon Right</CompLabel><Button label="Next" icon={<Icon.ChevronRight />} iconPosition="right" /></Col>
            </Row>
          </SubSection>

          <SubSection title="Button / Icon Only">
            <Row>
              <Col><CompLabel>Primary</CompLabel><Button variant="primary" label="" icon={<Icon.Plus />} /></Col>
              <Col><CompLabel>Secondary</CompLabel><Button variant="secondary" label="" icon={<Icon.Search />} /></Col>
              <Col><CompLabel>Ghost</CompLabel><Button variant="ghost" label="" icon={<Icon.Settings />} /></Col>
            </Row>
          </SubSection>
        </div>

        {/* ═══ 02 INPUTS ═══ */}
        <div id="s02" style={{ marginBottom: "64px" }}>
          <SectionTitle num="02" title="Inputs & Forms" />

          <SubSection title="Input / States">
            <Row>
              <InputField label="Default Input" placeholder="Enter value" state="default" helperText="Helper text goes here" />
              <InputField label="Focus State" placeholder="Focused input" state="focus" />
              <InputField label="Filled State" placeholder="Filled value" value="Priya Sharma" state="filled" />
              <InputField label="Error State" placeholder="Enter value" state="error" errorText="This field is required" />
              <InputField label="Disabled" placeholder="Disabled input" state="disabled" />
            </Row>
          </SubSection>

          <SubSection title="Search Input">
            <SearchInput placeholder="Search voters, booths, members..." />
          </SubSection>

          <SubSection title="Select & Multi-Select">
            <Row>
              <SelectField label="Ward" options={["Ward A", "Ward B", "Ward C", "Ward D"]} />
              <SelectField label="Booth" options={["Booth 01", "Booth 02", "Booth 03", "Booth 04", "Booth 05"]} />
              <SelectField label="Status" options={["Active", "Inactive", "Pending", "Approved", "Rejected"]} />
            </Row>
          </SubSection>

          <SubSection title="Checkbox, Radio, Switch">
            <Row gap={40}>
              <Col gap={8}>
                <CompLabel>Checkbox</CompLabel>
                <CheckboxField label="Include inactive voters" />
                <CheckboxField label="Show deleted records" defaultChecked />
                <CheckboxField label="Export all fields" />
              </Col>
              <Col gap={8}>
                <CompLabel>Radio</CompLabel>
                <RadioField name="gender" label="Male" checked={radioVal === "opt1"} onChange={() => setRadioVal("opt1")} />
                <RadioField name="gender" label="Female" checked={radioVal === "opt2"} onChange={() => setRadioVal("opt2")} />
                <RadioField name="gender" label="Other" checked={radioVal === "opt3"} onChange={() => setRadioVal("opt3")} />
              </Col>
              <Col gap={8}>
                <CompLabel>Switch</CompLabel>
                <Switch label="Enable AI Access" defaultOn />
                <Switch label="Email notifications" />
                <Switch label="Two-factor auth" defaultOn />
              </Col>
            </Row>
          </SubSection>

          <SubSection title="Textarea & File Upload">
            <Row gap={20}>
              <TextareaField label="Notes" placeholder="Add notes about this voter..." rows={4} />
              <FileUpload />
            </Row>
          </SubSection>
        </div>

        {/* ═══ 03 NAVIGATION ═══ */}
        <div id="s03" style={{ marginBottom: "64px" }}>
          <SectionTitle num="03" title="Navigation" />

          <SubSection title="Navigation / Sidebar Item — States">
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: "var(--radius-lg)", padding: "8px", width: "220px" }}>
              <SidebarSection title="Main" />
              <SidebarItem icon={<Icon.Vote />} label="Dashboard" state="active" badge="3" />
              <SidebarItem icon={<Icon.Users />} label="Voters" state="default" />
              <SidebarItem icon={<Icon.Users />} label="Members" state="hover" />
              <SidebarItem icon={<Icon.Users />} label="Workers" state="default" />
              <SidebarSection title="Management" />
              <SidebarItem icon={<Icon.Vote />} label="BLO" state="default" />
              <SidebarItem icon={<Icon.Vote />} label="Booths" state="default" />
              <SidebarItem icon={<Icon.Vote />} label="Campaigns" state="default" />
              <SidebarSection title="Tools" />
              <SidebarItem icon={<Icon.AI />} label="AI Mode" state="default" badge="NEW" />
              <SidebarItem icon={<Icon.Vote />} label="Reports" state="disabled" />
              <SidebarSection title="System" />
              <SidebarItem icon={<Icon.Settings />} label="Settings" state="default" />
            </div>
          </SubSection>

          <SubSection title="Navigation / Breadcrumb">
            <Col gap={10}>
              <Breadcrumb items={["Dashboard"]} />
              <Breadcrumb items={["Dashboard", "Voters"]} />
              <Breadcrumb items={["Dashboard", "Voters", "Priya Sharma"]} />
              <Breadcrumb items={["Dashboard", "Booths", "Ward A", "Booth 04"]} />
            </Col>
          </SubSection>

          <SubSection title="Navigation / Tabs">
            <Col gap={20}>
              <Tabs tabs={["Overview", "Voters", "Workers", "Reports"]} />
              <Tabs tabs={["Profile", "Activity", "AI Access", "Permissions"]} defaultActive={2} />
            </Col>
          </SubSection>

          <SubSection title="Navigation / Pagination">
            <Col gap={16}>
              <Pagination total={1240} page={3} perPage={20} />
              <Pagination total={45} page={1} perPage={10} />
            </Col>
          </SubSection>

          <SubSection title="Navigation / Dropdown Menu">
            <Row>
              <DropdownMenu trigger="Actions" items={["View Profile", "Edit Details", "Assign Booth", "Export Data", "Delete Voter"]} />
              <DropdownMenu trigger="Export" items={["Export CSV", "Export Excel", "Export PDF", "Print"]} />
            </Row>
          </SubSection>
        </div>

        {/* ═══ 04 DATA DISPLAY ═══ */}
        <div id="s04" style={{ marginBottom: "64px" }}>
          <SectionTitle num="04" title="Data Display" />

          <SubSection title="Status Badge / Variants">
            <Row wrap>
              {(["active", "inactive", "pending", "approved", "rejected", "draft", "scheduled", "completed", "failed"] as BadgeVariant[]).map(v => (
                <StatusBadge key={v} variant={v} />
              ))}
            </Row>
          </SubSection>

          <SubSection title="Stat Card">
            <Row>
              <StatCard label="Total Voters" value="2,45,310" trend="+4.2% this month" trendPositive icon={<Icon.Users />} />
              <StatCard label="Active Members" value="1,847" trend="+12% this week" trendPositive icon={<Icon.Vote />} />
              <StatCard label="AI Users" value="2 / 3" trend="1 slot available" trendPositive icon={<Icon.AI />} />
              <StatCard label="Booths Covered" value="184" trend="-3 vs last week" trendPositive={false} icon={<Icon.Vote />} />
            </Row>
          </SubSection>

          <SubSection title="Avatar">
            <Row gap={8} wrap={false}>
              {[32, 40, 48].map(s => (
                <Col key={s}>
                  <CompLabel>{s}px</CompLabel>
                  <Row gap={6} wrap={false}>
                    {["Priya Sharma", "Rajesh Kumar", "Fatima Noor", "Arjun Patel"].map(n => <Avatar key={n} name={n} size={s} />)}
                  </Row>
                </Col>
              ))}
            </Row>
          </SubSection>

          <SubSection title="Data Table">
            <DataTable />
          </SubSection>

          <SubSection title="Timeline Item">
            <div style={{ maxWidth: "400px" }}>
              <TimelineItem title="Voter record updated" description="Field data synced from booth worker Ramesh K." time="Today, 14:32" status="completed" />
              <TimelineItem title="AI classification applied" description="Voter classified as Supporter with 87% confidence." time="Today, 14:28" status="completed" />
              <TimelineItem title="Pending verification" description="Mobile number requires OTP verification." time="Yesterday, 09:15" status="pending" />
              <TimelineItem title="Import failed" description="CSV row 234 skipped — duplicate EPIC ID." time="2 days ago, 11:44" status="failed" />
            </div>
          </SubSection>

          <SubSection title="Empty / Loading / Error States">
            <Row>
              <div style={{ border: `1px solid ${T.border}`, borderRadius: "var(--radius-lg)", flex: 1, minWidth: "240px" }}>
                <EmptyState />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, minWidth: "240px" }}>
                <LoadingState />
                <ErrorState message="Failed to load voter data. Check your connection." />
              </div>
            </Row>
          </SubSection>
        </div>

        {/* ═══ 05 FILTERS ═══ */}
        <div id="s05" style={{ marginBottom: "64px" }}>
          <SectionTitle num="05" title="Filters" />

          <SubSection title="Filter Chip">
            <Row>
              <FilterChip label="Gender: Male" active />
              <FilterChip label="Ward A" active onRemove={() => {}} />
              <FilterChip label="Age: 26–40" active onRemove={() => {}} />
              <FilterChip label="Status: Active" active onRemove={() => {}} />
              <FilterChip label="Booth 04" />
              <FilterChip label="Caste: General" />
            </Row>
          </SubSection>

          <SubSection title="Filter Button">
            <Row>
              <FilterButton label="Gender" count={2} />
              <FilterButton label="Booth" count={5} />
              <FilterButton label="Age Group" count={4} />
              <FilterButton label="Caste" count={8} />
              <FilterButton label="Occupation" count={6} />
              <FilterButton label="Mobile" />
              <FilterButton label="Voter ID / EPIC" />
              <FilterButton label="Location" />
              <FilterButton label="Status" count={3} />
            </Row>
          </SubSection>

          <SubSection title="Quick Filter Bar">
            <QuickFilterBar />
          </SubSection>

          <SubSection title="Advanced Filter Panel">
            <AdvancedFilterPanel />
          </SubSection>
        </div>

        {/* ═══ 06 FEEDBACK ═══ */}
        <div id="s06" style={{ marginBottom: "64px" }}>
          <SectionTitle num="06" title="Feedback" />

          <SubSection title="Alert">
            <Col gap={10}>
              <Alert type="success" title="Import completed" message="245 voter records were successfully imported." />
              <Alert type="warning" title="Duplicate entries found" message="12 records were skipped due to matching EPIC IDs." />
              <Alert type="error" title="Sync failed" message="Unable to connect to the election commission server. Retry in 5 minutes." />
              <Alert type="info" title="AI classification running" message="Your voter list is being analyzed. Results will appear shortly." />
            </Col>
          </SubSection>

          <SubSection title="Toast">
            <Col gap={10}>
              <Toast type="success" message="Voter record saved successfully" />
              <Toast type="warning" message="AI usage at 90% — 1 slot remaining" />
              <Toast type="error" message="Failed to assign worker to booth" />
              <Toast type="info" message="Campaign scheduled for 14 Oct 2026" />
            </Col>
          </SubSection>

          <SubSection title="Progress Indicator">
            <Col gap={16}>
              <ProgressIndicator value={25} label="Uploading voter list..." />
              <ProgressIndicator value={65} label="AI classification in progress..." />
              <ProgressIndicator value={100} label="Export complete" />
            </Col>
          </SubSection>
        </div>

        {/* ═══ 07 OVERLAYS ═══ */}
        <div id="s07" style={{ marginBottom: "64px" }}>
          <SectionTitle num="07" title="Overlays" />

          <SubSection title="Modal">
            <Row>
              <Button variant="primary" label="Open Modal (Medium)" onClick={() => setShowModal(true)} />
            </Row>
            {showModal && (
              <Modal size="md" title="Confirm Voter Classification" onClose={() => setShowModal(false)}>
                <p style={{ fontSize: "13px", color: T.secondary, margin: 0 }}>
                  You are about to classify <strong style={{ color: T.text }}>245 voters</strong> using AI. This will override any manually set classifications. Are you sure?
                </p>
              </Modal>
            )}
          </SubSection>

          <SubSection title="Tooltip">
            <Row>
              <Tooltip label="Export voter data as CSV"><Button variant="secondary" size="sm" label="Export" /></Tooltip>
              <Tooltip label="AI Access requires subscription"><Button variant="ghost" size="sm" label="Enable AI Mode" /></Tooltip>
              <Tooltip label="Delete cannot be undone"><Button variant="danger" size="sm" label="Delete" /></Tooltip>
            </Row>
          </SubSection>

          <SubSection title="Command / Search Panel">
            <CommandPanel />
          </SubSection>
        </div>

        {/* ═══ 08 DASHBOARD ═══ */}
        <div id="s08" style={{ marginBottom: "64px" }}>
          <SectionTitle num="08" title="Dashboard Components" />

          <SubSection title="Data Summary Row">
            <DataSummaryRow />
          </SubSection>

          <SubSection title="Chart Card (Placeholder)">
            <Row>
              <ChartCard title="Voter Registration Trend" subtitle="Monthly registrations — Jan to Dec 2026" />
              <ChartCard title="AI Classification Progress" subtitle="Voter classification by category" />
            </Row>
          </SubSection>

          <SubSection title="Quick Actions">
            <Row>
              <QuickAction label="Import Voters" icon={<Icon.Upload />} description="Upload CSV or Excel file" />
              <QuickAction label="Run AI Analysis" icon={<Icon.AI />} description="Classify voter intentions" />
              <QuickAction label="Generate Report" icon={<Icon.Vote />} description="Export data as PDF or CSV" />
              <QuickAction label="Manage Workers" icon={<Icon.Users />} description="Assign workers to booths" />
            </Row>
          </SubSection>

          <SubSection title="Analytics / Progress Card">
            <Row>
              <Card title="Ward Coverage" action={<Button variant="ghost" size="sm" label="View All" />}>
                <Col gap={10}>
                  {[
                    { label: "Ward A", val: 92 },
                    { label: "Ward B", val: 74 },
                    { label: "Ward C", val: 58 },
                    { label: "Ward D", val: 81 },
                  ].map(w => (
                    <div key={w.label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "12px", color: T.secondary, width: "52px", flexShrink: 0 }}>{w.label}</span>
                      <div style={{ flex: 1, height: "6px", background: T.elevated, borderRadius: "3px" }}>
                        <div style={{ height: "100%", width: `${w.val}%`, background: T.brand, borderRadius: "3px" }} />
                      </div>
                      <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: T.text, width: "32px", textAlign: "right" }}>{w.val}%</span>
                    </div>
                  ))}
                </Col>
              </Card>
            </Row>
          </SubSection>
        </div>

        {/* ═══ 09 ELECTION-SPECIFIC ═══ */}
        <div id="s09" style={{ marginBottom: "64px" }}>
          <SectionTitle num="09" title="Election-Specific Components" />

          <SubSection title="Voter / Classification Badge">
            <Row>
              {(["supporter", "opponent", "doubtful", "neutral"] as VoterClassification[]).map(c => (
                <Col key={c}>
                  <CompLabel>{c}</CompLabel>
                  <VoterClassificationBadge classification={c} />
                </Col>
              ))}
            </Row>
          </SubSection>

          <SubSection title="AI / Access Indicator">
            <Row>
              <Col>
                <CompLabel>Enabled</CompLabel>
                <AIAccessIndicator enabled />
              </Col>
              <Col>
                <CompLabel>Disabled</CompLabel>
                <AIAccessIndicator enabled={false} />
              </Col>
            </Row>
          </SubSection>

          <SubSection title="AI / Subscription Usage">
            <Row>
              <Col>
                <CompLabel>1 slot available</CompLabel>
                <AISubscriptionUsage used={2} total={3} />
              </Col>
              <Col>
                <CompLabel>Limit reached</CompLabel>
                <AISubscriptionUsage used={3} total={3} />
              </Col>
              <Col>
                <CompLabel>Half used</CompLabel>
                <AISubscriptionUsage used={2} total={5} />
              </Col>
            </Row>
          </SubSection>

          <SubSection title="Booth / Status Card">
            <Row>
              <BoothStatusCard booth="Booth 04" ward="Ward A" workers={3} coverage={92} status="active" />
              <BoothStatusCard booth="Booth 07" ward="Ward B" workers={1} coverage={58} status="pending" />
              <BoothStatusCard booth="Booth 11" ward="Ward C" workers={0} coverage={23} status="inactive" />
              <BoothStatusCard booth="Booth 02" ward="Ward A" workers={2} coverage={78} status="active" />
            </Row>
          </SubSection>

          <SubSection title="Voter / Classification in Table Row">
            <div style={{ border: `1px solid ${T.border}`, borderRadius: "var(--radius-lg)", overflow: "hidden", background: T.surface }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T.border}`, background: T.elevated }}>
                    {["Voter", "EPIC ID", "Booth", "Classification", "AI Confidence", "Status"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: T.muted, fontWeight: "500", fontSize: "11px", letterSpacing: "0.06em", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Priya Sharma", id: "MH/21/00123", booth: "Booth 04", cls: "supporter" as VoterClassification, conf: 94, status: "active" as BadgeVariant },
                    { name: "Rajesh Kumar", id: "MH/21/00456", booth: "Booth 07", cls: "doubtful" as VoterClassification, conf: 61, status: "pending" as BadgeVariant },
                    { name: "Fatima Noor", id: "MH/21/00789", booth: "Booth 02", cls: "neutral" as VoterClassification, conf: 78, status: "active" as BadgeVariant },
                    { name: "Arjun Patel", id: "MH/21/01012", booth: "Booth 11", cls: "opponent" as VoterClassification, conf: 88, status: "inactive" as BadgeVariant },
                  ].map((r, i) => (
                    <tr key={i}
                      style={{ borderBottom: `1px solid ${T.border}` }}
                      onMouseEnter={e => e.currentTarget.style.background = T.elevated}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Avatar name={r.name} size={26} />
                          <span style={{ color: T.text, fontWeight: "500" }}>{r.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "10px 14px", color: T.muted, fontFamily: "var(--font-mono)", fontSize: "11px" }}>{r.id}</td>
                      <td style={{ padding: "10px 14px", color: T.secondary }}>{r.booth}</td>
                      <td style={{ padding: "10px 14px" }}><VoterClassificationBadge classification={r.cls} /></td>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "60px", height: "4px", background: T.elevated, borderRadius: "2px" }}>
                            <div style={{ height: "100%", width: `${r.conf}%`, background: r.conf >= 80 ? T.success : T.warning, borderRadius: "2px" }} />
                          </div>
                          <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: T.secondary }}>{r.conf}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "10px 14px" }}><StatusBadge variant={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SubSection>
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "32px", marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "12px", color: T.muted }}>Election Management Platform — Component Library v1.0</div>
          <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: T.muted }}>60+ components · 9 categories · Tailwind CSS v4</div>
        </div>
      </div>
    </div>
  );
}

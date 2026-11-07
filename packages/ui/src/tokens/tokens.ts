/**
 * Rajtantra Design System - Core Design Tokens
 * 
 * Centralized design tokens establishing a consistent visual language across
 * all 6 portals (Candidate, Super Admin, Distributor, Karyakarta, Agency, Voter).
 */

export const colors = {
  // Primary Brand Identity (Rajtantra Blue)
  primary: {
    DEFAULT: "#2087FE",
    hover: "#1A6ED1",
    active: "#1558A8",
    light: "#E0EDFE",
    dark: "#0D79FD",
    darkHover: "#0b66d4",
    darkTint: "#0e3554",
  },
  
  // Secondary Brand Identity (Deep Navy / Executive Slate)
  secondary: {
    DEFAULT: "#010627",
    hover: "#072439",
    dark: "#072439",
    darkLight: "#062237",
    border: "#0e3554",
  },

  // Semantic Feedback States
  success: {
    DEFAULT: "#12CF94",
    hover: "#0EAC7A",
    light: "#E6FBF4",
    soft: "#B3EDD7",
    dark: "#01C588",
    darkLight: "#012B1E",
    border: "#12CF94",
  },

  warning: {
    DEFAULT: "#FC7C36",
    hover: "#E06622",
    light: "#FFF4ED",
    dark: "#F48637",
    darkLight: "#351908",
    border: "#FC7C36",
  },

  error: {
    DEFAULT: "#EF4444",
    hover: "#DC2626",
    light: "#FEF2F2",
    dark: "#F87171",
    darkLight: "#450A0A",
    border: "#EF4444",
  },

  info: {
    DEFAULT: "#2087FE",
    hover: "#1A6ED1",
    light: "#E0EDFE",
    dark: "#0D79FD",
    darkLight: "#0e3554",
    border: "#2087FE",
  },

  // Neutral Foundations
  neutral: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
    950: "#020617",
  },
} as const;

export const typography = {
  fonts: {
    sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    display: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
    devanagari: "'Noto Sans Devanagari', 'Inter', system-ui, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  sizes: {
    "2xs": ["0.6875rem", { lineHeight: "0.875rem" }], // 11px
    xs: ["0.75rem", { lineHeight: "1rem" }],          // 12px
    sm: ["0.875rem", { lineHeight: "1.25rem" }],       // 14px
    base: ["1rem", { lineHeight: "1.5rem" }],          // 16px
    lg: ["1.125rem", { lineHeight: "1.75rem" }],       // 18px
    xl: ["1.25rem", { lineHeight: "1.75rem" }],        // 20px
    "2xl": ["1.5rem", { lineHeight: "2rem" }],         // 24px
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }],    // 30px
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }],      // 36px
  },
  weights: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },
} as const;

export const breakpoints = {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const shadows = {
  "premium-xs": "0 1px 2px 0 rgba(15, 23, 42, 0.04)",
  "premium-sm": "0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)",
  "premium-md": "0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -2px rgba(15, 23, 42, 0.03)",
  "premium-lg": "0 10px 25px -3px rgba(15, 23, 42, 0.08), 0 4px 10px -4px rgba(15, 23, 42, 0.03)",
  "premium-xl": "0 20px 30px -4px rgba(15, 23, 42, 0.12), 0 8px 12px -4px rgba(15, 23, 42, 0.05)",
} as const;

export const radii = {
  sm: "0.375rem",   // 6px
  md: "0.5rem",     // 8px
  lg: "0.75rem",    // 12px
  xl: "1rem",       // 16px
  "2xl": "1.25rem", // 20px
  full: "9999px",
} as const;

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

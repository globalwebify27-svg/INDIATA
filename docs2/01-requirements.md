# Rajtantra: Enterprise Election Management & Campaign Platform
## System Requirements Specification (SRS) — Comprehensive Audit
**Document Identifier:** `RAJ-SRS-001`  
**Version:** 2.0.0 (Updated post-`portals` audit)  
**Status:** Architecture Baseline (Phase 1 Approved)  
**Date:** October 2026  

---

## 1. Project Purpose and Executive Scope

### 1.1 Purpose
Rajtantra (also designated as Indata / Rajatantra) is an enterprise-grade, multi-tenant election management, political campaign intelligence, and constituent operations platform. It provides end-to-end operational capabilities across all tiers of Indian elections:
- Voter roll indexing and Devanagari OCR extraction (> 10,000 PDF batches).
- Multi-dimensional demographic filtering (22 standard filter categories).
- Door-to-door field surveying with GPS anti-tamper verification.
- Real-time voter slip printing via portable Bluetooth thermal receipt printers.
- Automated multi-channel outreach (Meta WhatsApp Cloud API, DLT SMS, RinggAI Voice bots).
- Historical election trend analysis, Power BI analytics, and Strategy Bot RAG.
- Election merchandise marketplace and public voter data catalogue.

### 1.2 Target Electoral Scale & Hierarchy
The platform natively models and configures all Indian election hierarchies:
1. **National Elections:** Lok Sabha (General & By-elections). Hierarchy: `State -> Parliamentary Constituency -> Assembly Segment -> Booth`.
2. **State Elections:** Vidhan Sabha (General & By-elections), Rajya Sabha, Vidhan Parishad. Hierarchy: `State -> Assembly Constituency -> Booth`.
3. **Local Municipal Bodies:** Municipal Corporation (Maha-Nagar Palika), Municipal Council (Nagar Parishad), Nagar Panchayat, Ward Member/Councillor. Hierarchy: `City -> Ward -> Booth`.
4. **Panchayati Raj Bodies:** Zilla Parishad (`District -> ZP Constituency -> Booth`), Panchayat Samiti, Gram Panchayat (`Taluka -> Gram Panchayat -> Ward -> Booth`).
5. **Constitutional & Specialized Bodies:** Cantonment Boards, Cooperative Societies.

---

## 2. Platform Architecture: 4 Role-Based Portals + 2 Public Web Platforms

Following the comprehensive audit of the `portals` specifications, the complete Rajtantra ecosystem consists of **4 Role-Based Portals** and **2 Public Websites**, supported by **3 Public Microsite Tools**:

```
                                    ┌──────────────────────────────────────────────────┐
                                    │               RAJATANTRA ECOSYSTEM               │
                                    └────────────────────────┬─────────────────────────┘
                                                             │
         ┌───────────────────────────────┬───────────────────┴───────────────┬───────────────────────────────┐
         │                               │                                   │                               │
         ▼                               ▼                                   ▼                               ▼
┌─────────────────┐             ┌─────────────────┐                 ┌─────────────────┐             ┌─────────────────┐
│  SUPER ADMIN    │             │   DISTRIBUTOR   │                 │ CANDIDATE ADMIN │             │   KARYAKARTA    │
│  PORTAL (Web)   │             │   PORTAL (Web)  │                 │ WAR ROOM (Web)  │             │ FIELD WORKSPACE │
│ Global Platform │             │ Channel Partner │                 │ Campaign HQ     │             │ - Mobile App    │
│ & Data Control  │             │ & Sales Portal  │                 │ 19 Core Modules │             │ - Web Portal    │
└─────────────────┘             └─────────────────┘                 └─────────────────┘             └─────────────────┘
         │                               │                                   │                               │
         └───────────────────────────────┼───────────────────────────────────┴───────────────────────────────┘
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
              ┌─────────────────────┐         ┌─────────────────────┐
              │    MAIN DISPLAY     │         │     E-COMMERCE      │
              │  MARKETING WEBSITE  │         │     MARKETPLACE     │
              │  - Software SaaS    │         │  - Campaign Items   │
              │  - Voter Data Shop  │         │  - Vendor Accounts  │
              └─────────────────────┘         └─────────────────────┘
```

### 2.1 The 4 Role-Based Portals
1. **Super Admin / Platform Owner Portal:** The highest authority console. Controls global candidate records, distributor accounts, registration approvals, service enquiries, global pricing visibility switch, credit allocations, centralized dropdown filter management, and platform audit logs.
2. **Distributor / Channel Reseller Portal:** Restricted partner portal. Manages assigned candidates, features a 12-step Candidate Creation wizard, tracks candidate enquiries in read-only mode, and manages wholesale sales margins.
3. **Candidate Admin / Campaign War Room Panel:** The central operational command hub for candidates and campaign managers across 19 numbered functional areas (from voter filtering and field tracking to automated birthday messaging and strategy bots).
4. **Karyakarta / Field Worker Workspace (Dual Delivery):**
   - **Native Mobile App (Flutter):** Android/iOS offline-first client with activation key login, sub-50ms search, 4-color sentiment tagging, 26-question geo-surveys, and Bluetooth thermal printing.
   - **Dedicated Karyakarta Web Portal (Next.js):** Desktop/tablet browser interface providing identical field capabilities for laptop-wielding volunteers and booth table agents.

### 2.2 The 2 Separate Public Websites
1. **Main Display Marketing Website (SaaS Showcase & Voter Data Shop):**
   - Public SaaS product showcase referencing `voterx.in` and `opvyap.com`, featuring product demos, plan comparisons, and video banners.
   - **Public Voter Data Catalogue (Marketplace):** Location-based catalog where users can browse official voter lists by State -> District -> Constituency -> Booth, view verified record counts, and purchase structured Excel/CSV downloads.
   - Direct candidate registration enquiry onboarding and distributor referral routing.
2. **E-Commerce Campaign Products Marketplace:**
   - Standalone marketplace for campaign supplies: caps, flags, banners, posters, promotional clothing, and audio gear.
   - Multi-vendor architecture: Vendor self-registration, Super Admin vendor approval, vendor product catalog, customer cart/checkout, vendor listing fees, and platform sales commission.

### 2.3 The 3 Public Microsite Tools
1. **Public EVM Demo Simulator:** Realistic interactive voting machine replica with sound feedback, candidate symbols, and custom subdomains (`candidate.rajtantra.in`).
2. **Public Citizen Voter Search Landing Page:** Branded public voter search page. **Strict Rule:** Supports **Name Search ONLY** (no EPIC, mobile, or house number search) to comply with ECI citizen privacy rules.
3. **Public Cadre Volunteer Registration Link:** Public volunteer onboarding page generating digital QR-coded ID cards.

---

## 3. Subscription, Licensing & Pricing Management Rules

### 3.1 Global Pricing Visibility Toggle
The Super Admin panel maintains a global switch: **"Show Service Pricing to All Candidates"** (Enabled/Disabled).
- **When Enabled:** Configured standard prices for software plans, campaign recharges, and data packages are displayed across all candidate interfaces and public pages.
- **When Disabled:** All prices are hidden from candidate-facing pages and APIs. Buttons change to *"Enquire Now"* or *"Request a Quote"*. Quotations are negotiated through the enquiry workflow. APIs must never expose hidden price fields.

### 3.2 Two Distinct Software Subscription Modules
Candidates select between two separate subscription modules:
1. **Office Module (Constituency Office Operations):**
   - Targeted at sitting representatives or year-round political offices.
   - Terms: **6-Month Plan** or **12-Month Plan**.
   - Available **With AI Mode** or **Without AI Mode**.
2. **Election Module (Active Campaign War Room):**
   - Targeted at active election campaigns.
   - Pricing: Dynamic, determined via registration enquiry review based on constituency scale and booth count.
   - Validity: Begins on confirmed activation date and extends until **15 days after the official election polling date**.
   - Available **With AI Mode** or **Without AI Mode**.

### 3.3 Separation of Registration Enquiry from Subscription Purchase
- **Registration Enquiry:** Candidate profile, party details, election type, election geography, and initial data/service requirements are collected **during initial registration**.
- **Subscription Purchase:** The subscription page reuses previously submitted registration details. Candidates never re-enter their election details or geography when purchasing or renewing subscriptions.

### 3.4 Two-Tier Payment & Settlement Workflows
1. **Direct Candidate Flow:**
   `Candidate Request -> Super Admin Review & Quotation -> Direct Payment Settlement -> Super Admin Payment Verification -> Service Fulfilment -> Request Approved / Activated`.
2. **Distributor-Based Candidate Flow:**
   `Candidate Request -> Distributor Coordination -> Super Admin Quotation -> Candidate Pays Distributor -> Distributor Settles with Super Admin -> Super Admin Verifies Settlement -> Service Fulfilment -> Super Admin Approves`.
   *(Crucial Rule: Payment to Distributor and Settlement with Super Admin are separate financial records. Super Admin must verify settlement before service is fulfilled).*

---

## 4. Candidate Admin Portal: Detailed 19-Part Functional Architecture

The Candidate Admin Portal implements the standardized 19-part architecture:
- **Part 00: Authentication & Registration Enquiry:** Single-entry login, comprehensive registration wizard, forgot password. Note: Candidate-specific login screen customization is allowed on mobile only; web maintains uniform company branding.
- **Part 01: Global Website Shell:** Header with Global Search (voters, users, booths, campaigns), Global AI Mode (with SQL execution pipeline and MCP connectors), System Notification center, Profile & Organization switcher, and Subscription Management.
- **Part 02: War Room Executive Dashboard:** Constituency voter metrics, caste distribution charts, booth progress indicators, worker activity feed.
- **Part 03: User & Workforce Management:**
  - `03.0`: User Dashboard (worker activity stats, slip counts).
  - `03.1`: All Users directory with role filters.
  - `03.2`: Add User with Prabhaag, Booth, and Serial Number Range constraints.
  - `03.3`: Karyakarta registration approvals and member enrollment.
  - `03.4`: Field Voter Update Request Quarantine Queue with Before/After JSON diff inspection.
- **Part 04: Centralized Filter Engine:** Dynamic category management mapped to Total Voters directory.
- **Part 05 / 14: Previous Election & Strategy (Historical Analysis):**
  - Manual Analytics & Power BI Integration.
  - Historical booth-level and locality-level election trends.
  - Strategy Bot: RAG-based AI querying historical manifestos, past election statistics, and strategy documents.
- **Part 06: User Activities (Audit Logging):** Exhaustive audit trail capturing **30 distinct system activity categories** with actor, entity, timestamp, before/after state, and IP address.
- **Part 07: Total Voters Directory:** Index of 1M+ voters with sub-second search, 22 quick filters, virtualized table rendering, bulk Excel exports, and custom data enquiry.
- **Part 08: Central Voter Profile (14 Sections & 12 Direct Actions):**
  - *Sections:* Personal Info, Address, Election Info, Occupation, Political Interest, Family Household Cluster, Survey Answers, Office Visits, Issues/Tickets, Communication Logs, Documents, Classification/Tags, Activity Timeline.
  - *Direct Actions:* Call, WhatsApp text, WhatsApp image, Conduct Survey, Create Issue, Add Note, Print Thermal Slip, Share Booth Location via WhatsApp, Share Virtual Voter Slip via WhatsApp.
- **Part 09: Phone Book:** Searchable phone directory of voters with verified numbers, direct calling shortcuts, and Excel exports.
- **Part 10 / 16:** Reserved / Extensible.
- **Part 11: Reports & Reporting Pipeline:** Pre-configured PDF/Excel reports, custom tabular builder, and AI-driven SQL report generation.
- **Part 12: Office & Issues Management:** Physical office visitor desk, fuzzy search matching incoming visitors to voter records, unmatched visitor profile creation, and complete ticket resolution lifecycle (`New -> Assigned -> In Progress -> Follow-up -> Resolved -> Closed`).
- **Part 13: Campaign Control & Automation:**
  - Automated Birthday Wishes scheduler with WhatsApp/SMS templates.
  - Bulk & Solo campaign execution via Meta WhatsApp Cloud API, DLT SMS, and RinggAI voice bots.
  - Consumable credit balance monitoring and recharge requests.
- **Part 15: BLO Information:** Government Booth Level Officer contact directory mapped to polling booths.
- **Part 17: Profile & Party Settings:** Candidate profile, party symbols, constituency configuration, multi-language selection (Marathi, Hindi, English), notification preferences, and Mobile App Theme/Splash Customizer.
- **Part 18: Live Field Map:** Interactive GIS map displaying live GPS locations, route histories, and canvassing statuses of active Karyakartas.
- **Part 19: Logout & Session Invalidation.**

---

## 5. Comprehensive Notification Engine (4 Distinct Categories)

As specified in the `Software notification Document.docx`, the platform implements 4 distinct notification streams differentiated by visual header banners:

| Category | Visual Theme | Purpose & Content | Target Audience | Example Codes |
|---|---|---|---|---|
| **1. System Notifications** | **Neutral White Banner** | Critical operational events, account approvals, booth assignments, survey update decisions, printing errors, payment confirmations, subscription expirations. Direct, informative tone. | Affected Users, Admins, Workers | `SYS-01` to `SYS-54` |
| **2. Engagement Notifications** | **Cyan-Blue Banner** | Feature discovery, onboarding walkthroughs, resume incomplete surveys, exploration of advanced filters, AI mode adoption hints. | Eligible Workers & Admins | `ENG-01` to `ENG-13` |
| **3. Strategic Intelligence Notifications** | **Light-Red Banner** | AI-driven operational insights: turnout drop alerts, unvisited high-priority voter clusters, booth favorability anomalies, urgent follow-up deadlines. | Campaign Managers & Candidates | `INT-01` to `INT-25` |
| **4. Candidate Admin Notifications** | **Purple Banner** | Manual announcements, rally alerts, training meetings, and campaign directives dispatched by Candidate Admin to field workers. | Assigned Karyakartas | `ADM-01` to `ADM-10` |

---

## 6. Internal Backend Data Engines (Non-User Facing)

1. **Bulk Voter Data Extraction Pipeline (OCR):**
   - Ingests > 10,000 PDF voter lists (300–500 voters/page) in Marathi and English.
   - Extracts: `AC_NO`, `PART_NO`, `SLNOINPART`, `section_no`, `house_no`, `name_local`, `name_en`, `age`, `gender`, `relation_type`, `relative_name`, `epic_number`.
   - Flags low-confidence scans for human verification before database loading.
2. **Historical Election Data Synchronization:**
   - Matches latest official electoral rolls against historical voter databases via EPIC and multi-field fuzzy matching.
   - Transfers candidate survey responses, classifications, and contact tags without overwriting historical records.
3. **External Contact Database Synchronization:**
   - Ingests external voter phone/email datasets with automated field normalization and match confidence scoring.
4. **Centralized Dropdown Filter Management:**
   - Super Admin controls dropdown taxonomy (caste lists, election types, status choices) centrally without code deployments.

---
*End of Enhanced Requirements Specification (v2.0.0).*

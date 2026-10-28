# Rajtantra: Incremental Implementation Roadmap
**Document Identifier:** `RAJ-ROA-005`  
**Version:** 1.0.0  
**Status:** Architecture Baseline (Phase 1)  
**Date:** October 2026  

---

## 1. Roadmap Overview & Phased Milestones

To manage the extensive scope of Rajtantra across 5 core portals and applications, the development lifecycle is structured into **11 sequential, risk-mitigated phases**. Each phase produces verified, independently testable deliverables.

```
Phase 1: Architecture & Planning [CURRENT]
   │
   ▼
Phase 2: Monorepo & Dev Setup ────────► Phase 3: UI Design System & Shells
                                                 │
                                                 ▼
Phase 5: Core DB & API ◄─────────────── Phase 4: Dual-Track Auth & RBAC
   │
   ▼
Phase 6: First E2E Module (Voter Master Roll & 22 Filters)
   │
   ▼
Phase 7: Field Operations (Booths, Karyakartas, Mobile App, 26Q Survey)
   │
   ▼
Phase 8: Portal Aggregation (Super Admin, Distributor, Public Microsites)
   │
   ▼
Phase 9: External Integrations (Payments, WhatsApp, RinggAI Voice, Bluetooth Print)
   │
   ▼
Phase 10: Security, Concurrency & DPDP Compliance
   │
   ▼
Phase 11: Production Deployment, Monitoring & Go-Live
```

---

## 2. Detailed Phase Breakdown

---

### Phase 1: Requirements Analysis & Technical Architecture
- **Goal:** Complete exhaustive audit of legacy documentation, establish architectural blueprints, and finalize database contracts.
- **Deliverables:**
  - `docs/01-requirements.md` (Functional & non-functional requirements)
  - `docs/02-architecture.md` (Monorepo and modular monolith design)
  - `docs/03-database-design.md` (Relational schema and indexing plan)
  - `docs/04-coding-standards.md` (Clean architecture and code rules)
  - `docs/05-implementation-roadmap.md` (This document)
  - `docs/06-architecture-decisions.md` (Architecture decision register)
- **Dependencies:** Access to all source documents, legacy wireframes, and workflow diagrams.
- **Acceptance Criteria:** Formal sign-off on domain entities, tenant isolation invariants, and module boundaries.
- **Risks:** Unresolved conflicts between legacy documents. *Mitigation:* Explicitly logged in decision register.
- **Tests:** Architectural review and consistency audit across documents.

---

### Phase 2: Monorepo & Development Environment Setup
- **Goal:** Establish Turborepo monorepo scaffolding with shared configurations and local Dockerized services.
- **Deliverables:**
  - `pnpm-workspace.yaml`, `turbo.json`, and root package configurations.
  - `docker/docker-compose.yml` orchestrating MySQL 8.0, Redis 7.0, and MinIO storage.
  - Shared package `@rajtantra/config-typescript` and `@rajtantra/config-eslint`.
  - Application skeleton folders (`apps/web-candidate`, `apps/web-superadmin`, `apps/web-distributor`, `apps/api-core`, `apps/mobile-karyakarta`).
- **Dependencies:** Phase 1 sign-off.
- **Acceptance Criteria:** `pnpm install` and `pnpm build` execute cleanly with zero errors across all workspaces. Docker containers start with healthy status.
- **Risks:** Tooling version conflicts (Node.js 20+ vs. Flutter SDK). *Mitigation:* Enforce `.nvmrc` and strict engine locks.
- **Tests:** Monorepo build and lint smoke tests in GitHub Actions.

---

### Phase 3: Design System & Application Shells
- **Goal:** Construct reusable UI component library and responsive layout shells across all web portals.
- **Deliverables:**
  - Shared package `@rajtantra/ui` implementing Tailwind CSS v4 and Shadcn UI.
  - Core UI primitives: Data tables, modal dialogs, status badges, filter chips, metric cards, skeleton loaders.
  - Candidate War Room navigation shell (sidebar, breadcrumbs, tenant switcher, user profile).
  - Super Admin and Distributor dashboard shells.
- **Dependencies:** Phase 2.
- **Acceptance Criteria:** UI components render consistently in dark and light modes with full keyboard accessibility.
- **Risks:** Inconsistent styling across portals. *Mitigation:* Single source of truth in `@rajtantra/ui`.
- **Tests:** Storybook / component visual regression tests.

---

### Phase 4: Authentication & Dual-Track RBAC
- **Goal:** Implement secure dual-track authentication for web operators and mobile field workers.
- **Deliverables:**
  - Database migrations for `users`, `karyakartas`, and `distributors`.
  - NestJS `AuthModule`: Password login with bcrypt, 2FA TOTP verification, JWT access & refresh tokens.
  - Karyakarta 6-character activation key validator with device UUID hardware binding.
  - `TenantIsolationGuard` and `@Roles()` decorator guards.
- **Dependencies:** Phase 2, Phase 3.
- **Acceptance Criteria:** Web users authenticate with email/password; field workers authenticate with 6-character key; invalid tenant cross-access throws 403 Forbidden.
- **Risks:** Device spoofing on mobile app. *Mitigation:* Hardware UUID bound to activation record in database upon first activation.
- **Tests:** Unit tests for token generation; integration tests for guard enforcement across roles.

---

### Phase 5: Core Database & API Foundations
- **Goal:** Instantiate core Prisma schema and shared API response/error middleware.
- **Deliverables:**
  - `packages/database`: Full Prisma schema with composite indexes and migration runner.
  - Global `AllExceptionsFilter`, `TransformInterceptor`, and `ZodValidationPipe`.
  - Organization provisioning service with automated trial period calculation (5-day trial).
- **Dependencies:** Phase 4.
- **Acceptance Criteria:** `prisma migrate deploy` executes cleanly against MySQL 8.0; global interceptors format all responses to the standard API envelope.
- **Risks:** Database migration failures. *Mitigation:* Automated rollback tests in CI.
- **Tests:** Prisma schema validation and integration tests with ephemeral Testcontainers.

---

### Phase 6: First Complete End-to-End Module: Voter Roll & 22 Quick Filters
- **Goal:** Deliver the mission-critical core of Rajtantra: Voter master roll indexing, sub-second search with 22 quick filters, and the 4-step voter modal.
- **Deliverables:**
  - Asynchronous CSV/Excel voter roll bulk importer powered by BullMQ.
  - Query engine supporting all **22 Quick Filter Categories** (A-Z, Age brackets, Caste, Color code, Booth, Living status, Shift status, Duplicate flag, etc.).
  - Candidate Web Panel: High-density interactive Voter Directory table with virtualized scrolling.
  - Comprehensive 4-Step Voter Inspection Modal (Identity, Demographics, Sentiment, Contact/Welfare).
  - One-tap 4-color sentiment tagging API updating voter status in real-time.
- **Dependencies:** Phase 5.
- **Acceptance Criteria:** Querying 500,000 voter records with multi-facet filters executes in < 200ms; bulk import processes 10,000 records in < 30 seconds.
- **Risks:** High query latency on unindexed text search. *Mitigation:* MySQL FULLTEXT indexes on English and local script voter names.
- **Tests:** Load testing filter queries with 1,000,000 mock voter rows; E2E Playwright tests for 4-step modal.

---

### Phase 7: Field Operations & Mobile App
- **Goal:** Deliver Booth management, Karyakarta tracking, the Flutter mobile app, and the 26-question doorstep survey engine.
- **Deliverables:**
  - Booth master directory, BLO contact registry, and Karyakarta assignment mapping.
  - Flutter Mobile App: Activation login, local encrypted Drift SQLite database, sub-50ms offline voter search.
  - Mobile 4-color voter sentiment tagger and doorstep survey wizard (26 questions) with GPS anti-tamper validation.
  - Worker live GPS heartbeat and War Room live volunteer tracking map.
  - Field Voter Update Request Quarantine Queue with Admin Before/After diff approval screen.
- **Dependencies:** Phase 6.
- **Acceptance Criteria:** Mobile app searches voters and records surveys without active internet; background sync pushes pending surveys when connectivity returns.
- **Risks:** Workers falsifying survey submissions. *Mitigation:* Enforce hardware GPS accuracy verification (< 25m) and submission timestamp checks.
- **Tests:** Offline-to-online sync integration tests; mobile unit tests for Drift DAOs.

---

### Phase 8: Multi-Portal Integration & Public Microsites
- **Goal:** Complete the remaining management panels and public-facing constituency microsites.
- **Deliverables:**
  - **Super Admin Portal:** Global tenant management, plan license toggles (5-day demo vs. permanent), distributor commissions, audit logs.
  - **Distributor Portal:** Regional candidate provisioning, wholesale order requests, margin dashboard.
  - **Public EVM Demo Simulator:** Interactive ballot web simulator with LED glow, sound beep, and candidate branding.
  - **Public Voter Search Microsite:** Subdomain voter lookup with printable slip download.
  - **Cadre Member Directory:** 5-step member enrollment and one-click PDF Member ID card generation with QR code.
- **Dependencies:** Phase 7.
- **Acceptance Criteria:** Public microsites load at subdomains in < 1 second; Super Admin can convert trial accounts to full licenses with one click.
- **Risks:** Subdomain routing complexity. *Mitigation:* Nginx wildcard SSL and Next.js multi-tenant middleware rewrite.
- **Tests:** E2E user flows across Super Admin and Distributor portals.

---

### Phase 9: External Integrations, Payments & Thermal Printing
- **Goal:** Integrate payment gateways, messaging APIs, voice bots, and Bluetooth printing hardware.
- **Deliverables:**
  - **Two-Tier Payment Gateway:** Razorpay and Cashfree checkout for direct candidate licenses, credit packs, and thermal printer supplies.
  - **Outreach Hub:** Meta WhatsApp Cloud API broadcasts, DLT-compliant SMS gateway, and RinggAI voice bot batch calls.
  - **Bluetooth Thermal Printing Driver:** Mobile Flutter ESC/POS driver supporting 58mm/80mm printers for polling day voter slips.
  - **Campaign Office Expense Tracker:** Expense entry categorized for ECI compliance with receipt uploads.
- **Dependencies:** Phase 8.
- **Acceptance Criteria:** Verified payment webhooks immediately credit balances; mobile app connects to Bluetooth thermal printer and prints voter slip in < 3 seconds.
- **Risks:** Bluetooth pairing failure across varied Android vendor devices. *Mitigation:* Implement standard RFCOMM Bluetooth serial socket with automatic reconnect logic.
- **Tests:** Payment gateway sandbox webhook mock tests; ESC/POS byte verification tests.

---

### Phase 10: Security Hardening, Performance & DPDP Compliance
- **Goal:** Harden the platform for massive election-day traffic and verify compliance with Indian data privacy regulations.
- **Deliverables:**
  - DPDP Act 2023 compliance audit: Field-level AES-256 encryption for Aadhaar and phone numbers; strict masking of sensitive identity documents.
  - High concurrency stress testing (k6 / Artillery): Simulating 50,000 requests/minute during polling day peak.
  - Redis cache warming for polling booth voter lookups.
  - Penetration testing: Verifying zero SQL injection, XSS, or tenant leakage.
- **Dependencies:** Phase 9.
- **Acceptance Criteria:** API sustains 1,000 requests/sec with p95 response time < 350ms; zero tenant data leakage under adversarial penetration tests.
- **Risks:** Memory exhaustion under bulk export operations. *Mitigation:* Stream PDF voter books directly to cloud storage using BullMQ worker processes.
- **Tests:** Load testing scripts executed against staging cluster.

---

### Phase 11: Production Deployment, Monitoring & Go-Live
- **Goal:** Deploy production infrastructure, configure observability dashboards, and establish operational runbooks.
- **Deliverables:**
  - Dockerized multi-container deployment across managed cloud infrastructure.
  - Cloudflare Edge WAF rules, DDoS mitigation, and SSL automation.
  - Prometheus and Grafana monitoring dashboards for HTTP metrics, queue health, and database connection pools.
  - Sentry error monitoring and alerting.
  - User training guides and video walkthroughs for candidates and karyakartas.
- **Dependencies:** Phase 10.
- **Acceptance Criteria:** 99.95% uptime SLA; zero unhandled crashes; operational runbooks in place for election war room teams.
- **Risks:** High traffic spikes on election eve. *Mitigation:* Autoscaling API pods and database read replicas.
- **Tests:** Chaos engineering tests (simulating Redis and worker pod restarts).

---
*End of Implementation Roadmap — Ready for Architecture Decisions Register.*

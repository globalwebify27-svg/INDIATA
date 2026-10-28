# Rajtantra: Technical Architecture & Repository Blueprint
**Document Identifier:** `RAJ-ARCH-002`  
**Version:** 2.0.0 (Updated post-`portals` audit)  
**Status:** Architecture Baseline (Phase 1 Approved)  
**Date:** October 2026  

---

## 1. Architecture Paradigm & Rationale

Rajtantra operates as a **Unified Multi-App Monorepo with a Modular Monolith Backend**, serving 4 role-based portals, 2 standalone public web applications, and a native mobile application.

```
                              ┌─────────────────────────────────────────────────────────────┐
                              │                        CLIENT TIER                          │
                              └───────┬──────────────────────┬─────────┬──────────────┬─────┘
                                      │                      │         │              │
                 ┌────────────────────┴────────┐             │         │              │
                 │   Next.js 15 Web Portals    │             │         │              │
                 │  - Super Admin Portal       │             │         │              │
                 │  - Distributor Portal       │             │         │              │
                 │  - Candidate War Room Panel │             │         │              │
                 │  - Karyakarta Web Portal    │             │         │              │
                 │  - Main Marketing SaaS Site │             │         │              │
                 │  - E-Commerce Marketplace   │             │         │              │
                 └─────────────┬───────────────┘             │         │              │
                               │ HTTPS / WSS                 │ HTTPS   │ Bluetooth    │
                               │                             │         │ (ESC/POS)    │
                               │                 ┌───────────┴─────────┴───┐   ┌──────┴────────────┐
                               │                 │   Flutter Mobile App    ├──►│ Portable Thermal  │
                               │                 │ (Offline SQLite / Drift)│   │  Receipt Printer  │
                               │                 └───────────┬─────────────┘   └───────────────────┘
                               │                             │
                               ▼                             ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     API & REVERSE PROXY GATEWAY                                  │
│                                           (Nginx / Traefik)                                      │
└──────────────────────────────────────────────┬───────────────────────────────────────────────────┘
                                               │
                                               ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    NESTJS MODULAR MONOLITH CORE                                  │
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌──────────────────────┐ │
│ │  Auth & RBAC  │ │ Organizations │ │  Voter Core   │ │ Booths & BLO  │ │ Survey Engine (26Q)  │ │
│ └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘ └──────────────────────┘ │
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌──────────────────────┐ │
│ │ Karyakartas   │ │ Update Queue  │ │  Outreach Hub │ │ Office & Issue│ │ Central Filters    │ │
│ └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘ └──────────────────────┘ │
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌──────────────────────┐ │
│ │ Data Catalog  │ │ E-Comm Vendor │ │ Notification  │ │ ECI Expenses  │ │ Pricing & Billing    │ │
│ └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘ └──────────────────────┘ │
└──────────────────────┬───────────────────────┬───────────────────────────────┬───────────────────┘
                       │                       │                               │
                       ▼                       ▼                               ▼
       ┌────────────────────────┐  ┌──────────────────────┐  ┌────────────────────────────────────┐
       │     MySQL 8.0 CLUSTER  │  │   REDIS 7.0 CLUSTER  │  │        PYTHON AI/OCR SERVICE       │
       │     (Managed Prisma)   │  │   (Cache & BullMQ)   │  │        (FastAPI Microservice)      │
       │ - Partitioned Tables   │  │ - 10k PDF OCR Queue  │  │ - Indic EasyOCR & PyTesseract      │
       │ - Fulltext Voter Index │  │ - DLT/WhatsApp Queue │  │ - Qdrant Vector Search for RAG     │
       │ - Strict Tenant ID FKs │  │ - Turnout WebSockets │  │ - Natural Language to SQL Parsing  │
       └────────────────────────┘  └──────────────────────┘  └────────────────────────────────────┘
```

---

## 2. Monorepo Repository Structure

```
rajtantra/
├── .github/
│   └── workflows/              # CI/CD pipelines (test, lint, build, docker deploy)
├── apps/
│   ├── web-candidate/          # Candidate Admin War Room Panel (Next.js 15, 19 modules)
│   ├── web-superadmin/         # Super Admin Platform Management (Next.js 15)
│   ├── web-distributor/        # Distributor Channel Reseller Panel (Next.js 15)
│   ├── web-karyakarta/         # Karyakarta Web Workspace for laptop/tablet volunteers
│   ├── web-marketing/          # Main Display SaaS Website & Voter Data Shop (Next.js 15)
│   ├── web-ecommerce/          # Campaign Products & Merchandise Marketplace (Next.js 15)
│   ├── api-core/               # NestJS Modular Monolith API
│   ├── service-ai-ocr/         # Python FastAPI (OCR extraction, RAG, Text-to-SQL)
│   └── mobile-karyakarta/      # Flutter Mobile Application (Android / iOS)
├── packages/
│   ├── database/               # Prisma schema, migrations, seed scripts, client
│   ├── common-types/           # Shared TypeScript interfaces, DTOs, Enums
│   ├── ui/                     # Shared Tailwind/Shadcn UI component library & themes
│   ├── api-client/             # Auto-generated TanStack React Query SDK
│   ├── config-eslint/          # Shared ESLint rules
│   └── config-typescript/      # Shared tsconfig definitions
├── docs/                       # Project architecture, database, API specifications
├── docker/
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   ├── Dockerfile.ai
│   └── docker-compose.yml      # Local development cluster (MySQL, Redis, MinIO)
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

---

## 3. Backend Module Boundaries (`apps/api-core/src/modules/`)

1. **`auth`:** Dual-track JWT authentication (Credentials + 2FA for Web; 6-character activation key + hardware UUID for Mobile/Field).
2. **`organizations`:** Multi-tenant candidate campaign accounts, election hierarchies, and plan statuses (`TRIAL`, `OFFICE_6M`, `OFFICE_12M`, `ELECTION`).
3. **`distributors`:** Distributor accounts, assigned candidate pipelines, wholesale discounts, and margin settlement tracking.
4. **`voters`:** Core electoral roll, sub-second search, 22 quick filter queries, 4-step modal data, and 4-color sentiment tagging.
5. **`booths` & `blo`:** Polling station registry, GPS coordinates, historical turnout stats, and government BLO contact records.
6. **`karyakartas`:** Field volunteer management, device binding resets, and real-time GPS telemetry.
7. **`update-requests`:** Quarantine approval queue for field voter modifications.
8. **`surveys`:** 26-question dynamic survey engine, GPS anti-tamper validation, and cross-tabulated reporting.
9. **`members`:** Cadre volunteer registry and QR-coded digital ID card PDF generator.
10. **`outreach`:** WhatsApp Business Cloud API, DLT SMS gateway, automated birthday wishes scheduler, and RinggAI voice bot batches.
11. **`office-issues`:** Visitor fuzzy search desk and 6-stage issue ticket lifecycle.
12. **`filters`:** Centralized dropdown filter group management and options propagation.
13. **`data-catalog`:** Public voter data marketplace listings, booth selection cart, and secure Excel downloads.
14. **`ecommerce`:** Multi-vendor campaign merchandise marketplace, orders, listing fees, and platform commission ledger.
15. **`notifications`:** 4-stream notification engine (System [White], Engagement [Cyan-Blue], Strategic Intelligence [Light-Red], Admin [Purple]).
16. **`pricing-billing`:** Global pricing visibility switch, custom quotation workflow, Razorpay/Cashfree webhooks, and separate candidate payment vs distributor settlement records.
17. **`audit-log`:** Regulatory audit trail tracking all 30 system activity categories.
18. **`ai-gateway`:** Proxy connector to the Python AI/OCR microservice.

---

## 4. API Response Envelope & Error Codes

Every API endpoint complies with the uniform response contract:
```typescript
interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
  timestamp: string;
  requestId: string;
}
```

---
*End of Technical Architecture Specification (v2.0.0).*

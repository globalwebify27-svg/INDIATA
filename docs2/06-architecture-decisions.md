# Rajtantra: Architecture Decision Register (ADR)
**Document Identifier:** `RAJ-ADR-006`  
**Version:** 2.0.0 (Updated post-`portals` audit)  
**Status:** Architecture Baseline (Phase 1 Approved)  
**Date:** October 2026  

---

## 1. Decision Register Summary

| ADR ID | Decision Title | Status | Date |
|---|---|:---:|---|
| **ADR-001** | Modular Monolith Backend vs. Distributed Microservices | **ACCEPTED** | Oct 2026 |
| **ADR-002** | MySQL 8.0 with Prisma ORM for Core Relational Storage | **ACCEPTED** | Oct 2026 |
| **ADR-003** | Next.js 15 (App Router) for Multi-Portal Web Frontends | **ACCEPTED** | Oct 2026 |
| **ADR-004** | Flutter (Dart) with Drift (SQLite) for Karyakarta Mobile App | **ACCEPTED** | Oct 2026 |
| **ADR-005** | Redis 7.0 with BullMQ for Background Queues & Export Streaming | **ACCEPTED** | Oct 2026 |
| **ADR-006** | Dual-Track Authentication (Credentials vs. Activation Key) | **ACCEPTED** | Oct 2026 |
| **ADR-007** | Shared Database with Row-Level Tenant Partitioning (`organization_id`) | **ACCEPTED** | Oct 2026 |
| **ADR-008** | Quarantine Queue for Field Voter Updates (Human-in-the-Loop Verification) | **ACCEPTED** | Oct 2026 |
| **ADR-009** | Dedicated Python Microservice for Indic OCR Extraction & Vector RAG | **ACCEPTED** | Oct 2026 |
| **ADR-010** | Official Meta WhatsApp Business Cloud API vs. Web Automation Bots | **ACCEPTED** | Oct 2026 |
| **ADR-011** | Global Pricing Visibility Switch Architecture (Frontend & API Redaction) | **ACCEPTED** | Oct 2026 |
| **ADR-012** | Dual Delivery of Karyakarta Workspace (Mobile App + Dedicated Web Portal) | **ACCEPTED** | Oct 2026 |
| **ADR-013** | Separation of Core Election Portals from Campaign E-Commerce Marketplace | **ACCEPTED** | Oct 2026 |
| **ADR-014** | Registration Enquiry vs. Subscription Purchase Decoupling | **ACCEPTED** | Oct 2026 |

---

## 2. Additional Architecture Decision Records (ADR-011 to ADR-014)

---

### ADR-011: Global Pricing Visibility Switch Architecture

#### Context & Problem Statement
Political campaign software in India often operates on negotiated commercial quotations depending on constituency size, alliance structures, and bulk hardware. The platform requires a Super Admin global toggle: "Show Service Pricing to All Candidates".

#### Decision & Rationale
When pricing visibility is disabled, candidate-facing UI must display "Enquire Now" or "Request a Quote".
**Crucial API Security Rule:** Price redaction must be enforced at the API serializer level, not merely by hiding CSS buttons in React. If a candidate queries `/api/v1/plans` while pricing is disabled, the `price` field must return `null` or `"UPON_ENQUIRY"` to prevent client-side inspection.

---

### ADR-012: Dual Delivery of Karyakarta Workspace (Mobile App + Dedicated Web Portal)

#### Context & Problem Statement
Field volunteers canvassing door-to-door require an offline Android/iOS app with Bluetooth printer connectivity. However, desk-bound volunteers stationed at political party offices or booth tables frequently operate on laptops, desktop PCs, or Chromebooks where Android APKs cannot run natively.

#### Decision & Rationale
We provide a **Dedicated Karyakarta Web Portal (`apps/web-karyakarta`)** alongside the Flutter mobile application. Both share identical role-based API endpoints, offline-capable service workers, voter search algorithms, and the 26-question survey engine, while strictly preventing Karyakartas from accessing Candidate Admin management screens.

---

### ADR-013: Separation of Core Election Portals from Campaign E-Commerce Marketplace

#### Context & Problem Statement
The platform provides physical election merchandise (caps, flags, banners, badges) through an open vendor marketplace. Mixing vendor accounts, shopping carts, and physical parcel tracking with high-security voter roll databases risks data leakage and clutter.

#### Decision & Rationale
The E-Commerce Marketplace is deployed as a distinct web application (`apps/web-ecommerce`) with its own database schema namespace (`vendors`, `marketplace_products`, `marketplace_orders`). Candidates can click "Shop Merchandise" from the Candidate Admin Portal, which redirects to the marketplace with single sign-on (SSO) token handover.

---

### ADR-014: Registration Enquiry vs. Subscription Purchase Decoupling

#### Context & Problem Statement
In earlier legacy drafts, candidates were prompted to re-enter candidate names, party logos, election dates, and constituency booth selections every time they purchased a subscription or recharge.

#### Decision & Rationale
We completely decouple Registration from Subscription:
1. **Registration Enquiry:** Collects candidate profile, party symbol, election type, and geographical hierarchy once.
2. **Subscription Purchase:** Reuses the existing organization record. Candidates merely pick the module (`Office Module` [6m/12m] vs `Election Module` [until polling day + 15 days]), toggle `AI Mode`, and submit their enquiry without re-entering election data.

---
*End of Architecture Decision Register (v2.0.0).*

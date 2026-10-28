# RAJTANTRA & VOTERX UNIFIED PLATFORM
## MASTER ARCHITECTURAL PLAN & SYSTEM ENGINEERING SPECIFICATION
**Product:** Election Management & Political Campaign Intelligence Platform  
**Authors:** Senior Full-Stack Software Architect & CTO Advisory (DeepMind Engineering Pair)  
**Version:** 2.0 Production Master Blueprint  
**Primary Source of Truth:** Provided Documentation (`VoterX Client Panel`, `Current Website Documentation`, `New Features for Election Management`, `Mobile App Documentation`, `Feature Comparison`, `Quotation RajTantra`).

---

## TABLE OF CONTENTS
1. [PART 1 — Product Understanding & Conceptual Architecture](#part-1--product-understanding--conceptual-architecture)
2. [PART 2 — System Architecture & Technology Stack Evaluation](#part-2--system-architecture--technology-stack-evaluation)
3. [PART 3 — Application Structure Breakdown](#part-3--application-structure-breakdown)
4. [PART 4 — User Roles & Permissions Matrix](#part-4--user-roles--permissions-matrix)
5. [PART 5 — Authentication, Activation & Session Management](#part-5--authentication-activation--session-management)
6. [PART 6 — Client Web Panel Deep-Dive](#part-6--client-web-panel-deep-dive)
7. [PART 7 — Super Admin Web Panel Deep-Dive](#part-7--super-admin-web-panel-deep-dive)
8. [PART 8 — High-Performance Voter Management & Filtering Engine](#part-8--high-performance-voter-management--filtering-engine)
9. [PART 9 — Comprehensive Voter Profile & Sensitive Field Shielding](#part-9--comprehensive-voter-profile--sensitive-field-shielding)
10. [PART 10 — Member vs. Worker Architecture & Assignment Logic](#part-10--member-vs-worker-architecture--assignment-logic)
11. [PART 11 — Booth Management & Electoral Roll Comparison](#part-11--booth-management--electoral-roll-comparison)
12. [PART 12 — Booth Level Officer (BLO) Management](#part-12--booth-level-officer-blo-management)
13. [PART 13 — Forms, Surveys & Geo-Tagged Doorstep Verification](#part-13--forms-surveys--geo-tagged-doorstep-verification)
14. [PART 14 — Centralized Asynchronous Report & Export Engine](#part-14--centralized-asynchronous-report--export-engine)
15. [PART 15 — AI Mode: Agentic AI Digital Karyakarta](#part-15--ai-mode-agentic-ai-digital-karyakarta)
16. [PART 16 — AI Query Search (Natural Language to Structured SQL Filters)](#part-16--ai-query-search-natural-language-to-structured-sql-filters)
17. [PART 17 — AI Report Generation (Natural Language to PDF/Excel/CSV)](#part-17--ai-report-generation-natural-language-to-pdfexcelcsv)
18. [PART 18 — Human-in-the-Loop AI Governance & Safety Protocols](#part-18--human-in-the-loop-ai-governance--safety-protocols)
19. [PART 19 — Subscription-Based AI Seat Access Control](#part-19--subscription-based-ai-seat-access-control)
20. [PART 20 — RAG Historical Election Analysis Subsystem](#part-20--rag-historical-election-analysis-subsystem)
21. [PART 21 — AI WhatsApp & SMS One-Way Campaign System](#part-21--ai-whatsapp--sms-one-way-campaign-system)
22. [PART 22 — AI Voice Calling One-Way Campaign System](#part-22--ai-voice-calling-one-way-campaign-system)
23. [PART 23 — Centralized Campaign & Script Management](#part-23--centralized-campaign--script-management)
24. [PART 24 — Unified Dashboard Architecture](#part-24--unified-dashboard-architecture)
25. [PART 25 — Relational Database Architecture (Prisma/MySQL Schema)](#part-25--relational-database-architecture-prismamysql-schema)
26. [PART 26 — REST API Architecture & Routing Hierarchy](#part-26--rest-api-architecture--routing-hierarchy)
27. [PART 27 — Enterprise Security & Tenant Isolation](#part-27--enterprise-security--tenant-isolation)
28. [PART 28 — Cloud File Management & Storage Lifecycles](#part-28--cloud-file-management--storage-lifecycles)
29. [PART 29 — Push Notifications System (FCM)](#part-29--push-notifications-system-fcm)
30. [PART 30 — Flutter Mobile Application Architecture](#part-30--flutter-mobile-application-architecture)
31. [PART 31 — Multi-Language Support (English, Hindi, Marathi)](#part-31--multi-language-support-english-hindi-marathi)
32. [PART 32 — Scalability & High-Performance Optimization (1M+ Records)](#part-32--scalability--high-performance-optimization-1m-records)
33. [PART 33 — Background Job System (BullMQ & Redis Workers)](#part-33--background-job-system-bullmq--redis-workers)
34. [PART 34 — Step-by-Step 24-Phase Implementation Roadmap](#part-34--step-by-step-24-phase-implementation-roadmap)
35. [PART 35 — System Dependency Map & Parallel Development Tracks](#part-35--system-dependency-map--parallel-development-tracks)
36. [PART 36 — Production Monorepo Folder Structure](#part-36--production-monorepo-folder-structure)
37. [PART 37 — Master Environment Variables Specification](#part-37--master-environment-variables-specification)
38. [PART 38 — CI/CD, Deployment & Rollback Strategy](#part-38--cicd-deployment--rollback-strategy)
39. [PART 39 — Multi-Tier Quality Assurance & Testing Strategy](#part-39--multi-tier-quality-assurance--testing-strategy)
40. [PART 40 — Final Master Architecture Diagram](#part-40--final-master-architecture-diagram)
41. [Unclear Requirements & Confirmation Items](#unclear-requirements--confirmation-items)
42. [PHASE 1 — READY TO BUILD](#phase-1--ready-to-build)

---

## PART 1 — Product Understanding & Conceptual Architecture

### 1. What is this software?
An enterprise-grade, multi-tenant **Election Management and Political Campaign Platform** that digitizes the entire electoral lifecycle: voter database management, territory-mapped field worker coordination, booth-level analytics, geo-verified doorstep surveys, automated multi-channel communication campaigns (WhatsApp, SMS, AI Voice), historical election intelligence, and day-of-election voter slip distribution.

### 2. Who uses it?
- **Super Admin (Global Webify Platform Owner)**: Manages tenants, client account types (5-day Demo vs. Permanent Sale), themes, white-label branding assets, and APK build configurations.
- **Distributors**: Regional partners managing multiple assembly/parliamentary constituencies, ward representatives, and onboarding.
- **Clients / Candidates (Organization Owners)**: MPs, MLAs, Corporators, Ward Parshads, or Party Presidents who own the campaign account, purchase subscriptions, and oversee their constituency.
- **Campaign Managers / Admins**: War-room strategists who manage data imports, approve worker update requests, manage BLOs, design surveys, and execute communication campaigns.
- **Booth Level Officers (BLOs)**: Government-appointed booth officers mapped for electoral roll coordination.
- **Field Workers / Karyakartas / Ward Parshads**: Ground workers who use the mobile app for doorstep surveys, voter classification, and voter chit distribution.
- **Voters / Citizens**: Recipients of voter slips, public surveys, and targeted campaign outreach.

### 3. What problem does it solve?
- Eliminates chaotic paper voter lists and uncoordinated spreadsheets across election war rooms.
- Stops inaccurate voter assumptions through real-time, ground-verified doorstep survey data with GPS proof.
- Breaks communication bottlenecks between war rooms and thousands of booth karyakartas.
- Prevents campaign message spam through targeted demographic and caste/scheme filtering.
- Provides real-time visibility into booth coverage, unvisited voters, and live polling day turnout.

### 4. What are the different applications/panels?
1. **Super Admin Web Panel**: Multi-tenant platform management, client creation, account type configuration (5-day Demo vs. Permanent Sale), theme/branding asset uploads, and APK build flags.
2. **Client Web Panel**: War-room command center for campaign strategy, voter board, worker assignment, master filters, update approvals, forms/surveys, reports, campaign tracking, and AI seat management.
3. **Mobile Application (Flutter for Android & iOS)**: Field-worker utility for quick voter lookup, color-coded classification, geo-tagged doorstep surveys, WhatsApp sharing, digital voter slips, and native-language AI assistant.
4. **Backend API (Node.js/NestJS)**: Central business logic, multi-tenant RBAC, REST APIs, and background job dispatch.
5. **Background Queue Workers (BullMQ/Redis)**: Asynchronous processing for bulk CSV/Excel imports, OCR, PDF report rendering, WhatsApp/SMS dispatches, and voice call scheduling.
6. **AI Agent & RAG Subsystem**: LLM-powered query parsing, report synthesis, script copywriting, and vector-search-based historical election analysis.

### 5. How do these applications communicate?
All frontends (Next.js web panels and Flutter mobile apps) communicate with the Backend API via secure HTTPS REST endpoints with JSON payloads. Real-time updates and push notifications flow from Backend &rarr; Firebase Cloud Messaging (FCM) &rarr; Mobile devices. Background jobs communicate with the backend via Redis pub/sub queues.

### 6. What is the role of the backend?
The backend serves as the single source of truth and security gatekeeper. It enforces tenant isolation (preventing Organization A from accessing Organization B), validates JWT tokens, evaluates RBAC permissions, runs database transactions via Prisma ORM, controls AI tool-calling execution, coordinates asynchronous queues, and handles external gateway integrations.

### 7. What is stored in the database?
- Multi-tenant tenant records, organizations, subscription plans, and seat assignments.
- Administrative hierarchies: Districts, Lok Sabha constituencies, Vidhan Sabha constituencies, Wards, Prabhaags, and Booths.
- Detailed voter records: Electoral details (EPIC, part, serial), personal demographics, contact details, caste categories, scheme benefits, and doorstep visit statuses.
- Member and field worker assignments, activation keys, and reactivation keys.
- Survey forms, dynamic questions, responses, and GPS geo-tags (latitude/longitude).
- Campaign records: Message templates, dispatch logs, credit balances, delivery statuses, and billing logs.
- Audit logs and worker update requests.

### 8. Where does AI fit into the system?
AI is embedded across 5 critical operational workflows:
1. **AI Mode (Digital Assistant)**: A party-branded natural-language chatbot with strict backend tool-calling for querying live database stats.
2. **AI Query Search**: Converts free-form speech or text into structured filter JSON for instant UI filtering.
3. **AI Report Generation**: Automatically extracts complex datasets matching natural language requests and renders downloadable PDF/Excel/CSV files.
4. **Campaign Copywriting & Strategy**: Generates culturally tuned WhatsApp, SMS, and Voice scripts with sentiment and tone customization.
5. **RAG Historical Analysis**: Combines structured past election voting data with unstructured party manifestos and past booth performance documents using vector embeddings.

### 9. Difference between Admin, Client, Manager, Worker, and other users
- **Super Admin**: Controls the platform across all clients and elections.
- **Distributor**: Regional franchise managing multiple client accounts.
- **Client (Organization Owner)**: The candidate or party chief who owns the data and subscription.
- **Admin**: Campaign manager with full operational control inside the client's organization.
- **Manager / Editor**: Operational lead managing data imports and booth assignments.
- **Worker / Mobile User**: Ground field worker restricted to their assigned `Prabhaag` &rarr; `Booth` &rarr; `SrNo Range`.
- **Viewer**: Read-only stakeholder/observer.

### 10. Complete User Journey
1. **Provisioning**: Super Admin creates a Client Account in Admin Panel, sets account type (5-day Demo or Permanent Sale), configures election scope (Lok Sabha &rarr; Vidhan Sabha &rarr; Area), assigns theme, and uploads branding assets.
2. **First Login & Setup**: Client/Candidate logs into Client Web Panel, sets up party profile, configures master filter values (Caste names, schemes, occupations), imports initial voter database via CSV/Excel, and sets up Booths and BLOs.
3. **Team Onboarding**: Client adds Campaign Managers (Admins/Editors) and registers Field Workers. System generates a Unique Key and Reactivation Key for each worker and assigns them to specific `Prabhaags` and `Booths`.
4. **Mobile Activation**: Worker installs mobile app, enters Activation Key, Name, and Mobile Number, and gains access to their assigned booth's voter list.
5. **Field Operations**: Worker conducts doorstep visits, records surveys with GPS location capture, updates voter contact details, flags supporters/opponents using color codes, and generates instant voter chits/slips on polling day.
6. **War Room Intelligence**: Candidate and Campaign Managers monitor real-time dashboards (gender/caste distributions, booth coverage percentages, unvisited voter counts), query the AI digital assistant for strategic insights, run one-way WhatsApp/Voice campaigns, and analyze previous election trends.

### High-Level Architecture Diagram (ASCII)

```
Super Admin
    ↓
Admin Panel (Next.js 15)
    ↓
Client Account / Organization
    ↓
Client Panel (Next.js 15)
    ↓
Users / Field Workers
    ↓
Mobile Application (Flutter Android/iOS)
    ↓
Backend REST API (Node.js / NestJS)
    ↓
Database (MySQL 8.0 via Prisma ORM)

SUPPORTING TIERS:
AI Layer: LLM Gateway + Tool Calling + Vector DB (Qdrant)
Communication Layer: WhatsApp Cloud API + SMS SMPP + RinggAI Voice
File Storage: Cloud Object Storage (AWS S3 / Firebase)
Notification System: Firebase Cloud Messaging (FCM)
External APIs: Maps, Payment Gateway, OCR Pipeline
```

---

## PART 2 — System Architecture & Technology Stack Evaluation

### 1. Web Layer: Next.js 15 (React 19)
- **Why**: App Router architecture provides Server-Side Rendering (SSR) for fast initial administrative load and lightning-fast Client-Side Rendering (CSR) for interactive dashboards, tabular voter boards, and AI streaming interfaces. Full TypeScript support ensures strict contract synchronization with backend types.

### 2. Mobile Layer: Flutter (Dart)
- **Why**: Single cross-platform codebase targets both Android and iOS with native performance. High-performance rendering engine enables smooth scrolling through thousands of cached voter records, hardware-level GPS access for geo-tagged surveys, native camera integration for voter photos/signatures, and complete offline SQLite capabilities.

### 3. Backend Layer: Node.js with NestJS Framework
- **Why**: NestJS provides enterprise-grade modular architecture, native dependency injection, decorators for RBAC guards, automatic OpenAPI/Swagger generation, and built-in support for microservices and background job dispatching. Node.js's non-blocking I/O is ideal for concurrent campaign dispatches and streaming AI responses.

### 4. Database Layer: MySQL 8.0 with Prisma ORM
- **Why**: MySQL 8.0 offers ACID guarantees, rock-solid foreign key constraints, JSON columns for flexible dynamic survey questions, and robust spatial indexes for geo-coordinates. Prisma ORM delivers type-safe query generation, automated database migrations, and client extensions for automatic multi-tenant scoping.

### 5. AI & Vector Engine: Dedicated Python/FastAPI Service + Vector DB [ARCHITECTURE RECOMMENDATION]
- **Why**: While Node.js orchestrates general business logic, RAG (Retrieval-Augmented Generation) document parsing, embedding generation, semantic chunking, and vector searches are best handled by Python (LangChain/LlamaIndex, Unstructured, Sentence-Transformers) backed by **Qdrant** or **ChromaDB**. MySQL is not optimized for high-dimensional cosine similarity search across historical election documents.

### 6. Queue & In-Memory Cache: Redis 7.0 + BullMQ
- **Why**: Handling 50,000+ voter Excel imports, background PDF generation, and burst messaging without blocking HTTP request threads requires a battle-tested distributed queue with automatic retries, backoff, and progress reporting.

### 7. Storage: AWS S3 or Firebase Storage
- **Why**: Secure, high-durability object storage for application branding, APK files, voter slips, electoral roll PDFs, and exported spreadsheets. Secure access is enforced via short-lived pre-signed URLs.

### 8. Notifications: Firebase Cloud Messaging (FCM)
- **Why**: Industry standard for reliable, cross-platform background push notifications to Android and iOS devices for campaign alerts, meeting updates, and broadcast messages.

---

## PART 3 — Application Structure Breakdown

```
======================================================================================================
APPLICATION        MODULES                         KEY COMPONENTS & RESPONSIBILITIES
======================================================================================================
1. Super Admin     - Dashboard                     Summary cards: Total Users, Demo Accounts (5-day),
   Panel             - Client Management             Sale Accounts (Permanent).
   (Next.js 15)      - Election Config               Add Client modal: Multi-step provisioning (Account ->
                     - App & Theme Config            Election -> Area/Name in EN/MR -> Branding uploads).
                     - Asset Management              Upload assets: Splash, App Icon, WhatsApp Splash,
                     - System Audit                  Printer Splash (B&W). APK build flag & Slip URL.
------------------------------------------------------------------------------------------------------
2. Client Web      - Dashboard                     4 Summary Cards, Org Score, Booth Coverage %, Gender &
   Panel             - Voter Board                   Caste charts, Top Booths by voter count, Quick Actions.
   (Next.js 15)      - Members Board                 Table/Cards view, 22 Quick Filters, Advanced Filter
                     - Booths & BLOs                 modal, Add Voter (4 steps: Identity, Profile, Work,
                     - Forms & Surveys               Political), CSV bulk upload.
                     - AI Calling & Campaigns        Members board: Registrations review, QR link generator.
                     - Master Filters                Booth board: Booth details, e-roll PDF compare, Map.
                     - Update Requests               Forms board: 26-question survey engine, live analytics.
                     - Activity Logs & Exports       AI Calling: RinggAI workspace configuration.
                     - Profile & Organization        Update Requests: Review worker edits, Approve/Reject.
                     - AI Mode Access                AI User Management: Assign/revoke purchased AI seats.
------------------------------------------------------------------------------------------------------
3. Mobile App      - Auth & Activation             Activation key login + mobile number verification.
   (Flutter)         - Field Dashboard               Booth completion bar graphs, quick stats, icon grid.
                     - Voter Search & Slips          Normal search (partial/surname), Advanced Filters.
                     - Voter Profile & Actions       Color coding (Supporter, Opponent, Doubtful, Neutral),
                     - Geo-Tagged Survey             Call direct, WhatsApp message, Print voter chit/slip.
                     - Reports & Downloads           Doorstep survey execution capturing live GPS (lat/long).
                     - AI Karyakarta Assistant       AI Assistant: Native language chat (English/Hindi/Marathi).
------------------------------------------------------------------------------------------------------
4. Backend API     - Auth & Tenancy                JWT tokens, refresh tokens, organization switcher.
   (NestJS)          - Voter & Booth Service         High-speed pagination, composite indexing, search.
                     - Field Ops Service             Prabhaag -> Booth -> SrNo range worker mapping.
                     - Dynamic Form Engine           Survey schema validation, response aggregation.
                     - Report Service                ExcelJS streaming generator, PDFKit document builder.
                     - Campaign Gateway              WhatsApp Cloud API, SMS SMPP/HTTP, RinggAI voice.
                     - Subscription Gatekeeper       Active plan check, AI seat count validation (<= limit).
------------------------------------------------------------------------------------------------------
5. AI Subsystem    - Agentic Orchestrator          Intent classifier, tool-calling loop, safety validator.
   (Node + Python)   - SQL Filter Converter          Maps natural language queries to structured JSON filters.
                     - Human-in-the-Loop Gateway     Queue for human review of write/communication scripts.
                     - RAG Pipeline                  Unstructured doc chunking, vector embedding, similarity.
======================================================================================================
```

---

## PART 4 — User Roles & Permissions Matrix

### Roles Hierarchy Defined
1. **Super Admin**: Complete platform-wide governance. Not restricted to any organization.
2. **Distributor**: Regional administrative partner. Can provision clients, manage multiple constituencies, and review subordinate activity.
3. **Organization Owner (Client)**: The political candidate or organization owner. Has absolute administrative rights within their organization.
4. **Admin (Campaign Lead)**: Senior campaign manager with full data, worker, and campaign management access.
5. **Manager / Editor**: Operational lead who can upload voter lists, edit voter details, and manage assigned booths.
6. **Worker / Karyakarta / Mobile User**: Field worker assigned to specific `Prabhaags` and `Booths`. Mobile app access only. Can view assigned voters, submit update requests, and collect surveys.
7. **Viewer**: Read-only access to dashboards, reports, and voter lists.

### Consolidated Permissions Matrix

| Feature / Action | Super Admin | Distributor | Org Owner | Admin | Manager / Editor | Worker / User | Viewer |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **System Provisioning & Branding** | CRUD | View/Create [1] | No | No | No | No | No |
| **Demo vs. Sale Account Setup** | CRUD | View Only | No | No | No | No | No |
| **Organization Management** | All Orgs | Assigned Orgs | Full (Owner) | Edit Info | View | No | View |
| **User & Worker Management** | View All | Assigned Regs | CRUD | CRUD | Assign Booths | View Self | View |
| **Access & Reactivation Keys** | Generate | Generate | Generate | Generate | View | Use Only | No |
| **Voter Data (View/Search)** | All Orgs | Assigned Orgs | Full Org | Full Org | Assigned Booths | Assigned Range | Full Org (Read) |
| **Voter Data (Add/Edit Direct)** | Yes | No | Yes | Yes | Yes | No (Request Only)| No |
| **Voter Update Requests (Approve)**| Yes | No | Yes | Yes | Yes | No (Submit Only) | No |
| **Bulk CSV/Excel Upload** | Yes | No | Yes | Yes | Yes (If Flagged) | No | No |
| **Filter Management (Caste/Scheme)**| Yes | No | CRUD | CRUD | CRUD | View Only | View Only |
| **Booth & BLO Management** | CRUD | View | CRUD | CRUD | Edit Details | View Assigned | View Only |
| **Forms & Geo-Tagged Surveys** | CRUD | View | CRUD | CRUD | View Analytics | Execute Surveys | View Analytics |
| **Reports & Excel Exports** | All Orgs | Assigned Orgs | Full Org | Full Org | Assigned Booths | Assigned (If Allowed)| View Only |
| **AI Mode Usage** | Full | No | Controlled [2]| Controlled [2]| Controlled [2] | Controlled [2]| No |
| **AI Seat Allocation** | System Level| No | Manage Seats | Manage Seats | No | No | No |
| **Campaigns (WhatsApp/SMS/Voice)** | System Level| No | Create/Approve| Create/Approve| View Status | Share Media | View Only |
| **Historical Election & RAG** | System Level| Assigned Orgs | Query/Upload | Query/Upload | Query | Query [3] | Query |

> **[1] [REQUIREMENT TO CONFIRM]**: Whether Distributors can directly provision new client accounts or only submit onboarding requests for Super Admin approval.  
> **[2] Controlled**: Access is only granted if the organization has an active AI subscription and the user has been explicitly assigned one of the available AI seats.  
> **[3] [REQUIREMENT TO CONFIRM]**: Whether mobile field workers are permitted to query the RAG Historical Analysis module or if it is restricted to web panel users.

---

## PART 5 — Authentication, Activation & Session Management

### 1. Dual-Track Authentication System
The platform implements two distinct authentication tracks:
- **Web Track (Super Admin & Client Panels)**: Standard Email/Username + Password authentication with optional multi-factor authentication.
- **Mobile Track (Field Workers / Ward Parshads)**: High-security activation key pairing (`Activation Key` + `Worker Name` + `Mobile Number`).

### 2. Password & Key Security
- Passwords hashed using **Argon2id** (or bcrypt with work factor 12).
- Unique Keys & Reactivation Keys generated using cryptographically secure 16-character alphanumeric tokens (entropy &ge; 128 bits).
- Refresh tokens hashed and stored in Redis with rotating UUID identifiers.

### 3. Step-by-Step Login & Verification Lifecycle

```
[ User Action: Enter Credentials / Key ]
                 │
                 ▼
[ POST /api/v1/auth/login ] ──────────────────────┐
                 │                                │
                 ▼                                ▼
     [ Validate Payload Format ]       [ Check Rate Limiting ]
                 │
                 ▼
     [ Fetch User & Organization ]
                 │
        ┌────────┴────────┐
        ▼                 ▼
   [ User Exists? ]   [ Is Active? ] ──(No)──► Return 403 Forbidden ("Account Inactive")
        │ (Yes)
        ▼
   [ Verify Password / Activation Key ] ──(Fail)─► Return 401 Unauthorized
        │ (Success)
        ▼
   [ Check Organization Status ]
        │
        ├── Demo Account? ──► [ Has 5 days elapsed? ] ──(Yes)──► Return 403 ("Trial Expired")
        │
        └── Sale Account? ──► [ Is Subscription Active? ] ──(No)──► Return 403 ("Subscription Lapsed")
        │
        ▼
   [ Load Role & Permission Hierarchy ]
        │
        ▼
   [ Check AI Seat Entitlement ]
        │ (Queries: subscription.aiUserLimit > count(active_ai_assigned) AND user.hasAiSeat)
        ▼
   [ Generate Access & Refresh Tokens ]
        │
        ▼
   [ Write Audit Log: "User Logged In" ]
        │
        ▼
   [ Return JSON Response & Set Secure Cookies ]
        │
        ▼
[ Client/App Redirects to Designated Dashboard ]
```

---

## PART 6 — Client Web Panel Deep-Dive

The Client Web Panel is the operational heart of the campaign. Every view is scoped to the active `organization_id`.

```
======================================================================================================
PAGE / MODULE        RESPONSIBILITIES & COMPONENTS          API ENDPOINTS         DATABASE ENTITIES
======================================================================================================
1. Dashboard         - 4 Summary Cards (Voters, Members,    GET /api/v1/dashboard   Voters, Members,
                       Booths, BLOs)                        GET /api/v1/dashboard/  Booths, BLOs,
                     - Org Score & Booth Coverage %           analytics             Surveys, Users
                     - Gender & Caste Pie Charts
                     - Top Booths Table & Quick Actions
------------------------------------------------------------------------------------------------------
2. Voter Board       - Toggle Cards / Table View            GET /api/v1/voters      Voters, Booths,
                     - 22 Quick Filter Cards                POST /api/v1/voters     VoterFamilies,
                     - Advanced Filter Drawer               PUT /api/v1/voters/:id  CasteFilters,
                     - 4-Step Add Voter Modal               DELETE /api/v1/voters   SchemeFilters
                     - CSV Bulk Upload Modal                POST /api/v1/voters/csv
------------------------------------------------------------------------------------------------------
3. Individual        - View Identity, Profile, Occupation,  GET /api/v1/voters/:id  Voters, Surveys,
   Voter Profile       Political Interest, Address tabs     PATCH /api/v1/voters/:id UpdateRequests,
                     - Actions: Direct Call, WhatsApp,      GET /api/v1/voters/:id/ VoterFamilies
                       Voter Slip Print, Star, Color Code     family
------------------------------------------------------------------------------------------------------
4. Members Board     - Members Table (Name, Mobile, Type)   GET /api/v1/members     Members,
                     - Registrations Review (Pending/Appr)  POST /api/v1/members    MemberRegistrations,
                     - QR Code Registration Generator       POST /api/v1/members/   MemberInviteLinks
                     - 5-Step Add Member & CSV Upload         generate-link
------------------------------------------------------------------------------------------------------
5. Booth Officers    - BLO Table & Cards (Name, Phone,      GET /api/v1/blo         BLOs, Booths,
   (BLO) Board         Booth, AC, PC, Source)               POST /api/v1/blo        Constituencies
                     - 2-Step Add BLO Modal (Officer->Loc)  PUT /api/v1/blo/:id
------------------------------------------------------------------------------------------------------
6. Booth Board       - Booth List (Building, Village, Ward) GET /api/v1/booths      Booths, Voters,
                     - 3-Tab Booth Detail (Insight, Voters, GET /api/v1/booths/:id  Documents, BLOs
                       Documents) & E-Roll PDF compare      POST /api/v1/booths/csv
------------------------------------------------------------------------------------------------------
7. Forms & Surveys   - Form List (Title, Audience, Status)  GET /api/v1/forms       Forms, FormQuestions,
                     - 2-Step Form Creator & 26 Questions   POST /api/v1/forms      FormResponses,
                     - Response Analytics & Submissions     GET /api/v1/forms/:id/  GeoCoordinates
                     - Geo-Tagged Doorstep Survey Viewer      analytics
------------------------------------------------------------------------------------------------------
8. Campaign &        - Live Tracking (WhatsApp, SMS, Voice) GET /api/v1/campaigns   Campaigns,
   Scripts Window    - Remaining Credits & Recharge Modal   POST /api/v1/campaigns  CampaignMessages,
                     - Script Editor (WhatsApp, SMS, Voice) GET /api/v1/scripts     CampaignScripts,
                     - Voice Call Analytics & Recordings    PUT /api/v1/scripts/:id CampaignBalances
------------------------------------------------------------------------------------------------------
9. Previous Election - Party/Candidate Historical Results   GET /api/v1/historical  HistoricalResults,
   Analysis & RAG    - Booth-Wise Vote Distribution         POST /api/v1/rag/query  HistoricalDocuments,
                     - Dedicated RAG Strategy Chatbot                               VectorEmbeddings
------------------------------------------------------------------------------------------------------
10. Master Filters   - Category Tabs (Caste, Scheme, Work,  GET /api/v1/filters     MasterFilters,
    Management         Qualification)                       POST /api/v1/filters    FilterCategories
                     - Add/Edit/Delete Filter Values        DELETE /api/v1/filters
------------------------------------------------------------------------------------------------------
11. Update Requests  - Review Worker Updates (Mobile, Addr, GET /api/v1/updates     UpdateRequests,
    & Approvals        Family, Dead, Outside)               POST /api/v1/updates/:id Voters, Users
                     - Approve / Reject Action Bar            /approve
------------------------------------------------------------------------------------------------------
12. Worker & User    - Worker Table & Status Toggles        GET /api/v1/users       Users, UserAssignments,
    Management       - Prabhaag -> Booth Assignment Modal   POST /api/v1/users      AccessKeys,
                     - Unique & Reactivation Keys View      POST /api/v1/users/:id/ Subscriptions
                     - AI Mode Access Seat Allocator          toggle-ai
------------------------------------------------------------------------------------------------------
13. Exports & Phone  - Worker-Based Voter Export            GET /api/v1/export/     Voters, Users,
    Book Management  - Dedicated Phone Book Table             worker/:id            PhoneBookRecords
                     - Async Excel/CSV Download             POST /api/v1/export/job
------------------------------------------------------------------------------------------------------
14. Organization &   - Account & Candidate Info Display     GET /api/v1/org/profile Organizations,
    Party Settings   - Party Name, Symbol, Logo Upload      PUT /api/v1/org/profile BrandingAssets,
                     - Page Theme & Color Palette Select    PUT /api/v1/org/theme   UserRoles
======================================================================================================
```

---

## PART 7 — Super Admin Web Panel Deep-Dive

The Super Admin panel manages the multi-tenant SaaS lifecycle, client onboarding, application white-labeling, and mobile app deployment configuration.

### Super Admin Client Provisioning Workflow

```
[ Super Admin Logs In ]
           │
           ▼
[ Navigate to User Management ──► Click "+ Add User" ]
           │
           ▼
[ Step 1: Account Credentials ]
   - Admin Username*
   - Contact Number* (10 digits)
   - Password* (Auto-generated secure string or custom)
           │
           ▼
[ Step 2: Election & Jurisdiction Hierarchy ]
   - Election Type* (Lok Sabha / Vidhan Sabha / Municipal / Nagar Parishad / Panchayat)
   - Sub-Part Selector (State / District)
   - Assembly / Parliamentary Constituency*
   - Area / Ward Name in English* & Marathi*
   - Election Name in English* & Marathi*
   - Application Display Name*
   - Party Name in English* & Marathi*
   - Voting Symbol Description & SVG/PNG*
           │
           ▼
[ Step 3: Contact & System Metadata ]
   - Support Helpline Number
   - Official WhatsApp Contact Number
   - Facebook Page URL & Instagram Profile URL
   - Voter Slip Public URL Base
   - Election Project Code
           │
           ▼
[ Step 4: Commercial Account Type & Tier ]
   - Account Type*: [ DEMO (5-Day Trial) ] OR [ SALE (Permanent / Annual) ]
   - Active Quotas: Max Voters, Max Workers, AI Seats Limit (e.g., 3 seats)
   - Campaign Balance Allocations: WhatsApp credits, SMS credits, Voice minutes
           │
           ▼
[ Step 5: White-Label Branding Assets & App Build ]
   - Theme Selection (Primary, Secondary, Accent Color hex codes)
   - Upload Splash Screen Image (1080x1920)
   - Upload Mobile App Icon (512x512 PNG)
   - Upload WhatsApp Banner Splash (1200x628)
   - Upload Black & White Printer Slip Logo
   - Feature Toggles:
       ☑ Allow PDF/Excel Import
       ☑ Allow Voter Image Uploads
       ☑ Enable Build APK Pipeline Trigger
           │
           ▼
[ Click "Create User" ]
           │
           ├── Writes to MySQL: `clients`, `organizations`, `subscriptions`, `branding`
           ├── Initializes default master filters & role structures
           ├── Dispatches automated Welcome SMS/WhatsApp with login credentials
           └── Returns 201 Created & redirects to Super Admin Client List
```

---

## PART 8 — High-Performance Voter Management & Filtering Engine

### 1. The 22 Quick Filters
The system provides one-click filter cards with live count badges:
1. `Male` | 2. `Female` | 3. `Name Alphabet (A-Z)` | 4. `Prabhaag` | 5. `Gan` | 6. `Electoral Part` | 7. `Karyakarta Assigned` | 8. `Booth Number` | 9. `Mobile Available / Missing` | 10. `DOB / Birth Month` | 11. `Surname Group` | 12. `Voted` | 13. `Non-Voted` | 14. `Visited` | 15. `Favorites (Starred)` | 16. `Helped (Beneficiary)` | 17. `Address / Area` | 18. `Outside Station` | 19. `Slip Printed` | 20. `Deceased (Marked Dead)` | 21. `House Number Group` | 22. `Government Scheme Beneficiary`.

### 2. Multi-Criteria Advanced Filters
Combines boolean and range operations across 7 facets:
- **Personal**: Full Name substring, Surname exact, Gender enum, Age min/max, Marital Status.
- **Location**: State, Lok Sabha, Vidhan Sabha, Ward, Prabhaag, Booth range, House No, Street.
- **Contact**: Has Mobile, Has WhatsApp, Has Email, Invalid Mobile flag.
- **Work / Social**: Karyakarta assigned, Occupation tag, Caste Category (SC/ST/OBC/GEN), Specific Caste name, Education level.
- **Voting Behaviour**: Voted status, Visited status, Political alignment (Supporter/Opponent/Doubtful/Neutral).
- **Administrative Status**: Printed chit, Shifted/Outside, Deceased, Starred favorite, Assistance requested.
- **Schemes**: Filter by specific government welfare scheme enrolled.

### 3. Database Indexing Strategy for Millions of Voters
To ensure sub-100ms response times on databases containing 500,000 to 2,000,000 voter records per constituency:
- **Composite Secondary Indexes**:
  - `idx_voters_org_booth_serial` (`organization_id`, `booth_id`, `serial_number`)
  - `idx_voters_org_name` (`organization_id`, `name`)
  - `idx_voters_org_epic` (`organization_id`, `epic_number`)
  - `idx_voters_org_mobile` (`organization_id`, `mobile`)
  - `idx_voters_org_caste_gender` (`organization_id`, `caste_id`, `gender`)
  - `idx_voters_org_flags` (`organization_id`, `is_visited`, `is_voted`, `is_favourite`, `is_deceased`)
- **Full-Text Index**: `ft_voters_name_address` on (`name`, `father_name`, `address_line`) for rapid natural-language substring searches.
- **Cursor-Based Pagination**: Employs `WHERE (organization_id = ? AND id > ?) ORDER BY id ASC LIMIT 50` rather than costly `OFFSET` queries.

---

## PART 9 — Comprehensive Voter Profile & Sensitive Field Shielding

The individual voter profile consolidates data into 5 distinct operational sections:

```
+----------------------------------------------------------------------------------------------------+
|                                    INDIVIDUAL VOTER PROFILE                                        |
+----------------------------------------------------------------------------------------------------+
| 1. IDENTITY SECTION                                                                                |
|    - Full Name (EN/MR)    - EPIC Number (Voter ID)  - Gender            - Current Age & DOB        |
|    - Father / Husband Name- Marital Status          - Caste Name        - Caste Category (OBC/SC/ST|
+----------------------------------------------------------------------------------------------------+
| 2. CONTACT & PROFILE SECTION                                                                       |
|    - Mobile Number        - Alternate Mobile Number - WhatsApp Number   - Email Address            |
|    - Aadhaar Number [SENSITIVE] - PAN Number [SENSITIVE]   - Key Local Issues Noted                |
+----------------------------------------------------------------------------------------------------+
| 3. OCCUPATION & SOCIO-ECONOMIC SECTION                                                             |
|    - Industry Category    - Employment Type         - Education Level   - Annual Income Range      |
|    - Preferred Communication Channel (WhatsApp / Call / In-Person Visit)                           |
+----------------------------------------------------------------------------------------------------+
| 4. POLITICAL INTEREST & BEHAVIOUR SECTION                                                          |
|    - Political Alignment: [ SUPPORTER | OPPONENT | DOUBTFUL | NEUTRAL ]                            |
|    - Influence Level (Low / Medium / High Community Influencer) - Personality Notes               |
|    - Voted Status (Yes/No) - Visited Status (Yes/No) - Favorite (Star) - Helped (Beneficiary)       |
+----------------------------------------------------------------------------------------------------+
| 5. ADDRESS & ELECTORAL JURISDICTION SECTION                                                       |
|    - House Number         - Street / Area           - Village / Section - Prabhaag                 |
|    - Ward Number          - Booth Number & Name     - Polling Center Location & Google Maps Link   |
+----------------------------------------------------------------------------------------------------+
```

### Sensitive Data Governance [ARCHITECTURE RECOMMENDATION]
- **Aadhaar & PAN Protection**: Stored with AES-256 application-level encryption at rest. In UI and API responses, Aadhaar is masked (e.g., `XXXX-XXXX-1234`) and PAN is masked (`XXXXX1234X`).
- **Strict Role-Based Unmasking**: Only the Organization Owner (Client) has the permission to click "Unmask Sensitive Data", which generates a high-severity audit log entry. Field Workers never see full Aadhaar/PAN strings.

---

## PART 10 — Member vs. Worker Architecture & Assignment Logic

The platform strictly decouples **Members** from **Workers**:
- **Members**: Cadre members, volunteers, and party affiliates registered via public links or QR codes. They do not have administrative access to the voter database.
- **Workers (Karyakartas / Parshads)**: Operational campaign users with mobile app access credentials, explicitly assigned to voter territories.

```
                  [ Client / Campaign Manager ]
                                │
                                ▼
                       [ Create / Edit Worker ]
                                │
    ┌───────────────────────────┴───────────────────────────┐
    ▼                                                       ▼
[ Assign Prabhaag ]                                [ Configure Permissions ]
    │                                                 - Active Status (Toggle)
    ▼ (Prabhaag selection unlocks Booths)             - Allow PDF/Excel Import
[ Assign Booth(s) ]                                   - Allow Update Submissions
    │
    ▼ (Optional Granular Assignment)
[ Assign Voter Serial Number Range ] (e.g., Booth 12, SrNo 1 to 250)
    │
    ▼
[ Generate / Issue Cryptographic Keys ]
    - Unique Activation Key (For initial mobile app binding)
    - Reactivation Key (For device transfer or credential resets)
```

---

## PART 11 — Booth Management & Electoral Roll Comparison

### Electoral Roll Hierarchy
$$\text{Election} \longrightarrow \text{Constituency (PC/AC)} \longrightarrow \text{Ward / Prabhaag} \longrightarrow \text{Booth} \longrightarrow \text{Voters / Field Workers}$$

- **Booth Attributes**: Booth No, Building Name, Room No, Village/Town, Panchayat, Block, District, Assembly Constituency, Total Registered Voters.
- **Booth Insights & Analytics**:
  - Live turnout progress on polling day (Voted vs. Non-Voted count and percentage).
  - Demographic breakdown: Male vs. Female vs. Other percentages.
  - Social breakdown: Caste Category distribution bar graphs.
  - Geo-location: Exact GPS latitude/longitude pinned to Google Maps for polling center navigation.
- **Electoral Roll PDF Comparison & Accuracy Engine**:
  - Allows uploading official Election Commission e-roll PDFs for the booth.
  - Compares OCR-extracted voter counts against database records.
  - Raises accuracy alerts (`Booth Accuracy Warning`) when missing records, serial number gaps, or duplicate EPICs are identified.

---

## PART 12 — Booth Level Officer (BLO) Management

- Tracks government-appointed election officials: Full Name, Official Designation, Mobile Number, Booth Number, Vidhan Sabha, Lok Sabha, State, and Data Source.
- Serves as the primary operational contact directory for campaign managers resolving voter list objections, new registrations (Form 6), and voter deletions (Form 7).

---

## PART 13 — Forms, Surveys & Geo-Tagged Doorstep Verification

### 1. Survey & Dynamic Form Engine
- Supports 4 participant scopes: `All`, `Public`, `Voters`, `Members`.
- Lifecycle states: `Draft` &rarr; `Active` &rarr; `Closed`.
- Includes a standardized 26-question baseline election questionnaire covering: Local issues (water, roads, electricity), government scheme satisfaction, candidate preference, community influencers, and voting intention.

### 2. Geo-Tagged Survey Flow & GPS Enforcement
```
[ Worker Opens Survey for Voter on Mobile ]
                    │
                    ▼
[ Request Location Permission (ACCESS_FINE_LOCATION) ]
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
    [ Granted? ]          [ Denied? ]
         │                     │
         │ (Yes)               ▼
         │       [ Display Blocking Warning ]
         │       "GPS location is mandatory to verify doorstep survey."
         │       [ Button: "Open Device Settings" ]
         │       (Survey submission blocked without GPS coordinates)
         ▼
[ Acquire GPS Fix: Latitude, Longitude, Altitude, Accuracy (< 25m) ]
                    │
                    ▼
[ Worker Enters Survey Responses & Voter Updates ]
                    │
                    ▼
[ POST /api/v1/surveys/responses ]
   - Payload includes: voterId, formId, responses JSON,
     latitude: 18.5204, longitude: 73.8567, gpsAccuracy: 4.2m, timestamp
                    │
                    ▼
[ Backend Stores in `survey_responses` & `geo_coordinates` ]
                    │
                    ▼
[ Web Panel Displays Interactive Heatmap & Verified Doorstep Pins ]
```

---

## PART 14 — Centralized Asynchronous Report & Export Engine

To prevent long-running report queries from exhausting Node.js HTTP event loops, all exports execute asynchronously:

```
[ User Requests Report (Voter List / Survey Data / Booth Summary) ]
                               │
                               ▼
            [ POST /api/v1/reports/export-jobs ]
   - Filters: { boothId: 14, minAge: 50, isVisited: false, format: "EXCEL" }
                               │
                               ▼
            [ Enqueue Job in BullMQ: `report-generation` ]
                               │
                               ▼
            [ Return Job Token: { jobId: "rep_88921a", status: "QUEUED" } ]
                               │
                               ▼ (Worker Thread in Background)
            [ Worker Fetches Filtered Records in Streaming Batches ]
                               │
                               ▼
            [ Format Builder: ExcelJS StreamingWriter / PDFKit / fast-csv ]
                               │
                               ▼
            [ Upload Generated Artifact to AWS S3 / Cloud Storage ]
                               │
                               ▼
            [ Update DB Job Status: "COMPLETED", FileUrl: "https://s3.../report.xlsx" ]
                               │
                               ▼
            [ Notify User via FCM Push Notification & In-App Bell Alert ]
                               │
                               ▼
            [ User Clicks Alert ──► Downloads Secure Pre-Signed URL ]
```

---

## PART 15 — AI Mode: Agentic AI Digital Karyakarta

The AI Mode acts as a party-specific digital campaign assistant (*digital karyakarta*). Its name, persona, language, and introduction are customized per party (e.g., "Namaste, I am your Campaign AI Assistant").

```
[ User Voice / Text Query ] (e.g., "Show me unvisited voters in Booth 12")
                   │
                   ▼
[ Step 1: Input & Language Normalization ] (Supports Marathi, Hindi, English)
                   │
                   ▼
[ Step 2: Intent Detection & LLM Orchestrator ]
                   │
                   ├── Direct Answer / Summary?
                   ├── Data Query / Search?
                   ├── Report Generation?
                   └── Action Proposal (WhatsApp/Voice)?
                   │
                   ▼
[ Step 3: Tool-Calling Dispatch (STRICT: NO DIRECT SQL ACCESS) ]
   LLM emits structured JSON tool call:
   `executeVoterQuery({ boothNumber: 12, isVisited: false })`
                   │
                   ▼
[ Step 4: Backend Security & RBAC Interceptor ]
   - Verify active AI subscription seat for requesting user.
   - Inject `organization_id` into query filters.
   - Restrict results to worker's assigned booths if user is a Worker.
                   │
                   ▼
[ Step 5: Backend Service Executes Prisma Query ]
                   │
                   ▼
[ Step 6: Dataset Returned to LLM Orchestrator ]
                   │
                   ▼
[ Step 7: Formatted Synthesis / Interactive Graph Data Rendered to User ]
```

---

## PART 16 — AI Query Search (Natural Language to Structured SQL Filters)

The LLM converts free-form inputs into strict JSON filter schemas:
- Query: *"बूथ १५ मधील ५० पेक्षा जास्त वयाचे भेट न दिलेले मतदार दाखवा"*
- Generated Filter JSON:
```json
{
  "booth": 15,
  "ageMin": 50,
  "visited": false
}
```
The frontend receives this structured filter and automatically applies it to the active Voter Board, rendering matching voter records and an interactive demographic chart.

---

## PART 17 — AI Report Generation (Natural Language to PDF/Excel/CSV)

- User: *"Generate an Excel report of voters above 50 who have not been visited in Booths 10 to 15."*
- Engine extracts `{ boothRange: [10, 15], ageMin: 50, visited: false, outputFormat: "EXCEL" }`.
- System triggers the Asynchronous Report Queue (Part 14) and delivers a ready-to-download Excel link inside the chat conversation within seconds.

---

## PART 18 — Human-in-the-Loop AI Governance & Safety Protocols

```
+----------------------------------------------------------------------------------------------------+
|                                    AI ACTION PERMISSION TIERS                                      |
+----------------------------------------------------------------------------------------------------+
| TIER 1: READ OPERATIONS (Automated / No Human Approval Required)                                   |
|   - Search voter database          - Apply quick/advanced filters       - Generate dynamic charts  |
|   - Summarize booth performance    - Export analytical reports          - Query historical data    |
+----------------------------------------------------------------------------------------------------+
| TIER 2: WRITE / ACTION OPERATIONS (STRICT HUMAN-IN-THE-LOOP APPROVAL REQUIRED)                     |
|   - Dispatching WhatsApp campaigns - Sending bulk SMS campaigns        - Launching AI Voice calls |
|   - Modifying voter master data    - Modifying worker assignments      - Deducting campaign credits|
+----------------------------------------------------------------------------------------------------+
```

---

## PART 19 — Subscription-Based AI Seat Access Control

```
[ Client Purchases Subscription ] (e.g., Plan "Vijay 50" includes 3 AI User Seats)
                │
                ▼
[ Client Panel ──► User Management ──► AI Mode Access ]
                │
                ▼
[ Active AI Seat Allocation UI ]
   ┌─────────────────────────────────────────────────────────────┐
   | Total Purchased AI Seats: 3  |  Assigned: 3  | Available: 0  |
   |                                                             |
   |  ☑ Member A (Assigned - Active)               [Revoke Seat] |
   |  ☑ Member B (Assigned - Active)               [Revoke Seat] |
   |  ☑ Member C (Assigned - Active)               [Revoke Seat] |
   |  ☐ Member D (Unassigned - No Access)          [Assign Seat] |
   |  ☐ Member E (Unassigned - No Access)          [Assign Seat] |
   └─────────────────────────────────────────────────────────────┘
```

### Strict 7-Point Backend Validation Pipeline
Every incoming AI request passes through the `AiAccessGuard` interceptor, which executes 7 sequential checks:
1. **Client Subscription Active**: `subscription.status === 'ACTIVE'` AND `now() BETWEEN startDate AND endDate`.
2. **AI Feature Entitlement**: `subscriptionPlan.hasAiModule === true`.
3. **Tenant Membership**: Authenticated user belongs strictly to the client's `organization_id`.
4. **Individual AI Privilege**: `user.hasAiSeat === true`.
5. **Quota Integrity Check**: Database constraint ensures $\sum \text{assigned\_seats} \le \text{subscription.ai\_user\_limit}$.
6. **User Account Status**: `user.status === 'ACTIVE'`.
7. **Action-Level Scope**: User's role allows the specific requested tool action.

---

## PART 20 — RAG Historical Election Analysis Subsystem

The platform cleanly separates structured voting statistics from unstructured campaign intelligence documents:

```
+----------------------------------------------------------------------------------------------------+
|                                    HISTORICAL INTELLIGENCE REPOSITORY                              |
|                                                                                                    |
|  STRUCTURED DATA (MySQL Relational Tables)           UNSTRUCTURED DATA (Vector DB / Documents)     |
|  - Previous election vote tallies by candidate       - Past campaign manifestos & policy documents |
|  - Booth-wise vote counts (2014, 2019, 2024)         - Local political analysis & newspaper clipping|
|  - Turnout percentages & margin of victory           - Doorstep issue reports & voter sentiment text|
+---------------------------------+----------------------------------+-------------------------------+
                                  │                                  │
                                  ▼                                  ▼
                    [ SQL Analytic Engine ]            [ RAG Ingestion & Embedding Pipeline ]
                    Fast aggregated SQL queries:        1. Extract text via OCR / PDF Parser
                    `SELECT party, SUM(votes)...`       2. Recursive character chunking (500 tokens)
                                  │                     3. Generate embeddings (text-embedding-3)
                                  │                     4. Store vectors in Qdrant/ChromaDB
                                  │                                  │
                                  ▼                                  ▼
                    [ Combined Context Assembly in Prompt Engine ]
                                  │
                                  ▼
                    [ LLM Synthesizes Comprehensive Strategic Response ]
```

---

## PART 21, 22 & 23 — Centralized Campaign & Script Management

```
======================================================================================================
CAMPAIGN CHANNEL     EXECUTION FLOW & INFRASTRUCTURE       TRACKED METRICS & STATUSES
======================================================================================================
1. WhatsApp          - AI generates contextual message     - Sent, Delivered, Read, Failed.
   Campaigns           tailored to language and audience.  - Credit cost per successful delivery.
                     - Human review & approval modal.      - Template approval status (Meta BSP).
                     - Dispatched via WhatsApp Cloud API.  - Remaining WhatsApp credit balance.
------------------------------------------------------------------------------------------------------
2. Bulk SMS          - AI generates concise 160-char text. - Sent, Delivered, Failed, DND Blocked.
   Campaigns         - DLT registration template match.    - Per-message SMS gateway charges.
                     - Dispatched via SMPP/HTTP Gateway.   - Remaining SMS credits.
------------------------------------------------------------------------------------------------------
3. AI Voice          - AI generates personalized audio     - Successful (Answered), Rejected,
   Calling             script in native language.            Unanswered, Failed.
   Campaigns         - Human reviews script & voice clone. - Call duration & per-second billing.
                     - Dispatched via RinggAI Voice API.   - Call audio recording archive link.
======================================================================================================
```

---

## PART 24 — Unified Dashboard Architecture

### Metric Calculation Delegation
- **Heavy Aggregations (Backend DB / Redis)**: Total Voters, Gender Percentages, Caste Distributions, Booth Coverage %, and Top Booths by voter count are computed via optimized MySQL aggregation queries and cached in Redis with a 5-minute TTL.
- **Client-Side Visualizations (Frontend Web/Mobile)**:
  - **Client Web Panel**: Rendered as interactive **Pie Charts** (Chart.js / Recharts) for demographic shares and tabular heatmaps for booth coverage.
  - **Flutter Mobile App**: Rendered as fast, lightweight **Horizontal Bar Graphs** for instant on-field comprehension.

---

## PART 25 — Relational Database Architecture (Prisma/MySQL Schema)

### Entity Relationship Diagram (Text/ERD)

```
 [clients] 1 ──────── 1 [organizations] 1 ──────── * [users]
                             │                            │
                             ├── 1 ── [subscriptions]     ├── 1 ── [access_keys]
                             │                            │
                             ├── 1 ── [brandings]         ├── * ── [user_assignments]
                             │                            │              │
                             ├── * ── [elections]         │              ▼
                             │          │                 │          [booths]
                             │          ▼                 │              │
                             │   [constituencies]         │              ▼
                             │          │                 └───────► [voters]
                             │          ▼                                │
                             │       [wards]                             ├── * ── [surveys]
                             │          │                                │          │
                             │          ▼                                │          ▼
                             │     [prabhaags]                           │     [geo_coords]
                             │          │                                │
                             │          ▼                                ├── * ── [update_requests]
                             │       [booths] ◄── 1 ── [blos]            │
                             │                                           └── * ── [voter_families]
                             ├── * ── [members]
                             │          │
                             │          ▼
                             │   [member_registrations]
                             │
                             ├── * ── [campaigns] ── * ── [campaign_messages]
                             │
                             ├── * ── [forms] ── * ── [form_questions] ── * ── [form_responses]
                             │
                             └── * ── [audit_logs]
```

---

## PART 26 & 27 — REST API Architecture & Enterprise Security

### 1. REST API Routing Hierarchy
- `/api/v1/auth`: `POST /register`, `POST /login`, `POST /activate-mobile`, `POST /switch-org`, `POST /logout`.
- `/api/v1/users`: `GET /`, `POST /`, `PUT /:id`, `PATCH /:id/status`, `POST /:id/toggle-ai`, `GET /:id/keys`.
- `/api/v1/voters`: `GET /` (filters/pagination), `GET /:id`, `POST /`, `PUT /:id`, `POST /csv`, `POST /bulk-update`.
- `/api/v1/booths`: `GET /`, `POST /`, `GET /:id/analytics`, `POST /csv`, `POST /compare-pdf`.
- `/api/v1/blo`: `GET /`, `POST /`, `PUT /:id`, `DELETE /:id`.
- `/api/v1/members`: `GET /`, `POST /`, `POST /generate-link`, `GET /registrations`, `PATCH /registrations/:id`.
- `/api/v1/surveys`: `GET /forms`, `POST /forms`, `POST /responses` (geo-tagged).
- `/api/v1/campaigns`: `GET /`, `POST /`, `PUT /:id/script`, `POST /:id/approve-send`, `GET /balance`.
- `/api/v1/reports`: `POST /export-jobs`, `GET /export-jobs/:id`.
- `/api/v1/ai`: `POST /chat`, `POST /query-search`, `POST /generate-report`.
- `/api/v1/rag`: `POST /query`, `POST /ingest-document`.
- `/api/v1/admin`: Super Admin management endpoints.

### 2. Multi-Tenant Data Isolation Strategy
- **Prisma Client Extension Middleware**: Automatically appends `organization_id` to every query:
```typescript
prisma.$extends({
  query: {
    $allModels: {
      async findMany({ args, query }) {
        args.where = { ...args.where, organizationId: currentTenantContext.getOrgId() };
        return query(args);
      },
    },
  },
});
```

---

## PART 28 & 29 — File Management & Push Notifications

- **File Storage**: S3-compatible cloud storage organized by tenant path `tenants/{organization_id}/{asset_type}/{uuid}.{ext}`. Frontends upload using short-lived pre-signed URLs.
- **Push Notifications**: Firebase Cloud Messaging (FCM) using topic-based broadcasts for booth worker groups (`topics/org_{id}_booth_{boothNo}`) and individual campaign alerts.

---

## PART 30 & 31 — Flutter Mobile Architecture & Multi-Language Support

- **Clean Architecture Directory Structure**: Layered into `core/` (network, storage, theme, localization) and `features/` (auth, dashboard, voter_search, voter_profile, voter_slips, geo_survey, ai_mode).
- **Offline First**: Worker's assigned voter list is synced to an encrypted local SQLite database (**Drift**). Doorstep surveys recorded offline are queued and auto-synced upon reconnecting.
- **Multi-Language**: Full UI, database fields, and AI prompts support English, हिन्दी, and मराठी.

---

## PART 32 & 33 — Performance Optimization & Background Queues

- **Performance**: High-speed indexing, cursor pagination, and Redis caching ensure sub-100ms response times for 1,000,000+ voter datasets.
- **Background Job Queues (BullMQ + Redis)**:
  1. `queue:voter-import`: Processes multi-megabyte CSV and Excel voter files.
  2. `queue:report-export`: Generates complex PDF/Excel voter lists.
  3. `queue:campaign-whatsapp`: Manages rate-limited dispatches to Meta WhatsApp API.
  4. `queue:campaign-sms`: Dispatches bulk SMS via transactional SMS gateways.
  5. `queue:campaign-voice`: Initiates and monitors RinggAI voice batch calls.
  6. `queue:rag-indexing`: Chunks and embeds uploaded past election documents into vector storage.

---

## PART 34 — Step-by-Step 24-Phase Implementation Roadmap

```
======================================================================================================
PHASE       OBJECTIVE & MILESTONES                              PRIMARY DELIVERABLES
======================================================================================================
PHASE 0     Requirement Baseline & Open Confirmations           Architecture approval & API keys audit.
PHASE 1     Foundational Workspace & Monorepo Setup             NestJS backend, Next.js, Prisma, Redis.
PHASE 2     Database Schema & Multi-Tenant Migrations           MySQL normalized tables & relations.
PHASE 3     Authentication, JWT & Mobile Key Management         Registration, login, activation keys.
PHASE 4     Super Admin Panel & Client Provisioning             Client creation, branding, APK config.
PHASE 5     Client Web Panel Layout & Master Navigation         Responsive shell, sidebar, org switcher.
PHASE 6     Master Filters & Jurisdictions                      Caste, scheme, occupation management.
PHASE 7     Voter Management (Search, 22 Quick Filters)         High-speed voter board, cards & table.
PHASE 8     Voter Profile & Sensitive Data Shielding            5-section voter view, Aadhaar/PAN mask.
PHASE 9     Worker & Member Management                          Prabhaag->Booth mapping, QR links.
PHASE 10    Booth & BLO Management                              Booth insights, map, BLO directory.
PHASE 11    Update Requests & Audit Logging System              Worker edits queue, approval workflows.
PHASE 12    Forms & Dynamic Survey Module                       26-question survey builder & analytics.
PHASE 13    Asynchronous Reports & ExcelJS Exports              Streaming PDF/Excel export queues.
PHASE 14    Flutter Mobile: Auth, Voter Search & Profile        Cross-platform mobile app baseline.
PHASE 15    Flutter Mobile: Geo-Tagged Doorstep Surveys         GPS verification & offline SQLite sync.
PHASE 16    Flutter Mobile: Voter Slips & Thermal Print         Polling day digital chits & sharing.
PHASE 17    Campaign Management & Script Management             WhatsApp, SMS, Voice script editor.
PHASE 18    Third-Party Gateways (WhatsApp, SMS, RinggAI)       External provider dispatch connectors.
PHASE 19    AI Core: Agentic Assistant & Tool Calling           Digital karyakarta natural language bot.
PHASE 20    AI Query Search & Automated Report Generation       Natural language to structured SQL/Excel.
PHASE 21    AI Subscription Enforcement & Seat Allocation       Strict limit validator (e.g., 3 seats).
PHASE 22    RAG Historical Election Analysis Subsystem          Vector DB, past election document bot.
PHASE 23    Full Integration, E2E & Load Testing                Stress test with 1M simulated voters.
PHASE 24    Production Deployment, Monitoring & Hardening       CI/CD, Docker, Prometheus/Grafana.
======================================================================================================
```

---

## PART 35 — System Dependency Map & Parallel Development Tracks

```
[Phase 1: Setup] ──► [Phase 2: DB Schema] ──► [Phase 3: Auth & Keys]
                                                      │
         ┌────────────────────────────────────────────┴───────────────────────────────────────┐
         ▼                                                                                    ▼
[Phase 4: Super Admin]                                                              [Phase 5: Client Shell]
         │                                                                                    │
         │                                                            ┌───────────────────────┴───────────────┐
         │                                                            ▼                                       ▼
         │                                                  [Phase 6: Filters]                     [Phase 10: Booths & BLO]
         │                                                            │                                       │
         │                                                            └───────────────────────┬───────────────┘
         │                                                                                    ▼
         │                                                                          [Phase 7: Voter Board]
         │                                                                                    │
         │                                                            ┌───────────────────────┴───────────────┐
         │                                                            ▼                                       ▼
         │                                                  [Phase 8: Voter Profile]               [Phase 9: Workers & Members]
         │                                                            │                                       │
         │                                                            └───────────────────────┬───────────────┘
         │                                                                                    ▼
         │                                                                          [Phase 11: Update Requests]
         │                                                                                    │
         │                                                                          [Phase 12: Forms & Surveys]
         │                                                                                    │
         │                                                            ┌───────────────────────┴───────────────┐
         │                                                            ▼                                       ▼
         │                                                  [Phase 13: Reports]                    [Phase 14: Mobile App]
         │                                                            │                                       │
         │                                                            │                                       ▼
         │                                                            │                            [Phase 15: Geo-Surveys]
         │                                                            │                                       │
         │                                                            │                            [Phase 16: Voter Slips]
         │                                                            │                                       │
         │                                                            └───────────────────────┬───────────────┘
         │                                                                                    ▼
         │                                                                          [Phase 17-18: Campaigns]
         │                                                                                    │
         ▼                                                                                    ▼
[Phase 21: AI Seats Quota] ◄──────────────────────────────────────────────────────── [Phase 19-20: AI Core]
         │                                                                                    │
         └────────────────────────────────────────────┬───────────────────────────────────────┘
                                                      ▼
                                            [Phase 22: RAG Subsystem]
                                                      │
                                            [Phase 23-24: QA & Launch]
```

---

## PART 36 — Production Monorepo Folder Structure

```
election-management-platform/
├── apps/
│   ├── backend/                     # NestJS Core API
│   │   ├── src/
│   │   │   ├── common/              # Guards, interceptors, decorators, filters
│   │   │   ├── config/              # Environment configuration & validation
│   │   │   ├── modules/
│   │   │   │   ├── auth/            # JWT, password hashing, session management
│   │   │   │   ├── organizations/   # Tenant management & switching
│   │   │   │   ├── subscriptions/   # Commercial plans & AI seat licensing
│   │   │   │   ├── users/           # User management & activation keys
│   │   │   │   ├── voters/          # High-performance voter search & CRUD
│   │   │   │   ├── booths/          # Booth management & e-roll PDF compare
│   │   │   │   ├── blo/             # Booth Level Officer directory
│   │   │   │   ├── members/         # Member registrations & QR link generation
│   │   │   │   ├── surveys/         # Dynamic forms & geo-tagged survey engine
│   │   │   │   ├── campaigns/       # WhatsApp, SMS, Voice execution & scripts
│   │   │   │   ├── reports/         # Streaming Excel/PDF report generators
│   │   │   │   ├── ai/              # Agentic AI orchestrator & tool-calling
│   │   │   │   ├── rag/             # Vector database integration & search
│   │   │   │   └── admin/           # Super Admin client provisioning
│   │   │   └── main.ts
│   │   ├── prisma/                  # schema.prisma, migrations, seeders
│   │   └── package.json
│   ├── web-client/                  # Next.js 15 Client Web Panel
│   ├── web-admin/                   # Next.js 15 Super Admin Panel
│   └── mobile/                      # Flutter Application (Android & iOS)
├── workers/                         # BullMQ Asynchronous Processors
├── services/                        # AI & RAG Microservice (Python/FastAPI)
├── docker-compose.yml               # MySQL, Redis, Qdrant, MinIO
└── README.md
```

---

## PART 37 — Master Environment Variables Specification

```bash
DATABASE_URL="mysql://app_user:SecurePassword123@localhost:3306/election_db?connection_limit=50"
REDIS_URL="redis://:RedisAuthPass@localhost:6379/0"
JWT_ACCESS_SECRET="d8a9f4c3b2e1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1"
JWT_REFRESH_SECRET="f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5"
STORAGE_DRIVER="AWS_S3"
AWS_REGION="ap-south-1"
AWS_S3_BUCKET_NAME="rajtantra-campaign-assets"
FIREBASE_PROJECT_ID="rajtantra-production"
WHATSAPP_API_URL="https://graph.facebook.com/v20.0"
SMS_GATEWAY_URL="https://api.sms-provider.com/v1/send"
RINGGAI_API_URL="https://api.ringg.ai/v1"
OPENAI_API_KEY="sk-proj-..."
VECTOR_DB_URL="http://localhost:6333"
```

---

## PART 38 & 39 — CI/CD, Deployment & Multi-Tier Testing Strategy

- **CI/CD Pipeline**: GitHub Actions with staging & production rolling deployments, zero-downtime database migrations, and health checks.
- **Testing Matrix**: Unit tests (Jest), Integration tests (Supertest), Mobile E2E (Patrol), AI tool evaluation suites, and load testing (k6) simulating 5,000 concurrent workers on 1,500,000 voter records.

---

## PART 40 — Final Master Architecture Diagram

```
+====================================================================================================+
|                                    SUPER ADMIN WEB PANEL (Next.js 15)                              |
|          Client Provisioning | Account Types (Demo/Sale) | Branding & Themes | APK Config          |
+==================================================┬=================================================+
                                                   │ HTTPS / REST (JWT)
                                                   ▼
+====================================================================================================+
|                                      CLIENT WEB PANEL (Next.js 15)                                 |
|  Dashboard | Voter Board | Members | Booths & BLOs | Forms | AI Calling | Reports | AI Seats       |
+==================================================┬=================================================+
                                                   │ HTTPS / REST (JWT)
                                                   ▼
+====================================================================================================+
|                                     FLUTTER MOBILE APP (Android & iOS)                             |
|  Activation Key Login | Voter Search | Color Coding | Geo-Tagged Surveys | Voter Slips | AI Bot    |
+==================================================┬=================================================+
                                                   │ HTTPS / REST (Bearer Token / Key)
                                                   ▼
+====================================================================================================+
|                                      CENTRAL BACKEND API (NestJS)                                  |
|                                                                                                    |
|  [ Auth & JWT Guard ] ──► [ Tenant Context Scoper: organization_id ] ──► [ RBAC Permission Guard ] |
|                                                  │                                                 |
|  +-----------------------------------------------+-----------------------------------------------+ |
|  | Modules: Voters | Booths | Members | Surveys | Campaigns | Reports | AI Seats | Admin       | |
|  +-----------------------------------------------+-----------------------------------------------+ |
+==================┬===============================┬===============================┬=================+
                   │                               │                               │
                   ▼ Queries via Prisma            ▼ Jobs via Redis                ▼ Structured Tool Calls
+------------------------------------+ +-----------------------------+ +-----------------------------+
|        DATABASE STORAGE            | |     BULLMQ ASYNC WORKERS    | |      AI & RAG SUBSYSTEM     |
|                                    | |                             | |                             |
|  MySQL 8.0 Relational Engine       | |  - Bulk CSV/Excel Ingestion | |  [ Agentic AI Coordinator ] |
|   - Organizations & Subscriptions  | |  - Streaming Report Engine  | |              │              |
|   - Master Voters (1M+ Records)    | |  - Meta WhatsApp Dispatcher | |  +───────────┴───────────+  |
|   - Booths, Wards & BLO Records    | |  - Bulk SMS SMPP Gateway    | |  | LLM Tool Calling Engine| |
|   - Doorstep Survey Geo-Locations  | |  - RinggAI Voice Queue      | |  | (Strict Backend Tools) | |
|   - Audit Trails & Update Requests | |  - PDF OCR & Text Chunking  | |  +───────────┬───────────+  |
+------------------------------------+ +-----------------------------+ |              │              |
                                                                       |  +───────────▼───────────+  |
                                                                       |  | Qdrant / ChromaDB     |  |
                                                                       |  | (Vector Store for RAG)|  |
                                                                       |  +-----------------------+  |
                                                                       +-----------------------------+
                                                   │
+==================================================▼=================================================+
|                                      EXTERNAL CLOUD SERVICES                                       |
|  +------------------+  +------------------+  +------------------+  +------------------+  +-------+ |
|  | AWS S3 /         |  | Firebase Cloud   |  | WhatsApp Business|  | Transactional    |  | Ringg | |
|  | Cloud Storage    |  | Messaging (FCM)  |  | Cloud API        |  | SMS Gateway      |  | AI API| |
|  +------------------+  +------------------+  +------------------+  +------------------+  +-------+ |
+====================================================================================================+
```

---

## Unclear Requirements & Confirmation Items

> [!IMPORTANT]
> The following items are highlighted for confirmation before proceeding to code execution:

1. `[REQUIREMENT TO CONFIRM]`: **Distributor Role Scope** &mdash; Does a Distributor have direct self-service permission to provision and launch new client accounts, or do they submit onboarding requests for Super Admin review?
2. `[REQUIREMENT TO CONFIRM]`: **AI Voice Gateway Provider** &mdash; Document A references RinggAI for workspace setup, while the Quotation states third-party voice and WhatsApp APIs are client-arranged. Is **RinggAI** the exclusive target for AI Voice, or should we design an agnostic webhook adapter supporting Twilio/Exotel?
3. `[REQUIREMENT TO CONFIRM]`: **Mobile App Offline Search Capability** &mdash; In rural booths with zero cellular connectivity, should the Flutter app store and search the worker's assigned booth voters (~1,000 records) in local encrypted SQLite, or is active internet connectivity assumed?
4. `[REQUIREMENT TO CONFIRM]`: **Doorstep Survey GPS Dead-Zone Policy** &mdash; If a field worker conducts a survey inside a high-rise building or rural dead-zone where GPS accuracy exceeds 50 meters or fails, should the mobile app block submission, or allow submission with a `GPS_UNVERIFIED` flag?
5. `[REQUIREMENT TO CONFIRM]`: **OCR Pipeline for Voter Roll PDFs** &mdash; Document A mentions an OCR workspace for voter list PDFs, but notes it is currently unstable/partial. Should Phase 1-6 focus on reliable Excel/CSV imports, with PDF OCR scheduled as an advanced background pipeline in Phase 13?

---

## PHASE 1 — READY TO BUILD

Upon receiving your approval, we will immediately initiate **PHASE 1: Foundational Project Architecture & Monorepo Setup**.

### Phase 1 Execution Deliverables:
1. **Monorepo Architecture**: Initialize root configuration, package workspaces (`apps/backend`, `apps/web-client`, `apps/web-admin`, `packages/database`, `workers`).
2. **Backend Foundation (NestJS)**: Configure TypeScript, ESLint, Prettier, Helmet, CORS, centralized environment validation (`@nestjs/config` + Zod), and global exception filters.
3. **Database Layer (Prisma + MySQL)**: Set up `schema.prisma` with core tenant, user, role, and subscription models, and configure Prisma Client with automatic multi-tenant extensions.
4. **Local Development Infrastructure**: Create `docker-compose.yml` defining MySQL 8.0, Redis 7.0, and local S3-compatible MinIO object storage.
5. **Verification & Baseline Tests**: Run baseline unit tests, verify database connectivity, and confirm zero-error builds.

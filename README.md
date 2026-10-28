# Rajtantra — Election Management & Campaign Intelligence Platform

Enterprise-grade, multi-tenant election management, political campaign intelligence, and constituent operations platform built for high-scale Indian elections.

---

## Architecture Overview

Rajtantra is organized as a high-performance monorepo managed with **Turborepo** and **pnpm workspaces**:

```
rajtantra/
├── apps/
│   ├── api-core/               # NestJS Modular Monolith API (/api/v1)
│   ├── web-superadmin/         # Super Admin Platform Management (Next.js 15)
│   └── web-candidate/          # Candidate Admin War Room Panel (Next.js 15)
├── packages/
│   ├── config-typescript/      # Shared strict TypeScript tsconfigs
│   ├── config-eslint/          # Shared ESLint rules
│   ├── common-types/           # Shared types, contracts, DTOs, and role enums
│   └── database/               # Prisma ORM schema, migrations, and database client
├── docker/
│   └── docker-compose.yml      # Local dev stack (MySQL 8.0, Redis 7.0, MinIO)
├── Docs/                       # Reference materials and legacy documentation
└── docs2/                      # Architecture, database, requirements, and standards
```

---

## Approved Technology Stack

- **Monorepo Engine:** Turborepo + pnpm workspaces
- **Language:** TypeScript 5.8+ (Strict Mode, no `any`)
- **Backend API:** NestJS 11+ Modular Monolith
- **Database:** MySQL 8.0 with Prisma ORM
- **Cache & Queues:** Redis 7.0 + BullMQ
- **Object Storage:** MinIO (Local) / AWS S3 (Production)
- **Web Applications:** Next.js 15 App Router, React 19, Tailwind CSS v4, shadcn/ui
- **Validation:** Zod integrated with NestJS pipes
- **Testing:** Jest + Supertest (unit and integration tests)

---

## Getting Started

### Prerequisites

- **Node.js:** `>= 20.0.0`
- **pnpm:** `>= 9.0.0` (Recommended: `pnpm@12.15.0`)
- **Docker & Docker Compose:** Optional for containerized services, or local MySQL 8.0 and Redis.

### 1. Installation

```bash
# Install all monorepo dependencies
pnpm install
```

### 2. Environment Setup

```bash
# Copy example environment configuration
cp .env.example .env
```

### 3. Local Infrastructure (Docker)

```bash
# Start MySQL 8.0, Redis 7.0, and MinIO
docker compose -f docker/docker-compose.yml up -d
```

### 4. Database Setup & Migrations

```bash
# Generate Prisma Client
pnpm --filter @rajtantra/database db:generate

# Run initial migrations
pnpm --filter @rajtantra/database db:migrate

# Seed foundational test data (Super Admin & Demo Candidate)
pnpm --filter @rajtantra/database db:seed
```

### 5. Running the Development Servers

```bash
# Start all apps in dev mode via Turborepo
pnpm dev

# Or start specific applications:
pnpm --filter @rajtantra/api-core dev
pnpm --filter @rajtantra/web-superadmin dev
pnpm --filter @rajtantra/web-candidate dev
```

---

## Quality Assurance & Verification

```bash
# Run type checking across all workspaces
pnpm type-check

# Run linting across all workspaces
pnpm lint

# Run automated tests
pnpm test

# Build all packages and applications
pnpm build
```

---

## Documentation

- System Requirements: [`docs2/01-requirements.md`](file:///e:/Courses/Project/Main/Raj-%20tantra/docs2/01-requirements.md)
- Technical Architecture: [`docs2/02-architecture.md`](file:///e:/Courses/Project/Main/Raj-%20tantra/docs2/02-architecture.md)
- Database Design: [`docs2/03-database-design.md`](file:///e:/Courses/Project/Main/Raj-%20tantra/docs2/03-database-design.md)
- Coding Standards: [`docs2/04-coding-standards.md`](file:///e:/Courses/Project/Main/Raj-%20tantra/docs2/04-coding-standards.md)
- Roadmap: [`docs2/05-implementation-roadmap.md`](file:///e:/Courses/Project/Main/Raj-%20tantra/docs2/05-implementation-roadmap.md)
- Architecture Decisions: [`docs2/06-architecture-decisions.md`](file:///e:/Courses/Project/Main/Raj-%20tantra/docs2/06-architecture-decisions.md)

---

## License

Proprietary and Confidential — Rajtantra Systems. All rights reserved.

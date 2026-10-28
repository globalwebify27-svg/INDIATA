# Rajtantra: Engineering Standards & Clean Code Guidelines
**Document Identifier:** `RAJ-STD-004`  
**Version:** 1.0.0  
**Status:** Engineering Baseline (Phase 1)  
**Date:** October 2026  

---

## 1. Core Engineering Principles

Rajtantra is built to withstand high concurrency and strict electoral scrutiny. Every engineer contributing to this repository must follow these non-negotiable principles:

1. **Single Responsibility Principle (SRP):** Each module, class, file, and function must have exactly one reason to change.
2. **Explicit Contracts Over Magic:** Every API endpoint, component prop, and database query must be strictly typed using TypeScript interfaces and Zod schemas.
3. **No Business Logic in UI:** Next.js and Flutter UI components are pure presentation layers. All business logic, filtering calculations, and state mutations must reside in custom hooks, service classes, or domain stores.
4. **No Database Queries in Controllers:** NestJS controllers only parse HTTP parameters, invoke domain services, and return standard API envelopes. Direct Prisma calls inside controllers are rejected in CI linting.
5. **No `any` Types in TypeScript:** Usage of `any` is strictly prohibited. Use `unknown` with type narrowing, generics, or discriminated unions.
6. **No Secrets or Hardcoded URLs:** All configuration must be loaded from validated environment variables.

---

## 2. File Organization & Sizing Limits

To maintain codebase readability and prevent "God files":
- **Maximum File Length:** Target **< 250 lines of code**. Any file exceeding 350 lines must be reviewed for refactoring into sub-components or utility services.
- **Maximum Function Length:** Target **< 35 lines of code**. Long procedural functions must be decomposed into well-named private helper functions.
- **File Naming Conventions:**
  - TypeScript / React: `kebab-case.tsx` for components (e.g., `voter-filter-bar.tsx`), `kebab-case.hook.ts` for hooks, `kebab-case.service.ts` for services.
  - NestJS: Standard Nest conventions: `voters.controller.ts`, `voters.service.ts`, `voters.module.ts`, `dto/create-voter.dto.ts`.
  - Dart / Flutter: `snake_case.dart` (e.g., `voter_card_widget.dart`, `slip_printer_service.dart`).

---

## 3. Strict TypeScript Standards

### 3.1 Strict Compilation Settings
All projects inherit from `@rajtantra/config-typescript`:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 3.2 Forbidding `any`
```typescript
// ❌ REJECTED IN CODE REVIEW
function processVoterData(data: any) {
  return data.map((v: any) => v.name);
}

// ✅ APPROVED CLEAN CODE
interface RawVoterRecord {
  id: string;
  nameEn: string;
  epicNumber: string;
  boothNumber: number;
}

function processVoterData(data: readonly RawVoterRecord[]): string[] {
  return data.map((v) => v.nameEn);
}
```

### 3.3 Safe Handling of Unknown Dynamic Data
When parsing unknown external payloads (e.g., webhook events, OCR JSON), use Zod for runtime schema validation:
```typescript
import { z } from 'zod';

export const RazorpayWebhookSchema = z.object({
  event: z.enum(['payment.captured', 'payment.failed']),
  payload: z.object({
    payment: z.object({
      entity: z.object({
        id: z.string(),
        amount: z.number().positive(),
        currency: z.literal('INR'),
        status: z.string(),
        notes: z.record(z.string()).optional()
      })
    })
  })
});

export type RazorpayWebhookPayload = z.infer<typeof RazorpayWebhookSchema>;
```

---

## 4. Backend (NestJS) Clean Architecture Standards

### 4.1 Module Responsibility Flow
```
[HTTP Request] 
      │
      ▼
[NestJS Controller] ──────► [Zod Validation Pipe] (Rejects invalid input: 422)
      │
      ▼
[TenantIsolationGuard] ───► [Verifies Organization Ownership: 403]
      │
      ▼
[Domain Service] ────────► [Applies Business Rules & State Transitions]
      │
      ▼
[Prisma Client / Repo] ──► [Database Query with Scoped organization_id]
      │
      ▼
[Audit Interceptor] ─────► [Appends Mutation Record to Audit Log]
```

### 4.2 Standard Controller Implementation Pattern
```typescript
// apps/api-core/src/modules/voters/voters.controller.ts
@Controller('voters')
@UseGuards(JwtAuthGuard, TenantIsolationGuard)
export class VotersController {
  constructor(private readonly votersService: VotersService) {}

  @Get()
  @Roles(UserRole.CANDIDATE_ADMIN, UserRole.CAMPAIGN_MANAGER, UserRole.BOOTH_INCHARGE)
  async queryVoters(
    @TenantId() organizationId: string,
    @Query(new ZodValidationPipe(VoterQueryDtoSchema)) query: VoterQueryDto,
  ): Promise<ApiResponse<VoterListItem[]>> {
    const result = await this.votersService.findWithFilters(organizationId, query);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Voter records retrieved successfully',
      data: result.items,
      meta: result.meta,
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
    };
  }
}
```

---

## 5. Frontend (Next.js & React) Presentation Standards

### 5.1 Zero Business Logic in Components
Components must be pure renderers driven by props and custom hooks.

```typescript
// ❌ REJECTED: Embedded Database and Filter Logic in UI
export function VoterTable() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/api/voters').then(...); // Direct fetch, no error boundaries
  }, []);
  // 100 lines of sorting math inside component...
  return <table>...</table>;
}

// ✅ APPROVED: Declarative Component with Custom Hook
export function VoterTable({ organizationId }: { organizationId: string }) {
  const { voters, isLoading, isError, filter, setFilter } = useVoterDirectory(organizationId);

  if (isLoading) return <VoterTableSkeleton rows={10} />;
  if (isError) return <VoterTableErrorState onRetry={() => refetch()} />;
  if (voters.length === 0) return <VoterEmptyState filter={filter} />;

  return (
    <div className="rounded-lg border border-border bg-card">
      <VoterTableHeader onFilterChange={setFilter} activeFilter={filter} />
      <VoterTableList data={voters} />
    </div>
  );
}
```

### 5.2 Mandatory UI State Handling
Every data-driven view MUST explicitly implement four distinct visual states:
1. **Loading State:** Polished Skeleton loaders matching the final layout (never just a spinning circle).
2. **Empty State:** Context-rich illustration with an actionable button (e.g., "No voters match this filter. Reset filters?").
3. **Error State:** Human-readable message with a retry trigger.
4. **Success State:** Dense, responsive, accessible data presentation.

---

## 6. Mobile Application (Flutter) Standards

1. **State Management:** Use `flutter_bloc` or `riverpod` for predictable, unidirectional data flow.
2. **Hardware Exception Isolation:** All Bluetooth thermal printer commands must run in dedicated isolate or async catch blocks; Bluetooth disconnections must never crash the UI thread.
3. **Daylight Accessibility:** Use high-contrast color tokens (`#000000` text on `#FFFFFF` backgrounds) and minimum 16sp font sizes for outdoor field readability.

---

## 7. Testing Standards & Coverage Thresholds

| Test Type | Target Scope | Minimum Target Coverage | Tools Used |
|---|---|---|---|
| **Unit Tests** | Domain calculation, Filter queries, DTOs, ESC/POS byte builders | **85%** | Vitest, Flutter Test |
| **Integration Tests** | NestJS Services + Prisma DB queries + Redis queues | **75%** | Testcontainers, Supertest |
| **End-to-End Tests** | Critical paths: Auth, 22 Quick Filters, Survey sync, Turnout toggle | Key Happy Paths | Playwright |

---

## 8. Git Workflow, Branching & Commit Conventions

- **Main Branch (`main`):** Production releases only. Protected; direct pushes disabled.
- **Development Branch (`develop`):** Integration branch for current sprint.
- **Feature Branches (`feat/RAJ-<issue-num>-description`):** Branch from `develop`.
- **Commit Messages:** Must follow Conventional Commits specification:
  - `feat(voters): implement 22 quick filter composite search query`
  - `fix(printing): resolve bluetooth printer disconnect on android 14`
  - `docs(arch): update database schema with ECI expense ledger`
  - `test(surveys): add unit tests for 26-question survey calculation`

---
*End of Coding Standards Specification — Ready for Implementation Roadmap.*

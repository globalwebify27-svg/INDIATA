# Rajtantra Contributing Guidelines

Thank you for contributing to the **Rajtantra Election Management & Campaign Intelligence Platform**. To maintain clean architecture, strict security invariants, and code quality, all contributors must adhere to the following standards.

---

## 1. Clean Architecture Standards

- **Single Responsibility Principle (SRP):** Each class, function, or module must have a single clear responsibility.
- **Strict Typing:** TypeScript strict mode is enforced everywhere. The use of `any` is strictly prohibited. Use `unknown` with runtime type narrowing (e.g., Zod) or discriminated unions.
- **No Database Queries in Controllers:** NestJS controllers must only handle HTTP routing, DTO validation, and standard response wrapping. Database interactions belong in services/repositories.
- **Zero Business Logic in UI:** Next.js pages and components must be pure presentation layers driven by props and custom hooks.
- **File Length Limits:** Maintain files under 250 lines and functions under 35 lines.

---

## 2. Git Branching & Commit Conventions

Commit messages must follow the **Conventional Commits** specification:

```
<type>(<scope>): <short description>
```

### Approved Types

- `feat`: A new feature or capability.
- `fix`: A bug fix.
- `docs`: Documentation updates.
- `refactor`: Code refactoring without behavioral changes.
- `test`: Adding or updating test suites.
- `chore`: Build system, tooling, or dependency updates.

### Examples

- `feat(auth): implement refresh token rotation and revocation`
- `fix(tenancy): enforce strict organization_id check in tenant guard`
- `test(health): add integration test for backend health check endpoint`

---

## 3. Pull Request Checklist

Before submitting a pull request, ensure the following commands pass with zero errors:

```bash
# 1. Format check
pnpm format:check

# 2. Strict type check
pnpm type-check

# 3. Linting
pnpm lint

# 4. Unit & integration tests
pnpm test

# 5. Production build
pnpm build
```

---

## 4. Multi-Tenant Security Rules

- **Server-Side Tenant Enforcement:** Never trust an incoming `organizationId` from client request parameters or query strings without validating the authenticated user's organization membership.
- **Deny-by-Default:** Every protected endpoint must require explicit authentication and role authorization decorators.
- **Sensitive Data Shielding:** Passwords, tokens, and PII must never be logged or exposed in standard API payloads.

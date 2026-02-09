# Research: Frontend Application & Modern UX

**Feature Branch**: `004-frontend-modern-ux`  
**Created**: 2026-01-14  
**Status**: Complete

---

## Technical Decisions

### Decision 1: Next.js 16+ with App Router

**Decision**: Use Next.js 16+ with App Router (app/ directory)

**Rationale**:

- Constitution mandates Next.js 16+ with App Router
- Server Components support for better performance
- Built-in layouts and nested routing
- Better TypeScript integration

**Alternatives Considered**:

- Pages Router (rejected: legacy, constitution requires App Router)
- Vite + React (rejected: constitution mandates Next.js)

---

### Decision 2: Styling Framework

**Decision**: Tailwind CSS v4

**Rationale**:

- Utility-first approach speeds development
- Excellent responsive design support
- Built-in dark mode (future iteration)
- Small production bundle size with purging
- User specified Tailwind CSS in requirements

**Alternatives Considered**:

- CSS Modules (rejected: slower development velocity)
- Styled Components (rejected: runtime overhead)
- Vanilla CSS (rejected: slower to build responsive layouts)

---

### Decision 3: JWT Storage Strategy

**Decision**: HttpOnly cookies via Better Auth

**Rationale**:

- XSS-safe: JavaScript cannot access HttpOnly cookies
- Better Auth handles token refresh automatically
- Server-side token validation in middleware
- Constitution mandates security-first design

**Alternatives Considered**:

- localStorage (rejected: XSS vulnerable)
- sessionStorage (rejected: XSS vulnerable, doesn't persist)
- Memory only (rejected: lost on page refresh)

---

### Decision 4: State Management

**Decision**: React Query (TanStack Query) for server state, React Context for minimal UI state

**Rationale**:

- React Query provides caching, revalidation, optimistic updates
- Minimal global state needed (auth status only)
- User specified React Query for API caching
- Avoids over-engineering with Redux or Zustand

**Alternatives Considered**:

- Redux (rejected: overkill for this app size)
- Zustand (rejected: unnecessary, React Query covers needs)
- SWR (rejected: React Query has better optimistic update support)

---

### Decision 5: Navigation Pattern

**Decision**: Responsive sidebar with mobile drawer

**Rationale**:

- Sidebar works well for dashboard-style apps
- Mobile drawer provides hamburger menu pattern users expect
- Consistent with modern todo/productivity apps
- Specified in user requirements

**Alternatives Considered**:

- Top navigation only (rejected: less space for dashboard)
- Bottom navigation (rejected: more appropriate for native mobile)

---

### Decision 6: Component Library Approach

**Decision**: Custom components built with Tailwind + Headless UI for accessibility

**Rationale**:

- Headless UI provides accessible primitives (modals, dropdowns)
- Custom styling matches design requirements
- No external UI library lock-in
- Smaller bundle than full component libraries

**Alternatives Considered**:

- shadcn/ui (acceptable alternative, but requires more setup)
- Radix UI (good, but Headless UI simpler)
- Material UI (rejected: opinionated styling, larger bundle)

---

### Decision 7: Form Handling

**Decision**: React Hook Form with Zod validation

**Rationale**:

- Excellent performance (uncontrolled inputs)
- Zod provides type-safe schema validation
- Easy integration with Tailwind error states
- Small bundle size

**Alternatives Considered**:

- Formik (rejected: larger bundle, slower)
- Native HTML5 validation (rejected: less flexible)

---

### Decision 8: Testing Approach

**Decision**: Playwright for E2E tests

**Rationale**:

- Cross-browser testing
- Better for testing full user flows
- User specified E2E tests for core flows
- Visual regression testing capabilities

**Alternatives Considered**:

- Cypress (acceptable, but Playwright faster)
- Testing Library only (not sufficient for E2E)

---

## Existing Infrastructure Analysis

### Current Frontend State

```
frontend/
├── app/api/ (Better Auth route handler)
├── lib/
│   ├── api.ts (API client with JWT attachment)
│   ├── auth.server.ts (Better Auth server config)
│   ├── auth.ts (Better Auth client)
│   └── __tests__/ (existing tests)
├── package.json (minimal, only better-auth)
```

### Integration Points

1. **Better Auth (Spec-2)**: Already configured in `lib/auth.ts` and `lib/auth.server.ts`
2. **REST API (Spec-3)**: Endpoints at `/api/{user_id}/tasks/*`
3. **API Client (existing)**: `lib/api.ts` has JWT attachment logic

### Required Additions

1. Full Next.js 16+ project setup
2. Tailwind CSS configuration
3. App Router layouts and pages
4. UI components library
5. React Query integration
6. Playwright E2E tests

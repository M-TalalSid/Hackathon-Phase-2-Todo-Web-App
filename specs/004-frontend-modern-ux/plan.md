# Implementation Plan: Frontend Application & Modern UX

**Feature Branch**: `004-frontend-modern-ux`  
**Created**: 2026-01-14  
**Status**: Ready for Review

---

## Goal

Build a modern, responsive, accessible frontend application for the multi-user Todo app using Next.js 16+ with App Router, integrating with the authenticated REST API from Spec-3.

---

## Constitution Check

| Principle                     | Status | Notes                                                  |
| ----------------------------- | ------ | ------------------------------------------------------ |
| Spec-Driven Development       | ✅     | All components traced to FR-001 through FR-028         |
| Security-First Design         | ✅     | JWT via HttpOnly cookies, no token exposure in UI      |
| Deterministic Reproducibility | ✅     | Environment variables for API URL, pinned dependencies |
| Separation of Concerns        | ✅     | components/, lib/, app/ clearly separated              |
| Hackathon Reviewability       | ✅     | Full traceability, PHR created, demo-ready UI          |
| Agentic Workflow              | ✅     | All code via agent, no manual coding                   |

---

## Technical Decisions

See [research.md](./research.md) for detailed rationale:

| Decision         | Choice                  | Rationale                   |
| ---------------- | ----------------------- | --------------------------- |
| Framework        | Next.js 16+ App Router  | Constitution mandate        |
| Styling          | Tailwind CSS v4         | Fast responsive development |
| JWT Storage      | HttpOnly cookies        | XSS protection              |
| State Management | React Query + Context   | Caching, optimistic updates |
| Navigation       | Sidebar + mobile drawer | Dashboard pattern           |
| Components       | Custom + Headless UI    | Accessible, lightweight     |
| Forms            | React Hook Form + Zod   | Type-safe validation        |
| E2E Tests        | Playwright              | Cross-browser user flows    |

---

## Proposed Changes

### Phase 1: Foundation & Project Setup

**Goal**: Establish clean, scalable frontend foundation

#### [MODIFY] `frontend/package.json`

- Add Next.js 16+, React 19+, TypeScript
- Add Tailwind CSS v4, postcss, autoprefixer
- Add React Query, Headless UI, React Hook Form, Zod
- Add Playwright for testing
- Configure npm scripts (dev, build, lint, test)

#### [NEW] `frontend/tsconfig.json`

- Strict TypeScript configuration
- Path aliases (@/components, @/lib)

#### [NEW] `frontend/tailwind.config.ts`

- Custom color palette (#0070f3 primary)
- Breakpoints: mobile (<640), tablet (640-1024), desktop (>1024)
- System font stack (Inter, Roboto, system-ui)

#### [NEW] `frontend/postcss.config.js`

- Tailwind CSS and autoprefixer

#### [NEW] `frontend/next.config.ts`

- Strict mode enabled
- Image optimization
- Environment variables

#### [MODIFY] Folder Structure

```
frontend/
├── app/
│   ├── layout.tsx (root layout)
│   ├── page.tsx (landing page)
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── api/auth/[...all]/route.ts (existing)
├── components/
│   ├── ui/ (Button, Input, Modal, Toast)
│   ├── auth/ (SignInForm, SignUpForm)
│   ├── layout/ (Navbar, Sidebar, MobileDrawer)
│   └── tasks/ (TaskCard, TaskList, TaskForm)
├── lib/
│   ├── api.ts (existing, enhance)
│   ├── auth.ts (existing)
│   ├── auth.server.ts (existing)
│   └── query-client.ts (React Query setup)
└── styles/
    └── globals.css (Tailwind imports)
```

---

### Phase 2: Layouts, Routing & Navigation

**Goal**: Define responsive, authentication-aware routing

#### [NEW] `frontend/app/layout.tsx`

- Root layout with global styles, metadata
- React Query provider
- Toast container

#### [NEW] `frontend/app/(auth)/layout.tsx`

- Public layout for auth pages
- Centered card design
- Redirect to dashboard if authenticated

#### [NEW] `frontend/app/(dashboard)/layout.tsx`

- Protected layout with sidebar/navbar
- User identity display
- Sign-out button
- Redirect to sign-in if unauthenticated

#### [NEW] `frontend/components/layout/Navbar.tsx`

- Logo, user info, sign-out
- Responsive: hidden on mobile, visible on tablet+

#### [NEW] `frontend/components/layout/Sidebar.tsx`

- Navigation links
- Visible on desktop only

#### [NEW] `frontend/components/layout/MobileDrawer.tsx`

- Hamburger menu trigger
- Slide-out drawer with navigation
- Uses Headless UI Dialog

---

### Phase 3: Authentication Integration

**Goal**: Complete sign-up, sign-in, sign-out flows

#### [NEW] `frontend/app/(auth)/sign-in/page.tsx`

- Email/password form
- Validation with React Hook Form + Zod
- Error display for invalid credentials
- Loading state during submission
- Redirect to dashboard on success

#### [NEW] `frontend/app/(auth)/sign-up/page.tsx`

- Email/password/confirm password form
- Password strength requirements displayed
- Success redirects to dashboard
- Error handling for existing email

#### [NEW] `frontend/components/auth/SignInForm.tsx`

- Reusable form component
- Uses Better Auth signIn

#### [NEW] `frontend/components/auth/SignUpForm.tsx`

- Reusable form component
- Uses Better Auth signUp

#### [MODIFY] `frontend/lib/api.ts`

- Ensure JWT attachment from session
- Add error handling for 401 (redirect to sign-in)
- Add rate limiting awareness

#### [NEW] `frontend/middleware.ts`

- Protect /dashboard routes
- Redirect unauthenticated to /sign-in

---

### Phase 4: Core Task Management UI

**Goal**: Implement CRUD with optimistic updates

#### [NEW] `frontend/app/(dashboard)/page.tsx`

- Dashboard page with task list
- Add task button
- Uses React Query for data fetching

#### [NEW] `frontend/components/tasks/TaskList.tsx`

- Renders list of TaskCard components
- Empty state when no tasks
- Loading skeleton state

#### [NEW] `frontend/components/tasks/TaskCard.tsx`

- Title, description preview
- Completion checkbox
- Edit and delete buttons
- Visual distinction for completed

#### [NEW] `frontend/components/tasks/TaskForm.tsx`

- Title (required) and description fields
- Used for create and edit
- Form validation

#### [NEW] `frontend/components/ui/Modal.tsx`

- Headless UI Dialog wrapper
- Used for task edit/create
- Accessible with keyboard

#### [NEW] `frontend/components/ui/ConfirmDialog.tsx`

- Confirmation for delete actions
- Cancel and confirm buttons

#### [NEW] `frontend/lib/hooks/useTasks.ts`

- React Query hooks for task CRUD
- Optimistic updates for toggle/delete
- Cache invalidation on mutations

---

### Phase 5: UX States & User Feedback

**Goal**: Clear communication of system state

#### [NEW] `frontend/components/ui/Toast.tsx`

- Success/error/info variants
- Auto-dismiss with timer
- Accessible announcements

#### [NEW] `frontend/components/ui/Skeleton.tsx`

- Loading placeholder components
- Task list skeleton
- Form skeleton

#### [NEW] `frontend/components/ui/EmptyState.tsx`

- "No tasks yet" message
- Call-to-action to create first task

#### [NEW] `frontend/components/ui/ErrorState.tsx`

- Error message display
- Retry button

#### [NEW] `frontend/components/ui/OfflineBanner.tsx`

- Detects navigator.onLine
- Shows warning when offline

---

### Phase 6: Accessibility & Responsiveness

**Goal**: WCAG 2.1 AA compliance, mobile-first

#### Tasks (integrated into components above)

- Keyboard navigation support (tabIndex, focus management)
- ARIA roles for modals, live regions for toasts
- Color contrast validation (4.5:1 minimum)
- Semantic HTML (main, nav, header, footer)
- Focus visible states
- Responsive breakpoints tested

---

### Phase 7: Performance Optimization

**Goal**: Fast load times, smooth interactions

#### [MODIFY] All pages

- Use Server Components where possible
- Client Components only for interactivity

#### [MODIFY] `frontend/next.config.ts`

- Enable image optimization
- Configure bundle analyzer (optional)

#### [NEW] `frontend/lib/query-client.ts`

- React Query setup with staleTime
- Cache persistence configuration

---

### Phase 8: Error Handling & Stability

**Goal**: Graceful failure handling

#### [NEW] `frontend/app/error.tsx`

- Global error boundary
- User-friendly error message
- Retry button

#### [NEW] `frontend/app/not-found.tsx`

- Custom 404 page
- Link back to dashboard

#### [NEW] `frontend/app/(dashboard)/error.tsx`

- Dashboard-specific error boundary

---

### Phase 9: Testing & Demo Readiness

**Goal**: Validate and prepare for review

#### [NEW] `frontend/e2e/auth.spec.ts`

- Sign-up flow test
- Sign-in flow test
- Sign-out flow test

#### [NEW] `frontend/e2e/tasks.spec.ts`

- Create task test
- Edit task test
- Delete task test
- Toggle completion test

#### [NEW] `frontend/playwright.config.ts`

- Configure browsers (Chrome, Firefox)
- Base URL from environment

---

## Verification Plan

### Automated Tests

#### 1. E2E Tests with Playwright

```bash
cd frontend
npx playwright install
npx playwright test
```

**Expected**: All auth and task CRUD flows pass

#### 2. TypeScript & Lint Check

```bash
cd frontend
npm run lint
npm run type-check
```

**Expected**: Zero errors

#### 3. Production Build Verification

```bash
cd frontend
npm run build
```

**Expected**: Build succeeds with zero console errors

#### 4. Lighthouse Accessibility Audit

```bash
# After starting dev server
# Open Chrome DevTools > Lighthouse > Run audit
```

**Expected**: Accessibility score ≥ 95%

### Manual Verification

#### Test 1: Authentication Flow

1. Navigate to `http://localhost:3000`
2. Click "Sign Up" → Fill form → Submit
3. Verify redirect to dashboard
4. Click "Sign Out"
5. Verify redirect to sign-in page
6. Sign in with created credentials
7. Verify dashboard access

**Expected**: All redirects work, no token exposure in UI

#### Test 2: Responsive Design

1. Open browser DevTools
2. Toggle device toolbar
3. Test at 320px, 640px, 1024px, 1920px widths
4. Verify: No horizontal scroll, navigation adapts, forms usable

**Expected**: Layout works at all breakpoints

#### Test 3: Task CRUD

1. Sign in to dashboard
2. Create a task (verify toast, task appears)
3. Toggle completion (verify visual change)
4. Edit task (verify modal, save works)
5. Delete task (verify confirmation, removal)
6. Create 3+ tasks to test list view

**Expected**: All operations work with feedback

#### Test 4: Keyboard Navigation

1. Navigate entire app using Tab, Enter, Escape
2. Create task using keyboard only
3. Complete task using keyboard only

**Expected**: All core flows accessible via keyboard

---

## Files Created/Modified Summary

| Action | File                    | Purpose           |
| ------ | ----------------------- | ----------------- |
| MODIFY | `package.json`          | Dependencies      |
| NEW    | `tsconfig.json`         | TypeScript config |
| NEW    | `tailwind.config.ts`    | Tailwind config   |
| NEW    | `next.config.ts`        | Next.js config    |
| NEW    | `app/layout.tsx`        | Root layout       |
| NEW    | `app/(auth)/*`          | Auth pages        |
| NEW    | `app/(dashboard)/*`     | Dashboard pages   |
| NEW    | `components/ui/*`       | UI primitives     |
| NEW    | `components/auth/*`     | Auth forms        |
| NEW    | `components/layout/*`   | Navigation        |
| NEW    | `components/tasks/*`    | Task components   |
| NEW    | `lib/hooks/useTasks.ts` | React Query hooks |
| NEW    | `middleware.ts`         | Route protection  |
| NEW    | `e2e/*.spec.ts`         | Playwright tests  |

---

## Risk Mitigation

| Risk                           | Mitigation                                              |
| ------------------------------ | ------------------------------------------------------- |
| Better Auth integration issues | Auth already partially configured; extend existing lib/ |
| Performance on mobile          | Server Components, lazy loading, optimize images        |
| Accessibility failures         | Use Headless UI, test with Lighthouse, keyboard testing |
| API integration issues         | REST API verified in Spec-3; use existing api.ts        |

---

## Completion Criteria

- [ ] All user flows work end-to-end
- [ ] UI is modern, responsive, and accessible
- [ ] Lighthouse accessibility ≥ 95%
- [ ] Page load < 2s on 3G simulation
- [ ] Zero console errors in production build
- [ ] E2E tests pass for auth and task flows
- [ ] Application is demo-ready

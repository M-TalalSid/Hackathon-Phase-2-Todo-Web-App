# Quickstart: Frontend Application

**Feature**: 004-frontend-modern-ux  
**Prerequisites**: Backend running on port 8000, Better Auth configured

---

## Development Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `.env.local`:

```bash
cp .env.local.example .env.local
```

Required variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
BETTER_AUTH_SECRET=<same as backend>
BETTER_AUTH_URL=http://localhost:3000
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Verify Setup

### Check 1: Landing Page Loads

```bash
curl http://localhost:3000
```

**Expected**: HTML response with landing page

### Check 2: Auth Pages Accessible

- Navigate to `/sign-in` → Should show sign-in form
- Navigate to `/sign-up` → Should show sign-up form

### Check 3: Protected Route Redirect

- Navigate to `/dashboard` without signing in
- **Expected**: Redirect to `/sign-in`

---

## Run Tests

### E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run tests
npx playwright test
```

### Lint Check

```bash
npm run lint
```

### Type Check

```bash
npm run type-check
```

### Production Build

```bash
npm run build
```

---

## Demo User Flows

### Flow 1: Sign Up

1. Go to `/sign-up`
2. Enter: email `demo@example.com`, password `Demo123!`
3. Click "Create Account"
4. Should redirect to dashboard

### Flow 2: Create Task

1. Sign in to dashboard
2. Click "Add Task"
3. Enter title: "My First Task"
4. Click "Create"
5. Task appears in list

### Flow 3: Complete Task

1. Click checkbox on task
2. Task shows strikethrough
3. Toast confirms completion

### Flow 4: Delete Task

1. Click delete button on task
2. Confirm in dialog
3. Task removed from list

---

## Responsive Testing

| Breakpoint | Viewport   | Navigation       |
| ---------- | ---------- | ---------------- |
| Mobile     | 320-640px  | Hamburger drawer |
| Tablet     | 640-1024px | Top nav          |
| Desktop    | 1024px+    | Sidebar          |

Use browser DevTools → Device Toolbar to test.

---

## Lighthouse Audit

1. Start production server: `npm run start`
2. Open Chrome DevTools → Lighthouse
3. Run audit for: Performance, Accessibility, Best Practices
4. **Target**: Accessibility ≥ 95%

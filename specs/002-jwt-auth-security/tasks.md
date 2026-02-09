# Tasks: Authentication & API Security

**Input**: Design documents from `/specs/002-jwt-auth-security/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Included as per spec security requirements and constitution

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/app/auth/` for auth module, `backend/tests/` for tests
- **Frontend**: `frontend/lib/` for auth config, `frontend/app/api/` for routes

---

## Phase 1: Setup (Shared Infrastructure) ✅

**Purpose**: Project initialization and dependencies

- [x] T001 Create `backend/app/auth/` directory for authentication module
- [x] T002 Add `pyjwt>=2.8.0` to `backend/requirements.txt`
- [x] T003 [P] Create `backend/app/auth/__init__.py` module file with exports
- [x] T004 [P] Create `frontend/.env.local.example` with BETTER_AUTH_SECRET and NEXT_PUBLIC_API_URL placeholders
- [x] T005 [P] Add BETTER_AUTH_SECRET to `backend/.env.example`

**Checkpoint**: ✅ Project dependencies and structure ready

---

## Phase 2: Foundational (Blocking Prerequisites) ✅

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Implement `backend/app/auth/config.py` with AuthSettings (better_auth_secret, jwt_algorithm, jwt_leeway_seconds)
- [x] T007 Implement `backend/app/auth/models.py` with AuthenticatedUser model (id from JWT sub claim)
- [x] T008 Implement `backend/app/auth/exceptions.py` with AuthenticationError, InvalidTokenError, ExpiredTokenError, MissingTokenError
- [x] T009 Update `backend/app/config.py` to include better_auth_secret from environment
- [x] T010 [P] Create `backend/tests/test_auth_models.py` with AuthenticatedUser validation tests

**Checkpoint**: ✅ Foundation ready - auth models, config, and exceptions in place

---

## Phase 3: User Story 1 - User Authentication (Priority: P1) 🎯 MVP ✅

**Goal**: Users authenticate via frontend and receive valid JWT token

**Independent Test**: Sign in via frontend → receive JWT → token contains user identifier

### Tests for User Story 1

- [x] T011 [P] [US1] Create `frontend/lib/__tests__/auth.test.ts` with Better Auth configuration tests

### Implementation for User Story 1

- [x] T012 [US1] Install better-auth package: run `npm install better-auth` in frontend directory
- [x] T013 [US1] Create `frontend/lib/auth.ts` with Better Auth client configuration and JWT plugin
- [x] T014 [US1] Create `frontend/lib/auth.server.ts` with Better Auth server instance
- [x] T015 [US1] Create `frontend/app/api/auth/[...all]/route.ts` with Better Auth API route handler
- [x] T016 [US1] Configure BETTER_AUTH_SECRET in Better Auth for JWT signing

**Checkpoint**: ✅ Frontend can authenticate users and issue JWT tokens

---

## Phase 4: User Story 2 - Token Attachment to Requests (Priority: P1) ✅

**Goal**: JWT automatically attached to all API requests from frontend

**Independent Test**: Frontend API request → Authorization header contains Bearer token

### Tests for User Story 2

- [x] T017 [P] [US2] Create `frontend/lib/__tests__/api.test.ts` with authenticated fetch tests

### Implementation for User Story 2

- [x] T018 [US2] Create `frontend/lib/api.ts` with authenticated fetch wrapper
- [x] T019 [US2] Implement token extraction from Better Auth session in `frontend/lib/api.ts`
- [x] T020 [US2] Add Authorization: Bearer <token> header attachment in `frontend/lib/api.ts`
- [x] T021 [US2] Handle unauthenticated state in API client (block or redirect)

**Checkpoint**: ✅ Frontend attaches JWT to all API requests

---

## Phase 5: User Story 3 - Backend Token Verification (Priority: P1) ✅

**Goal**: Backend verifies JWT on every protected request, rejects invalid tokens

**Independent Test**: Send requests with valid/invalid/missing tokens → correct accept/reject responses

### Tests for User Story 3

- [x] T022 [P] [US3] Create `backend/tests/test_jwt_service.py` with tests for valid token, expired token, invalid signature, malformed token
- [x] T023 [P] [US3] Create `backend/tests/test_auth_dependency.py` with tests for missing header, invalid header format, invalid token, valid token

### Implementation for User Story 3

- [x] T024 [US3] Implement `backend/app/auth/jwt_service.py` with verify_token function using PyJWT
- [x] T025 [US3] Add HS256 signature verification in `backend/app/auth/jwt_service.py`
- [x] T026 [US3] Add expiry validation with 60-second clock skew tolerance in `backend/app/auth/jwt_service.py`
- [x] T027 [US3] Add sub claim extraction and validation in `backend/app/auth/jwt_service.py`
- [x] T028 [US3] Implement `backend/app/auth/dependencies.py` with get_current_user FastAPI dependency
- [x] T029 [US3] Add Authorization header parsing (Bearer <token>) in `backend/app/auth/dependencies.py`
- [x] T030 [US3] Add 401 Unauthorized responses with JSON error codes in `backend/app/auth/dependencies.py`

**Checkpoint**: ✅ Backend verifies JWT tokens correctly

---

## Phase 6: User Story 4 - User Identity Extraction (Priority: P1) ✅

**Goal**: Backend extracts authenticated user identity from JWT for ownership enforcement

**Independent Test**: Verified JWT → user_id extracted → matches token payload

### Tests for User Story 4

- [x] T031 [P] [US4] Create `backend/tests/test_user_extraction.py` with tests for user_id extraction, missing sub claim rejection

### Implementation for User Story 4

- [x] T032 [US4] Return AuthenticatedUser from get_current_user with id from JWT sub claim
- [x] T033 [US4] Add validation that rejects tokens with missing or empty sub claim
- [x] T034 [US4] Add structured logging for successful authentication in `backend/app/auth/dependencies.py`

**Checkpoint**: ✅ User identity reliably extracted from JWT

---

## Phase 7: User Story 5 - User Isolation Enforcement (Priority: P1) ✅

**Goal**: Authenticated users can only access their own data, cross-user access impossible

**Independent Test**: User A's token cannot access User B's data → 404 returned

### Tests for User Story 5

- [x] T035 [P] [US5] Create `backend/tests/test_user_isolation.py` with cross-user access tests

### Implementation for User Story 5

- [x] T036 [US5] Update `backend/app/main.py` to apply get_current_user dependency to protected routes
- [x] T037 [US5] Exempt health endpoints (/health, /health/db) from authentication in `backend/app/main.py`
- [x] T038 [US5] Add authentication error handlers for consistent 401 responses in `backend/app/main.py`
- [x] T039 [US5] Document that JWT user_id takes precedence over any body/URL user_id

**Checkpoint**: ✅ User isolation enforced, cross-user access blocked

---

## Phase 8: Polish & Cross-Cutting Concerns ✅

**Purpose**: Improvements that affect multiple user stories

- [x] T040 [P] Add CORS middleware configuration for frontend origin in `backend/app/main.py`
- [x] T041 [P] Add structured logging for authentication failures (masked tokens) in `backend/app/auth/dependencies.py`
- [x] T042 Update `backend/app/auth/__init__.py` with all exports (AuthenticatedUser, get_current_user, exceptions)
- [x] T043 Run all backend auth tests: `pytest tests/test_auth*.py tests/test_jwt*.py tests/test_user*.py -v`
- [x] T044 Validate against quickstart.md verification steps
- [x] T045 Run `/sp.analyze` to verify spec→plan→tasks alignment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: ✅ Complete
- **Foundational (Phase 2)**: ✅ Complete
- **User Stories (Phase 3-7)**: ✅ All complete
- **Polish (Phase 8)**: ✅ Complete

### User Story Dependencies

| Story                     | Depends On   | Status |
| ------------------------- | ------------ | ------ |
| US1 (Frontend Auth)       | Foundational | ✅     |
| US2 (Token Attachment)    | US1          | ✅     |
| US3 (Token Verification)  | Foundational | ✅     |
| US4 (Identity Extraction) | US3          | ✅     |
| US5 (User Isolation)      | US3, US4     | ✅     |

### Parallel Opportunities

| Phase   | Parallel Tasks             |
| ------- | -------------------------- |
| Phase 1 | T003, T004, T005 (all [P]) |
| Phase 2 | T010 (model tests)         |
| US1     | T011 (tests)               |
| US2     | T017 (tests)               |
| US3     | T022, T023 (tests)         |
| US4     | T031 (tests)               |
| US5     | T035 (tests)               |
| Phase 8 | T040, T041                 |

---

## Summary

| Metric                          | Value     | Status   |
| ------------------------------- | --------- | -------- |
| Total Tasks                     | 45        | 45/45 ✅ |
| Setup Tasks                     | 5         | 5/5 ✅   |
| Foundational Tasks              | 5         | 5/5 ✅   |
| US1 Tasks (Frontend Auth)       | 6         | 6/6 ✅   |
| US2 Tasks (Token Attachment)    | 5         | 5/5 ✅   |
| US3 Tasks (Token Verification)  | 9         | 9/9 ✅   |
| US4 Tasks (Identity Extraction) | 4         | 4/4 ✅   |
| US5 Tasks (User Isolation)      | 5         | 5/5 ✅   |
| Polish Tasks                    | 6         | 6/6 ✅   |
| Parallel Opportunities          | 12        | ✅       |
| MVP Scope                       | US1 + US3 | ✅       |

---

## Notes

- All tasks completed successfully
- Backend tests passed for JWT service logic
- Manual verification confirmed API protection
- Configuration fixed to handle shared .env files

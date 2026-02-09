# Implementation Plan: REST API & Authorization Logic

**Feature Branch**: `003-rest-api-authorization`  
**Created**: 2026-01-14  
**Status**: Ready for Review

## Goal

Implement RESTful API endpoints for task operations with JWT-based authorization, ensuring users can only access their own data through explicit path-based user scoping and JWT verification.

## Constitution Check

| Principle                     | Status | Notes                                                   |
| ----------------------------- | ------ | ------------------------------------------------------- |
| Spec-Driven Development       | ✅     | All endpoints traced to FR-001 through FR-017           |
| Security-First Design         | ✅     | JWT required, user isolation enforced at router level   |
| Deterministic Reproducibility | ✅     | No new env vars, uses existing JWT secret               |
| Separation of Concerns        | ✅     | Router, dependencies, schemas, service layers separated |
| Hackathon Reviewability       | ✅     | Full traceability, PHR created                          |
| Agentic Workflow              | ✅     | All code via Claude Code                                |

---

## Proposed Changes

### Component 1: API Module Structure

Create new `app/api/` module for REST API layer.

---

#### [NEW] `backend/app/api/__init__.py`

Empty init file for API package.

---

#### [NEW] `backend/app/api/schemas.py`

Pydantic models for request/response validation:

- `TaskCreateRequest`: title (required), description (optional)
- `TaskUpdateRequest`: title, description, completed (all optional)
- `TaskResponse`: Full task representation
- `ErrorResponse`: code, message, details (optional)

---

#### [NEW] `backend/app/api/dependencies.py`

Authorization dependency:

- `verify_user_access(user_id: str, user: AuthenticatedUser)`: Compares path user_id with JWT identity, raises 403 if mismatch
- Error handler for UUID validation

---

#### [NEW] `backend/app/api/tasks.py`

FastAPI router with 6 endpoints:

- `GET /api/{user_id}/tasks` → list_tasks
- `POST /api/{user_id}/tasks` → create_task
- `GET /api/{user_id}/tasks/{task_id}` → get_task
- `PUT /api/{user_id}/tasks/{task_id}` → update_task
- `DELETE /api/{user_id}/tasks/{task_id}` → delete_task
- `PATCH /api/{user_id}/tasks/{task_id}/complete` → toggle_complete

Each endpoint:

1. Depends on `get_current_user` (from Spec-2)
2. Depends on `verify_user_access` (new)
3. Uses `TaskRepository` from Spec-1
4. Returns standardized responses

---

### Component 2: Main Application Update

---

#### [MODIFY] `backend/app/main.py`

- Import and include the new tasks router
- Remove existing `/api/tasks` endpoints (replaced by user-scoped versions)
- Add exception handler for `HTTPException` to standardize error format

---

### Component 3: Tests

---

#### [NEW] `backend/tests/test_api_tasks.py`

Integration tests covering:

- All 6 endpoints with valid requests
- 401 tests (missing/invalid token)
- 403 tests (user_id mismatch)
- 404 tests (task not found, task not owned)
- 400 tests (validation errors)
- Toggle completion behavior

---

## Verification Plan

### Automated Tests

Run existing and new tests:

```bash
cd backend
pytest tests/test_api_tasks.py -v
```

**Expected**: All tests pass covering:

- Endpoint availability
- Auth enforcement (401/403)
- Ownership enforcement (404)
- CRUD correctness
- Error response format

### Existing Tests to Leverage

| Test File                 | Coverage                       | Status      |
| ------------------------- | ------------------------------ | ----------- |
| `test_auth_dependency.py` | JWT verification, 401 handling | ✅ Existing |
| `test_repository.py`      | TaskRepository CRUD            | ✅ Existing |
| `test_ownership.py`       | User isolation at DB level     | ✅ Existing |

### Manual Verification

Follow `quickstart.md` to manually test:

1. **Start server**: `cd backend && uvicorn app.main:app --reload`
2. **Generate test token** using Python script in quickstart
3. **Run curl commands** for each endpoint
4. **Verify responses** match expected status codes and formats

---

## Implementation Phases

### Phase 1: Setup (Tasks 1-3)

- Create `app/api/` directory structure
- Implement schemas.py with request/response models
- Implement dependencies.py with verify_user_access

### Phase 2: Endpoints (Tasks 4-9)

- Implement tasks.py router
- Add GET /api/{user_id}/tasks
- Add POST /api/{user_id}/tasks
- Add GET /api/{user_id}/tasks/{task_id}
- Add PUT /api/{user_id}/tasks/{task_id}
- Add DELETE /api/{user_id}/tasks/{task_id}
- Add PATCH /api/{user_id}/tasks/{task_id}/complete

### Phase 3: Integration (Tasks 10-11)

- Update main.py to include router
- Remove old endpoints
- Add error handlers

### Phase 4: Testing (Tasks 12-13)

- Create test_api_tasks.py
- Run all tests and verify

### Phase 5: Polish (Tasks 14-15)

- Add structured logging
- Verify quickstart flow works
- Run /sp.analyze

---

## Files Created/Modified Summary

| Action | File                      | Purpose                        |
| ------ | ------------------------- | ------------------------------ |
| NEW    | `app/api/__init__.py`     | Package init                   |
| NEW    | `app/api/schemas.py`      | Request/response models        |
| NEW    | `app/api/dependencies.py` | Authorization checks           |
| NEW    | `app/api/tasks.py`        | Task endpoints router          |
| MODIFY | `app/main.py`             | Include router, error handlers |
| NEW    | `tests/test_api_tasks.py` | Integration tests              |

---

## Risk Mitigation

| Risk                        | Mitigation                                        |
| --------------------------- | ------------------------------------------------- |
| Breaking existing endpoints | Old `/api/tasks` replaced; tests verify new paths |
| JWT mismatch logic error    | Explicit tests for 403 scenarios                  |
| Missing error cases         | Comprehensive test coverage for all status codes  |

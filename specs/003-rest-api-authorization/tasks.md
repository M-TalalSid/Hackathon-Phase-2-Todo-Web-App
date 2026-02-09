# Tasks: REST API & Authorization Logic

**Feature Branch**: `003-rest-api-authorization`  
**Input**: Design documents from `specs/003-rest-api-authorization/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Integration tests included as specified in verification plan.

**Organization**: Tasks grouped by user story (6 stories) to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1-US6) from spec.md

## Path Conventions

- **Backend**: `backend/app/`, `backend/tests/`
- **API Layer**: `backend/app/api/`

---

## Phase 1: Setup (API Module Structure)

**Purpose**: Create the new API module directory structure

- [x] T001 Create API package `backend/app/api/__init__.py`
- [x] T002 [P] Create API schemas module `backend/app/api/schemas.py` with ErrorResponse model
- [x] T003 [P] Create API dependencies module `backend/app/api/dependencies.py` with verify_user_access stub

**Checkpoint**: API module structure ready for implementation ✅

---

## Phase 2: Foundational (Authorization Infrastructure)

**Purpose**: Core authorization logic that ALL endpoints depend on

**⚠️ CRITICAL**: No endpoint work can begin until this phase is complete

- [x] T004 Implement ErrorResponse schema in `backend/app/api/schemas.py`
- [x] T005 Implement TaskCreateRequest schema in `backend/app/api/schemas.py`
- [x] T006 [P] Implement TaskUpdateRequest schema in `backend/app/api/schemas.py`
- [x] T007 [P] Implement TaskResponse schema in `backend/app/api/schemas.py`
- [x] T008 Implement verify_user_access dependency in `backend/app/api/dependencies.py`
- [x] T009 Add exception handlers to `backend/app/api/dependencies.py` for standardized errors
- [x] T010 Create tasks router scaffold in `backend/app/api/tasks.py`
- [x] T011 Register tasks router in `backend/app/main.py`
- [x] T012 Remove old `/api/tasks` endpoints from `backend/app/main.py`

**Checkpoint**: Foundation ready - user story implementation can now begin ✅

---

## Phase 3: User Story 1 - List User Tasks (Priority: P1) 🎯 MVP

**Goal**: Authenticated user retrieves their complete list of tasks

**Independent Test**: GET /api/{user_id}/tasks with valid JWT returns task list

### Implementation for User Story 1

- [x] T013 [US1] Implement GET /api/{user_id}/tasks endpoint in `backend/app/api/tasks.py`
- [x] T014 [US1] Add 403 Forbidden check for user_id mismatch in `backend/app/api/tasks.py`
- [x] T015 [US1] Add 401 Unauthorized check for missing token in `backend/app/api/tasks.py`
- [x] T016 [US1] Return empty array for users with no tasks in `backend/app/api/tasks.py`
- [x] T017 [US1] Add structured logging for list operation in `backend/app/api/tasks.py`

**Checkpoint**: User Story 1 fully functional - users can list their tasks ✅

---

## Phase 4: User Story 2 - Create New Task (Priority: P1) 🎯 MVP

**Goal**: Authenticated user creates a new task with ownership

**Independent Test**: POST /api/{user_id}/tasks with valid body returns 201 Created

### Implementation for User Story 2

- [x] T018 [US2] Implement POST /api/{user_id}/tasks endpoint in `backend/app/api/tasks.py`
- [x] T019 [US2] Validate request body (title required) in `backend/app/api/tasks.py`
- [x] T020 [US2] Return 400 Bad Request for empty/missing title in `backend/app/api/tasks.py`
- [x] T021 [US2] Return 201 Created with task object including generated ID in `backend/app/api/tasks.py`
- [x] T022 [US2] Add structured logging for create operation in `backend/app/api/tasks.py`

**Checkpoint**: User Stories 1 AND 2 complete - MVP achieved (list + create) ✅

---

## Phase 5: User Story 3 - Get Single Task (Priority: P2)

**Goal**: Authenticated user retrieves a specific task by ID

**Independent Test**: GET /api/{user_id}/tasks/{task_id} returns task if owned

### Implementation for User Story 3

- [x] T023 [US3] Implement GET /api/{user_id}/tasks/{task_id} endpoint in `backend/app/api/tasks.py`
- [x] T024 [US3] Validate task_id UUID format in `backend/app/api/tasks.py`
- [x] T025 [US3] Return 404 Not Found for unowned or non-existent tasks in `backend/app/api/tasks.py`
- [x] T026 [US3] Add structured logging for get operation in `backend/app/api/tasks.py`

**Checkpoint**: User Story 3 complete - single task retrieval works ✅

---

## Phase 6: User Story 4 - Update Task (Priority: P2)

**Goal**: Authenticated user updates an existing task they own

**Independent Test**: PUT /api/{user_id}/tasks/{task_id} with valid body returns updated task

### Implementation for User Story 4

- [x] T027 [US4] Implement PUT /api/{user_id}/tasks/{task_id} endpoint in `backend/app/api/tasks.py`
- [x] T028 [US4] Apply partial updates (only non-None fields) in `backend/app/api/tasks.py`
- [x] T029 [US4] Validate empty title rejection in `backend/app/api/tasks.py`
- [x] T030 [US4] Add structured logging for update operation in `backend/app/api/tasks.py`

**Checkpoint**: User Story 4 complete - task editing works ✅

---

## Phase 7: User Story 5 - Delete Task (Priority: P2)

**Goal**: Authenticated user permanently removes a task they own

**Independent Test**: DELETE /api/{user_id}/tasks/{task_id} returns 204 No Content

### Implementation for User Story 5

- [x] T031 [US5] Implement DELETE /api/{user_id}/tasks/{task_id} endpoint in `backend/app/api/tasks.py`
- [x] T032 [US5] Return 204 No Content on success in `backend/app/api/tasks.py`
- [x] T033 [US5] Return 404 Not Found for unowned tasks in `backend/app/api/tasks.py`
- [x] T034 [US5] Add structured logging for delete operation in `backend/app/api/tasks.py`

**Checkpoint**: User Story 5 complete - task deletion works ✅

---

## Phase 8: User Story 6 - Mark Task Complete/Incomplete (Priority: P3)

**Goal**: Authenticated user toggles task completion status

**Independent Test**: PATCH /api/{user_id}/tasks/{task_id}/complete toggles completed field

### Implementation for User Story 6

- [x] T035 [US6] Implement PATCH /api/{user_id}/tasks/{task_id}/complete endpoint in `backend/app/api/tasks.py`
- [x] T036 [US6] Toggle completed field (true→false, false→true) in `backend/app/api/tasks.py`
- [x] T037 [US6] Return updated task with toggled status in `backend/app/api/tasks.py`
- [x] T038 [US6] Add structured logging for complete operation in `backend/app/api/tasks.py`

**Checkpoint**: All 6 user stories complete ✅

---

## Phase 9: Testing & Verification

**Purpose**: Comprehensive integration tests for all endpoints

- [x] T039 [P] Create test file `backend/tests/test_api_tasks.py` with fixtures
- [x] T040 [P] Add 401 tests (missing/invalid token) in `backend/tests/test_api_tasks.py`
- [x] T041 [P] Add 403 tests (user_id mismatch) in `backend/tests/test_api_tasks.py`
- [x] T042 [P] Add 404 tests (not found/not owned) in `backend/tests/test_api_tasks.py`
- [x] T043 [P] Add 400 tests (validation errors) in `backend/tests/test_api_tasks.py`
- [x] T044 Add CRUD correctness tests in `backend/tests/test_api_tasks.py`
- [x] T045 Add toggle completion tests in `backend/tests/test_api_tasks.py`
- [x] T046 Run full test suite: `pytest backend/tests/ -v`

**Checkpoint**: All tests pass ✅

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation

- [x] T047 [P] Run quickstart.md validation with curl commands
- [x] T048 [P] Verify error response format consistency across all endpoints
- [x] T049 Review structured logging coverage
- [x] T050 Update walkthrough.md with API implementation summary

**Checkpoint**: All polish tasks complete ✅

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS all user stories
- **Phases 3-8 (User Stories)**: All depend on Phase 2 completion
  - Can proceed in parallel if multiple developers
  - Or sequentially: P1 → P1 → P2 → P2 → P2 → P3
- **Phase 9 (Testing)**: Depends on Phase 8 completion
- **Phase 10 (Polish)**: Depends on Phase 9 completion

### User Story Dependencies

| Story          | Depends On | Can Parallelize With           |
| -------------- | ---------- | ------------------------------ |
| US1 (List)     | Phase 2    | None (first)                   |
| US2 (Create)   | Phase 2    | US1 (same file but sequential) |
| US3 (Get)      | Phase 2    | US1, US2                       |
| US4 (Update)   | Phase 2    | US1, US2, US3                  |
| US5 (Delete)   | Phase 2    | US1-4                          |
| US6 (Complete) | Phase 2    | US1-5                          |

### Within Each User Story

1. Endpoint implementation first
2. Validation and error handling
3. Logging last
4. All tasks in same file (`tasks.py`)

---

## Parallel Opportunities

### Phase 1: All tasks parallel

```bash
Task: T001 (Create package)
Task: T002 (Create schemas)  # [P]
Task: T003 (Create dependencies)  # [P]
```

### Phase 2: Schema tasks parallel

```bash
Task: T005 (TaskCreateRequest)
Task: T006 (TaskUpdateRequest)  # [P]
Task: T007 (TaskResponse)  # [P]
```

### Phase 9: All test tasks parallel

```bash
Task: T040 (401 tests)  # [P]
Task: T041 (403 tests)  # [P]
Task: T042 (404 tests)  # [P]
Task: T043 (400 tests)  # [P]
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T012)
3. Complete Phase 3: User Story 1 - List Tasks (T013-T017)
4. Complete Phase 4: User Story 2 - Create Task (T018-T022)
5. **STOP and VALIDATE**: Test MVP independently
6. Deploy/demo if ready

### Incremental Delivery

| Milestone | Stories Complete | User Value                   |
| --------- | ---------------- | ---------------------------- |
| MVP       | US1 + US2        | Can list and create tasks    |
| v1.1      | + US3            | Can view individual tasks    |
| v1.2      | + US4            | Can edit tasks               |
| v1.3      | + US5            | Can delete tasks             |
| v1.4      | + US6            | Can toggle completion easily |

---

## Summary

| Metric                     | Count               |
| -------------------------- | ------------------- |
| **Total Tasks**            | 50                  |
| **Setup Tasks**            | 3                   |
| **Foundational Tasks**     | 9                   |
| **US1 Tasks**              | 5                   |
| **US2 Tasks**              | 5                   |
| **US3 Tasks**              | 4                   |
| **US4 Tasks**              | 4                   |
| **US5 Tasks**              | 4                   |
| **US6 Tasks**              | 4                   |
| **Testing Tasks**          | 8                   |
| **Polish Tasks**           | 4                   |
| **Parallel Opportunities** | 15 tasks marked [P] |

---

## Notes

- All endpoints implemented in single file: `backend/app/api/tasks.py`
- Schemas in: `backend/app/api/schemas.py`
- Dependencies in: `backend/app/api/dependencies.py`
- Tests in: `backend/tests/test_api_tasks.py`
- Verify tests fail before implementing (TDD where applicable)
- Commit after each phase or logical group
- Stop at any checkpoint to validate independently

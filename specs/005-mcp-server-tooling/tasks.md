# Tasks: MCP Server & Deterministic Task Tooling

**Input**: Design documents from `/specs/005-mcp-server-tooling/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Tests included as Phase will be added after core implementation to verify user stories.

**Implementation Status**: ✅ **COMPLETE** - All 54 tasks implemented

---

## Phase 1: Setup (Shared Infrastructure) ✅

**Purpose**: Project initialization and MCP server foundation

- [x] T001 Create `mcp-server/` directory structure per implementation plan
- [x] T002 Create `mcp-server/pyproject.toml` with dependencies (mcp, sqlmodel, asyncpg, pydantic)
- [x] T003 [P] Create `mcp-server/.env.example` with DATABASE_URL template
- [x] T004 [P] Create `mcp-server/README.md` with quickstart instructions
- [x] T005 Create `mcp-server/src/__init__.py` package initialization

---

## Phase 2: Foundational (Blocking Prerequisites) ✅

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T006 Create `mcp-server/src/db/__init__.py` database package
- [x] T007 Implement database connection in `mcp-server/src/db/connection.py` with async engine
- [x] T008 Create `mcp-server/src/models/__init__.py` models package
- [x] T009 Implement Task SQLModel in `mcp-server/src/models/task.py` per data-model.md
- [x] T010 [P] Create `mcp-server/src/errors/__init__.py` errors package
- [x] T011 Implement error codes in `mcp-server/src/errors/codes.py`
- [x] T012 Create `mcp-server/src/tools/__init__.py` tools package
- [x] T013 Implement MCP server entry point in `mcp-server/src/server.py` with tool registration framework
- [x] T014 Implement database table auto-creation on startup in `mcp-server/src/db/connection.py`

**Checkpoint**: ✅ Foundation ready

---

## Phase 3: User Story 1 - AI Agent Creates Task (Priority: P1) 🎯 MVP ✅

- [x] T015 [US1] Create `add_task` tool schema in `mcp-server/src/tools/add_task.py`
- [x] T016 [US1] Implement `add_task` validation (user_id required, title required 1-500 chars)
- [x] T017 [US1] Implement `add_task` database persistence logic
- [x] T018 [US1] Implement `add_task` error handling
- [x] T019 [US1] Register `add_task` tool in `mcp-server/src/server.py`

**Checkpoint**: ✅ `add_task` tool functional

---

## Phase 4: User Story 2 - AI Agent Lists Tasks (Priority: P1) ✅

- [x] T020 [US2] Create `list_tasks` tool schema in `mcp-server/src/tools/list_tasks.py`
- [x] T021 [US2] Implement `list_tasks` user_id validation
- [x] T022 [US2] Implement `list_tasks` status filter logic (all, pending, completed)
- [x] T023 [US2] Implement `list_tasks` database query with user_id scope
- [x] T024 [US2] Implement `list_tasks` error handling
- [x] T025 [US2] Register `list_tasks` tool in `mcp-server/src/server.py`

**Checkpoint**: ✅ `list_tasks` tool functional

---

## Phase 5: User Story 3 - AI Agent Completes Task (Priority: P1) ✅

- [x] T026 [US3] Create `complete_task` tool schema in `mcp-server/src/tools/complete_task.py`
- [x] T027 [US3] Implement `complete_task` ownership validation (user_id + task_id)
- [x] T028 [US3] Implement `complete_task` database update logic
- [x] T029 [US3] Implement `complete_task` error handling
- [x] T030 [US3] Register `complete_task` tool in `mcp-server/src/server.py`

**Checkpoint**: ✅ `complete_task` tool functional

---

## Phase 6: User Story 4 - AI Agent Updates Task (Priority: P2) ✅

- [x] T031 [US4] Create `update_task` tool schema in `mcp-server/src/tools/update_task.py`
- [x] T032 [US4] Implement `update_task` validation
- [x] T033 [US4] Implement `update_task` ownership validation
- [x] T034 [US4] Implement `update_task` database update logic with updated_at
- [x] T035 [US4] Implement `update_task` error handling
- [x] T036 [US4] Register `update_task` tool in `mcp-server/src/server.py`

**Checkpoint**: ✅ `update_task` tool functional

---

## Phase 7: User Story 5 - AI Agent Deletes Task (Priority: P2) ✅

- [x] T037 [US5] Create `delete_task` tool schema in `mcp-server/src/tools/delete_task.py`
- [x] T038 [US5] Implement `delete_task` ownership validation
- [x] T039 [US5] Implement `delete_task` database removal logic
- [x] T040 [US5] Implement `delete_task` error handling
- [x] T041 [US5] Register `delete_task` tool in `mcp-server/src/server.py`

**Checkpoint**: ✅ All 5 MCP tools functional

---

## Phase 8: Testing & Validation ✅

- [x] T042 Create `mcp-server/tests/__init__.py` and `conftest.py` with test database fixtures
- [x] T043 [P] Create `mcp-server/tests/test_add_task.py` for add_task tool
- [x] T044 [P] Create `mcp-server/tests/test_list_tasks.py` for list_tasks tool
- [x] T045 [P] Create `mcp-server/tests/test_complete_task.py` for complete_task tool
- [x] T046 [P] Create `mcp-server/tests/test_update_task.py` for update_task tool
- [x] T047 [P] Create `mcp-server/tests/test_delete_task.py` for delete_task tool
- [x] T048 Create `mcp-server/tests/test_user_isolation.py` for cross-user access prevention
- [x] T049 Run all tests and verify 100% pass rate

**Checkpoint**: ✅ Test suite complete

---

## Phase 9: Polish & Cross-Cutting Concerns ✅

- [x] T050 [P] Add .gitignore for mcp-server/
- [x] T051 [P] README.md with complete usage documentation
- [x] T052 Verify statelessness - no global state between calls
- [x] T053 Run quickstart.md validation steps
- [x] T054 Final code review for determinism guarantees

---

## Summary

| Metric          | Value        |
| --------------- | ------------ |
| **Total Tasks** | 54           |
| **Completed**   | 54 ✅        |
| **Status**      | **COMPLETE** |

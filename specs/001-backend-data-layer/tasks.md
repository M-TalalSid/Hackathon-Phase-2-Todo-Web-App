# Tasks: Core Backend & Data Layer

**Input**: Design documents from `/specs/001-backend-data-layer/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Included as per spec requirement (90% coverage, pytest for backend)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/app/` for source, `backend/tests/` for tests
- **Alembic**: `backend/alembic/` for migrations

---

## Phase 1: Setup (Shared Infrastructure) ✅

**Purpose**: Project initialization and basic structure

- [x] T001 Create backend project directory structure per implementation plan
- [x] T002 Create `backend/requirements.txt` with FastAPI, SQLModel, asyncpg, Alembic, structlog, pydantic-settings, python-dotenv, pytest, pytest-asyncio
- [x] T003 [P] Create `backend/.env.example` with DATABASE_URL and LOG_LEVEL placeholders
- [x] T004 [P] Create `backend/pyproject.toml` with project metadata and pytest configuration
- [x] T005 [P] Create `backend/app/__init__.py` empty module file
- [x] T006 [P] Create `backend/tests/__init__.py` empty module file

**Checkpoint**: ✅ Project structure created, dependencies defined

---

## Phase 2: Foundational (Blocking Prerequisites) ✅

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Implement `backend/app/config.py` with Pydantic Settings for DATABASE_URL and LOG_LEVEL from environment
- [x] T008 Implement `backend/app/exceptions.py` with DataLayerError, TaskNotFoundError, ValidationError, DatabaseConnectionError hierarchy
- [x] T009 Implement `backend/app/database.py` with async SQLAlchemy engine, connection pooling (pool_pre_ping=True), and session factory
- [x] T010 [P] Create `backend/app/models/__init__.py` module file
- [x] T011 [P] Create `backend/app/repositories/__init__.py` module file
- [x] T012 Initialize Alembic with `alembic init backend/alembic` and configure for async PostgreSQL
- [x] T013 Configure `backend/alembic/env.py` to load DATABASE_URL from environment and use async migrations
- [x] T014 Update `backend/alembic.ini` with correct script_location and sqlalchemy.url placeholder

**Checkpoint**: ✅ Foundation ready - database connection, configuration, and error handling in place

---

## Phase 3: User Story 1 - Backend Service Initialization (Priority: P1) 🎯 MVP ✅

**Goal**: Backend service boots successfully using environment-based configuration

**Independent Test**: Start backend with valid env vars → service reaches ready state without errors

### Tests for User Story 1

- [x] T015 [P] [US1] Create `backend/tests/test_config.py` with tests for valid config loading, missing DATABASE_URL error, default LOG_LEVEL
- [x] T016 [P] [US1] Create `backend/tests/test_main.py` with test for application startup and health endpoint

### Implementation for User Story 1

- [x] T017 [US1] Implement `backend/app/main.py` with FastAPI app, lifespan events, structured logging initialization
- [x] T018 [US1] Add health check endpoint `/health` returning status, database connection state, version
- [x] T019 [US1] Add startup validation that fails fast if DATABASE_URL is missing or invalid format
- [x] T020 [US1] Add structured logging with structlog JSON output for all startup events

**Checkpoint**: ✅ Backend boots with valid config, fails clearly with invalid config

---

## Phase 4: User Story 2 - Database Connection (Priority: P1) ✅

**Goal**: Backend establishes and verifies connection to Neon PostgreSQL

**Independent Test**: Configure valid Neon credentials → connection established and simple query succeeds

### Tests for User Story 2

- [x] T021 [P] [US2] Create `backend/tests/test_database.py` with tests for connection success, connection failure handling, session lifecycle

### Implementation for User Story 2

- [x] T022 [US2] Add connection verification function in `backend/app/database.py` that runs test query on startup
- [x] T023 [US2] Add database health check endpoint `/health/db` returning connected status, latency, database name
- [x] T024 [US2] Integrate database connection verification into FastAPI lifespan startup event
- [x] T025 [US2] Add connection error handling with logged details and graceful startup failure

**Checkpoint**: ✅ Database connection verified on startup, health check reports DB status

---

## Phase 5: User Story 3 - Database Schema Creation (Priority: P1) ✅

**Goal**: Required tables physically created in Neon PostgreSQL with idempotent schema initialization

**Independent Test**: Run schema init on fresh DB → tasks table exists with all columns and indexes

### Tests for User Story 3

- [x] T026 [P] [US3] Create `backend/tests/test_schema.py` with tests for table existence, column types, index verification

### Implementation for User Story 3

- [x] T027 [US3] Implement Task model in `backend/app/models/task.py` with TaskBase, Task (table=True), TaskCreate, TaskUpdate, TaskRead
- [x] T028 [US3] Create initial migration `backend/alembic/versions/001_create_tasks_table.py` with tasks table, indexes, updated_at trigger
- [x] T029 [US3] Add migration command documentation to `backend/README.md`
- [x] T030 [US3] Verify migration is idempotent (running twice produces no errors)

**Checkpoint**: ✅ Tasks table created with all columns, indexes exist on id and user_id

---

## Phase 6: User Story 4 - Task Data Persistence (Priority: P1) ✅

**Goal**: Task records persist across application restarts

**Independent Test**: Create task → restart app → task still retrievable

### Tests for User Story 4

- [x] T031 [P] [US4] Create `backend/tests/test_persistence.py` with tests for create/retrieve persistence, update persistence, delete persistence

### Implementation for User Story 4

- [x] T032 [US4] Implement basic create and get_by_id methods in `backend/app/repositories/task_repository.py` (no ownership yet)
- [x] T033 [US4] Add persistence verification test that confirms data survives session close/reopen
- [x] T034 [US4] Ensure all data goes to PostgreSQL (no in-memory caching that could lose data)

**Checkpoint**: ✅ Tasks persist in PostgreSQL, survive app restarts

---

## Phase 7: User Story 5 - User–Task Ownership (Priority: P1) ✅

**Goal**: Every task strictly associated with single user_id, ownership enforced at data layer

**Independent Test**: Create tasks for different users → queries return only owned tasks, cross-user access blocked

### Tests for User Story 5

- [x] T035 [P] [US5] Create `backend/tests/test_ownership.py` with tests for user_id required on create, query filters by user_id, cross-user get returns None, cross-user update/delete blocked

### Implementation for User Story 5

- [x] T036 [US5] Update `backend/app/repositories/task_repository.py` to require user_id on all operations
- [x] T037 [US5] Add user_id filter to get_by_id, list_by_user queries
- [x] T038 [US5] Add ownership validation to update and delete methods (return None/False if not owned)
- [x] T039 [US5] Add validation that rejects null/empty user_id on create

**Checkpoint**: ✅ Ownership enforced at data layer, cross-user access impossible

---

## Phase 8: User Story 6 - CRUD Operations at Data Layer (Priority: P2) ✅

**Goal**: Complete CRUD business logic with all edge cases handled

**Independent Test**: Exercise each CRUD operation → correct database state, proper error handling

### Tests for User Story 6

- [x] T040 [P] [US6] Create `backend/tests/test_repository.py` with tests for create returns task with id/timestamps, get by id returns task or None, list returns all user tasks, update changes fields and updated_at, delete removes task, not found handling

### Implementation for User Story 6

- [x] T041 [US6] Implement complete TaskRepository in `backend/app/repositories/task_repository.py` with create, get_by_id, list_by_user, update, delete
- [x] T042 [US6] Add automatic updated_at timestamp update on modifications
- [x] T043 [US6] Add input validation for title (required, 1-255 chars), user_id (required, non-empty)
- [x] T044 [US6] Add structured logging for all CRUD operations with user_id context
- [x] T045 [US6] Export TaskRepository in `backend/app/repositories/__init__.py`

**Checkpoint**: ✅ All CRUD operations work with ownership enforcement and logging

---

## Phase 9: Polish & Cross-Cutting Concerns ✅

**Purpose**: Improvements that affect multiple user stories

- [x] T046 [P] Create `backend/README.md` with setup instructions, environment variables, running migrations, running tests
- [x] T047 [P] Create `.gitignore` entries for .env, **pycache**, .venv, .pytest_cache
- [ ] T048 Run all tests and verify 90%+ coverage with `pytest --cov=app --cov-report=term-missing`
- [ ] T049 Validate against quickstart.md verification steps
- [ ] T050 Run `/sp.analyze` to verify spec→plan→tasks alignment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: ✅ Complete
- **Foundational (Phase 2)**: ✅ Complete
- **User Stories (Phase 3-8)**: ✅ All complete
- **Polish (Phase 9)**: ⏳ In progress (verification tasks pending)

### User Story Dependencies

| Story                 | Depends On   | Status |
| --------------------- | ------------ | ------ |
| US1 (Service Init)    | Foundational | ✅     |
| US2 (DB Connection)   | US1          | ✅     |
| US3 (Schema Creation) | US2          | ✅     |
| US4 (Persistence)     | US3          | ✅     |
| US5 (Ownership)       | US4          | ✅     |
| US6 (CRUD Operations) | US5          | ✅     |

> **Note**: This feature has sequential dependencies because each story builds on the previous one (connection → schema → persistence → ownership → CRUD).

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models before repositories
- Core implementation before integration
- Story complete before moving to next

### Parallel Opportunities

| Phase   | Parallel Tasks                   |
| ------- | -------------------------------- |
| Phase 1 | T003, T004, T005, T006 (all [P]) |
| Phase 2 | T010, T011 (module files)        |
| Each US | Test tasks marked [P]            |

---

## Parallel Example: Phase 1 Setup

```bash
# Launch all parallel setup tasks together:
Task: "Create backend/.env.example with DATABASE_URL and LOG_LEVEL placeholders"
Task: "Create backend/pyproject.toml with project metadata and pytest configuration"
Task: "Create backend/app/__init__.py empty module file"
Task: "Create backend/tests/__init__.py empty module file"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3)

1. ✅ Complete Phase 1: Setup
2. ✅ Complete Phase 2: Foundational
3. ✅ Complete Phase 3: US1 - Service boots with config
4. ✅ Complete Phase 4: US2 - Database connects
5. ✅ Complete Phase 5: US3 - Schema created
6. **STOP and VALIDATE**: Backend connects to Neon, tables exist, service healthy

### Full Feature Delivery

1. ✅ MVP (above) → Foundation + Connection + Schema ready
2. ✅ Add US4 (Persistence) → Data survives restarts
3. ✅ Add US5 (Ownership) → User isolation complete
4. ✅ Add US6 (CRUD) → Full data layer ready
5. ⏳ Polish phase → Documentation, coverage, validation

---

## Summary

| Metric                 | Value                                   | Status   |
| ---------------------- | --------------------------------------- | -------- |
| Total Tasks            | 50                                      | 47/50 ✅ |
| Setup Tasks            | 6                                       | 6/6 ✅   |
| Foundational Tasks     | 8                                       | 8/8 ✅   |
| US1 Tasks              | 6 (2 tests, 4 impl)                     | 6/6 ✅   |
| US2 Tasks              | 5 (1 test, 4 impl)                      | 5/5 ✅   |
| US3 Tasks              | 5 (1 test, 4 impl)                      | 5/5 ✅   |
| US4 Tasks              | 4 (1 test, 3 impl)                      | 4/4 ✅   |
| US5 Tasks              | 5 (1 test, 4 impl)                      | 5/5 ✅   |
| US6 Tasks              | 6 (1 test, 5 impl)                      | 6/6 ✅   |
| Polish Tasks           | 5                                       | 2/5 ✅   |
| Parallel Opportunities | 12 tasks marked [P]                     | ✅       |
| MVP Scope              | US1-US3 (Service + Connection + Schema) | ✅       |

---

## Notes

- [P] tasks = different files, no dependencies
- [USx] label maps task to specific user story for traceability
- This feature has sequential story dependencies (data layer builds incrementally)
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate progress

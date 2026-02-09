# Implementation Plan: Core Backend & Data Layer

**Branch**: `001-backend-data-layer` | **Date**: 2026-01-13 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-backend-data-layer/spec.md`

## Summary

Implement the foundational data layer for a multi-user todo application. This includes FastAPI backend initialization, Neon PostgreSQL integration via SQLModel, explicit database schema creation, and a repository pattern for CRUD operations with strict user–task ownership enforcement at the data-access layer.

**Key Deliverables**:

- FastAPI application with environment-based configuration
- SQLModel Task entity with UUID primary key
- Alembic migrations for versioned schema management
- TaskRepository with ownership-enforced CRUD operations
- Structured logging and error handling
- Comprehensive test coverage

## Technical Context

**Language/Version**: Python 3.11+  
**Primary Dependencies**: FastAPI, SQLModel, SQLAlchemy 2.0, asyncpg, Alembic, structlog  
**Storage**: Neon Serverless PostgreSQL  
**Testing**: pytest, pytest-asyncio  
**Target Platform**: Linux server (containerized)  
**Project Type**: Backend service (part of web application)  
**Performance Goals**: CRUD operations <200ms p95  
**Constraints**: No in-memory state, all config via environment variables  
**Scale/Scope**: Single service, foundation for multi-user todo app

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                          | Status  | Evidence                                          |
| ---------------------------------- | ------- | ------------------------------------------------- |
| I. Spec-Driven Development         | ✅ PASS | Plan derived from spec.md with full traceability  |
| II. Security-First Design          | ✅ PASS | Ownership enforced at data layer (FR-011, FR-012) |
| III. Deterministic Reproducibility | ✅ PASS | Alembic migrations, env vars, explicit schema     |
| IV. Separation of Concerns         | ✅ PASS | Repository pattern, no API in this spec           |
| V. Hackathon Reviewability         | ✅ PASS | PHRs created, spec→plan→tasks flow maintained     |
| VI. Agentic Workflow               | ✅ PASS | All code will be generated via Claude Code        |

**Database Standards Check**:

- ✅ Schema explicit and version-controlled via Alembic
- ✅ Tasks have user_id field
- ✅ Indexes on user_id
- ✅ Ownership validated on all operations
- ✅ No in-memory state

## Project Structure

### Documentation (this feature)

```text
specs/001-backend-data-layer/
├── spec.md              ✅ Feature specification
├── plan.md              ✅ This implementation plan
├── research.md          ✅ Phase 0 research decisions
├── data-model.md        ✅ Entity definitions and schema
├── quickstart.md        ✅ Developer setup guide
├── contracts/
│   └── data-layer.md    ✅ Repository interface contracts
├── checklists/
│   └── requirements.md  ✅ Quality validation checklist
└── tasks.md             📋 Phase 2 output (/sp.tasks)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI entry point, lifespan events
│   ├── config.py            # Pydantic settings from environment
│   ├── database.py          # Async engine, session factory
│   ├── models/
│   │   ├── __init__.py
│   │   └── task.py          # Task SQLModel definitions
│   ├── repositories/
│   │   ├── __init__.py
│   │   └── task_repository.py  # CRUD with ownership
│   └── exceptions.py        # Custom exception hierarchy
├── alembic/
│   ├── env.py               # Alembic async configuration
│   ├── script.py.mako
│   └── versions/
│       └── 001_create_tasks_table.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Pytest fixtures
│   ├── test_models.py       # Model validation tests
│   ├── test_repository.py   # CRUD and ownership tests
│   └── test_database.py     # Connection and schema tests
├── alembic.ini
├── requirements.txt
├── .env.example
└── pyproject.toml
```

**Structure Decision**: Backend-only structure since this spec excludes frontend. Uses standard FastAPI layout with repository pattern for data access.

## Proposed Changes

### Component 1: Project Foundation

Sets up the Python project structure, dependencies, and configuration.

---

#### [NEW] [requirements.txt](file:///c:/Users/TALAL/Desktop/Phase-2-Hackathon/todo-web-app/backend/requirements.txt)

Python dependencies for the backend service:

- `fastapi>=0.109.0`
- `uvicorn[standard]>=0.27.0`
- `sqlmodel>=0.0.14`
- `asyncpg>=0.29.0`
- `sqlalchemy[asyncio]>=2.0.25`
- `alembic>=1.13.0`
- `pydantic-settings>=2.1.0`
- `structlog>=24.1.0`
- `python-dotenv>=1.0.0`

---

#### [NEW] [config.py](file:///c:/Users/TALAL/Desktop/Phase-2-Hackathon/todo-web-app/backend/app/config.py)

Environment-based configuration using Pydantic Settings:

- `DATABASE_URL`: Required, Neon PostgreSQL connection string
- `LOG_LEVEL`: Optional, defaults to "INFO"
- Validation of required variables on startup

---

### Component 2: Database Layer

Establishes database connection, session management, and schema.

---

#### [NEW] [database.py](file:///c:/Users/TALAL/Desktop/Phase-2-Hackathon/todo-web-app/backend/app/database.py)

Async database engine and session configuration:

- Async SQLAlchemy engine with connection pooling
- Pool pre-ping for serverless resilience
- Session factory with async context manager
- Connection verification function

---

#### [NEW] [alembic/env.py](file:///c:/Users/TALAL/Desktop/Phase-2-Hackathon/todo-web-app/backend/alembic/env.py)

Alembic configuration for async migrations:

- Loads DATABASE_URL from environment
- Configures async migration runner
- Imports SQLModel metadata for autogenerate

---

#### [NEW] [alembic/versions/001_create_tasks_table.py](file:///c:/Users/TALAL/Desktop/Phase-2-Hackathon/todo-web-app/backend/alembic/versions/001_create_tasks_table.py)

Initial migration creating Tasks table:

- UUID primary key with default
- user_id, title, description, completed columns
- created_at, updated_at with defaults
- Index on user_id
- Update trigger for updated_at

---

### Component 3: Models

SQLModel entity definitions.

---

#### [NEW] [models/task.py](file:///c:/Users/TALAL/Desktop/Phase-2-Hackathon/todo-web-app/backend/app/models/task.py)

Task model hierarchy:

- `TaskBase`: Shared validation fields
- `Task`: Database table model with id, timestamps
- `TaskCreate`: Input model for creation
- `TaskUpdate`: Partial update model
- `TaskRead`: Response model

---

### Component 4: Repository Layer

Data access with ownership enforcement.

---

#### [NEW] [repositories/task_repository.py](file:///c:/Users/TALAL/Desktop/Phase-2-Hackathon/todo-web-app/backend/app/repositories/task_repository.py)

TaskRepository implementing CRUD with ownership:

- `create(user_id, data)`: Create task for user
- `get_by_id(user_id, task_id)`: Get with ownership check
- `list_by_user(user_id)`: List user's tasks
- `update(user_id, task_id, data)`: Update with ownership
- `delete(user_id, task_id)`: Delete with ownership

All queries filter by user_id to prevent cross-user access.

---

#### [NEW] [exceptions.py](file:///c:/Users/TALAL/Desktop/Phase-2-Hackathon/todo-web-app/backend/app/exceptions.py)

Custom exception hierarchy:

- `DataLayerError`: Base exception
- `TaskNotFoundError`: Task not found or not owned
- `ValidationError`: Input validation failed
- `DatabaseConnectionError`: Database unreachable

---

### Component 5: Application Entry

FastAPI application bootstrap.

---

#### [NEW] [main.py](file:///c:/Users/TALAL/Desktop/Phase-2-Hackathon/todo-web-app/backend/app/main.py)

FastAPI application with lifespan:

- Environment validation on startup
- Database connection verification
- Health check endpoint (minimal, for verification)
- Structured logging initialization
- Graceful shutdown

---

### Component 6: Tests

Comprehensive test suite.

---

#### [NEW] [tests/conftest.py](file:///c:/Users/TALAL/Desktop/Phase-2-Hackathon/todo-web-app/backend/tests/conftest.py)

Pytest fixtures:

- Test database session
- Sample user IDs
- Task factory for test data

---

#### [NEW] [tests/test_models.py](file:///c:/Users/TALAL/Desktop/Phase-2-Hackathon/todo-web-app/backend/tests/test_models.py)

Model validation tests:

- Task creation with valid data
- Validation errors for empty title
- Validation errors for missing user_id
- Default values applied correctly

---

#### [NEW] [tests/test_repository.py](file:///c:/Users/TALAL/Desktop/Phase-2-Hackathon/todo-web-app/backend/tests/test_repository.py)

Repository operation tests:

- Create task successfully
- Get task by ID with ownership
- List tasks for user only
- Update with ownership enforcement
- Delete with ownership enforcement
- Cross-user access blocked

---

#### [NEW] [tests/test_database.py](file:///c:/Users/TALAL/Desktop/Phase-2-Hackathon/todo-web-app/backend/tests/test_database.py)

Database connection tests:

- Connection established successfully
- Schema verification (tables exist)
- Connection error handling

---

## Verification Plan

### Automated Tests

```bash
# Run all tests with coverage
cd backend
pytest tests/ -v --cov=app --cov-report=term-missing

# Expected: 90%+ coverage, all tests pass
```

### Schema Verification

```bash
# Verify migrations apply cleanly
alembic upgrade head

# Verify table exists with correct structure
psql $DATABASE_URL -c "\d tasks"
```

### Manual Verification

1. Start backend: `uvicorn app.main:app --reload`
2. Check health endpoint: `curl http://localhost:8000/health`
3. Verify logs show database connection
4. Restart service and verify same behavior (persistence)

### Ownership Enforcement Test

```bash
# Via pytest
pytest tests/test_repository.py::test_cross_user_access_blocked -v
```

## Implementation Order

| Phase | Tasks                                      | Dependency    |
| ----- | ------------------------------------------ | ------------- |
| 1     | Project setup, requirements.txt, config.py | None          |
| 2     | database.py, alembic setup                 | Phase 1       |
| 3     | models/task.py                             | Phase 1       |
| 4     | alembic migration, run migration           | Phase 2, 3    |
| 5     | exceptions.py                              | Phase 1       |
| 6     | repositories/task_repository.py            | Phase 3, 4, 5 |
| 7     | main.py with health check                  | Phase 2, 6    |
| 8     | All tests                                  | All above     |
| 9     | Verification and documentation             | All above     |

## Complexity Tracking

No constitution violations requiring justification. Plan follows all required patterns:

- Repository pattern for data access (constitution-aligned)
- Alembic for migrations (constitution-mandated)
- Environment variables for configuration (constitution-mandated)
- Ownership at data layer (spec requirement FR-011, FR-012)

## Related Artifacts

- [research.md](./research.md) - Technical decisions with rationale
- [data-model.md](./data-model.md) - Entity definitions and schema
- [contracts/data-layer.md](./contracts/data-layer.md) - Repository interface
- [quickstart.md](./quickstart.md) - Developer setup guide

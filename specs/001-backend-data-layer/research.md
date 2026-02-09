# Research: Core Backend & Data Layer

**Feature**: `001-backend-data-layer`  
**Date**: 2026-01-13  
**Status**: Complete

## Research Tasks

### 1. SQLModel for ORM and Schema Generation

**Decision**: Use SQLModel as the ORM for all database operations

**Rationale**:

- SQLModel is built on SQLAlchemy and Pydantic, providing type-safe database operations
- Native integration with FastAPI (same author, designed to work together)
- Combines data validation (Pydantic) with database models (SQLAlchemy) in a single class
- Supports async operations via SQLAlchemy 2.0 async engine
- Simpler API than raw SQLAlchemy while maintaining full power

**Alternatives Considered**:

- **SQLAlchemy Core**: More flexible but requires separate Pydantic models for validation
- **Tortoise ORM**: Async-first but less mature ecosystem and tooling
- **Django ORM**: Would require bringing Django as dependency, overkill for FastAPI

**Best Practices for SQLModel with Neon PostgreSQL**:

- Use `create_async_engine` for async database operations in serverless environment
- Configure connection pooling with `pool_pre_ping=True` for serverless resilience
- Use `echo=False` in production for performance
- Leverage `SQLModel.model_validate()` for request/response serialization

---

### 2. Primary Key Strategy (UUID vs Integer)

**Decision**: Use UUID v4 for task primary keys

**Rationale**:

- UUIDs are globally unique, safe for distributed systems
- No information leakage about record creation order or count
- SQLModel/SQLAlchemy provides native UUID support via `uuid.uuid4`
- Neon PostgreSQL has native UUID type with efficient storage
- Constitution specifies UUID in spec (FR-005)

**Alternatives Considered**:

- **Auto-incrementing Integer**: Simpler but exposes record count, collision risk in distributed systems
- **ULID**: Sortable UUIDs, but adds dependency and not specified in constitution

**Implementation**:

```python
from uuid import uuid4, UUID
from sqlmodel import Field, SQLModel

class Task(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
```

---

### 3. Placement of Ownership Validation

**Decision**: Enforce ownership at the data-access (repository) layer, not API layer

**Rationale**:

- Defense in depth: ownership checks cannot be bypassed by future API changes
- Aligns with FR-011 and FR-012: "Data-access layer MUST filter/validate user_id"
- Simplifies API layer code (no duplicate validation)
- Makes testing more focused (unit test repository, integration test API)
- Constitution Section II: "Cross-user data access MUST be prevented at both API and database query levels"

**Alternatives Considered**:

- **API layer only**: Faster queries but vulnerable to future code changes
- **Both layers**: Redundant but provides defense in depth (partial implementation—API adds convenience checks)

**Implementation Strategy**:

- All repository methods accept `user_id` as required parameter
- All SELECT/UPDATE/DELETE queries include `WHERE user_id = :user_id`
- Repository returns `None` or raises `NotFoundError` for ownership violations
- No exposure of raw database access outside repository layer

---

### 4. Migration Strategy

**Decision**: Use Alembic for versioned database migrations

**Rationale**:

- Constitution requires "explicit, versionable, and migrated via tools like Alembic" (Section III)
- FR-014: "System MUST support database schema migrations via explicit, versionable migration files"
- Alembic provides revision history, rollback capability, and deterministic migrations
- Works seamlessly with SQLModel/SQLAlchemy models
- Standard in Python/FastAPI ecosystem

**Alternatives Considered**:

- **SQLModel `create_all()`**: Simple but no versioning, no rollback, not idempotent for changes
- **Manual SQL scripts**: Error-prone, no dependency tracking

**Implementation**:

- Use `alembic init` to set up migrations directory
- Auto-generate migrations from SQLModel models
- Apply migrations on application startup or as separate deployment step
- Store migration history in `alembic_version` table

---

### 5. Error Handling Strategy for Database Operations

**Decision**: Use custom exception hierarchy with structured logging

**Rationale**:

- FR-013: "System MUST handle database errors gracefully with logged details"
- SC-009: "All database operations produce structured, logged output for debugging"
- Constitution requires "standardized JSON error responses with code, message, details"
- Custom exceptions allow consistent error handling across repository layer

**Alternatives Considered**:

- **Let exceptions bubble up**: Exposes internal errors to callers, inconsistent handling
- **Return error codes**: Less Pythonic, harder to trace

**Implementation**:

```python
class TaskNotFoundError(Exception):
    """Raised when task is not found or user doesn't own it"""
    pass

class DatabaseConnectionError(Exception):
    """Raised when database connection fails"""
    pass

class ValidationError(Exception):
    """Raised when input validation fails"""
    pass
```

**Logging Strategy**:

- Use `structlog` or Python `logging` with JSON formatter
- Log all database operations with context: user_id, operation, duration
- Log errors with full traceback for debugging
- Never log sensitive data (full database URLs, user passwords)

---

### 6. Neon PostgreSQL Connection Best Practices

**Decision**: Use async SQLAlchemy engine with connection pooling optimized for serverless

**Rationale**:

- Neon is serverless PostgreSQL; connections may be terminated unexpectedly
- Need connection pooling with health checks for reliability
- Async operations for FastAPI compatibility

**Implementation**:

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Connection string from environment
DATABASE_URL = os.getenv("DATABASE_URL")

# Convert postgres:// to postgresql+asyncpg://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)

engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # Disable SQL logging in production
    pool_pre_ping=True,  # Verify connections before use
    pool_size=5,  # Conservative for serverless
    max_overflow=10,
)

async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
```

**Environment Variable Format**:

```
DATABASE_URL=postgres://user:password@host.neon.tech:5432/database?sslmode=require
```

---

### 7. Timestamp Handling

**Decision**: Use `datetime` with `timezone.utc` and database defaults

**Rationale**:

- FR-005 specifies auto-generated `created_at` and auto-updated `updated_at`
- UTC timestamps avoid timezone confusion
- Database-level defaults ensure consistency even for raw SQL operations

**Implementation**:

```python
from datetime import datetime, timezone
from sqlmodel import Field

class Task(SQLModel, table=True):
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False,
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)}
    )
```

---

## Summary of Decisions

| Topic                | Decision                      | Rationale                                                  |
| -------------------- | ----------------------------- | ---------------------------------------------------------- |
| ORM                  | SQLModel                      | Native FastAPI integration, type-safe, Pydantic validation |
| Primary Key          | UUID v4                       | Globally unique, no info leakage, constitution-aligned     |
| Ownership Validation | Data-access layer             | Defense in depth, constitution-mandated                    |
| Migrations           | Alembic                       | Versioned, reversible, constitution-mandated               |
| Error Handling       | Custom exceptions + structlog | Consistent errors, structured debugging                    |
| Connection           | Async SQLAlchemy + pooling    | Serverless-optimized, FastAPI-compatible                   |
| Timestamps           | UTC datetime + DB defaults    | Consistent, timezone-safe                                  |

## Next Phase

Proceed to Phase 1: Generate `data-model.md`, `contracts/`, and `quickstart.md`.

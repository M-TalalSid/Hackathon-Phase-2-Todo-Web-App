# Research: MCP Server & Deterministic Task Tooling

**Feature**: 005-mcp-server-tooling  
**Date**: 2026-02-05  
**Phase**: 0 - Research & Discovery

## Research Topics

### 1. Official MCP SDK for Python

**Decision**: Use `mcp` package (Official MCP SDK)

**Rationale**:

- Official SDK maintained by Anthropic
- Constitution requires Official MCP SDK (Principle VIII)
- Provides standardized tool registration dynamics
- Supports async operations for database access
- Well-documented with examples

**Alternatives Considered**:

- Custom MCP implementation - Rejected: Violates constitution, higher complexity
- FastMCP - Rejected: Not the official SDK, less standardized

**Installation**: `pip install mcp`

### 2. SQLModel Async Support

**Decision**: Use SQLModel with async SQLAlchemy engine

**Rationale**:

- Consistent with existing backend ORM
- Async support via `asyncpg` for PostgreSQL
- Type-safe with Pydantic integration
- Simpler than raw SQLAlchemy for this use case

**Alternatives Considered**:

- Raw SQL queries - Rejected: Less maintainable, manual SQL injection prevention
- Tortoise ORM - Rejected: Different ORM from existing backend

**Dependencies**: `sqlmodel`, `asyncpg`, `sqlalchemy[asyncio]`

### 3. Database Connection Strategy

**Decision**: Use existing `DATABASE_URL` environment variable with async engine

**Rationale**:

- Consistent with backend configuration
- Neon PostgreSQL supports async connections
- Single connection pool per server instance
- Connection created on startup, no state between calls

**Implementation**:

```python
from sqlmodel import create_engine
from sqlmodel.ext.asyncio.session import AsyncSession, create_async_engine

DATABASE_URL = os.getenv("DATABASE_URL")
async_engine = create_async_engine(DATABASE_URL, echo=False)
```

### 4. MCP Tool Registration Pattern

**Decision**: Decorator-based tool registration with Pydantic schemas

**Rationale**:

- Clean separation of tool definition and implementation
- Automatic schema generation for MCP clients
- Input validation via Pydantic
- Matches Official MCP SDK patterns

**Pattern**:

```python
from mcp.server import Server
from mcp.server.stdio import stdio_server

server = Server("task-tools")

@server.call_tool()
async def add_task(user_id: str, title: str, description: str = None):
    ...
```

### 5. Error Handling Strategy

**Decision**: Structured error responses with predefined codes

**Rationale**:

- Machine-readable for AI agents
- Consistent format across all tools
- No internal state leakage
- Maps to spec-defined error codes

**Error Codes**:
| Code | HTTP Equivalent | When Used |
|------|-----------------|-----------|
| AUTH_REQUIRED | 401 | Missing/empty user_id |
| VALIDATION_ERROR | 400 | Invalid input format |
| NOT_FOUND | 404 | Task doesn't exist or wrong user |
| INVALID_INPUT | 400 | Malformed JSON |
| SERVICE_UNAVAILABLE | 503 | Database connection failure |

### 6. Timestamp Handling

**Decision**: Database-managed timestamps with UTC

**Rationale**:

- Deterministic behavior (database handles time)
- Consistent timezone (UTC)
- Automatic `updated_at` on modifications
- No Python-side time generation

**Implementation**:

```python
from sqlmodel import Field
from sqlalchemy import func
from datetime import datetime

class Task(SQLModel, table=True):
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"server_default": func.now()})
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": func.now()})
```

### 7. Project Separation Decision

**Decision**: New `mcp-server/` directory at repository root

**Rationale**:

- Constitution Principle IV requires separation of concerns
- MCP layer is architecturally distinct from FastAPI backend
- Independent testing and deployment possible
- Clear boundary between AI reasoning layer and data mutation layer

**Alternatives Considered**:

- Inside `backend/` as submodule - Rejected: Blurs architectural boundary
- Monorepo package - Rejected: Overcomplicated for hackathon scope

## Resolved Clarifications

All technical context items resolved. No NEEDS CLARIFICATION markers remain.

## Dependencies Summary

```toml
[project]
dependencies = [
    "mcp>=1.0.0",
    "sqlmodel>=0.0.14",
    "asyncpg>=0.29.0",
    "sqlalchemy[asyncio]>=2.0.0",
    "pydantic>=2.0.0",
    "python-dotenv>=1.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0.0",
    "pytest-asyncio>=0.23.0",
]
```

## Next Steps

Research complete. Proceed to Phase 1: Data Model & Contracts.

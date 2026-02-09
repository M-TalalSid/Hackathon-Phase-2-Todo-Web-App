# Implementation Plan: MCP Server & Deterministic Task Tooling

**Branch**: `005-mcp-server-tooling` | **Date**: 2026-02-05 | **Spec**: [spec.md](file:///c:/Users/TALAL/Desktop/Phase-2-Hackathon/todo-web-app/specs/005-mcp-server-tooling/spec.md)  
**Input**: Feature specification from `/specs/005-mcp-server-tooling/spec.md`

## Summary

Implement a stateless MCP Server that exposes secure, deterministic task management tools for AI agents. The MCP server acts as the sole authority for task mutations, ensuring strict user isolation, predictable behavior, and database-backed persistence. The server exposes 5 tools: `add_task`, `list_tasks`, `update_task`, `complete_task`, `delete_task`.

## Technical Context

**Language/Version**: Python 3.11+  
**Primary Dependencies**: Official MCP SDK (`mcp`), SQLModel, asyncpg, pydantic  
**Storage**: Neon Serverless PostgreSQL (existing database from backend)  
**Testing**: pytest, pytest-asyncio  
**Target Platform**: Linux server / Windows development  
**Project Type**: Backend service (MCP server subprocess)  
**Performance Goals**: Tool response < 500ms, stateless between calls  
**Constraints**: Zero in-memory state, all data in PostgreSQL  
**Scale/Scope**: Single MCP server instance, 5 tools, user-isolated operations

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                          | Status  | Notes                                       |
| ---------------------------------- | ------- | ------------------------------------------- |
| I. Spec-Driven Development         | ✅ PASS | Spec exists with full requirements          |
| II. Security-First Design          | ✅ PASS | User isolation enforced at tool level       |
| III. Deterministic Reproducibility | ✅ PASS | Stateless tools, DB-backed state            |
| IV. Separation of Concerns         | ✅ PASS | MCP layer separate from API and AI layers   |
| V. Hackathon Reviewability         | ✅ PASS | Full spec/plan traceability                 |
| VI. Agentic Workflow               | ✅ PASS | No manual code, spec-driven                 |
| VII. AI & Agent Standards          | ✅ PASS | Tools for agents, no direct DB access by AI |
| VIII. MCP Standards                | ✅ PASS | Official MCP SDK, stateless, user-isolated  |
| IX. Conversation & Statelessness   | ✅ PASS | No memory between calls                     |

**Gate Result**: ✅ ALL GATES PASSED

## Project Structure

### Documentation (this feature)

```text
specs/005-mcp-server-tooling/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (tool schemas)
└── checklists/          # Quality validation
    └── requirements.md
```

### Source Code (repository root)

```text
mcp-server/
├── src/
│   ├── __init__.py
│   ├── server.py           # MCP server entry point
│   ├── tools/              # MCP tool implementations
│   │   ├── __init__.py
│   │   ├── add_task.py
│   │   ├── list_tasks.py
│   │   ├── update_task.py
│   │   ├── complete_task.py
│   │   └── delete_task.py
│   ├── models/             # SQLModel definitions
│   │   ├── __init__.py
│   │   └── task.py
│   ├── db/                 # Database utilities
│   │   ├── __init__.py
│   │   └── connection.py
│   └── errors/             # Error handling
│       ├── __init__.py
│       └── codes.py
├── tests/
│   ├── __init__.py
│   ├── test_add_task.py
│   ├── test_list_tasks.py
│   ├── test_update_task.py
│   ├── test_complete_task.py
│   ├── test_delete_task.py
│   └── conftest.py
├── pyproject.toml
└── README.md
```

**Structure Decision**: New `mcp-server/` directory at repository root. Separate from existing `backend/` to maintain clear architectural boundaries per Constitution Principle IV (Separation of Concerns).

## Execution Phases

### Phase 1: MCP Server Foundation & Environment Setup

**Goals**: Establish a clean, stateless MCP server using the Official MCP SDK with database connectivity.

**Tasks**:

1. Create `mcp-server/` directory structure
2. Initialize `pyproject.toml` with dependencies (mcp, sqlmodel, asyncpg, pydantic)
3. Configure Python environment with uv package manager
4. Create `src/db/connection.py` for Neon PostgreSQL connection via `DATABASE_URL`
5. Create `src/server.py` as MCP server entry point
6. Verify MCP server boots successfully without tools registered

**Acceptance Checks**:

- [ ] MCP server starts without runtime errors
- [ ] Database connection established successfully
- [ ] No in-memory state initialized on startup

---

### Phase 2: Data Model Definition & Persistence Layer

**Goals**: Define deterministic, user-isolated task persistence.

**Tasks**:

1. Create `src/models/task.py` with SQLModel `Task` schema
2. Define fields: id, user_id (indexed), title, description, completed, created_at, updated_at
3. Implement database table creation/migration strategy
4. Create utility functions for scoped queries by `user_id`
5. Add automatic timestamp handling

**Acceptance Checks**:

- [ ] Tasks can be created, queried, updated, and deleted via ORM
- [ ] Cross-user access is impossible at query level
- [ ] Schema matches Spec-5 exactly

---

### Phase 3: MCP Tool Registration & Contracts

**Goals**: Expose task operations as first-class MCP tools with strict contracts.

**Tasks**:

1. Create tool registration framework in `src/server.py`
2. Register 5 MCP tools: add_task, list_tasks, update_task, complete_task, delete_task
3. Define explicit input schemas using Pydantic for each tool
4. Define deterministic output schemas
5. Ensure tools accept `user_id` explicitly
6. Implement tool discovery via MCP protocol

**Acceptance Checks**:

- [ ] All tools are discoverable by MCP clients
- [ ] Tool schemas match Spec-5 definitions
- [ ] Invalid inputs are rejected cleanly

---

### Phase 4: Tool Implementation (Task CRUD Logic)

**Goals**: Implement secure, deterministic task behavior.

**Tasks**:

1. Implement `add_task` tool: validate title, persist task, return metadata
2. Implement `list_tasks` tool: filter by user_id, support status filters
3. Implement `update_task` tool: validate ownership, update fields
4. Implement `complete_task` tool: validate ownership, mark completed
5. Implement `delete_task` tool: validate ownership, remove task

**Acceptance Checks**:

- [ ] All tool actions modify database correctly
- [ ] Ownership validation enforced on every call
- [ ] Identical inputs produce identical outputs

---

### Phase 5: Error Handling & Determinism Guarantees

**Goals**: Ensure tools fail safely and predictably.

**Tasks**:

1. Create `src/errors/codes.py` with error code constants
2. Implement structured error responses (code, message, details)
3. Handle: AUTH_REQUIRED, VALIDATION_ERROR, NOT_FOUND, INVALID_INPUT, SERVICE_UNAVAILABLE
4. Ensure errors do not leak internal state or stack traces
5. Add exception handling to prevent unhandled crashes

**Acceptance Checks**:

- [ ] Tool errors are machine-readable
- [ ] No stack traces exposed to agents
- [ ] Server remains stable after failures

---

### Phase 6: Statelessness & Security Validation

**Goals**: Guarantee MCP server remains stateless and secure.

**Tasks**:

1. Verify no global or in-memory state is stored
2. Ensure every tool call is independent
3. Validate all queries are filtered by user_id
4. Confirm no AI logic exists in MCP server
5. Add tests for cross-user access prevention

**Acceptance Checks**:

- [ ] Server can restart without losing context
- [ ] Tools do not rely on previous calls
- [ ] Security boundaries are enforced consistently

---

### Phase 7: Integration Readiness & Testing

**Goals**: Prepare MCP server for safe AI agent usage.

**Tasks**:

1. Create comprehensive unit tests for all 5 tools
2. Create integration tests with real database
3. Test tool compatibility with MCP protocol
4. Validate tool naming clarity and intent
5. Ensure tool responses are concise and agent-friendly
6. Create `README.md` with usage instructions

**Acceptance Checks**:

- [ ] All tests pass
- [ ] AI agent can reason over tool contracts without ambiguity
- [ ] MCP tools are side-effect controlled
- [ ] MCP server ready for AI Agent layer integration

## Decisions Requiring Documentation

| Decision                    | Chosen Option                                  | Rationale                                   |
| --------------------------- | ---------------------------------------------- | ------------------------------------------- |
| SQLModel migration strategy | Auto-create tables on startup                  | Simpler for MVP; no separate migration step |
| MCP SDK version             | Latest stable (`mcp>=1.0.0`)                   | Official SDK as per constitution            |
| Error response schema       | `{error: true, code: string, message: string}` | Machine-readable, agent-friendly            |
| Timestamp handling          | SQLModel `func.now()` with UTC                 | Database-managed, deterministic             |
| Project location            | Separate `mcp-server/` directory               | Clear separation from FastAPI backend       |

## Complexity Tracking

> No constitution violations to justify.

## Completion Criteria

Spec-5 is complete when:

- [ ] All 5 task operations are exposed exclusively via MCP tools
- [ ] MCP server is fully stateless
- [ ] User data isolation is guaranteed
- [ ] Tools behave deterministically
- [ ] All tests pass
- [ ] Server is ready for AI agent orchestration (Spec-6)

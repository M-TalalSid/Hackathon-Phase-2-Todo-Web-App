# Feature Specification: MCP Server & Deterministic Task Tooling

**Feature Branch**: `005-mcp-server-tooling`  
**Created**: 2026-02-05  
**Status**: Draft  
**Input**: User description: "MCP Server & Deterministic Task Tooling - Deterministic, stateless MCP server with secure task operations exposed as MCP tools"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - AI Agent Creates Task via MCP Tool (Priority: P1)

An AI agent operating on behalf of an authenticated user invokes the `add_task` MCP tool to create a new task. The tool validates the user_id, creates the task in the database, and returns a structured confirmation.

**Why this priority**: Core functionality - task creation is the foundation of all task management operations.

**Independent Test**: Invoke `add_task` with valid user_id and title; verify task is created in database with correct ownership.

**Acceptance Scenarios**:

1. **Given** a valid user_id and title, **When** `add_task` is invoked, **Then** a new task is created and task_id is returned with status "created"
2. **Given** a missing title, **When** `add_task` is invoked, **Then** an error is returned with code "VALIDATION_ERROR"
3. **Given** an empty user_id, **When** `add_task` is invoked, **Then** an error is returned with code "AUTH_REQUIRED"

---

### User Story 2 - AI Agent Lists User's Tasks (Priority: P1)

An AI agent retrieves all tasks belonging to the authenticated user by invoking the `list_tasks` MCP tool. Tasks are filtered by user_id and optionally by completion status.

**Why this priority**: Essential for AI agent context - agents need to see existing tasks before suggesting actions.

**Independent Test**: Invoke `list_tasks` with valid user_id; verify only that user's tasks are returned.

**Acceptance Scenarios**:

1. **Given** a valid user_id with existing tasks, **When** `list_tasks` is invoked with status "all", **Then** all user's tasks are returned
2. **Given** a valid user_id, **When** `list_tasks` is invoked with status "pending", **Then** only incomplete tasks are returned
3. **Given** a valid user_id, **When** `list_tasks` is invoked with status "completed", **Then** only completed tasks are returned
4. **Given** a user_id with no tasks, **When** `list_tasks` is invoked, **Then** an empty array is returned

---

### User Story 3 - AI Agent Completes Task (Priority: P1)

An AI agent marks a task as completed by invoking the `complete_task` MCP tool. The tool validates ownership and updates the task status.

**Why this priority**: Core functionality - completing tasks is a primary user goal.

**Independent Test**: Invoke `complete_task` with valid user_id and task_id; verify task is marked completed.

**Acceptance Scenarios**:

1. **Given** a valid user_id and task_id belonging to that user, **When** `complete_task` is invoked, **Then** task is marked completed and status "completed" is returned
2. **Given** a task_id belonging to a different user, **When** `complete_task` is invoked, **Then** an error is returned with code "NOT_FOUND" (no information leak)
3. **Given** a non-existent task_id, **When** `complete_task` is invoked, **Then** an error is returned with code "NOT_FOUND"

---

### User Story 4 - AI Agent Updates Task (Priority: P2)

An AI agent updates a task's title or description by invoking the `update_task` MCP tool. The tool validates ownership and applies the updates.

**Why this priority**: Secondary functionality - editing tasks is common but less critical than create/complete.

**Independent Test**: Invoke `update_task` with new title; verify task is updated in database.

**Acceptance Scenarios**:

1. **Given** a valid user_id, task_id, and new title, **When** `update_task` is invoked, **Then** task title is updated and status "updated" is returned
2. **Given** a valid user_id, task_id, and new description, **When** `update_task` is invoked, **Then** task description is updated
3. **Given** no changes provided (title and description both empty/null), **When** `update_task` is invoked, **Then** an error is returned with code "VALIDATION_ERROR"

---

### User Story 5 - AI Agent Deletes Task (Priority: P2)

An AI agent deletes a task by invoking the `delete_task` MCP tool. The tool validates ownership and removes the task permanently.

**Why this priority**: Secondary functionality - deletion is less common but must be supported.

**Independent Test**: Invoke `delete_task` with valid user_id and task_id; verify task is removed from database.

**Acceptance Scenarios**:

1. **Given** a valid user_id and task_id belonging to that user, **When** `delete_task` is invoked, **Then** task is deleted and status "deleted" is returned
2. **Given** a task_id belonging to a different user, **When** `delete_task` is invoked, **Then** an error is returned with code "NOT_FOUND"

---

### Edge Cases

- What happens when MCP server receives malformed JSON input? → Return structured error with code "INVALID_INPUT"
- What happens when database connection fails? → Return structured error with code "SERVICE_UNAVAILABLE"
- What happens when user_id format is invalid? → Return structured error with code "VALIDATION_ERROR"
- What happens when task_id is not an integer? → Return structured error with code "VALIDATION_ERROR"
- What happens when concurrent updates occur on same task? → Last write wins; no locking required for MVP

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST implement MCP server using Official MCP SDK
- **FR-002**: System MUST expose exactly 5 MCP tools: `add_task`, `list_tasks`, `update_task`, `complete_task`, `delete_task`
- **FR-003**: Each tool MUST validate user_id is present and non-empty before any operation
- **FR-004**: Each tool MUST enforce user ownership on all task operations (user can only access their own tasks)
- **FR-005**: All tools MUST return structured JSON responses with predictable schema
- **FR-006**: All tools MUST be stateless (no in-memory state between invocations)
- **FR-007**: Tools MUST NOT contain AI logic, heuristics, or intent inference
- **FR-008**: Each tool MUST perform exactly one operation (no side effects)
- **FR-009**: Database queries MUST be filtered by user_id at the query level
- **FR-010**: Error responses MUST include code, message, and optional details fields
- **FR-011**: Error responses MUST NOT leak internal state, stack traces, or other user's data
- **FR-012**: Task timestamps (created_at, updated_at) MUST be set automatically by the system

### Key Entities

- **Task**: Represents a todo item belonging to a specific user
  - id (integer, auto-generated)
  - user_id (string, indexed, required)
  - title (string, required, max 500 characters)
  - description (string, optional, max 2000 characters)
  - completed (boolean, default false)
  - created_at (timestamp, auto-set on creation)
  - updated_at (timestamp, auto-set on modification)

### Tool Schemas

#### add_task

- **Input**: `{ user_id: string, title: string, description?: string }`
- **Output**: `{ task_id: integer, status: "created", title: string }`
- **Errors**: `{ error: true, code: string, message: string }`

#### list_tasks

- **Input**: `{ user_id: string, status?: "all" | "pending" | "completed" }`
- **Output**: `{ tasks: [{ id, title, description, completed, created_at }] }`
- **Errors**: `{ error: true, code: string, message: string }`

#### update_task

- **Input**: `{ user_id: string, task_id: integer, title?: string, description?: string }`
- **Output**: `{ task_id: integer, status: "updated", title: string }`
- **Errors**: `{ error: true, code: string, message: string }`

#### complete_task

- **Input**: `{ user_id: string, task_id: integer }`
- **Output**: `{ task_id: integer, status: "completed", title: string }`
- **Errors**: `{ error: true, code: string, message: string }`

#### delete_task

- **Input**: `{ user_id: string, task_id: integer }`
- **Output**: `{ task_id: integer, status: "deleted", title: string }`
- **Errors**: `{ error: true, code: string, message: string }`

### Error Codes

| Code                | Meaning                                                           |
| ------------------- | ----------------------------------------------------------------- |
| AUTH_REQUIRED       | user_id is missing or empty                                       |
| VALIDATION_ERROR    | Input fails validation (missing required field, wrong type, etc.) |
| NOT_FOUND           | Task does not exist or user does not have access                  |
| INVALID_INPUT       | Malformed JSON or unrecognized parameters                         |
| SERVICE_UNAVAILABLE | Database or infrastructure failure                                |

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All 5 MCP tools are accessible and operational via MCP protocol
- **SC-002**: 100% of task operations are isolated to the requesting user (verified via automated tests)
- **SC-003**: MCP server maintains zero in-memory state between tool invocations
- **SC-004**: Identical inputs produce identical outputs (deterministic behavior)
- **SC-005**: All error responses follow the structured format with appropriate error codes
- **SC-006**: No task data is accessible without providing a valid user_id
- **SC-007**: Cross-user access attempts return NOT_FOUND (no information leak about other users' tasks)
- **SC-008**: Database operations complete successfully with proper timestamps

## Assumptions

- User authentication and JWT validation occurs at the API layer before MCP tool invocation
- The user_id passed to MCP tools is already validated and trusted (extracted from JWT by calling layer)
- MCP server runs as a subprocess or service that the AI Agent layer communicates with
- PostgreSQL database is available and connection string is provided via environment variable
- SQLModel is used for database operations (consistent with existing backend)

## Out of Scope

- AI intent detection or natural language parsing
- Chat endpoints or conversational interface
- Frontend UI components
- Background jobs or schedulers
- User authentication (handled by API layer)
- Rate limiting (handled by API layer)
- Caching layer

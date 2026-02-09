# Feature Specification: REST API & Authorization Logic

**Feature Branch**: `003-rest-api-authorization`  
**Created**: 2026-01-14  
**Status**: Draft  
**Input**: User description: "REST API & Authorization Logic for Multi-User Todo Application"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - List User Tasks (Priority: P1) 🎯 MVP

An authenticated user retrieves their complete list of tasks. The system validates that the user ID in the URL matches the authenticated identity from the JWT, ensuring users can only access their own data.

**Why this priority**: Listing tasks is the foundational read operation. Without it, users cannot see their existing work. This is the most common API call in any todo application.

**Independent Test**: Can be tested by sending a GET request with valid JWT → returns task list for that user only

**Acceptance Scenarios**:

1. **Given** an authenticated user with valid JWT, **When** they request GET /api/{user_id}/tasks where user_id matches JWT identity, **Then** system returns 200 OK with JSON array of their tasks
2. **Given** an authenticated user, **When** they request tasks with user_id that doesn't match their JWT identity, **Then** system returns 403 Forbidden
3. **Given** a request without Authorization header, **When** accessing /api/{user_id}/tasks, **Then** system returns 401 Unauthorized
4. **Given** an authenticated user with no tasks, **When** they request their task list, **Then** system returns 200 OK with empty array

---

### User Story 2 - Create New Task (Priority: P1) 🎯 MVP

An authenticated user creates a new task. The system validates the JWT, confirms user_id in path matches the authenticated identity, and creates the task with proper ownership.

**Why this priority**: Creating tasks is essential for the todo application to have any utility. Combined with listing, this forms the minimal viable product.

**Independent Test**: POST request with valid body and JWT → returns 201 with created task containing generated ID

**Acceptance Scenarios**:

1. **Given** an authenticated user with valid JWT, **When** they POST to /api/{user_id}/tasks with valid task data (title required), **Then** system returns 201 Created with the new task object including generated ID and timestamps
2. **Given** an authenticated user, **When** they POST with user_id not matching JWT identity, **Then** system returns 403 Forbidden
3. **Given** a valid request but empty or missing title, **When** creating a task, **Then** system returns 400 Bad Request with validation error
4. **Given** a request without Authorization header, **When** creating a task, **Then** system returns 401 Unauthorized

---

### User Story 3 - Get Single Task (Priority: P2)

An authenticated user retrieves a specific task by ID. The system verifies both authentication and ownership (task belongs to the requesting user).

**Why this priority**: Accessing individual tasks enables detail views and editing workflows. Important but secondary to list/create.

**Independent Test**: GET request for specific task ID → returns task if owned by user, 404 if not found or not owned

**Acceptance Scenarios**:

1. **Given** an authenticated user who owns task with ID X, **When** they GET /api/{user_id}/tasks/X, **Then** system returns 200 OK with task details
2. **Given** an authenticated user who doesn't own task X, **When** they GET /api/{user_id}/tasks/X, **Then** system returns 404 Not Found (to prevent information leakage)
3. **Given** a request for non-existent task ID, **When** making GET request, **Then** system returns 404 Not Found
4. **Given** user_id in path doesn't match JWT identity, **When** getting a task, **Then** system returns 403 Forbidden

---

### User Story 4 - Update Task (Priority: P2)

An authenticated user updates an existing task they own. The system validates ownership and applies partial or full updates.

**Why this priority**: Editing tasks is core functionality but depends on task existence (list/create).

**Independent Test**: PUT request with updated fields → returns updated task object

**Acceptance Scenarios**:

1. **Given** an authenticated user who owns task X, **When** they PUT to /api/{user_id}/tasks/X with valid updates, **Then** system returns 200 OK with updated task
2. **Given** an update attempt on task not owned by user, **When** making PUT request, **Then** system returns 404 Not Found
3. **Given** an update with invalid data (e.g., empty title), **When** making PUT request, **Then** system returns 400 Bad Request
4. **Given** user_id in path doesn't match JWT identity, **When** updating a task, **Then** system returns 403 Forbidden

---

### User Story 5 - Delete Task (Priority: P2)

An authenticated user permanently removes a task they own.

**Why this priority**: Deletion is necessary for task management but less frequent than read/update operations.

**Independent Test**: DELETE request → returns 204 No Content, subsequent GET returns 404

**Acceptance Scenarios**:

1. **Given** an authenticated user who owns task X, **When** they DELETE /api/{user_id}/tasks/X, **Then** system returns 204 No Content
2. **Given** a delete attempt on task not owned by user, **When** making DELETE request, **Then** system returns 404 Not Found
3. **Given** a delete attempt on non-existent task, **When** making DELETE request, **Then** system returns 404 Not Found
4. **Given** user_id in path doesn't match JWT identity, **When** deleting a task, **Then** system returns 403 Forbidden

---

### User Story 6 - Mark Task Complete/Incomplete (Priority: P3)

An authenticated user toggles the completion status of a task using a dedicated endpoint for this common action.

**Why this priority**: Convenience endpoint that simplifies the most common update operation. Can alternatively use PUT, so lower priority.

**Independent Test**: PATCH request → returns updated task with toggled completed status

**Acceptance Scenarios**:

1. **Given** an authenticated user who owns incomplete task X, **When** they PATCH /api/{user_id}/tasks/X/complete, **Then** system returns 200 OK with task.completed = true
2. **Given** an authenticated user who owns completed task X, **When** they PATCH /api/{user_id}/tasks/X/complete, **Then** system returns 200 OK with task.completed = false (toggle behavior)
3. **Given** user_id in path doesn't match JWT identity, **When** completing a task, **Then** system returns 403 Forbidden
4. **Given** task not owned by user, **When** attempting to complete, **Then** system returns 404 Not Found

---

### Edge Cases

- What happens when user_id in URL is valid format but doesn't match JWT? → 403 Forbidden
- What happens when Authorization header is malformed (e.g., "Basic" instead of "Bearer")? → 401 Unauthorized
- What happens when JWT is expired? → 401 Unauthorized with appropriate error code
- What happens when task_id is not a valid UUID format? → 400 Bad Request
- What happens when request body is not valid JSON? → 400 Bad Request
- What happens when concurrent updates occur to same task? → Last write wins (no explicit locking for MVP)

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST require valid JWT Bearer token in Authorization header for all /api/\* endpoints
- **FR-002**: System MUST extract authenticated user identity exclusively from JWT `sub` claim
- **FR-003**: System MUST validate that user_id in URL path matches authenticated user identity from JWT
- **FR-004**: System MUST return 403 Forbidden when user_id in path doesn't match JWT identity
- **FR-005**: System MUST return 401 Unauthorized when Authorization header is missing or invalid
- **FR-006**: System MUST implement GET /api/{user_id}/tasks to list all tasks owned by user
- **FR-007**: System MUST implement POST /api/{user_id}/tasks to create new task with ownership
- **FR-008**: System MUST implement GET /api/{user_id}/tasks/{id} to retrieve single task
- **FR-009**: System MUST implement PUT /api/{user_id}/tasks/{id} to update task
- **FR-010**: System MUST implement DELETE /api/{user_id}/tasks/{id} to remove task
- **FR-011**: System MUST implement PATCH /api/{user_id}/tasks/{id}/complete to toggle completion
- **FR-012**: System MUST return 404 Not Found for tasks not owned by requesting user (prevents enumeration)
- **FR-013**: System MUST validate request body for required fields (title on create/update)
- **FR-014**: System MUST return 400 Bad Request for validation failures with error details
- **FR-015**: System MUST return 201 Created for successful POST with created resource in body
- **FR-016**: System MUST return 204 No Content for successful DELETE
- **FR-017**: System MUST return all errors as standardized JSON with code, message, and optional details

### Key Entities

- **Task**: User-owned todo item with id, title, description, completed status, timestamps
- **AuthenticatedUser**: Identity derived from JWT containing user id (from `sub` claim)
- **ErrorResponse**: Standardized error format with code (string), message (string), details (optional object)

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All 6 API endpoints respond correctly to valid and invalid requests
- **SC-002**: 100% of requests with mismatched user_id return 403 Forbidden
- **SC-003**: 100% of requests without valid JWT return 401 Unauthorized
- **SC-004**: Users cannot access, modify, or delete tasks belonging to other users
- **SC-005**: Successful task creation returns within 500ms under normal load
- **SC-006**: All error responses conform to standardized JSON structure
- **SC-007**: No internal error details or stack traces are exposed in responses
- **SC-008**: API endpoints pass automated integration tests covering all acceptance scenarios

## Assumptions

- JWT authentication infrastructure is already implemented (Spec-2: JWT Auth Security)
- Task data model and repository layer are already implemented (Spec-1: Backend Data Layer)
- User identity is represented solely by the `sub` claim in the JWT
- No rate limiting or throttling is required for MVP
- No pagination is required for task lists in MVP (assumes reasonable task counts per user)
- Toggle completion (PATCH) behavior toggles current state rather than setting explicit value

## Out of Scope

- User registration and authentication flows (handled by Spec-2)
- Database schema and migrations (handled by Spec-1)
- Frontend UI or API client implementation
- Rate limiting, throttling, or abuse prevention
- API documentation UI (Swagger/OpenAPI auto-generation acceptable)
- Batch operations (bulk create/update/delete)
- Task filtering, sorting, or pagination
- Real-time updates or WebSocket notifications

# Research: REST API & Authorization Logic

**Feature**: 003-rest-api-authorization  
**Date**: 2026-01-14  
**Status**: Complete

## Research Summary

This document captures design decisions and research findings for the REST API implementation.

---

## Decision 1: API Path Structure

### Question

Should endpoints use `/api/{user_id}/tasks` (scoped by user_id in path) or `/api/tasks` (user derived from JWT only)?

### Decision

Use **`/api/{user_id}/tasks`** path structure with JWT validation.

### Rationale

- **Spec Requirement**: FR-003 explicitly requires "user_id in URL path matches authenticated user identity from JWT"
- **Defense in Depth**: Path parameter provides explicit scoping, JWT provides authentication
- **Clarity**: Makes ownership explicit in URL, improving debuggability and API understanding
- **Compliance**: Aligns with constitution's "Authorization Requirements" section

### Alternatives Considered

| Alternative                  | Pros                 | Cons                                              |
| ---------------------------- | -------------------- | ------------------------------------------------- |
| `/api/tasks` (JWT only)      | Simpler URLs         | No explicit scoping, relies solely on JWT parsing |
| `/api/users/{user_id}/tasks` | More RESTful nesting | Longer paths, same validation needed              |

---

## Decision 2: Authorization Check Placement

### Question

Should authorization checks (user_id vs JWT match) be in router layer or service layer?

### Decision

Implement authorization as **FastAPI dependency at router layer**.

### Rationale

- **Fail Fast**: Invalid requests rejected before hitting business logic
- **Single Responsibility**: Router handles auth, service handles business logic
- **Reusability**: Same dependency can protect all user-scoped endpoints
- **Constitution Compliance**: "Every API request to protected resources MUST include valid Authorization"

### Implementation

Create `verify_user_access` dependency that:

1. Extracts user from JWT (via existing `get_current_user`)
2. Compares with path parameter `user_id`
3. Raises 403 Forbidden if mismatch
4. Returns `AuthenticatedUser` if valid

---

## Decision 3: Error Response Structure

### Question

What should the standardized error response format be?

### Decision

Use consistent JSON structure:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Title is required",
  "details": {
    "field": "title",
    "constraint": "non-empty string"
  }
}
```

### Rationale

- **FR-017**: "System MUST return all errors as standardized JSON with code, message, and optional details"
- **Constitution**: "Standardized JSON error responses with code, message, and details fields"
- **Consistency**: Same format for 400, 401, 403, 404, 500 errors

### Error Codes

| HTTP Status | Code               | Usage                              |
| ----------- | ------------------ | ---------------------------------- |
| 400         | `VALIDATION_ERROR` | Invalid request body or parameters |
| 400         | `INVALID_UUID`     | Malformed UUID in path             |
| 401         | `UNAUTHORIZED`     | Missing or invalid JWT             |
| 401         | `TOKEN_EXPIRED`    | JWT expired                        |
| 403         | `FORBIDDEN`        | User ID mismatch                   |
| 404         | `NOT_FOUND`        | Task doesn't exist or not owned    |
| 500         | `INTERNAL_ERROR`   | Unexpected server error            |

---

## Decision 4: HTTP Status Code Mapping

### Question

How to handle task ownership violations - 403 or 404?

### Decision

- **Path user_id mismatch**: Return **403 Forbidden**
- **Task not owned by user**: Return **404 Not Found**

### Rationale

- **FR-004**: "System MUST return 403 Forbidden when user_id in path doesn't match JWT identity"
- **FR-012**: "System MUST return 404 Not Found for tasks not owned by requesting user (prevents enumeration)"
- **Security**: 404 for task ownership prevents attackers from enumerating which task IDs exist

---

## Decision 5: Toggle vs Set Completion

### Question

Should PATCH /complete toggle the status or set it explicitly?

### Decision

Use **toggle behavior** (flip current state).

### Rationale

- **Spec Assumption**: "Toggle completion (PATCH) behavior toggles current state rather than setting explicit value"
- **Simplicity**: Single endpoint, no request body needed
- **User Story 6**: Explicitly states "toggles the completion status"

### Alternative

Could accept `{ "completed": true/false }` body for explicit setting. This would be more RESTful but spec prefers toggle.

---

## Decision 6: Request/Response Model Strategy

### Question

Reuse existing models or create API-specific schemas?

### Decision

Create **API-specific request/response models** in `app/api/schemas.py`:

- `TaskCreateRequest`: For POST body (title required, description optional)
- `TaskUpdateRequest`: For PUT body (all fields optional)
- `TaskResponse`: Standardized output format
- `ErrorResponse`: Standard error format

### Rationale

- **Separation of Concerns**: API layer should not expose internal domain models directly
- **Validation**: Pydantic models provide request validation
- **Flexibility**: Can evolve API without changing internal models

---

## Decision 7: Router Organization

### Question

Put all endpoints in main.py or use separate router?

### Decision

Create **dedicated API router** in `app/api/tasks.py`.

### Rationale

- **Constitution**: "Separation of Concerns" principle
- **Maintainability**: Keeps main.py clean for app configuration
- **Scalability**: Easy to add more routers for future features
- **Testing**: Easier to test routes in isolation

### Structure

```
app/
├── api/
│   ├── __init__.py
│   ├── dependencies.py   # verify_user_access, error handlers
│   ├── schemas.py        # Request/Response models
│   └── tasks.py          # Task endpoints router
└── main.py               # Includes router
```

---

## Technical Stack Confirmation

| Component  | Technology      | Confirmed By            |
| ---------- | --------------- | ----------------------- |
| Framework  | FastAPI         | Constitution            |
| ORM        | SQLModel        | Constitution            |
| Auth       | JWT via PyJWT   | Spec-2 implementation   |
| Database   | Neon PostgreSQL | Existing setup          |
| Validation | Pydantic        | FastAPI native          |
| Logging    | structlog       | Existing implementation |

---

## Dependencies on Prior Work

| Dependency          | Source                     | Status         |
| ------------------- | -------------------------- | -------------- |
| Task model          | Spec-1: Backend Data Layer | ✅ Implemented |
| TaskRepository      | Spec-1: Backend Data Layer | ✅ Implemented |
| get_current_user    | Spec-2: JWT Auth Security  | ✅ Implemented |
| verify_token        | Spec-2: JWT Auth Security  | ✅ Implemented |
| Database connection | Spec-1: Backend Data Layer | ✅ Implemented |

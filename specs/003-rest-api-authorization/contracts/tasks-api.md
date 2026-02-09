# API Contract: Tasks API

**Feature**: 003-rest-api-authorization  
**Version**: 1.0.0  
**Base Path**: `/api/{user_id}/tasks`

## Authentication

All endpoints require JWT Bearer token:

```
Authorization: Bearer <jwt_token>
```

JWT must contain `sub` claim matching `user_id` path parameter.

---

## Endpoints

### GET /api/{user_id}/tasks

List all tasks for the authenticated user.

**Path Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| user_id | string | Yes | User identifier (must match JWT sub) |

**Response 200 OK**:

```json
[
  {
    "id": "uuid",
    "user_id": "string",
    "title": "string",
    "description": "string | null",
    "completed": false,
    "created_at": "2026-01-14T12:00:00Z",
    "updated_at": "2026-01-14T12:00:00Z"
  }
]
```

**Errors**:

- 401 Unauthorized: Missing or invalid JWT
- 403 Forbidden: user_id doesn't match JWT identity

---

### POST /api/{user_id}/tasks

Create a new task.

**Path Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| user_id | string | Yes | User identifier (must match JWT sub) |

**Request Body**:

```json
{
  "title": "string", // Required, non-empty
  "description": "string" // Optional
}
```

**Response 201 Created**:

```json
{
  "id": "uuid",
  "user_id": "string",
  "title": "string",
  "description": "string | null",
  "completed": false,
  "created_at": "2026-01-14T12:00:00Z",
  "updated_at": "2026-01-14T12:00:00Z"
}
```

**Errors**:

- 400 Bad Request: Invalid body or missing title
- 401 Unauthorized: Missing or invalid JWT
- 403 Forbidden: user_id doesn't match JWT identity

---

### GET /api/{user_id}/tasks/{task_id}

Retrieve a single task.

**Path Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| user_id | string | Yes | User identifier (must match JWT sub) |
| task_id | UUID | Yes | Task identifier |

**Response 200 OK**:

```json
{
  "id": "uuid",
  "user_id": "string",
  "title": "string",
  "description": "string | null",
  "completed": false,
  "created_at": "2026-01-14T12:00:00Z",
  "updated_at": "2026-01-14T12:00:00Z"
}
```

**Errors**:

- 400 Bad Request: Invalid UUID format
- 401 Unauthorized: Missing or invalid JWT
- 403 Forbidden: user_id doesn't match JWT identity
- 404 Not Found: Task doesn't exist or not owned by user

---

### PUT /api/{user_id}/tasks/{task_id}

Update an existing task.

**Path Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| user_id | string | Yes | User identifier (must match JWT sub) |
| task_id | UUID | Yes | Task identifier |

**Request Body**:

```json
{
  "title": "string", // Optional (if provided, must be non-empty)
  "description": "string", // Optional
  "completed": true // Optional
}
```

**Response 200 OK**:

```json
{
  "id": "uuid",
  "user_id": "string",
  "title": "string",
  "description": "string | null",
  "completed": true,
  "created_at": "2026-01-14T12:00:00Z",
  "updated_at": "2026-01-14T12:30:00Z"
}
```

**Errors**:

- 400 Bad Request: Invalid body or empty title
- 401 Unauthorized: Missing or invalid JWT
- 403 Forbidden: user_id doesn't match JWT identity
- 404 Not Found: Task doesn't exist or not owned by user

---

### DELETE /api/{user_id}/tasks/{task_id}

Delete a task.

**Path Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| user_id | string | Yes | User identifier (must match JWT sub) |
| task_id | UUID | Yes | Task identifier |

**Response 204 No Content**: (empty body)

**Errors**:

- 400 Bad Request: Invalid UUID format
- 401 Unauthorized: Missing or invalid JWT
- 403 Forbidden: user_id doesn't match JWT identity
- 404 Not Found: Task doesn't exist or not owned by user

---

### PATCH /api/{user_id}/tasks/{task_id}/complete

Toggle task completion status.

**Path Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| user_id | string | Yes | User identifier (must match JWT sub) |
| task_id | UUID | Yes | Task identifier |

**Request Body**: None

**Response 200 OK**:

```json
{
  "id": "uuid",
  "user_id": "string",
  "title": "string",
  "description": "string | null",
  "completed": true, // Toggled value
  "created_at": "2026-01-14T12:00:00Z",
  "updated_at": "2026-01-14T12:30:00Z"
}
```

**Errors**:

- 400 Bad Request: Invalid UUID format
- 401 Unauthorized: Missing or invalid JWT
- 403 Forbidden: user_id doesn't match JWT identity
- 404 Not Found: Task doesn't exist or not owned by user

---

## Error Response Format

All error responses use this structure:

```json
{
  "code": "ERROR_CODE",
  "message": "Human readable description",
  "details": {
    // Optional additional context
  }
}
```

### Error Codes

| Code             | HTTP Status | Description                      |
| ---------------- | ----------- | -------------------------------- |
| VALIDATION_ERROR | 400         | Request body validation failed   |
| INVALID_UUID     | 400         | Path parameter is not valid UUID |
| UNAUTHORIZED     | 401         | Missing Authorization header     |
| TOKEN_EXPIRED    | 401         | JWT has expired                  |
| INVALID_TOKEN    | 401         | JWT signature invalid            |
| FORBIDDEN        | 403         | User ID mismatch with JWT        |
| NOT_FOUND        | 404         | Resource not found               |
| INTERNAL_ERROR   | 500         | Unexpected server error          |

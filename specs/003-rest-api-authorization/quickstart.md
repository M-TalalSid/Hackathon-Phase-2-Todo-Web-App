# Quickstart: REST API & Authorization Logic

**Feature**: 003-rest-api-authorization  
**Date**: 2026-01-14

## Prerequisites

1. **Backend Running**: `cd backend && uvicorn app.main:app --reload`
2. **Database Connected**: `curl http://localhost:8000/health/db` shows `connected: true`
3. **JWT Secret Set**: `BETTER_AUTH_SECRET` in `.env`

## Quick Test Flow

### 1. Get a Valid JWT Token

Generate a test token (for development only):

```python
import jwt
import time

secret = "your_better_auth_secret"  # Same as BETTER_AUTH_SECRET
user_id = "test-user-123"

token = jwt.encode({
    "sub": user_id,
    "exp": int(time.time()) + 3600  # 1 hour
}, secret, algorithm="HS256")

print(f"Bearer {token}")
```

### 2. Test Endpoints

**List Tasks (empty initially)**:

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/test-user-123/tasks
# Expected: 200 OK, []
```

**Create Task**:

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "My first task", "description": "Testing the API"}' \
  http://localhost:8000/api/test-user-123/tasks
# Expected: 201 Created, {id, title, ...}
```

**Get Single Task**:

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/test-user-123/tasks/{task_id}
# Expected: 200 OK, {task details}
```

**Update Task**:

```bash
curl -X PUT \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated title"}' \
  http://localhost:8000/api/test-user-123/tasks/{task_id}
# Expected: 200 OK, {updated task}
```

**Toggle Complete**:

```bash
curl -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/test-user-123/tasks/{task_id}/complete
# Expected: 200 OK, {completed: true}
```

**Delete Task**:

```bash
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/test-user-123/tasks/{task_id}
# Expected: 204 No Content
```

### 3. Test Authorization

**Wrong User ID (403)**:

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/different-user/tasks
# Expected: 403 Forbidden, {"code": "FORBIDDEN", ...}
```

**No Token (401)**:

```bash
curl http://localhost:8000/api/test-user-123/tasks
# Expected: 401 Unauthorized, {"code": "UNAUTHORIZED", ...}
```

## Verification Checklist

- [ ] All 6 endpoints return expected status codes
- [ ] User ID mismatch returns 403
- [ ] Missing token returns 401
- [ ] Invalid token returns 401
- [ ] Task not owned returns 404
- [ ] Task created has correct user_id ownership
- [ ] Toggle completion flips the value
- [ ] Delete returns 204 and task is gone

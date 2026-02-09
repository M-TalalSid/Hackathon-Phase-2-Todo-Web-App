# Implementation Plan: Authentication & API Security

**Branch**: `002-jwt-auth-security` | **Date**: 2026-01-13 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-jwt-auth-security/spec.md`

## Summary

Implement stateless JWT-based authentication for the multi-user todo application. This includes Better Auth configuration on the Next.js frontend and JWT verification middleware on the FastAPI backend. The implementation ensures complete user isolation through token-derived identity.

**Key Deliverables**:

- Better Auth configuration with JWT plugin
- Frontend authenticated API client
- FastAPI JWT verification dependency
- AuthenticatedUser model and exceptions
- Health endpoints exemption from auth
- Comprehensive test coverage

---

## Technical Context

| Aspect             | Decision               | Reference           |
| ------------------ | ---------------------- | ------------------- |
| Backend Framework  | FastAPI (Python 3.11+) | Constitution        |
| Frontend Framework | Next.js 16+            | Constitution        |
| Auth Provider      | Better Auth            | Spec Constraints    |
| Token Format       | JWT (HS256)            | Research Decision 3 |
| Auth Pattern       | FastAPI Dependency     | Research Decision 2 |
| User ID Claim      | `sub`                  | Research Decision 3 |
| Token Expiry       | 1 hour                 | Research Decision 4 |

---

## Constitution Check

| Principle                          | Status  | Evidence                                                |
| ---------------------------------- | ------- | ------------------------------------------------------- |
| I. Spec-Driven Development         | ✅ PASS | All code derived from spec FR-001 through FR-015        |
| II. Security-First Design          | ✅ PASS | JWT verification, no session storage, secret management |
| III. Deterministic Reproducibility | ✅ PASS | Same token + secret = same result                       |
| IV. Separation of Concerns         | ✅ PASS | Auth layer separate from data layer                     |
| V. Hackathon Reviewability         | ✅ PASS | Clear auth flow, standard JWT patterns                  |
| VI. Agentic Workflow               | ✅ PASS | Executable via /sp.tasks + /sp.implement                |

---

## Project Structure

```
todo-web-app/
├── backend/
│   ├── app/
│   │   ├── auth/                    # NEW: Authentication module
│   │   │   ├── __init__.py
│   │   │   ├── config.py            # AuthSettings
│   │   │   ├── dependencies.py      # get_current_user
│   │   │   ├── exceptions.py        # Auth exceptions
│   │   │   ├── jwt_service.py       # JWT verification
│   │   │   └── models.py            # AuthenticatedUser
│   │   ├── config.py                # MODIFIED: Add BETTER_AUTH_SECRET
│   │   └── main.py                  # MODIFIED: Apply auth to routes
│   ├── tests/
│   │   ├── test_auth_config.py      # NEW
│   │   ├── test_auth_dependency.py  # NEW
│   │   ├── test_jwt_service.py      # NEW
│   │   └── conftest.py              # MODIFIED: Auth fixtures
│   └── requirements.txt             # MODIFIED: Add pyjwt
│
├── frontend/                        # NEW: Next.js frontend
│   ├── lib/
│   │   ├── auth.ts                  # Better Auth client
│   │   ├── auth.server.ts           # Better Auth server
│   │   └── api.ts                   # Authenticated fetch
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/[...all]/route.ts  # Better Auth routes
│   │   └── layout.tsx               # MODIFIED: Auth provider
│   ├── package.json                 # MODIFIED: better-auth
│   └── .env.local.example           # NEW: Frontend env template
│
└── specs/002-jwt-auth-security/
```

---

## Proposed Changes

### Component 1: Backend Auth Module

#### [NEW] `backend/app/auth/__init__.py`

Module init exporting auth components.

#### [NEW] `backend/app/auth/config.py`

```python
from pydantic_settings import BaseSettings

class AuthSettings(BaseSettings):
    better_auth_secret: str
    jwt_algorithm: str = "HS256"
    jwt_leeway_seconds: int = 60
```

#### [NEW] `backend/app/auth/models.py`

```python
from pydantic import BaseModel

class AuthenticatedUser(BaseModel):
    id: str  # From JWT 'sub' claim
```

#### [NEW] `backend/app/auth/exceptions.py`

Custom exceptions: `AuthenticationError`, `InvalidTokenError`, `ExpiredTokenError`, `MissingTokenError`.

#### [NEW] `backend/app/auth/jwt_service.py`

JWT verification using PyJWT with HS256 and clock skew tolerance.

#### [NEW] `backend/app/auth/dependencies.py`

`get_current_user` FastAPI dependency that extracts Bearer token, verifies, and returns `AuthenticatedUser`.

---

### Component 2: Backend Config Updates

#### [MODIFY] `backend/app/config.py`

Add `better_auth_secret` to Settings class.

#### [MODIFY] `backend/requirements.txt`

Add `pyjwt>=2.8.0`.

---

### Component 3: Backend Main Application

#### [MODIFY] `backend/app/main.py`

- Apply `get_current_user` dependency to protected routes
- Exempt health endpoints from auth
- Add authentication error handlers

---

### Component 4: Backend Tests

#### [NEW] `backend/tests/test_auth_config.py`

Test auth settings loading and validation.

#### [NEW] `backend/tests/test_jwt_service.py`

Test JWT verification: valid, expired, invalid signature, missing claims.

#### [NEW] `backend/tests/test_auth_dependency.py`

Test dependency: missing header, malformed header, invalid token, valid token.

---

### Component 5: Frontend Auth Setup

#### [NEW] `frontend/lib/auth.ts`

Better Auth client configuration with JWT plugin.

#### [NEW] `frontend/lib/auth.server.ts`

Better Auth server instance.

#### [NEW] `frontend/lib/api.ts`

Authenticated fetch wrapper that attaches JWT to requests.

#### [NEW] `frontend/app/api/auth/[...all]/route.ts`

Better Auth API routes handler.

---

### Component 6: Frontend Configuration

#### [NEW] `frontend/.env.local.example`

Template with `BETTER_AUTH_SECRET` and `NEXT_PUBLIC_API_URL`.

#### [MODIFY] `frontend/package.json`

Add `better-auth` dependency.

---

## Verification Plan

### Automated Tests

| Test            | Command                                | Expected |
| --------------- | -------------------------------------- | -------- |
| Auth config     | `pytest tests/test_auth_config.py`     | PASS     |
| JWT service     | `pytest tests/test_jwt_service.py`     | PASS     |
| Auth dependency | `pytest tests/test_auth_dependency.py` | PASS     |
| Integration     | `pytest tests/ -v`                     | All PASS |

### Manual Verification

| Step | Action                             | Expected Result               |
| ---- | ---------------------------------- | ----------------------------- |
| V1   | `curl /health`                     | 200 OK (no auth required)     |
| V2   | `curl /api/tasks`                  | 401 MISSING_TOKEN             |
| V3   | `curl -H "Authorization: invalid"` | 401 INVALID_TOKEN             |
| V4   | Sign in via frontend               | JWT issued                    |
| V5   | API request from frontend          | 200 with Authorization header |

---

## Implementation Order

| Phase                  | Tasks                                 | Depends On   |
| ---------------------- | ------------------------------------- | ------------ |
| 1. Backend Foundation  | Auth settings, exceptions, models     | -            |
| 2. JWT Service         | PyJWT integration, verification logic | Phase 1      |
| 3. Auth Dependency     | get_current_user, error handling      | Phase 2      |
| 4. Main Integration    | Apply auth to routes                  | Phase 3      |
| 5. Backend Tests       | All auth test files                   | Phase 4      |
| 6. Frontend Auth       | Better Auth config                    | - (parallel) |
| 7. Frontend API Client | Authenticated fetch                   | Phase 6      |
| 8. Integration Tests   | End-to-end auth flow                  | All          |

---

## Security Considerations

| Risk            | Mitigation                             |
| --------------- | -------------------------------------- |
| Secret exposure | Environment variable, never logged     |
| Token in logs   | Mask tokens in all log output          |
| Clock skew      | 60-second tolerance                    |
| Brute force     | Rate limiting (future spec)            |
| XSS token theft | httpOnly cookies (Better Auth default) |

---

## Notes

- No database changes required for this spec
- Frontend UI auth screens are out of scope
- Token refresh mechanism deferred (re-auth on expiry)
- CORS configuration should allow frontend origin
- Backend tests can run without database (mock JWT service)

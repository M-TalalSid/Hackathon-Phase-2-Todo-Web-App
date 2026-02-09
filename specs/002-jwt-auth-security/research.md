# Research: Authentication & API Security

**Branch**: `002-jwt-auth-security` | **Date**: 2026-01-13 | **Spec**: [spec.md](./spec.md)

## Purpose

Document technical decisions, research findings, and rationale for the authentication and API security implementation.

---

## Decision 1: JWT Library for FastAPI Backend

**Context**: Need to decode and verify JWT tokens in FastAPI. Multiple libraries available.

**Decision**: Use **PyJWT** library

**Rationale**:

- Industry standard Python JWT library
- Actively maintained with strong security track record
- Native support for HS256 (HMAC-SHA256) algorithm
- Built-in expiry validation with clock skew options
- Minimal dependencies
- Used by Better Auth ecosystem

**Alternatives Considered**:
| Library | Pros | Cons |
|---------|------|------|
| python-jose | More algorithms, JOSE support | Heavier, more complex |
| authlib | Full OAuth stack | Overkill for JWT-only verification |
| pyjwt | Simple, focused, secure | Only JWT (exactly what we need) |

---

## Decision 2: Authentication Implementation Pattern

**Context**: FastAPI offers multiple patterns for auth: middleware, dependencies, or decorators.

**Decision**: Use **FastAPI Dependency Injection**

**Rationale**:

- Native to FastAPI's design philosophy
- Can be applied per-route or globally via router
- Easy to test (dependencies can be overridden)
- Returns typed `AuthenticatedUser` object
- Cleaner than middleware for granular control
- Can exempt specific routes (health checks) naturally

**Implementation Pattern**:

```python
async def get_current_user(
    authorization: str = Header(None)
) -> AuthenticatedUser:
    # Verify JWT and return user
    ...

@app.get("/tasks")
async def list_tasks(user: AuthenticatedUser = Depends(get_current_user)):
    # user.id is guaranteed valid
    ...
```

**Alternatives Considered**:
| Pattern | Pros | Cons |
|---------|------|------|
| Middleware | Applies to all routes | Harder to exempt routes, less testable |
| Decorator | Explicit per-route | Not standard FastAPI pattern |
| Dependency | Native, testable, typed | Must apply to each route |

---

## Decision 3: User Identifier Claim

**Context**: JWT can contain various claims. Need to standardize which claim contains user ID.

**Decision**: Use **`sub` (subject) claim** as canonical user identifier

**Rationale**:

- Standard JWT claim per RFC 7519
- Better Auth uses `sub` by default
- Industry convention for "who this token represents"
- Avoids custom claim proliferation
- Compatible with JWT tooling and debugging

**JWT Payload Structure**:

```json
{
  "sub": "user_abc123",
  "iat": 1736741400,
  "exp": 1736745000,
  "iss": "better-auth"
}
```

---

## Decision 4: Token Expiry Strategy

**Context**: Need to balance security (short expiry) with UX (don't force frequent re-auth).

**Decision**: **1 hour expiry, no refresh tokens**

**Rationale**:

- 1 hour = reasonable session length for todo app
- No refresh tokens = simpler implementation
- User re-authenticates when expired (Better Auth handles this)
- Matches spec requirement (FR-005)
- Sufficient for hackathon scope

**Clock Skew Tolerance**: 60 seconds (handles minor server time differences)

---

## Decision 5: Error Response Format

**Context**: Auth failures need consistent error responses for frontend handling.

**Decision**: **Standardized 401 response with JSON body**

**Response Format**:

```json
{
  "detail": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

**Error Codes**:
| Code | Meaning |
|------|---------|
| `UNAUTHORIZED` | Missing or invalid token |
| `TOKEN_EXPIRED` | Token past expiry time |
| `INVALID_TOKEN` | Malformed or corrupt token |

**Security Note**: Never reveal WHY token is invalid in detail (prevents attack vectors). Use generic messages externally, log specifics internally.

---

## Decision 6: Frontend Token Transmission

**Context**: Frontend needs to send JWT with every request.

**Decision**: **Authorization: Bearer <token>** header

**Rationale**:

- Industry standard (RFC 6750)
- Supported by all HTTP clients
- Easy to implement in fetch/axios interceptors
- Works with Better Auth's default behavior
- CORS-friendly (simple header)

**Frontend Implementation Pattern**:

```javascript
// HTTP client interceptor
const apiClient = {
  async fetch(url, options = {}) {
    const session = await auth.getSession();
    if (session?.accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${session.accessToken}`,
      };
    }
    return fetch(url, options);
  },
};
```

---

## Decision 7: Trust Boundary Definition

**Context**: Need clear separation of responsibilities between frontend and backend.

**Decision**: **Zero trust in client-provided identity**

**Trust Boundary**:

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │   Better Auth   │───▶│  JWT Token (signed by secret)   │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
│                                      │                      │
└──────────────────────────────────────│──────────────── TRUSTED LINE
                                       ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │ Auth Dependency │───▶│  Verify signature + expiry      │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Authenticated User (from JWT sub claim ONLY)           │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Enforcement Rules**:

1. Backend NEVER trusts user_id from request body
2. Backend NEVER trusts user_id from URL path
3. Only JWT `sub` claim is authoritative
4. All data access uses JWT-derived user_id

---

## Decision 8: Logging Strategy

**Context**: Need to log auth events for debugging without exposing secrets.

**Decision**: **Structured logging with token masking**

**Log Events**:
| Event | Logged Data |
|-------|-------------|
| Auth Success | user_id, timestamp |
| Auth Failure | reason code, IP (optional), timestamp |
| Token Expired | user_id prefix, expiry delta |

**Never Logged**:

- Full JWT token
- BETTER_AUTH_SECRET
- Full user_id (only prefix for debugging)

---

## Summary

| Decision       | Choice                |
| -------------- | --------------------- |
| JWT Library    | PyJWT                 |
| Auth Pattern   | FastAPI Dependency    |
| User ID Claim  | `sub` (standard)      |
| Token Expiry   | 1 hour, no refresh    |
| Error Format   | JSON with code        |
| Token Header   | Authorization: Bearer |
| Trust Boundary | Zero trust, JWT only  |
| Logging        | Structured, masked    |

# Authentication Contracts

**Branch**: `002-jwt-auth-security` | **Date**: 2026-01-13 | **Spec**: [spec.md](../spec.md)

## Overview

This document defines the internal contracts for authentication in the backend. These are NOT external API contracts, but rather the interfaces and types used within the authentication layer.

---

## 1. AuthenticatedUser Model

The canonical representation of an authenticated user derived from JWT.

```python
from pydantic import BaseModel, Field


class AuthenticatedUser(BaseModel):
    """
    User identity derived from verified JWT.

    This is the ONLY source of truth for user identity.
    Never trust user_id from request body or URL.
    """
    id: str = Field(
        ...,
        description="User identifier from JWT 'sub' claim",
        min_length=1,
    )

    # Optional: Additional claims if needed
    # email: str | None = None
    # issued_at: datetime | None = None
```

---

## 2. Authentication Dependency Contract

```python
from fastapi import Depends, Header, HTTPException, status


async def get_current_user(
    authorization: str | None = Header(None, alias="Authorization")
) -> AuthenticatedUser:
    """
    FastAPI dependency that extracts and verifies JWT.

    Args:
        authorization: Authorization header value (expects "Bearer <token>")

    Returns:
        AuthenticatedUser: Verified user identity

    Raises:
        HTTPException(401): If token missing, invalid, or expired

    Usage:
        @app.get("/tasks")
        async def list_tasks(user: AuthenticatedUser = Depends(get_current_user)):
            # user.id is guaranteed valid
            tasks = await repo.list_by_user(user.id)
    """
    ...
```

---

## 3. JWT Verification Service Contract

```python
from typing import Protocol
from app.auth.models import AuthenticatedUser


class IJWTVerifier(Protocol):
    """Interface for JWT verification service."""

    def verify_token(self, token: str) -> AuthenticatedUser:
        """
        Verify JWT token and extract user identity.

        Args:
            token: Raw JWT string (without "Bearer " prefix)

        Returns:
            AuthenticatedUser with verified identity

        Raises:
            InvalidTokenError: Token malformed or corrupt
            ExpiredTokenError: Token past expiry time
            InvalidSignatureError: Token signature doesn't match secret
        """
        ...
```

---

## 4. Authentication Exceptions

```python
class AuthenticationError(Exception):
    """Base exception for authentication errors."""
    code: str = "UNAUTHORIZED"
    status_code: int = 401


class InvalidTokenError(AuthenticationError):
    """Token is malformed or corrupt."""
    code = "INVALID_TOKEN"


class ExpiredTokenError(AuthenticationError):
    """Token has expired."""
    code = "TOKEN_EXPIRED"


class InvalidSignatureError(AuthenticationError):
    """Token signature verification failed."""
    code = "INVALID_SIGNATURE"


class MissingTokenError(AuthenticationError):
    """No token provided in request."""
    code = "MISSING_TOKEN"
```

---

## 5. Error Response Contract

All authentication failures return HTTP 401 with this structure:

```json
{
  "detail": "string (human-readable message)",
  "code": "string (machine-readable error code)"
}
```

**Response Examples**:

```json
// Missing token
{
  "detail": "Authentication required",
  "code": "MISSING_TOKEN"
}

// Invalid token
{
  "detail": "Invalid authentication credentials",
  "code": "INVALID_TOKEN"
}

// Expired token
{
  "detail": "Authentication token has expired",
  "code": "TOKEN_EXPIRED"
}
```

---

## 6. Configuration Contract

```python
from pydantic_settings import BaseSettings


class AuthSettings(BaseSettings):
    """Authentication configuration from environment."""

    better_auth_secret: str = Field(
        ...,
        description="Shared secret for JWT signing/verification"
    )

    jwt_algorithm: str = Field(
        default="HS256",
        description="JWT signing algorithm"
    )

    jwt_leeway_seconds: int = Field(
        default=60,
        description="Clock skew tolerance in seconds"
    )

    class Config:
        env_prefix = ""
```

---

## 7. Frontend API Client Contract

```typescript
// TypeScript interface for frontend HTTP client

interface AuthenticatedFetch {
  /**
   * Make authenticated API request.
   * Automatically attaches JWT from Better Auth session.
   *
   * @param url - API endpoint URL
   * @param options - Fetch options
   * @returns Promise<Response>
   * @throws If user not authenticated (redirects to login)
   */
  fetch(url: string, options?: RequestInit): Promise<Response>;
}

// Usage:
// const response = await api.fetch('/api/tasks');
// Authorization header is automatically added
```

---

## 8. Health Check Endpoints (Exempt from Auth)

These endpoints MUST NOT require authentication:

| Endpoint         | Purpose               |
| ---------------- | --------------------- |
| `GET /health`    | Basic service health  |
| `GET /health/db` | Database connectivity |

All other endpoints require valid JWT.

---

## Contract Verification

| Contract            | Verified By              |
| ------------------- | ------------------------ |
| AuthenticatedUser   | test_auth_models.py      |
| get_current_user    | test_auth_dependency.py  |
| JWT Verification    | test_jwt_verification.py |
| Error Responses     | test_auth_errors.py      |
| Frontend Attachment | test_api_client.ts       |

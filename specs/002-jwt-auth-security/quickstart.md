# Quickstart: Authentication & API Security

**Branch**: `002-jwt-auth-security` | **Date**: 2026-01-13

## Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- Backend from 001-backend-data-layer implemented
- Neon PostgreSQL connection configured

## Environment Setup

### 1. Generate Shared Secret

```powershell
# Generate a secure random secret (32+ bytes recommended)
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the output - this will be your `BETTER_AUTH_SECRET`.

### 2. Configure Backend Environment

Add to `backend/.env`:

```env
# Existing settings
DATABASE_URL=postgres://...
LOG_LEVEL=INFO

# New: Authentication secret
BETTER_AUTH_SECRET=your_generated_secret_here
```

### 3. Configure Frontend Environment

Create or update `frontend/.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth Configuration
BETTER_AUTH_SECRET=your_generated_secret_here
BETTER_AUTH_URL=http://localhost:3000
```

---

## Project Structure

```
todo-web-app/
├── backend/
│   ├── app/
│   │   ├── auth/                 # NEW: Auth module
│   │   │   ├── __init__.py
│   │   │   ├── config.py         # Auth settings
│   │   │   ├── dependencies.py   # get_current_user
│   │   │   ├── exceptions.py     # Auth exceptions
│   │   │   ├── jwt_service.py    # JWT verification
│   │   │   └── models.py         # AuthenticatedUser
│   │   ├── config.py             # Updated: includes auth settings
│   │   └── main.py               # Updated: applies auth to routes
│   ├── tests/
│   │   └── test_auth.py          # Auth tests
│   └── requirements.txt          # Updated: PyJWT added
│
├── frontend/
│   ├── lib/
│   │   ├── auth.ts               # Better Auth config
│   │   └── api.ts                # Authenticated fetch
│   ├── app/
│   │   └── api/
│   │       └── auth/[...all]/route.ts  # Better Auth routes
│   └── .env.local
│
└── specs/002-jwt-auth-security/
```

---

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
pip install pyjwt
pip freeze > requirements.txt
```

### 2. Start Backend

```bash
uvicorn app.main:app --reload --port 8000
```

### 3. Verify Auth is Required

```bash
# Should return 401 Unauthorized
curl http://localhost:8000/api/tasks

# Expected response:
# {"detail":"Authentication required","code":"MISSING_TOKEN"}
```

---

## Frontend Setup

### 1. Install Better Auth

```bash
cd frontend
npm install better-auth
```

### 2. Start Frontend

```bash
npm run dev
```

### 3. Test Authentication Flow

1. Navigate to http://localhost:3000
2. Sign up or sign in
3. Check browser console for JWT token
4. Verify API requests include Authorization header

---

## Verification Steps

### V1: Health Endpoints (No Auth Required)

```bash
# Should succeed without token
curl http://localhost:8000/health
# Expected: {"status":"ok","version":"0.1.0","database":"connected"}
```

### V2: Protected Endpoint (Auth Required)

```bash
# Without token - should fail
curl http://localhost:8000/api/tasks
# Expected: 401 {"detail":"Authentication required","code":"MISSING_TOKEN"}

# With expired token - should fail
curl -H "Authorization: Bearer eyJ.EXPIRED.xyz" http://localhost:8000/api/tasks
# Expected: 401 {"detail":"Authentication token has expired","code":"TOKEN_EXPIRED"}
```

### V3: Valid Token (After Frontend Auth)

```bash
# Get token from browser after signing in
# DevTools > Application > Cookies or Network tab

curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/tasks
# Expected: 200 with user's tasks (or empty array)
```

### V4: Token Contains User ID

Decode your JWT at https://jwt.io (paste token, DON'T share secret):

```json
{
  "sub": "user_abc123", // User ID
  "iat": 1736741400, // Issued at
  "exp": 1736745000 // Expires at
}
```

### V5: Secret Mismatch Detection

```bash
# With different secret, token signature won't match
# Should return 401 INVALID_TOKEN
```

---

## Running Tests

```bash
cd backend
pytest tests/test_auth.py -v

# Expected output:
# test_missing_token_returns_401 PASSED
# test_invalid_token_returns_401 PASSED
# test_expired_token_returns_401 PASSED
# test_valid_token_extracts_user PASSED
# test_health_endpoints_no_auth PASSED
```

---

## Troubleshooting

### Token Always Rejected

1. Verify `BETTER_AUTH_SECRET` is identical in frontend and backend
2. Check token hasn't expired (decode at jwt.io)
3. Verify Authorization header format is `Bearer <token>` (with space)

### 500 Error on Auth

1. Check backend logs for stack trace
2. Verify PyJWT is installed: `pip show pyjwt`
3. Ensure secret is set in environment

### CORS Issues

Backend should allow frontend origin:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Frontend Not Attaching Token

1. Verify user is signed in: `await auth.getSession()`
2. Check if API client is using authenticated fetch
3. Verify token exists: `session.accessToken`

---

## Security Checklist

- [ ] `BETTER_AUTH_SECRET` is not committed to git
- [ ] Secret is at least 32 characters
- [ ] Secret is unique per environment
- [ ] Backend logs don't expose tokens
- [ ] All protected endpoints require auth
- [ ] Health endpoints are public (no auth)

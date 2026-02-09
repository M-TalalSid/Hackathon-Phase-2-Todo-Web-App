# Quickstart: Core Backend & Data Layer

**Feature**: `001-backend-data-layer`  
**Date**: 2026-01-13

## Prerequisites

- Python 3.11+
- Neon PostgreSQL account with database provisioned
- Git (for cloning repository)

## Environment Setup

### 1. Clone and Enter Repository

```bash
git clone <repository-url>
cd todo-web-app
git checkout 001-backend-data-layer
```

### 2. Create Virtual Environment

```bash
# Windows (PowerShell)
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# macOS/Linux
python -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r backend/requirements.txt
```

### 4. Configure Environment Variables

Create `.env` file in `backend/` directory:

```env
# Required: Neon PostgreSQL connection string
DATABASE_URL=postgres://user:password@host.neon.tech:5432/neondb?sslmode=require

# Optional: Logging level
LOG_LEVEL=INFO
```

> ⚠️ **Never commit `.env` to version control**. Add to `.gitignore`.

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry
│   ├── config.py            # Environment configuration
│   ├── database.py          # Database connection and session
│   ├── models/
│   │   ├── __init__.py
│   │   └── task.py          # Task SQLModel
│   ├── repositories/
│   │   ├── __init__.py
│   │   └── task_repository.py
│   └── exceptions.py        # Custom exceptions
├── alembic/
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│       └── 001_create_tasks_table.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_models.py
│   ├── test_repository.py
│   └── test_database.py
├── alembic.ini
├── requirements.txt
└── .env.example
```

## Running the Application

### 1. Initialize Database Schema

```bash
# Run Alembic migrations
cd backend
alembic upgrade head
```

This creates the `tasks` table with all required columns and indexes.

### 2. Verify Schema Creation

```bash
# Connect to Neon and verify
psql $DATABASE_URL -c "\d tasks"
```

Expected output:

```
                           Table "public.tasks"
   Column    |           Type           |         Default
-------------+--------------------------+-------------------------
 id          | uuid                     | gen_random_uuid()
 user_id     | character varying(255)   |
 title       | character varying(255)   |
 description | text                     |
 completed   | boolean                  | false
 created_at  | timestamp with time zone | now()
 updated_at  | timestamp with time zone | now()
```

### 3. Start Backend Service

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Expected output:

```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Database connection verified
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

## Verification Steps

### 1. Check Service Health

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{
  "status": "ok",
  "database": "connected",
  "version": "1.0.0"
}
```

### 2. Verify Database Connection

```bash
curl http://localhost:8000/health/db
```

Expected response:

```json
{
  "connected": true,
  "latency_ms": 42,
  "database": "neondb"
}
```

### 3. Run Tests

```bash
cd backend
pytest tests/ -v
```

Expected output:

```
tests/test_models.py::test_task_model_creation PASSED
tests/test_models.py::test_task_validation PASSED
tests/test_repository.py::test_create_task PASSED
tests/test_repository.py::test_get_task_by_id PASSED
tests/test_repository.py::test_ownership_enforcement PASSED
tests/test_database.py::test_connection PASSED
tests/test_database.py::test_schema_exists PASSED

=================== 7 passed in 2.34s ===================
```

## Common Issues

### Connection Refused

**Symptom**: `psycopg2.OperationalError: connection refused`

**Solution**:

1. Verify `DATABASE_URL` is correct
2. Check Neon dashboard for connection limits
3. Ensure SSL is enabled (`?sslmode=require`)

### Table Already Exists

**Symptom**: `alembic.util.exc.CommandError: Target database is not up to date`

**Solution**:

```bash
alembic stamp head  # Mark current state
alembic upgrade head  # Apply any pending migrations
```

### Missing Environment Variable

**Symptom**: `ValueError: DATABASE_URL environment variable is required`

**Solution**: Create `.env` file with required variables (see step 4 above)

## Next Steps

After verifying the data layer:

1. Run `/sp.tasks` to generate implementation tasks
2. Implement each task following the plan
3. Run tests after each implementation step
4. Proceed to API layer spec (separate feature)

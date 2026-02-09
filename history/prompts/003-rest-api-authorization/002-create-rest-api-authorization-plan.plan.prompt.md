---
id: 002
title: "Create REST API Authorization Plan"
stage: plan
date: 2026-01-14
surface: agent
model: gemini-2.5-pro
feature: 003-rest-api-authorization
branch: 003-rest-api-authorization
user: TALAL
command: /sp.plan
labels:
  - plan
  - rest-api
  - authorization
  - endpoints
  - implementation
links:
  spec: specs/003-rest-api-authorization/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-rest-api-authorization/plan.md
  - specs/003-rest-api-authorization/research.md
  - specs/003-rest-api-authorization/contracts/tasks-api.md
  - specs/003-rest-api-authorization/quickstart.md
tests: []
---

## Prompt

@[/sp.plan]

Create:

- REST API routing structure
- Endpoint-to-service mapping
- Authorization enforcement points
- Request and response schemas
- Error handling strategy

Decisions needing documentation:

- Validation strategy for user_id path parameter
- Placement of authorization checks (router vs service layer)
- Error response structure and consistency
- HTTP status code mapping for edge cases

Implementation steps:

1. Define API router structure and versioning
2. Implement dependency to inject authenticated user from JWT
3. Define request and response models using Pydantic/SQLModel
4. Implement GET /tasks endpoint filtered by authenticated user
5. Implement POST /tasks endpoint with ownership enforcement
6. Implement GET /tasks/{id} with ownership validation
7. Implement PUT /tasks/{id} with validation and update logic
8. Implement PATCH /tasks/{id}/complete toggle
9. Implement DELETE /tasks/{id} with ownership check
10. Enforce user_id path validation against JWT identity
11. Add consistent error handling and response formatting
12. Add structured logging for API operations

Testing strategy:

- Endpoint availability tests
- Auth-required tests (401 without token)
- Forbidden access tests (403 on user mismatch)
- Ownership enforcement tests (cross-user access blocked)
- CRUD correctness tests
- HTTP status code validation tests

## Response snapshot

Created comprehensive implementation plan with:

**Research Document (7 Decisions)**:

1. API Path Structure: `/api/{user_id}/tasks` with JWT validation
2. Authorization Placement: FastAPI dependency at router layer
3. Error Response Structure: JSON with code, message, details
4. HTTP Status Mapping: 403 for path mismatch, 404 for ownership
5. Toggle vs Set: Toggle behavior for PATCH /complete
6. Request/Response Models: API-specific Pydantic schemas
7. Router Organization: Dedicated `app/api/tasks.py` router

**API Contract (6 Endpoints)**:

- GET /api/{user_id}/tasks
- POST /api/{user_id}/tasks
- GET /api/{user_id}/tasks/{task_id}
- PUT /api/{user_id}/tasks/{task_id}
- DELETE /api/{user_id}/tasks/{task_id}
- PATCH /api/{user_id}/tasks/{task_id}/complete

**Implementation Plan (5 Phases, 15 Tasks)**:

- Phase 1: Setup (app/api/ structure)
- Phase 2: Endpoints (6 endpoints)
- Phase 3: Integration (main.py updates)
- Phase 4: Testing (test_api_tasks.py)
- Phase 5: Polish (logging, verification)

**Files to Create**:

- app/api/**init**.py
- app/api/schemas.py
- app/api/dependencies.py
- app/api/tasks.py
- tests/test_api_tasks.py

**Verification Plan**:

- Automated: pytest tests/test_api_tasks.py
- Manual: quickstart.md curl commands

## Outcome

- ✅ Impact: Complete implementation blueprint for REST API
- 📁 Files: plan.md, research.md, contracts/tasks-api.md, quickstart.md
- 🔁 Next prompts: /sp.tasks to generate actionable tasks
- 🧠 Reflection: Leverages existing auth (Spec-2) and data layer (Spec-1)

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results: Constitution check passed
- Prompt variant: Standard /sp.plan workflow
- Next experiment: Proceed to /sp.tasks for implementation tasks

---
id: 001
title: "Create Full-Stack Todo App Constitution"
stage: constitution
date: 2026-01-13
surface: agent
model: gemini-2.5-pro
feature: none
branch: main
user: TALAL
command: /sp.constitution
labels:
  - constitution
  - project-setup
  - spec-driven-development
  - security
  - agentic
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - null
---

## Prompt

@[/sp.constitution] Project: Full-Stack Multi-User Todo Web Application (Spec-Driven, Agentic Development)
Objective:
Transform a console-based todo application into a modern, secure, multi-user full-stack web application using Claude Code and Spec-Kit Plus with zero manual coding, emphasizing an agentic workflow for deterministic and repeatable reproducibility across environments.
Core principles:

Spec-driven development (all implementation must originate from approved specs and plans)
Security-first design (JWT-based authentication and strict user isolation)
Deterministic reproducibility (same specs produce same system)
Clear separation of concerns (frontend, backend, auth, data)
Hackathon reviewability (process is as important as output)
Agentic workflow (AI-generated code via tools like Claude Code, with no manual interventions)

Key standards:

All features must be derived from written specifications
No manual code edits; all code generated via Claude Code
REST API must be fully documented and consistent
Authentication must be stateless and JWT-based
Every task operation must enforce user ownership
Specs must be implementation-agnostic but precise, including edge cases and acceptance criteria
Plans must break specs into actionable, sequential tasks

Architecture standards:

Frontend: Next.js 16+ using App Router
Backend: Python FastAPI
ORM: SQLModel
Database: Neon Serverless PostgreSQL
Authentication: Better Auth (JWT enabled)
API communication: JSON over HTTPS with Authorization headers
Scalability: Stateless backend design for horizontal scaling; rate limiting on endpoints
Versioning: API endpoints versioned (e.g., /v1/tasks); specs and schemas versioned with changelogs

Security standards:

All API endpoints require valid JWT after authentication
JWT signature must be verified using shared secret
Requests without valid token return 401 Unauthorized
User ID in JWT must match resource access
No cross-user data access under any condition
Token expiry enforced (configurable, default 1 hour)
Protection against common vulnerabilities: XSS, SQL injection via built-in framework features and input validation
Audit logging for all authentication and data access attempts

Data integrity standards:

Persistent storage required (no in-memory state)
Tasks must be linked to a single authenticated user via user_id foreign key
Deletion and updates must validate ownership
Database schema must be explicit, versionable, and migrated via tools like Alembic
Indexing on user_id and task_id for performance

Testing standards:

Automated tests required for all components: Unit tests (Pytest for backend, Jest for frontend), integration tests, and security scans
Minimum 90% code coverage
End-to-end tests simulating multi-user scenarios
Tests may be generated and executed via agentic workflows

Development constraints:

No manual coding outside Claude Code
All changes must originate from spec or plan updates
Environment variables must be used for secrets (e.g., BETTER_AUTH_SECRET for JWT shared secret, DATABASE_URL for Neon connection)
CI/CD pipeline via GitHub Actions for automated builds and deployments
Dockerized application for reproducibility across environments

Quality constraints:

Code must be production-ready: Clear error handling with standardized JSON responses (code, message, details)
No unused endpoints or dead code
Consistent naming conventions (e.g., snake_case for Python, camelCase for JS)
Modular, maintainable structure with logging (e.g., structured logs via logging libraries)
Accessibility: Frontend follows WCAG 2.1 AA standards; responsive UI across devices
Performance: Optimize queries; implement caching where appropriate

Success criteria:

All 5 basic todo features implemented (create, read, update, delete, list tasks—all isolated per user)
Secure multi-user functionality verified through tests
Backend and frontend authenticate independently via JWT
All API endpoints enforce authorization correctly
Application runs end-to-end with persistent storage
Spec → Plan → Implementation traceability is clear and auditable
Deployment-ready: Runs in production-like environment with monitoring

## Response snapshot

Created comprehensive project constitution (v1.0.0) for Full-Stack Multi-User Todo Web Application with:

**6 Core Principles:**

1. Spec-Driven Development (NON-NEGOTIABLE) - All implementation from approved specs
2. Security-First Design (NON-NEGOTIABLE) - JWT auth, user isolation, audit logging
3. Deterministic Reproducibility - Same specs = same system, env vars, Docker
4. Separation of Concerns - Clear frontend/backend/auth/data boundaries
5. Hackathon Reviewability - PHRs, ADRs, full traceability
6. Agentic Workflow (NON-NEGOTIABLE) - Zero manual coding

**Additional Sections:**

- Architecture Standards (Next.js 16+, FastAPI, SQLModel, Neon PostgreSQL, Better Auth)
- Security Standards (JWT verification, token expiry, audit logging, vulnerability protection)
- Quality & Testing Standards (90% coverage, pytest/jest, WCAG 2.1 AA)
- Success Criteria (8 measurable outcomes)
- Governance (amendment process, compliance, review cadence)

Constitution written to `.specify/memory/constitution.md` with Sync Impact Report.

## Outcome

- ✅ Impact: Established foundational project governance with 6 core principles
- 🧪 Tests: N/A - constitution is documentation
- 📁 Files: `.specify/memory/constitution.md` created
- 🔁 Next prompts: `/sp.specify` to create feature specifications
- 🧠 Reflection: Comprehensive constitution captures all user requirements; ready for spec-driven development

## Evaluation notes (flywheel)

- Failure modes observed: None - successful constitution creation
- Graders run and results (PASS/FAIL): Template validation PASS, no unresolved placeholders
- Prompt variant (if applicable): Standard /sp.constitution workflow
- Next experiment (smallest change to try): Use constitution as reference for first feature spec

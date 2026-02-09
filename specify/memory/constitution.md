<!--
## Sync Impact Report

**Version change**: 2.0.0 → 3.0.0 (MAJOR: Adds Cloud-Native, Kubernetes, Helm, Docker, and AIOps principles)

**Added Sections**:
- X. Cloud-Native Standards (NEW principle - NON-NEGOTIABLE)
- XI. Containerization Standards (NEW principle)
- XII. Kubernetes Standards (NEW principle)
- XIII. Helm & Packaging Rules (NEW principle)
- XIV. AI-Assisted Operations (AIOps) Standards (NEW principle)
- Deployment Scope section (local Kubernetes only)
- Quality Constraints section for K8s deployments

**Modified Sections**:
- Project Objective - Updated for Phase-4 cloud-native focus
- Technology Stack Table - Added Docker, Minikube, Helm, kubectl-ai, kagent
- Success Criteria - Added K8s deployment, Helm, and AIOps criteria

**Removed Sections**:
- None (all existing principles retained)

**Templates Requiring Updates**:
- ⚠ plan-template.md - May need K8s/Helm sections
- ⚠ spec-template.md - May need container/deployment specs
- ⚠ tasks-template.md - May need infra task phases

**Follow-up TODOs**: None
-->

# AI-Augmented Multi-User Todo Platform Constitution

## Project Objective

Evolve a secure, multi-user todo web application into an AI-augmented, cloud-native system that supports both traditional UI-based task management and natural-language interaction via deterministic AI agents and MCP tools — deployed on local Kubernetes using spec-driven, agentic development workflows with AI-assisted operations.

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)

All implementation MUST originate from approved specifications and plans. This principle ensures deterministic and repeatable outputs across environments and sessions.

- Every feature MUST be derived from written specifications before any code is generated
- Specifications MUST be implementation-agnostic but precise, including edge cases and acceptance criteria
- Plans MUST break specs into actionable, sequential tasks with clear dependencies
- No code changes are permitted without corresponding spec or plan updates
- All changes MUST maintain Spec → Plan → Implementation traceability that is auditable
- No feature or infrastructure change without a spec
- Every spec must have a corresponding plan
- Plans must be broken into executable steps

### II. Security-First Design (NON-NEGOTIABLE)

Security is not an afterthought but a foundational requirement. All design decisions MUST prioritize security and user data isolation.

- JWT-based authentication across frontend, backend, and APIs
- Authorization enforced on every request
- User-level data isolation mandatory
- All API endpoints MUST require valid JWT after authentication; requests without valid token MUST return 401 Unauthorized
- User ID in JWT MUST match resource access; every task operation MUST enforce user ownership
- No cross-user data access under any condition; strict user isolation is mandatory
- No secrets hardcoded
- Kubernetes secrets and environment variables only
- Containers MUST NOT run as root unless explicitly justified
- Protection against common vulnerabilities (XSS, SQL injection) via built-in framework features and input validation

### III. Deterministic Reproducibility

The same specifications MUST produce the same system. This enables reliable rebuilding, testing, and validation across environments.

- Environment variables MUST be used for all secrets
- Database schema MUST be explicit, versionable, and migrated via tools like Alembic
- CI/CD pipeline via GitHub Actions for automated builds and deployments is required
- Dockerized application for reproducibility across environments is mandatory
- API endpoints MUST be versioned with specs and schemas versioned with changelogs
- AI agents MUST produce deterministic, reproducible behavior given the same inputs
- Docker images MUST be reproducible and minimal

### IV. Separation of Concerns (NON-NEGOTIABLE)

The system MUST be structured into clearly defined layers with strict boundaries.

**The 5-Layer Architecture Model:**

| Layer                      | Responsibility                            | Technology               |
| -------------------------- | ----------------------------------------- | ------------------------ |
| **Frontend UI Layer**      | Traditional dashboard and/or chat UI      | Next.js 16+ (App Router) |
| **API Layer**              | REST and/or chat endpoints                | FastAPI                  |
| **AI Agent Layer**         | Reasoning, intent detection, confirmation | Gemini API / AI SDK      |
| **MCP Tool Layer**         | Deterministic task operations             | Backend-integrated tools |
| **Data Persistence Layer** | Storage and retrieval                     | SQLModel + PostgreSQL    |

**Layer Rules:**

- Each layer MUST have a dedicated spec
- Layers MUST NOT bypass adjacent layers
- Clear separation of concerns: Frontend, Backend, AI Agent, Infrastructure
- Backend: Stateless design for horizontal scaling
- Database: Neon Serverless PostgreSQL with persistent storage

### V. Hackathon Reviewability

Process is as important as output. All work MUST be documented and traceable for review.

- Prompt History Records (PHRs) MUST be created for every significant AI interaction
- Architectural Decision Records (ADRs) MUST document significant design decisions
- All changes MUST be auditable with clear commit messages and PR descriptions
- Specification → Plan → Task → Code traceability MUST be maintained
- Documentation MUST explain not just what was done, but why decisions were made
- The entire project MUST be reviewable purely via Constitution, Specs, Plans, and Generated output

### VI. Agentic Workflow (NON-NEGOTIABLE)

All code MUST be generated via AI tools with zero manual coding interventions.

- All implementation MUST be AI-generated
- Manual edits to generated code or manifests are forbidden
- All deviations require spec or plan updates
- Agents MUST use MCP tools and CLI commands for all information gathering and task execution
- Human-as-Tool strategy: invoke users for clarification and decision-making
- All agent actions MUST be explainable via tool calls

### VII. AI & Agent Standards (NON-NEGOTIABLE)

AI agents MUST operate through declared tools with deterministic, explainable behavior.

- AI agents for reasoning and MCP tooling
- Agents MAY ONLY perform actions via declared tools
- All tool inputs and outputs MUST be explicitly defined
- Agents MUST confirm user-impacting actions in natural language before execution
- Agents MUST handle errors gracefully and transparently
- Agent reasoning MUST be stateless between requests
- No AI agent may access the database directly
- No hidden logic outside specs and plans

### VIII. MCP (Model Context Protocol) Standards (NON-NEGOTIABLE)

MCP tools are the ONLY layer allowed to mutate task data.

- All MCP tools MUST be stateless
- MCP tools are the ONLY layer allowed to mutate task data
- Each tool MUST:
  - Validate input
  - Enforce user ownership
  - Return structured, predictable responses
- MCP tools MUST NOT contain AI logic or heuristics
- All tool inputs and outputs MUST be explicitly defined in schemas

### IX. Conversation & Statelessness Standards

All chat interactions MUST be stateless with database-backed context reconstruction.

- All chat requests MUST be stateless
- Server MUST NOT retain memory between requests
- Conversation history MUST be persisted in the database and reconstructed per request
- AI context MUST be derived solely from stored messages, current user input, and declared tool definitions
- All state MUST be persisted in the database, not memory

### X. Cloud-Native Standards (NON-NEGOTIABLE)

The system MUST follow cloud-native best practices, even in local environments.

- Cloud-native best practices are mandatory
- Security-first and isolation-by-default
- All services MUST be designed for containerized deployment
- Infrastructure as Code principles apply
- Configuration MUST be externalized via environment variables or ConfigMaps

### XI. Containerization Standards

All services MUST be containerized using Docker with optimized, minimal images.

- All services MUST be containerized using Docker
- Docker images MUST be reproducible and minimal
- Multi-stage builds SHOULD be used to minimize image size
- Images MUST NOT contain development dependencies in production
- Docker AI Agent (Gordon) MUST be used for (when available):
  - Image optimization
  - Dockerfile generation
  - Container diagnostics

### XII. Kubernetes Standards (NON-NEGOTIABLE)

All workloads MUST be deployed as Kubernetes resources on Minikube.

**Deployment Scope:**

- Local Kubernetes deployment only (Minikube)
- No paid cloud providers
- No external managed Kubernetes services

**Kubernetes Rules:**

- Kubernetes distribution: Minikube
- All workloads deployed as Kubernetes resources
- No `docker run` in production paths
- Resource requests and limits required for all pods
- Liveness and readiness probes required
- All pods MUST reach Running or Ready state
- No CrashLoopBackOff permitted

### XIII. Helm & Packaging Rules

Helm charts are required for repeatable, configurable deployments.

- Helm charts required for: Frontend, Backend
- Values MUST be configurable
- No hardcoded environment values in charts
- Charts MUST support scaling via values.yaml
- Application MUST be deployable via a single Helm install

### XIV. AI-Assisted Operations (AIOps) Standards

AI tools MUST be used for cluster operations and diagnostics.

- kubectl-ai MUST be used for:
  - Deployment
  - Scaling
  - Debugging
- kagent MUST be used for:
  - Cluster health analysis
  - Resource optimization insights
- No manual Kubernetes YAML edits
- All cluster operations MUST be traceable via specs and plans

## Architecture Standards

### Technology Stack

| Layer          | Technology                  | Notes                                |
| -------------- | --------------------------- | ------------------------------------ |
| Frontend       | Next.js 16+ (App Router)    | Responsive UI, containerized         |
| Backend        | Python FastAPI              | Stateless, containerized             |
| AI Framework   | Gemini API                  | Agent orchestration and reasoning    |
| MCP Tools      | Backend-integrated          | Deterministic tool execution         |
| ORM            | SQLModel                    | Type-safe database operations        |
| Database       | Neon Serverless PostgreSQL  | Persistent, cloud-native             |
| Authentication | Better Auth (JWT)           | Shared secret verification           |
| API            | REST over HTTPS             | JSON payloads, Authorization headers |
| Container      | Docker                      | Minimal, reproducible images         |
| Orchestration  | Minikube (Kubernetes)       | Local K8s cluster                    |
| Packaging      | Helm                        | Chart-based deployments              |
| AIOps          | kubectl-ai, kagent          | AI-assisted cluster operations       |
| Spec Tooling   | Claude Code + Spec-Kit Plus | Spec-driven development              |

### API Design Standards

- All endpoints MUST be versioned (e.g., `/api/v1/tasks`)
- RESTful design for traditional APIs
- Stateless POST-based chat endpoint for AI interaction
- JSON request/response format with explicit schemas
- Standardized JSON error responses with `code`, `message`, and `details` fields
- All responses MUST include appropriate HTTP status codes

### Database Standards

- Schema MUST be explicit and version-controlled via Alembic migrations
- Tasks MUST have `user_id` foreign key linking to authenticated user
- Conversations and Messages MUST be persisted for stateless reconstruction
- Indexes MUST exist on `user_id` and `task_id` columns
- No in-memory state for persistent data; all task data in PostgreSQL

## Security Standards

### Authentication Requirements

- JWT tokens MUST be signed using `BETTER_AUTH_SECRET` environment variable
- Token signature MUST be verified on every protected request
- Invalid/expired tokens MUST return HTTP 401 Unauthorized

### Authorization Requirements

- Every API request to protected resources MUST include valid `Authorization: Bearer <token>` header
- User ID from JWT MUST match the `user_id` of requested resources
- Cross-user data access MUST be prevented at both API and database query levels

### Data Protection

- All secrets MUST be stored in environment variables or Kubernetes secrets
- Input validation MUST be implemented on all API endpoints
- SQL injection prevention via SQLModel and parameterized queries

## Quality Constraints

### Application Quality

- Application MUST be deployable via a single Helm install
- Cluster MUST reach a healthy state
- All pods MUST be Running or Ready
- No CrashLoopBackOff
- Logs MUST be readable and meaningful

### Code Quality

- Code MUST be production-ready with clear error handling
- No unused endpoints, tools, or dead code
- Consistent naming: `snake_case` for Python, `camelCase` for JavaScript
- Modular, maintainable structure with structured logging

### Testing Requirements

- **Unit Tests**: Pytest for backend, Jest for frontend
- **Integration Tests**: End-to-end flows including multi-user scenarios
- All tests MUST pass before merging
- Tests MUST verify AI agent behavior through MCP tools

## Success Criteria

Phase-4 is successful when:

1. ✅ Application runs fully on Minikube
2. ✅ Frontend and backend are containerized
3. ✅ Helm charts deploy successfully
4. ✅ kubectl-ai and/or kagent used for cluster operations
5. ✅ No manual Kubernetes YAML edits
6. ✅ Entire process traceable via specs and plans
7. ✅ All 5 basic todo features implemented (Create, Read, Update, Delete, List tasks)
8. ✅ All task operations are isolated per authenticated user
9. ✅ Backend and frontend authenticate independently via JWT
10. ✅ AI chatbot can manage tasks via natural language
11. ✅ AI agents operate exclusively through MCP tools
12. ✅ Conversation state survives server restarts
13. ✅ System behavior is deterministic and explainable
14. ✅ The entire project can be evaluated through specs alone

## Governance

### Amendment Process

1. Propose changes via spec update or ADR
2. Document rationale and impact assessment
3. Update constitution version according to semantic versioning:
   - **MAJOR**: Backward incompatible principle removals or redefinitions
   - **MINOR**: New principle/section added or materially expanded
   - **PATCH**: Clarifications, wording, typo fixes
4. Propagate changes to dependent templates (plan, spec, tasks)
5. Create PHR documenting the change

### Compliance Requirements

- All PRs MUST verify compliance with constitution principles
- Constitution supersedes all other project practices
- Changes to architecture require constitution updates
- Complexity MUST be justified against these principles
- See `GEMINI.md` for runtime development guidance

### Non-Negotiable Rules Summary

- No feature may be implemented without an approved spec and plan
- No AI agent may access the database directly
- No hidden logic outside specs and plans
- No manual code edits post-generation
- All state must be persisted in the database, not memory
- All agent actions must be explainable via tool calls
- All services must be containerized
- All deployments via Helm on Minikube
- No manual Kubernetes YAML edits

### Review Cadence

- Constitution MUST be reviewed at project milestones
- Any detected violations MUST be addressed before proceeding
- Amendments require documentation and migration plan

**Version**: 3.0.0 | **Ratified**: 2026-01-13 | **Last Amended**: 2026-02-09

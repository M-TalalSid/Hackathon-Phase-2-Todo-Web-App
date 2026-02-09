# Implementation Plan: Containerization & Image Intelligence

**Branch**: `008-docker-containerization` | **Date**: 2026-02-09 | **Spec**: [spec.md](file:///c:/Users/TALAL/Desktop/Phase-2-Hackathon/todo-web-app/specs/008-docker-containerization/spec.md)  
**Input**: Feature specification from `/specs/008-docker-containerization/spec.md`

## Summary

Containerize the Phase-3 Todo AI Chatbot frontend (Next.js) and backend (FastAPI) into production-grade Docker images using AI-assisted tooling (Gordon or Claude Code). Images will be optimized for security (non-root), size, and Kubernetes readiness.

## Technical Context

**Language/Version**: Python 3.11 (backend), Node.js 20 LTS (frontend)  
**Primary Dependencies**: FastAPI, Uvicorn, Next.js 16+  
**Storage**: Neon PostgreSQL (external, no in-container data)  
**Testing**: docker build validation, docker run health checks  
**Target Platform**: Docker Desktop (local), Kubernetes (Minikube)  
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: Build < 5 minutes, startup < 30 seconds  
**Constraints**: Backend < 500MB, Frontend < 300MB, non-root execution  
**Scale/Scope**: 2 container images, local validation only

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                          | Status  | Notes                                    |
| ---------------------------------- | ------- | ---------------------------------------- |
| XI. Containerization Standards     | ✅ PASS | All services containerized with Docker   |
| XII. Kubernetes Standards          | ✅ PASS | Images will be K8s-ready with probes     |
| VI. Agentic Workflow               | ✅ PASS | Dockerfiles AI-generated (Gordon/Claude) |
| II. Security-First                 | ✅ PASS | Non-root, no hardcoded secrets           |
| III. Deterministic Reproducibility | ✅ PASS | Multi-stage, deterministic builds        |

**Gate Status**: ✅ PASSED - No violations

## Project Structure

### Documentation (this feature)

```text
specs/008-docker-containerization/
├── plan.md              # This file
├── research.md          # Phase 0: Docker best practices
├── quickstart.md        # Phase 1: Container build/run guide
└── tasks.md             # Phase 2: Implementation tasks
```

### Source Code (repository root)

```text
backend/
├── Dockerfile           # AI-generated (Gordon/Claude)
├── .dockerignore        # Exclude unnecessary files
├── app/                 # FastAPI application
└── requirements.txt     # Python dependencies

frontend/
├── Dockerfile           # AI-generated (Gordon/Claude)
├── .dockerignore        # Exclude unnecessary files
├── src/                 # Next.js application
└── package.json         # Node dependencies
```

**Structure Decision**: Web application with separate Dockerfiles per service. Each service is independently buildable and deployable.

---

## Implementation Phases

### Phase 1: Environment Preparation

**Objective**: Verify Docker environment is ready for containerization.

**Tasks**:

| #   | Task                                           | FR Mapping | Validation                             |
| --- | ---------------------------------------------- | ---------- | -------------------------------------- |
| 1.1 | Verify Docker Desktop is installed and running | -          | `docker version` returns version info  |
| 1.2 | Check Docker AI (Gordon) availability          | FR-003     | `docker ai --version` or note fallback |
| 1.3 | Confirm Docker daemon is healthy               | -          | `docker info` shows no errors          |
| 1.4 | Validate existing backend Dockerfile           | FR-001     | File exists in `backend/`              |
| 1.5 | Check frontend folder structure                | FR-002     | `frontend/package.json` exists         |

**Exit Criteria**:

- Docker Desktop running
- Gordon status documented (available or fallback to Claude)
- Both service directories have required dependency files

---

### Phase 2: Frontend Containerization

**Objective**: Create and validate Next.js frontend Docker image.

**Tasks**:

| #   | Task                                | FR Mapping | Validation                                  |
| --- | ----------------------------------- | ---------- | ------------------------------------------- |
| 2.1 | Analyze frontend with Gordon/Claude | FR-003     | AI tool generates Dockerfile                |
| 2.2 | Generate `.dockerignore`            | FR-007     | Excludes node_modules, .env, .git           |
| 2.3 | Generate multi-stage Dockerfile     | FR-010     | Build stage + production stage              |
| 2.4 | Configure non-root user             | FR-006     | USER directive in Dockerfile                |
| 2.5 | Build frontend image                | FR-002     | `docker build -t taskflow-frontend .`       |
| 2.6 | Run frontend container              | FR-005     | `docker run -p 3000:3000 taskflow-frontend` |
| 2.7 | Validate UI loads                   | SC-002     | Homepage accessible in browser              |
| 2.8 | Inspect logs for errors             | SC-003     | No ERROR level logs                         |
| 2.9 | Check image size                    | NFR-003    | `docker images` shows < 300MB               |

**Dockerfile Structure** (AI-generated):

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

**Exit Criteria**:

- Frontend image builds successfully
- Container starts and serves UI on port 3000
- Image size < 300MB
- Process runs as non-root

---

### Phase 3: Backend Containerization

**Objective**: Create and validate FastAPI backend Docker image.

**Tasks**:

| #    | Task                                 | FR Mapping     | Validation                                                 |
| ---- | ------------------------------------ | -------------- | ---------------------------------------------------------- |
| 3.1  | Review existing backend Dockerfile   | FR-001         | Assess current state                                       |
| 3.2  | Enhance with Gordon/Claude if needed | FR-003         | AI tool optimizes Dockerfile                               |
| 3.3  | Verify `.dockerignore`               | FR-007         | Excludes .env, **pycache**, .venv                          |
| 3.4  | Validate multi-stage build           | FR-010         | Build stage + production stage                             |
| 3.5  | Confirm non-root user                | FR-006         | USER directive present                                     |
| 3.6  | Build backend image                  | FR-001         | `docker build -t taskflow-backend .`                       |
| 3.7  | Run backend container                | FR-004         | `docker run -p 7860:7860 --env-file .env taskflow-backend` |
| 3.8  | Validate health endpoint             | FR-012, SC-003 | `curl localhost:7860/health` returns OK                    |
| 3.9  | Inspect logs for errors              | SC-003         | No ERROR level logs                                        |
| 3.10 | Check image size                     | NFR-002        | `docker images` shows < 500MB                              |

**Dockerfile Structure** (existing, validate):

```dockerfile
# Stage 1: Build
FROM python:3.11-slim AS builder
WORKDIR /app
RUN pip install --no-cache-dir --upgrade pip
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Production
FROM python:3.11-slim AS runner
WORKDIR /app
RUN groupadd --gid 1001 app && useradd --uid 1001 --gid app app
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY app/ ./app/
USER app
EXPOSE 7860
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
```

**Exit Criteria**:

- Backend image builds successfully
- Container starts and responds on port 7860
- Health endpoint returns `{"status": "ok"}`
- Image size < 500MB
- Process runs as non-root

---

### Phase 4: Image Hardening & Optimization

**Objective**: Verify security and optimization requirements.

**Tasks**:

| #   | Task                                | FR Mapping       | Validation                                 |
| --- | ----------------------------------- | ---------------- | ------------------------------------------ |
| 4.1 | Verify non-root execution           | FR-006, SC-005   | `docker exec <id> whoami` ≠ root           |
| 4.2 | Validate multi-stage separation     | FR-010           | Build tools not in final image             |
| 4.3 | Test environment variable injection | FR-008           | Container fails fast without required vars |
| 4.4 | Inspect image layers                | SC-004           | `docker history` shows no secrets          |
| 4.5 | Verify no secrets in image          | FR-007, SC-004   | `docker inspect` clean                     |
| 4.6 | Document image sizes                | NFR-002, NFR-003 | Record actual sizes                        |
| 4.7 | Test deterministic builds           | FR-011           | Rebuild produces same layers               |

**Security Checklist**:

- [ ] No secrets in Dockerfile
- [ ] No secrets in image layers
- [ ] Non-root user configured
- [ ] Minimal base image (alpine/slim)
- [ ] No dev dependencies in production

**Exit Criteria**:

- Both images pass security checklist
- All environment variables injected at runtime
- Image sizes within limits

---

### Phase 5: Final Validation

**Objective**: Confirm images are production-ready and K8s-compatible.

**Tasks**:

| #   | Task                                 | FR Mapping | Validation                        |
| --- | ------------------------------------ | ---------- | --------------------------------- | -------------- |
| 5.1 | List all images                      | -          | `docker images                    | grep taskflow` |
| 5.2 | Verify image tags                    | SC-001     | Both images tagged correctly      |
| 5.3 | Run both containers together         | SC-003     | Full stack functional             |
| 5.4 | Test frontend → backend connectivity | -          | Chat and tasks work               |
| 5.5 | Document final image specs           | SC-007     | Sizes, tags, ports                |
| 5.6 | Verify K8s readiness                 | SC-008     | Health probes work, ports exposed |
| 5.7 | Clean up test containers             | -          | `docker rm` test containers       |

**Final Validation Matrix**:

| Image             | Size    | Port | Non-Root | Health    | K8s Ready |
| ----------------- | ------- | ---- | -------- | --------- | --------- |
| taskflow-frontend | < 300MB | 3000 | ✅       | N/A       | ✅        |
| taskflow-backend  | < 500MB | 7860 | ✅       | `/health` | ✅        |

**Exit Criteria**:

- Both images build and run successfully
- All success criteria (SC-001 to SC-008) verified
- Images ready for Helm chart packaging

---

## Completion Conditions

| Condition                                | Status |
| ---------------------------------------- | ------ |
| Frontend image builds successfully       | ⬜     |
| Backend image builds successfully        | ⬜     |
| Both containers run without errors       | ⬜     |
| Images are optimized (under size limits) | ⬜     |
| Non-root execution verified              | ⬜     |
| No secrets in images                     | ⬜     |
| All Dockerfiles AI-generated             | ⬜     |
| Images ready for Kubernetes              | ⬜     |

---

## Risk Mitigation

| Risk                          | Mitigation                                                 |
| ----------------------------- | ---------------------------------------------------------- |
| Gordon unavailable            | Claude Code generates Dockerfiles with documented fallback |
| Image size exceeds limits     | Multi-stage builds, alpine bases, dependency cleanup       |
| Non-root breaks functionality | Test permissions, ensure writable temp directories         |
| Build non-deterministic       | Pin base image versions, use lockfiles                     |

---

## Next Steps

1. Run `/sp.tasks` to generate executable task list
2. Execute Phase 1: Environment Preparation
3. Proceed through Phases 2-5 sequentially
4. Create walkthrough documenting results

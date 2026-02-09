---
id: 003
title: Phase-4 Cloud-Native Constitution Update
stage: constitution
date: 2026-02-09
surface: agent
model: claude-sonnet-4-20250514
feature: none
branch: main
user: talalsid
command: /sp.constitution
labels: [cloud-native, kubernetes, helm, docker, aiops, phase-4]
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

/sp.constitution ( Update )

Project : Cloud-Native & AI-Assisted DevOps Standards

## Core Principles

- Spec-driven development (spec → plan → tasks → implementation)
- Zero manual coding (all code and infra generated via Claude Code or AI agents)
- Deterministic and reproducible builds
- Clear separation of concerns:
  - Frontend
  - Backend
  - AI Agent
  - Infrastructure
- Security-first and isolation-by-default
- Cloud-native best practices, even in local environments

---

## Agentic Development Rules

- No feature or infrastructure change without a spec
- Every spec must have a corresponding plan
- Plans must be broken into executable steps
- All implementation must be AI-generated
- Manual edits to generated code or manifests are forbidden
- All deviations require spec or plan updates

---

## Security Standards

- JWT-based authentication across frontend, backend, and APIs
- Authorization enforced on every request
- User-level data isolation mandatory
- No secrets hardcoded
- Kubernetes secrets and environment variables only
- Containers must not run as root unless explicitly justified

---

## Application Architecture Constraints

### Core Stack

- Frontend: Next.js 16+ (App Router)
- Backend: FastAPI (Python)
- AI Agent: Reasoning + MCP Tooling
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth (JWT)

---

### Deployment Scope

- Local Kubernetes deployment only
- No paid cloud providers
- No external managed Kubernetes services

### Containerization Standards

- All services must be containerized using Docker
- Docker images must be reproducible and minimal
- Docker AI Agent (Gordon) must be used for:
  - Image optimization
  - Dockerfile generation
  - Container diagnostics (when available)

---

### Kubernetes Standards

- Kubernetes distribution: Minikube
- All workloads deployed as Kubernetes resources
- No `docker run` in production paths
- Resource requests and limits required for all pods
- Liveness and readiness probes required

---

### Helm & Packaging Rules

- Helm charts required for:
  - Frontend
  - Backend
- Values must be configurable
- No hardcoded environment values
- Charts must support scaling via values.yaml

---

### AI-Assisted Operations (AIOps)

- kubectl-ai must be used for:
  - Deployment
  - Scaling
  - Debugging
- kagent must be used for:
  - Cluster health analysis
  - Resource optimization insights

---

## Quality Constraints

- Application must be deployable via a single Helm install
- Cluster must reach a healthy state
- All pods must be Running or Ready
- No CrashLoopBackOff
- Logs must be readable and meaningful

---

## Success Criteria

Phase-4 is successful when:

- Application runs fully on Minikube
- Frontend and backend are containerized
- Helm charts deploy successfully
- kubectl-ai and/or kagent used for cluster operations
- No manual Kubernetes YAML edits
- Entire process traceable via specs and plans

## Response snapshot

Updated constitution from v2.0.0 to v3.0.0 (MAJOR version bump) with Phase-4 Cloud-Native & AI-Assisted DevOps Standards.

**Added 5 new principles:**

- X. Cloud-Native Standards (NON-NEGOTIABLE)
- XI. Containerization Standards
- XII. Kubernetes Standards (NON-NEGOTIABLE)
- XIII. Helm & Packaging Rules
- XIV. AI-Assisted Operations (AIOps) Standards

**Updated sections:**

- Project Objective - Added cloud-native and Minikube focus
- Technology Stack - Added Docker, Minikube, Helm, kubectl-ai, kagent
- Success Criteria - Added K8s deployment, Helm, and AIOps criteria
- Non-Negotiable Rules - Added containerization and Helm requirements

## Outcome

- ✅ Impact: MAJOR constitution update for Phase-4 cloud-native deployment
- 🧪 Tests: N/A - governance document
- 📁 Files: Updated `.specify/memory/constitution.md`
- 🔁 Next prompts: Create specs for Dockerfile, Helm charts, Minikube deployment
- 🧠 Reflection: Successfully integrated all Phase-4 requirements while preserving existing AI agent and MCP principles

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All placeholders filled, version bumped correctly
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Validate template propagation for K8s/Helm sections

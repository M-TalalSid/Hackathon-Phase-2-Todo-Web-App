# Research: Kubernetes Deployment & AIOps

**Feature**: 009-kubernetes-helm-aiops  
**Date**: 2026-02-09

---

## Research Topics

### 1. kubectl-ai Plugin Installation & Configuration

**Decision**: Use kubectl-ai plugin for AI-assisted Kubernetes operations

**Rationale**:

- kubectl-ai integrates directly with kubectl as a plugin
- Provides natural language interface for K8s operations
- Supports deployment, scaling, and diagnostics
- Open-source and actively maintained

**Installation**:

```bash
# Install via krew (kubectl plugin manager)
kubectl krew install ai

# Or via direct download
# https://github.com/sozercan/kubectl-ai
```

**Configuration**:

- Requires Gemini API key or compatible LLM endpoint
- Set `GEMINI_API_KEY` environment variable
- Alternative: Use local LLM with compatible API

**Alternatives Considered**:

- k8sgpt: Good for diagnostics but limited deployment support
- kopilot: Less mature ecosystem
- Manual helm: Fallback if AI tools unavailable

---

### 2. Minikube Best Practices for Local Development

**Decision**: Use Minikube with Docker driver

**Rationale**:

- Docker driver most compatible with Windows/WSL2
- Easy image loading with `minikube image load`
- Built-in addons for common services
- Resource efficient for local development

**Recommended Configuration**:

```bash
minikube start --driver=docker --cpus=2 --memory=4096
minikube addons enable dashboard
minikube addons enable metrics-server
```

**Key Commands**:

- `minikube status`: Verify cluster health
- `minikube image load`: Load local Docker images
- `minikube service`: Access services
- `minikube tunnel`: LoadBalancer support

**Alternatives Considered**:

- Kind: Faster startup but less features
- Docker Desktop K8s: Simpler but less control
- k3d: Good alternative but requires k3s learning

---

### 3. Helm Chart Structure for Microservices

**Decision**: Create separate Helm charts for frontend and backend

**Rationale**:

- Independent deployment and scaling
- Clear separation of concerns
- Environment-specific values.yaml
- Standard Helm chart structure

**Chart Structure**:

```
charts/
├── taskflow-backend/
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
│       ├── deployment.yaml
│       ├── service.yaml
│       └── _helpers.tpl
└── taskflow-frontend/
    ├── Chart.yaml
    ├── values.yaml
    └── templates/
        ├── deployment.yaml
        ├── service.yaml
        └── _helpers.tpl
```

**values.yaml Key Fields**:

- `image.repository`, `image.tag`
- `replicaCount`
- `resources.requests`, `resources.limits`
- `env` (environment variables)
- `service.type`, `service.port`
- `livenessProbe`, `readinessProbe`

---

### 4. kagent for Cluster Health Analysis

**Decision**: Use kagent as optional AIOps enhancement

**Rationale**:

- Provides cluster health insights
- AI-powered resource optimization
- Non-blocking if unavailable
- Complements kubectl-ai for operations

**Installation**:

```bash
# Install kagent (if available)
# Check: https://github.com/kagent-ai/kagent
```

**Fallback**: If kagent unavailable, use:

- `kubectl top nodes/pods` for metrics
- `kubectl describe` for detailed diagnostics
- Manual log analysis with `kubectl logs`

---

## Technology Stack Summary

| Component         | Technology               | Purpose                      |
| ----------------- | ------------------------ | ---------------------------- |
| Cluster           | Minikube + Docker driver | Local Kubernetes             |
| Orchestration     | Helm 3.x                 | Chart-based deployment       |
| AI Operations     | kubectl-ai               | Natural language K8s control |
| Health Analysis   | kagent (optional)        | Cluster insights             |
| Container Runtime | Docker                   | Image management             |

---

## Risk Mitigations

| Risk                        | Mitigation                              |
| --------------------------- | --------------------------------------- |
| kubectl-ai requires API key | Document setup; provide manual fallback |
| Minikube resource limits    | Specify minimum 4GB RAM, 2 CPUs         |
| Image not found in cluster  | Use `minikube image load` before deploy |
| Service not accessible      | Use NodePort or `minikube tunnel`       |

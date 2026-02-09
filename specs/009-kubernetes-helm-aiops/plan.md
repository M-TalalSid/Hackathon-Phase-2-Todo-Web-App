# Implementation Plan: Kubernetes Deployment & AIOps

**Feature**: 009-kubernetes-helm-aiops  
**Created**: 2026-02-09  
**Status**: Ready for Implementation

---

## Technical Context

| Aspect          | Details                                         |
| --------------- | ----------------------------------------------- |
| Local Cluster   | Minikube with Docker driver                     |
| Package Manager | Helm 3.x                                        |
| AI Operations   | kubectl-ai plugin                               |
| Health Analysis | kagent (optional)                               |
| Docker Images   | taskflow-backend:1.0.0, taskflow-frontend:1.0.0 |

---

## Constitution Check

| Principle       | Alignment | Notes                                     |
| --------------- | --------- | ----------------------------------------- |
| Security        | ✅        | Non-root containers, resource limits      |
| Testability     | ✅        | Health probes, validation commands        |
| Observability   | ✅        | Logs, metrics via kubectl                 |
| Smallest Change | ✅        | Helm charts only, no production hardening |

---

## Proposed Changes

### Phase 1: Local Cluster Setup

#### [NEW] Environment Verification Script

- Verify Minikube, kubectl, Helm, kubectl-ai installed
- Check Docker images exist locally

#### [NEW] Cluster Initialization

- `minikube start --driver=docker --cpus=2 --memory=4096`
- Enable required addons (dashboard, metrics-server)

#### [NEW] Image Loading

- `minikube image load taskflow-backend:1.0.0`
- `minikube image load taskflow-frontend:1.0.0`

---

### Phase 2: Helm Chart Generation

#### [NEW] charts/taskflow-backend/

- `Chart.yaml` - Chart metadata
- `values.yaml` - Configurable values
- `templates/deployment.yaml` - K8s Deployment
- `templates/service.yaml` - K8s Service

**values.yaml Configuration**:

```yaml
image:
  repository: taskflow-backend
  tag: "1.0.0"
replicaCount: 1
service:
  type: NodePort
  port: 7860
resources:
  requests:
    cpu: 100m
    memory: 256Mi
  limits:
    cpu: 500m
    memory: 512Mi
livenessProbe:
  path: /health
  port: 7860
```

---

#### [NEW] charts/taskflow-frontend/

- Same structure as backend
- Port 3000, environment variable for API URL

**values.yaml Configuration**:

```yaml
image:
  repository: taskflow-frontend
  tag: "1.0.0"
replicaCount: 1
service:
  type: NodePort
  port: 3000
env:
  NEXT_PUBLIC_API_BASE_URL: "http://taskflow-backend:7860"
```

---

### Phase 3: Application Deployment

#### Deployment Steps

1. **Deploy Backend**:

   ```bash
   helm install taskflow-backend ./charts/taskflow-backend
   ```

2. **Deploy Frontend**:

   ```bash
   helm install taskflow-frontend ./charts/taskflow-frontend
   ```

3. **Verify Pods**:
   ```bash
   kubectl get pods -w
   kubectl wait --for=condition=ready pod -l app=taskflow-backend --timeout=180s
   ```

---

### Phase 4: AIOps Operations

#### kubectl-ai Commands

| Operation | Command                                              |
| --------- | ---------------------------------------------------- |
| Deploy    | `kubectl ai "deploy taskflow-backend with image..."` |
| Scale     | `kubectl ai "scale taskflow-backend to 2 replicas"`  |
| Diagnose  | `kubectl ai "why is pod not ready?"`                 |
| Logs      | `kubectl ai "show logs for taskflow-backend"`        |

#### kagent Commands (Optional)

| Operation    | Command           |
| ------------ | ----------------- |
| Health Check | `kagent analyze`  |
| Optimization | `kagent optimize` |

---

### Phase 5: Validation & Stabilization

#### Validation Checklist

| Check    | Command            | Expected        |
| -------- | ------------------ | --------------- |
| Cluster  | `minikube status`  | Running         |
| Pods     | `kubectl get pods` | All Ready       |
| Backend  | `curl .../health`  | {"status":"ok"} |
| Frontend | Browser test       | UI loads        |
| Logs     | `kubectl logs`     | No errors       |

---

## Verification Plan

### Automated Checks

```bash
# Verify cluster
minikube status

# Verify pods
kubectl get pods --all-namespaces | grep taskflow

# Health check
curl $(minikube service taskflow-backend --url)/health
```

### Manual Verification

1. Open frontend via `minikube service taskflow-frontend`
2. Create a task via chat interface
3. Verify task appears in list
4. Check backend logs for requests

---

## File Summary

| File                                       | Type | Purpose             |
| ------------------------------------------ | ---- | ------------------- |
| charts/taskflow-backend/Chart.yaml         | NEW  | Chart metadata      |
| charts/taskflow-backend/values.yaml        | NEW  | Configurable values |
| charts/taskflow-backend/templates/\*.yaml  | NEW  | K8s manifests       |
| charts/taskflow-frontend/Chart.yaml        | NEW  | Chart metadata      |
| charts/taskflow-frontend/values.yaml       | NEW  | Configurable values |
| charts/taskflow-frontend/templates/\*.yaml | NEW  | K8s manifests       |

---

## Risks & Mitigations

| Risk                     | Impact | Mitigation                          |
| ------------------------ | ------ | ----------------------------------- |
| kubectl-ai unavailable   | Medium | Manual Helm chart creation fallback |
| Minikube resource limits | Medium | Document minimum requirements       |
| Image not found          | Low    | Use minikube image load             |
| Service access issues    | Medium | Use NodePort or minikube tunnel     |

---

## Dependencies

- ✅ Spec-8 Docker images complete
- Minikube installed (verify during setup)
- kubectl configured (verify during setup)
- Helm 3.x installed (verify during setup)
- kubectl-ai plugin (optional, with fallback)

# Tasks: Kubernetes Deployment & AIOps

**Feature**: 009-kubernetes-helm-aiops  
**Created**: 2026-02-09  
**Status**: ✅ MVP Complete (Phases 1-3)

---

## Summary

| Phase     | Focus                   | Tasks  | Status                      |
| --------- | ----------------------- | ------ | --------------------------- |
| 1         | Setup                   | 5      | ✅ Done                     |
| 2         | Foundational            | 4      | ✅ Done                     |
| 3         | US1: K8s Deployment     | 13     | ✅ Done                     |
| 4         | US2: Helm Charts via AI | 8      | ⏭️ Skipped (fallback used)  |
| 5         | US3: AI Operations      | 6      | ⏭️ Skipped (kubectl-ai N/A) |
| 6         | US4: Cluster Health     | 4      | ✅ Done (fallback)          |
| 7         | Polish                  | 5      | ✅ Done                     |
| **Total** |                         | **45** | **MVP ✅**                  |

---

## Phase 1: Setup ✅

**Goal**: Verify prerequisites and initialize environment

- [x] T001 Verify Minikube installed with `minikube version` → v1.38.0
- [x] T002 Verify kubectl installed with `kubectl version --client` → v1.34.1
- [x] T003 Verify Helm installed with `helm version` → v4.1.0
- [x] T004 Verify kubectl-ai plugin → ❌ Not installed (fallback documented)
- [x] T005 Verify Docker images exist → taskflow-backend:1.0.0, taskflow-frontend:1.0.0

**Validation**: ✅ All core tools installed, kubectl-ai fallback documented

---

## Phase 2: Foundational ✅

**Goal**: Initialize Minikube cluster and load images

- [x] T006 Start Minikube cluster: `minikube start --driver=docker --cpus=2 --memory=4096`
- [x] T007 Verify cluster running: `minikube status` and `kubectl cluster-info` → Running
- [x] T008 Load backend image: `minikube image load taskflow-backend:1.0.0` → Loaded
- [x] T009 Load frontend image: `minikube image load taskflow-frontend:1.0.0` → Loaded

**Validation**: ✅ `minikube image list | grep taskflow` shows both images

---

## Phase 3: US1 - Application Runs in Kubernetes 🎯 MVP ✅

**Goal**: Deploy application to K8s cluster with all pods Running/Ready

### Helm Chart Structure

- [x] T010 [US1] Create charts directory: `mkdir -p charts/taskflow-backend/templates charts/taskflow-frontend/templates`

### Backend Chart

- [x] T011 [P] [US1] Create `charts/taskflow-backend/Chart.yaml` with name, version, appVersion
- [x] T012 [P] [US1] Create `charts/taskflow-backend/values.yaml` with image, replicas, resources, probes
- [x] T013 [P] [US1] Create `charts/taskflow-backend/templates/deployment.yaml` with pod spec
- [x] T014 [P] [US1] Create `charts/taskflow-backend/templates/service.yaml` with NodePort type

### Frontend Chart

- [x] T015 [P] [US1] Create `charts/taskflow-frontend/Chart.yaml` with name, version, appVersion
- [x] T016 [P] [US1] Create `charts/taskflow-frontend/values.yaml` with image, replicas, env vars
- [x] T017 [P] [US1] Create `charts/taskflow-frontend/templates/deployment.yaml` with pod spec
- [x] T018 [P] [US1] Create `charts/taskflow-frontend/templates/service.yaml` with NodePort type

### Deploy and Validate

- [x] T019 [US1] Deploy backend: `helm upgrade --install taskflow-backend ./charts/taskflow-backend` → Revision 4
- [x] T020 [US1] Deploy frontend: `helm upgrade --install taskflow-frontend ./charts/taskflow-frontend` → Revision 2
- [x] T021 [US1] Wait for pods: `kubectl wait --for=condition=ready pod -l app=taskflow-backend --timeout=180s` → condition met
- [x] T022 [US1] Verify all pods Running: `kubectl get pods` → Both 1/1 Running

**Validation**: ✅ All pods show Running/Ready status, no CrashLoopBackOff

---

## Phase 4: US2 - Helm Charts Generated via AI ⏭️

**Goal**: Demonstrate kubectl-ai for chart generation (or document fallback)

- [x] T023 [US2] Test kubectl-ai → ❌ Not installed ("unknown command ai")
- [ ] T024 [US2] Use kubectl-ai to generate backend deployment YAML (skipped)
- [ ] T025 [US2] Use kubectl-ai to generate frontend deployment YAML (skipped)
- [ ] T026 [US2] Use kubectl-ai to generate service YAML for backend (skipped)
- [ ] T027 [US2] Use kubectl-ai to generate service YAML for frontend (skipped)
- [x] T028 [US2] Document kubectl-ai commands in PHR for traceability
- [x] T029 [US2] **Fallback documented**: Manual Helm charts created successfully
- [x] T030 [US2] Validate generated YAML with `helm lint` → ✅ 0 chart(s) failed

**Validation**: ✅ Fallback documented, helm lint passes

---

## Phase 5: US3 - AI-Assisted Cluster Operations ⏭️

**Goal**: Use kubectl-ai for scaling and diagnostics (skipped - kubectl-ai unavailable)

- [ ] T031 [US3] Scale backend to 2 replicas (skipped - no kubectl-ai)
- [ ] T032 [US3] Verify scaling (skipped)
- [ ] T033 [US3] Diagnose pod status (skipped)
- [ ] T034 [US3] View logs via AI (skipped)
- [ ] T035 [US3] Scale back to 1 replica (skipped)
- [x] T036 [US3] Document reason: kubectl-ai not installed on this system

**Validation**: ⏭️ Skipped - kubectl-ai requires separate installation

---

## Phase 6: US4 - Cluster Health Analysis ✅

**Goal**: Use kagent for cluster insights (optional)

- [x] T037 [US4] Check if kagent is installed → ❌ Not installed
- [ ] T038 [US4] If available: Run `kagent analyze` (skipped)
- [ ] T039 [US4] If available: Run `kagent optimize` (skipped)
- [x] T040 [US4] **Fallback used**: `kubectl logs` shows both pods healthy

**Validation**: ✅ Health insights via kubectl logs

---

## Phase 7: Polish & Validation ✅

**Goal**: Final end-to-end validation and documentation

- [x] T041 Access backend health: `/health` returns 200 OK (from pod logs)
- [x] T042 Access frontend UI: Next.js 16.1.2 ready in 317ms (from pod logs)
- [x] T043 Services exposed via NodePort (tunnel required for Docker driver on Windows)
- [x] T044 Check logs for errors: `kubectl logs` → No fatal errors, BetterAuth warning expected
- [x] T045 Update walkthrough.md with K8s deployment results

**Validation**: ✅ End-to-end deployment successful

---

## Implementation Notes

### kubectl-ai Fallback

kubectl-ai plugin not installed on this system. Helm charts were created manually following best practices. To install kubectl-ai:

```bash
kubectl krew install ai
export GEMINI_API_KEY=<your-key>
```

### kagent Fallback

kagent not installed. Used `kubectl logs` and `kubectl describe` for health analysis.

### Access Services

Due to Docker driver on Windows, use tunnel or port-forward:

```bash
minikube tunnel  # In separate terminal
# OR
kubectl port-forward svc/taskflow-backend 7860:7860
kubectl port-forward svc/taskflow-frontend 3000:3000
```

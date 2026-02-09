# Quickstart: Kubernetes Deployment & AIOps

**Feature**: 009-kubernetes-helm-aiops  
**Prerequisites**: Docker images from Spec-8 (taskflow-backend:1.0.0, taskflow-frontend:1.0.0)

---

## Phase 1: Environment Setup

### 1.1 Verify Prerequisites

```bash
# Check Minikube
minikube version

# Check kubectl
kubectl version --client

# Check Helm
helm version

# Check kubectl-ai (optional)
kubectl ai --version
```

### 1.2 Start Minikube Cluster

```bash
# Start with Docker driver
minikube start --driver=docker --cpus=2 --memory=4096

# Verify cluster
minikube status
kubectl cluster-info
```

### 1.3 Load Docker Images

```bash
# Load images into Minikube
minikube image load taskflow-backend:1.0.0
minikube image load taskflow-frontend:1.0.0

# Verify images
minikube image list | grep taskflow
```

---

## Phase 2: Helm Chart Deployment

### 2.1 Generate Charts (via kubectl-ai)

```bash
# Generate backend chart
kubectl ai "create a helm chart for taskflow-backend deployment with image taskflow-backend:1.0.0, port 7860, 1 replica, and health probe at /health"

# Generate frontend chart
kubectl ai "create a helm chart for taskflow-frontend deployment with image taskflow-frontend:1.0.0, port 3000, 1 replica"
```

### 2.2 Deploy with Helm

```bash
# Deploy backend
helm install taskflow-backend ./charts/taskflow-backend

# Deploy frontend
helm install taskflow-frontend ./charts/taskflow-frontend

# Verify deployments
kubectl get pods -w
```

---

## Phase 3: Validation

### 3.1 Check Pod Status

```bash
# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app=taskflow-backend --timeout=180s
kubectl wait --for=condition=ready pod -l app=taskflow-frontend --timeout=180s

# Get pod status
kubectl get pods
```

### 3.2 Access Services

```bash
# Get backend service URL
minikube service taskflow-backend --url

# Get frontend service URL
minikube service taskflow-frontend --url

# Or use port-forward
kubectl port-forward svc/taskflow-backend 7860:7860
kubectl port-forward svc/taskflow-frontend 3000:3000
```

### 3.3 Test Endpoints

```bash
# Test backend health
curl $(minikube service taskflow-backend --url)/health

# Open frontend in browser
minikube service taskflow-frontend
```

---

## Phase 4: AIOps Operations

### 4.1 Scaling with kubectl-ai

```bash
# Scale backend
kubectl ai "scale the taskflow-backend deployment to 2 replicas"

# Scale frontend
kubectl ai "scale the taskflow-frontend deployment to 2 replicas"

# Verify scaling
kubectl get pods
```

### 4.2 Diagnostics with kubectl-ai

```bash
# Diagnose issues
kubectl ai "why is my taskflow-backend pod not ready"

# Check logs
kubectl ai "show me the logs for taskflow-backend"
```

### 4.3 Cluster Health (kagent - optional)

```bash
# Run cluster health analysis
kagent analyze

# Get resource recommendations
kagent optimize
```

---

## Phase 5: Cleanup

```bash
# Uninstall Helm releases
helm uninstall taskflow-frontend
helm uninstall taskflow-backend

# Stop Minikube
minikube stop

# Delete cluster (optional)
minikube delete
```

---

## Validation Checklist

| Check           | Command            | Expected        |
| --------------- | ------------------ | --------------- |
| Cluster running | `minikube status`  | Running         |
| Pods ready      | `kubectl get pods` | All Ready       |
| Backend health  | `curl .../health`  | {"status":"ok"} |
| Frontend loads  | Browser            | UI renders      |
| No crash loops  | `kubectl get pods` | No errors       |

---

## Troubleshooting

| Issue                  | Solution                          |
| ---------------------- | --------------------------------- |
| Image not found        | `minikube image load <image>`     |
| Pod CrashLoopBackOff   | `kubectl logs <pod>` for errors   |
| Service not accessible | `minikube tunnel` or use NodePort |
| kubectl-ai not working | Check `GEMINI_API_KEY` is set     |

# Quickstart: Docker Containerization

**Feature**: 008-docker-containerization  
**Date**: 2026-02-09

## Prerequisites

- Docker Desktop installed and running
- Project cloned with frontend/ and backend/ directories
- Environment variables configured in `.env` files

## Quick Commands

### Backend Container

```bash
# Build the image
cd backend
docker build -t taskflow-backend .

# Run with environment file
docker run -d \
  --name taskflow-backend \
  -p 7860:7860 \
  --env-file .env \
  taskflow-backend

# Verify health
curl http://localhost:7860/health
# Expected: {"status":"ok","version":"0.1.0","database":"connected"}

# View logs
docker logs taskflow-backend

# Stop and remove
docker stop taskflow-backend && docker rm taskflow-backend
```

### Frontend Container

```bash
# Build the image
cd frontend
docker build -t taskflow-frontend .

# Run the container
docker run -d \
  --name taskflow-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://localhost:7860 \
  taskflow-frontend

# Open in browser
start http://localhost:3000

# View logs
docker logs taskflow-frontend

# Stop and remove
docker stop taskflow-frontend && docker rm taskflow-frontend
```

### Run Both Services

```bash
# Start backend first
cd backend
docker build -t taskflow-backend .
docker run -d --name taskflow-backend -p 7860:7860 --env-file .env taskflow-backend

# Then frontend
cd ../frontend
docker build -t taskflow-frontend .
docker run -d --name taskflow-frontend -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://host.docker.internal:7860 \
  taskflow-frontend

# Verify
curl http://localhost:7860/health
start http://localhost:3000
```

## Validation Checklist

```bash
# Check images
docker images | grep taskflow

# Check running containers
docker ps | grep taskflow

# Check non-root user (backend)
docker exec taskflow-backend whoami
# Expected: app (NOT root)

# Check non-root user (frontend)
docker exec taskflow-frontend whoami
# Expected: nextjs (NOT root)

# Check image sizes
docker images taskflow-backend --format "{{.Size}}"
# Expected: < 500MB

docker images taskflow-frontend --format "{{.Size}}"
# Expected: < 300MB
```

## Environment Variables

### Backend Required

| Variable           | Description                  | Example                  |
| ------------------ | ---------------------------- | ------------------------ |
| DATABASE_URL       | PostgreSQL connection string | postgresql+asyncpg://... |
| GEMINI_API_KEY     | Gemini API key for chat      | AIza-...                   |
| BETTER_AUTH_SECRET | Auth encryption key          | (random string)          |

### Frontend Required

| Variable                 | Description              | Example               |
| ------------------------ | ------------------------ | --------------------- |
| NEXT_PUBLIC_API_BASE_URL | Backend API URL          | http://localhost:7860 |
| DATABASE_URL             | Auth database (plain pg) | postgresql://...      |
| BETTER_AUTH_SECRET       | Must match backend       | (same as backend)     |

## Cleanup

```bash
# Stop and remove all taskflow containers
docker stop taskflow-frontend taskflow-backend 2>/dev/null
docker rm taskflow-frontend taskflow-backend 2>/dev/null

# Remove images (optional)
docker rmi taskflow-frontend taskflow-backend
```

## Troubleshooting

| Issue                        | Solution                                           |
| ---------------------------- | -------------------------------------------------- |
| Port already in use          | `docker ps -a` to find conflicting container       |
| Health check fails           | Check DATABASE_URL is accessible from container    |
| Frontend can't reach backend | Use `host.docker.internal` instead of `localhost`  |
| Permission denied            | Verify non-root user has write access to temp dirs |

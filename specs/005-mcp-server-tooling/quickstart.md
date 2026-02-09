# Quickstart: MCP Server & Deterministic Task Tooling

**Feature**: 005-mcp-server-tooling  
**Date**: 2026-02-05

## Prerequisites

- Python 3.11+
- uv package manager (or pip)
- PostgreSQL database (Neon Serverless)
- `DATABASE_URL` environment variable configured

## Setup

### 1. Navigate to MCP Server Directory

```bash
cd mcp-server
```

### 2. Install Dependencies

```bash
# Using uv (recommended)
uv sync

# Or using pip
pip install -e .
```

### 3. Configure Environment

Create `.env` file in `mcp-server/`:

```env
DATABASE_URL=postgresql+asyncpg://user:password@host/database
```

### 4. Start MCP Server

```bash
# Using stdio transport (for AI agent integration)
python -m src.server

# Or run directly
uv run python -m src.server
```

## Available Tools

| Tool            | Description                   |
| --------------- | ----------------------------- |
| `add_task`      | Create a new task             |
| `list_tasks`    | List user's tasks             |
| `update_task`   | Update task title/description |
| `complete_task` | Mark task as completed        |
| `delete_task`   | Delete a task                 |

## Testing Tools

### Run Unit Tests

```bash
pytest tests/ -v
```

### Run with Coverage

```bash
pytest tests/ --cov=src --cov-report=html
```

## Example Tool Invocations

### add_task

```json
{
  "name": "add_task",
  "arguments": {
    "user_id": "user_123",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread"
  }
}
```

Response:

```json
{
  "task_id": 1,
  "status": "created",
  "title": "Buy groceries"
}
```

### list_tasks

```json
{
  "name": "list_tasks",
  "arguments": {
    "user_id": "user_123",
    "status": "pending"
  }
}
```

Response:

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "created_at": "2026-02-05T12:00:00Z"
    }
  ]
}
```

### complete_task

```json
{
  "name": "complete_task",
  "arguments": {
    "user_id": "user_123",
    "task_id": 1
  }
}
```

Response:

```json
{
  "task_id": 1,
  "status": "completed",
  "title": "Buy groceries"
}
```

## Integration with AI Agents

The MCP server is designed to be invoked by AI agents via the OpenAI Agents SDK. The AI layer extracts `user_id` from JWT authentication and passes it to each tool call.

```
[User] → [AI Agent] → [MCP Server] → [Database]
           ↓
     Tool: add_task
     user_id: from JWT
```

## Architecture

```
mcp-server/
├── src/
│   ├── server.py      # MCP server entry
│   ├── tools/         # Tool implementations
│   ├── models/        # SQLModel schemas
│   ├── db/            # Database connection
│   └── errors/        # Error handling
└── tests/             # Unit tests
```

## Next Steps

1. Implement MCP server (`/sp.tasks` → `/sp.implement`)
2. Integrate with AI Agent layer (Spec-6)
3. Connect to chat endpoint

# MCP Task Server

A stateless MCP (Model Context Protocol) server that exposes deterministic task management tools for AI agents.

## Features

- **5 MCP Tools**: `add_task`, `list_tasks`, `update_task`, `complete_task`, `delete_task`
- **Stateless Design**: No in-memory state between tool invocations
- **User Isolation**: All operations are scoped by `user_id`
- **Deterministic**: Identical inputs produce identical outputs
- **PostgreSQL Backend**: SQLModel with async support

## Prerequisites

- Python 3.11+
- PostgreSQL database (Neon Serverless recommended)
- uv package manager (or pip)

## Setup

### 1. Install Dependencies

```bash
cd mcp-server

# Using uv (recommended)
uv sync

# Or using pip
pip install -e .
```

### 2. Configure Environment

Copy `.env.example` to `.env` and set your database URL:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql+asyncpg://user:password@host/database
```

### 3. Run the Server

```bash
# Using stdio transport (for AI agent integration)
python -m src.server
```

## Available Tools

| Tool            | Description                   | Required Params      |
| --------------- | ----------------------------- | -------------------- |
| `add_task`      | Create a new task             | `user_id`, `title`   |
| `list_tasks`    | List user's tasks             | `user_id`            |
| `update_task`   | Update task title/description | `user_id`, `task_id` |
| `complete_task` | Mark task as completed        | `user_id`, `task_id` |
| `delete_task`   | Delete a task                 | `user_id`, `task_id` |

## Example Tool Calls

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

## Error Codes

| Code                  | Description                     |
| --------------------- | ------------------------------- |
| `AUTH_REQUIRED`       | user_id is missing or empty     |
| `VALIDATION_ERROR`    | Input validation failed         |
| `NOT_FOUND`           | Task not found or access denied |
| `SERVICE_UNAVAILABLE` | Database connection failed      |

## Testing

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=src --cov-report=html
```

## Architecture

```
mcp-server/
├── src/
│   ├── server.py      # MCP server entry point
│   ├── tools/         # MCP tool implementations
│   ├── models/        # SQLModel schemas
│   ├── db/            # Database connection
│   └── errors/        # Error handling
└── tests/             # Unit tests
```

## License

MIT

# Data Model: MCP Server Task Entity

**Feature**: 005-mcp-server-tooling  
**Date**: 2026-02-05  
**Phase**: 1 - Design & Contracts

## Entity: Task

The `Task` entity represents a todo item belonging to a specific authenticated user. All task operations are scoped by `user_id` to ensure strict user isolation.

### Schema Definition

```python
from sqlmodel import SQLModel, Field
from sqlalchemy import func, Column, String, Integer, Boolean, DateTime
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    """
    Task entity for MCP Server.
    All queries MUST be filtered by user_id.
    """
    __tablename__ = "mcp_tasks"

    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, nullable=False, max_length=255)
    title: str = Field(nullable=False, max_length=500)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"server_default": func.now()}
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"server_default": func.now(), "onupdate": func.now()}
    )
```

### Field Specifications

| Field         | Type          | Constraints                    | Notes                     |
| ------------- | ------------- | ------------------------------ | ------------------------- |
| `id`          | INTEGER       | PRIMARY KEY, AUTO INCREMENT    | Unique task identifier    |
| `user_id`     | VARCHAR(255)  | NOT NULL, INDEXED              | Owner identifier from JWT |
| `title`       | VARCHAR(500)  | NOT NULL                       | Task title, required      |
| `description` | VARCHAR(2000) | NULLABLE                       | Optional task details     |
| `completed`   | BOOLEAN       | DEFAULT FALSE                  | Completion status         |
| `created_at`  | TIMESTAMP     | DEFAULT NOW()                  | Auto-set on creation      |
| `updated_at`  | TIMESTAMP     | DEFAULT NOW(), ON UPDATE NOW() | Auto-set on modification  |

### Indexes

```sql
CREATE INDEX idx_mcp_tasks_user_id ON mcp_tasks(user_id);
CREATE INDEX idx_mcp_tasks_user_completed ON mcp_tasks(user_id, completed);
```

### Validation Rules

1. **user_id**: Required, non-empty string
2. **title**: Required, 1-500 characters
3. **description**: Optional, max 2000 characters
4. **completed**: Boolean only

### State Transitions

```
[Created] --> [Active] --> [Completed]
                 |
                 v
            [Deleted]
```

- Tasks start in Active state (completed=false)
- `complete_task` transitions Active → Completed
- `delete_task` removes task from database
- No "uncomplete" operation in MVP

### Query Patterns

All queries MUST include `user_id` filter:

```python
# List all user's tasks
select(Task).where(Task.user_id == user_id)

# List pending tasks
select(Task).where(Task.user_id == user_id, Task.completed == False)

# List completed tasks
select(Task).where(Task.user_id == user_id, Task.completed == True)

# Get single task (validates ownership)
select(Task).where(Task.id == task_id, Task.user_id == user_id)
```

### Database Table

**Note**: Using separate table `mcp_tasks` to avoid conflicts with existing `tasks` table in backend. Both share the same database but are managed by different layers.

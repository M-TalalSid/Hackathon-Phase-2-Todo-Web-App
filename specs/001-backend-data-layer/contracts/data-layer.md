# Data Layer Contracts: Core Backend & Data Layer

**Feature**: `001-backend-data-layer`  
**Date**: 2026-01-13  
**Type**: Internal Repository/Service Contracts (No HTTP API in this spec)

> **Note**: This spec does NOT include HTTP API endpoints. These contracts define the internal data-access layer interface that will be consumed by future API specs.

## Repository Interface

### TaskRepository

The repository pattern encapsulates all database operations for the Task entity.

#### Contract Definition

```python
from abc import ABC, abstractmethod
from typing import Optional
from uuid import UUID

from app.models.task import Task, TaskCreate, TaskUpdate


class ITaskRepository(ABC):
    """Interface for task data access operations"""

    @abstractmethod
    async def create(self, user_id: str, data: TaskCreate) -> Task:
        """
        Create a new task for the specified user.

        Args:
            user_id: Owner's user identifier (required, non-empty)
            data: Task creation data (title required, description/completed optional)

        Returns:
            Created Task with generated id and timestamps

        Raises:
            ValidationError: If user_id is empty or data is invalid
            DatabaseConnectionError: If database is unreachable
        """
        pass

    @abstractmethod
    async def get_by_id(self, user_id: str, task_id: UUID) -> Optional[Task]:
        """
        Get a task by ID, enforcing ownership.

        Args:
            user_id: Owner's user identifier
            task_id: UUID of the task

        Returns:
            Task if found and owned by user, None otherwise

        Notes:
            - Returns None for non-existent tasks
            - Returns None for tasks owned by other users (no error)
        """
        pass

    @abstractmethod
    async def list_by_user(self, user_id: str) -> list[Task]:
        """
        List all tasks for a user.

        Args:
            user_id: Owner's user identifier

        Returns:
            List of tasks owned by user (empty list if none)
        """
        pass

    @abstractmethod
    async def update(self, user_id: str, task_id: UUID, data: TaskUpdate) -> Optional[Task]:
        """
        Update a task, enforcing ownership.

        Args:
            user_id: Owner's user identifier
            task_id: UUID of the task
            data: Fields to update (only non-None fields are applied)

        Returns:
            Updated Task if found and owned, None otherwise

        Notes:
            - Automatically updates `updated_at` timestamp
            - Partial updates supported (only provided fields change)
        """
        pass

    @abstractmethod
    async def delete(self, user_id: str, task_id: UUID) -> bool:
        """
        Delete a task, enforcing ownership.

        Args:
            user_id: Owner's user identifier
            task_id: UUID of the task

        Returns:
            True if task was deleted, False if not found or not owned
        """
        pass
```

## Data Transfer Objects

### TaskCreate

```json
{
  "title": "string (required, 1-255 chars)",
  "description": "string | null (optional)",
  "completed": "boolean (optional, default: false)"
}
```

**Validation**:

- `title`: Required, minimum 1 character, maximum 255 characters
- `description`: Optional, unlimited length
- `completed`: Optional, defaults to `false`

### TaskUpdate

```json
{
  "title": "string | null (optional, 1-255 chars if provided)",
  "description": "string | null (optional)",
  "completed": "boolean | null (optional)"
}
```

**Validation**:

- All fields optional (partial update)
- `title`: If provided, must be 1-255 characters
- Fields set to `null` are not updated (not cleared)

### TaskRead (Response)

```json
{
  "id": "uuid (required)",
  "user_id": "string (required)",
  "title": "string (required)",
  "description": "string | null",
  "completed": "boolean (required)",
  "created_at": "datetime ISO8601 (required)",
  "updated_at": "datetime ISO8601 (required)"
}
```

## Error Contracts

### Exception Hierarchy

```python
class DataLayerError(Exception):
    """Base exception for data layer errors"""
    pass


class TaskNotFoundError(DataLayerError):
    """Task not found or not owned by user"""
    def __init__(self, task_id: UUID, user_id: str):
        self.task_id = task_id
        self.user_id = user_id
        super().__init__(f"Task {task_id} not found for user {user_id}")


class ValidationError(DataLayerError):
    """Input validation failed"""
    def __init__(self, field: str, message: str):
        self.field = field
        self.message = message
        super().__init__(f"Validation error on {field}: {message}")


class DatabaseConnectionError(DataLayerError):
    """Database connection failed"""
    def __init__(self, message: str, original_error: Exception | None = None):
        self.original_error = original_error
        super().__init__(f"Database connection error: {message}")
```

### Error Responses (for future API integration)

| Error Type              | Suggested HTTP Status | Code                  | Message Template                   |
| ----------------------- | --------------------- | --------------------- | ---------------------------------- |
| TaskNotFoundError       | 404                   | `TASK_NOT_FOUND`      | "Task not found"                   |
| ValidationError         | 400                   | `VALIDATION_ERROR`    | "Validation error: {details}"      |
| DatabaseConnectionError | 503                   | `SERVICE_UNAVAILABLE` | "Database temporarily unavailable" |

## Session Management Contract

### Database Session Provider

```python
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession


@asynccontextmanager
async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Provide a database session with automatic cleanup.

    Usage:
        async with get_db_session() as session:
            repo = TaskRepository(session)
            task = await repo.create(user_id, data)

    Guarantees:
        - Session is committed on success
        - Session is rolled back on exception
        - Session is always closed
    """
    session = async_session()
    try:
        yield session
        await session.commit()
    except Exception:
        await session.rollback()
        raise
    finally:
        await session.close()
```

## Verification Contracts

### Schema Verification

```python
async def verify_schema() -> dict:
    """
    Verify database schema matches expected structure.

    Returns:
        {
            "tables": ["tasks"],
            "indexes": ["ix_tasks_user_id"],
            "status": "ok" | "error",
            "errors": []
        }
    """
    pass
```

### Connection Verification

```python
async def verify_connection() -> dict:
    """
    Verify database connection is healthy.

    Returns:
        {
            "connected": true | false,
            "latency_ms": 42,
            "database": "neondb",
            "status": "ok" | "error"
        }
    """
    pass
```

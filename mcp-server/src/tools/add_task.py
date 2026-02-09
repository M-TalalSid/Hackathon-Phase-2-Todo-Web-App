"""
add_task MCP Tool.

Creates a new task for the authenticated user.
"""

from typing import Any

from sqlmodel import select

from src.db import get_async_session
from src.models import Task
from src.errors import (
    AUTH_REQUIRED,
    VALIDATION_ERROR,
    SERVICE_UNAVAILABLE,
    create_error_response,
)


async def add_task(
    user_id: str | None = None,
    title: str | None = None,
    description: str | None = None,
) -> dict[str, Any]:
    """
    Create a new task for the authenticated user.
    
    Args:
        user_id: Authenticated user identifier from JWT.
        title: Task title (required, 1-500 characters).
        description: Optional task description (max 2000 characters).
    
    Returns:
        dict: Success response with task_id, status, and title.
              Error response with error, code, and message on failure.
    
    Example:
        >>> await add_task(user_id="user_123", title="Buy groceries")
        {"task_id": 1, "status": "created", "title": "Buy groceries"}
    """
    # Validate user_id
    if not user_id or not user_id.strip():
        return create_error_response(AUTH_REQUIRED)
    
    # Validate title
    if not title or not title.strip():
        return create_error_response(VALIDATION_ERROR, "title is required")
    
    title = title.strip()
    if len(title) > 500:
        return create_error_response(VALIDATION_ERROR, "title must be 500 characters or less")
    
    # Validate description if provided
    if description is not None:
        description = description.strip() if description else None
        if description and len(description) > 2000:
            return create_error_response(VALIDATION_ERROR, "description must be 2000 characters or less")
    
    try:
        async with get_async_session() as session:
            # Create new task
            task = Task(
                user_id=user_id.strip(),
                title=title,
                description=description,
            )
            session.add(task)
            await session.flush()
            await session.refresh(task)
            
            return {
                "task_id": task.id,
                "status": "created",
                "title": task.title,
            }
    except Exception as e:
        return create_error_response(SERVICE_UNAVAILABLE, str(e))

"""
delete_task MCP Tool.

Deletes a task permanently for the authenticated user.
"""

from typing import Any

from sqlmodel import select

from src.db import get_async_session
from src.models import Task
from src.errors import (
    AUTH_REQUIRED,
    NOT_FOUND,
    SERVICE_UNAVAILABLE,
    create_error_response,
)


async def delete_task(
    user_id: str | None = None,
    task_id: int | None = None,
) -> dict[str, Any]:
    """
    Delete a task permanently.
    
    Args:
        user_id: Authenticated user identifier from JWT.
        task_id: Task identifier to delete.
    
    Returns:
        dict: Success response with task_id, status, and title.
              Error response with error, code, and message on failure.
    
    Example:
        >>> await delete_task(user_id="user_123", task_id=1)
        {"task_id": 1, "status": "deleted", "title": "Buy groceries"}
    """
    # Validate user_id
    if not user_id or not user_id.strip():
        return create_error_response(AUTH_REQUIRED)
    
    user_id = user_id.strip()
    
    # Validate task_id
    if task_id is None:
        return create_error_response(NOT_FOUND, "task_id is required")
    
    try:
        async with get_async_session() as session:
            # Query with user_id filter (CRITICAL: ownership validation)
            query = select(Task).where(
                Task.id == task_id,
                Task.user_id == user_id,
            )
            result = await session.execute(query)
            task = result.scalar_one_or_none()
            
            if not task:
                return create_error_response(NOT_FOUND)
            
            # Store title before deletion for response
            task_title = task.title
            task_id_value = task.id
            
            # Delete the task
            await session.delete(task)
            await session.flush()
            
            return {
                "task_id": task_id_value,
                "status": "deleted",
                "title": task_title,
            }
    except Exception as e:
        return create_error_response(SERVICE_UNAVAILABLE, str(e))

"""
update_task MCP Tool.

Updates task title and/or description for the authenticated user.
"""

from typing import Any

from sqlmodel import select

from src.db import get_async_session
from src.models import Task
from src.errors import (
    AUTH_REQUIRED,
    VALIDATION_ERROR,
    NOT_FOUND,
    SERVICE_UNAVAILABLE,
    create_error_response,
)


async def update_task(
    user_id: str | None = None,
    task_id: int | None = None,
    title: str | None = None,
    description: str | None = None,
) -> dict[str, Any]:
    """
    Update task title and/or description.
    
    Args:
        user_id: Authenticated user identifier from JWT.
        task_id: Task identifier to update.
        title: New task title (optional, 1-500 characters).
        description: New task description (optional, max 2000 characters).
    
    Returns:
        dict: Success response with task_id, status, and title.
              Error response with error, code, and message on failure.
    
    Example:
        >>> await update_task(user_id="user_123", task_id=1, title="Updated title")
        {"task_id": 1, "status": "updated", "title": "Updated title"}
    """
    # Validate user_id
    if not user_id or not user_id.strip():
        return create_error_response(AUTH_REQUIRED)
    
    user_id = user_id.strip()
    
    # Validate task_id
    if task_id is None:
        return create_error_response(NOT_FOUND, "task_id is required")
    
    # Validate that at least one field is being updated
    has_title = title is not None
    has_description = description is not None
    
    if not has_title and not has_description:
        return create_error_response(VALIDATION_ERROR, "At least one of title or description is required")
    
    # Validate title if provided
    if has_title:
        title = title.strip() if title else ""
        if not title:
            return create_error_response(VALIDATION_ERROR, "title cannot be empty")
        if len(title) > 500:
            return create_error_response(VALIDATION_ERROR, "title must be 500 characters or less")
    
    # Validate description if provided
    if has_description and description:
        description = description.strip()
        if len(description) > 2000:
            return create_error_response(VALIDATION_ERROR, "description must be 2000 characters or less")
    
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
            
            # Apply updates
            if has_title:
                task.title = title
            if has_description:
                task.description = description if description else None
            
            session.add(task)
            await session.flush()
            
            return {
                "task_id": task.id,
                "status": "updated",
                "title": task.title,
            }
    except Exception as e:
        return create_error_response(SERVICE_UNAVAILABLE, str(e))

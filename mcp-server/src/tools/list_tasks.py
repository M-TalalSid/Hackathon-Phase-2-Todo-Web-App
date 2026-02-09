"""
list_tasks MCP Tool.

Retrieves tasks belonging to the authenticated user with optional status filter.
"""

from typing import Any

from sqlmodel import select

from src.db import get_async_session
from src.models import Task
from src.errors import (
    AUTH_REQUIRED,
    SERVICE_UNAVAILABLE,
    create_error_response,
)


async def list_tasks(
    user_id: str | None = None,
    status: str = "all",
) -> dict[str, Any]:
    """
    List tasks belonging to the authenticated user.
    
    Args:
        user_id: Authenticated user identifier from JWT.
        status: Filter by completion status ("all", "pending", "completed").
    
    Returns:
        dict: Success response with tasks array.
              Error response with error, code, and message on failure.
    
    Example:
        >>> await list_tasks(user_id="user_123", status="pending")
        {"tasks": [{"id": 1, "title": "Buy groceries", ...}]}
    """
    # Validate user_id
    if not user_id or not user_id.strip():
        return create_error_response(AUTH_REQUIRED)
    
    user_id = user_id.strip()
    
    # Validate status
    valid_statuses = {"all", "pending", "completed"}
    if status not in valid_statuses:
        status = "all"
    
    try:
        async with get_async_session() as session:
            # Build query with user_id filter (CRITICAL: user isolation)
            query = select(Task).where(Task.user_id == user_id)
            
            # Apply status filter
            if status == "pending":
                query = query.where(Task.completed == False)
            elif status == "completed":
                query = query.where(Task.completed == True)
            
            # Order by created_at descending (newest first)
            query = query.order_by(Task.created_at.desc())
            
            result = await session.execute(query)
            tasks = result.scalars().all()
            
            return {
                "tasks": [task.to_dict() for task in tasks],
            }
    except Exception as e:
        return create_error_response(SERVICE_UNAVAILABLE, str(e))

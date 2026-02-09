"""
Task model for MCP Task Server.

Defines the Task entity with user isolation and timestamp management.
"""

from datetime import datetime
from typing import Optional

from sqlalchemy import func
from sqlmodel import Field, SQLModel


class Task(SQLModel, table=True):
    """
    Task entity for MCP Server.
    
    All queries MUST be filtered by user_id to ensure user isolation.
    
    Attributes:
        id: Unique task identifier (auto-generated).
        user_id: Owner identifier from JWT (indexed).
        title: Task title (required, max 500 chars).
        description: Optional task details (max 2000 chars).
        completed: Completion status (default: False).
        created_at: Auto-set on creation (UTC).
        updated_at: Auto-set on creation and modification (UTC).
    """
    
    __tablename__ = "mcp_tasks"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, nullable=False, max_length=255)
    title: str = Field(nullable=False, max_length=500)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"server_default": func.now()},
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"server_default": func.now(), "onupdate": func.now()},
    )
    
    def to_dict(self) -> dict:
        """Convert task to dictionary for MCP response."""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "completed": self.completed,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

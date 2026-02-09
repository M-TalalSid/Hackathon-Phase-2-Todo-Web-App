"""
Database connection management for MCP Task Server.

Provides async database engine and session management with auto-table creation.
"""

import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

# Load environment variables
load_dotenv()

# Database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

# Async engine (created lazily)
_async_engine = None


def get_async_engine():
    """
    Get or create the async database engine.
    
    Returns:
        AsyncEngine: SQLAlchemy async engine instance.
    
    Raises:
        ValueError: If DATABASE_URL is not configured.
    """
    global _async_engine
    
    if _async_engine is None:
        if not DATABASE_URL:
            raise ValueError("DATABASE_URL environment variable is not set")
        
        _async_engine = create_async_engine(
            DATABASE_URL,
            echo=os.getenv("DEBUG", "false").lower() == "true",
            pool_pre_ping=True,
        )
    
    return _async_engine


# Async session factory
def _get_async_session_factory():
    """Create async session factory."""
    return sessionmaker(
        get_async_engine(),
        class_=AsyncSession,
        expire_on_commit=False,
    )


@asynccontextmanager
async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Async context manager for database sessions.
    
    Yields:
        AsyncSession: Database session for executing queries.
    
    Example:
        async with get_async_session() as session:
            result = await session.execute(query)
    """
    async_session_factory = _get_async_session_factory()
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def init_db() -> None:
    """
    Initialize database tables.
    
    Creates all SQLModel tables if they don't exist.
    Called on server startup.
    """
    # Import models to register them with SQLModel
    from src.models.task import Task  # noqa: F401
    
    engine = get_async_engine()
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

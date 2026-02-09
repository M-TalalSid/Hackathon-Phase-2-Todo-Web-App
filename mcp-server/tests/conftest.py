"""
Test fixtures for MCP Task Server tests.
"""

import os
import sys

# Add src to Python path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

from src.models import Task


# Use SQLite for testing (in-memory)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="session")
def event_loop():
    """Create an event loop for async tests."""
    import asyncio
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture
async def async_engine():
    """Create async test database engine."""
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)
    await engine.dispose()


@pytest_asyncio.fixture
async def async_session(async_engine):
    """Create async session for tests."""
    async_session_factory = sessionmaker(
        async_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    async with async_session_factory() as session:
        yield session


@pytest_asyncio.fixture
async def sample_task(async_session):
    """Create a sample task for testing."""
    task = Task(
        user_id="test_user_123",
        title="Test Task",
        description="Test description",
        completed=False,
    )
    async_session.add(task)
    await async_session.commit()
    await async_session.refresh(task)
    return task


@pytest_asyncio.fixture
async def sample_tasks(async_session):
    """Create multiple sample tasks for testing."""
    tasks = [
        Task(user_id="test_user_123", title="Task 1", completed=False),
        Task(user_id="test_user_123", title="Task 2", completed=True),
        Task(user_id="test_user_123", title="Task 3", completed=False),
        Task(user_id="other_user", title="Other User Task", completed=False),
    ]
    for task in tasks:
        async_session.add(task)
    await async_session.commit()
    for task in tasks:
        await async_session.refresh(task)
    return tasks

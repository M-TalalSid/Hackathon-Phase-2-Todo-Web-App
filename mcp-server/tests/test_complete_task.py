"""
Tests for complete_task MCP tool.
"""

import pytest

from src.tools.complete_task import complete_task
from src.errors import AUTH_REQUIRED, NOT_FOUND


class TestCompleteTask:
    """Tests for complete_task tool."""
    
    @pytest.mark.asyncio
    async def test_complete_task_missing_user_id(self):
        """Test that missing user_id returns AUTH_REQUIRED error."""
        result = await complete_task(user_id=None, task_id=1)
        
        assert result["error"] is True
        assert result["code"] == AUTH_REQUIRED
    
    @pytest.mark.asyncio
    async def test_complete_task_empty_user_id(self):
        """Test that empty user_id returns AUTH_REQUIRED error."""
        result = await complete_task(user_id="", task_id=1)
        
        assert result["error"] is True
        assert result["code"] == AUTH_REQUIRED
    
    @pytest.mark.asyncio
    async def test_complete_task_whitespace_user_id(self):
        """Test that whitespace-only user_id returns AUTH_REQUIRED error."""
        result = await complete_task(user_id="   ", task_id=1)
        
        assert result["error"] is True
        assert result["code"] == AUTH_REQUIRED
    
    @pytest.mark.asyncio
    async def test_complete_task_missing_task_id(self):
        """Test that missing task_id returns NOT_FOUND error."""
        result = await complete_task(user_id="user_123", task_id=None)
        
        assert result["error"] is True
        assert result["code"] == NOT_FOUND
        assert "task_id" in result["message"].lower()

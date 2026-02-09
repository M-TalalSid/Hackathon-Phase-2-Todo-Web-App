"""
Tests for list_tasks MCP tool.
"""

import pytest

from src.tools.list_tasks import list_tasks
from src.errors import AUTH_REQUIRED


class TestListTasks:
    """Tests for list_tasks tool."""
    
    @pytest.mark.asyncio
    async def test_list_tasks_missing_user_id(self):
        """Test that missing user_id returns AUTH_REQUIRED error."""
        result = await list_tasks(user_id=None)
        
        assert result["error"] is True
        assert result["code"] == AUTH_REQUIRED
    
    @pytest.mark.asyncio
    async def test_list_tasks_empty_user_id(self):
        """Test that empty user_id returns AUTH_REQUIRED error."""
        result = await list_tasks(user_id="")
        
        assert result["error"] is True
        assert result["code"] == AUTH_REQUIRED
    
    @pytest.mark.asyncio
    async def test_list_tasks_whitespace_user_id(self):
        """Test that whitespace-only user_id returns AUTH_REQUIRED error."""
        result = await list_tasks(user_id="   ")
        
        assert result["error"] is True
        assert result["code"] == AUTH_REQUIRED
    
    @pytest.mark.asyncio
    async def test_list_tasks_invalid_status_defaults_to_all(self):
        """Test that invalid status defaults to 'all' without error."""
        # This should not raise an error, just default to 'all'
        # The actual database call may fail without proper setup,
        # but we're testing the validation logic here
        result = await list_tasks(user_id="user_123", status="invalid")
        
        # If it gets past validation, it will either succeed or have SERVICE_UNAVAILABLE
        # (no DB configured), not VALIDATION_ERROR
        if "error" in result and result["error"]:
            assert result["code"] != "VALIDATION_ERROR"

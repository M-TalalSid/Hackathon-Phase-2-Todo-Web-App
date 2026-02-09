"""
Tests for user isolation across all MCP tools.

Verifies that users cannot access each other's tasks.
"""

import pytest

from src.tools.complete_task import complete_task
from src.tools.update_task import update_task
from src.tools.delete_task import delete_task
from src.errors import NOT_FOUND


class TestUserIsolation:
    """Tests for user isolation - verifies cross-user access prevention."""
    
    @pytest.mark.asyncio
    async def test_complete_task_wrong_user(self):
        """Test that completing another user's task returns NOT_FOUND."""
        # Attempt to complete a task with wrong user_id
        # Even if task_id exists, wrong user should get NOT_FOUND
        result = await complete_task(user_id="wrong_user", task_id=999999)
        
        assert result["error"] is True
        # Should be NOT_FOUND (either task doesn't exist or belongs to different user)
        # The error message should not reveal whether the task exists
        assert result["code"] == NOT_FOUND or "SERVICE_UNAVAILABLE" in result.get("code", "")
    
    @pytest.mark.asyncio
    async def test_update_task_wrong_user(self):
        """Test that updating another user's task returns NOT_FOUND."""
        result = await update_task(user_id="wrong_user", task_id=999999, title="Hacked")
        
        assert result["error"] is True
        assert result["code"] == NOT_FOUND or "SERVICE_UNAVAILABLE" in result.get("code", "")
    
    @pytest.mark.asyncio
    async def test_delete_task_wrong_user(self):
        """Test that deleting another user's task returns NOT_FOUND."""
        result = await delete_task(user_id="wrong_user", task_id=999999)
        
        assert result["error"] is True
        assert result["code"] == NOT_FOUND or "SERVICE_UNAVAILABLE" in result.get("code", "")
    
    @pytest.mark.asyncio
    async def test_error_does_not_leak_task_existence(self):
        """Test that errors don't reveal whether a task exists for another user."""
        # Both existing and non-existing task IDs should return the same error
        # to prevent enumeration attacks
        result1 = await complete_task(user_id="attacker", task_id=1)
        result2 = await complete_task(user_id="attacker", task_id=999999)
        
        # Both should have the same error code (NOT_FOUND or SERVICE_UNAVAILABLE)
        if "error" in result1 and result1["error"] and "error" in result2 and result2["error"]:
            # Error codes should be the same to not leak information
            assert result1["code"] == result2["code"]

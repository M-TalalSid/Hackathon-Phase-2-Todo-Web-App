"""
Tests for update_task MCP tool.
"""

import pytest

from src.tools.update_task import update_task
from src.errors import AUTH_REQUIRED, VALIDATION_ERROR, NOT_FOUND


class TestUpdateTask:
    """Tests for update_task tool."""
    
    @pytest.mark.asyncio
    async def test_update_task_missing_user_id(self):
        """Test that missing user_id returns AUTH_REQUIRED error."""
        result = await update_task(user_id=None, task_id=1, title="New Title")
        
        assert result["error"] is True
        assert result["code"] == AUTH_REQUIRED
    
    @pytest.mark.asyncio
    async def test_update_task_empty_user_id(self):
        """Test that empty user_id returns AUTH_REQUIRED error."""
        result = await update_task(user_id="", task_id=1, title="New Title")
        
        assert result["error"] is True
        assert result["code"] == AUTH_REQUIRED
    
    @pytest.mark.asyncio
    async def test_update_task_missing_task_id(self):
        """Test that missing task_id returns NOT_FOUND error."""
        result = await update_task(user_id="user_123", task_id=None, title="New Title")
        
        assert result["error"] is True
        assert result["code"] == NOT_FOUND
    
    @pytest.mark.asyncio
    async def test_update_task_no_fields_to_update(self):
        """Test that no title or description returns VALIDATION_ERROR."""
        result = await update_task(user_id="user_123", task_id=1)
        
        assert result["error"] is True
        assert result["code"] == VALIDATION_ERROR
        assert "title" in result["message"].lower() or "description" in result["message"].lower()
    
    @pytest.mark.asyncio
    async def test_update_task_empty_title(self):
        """Test that empty title returns VALIDATION_ERROR."""
        result = await update_task(user_id="user_123", task_id=1, title="")
        
        assert result["error"] is True
        assert result["code"] == VALIDATION_ERROR
    
    @pytest.mark.asyncio
    async def test_update_task_title_too_long(self):
        """Test that title over 500 chars returns VALIDATION_ERROR."""
        long_title = "x" * 501
        result = await update_task(user_id="user_123", task_id=1, title=long_title)
        
        assert result["error"] is True
        assert result["code"] == VALIDATION_ERROR
        assert "500" in result["message"]
    
    @pytest.mark.asyncio
    async def test_update_task_description_too_long(self):
        """Test that description over 2000 chars returns VALIDATION_ERROR."""
        long_desc = "x" * 2001
        result = await update_task(user_id="user_123", task_id=1, description=long_desc)
        
        assert result["error"] is True
        assert result["code"] == VALIDATION_ERROR
        assert "2000" in result["message"]

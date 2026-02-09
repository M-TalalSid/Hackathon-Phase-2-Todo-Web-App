"""
Tests for add_task MCP tool.
"""

import pytest

from src.tools.add_task import add_task
from src.errors import AUTH_REQUIRED, VALIDATION_ERROR


class TestAddTask:
    """Tests for add_task tool."""
    
    @pytest.mark.asyncio
    async def test_add_task_missing_user_id(self):
        """Test that missing user_id returns AUTH_REQUIRED error."""
        result = await add_task(user_id=None, title="Test Task")
        
        assert result["error"] is True
        assert result["code"] == AUTH_REQUIRED
    
    @pytest.mark.asyncio
    async def test_add_task_empty_user_id(self):
        """Test that empty user_id returns AUTH_REQUIRED error."""
        result = await add_task(user_id="", title="Test Task")
        
        assert result["error"] is True
        assert result["code"] == AUTH_REQUIRED
    
    @pytest.mark.asyncio
    async def test_add_task_whitespace_user_id(self):
        """Test that whitespace-only user_id returns AUTH_REQUIRED error."""
        result = await add_task(user_id="   ", title="Test Task")
        
        assert result["error"] is True
        assert result["code"] == AUTH_REQUIRED
    
    @pytest.mark.asyncio
    async def test_add_task_missing_title(self):
        """Test that missing title returns VALIDATION_ERROR."""
        result = await add_task(user_id="user_123", title=None)
        
        assert result["error"] is True
        assert result["code"] == VALIDATION_ERROR
        assert "title" in result["message"].lower()
    
    @pytest.mark.asyncio
    async def test_add_task_empty_title(self):
        """Test that empty title returns VALIDATION_ERROR."""
        result = await add_task(user_id="user_123", title="")
        
        assert result["error"] is True
        assert result["code"] == VALIDATION_ERROR
    
    @pytest.mark.asyncio
    async def test_add_task_title_too_long(self):
        """Test that title over 500 chars returns VALIDATION_ERROR."""
        long_title = "x" * 501
        result = await add_task(user_id="user_123", title=long_title)
        
        assert result["error"] is True
        assert result["code"] == VALIDATION_ERROR
        assert "500" in result["message"]
    
    @pytest.mark.asyncio
    async def test_add_task_description_too_long(self):
        """Test that description over 2000 chars returns VALIDATION_ERROR."""
        long_desc = "x" * 2001
        result = await add_task(user_id="user_123", title="Test", description=long_desc)
        
        assert result["error"] is True
        assert result["code"] == VALIDATION_ERROR
        assert "2000" in result["message"]

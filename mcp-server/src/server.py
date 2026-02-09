"""
MCP Task Server Entry Point.

Implements the MCP server with tool registration for task management.
"""

import asyncio
import logging
from typing import Any

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

from src.db import init_db

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create MCP server instance
server = Server("task-tools")


# Tool definitions
TOOLS = [
    Tool(
        name="add_task",
        description="Create a new task for the authenticated user",
        inputSchema={
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "Authenticated user identifier from JWT",
                    "minLength": 1,
                },
                "title": {
                    "type": "string",
                    "description": "Task title",
                    "minLength": 1,
                    "maxLength": 500,
                },
                "description": {
                    "type": "string",
                    "description": "Optional task description",
                    "maxLength": 2000,
                },
            },
            "required": ["user_id", "title"],
        },
    ),
    Tool(
        name="list_tasks",
        description="List tasks belonging to the authenticated user",
        inputSchema={
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "Authenticated user identifier from JWT",
                    "minLength": 1,
                },
                "status": {
                    "type": "string",
                    "description": "Filter by completion status",
                    "enum": ["all", "pending", "completed"],
                    "default": "all",
                },
            },
            "required": ["user_id"],
        },
    ),
    Tool(
        name="update_task",
        description="Update task title and/or description",
        inputSchema={
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "Authenticated user identifier from JWT",
                    "minLength": 1,
                },
                "task_id": {
                    "type": "integer",
                    "description": "Task identifier to update",
                },
                "title": {
                    "type": "string",
                    "description": "New task title",
                    "minLength": 1,
                    "maxLength": 500,
                },
                "description": {
                    "type": "string",
                    "description": "New task description",
                    "maxLength": 2000,
                },
            },
            "required": ["user_id", "task_id"],
        },
    ),
    Tool(
        name="complete_task",
        description="Mark a task as completed",
        inputSchema={
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "Authenticated user identifier from JWT",
                    "minLength": 1,
                },
                "task_id": {
                    "type": "integer",
                    "description": "Task identifier to complete",
                },
            },
            "required": ["user_id", "task_id"],
        },
    ),
    Tool(
        name="delete_task",
        description="Delete a task permanently",
        inputSchema={
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "Authenticated user identifier from JWT",
                    "minLength": 1,
                },
                "task_id": {
                    "type": "integer",
                    "description": "Task identifier to delete",
                },
            },
            "required": ["user_id", "task_id"],
        },
    ),
]


@server.list_tools()
async def list_tools() -> list[Tool]:
    """Return the list of available MCP tools."""
    return TOOLS


@server.call_tool()
async def call_tool(name: str, arguments: dict[str, Any]) -> list[TextContent]:
    """
    Handle MCP tool invocations.
    
    Routes tool calls to their respective handlers and returns results.
    """
    import json
    
    # Import tool handlers
    from src.tools.add_task import add_task
    from src.tools.list_tasks import list_tasks
    from src.tools.update_task import update_task
    from src.tools.complete_task import complete_task
    from src.tools.delete_task import delete_task
    
    # Route to appropriate handler
    handlers = {
        "add_task": add_task,
        "list_tasks": list_tasks,
        "update_task": update_task,
        "complete_task": complete_task,
        "delete_task": delete_task,
    }
    
    handler = handlers.get(name)
    if not handler:
        result = {"error": True, "code": "INVALID_INPUT", "message": f"Unknown tool: {name}"}
    else:
        result = await handler(**arguments)
    
    return [TextContent(type="text", text=json.dumps(result))]


async def main():
    """Run the MCP server with stdio transport."""
    logger.info("Initializing database...")
    await init_db()
    logger.info("Database initialized successfully")
    
    logger.info("Starting MCP Task Server...")
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())


if __name__ == "__main__":
    asyncio.run(main())

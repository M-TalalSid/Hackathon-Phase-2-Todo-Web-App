"""
Error codes for MCP Task Server.

Defines standardized error codes and response format for all MCP tools.
"""

from typing import Any

# Error codes
AUTH_REQUIRED = "AUTH_REQUIRED"
VALIDATION_ERROR = "VALIDATION_ERROR"
NOT_FOUND = "NOT_FOUND"
INVALID_INPUT = "INVALID_INPUT"
SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"


# Error messages
ERROR_MESSAGES = {
    AUTH_REQUIRED: "user_id is required for this operation",
    VALIDATION_ERROR: "Input validation failed",
    NOT_FOUND: "Task not found or access denied",
    INVALID_INPUT: "Invalid input format",
    SERVICE_UNAVAILABLE: "Database connection failed",
}


def create_error_response(code: str, message: str | None = None) -> dict[str, Any]:
    """
    Create a standardized error response for MCP tools.
    
    Args:
        code: Error code (AUTH_REQUIRED, VALIDATION_ERROR, etc.)
        message: Optional custom error message. If not provided, uses default.
    
    Returns:
        dict: Error response in format {error: True, code: str, message: str}
    
    Example:
        >>> create_error_response(AUTH_REQUIRED)
        {"error": True, "code": "AUTH_REQUIRED", "message": "user_id is required..."}
        
        >>> create_error_response(VALIDATION_ERROR, "Title must be 1-500 characters")
        {"error": True, "code": "VALIDATION_ERROR", "message": "Title must be..."}
    """
    return {
        "error": True,
        "code": code,
        "message": message or ERROR_MESSAGES.get(code, "An error occurred"),
    }

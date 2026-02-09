"""
Errors package for MCP Task Server.
"""

from src.errors.codes import (
    AUTH_REQUIRED,
    INVALID_INPUT,
    NOT_FOUND,
    SERVICE_UNAVAILABLE,
    VALIDATION_ERROR,
    create_error_response,
)

__all__ = [
    "AUTH_REQUIRED",
    "VALIDATION_ERROR",
    "NOT_FOUND",
    "INVALID_INPUT",
    "SERVICE_UNAVAILABLE",
    "create_error_response",
]

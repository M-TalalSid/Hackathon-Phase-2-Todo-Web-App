# MCP Tool Contracts

**Feature**: 005-mcp-server-tooling  
**Date**: 2026-02-05  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the formal contracts for all MCP tools exposed by the Task MCP Server. Each tool follows the MCP protocol specification with explicit input/output schemas.

---

## Tool: add_task

**Purpose**: Create a new task for the authenticated user.

### Input Schema

```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "Authenticated user identifier from JWT",
      "minLength": 1
    },
    "title": {
      "type": "string",
      "description": "Task title",
      "minLength": 1,
      "maxLength": 500
    },
    "description": {
      "type": "string",
      "description": "Optional task description",
      "maxLength": 2000
    }
  },
  "required": ["user_id", "title"]
}
```

### Output Schema (Success)

```json
{
  "type": "object",
  "properties": {
    "task_id": { "type": "integer" },
    "status": { "type": "string", "const": "created" },
    "title": { "type": "string" }
  },
  "required": ["task_id", "status", "title"]
}
```

### Output Schema (Error)

```json
{
  "type": "object",
  "properties": {
    "error": { "type": "boolean", "const": true },
    "code": {
      "type": "string",
      "enum": ["AUTH_REQUIRED", "VALIDATION_ERROR", "SERVICE_UNAVAILABLE"]
    },
    "message": { "type": "string" }
  },
  "required": ["error", "code", "message"]
}
```

---

## Tool: list_tasks

**Purpose**: Retrieve tasks belonging to the authenticated user.

### Input Schema

```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "Authenticated user identifier from JWT",
      "minLength": 1
    },
    "status": {
      "type": "string",
      "description": "Filter by completion status",
      "enum": ["all", "pending", "completed"],
      "default": "all"
    }
  },
  "required": ["user_id"]
}
```

### Output Schema (Success)

```json
{
  "type": "object",
  "properties": {
    "tasks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "integer" },
          "title": { "type": "string" },
          "description": { "type": "string", "nullable": true },
          "completed": { "type": "boolean" },
          "created_at": { "type": "string", "format": "date-time" }
        },
        "required": ["id", "title", "completed", "created_at"]
      }
    }
  },
  "required": ["tasks"]
}
```

### Output Schema (Error)

```json
{
  "type": "object",
  "properties": {
    "error": { "type": "boolean", "const": true },
    "code": {
      "type": "string",
      "enum": ["AUTH_REQUIRED", "SERVICE_UNAVAILABLE"]
    },
    "message": { "type": "string" }
  },
  "required": ["error", "code", "message"]
}
```

---

## Tool: update_task

**Purpose**: Update task title and/or description.

### Input Schema

```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "Authenticated user identifier from JWT",
      "minLength": 1
    },
    "task_id": {
      "type": "integer",
      "description": "Task identifier to update"
    },
    "title": {
      "type": "string",
      "description": "New task title",
      "minLength": 1,
      "maxLength": 500
    },
    "description": {
      "type": "string",
      "description": "New task description",
      "maxLength": 2000
    }
  },
  "required": ["user_id", "task_id"],
  "anyOf": [{ "required": ["title"] }, { "required": ["description"] }]
}
```

### Output Schema (Success)

```json
{
  "type": "object",
  "properties": {
    "task_id": { "type": "integer" },
    "status": { "type": "string", "const": "updated" },
    "title": { "type": "string" }
  },
  "required": ["task_id", "status", "title"]
}
```

### Output Schema (Error)

```json
{
  "type": "object",
  "properties": {
    "error": { "type": "boolean", "const": true },
    "code": {
      "type": "string",
      "enum": [
        "AUTH_REQUIRED",
        "VALIDATION_ERROR",
        "NOT_FOUND",
        "SERVICE_UNAVAILABLE"
      ]
    },
    "message": { "type": "string" }
  },
  "required": ["error", "code", "message"]
}
```

---

## Tool: complete_task

**Purpose**: Mark a task as completed.

### Input Schema

```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "Authenticated user identifier from JWT",
      "minLength": 1
    },
    "task_id": {
      "type": "integer",
      "description": "Task identifier to complete"
    }
  },
  "required": ["user_id", "task_id"]
}
```

### Output Schema (Success)

```json
{
  "type": "object",
  "properties": {
    "task_id": { "type": "integer" },
    "status": { "type": "string", "const": "completed" },
    "title": { "type": "string" }
  },
  "required": ["task_id", "status", "title"]
}
```

### Output Schema (Error)

```json
{
  "type": "object",
  "properties": {
    "error": { "type": "boolean", "const": true },
    "code": {
      "type": "string",
      "enum": ["AUTH_REQUIRED", "NOT_FOUND", "SERVICE_UNAVAILABLE"]
    },
    "message": { "type": "string" }
  },
  "required": ["error", "code", "message"]
}
```

---

## Tool: delete_task

**Purpose**: Delete a task permanently.

### Input Schema

```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "Authenticated user identifier from JWT",
      "minLength": 1
    },
    "task_id": {
      "type": "integer",
      "description": "Task identifier to delete"
    }
  },
  "required": ["user_id", "task_id"]
}
```

### Output Schema (Success)

```json
{
  "type": "object",
  "properties": {
    "task_id": { "type": "integer" },
    "status": { "type": "string", "const": "deleted" },
    "title": { "type": "string" }
  },
  "required": ["task_id", "status", "title"]
}
```

### Output Schema (Error)

```json
{
  "type": "object",
  "properties": {
    "error": { "type": "boolean", "const": true },
    "code": {
      "type": "string",
      "enum": ["AUTH_REQUIRED", "NOT_FOUND", "SERVICE_UNAVAILABLE"]
    },
    "message": { "type": "string" }
  },
  "required": ["error", "code", "message"]
}
```

---

## Error Codes Reference

| Code                  | Description                                     | When Returned                                      |
| --------------------- | ----------------------------------------------- | -------------------------------------------------- |
| `AUTH_REQUIRED`       | user_id is missing or empty                     | Any tool with missing user_id                      |
| `VALIDATION_ERROR`    | Input fails validation                          | add_task (missing title), update_task (no changes) |
| `NOT_FOUND`           | Task doesn't exist or belongs to different user | update_task, complete_task, delete_task            |
| `INVALID_INPUT`       | Malformed JSON or unrecognized parameters       | Any tool                                           |
| `SERVICE_UNAVAILABLE` | Database connection failed                      | Any tool                                           |

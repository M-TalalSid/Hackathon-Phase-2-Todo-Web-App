# Data Model: AI Agent Behavior & Tool-Oriented Reasoning

**Feature**: 006-ai-agent-reasoning  
**Date**: 2026-02-05  
**Purpose**: Define data structures for AI Agent layer

---

## Overview

The AI Agent layer is primarily a **reasoning layer** that processes natural language and invokes MCP tools. It does not own persistent data - all task data is managed by the MCP Tool layer (Spec-005).

This document defines the **internal data structures** used within the agent layer for request processing.

---

## Agent Request Model

### AgentRequest

Represents an incoming request to the AI agent.

| Field                  | Type                  | Required | Description                              |
| ---------------------- | --------------------- | -------- | ---------------------------------------- |
| `user_id`              | string                | Yes      | Authenticated user identifier (from JWT) |
| `message`              | string                | Yes      | User's natural language input            |
| `conversation_history` | ConversationMessage[] | Yes      | Previous messages for context            |
| `request_id`           | string                | Yes      | Unique identifier for tracing            |

### ConversationMessage

Represents a single message in conversation history.

| Field       | Type     | Required | Description           |
| ----------- | -------- | -------- | --------------------- | ----------- |
| `role`      | enum     | Yes      | "user"                | "assistant" |
| `content`   | string   | Yes      | Message content       |
| `timestamp` | datetime | No       | When message was sent |

---

## Agent Response Model

### AgentResponse

Represents the agent's output after processing.

| Field        | Type       | Required | Description                              |
| ------------ | ---------- | -------- | ---------------------------------------- |
| `message`    | string     | Yes      | Human-readable response to user          |
| `tool_calls` | ToolCall[] | No       | Tools invoked during processing          |
| `success`    | boolean    | Yes      | Whether request was handled successfully |
| `request_id` | string     | Yes      | Echo of request ID for tracing           |

### ToolCall

Represents a single MCP tool invocation.

| Field        | Type    | Required | Description                 |
| ------------ | ------- | -------- | --------------------------- |
| `tool_name`  | string  | Yes      | Name of MCP tool called     |
| `parameters` | object  | Yes      | Parameters passed to tool   |
| `result`     | object  | Yes      | Tool response               |
| `success`    | boolean | Yes      | Whether tool call succeeded |

---

## Intent Model

### UserIntent

Represents classified user intent.

| Value           | MCP Tool      | Trigger Keywords                         |
| --------------- | ------------- | ---------------------------------------- |
| `CREATE_TASK`   | add_task      | add, create, remember, note, remind      |
| `LIST_TASKS`    | list_tasks    | show, list, what are, pending, completed |
| `COMPLETE_TASK` | complete_task | done, complete, finished, mark           |
| `UPDATE_TASK`   | update_task   | update, change, rename, edit             |
| `DELETE_TASK`   | delete_task   | delete, remove, cancel                   |
| `CLARIFY`       | none          | (ambiguous input)                        |
| `UNKNOWN`       | none          | (unsupported action)                     |

---

## State Transitions

The agent is **stateless** - no persistent state is maintained between requests.

Each request follows this flow:

```text
Request Received
     │
     ▼
Parse Message + History
     │
     ▼
Classify Intent ──────► CLARIFY → Ask Question
     │
     ▼
Extract Parameters ───► Missing → Ask for Details
     │
     ▼
Invoke MCP Tool ──────► Error → Translate to Message
     │
     ▼
Generate Confirmation
     │
     ▼
Return Response
```

---

## Validation Rules

### AgentRequest Validation

- `user_id` MUST be non-empty string
- `message` MUST be non-empty string, max 2000 characters
- `conversation_history` MUST be array (can be empty for first message)
- `request_id` MUST be valid UUID

### Intent Classification

- Single intent per request (no multi-action processing)
- Ambiguous requests trigger clarification, not guessing
- Unsupported actions return helpful guidance

---

## No Persistent Entities

The AI Agent layer does **NOT** own any persistent entities:

- Tasks are stored in MCP layer (Spec-005)
- Conversation history is managed by Chat API (Spec-007)
- User data is managed by Auth layer (Spec-002)

The agent operates purely on **transient request/response data**.

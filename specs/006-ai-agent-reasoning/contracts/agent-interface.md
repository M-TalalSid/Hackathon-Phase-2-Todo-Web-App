# Agent Interface Contract

**Version**: 1.0.0  
**Feature**: 006-ai-agent-reasoning

---

## Agent Entry Point

### Function Signature

```python
async def process_message(
    user_id: str,
    message: str,
    conversation_history: list[dict],
    request_id: str = None
) -> AgentResponse
```

### Parameters

| Parameter              | Type       | Required | Description                                        |
| ---------------------- | ---------- | -------- | -------------------------------------------------- |
| `user_id`              | str        | Yes      | Authenticated user ID from JWT                     |
| `message`              | str        | Yes      | User's natural language input                      |
| `conversation_history` | list[dict] | Yes      | Previous messages                                  |
| `request_id`           | str        | No       | Unique request ID (auto-generated if not provided) |

### Returns

```python
@dataclass
class AgentResponse:
    message: str           # Human-readable response
    success: bool          # Whether request succeeded
    tool_calls: list[dict] # Tools invoked (for auditing)
    request_id: str        # Request identifier
```

---

## Conversation History Format

Each message in `conversation_history`:

```json
{
  "role": "user" | "assistant",
  "content": "message text"
}
```

---

## Example Usage

### Create Task

**Input**:

```python
await process_message(
    user_id="user_123",
    message="Add a task to buy groceries",
    conversation_history=[]
)
```

**Output**:

```python
AgentResponse(
    message="Task 'Buy groceries' has been added to your list.",
    success=True,
    tool_calls=[{
        "tool_name": "add_task",
        "parameters": {"user_id": "user_123", "title": "Buy groceries"},
        "result": {"error": False, "task": {...}}
    }],
    request_id="abc-123"
)
```

### List Tasks

**Input**:

```python
await process_message(
    user_id="user_123",
    message="Show my pending tasks",
    conversation_history=[]
)
```

**Output**:

```python
AgentResponse(
    message="Here are your pending tasks:\n1. Buy groceries\n2. Call mom",
    success=True,
    tool_calls=[{
        "tool_name": "list_tasks",
        "parameters": {"user_id": "user_123", "status": "pending"},
        "result": {"error": False, "tasks": [...]}
    }],
    request_id="abc-124"
)
```

### Ambiguous Input

**Input**:

```python
await process_message(
    user_id="user_123",
    message="Delete the meeting task",
    conversation_history=[]
)
```

**Output**:

```python
AgentResponse(
    message="I found multiple tasks that might match. Which one would you like to delete?",
    success=True,
    tool_calls=[],  # No tool called - clarification needed
    request_id="abc-125"
)
```

---

## Error Responses

When MCP tool returns an error:

```python
AgentResponse(
    message="I couldn't find that task. Would you like to see your task list?",
    success=False,
    tool_calls=[{
        "tool_name": "complete_task",
        "parameters": {"user_id": "user_123", "task_id": 999},
        "result": {"error": True, "code": "NOT_FOUND", "message": "..."}
    }],
    request_id="abc-126"
)
```

---

## Guarantees

1. **Stateless**: No state stored between calls
2. **Deterministic**: Identical inputs → identical outputs
3. **Tool-only mutations**: All task changes via MCP tools
4. **User isolation**: user_id enforced on all operations
5. **Auditable**: All tool calls logged in response
